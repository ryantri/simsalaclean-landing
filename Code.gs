/**
 * Simsalaclean Early Access Lead Collection
 * Google Apps Script Web App - Backend Handler
 * 
 * Purpose: Receive form submissions from landing page and save to Google Sheets
 * Security: Validates input, sanitizes against injection, uses LockService
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const SHEET_NAME = 'Leads';
const LOCK_TIMEOUT_MS = 30000; // 30 seconds lock timeout

// ============================================
// MAIN ENTRY POINTS
// ============================================

/**
 * Main entry point for POST requests to this Web App
 * Handles form submissions from landing page
 * 
 * @param {Object} e - Request event from Apps Script
 * @returns {ContentService.TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Parse and validate request
    const payload = parseRequest(e);
    
    // Validate and sanitize input data
    const validatedData = validateAndSanitize(payload);
    
    // Create timestamp on server side
    const timestamp = new Date();
    
    // Save to Google Sheets
    const saveResult = saveToSheet(timestamp, validatedData);
    
    // Return success response with CORS headers
    return createResponse(true, 'Lead berhasil disimpan.');
    
  } catch (error) {
    // Log error for debugging (not sent to client)
    Logger.log('Error in doPost: ' + error.toString());
    
    // Return error response without exposing details
    return createResponse(false, 'Data belum dapat disimpan.');
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 * Required for cross-origin POST requests
 */
function doOptions(e) {
  return ContentService
    .createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * doGet - Handle GET requests (for Web App verification)
 * Returns a simple confirmation message
 * 
 * @param {Object} e - Request event from Apps Script
 * @returns {ContentService.TextOutput} HTML response
 */
function doGet(e) {
  return ContentService
    .createTextOutput('<h1>Simsalaclean Early Access API</h1>')
    .setMimeType(ContentService.MimeType.HTML);
}

// ============================================
// REQUEST PARSING & VALIDATION
// ============================================

/**
 * Parse incoming request payload safely
 * Handles empty body, invalid JSON, malformed data
 * 
 * @param {Object} e - Request event
 * @returns {Object} Parsed payload object
 * @throws {Error} If payload is invalid
 */
function parseRequest(e) {
  // Check if postData exists
  if (!e || !e.postData) {
    throw new Error('No request body provided');
  }
  
  // Get the raw payload
  const rawPayload = e.postData.contents;
  
  // Check if payload is empty
  if (!rawPayload || rawPayload.trim() === '') {
    throw new Error('Empty request body');
  }
  
  let payload;
  try {
    // Parse JSON
    payload = JSON.parse(rawPayload);
  } catch (parseError) {
    throw new Error('Invalid JSON format');
  }
  
  // Validate payload is an object
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Payload must be a JSON object');
  }
  
  return payload;
}

/**
 * Validate and sanitize input data
 * Checks required fields, data types, and content
 * Sanitizes against formula injection
 * 
 * @param {Object} payload - Raw payload object
 * @returns {Object} Validated and sanitized data
 * @throws {Error} If validation fails
 */
function validateAndSanitize(payload) {
  // Extract fields
  const fullName = payload.fullName;
  const instagramUsername = payload.instagramUsername;
  
  // Validate Full Name exists
  if (fullName === undefined || fullName === null) {
    throw new Error('Full Name is required');
  }
  
  // Validate Instagram Username exists
  if (instagramUsername === undefined || instagramUsername === null) {
    throw new Error('Instagram Username is required');
  }
  
  // Validate types are strings
  if (typeof fullName !== 'string') {
    throw new Error('Full Name must be a string');
  }
  
  if (typeof instagramUsername !== 'string') {
    throw new Error('Instagram Username must be a string');
  }
  
  // Trim whitespace
  const trimmedName = fullName.trim();
  const trimmedUsername = instagramUsername.trim();
  
  // Validate non-empty after trimming
  if (trimmedName.length === 0) {
    throw new Error('Full Name cannot be empty');
  }
  
  if (trimmedUsername.length === 0) {
    throw new Error('Instagram Username cannot be empty');
  }
  
  // Validate length constraints
  if (trimmedName.length < 2) {
    throw new Error('Full Name too short');
  }
  
  if (trimmedName.length > 100) {
    throw new Error('Full Name too long');
  }
  
  // Normalize Instagram username (remove @ if present)
  let normalizedUsername = trimmedUsername;
  if (normalizedUsername.startsWith('@')) {
    normalizedUsername = normalizedUsername.substring(1);
  }
  
  // Validate Instagram username after normalization
  if (normalizedUsername.length === 0) {
    throw new Error('Instagram Username cannot be just @');
  }
  
  if (normalizedUsername.length > 30) {
    throw new Error('Instagram Username too long');
  }
  
  // Validate Instagram username character set
  // Only allow: alphanumeric, underscore, dot
  if (!/^[a-zA-Z0-9_.]+$/.test(normalizedUsername)) {
    throw new Error('Instagram Username contains invalid characters');
  }
  
  // Sanitize against formula injection
  const sanitizedName = sanitizeForFormula(trimmedName);
  const sanitizedUsername = sanitizeForFormula(normalizedUsername);
  
  return {
    fullName: sanitizedName,
    instagramUsername: sanitizedUsername
  };
}

/**
 * Sanitize string to prevent spreadsheet formula injection
 * Prepends single quote to formulas
 * 
 * @param {String} value - Value to sanitize
 * @returns {String} Sanitized value
 */
function sanitizeForFormula(value) {
  if (!value || typeof value !== 'string') {
    return value;
  }
  
  // Check if value starts with formula characters
  const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
  
  for (let char of formulaChars) {
    if (value.startsWith(char)) {
      // Prepend single quote to prevent formula execution
      return "'" + value;
    }
  }
  
  return value;
}

// ============================================
// GOOGLE SHEETS OPERATIONS
// ============================================

/**
 * Save lead data to Google Sheets
 * Uses LockService for concurrency safety
 * 
 * @param {Date} timestamp - Submission timestamp
 * @param {Object} validatedData - Validated lead data
 * @returns {Boolean} True if successful
 * @throws {Error} If save fails
 */
function saveToSheet(timestamp, validatedData) {
  // Get script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  const spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  
  // Validate Spreadsheet ID is configured
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID not configured in Script Properties');
  }
  
  // Try to acquire lock (prevent concurrent writes)
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(LOCK_TIMEOUT_MS);
  
  if (!hasLock) {
    throw new Error('Could not acquire lock - too many concurrent requests');
  }
  
  try {
    // Open spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      throw new Error('Cannot open spreadsheet - check Spreadsheet ID');
    }
    
    // Get sheet
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
    } catch (error) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" does not exist');
    }
    
    // Format timestamp
    const timestampString = Utilities.formatDate(
      timestamp,
      SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );
    
    // Create row data [Timestamp, Full Name, Instagram Username]
    const rowData = [
      timestampString,
      validatedData.fullName,
      validatedData.instagramUsername
    ];
    
    // Append row to sheet
    try {
      sheet.appendRow(rowData);
    } catch (appendError) {
      throw new Error('Failed to append row to sheet');
    }
    
    return true;
    
  } finally {
    // Always release lock
    lock.releaseLock();
  }
}

// ============================================
// RESPONSE HANDLING
// ============================================

/**
 * Create consistent JSON response with CORS headers
 * 
 * @param {Boolean} success - Whether operation succeeded
 * @param {String} message - Response message
 * @returns {ContentService.TextOutput} JSON response
 */
function createResponse(success, message) {
  const response = {
    success: success,
    message: message
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type')
    .addHeader('Access-Control-Max-Age', '3600');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Test function - Run from Apps Script editor to verify setup
 * Creates sample data structure
 */
function testSetup() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  
  if (!spreadsheetId) {
    Logger.log('ERROR: SPREADSHEET_ID not set in Script Properties');
    return;
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (sheet) {
      Logger.log('SUCCESS: Can access spreadsheet and "' + SHEET_NAME + '" sheet');
      Logger.log('Current number of rows: ' + sheet.getLastRow());
    } else {
      Logger.log('ERROR: Sheet "' + SHEET_NAME + '" not found');
    }
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
  }
}

/**
 * Debug function - Simulate a form submission
 * Only for testing - remove before production
 */
function testFormSubmission() {
  const testPayload = {
    fullName: 'Test User',
    instagramUsername: '@testuser'
  };
  
  // Simulate request event
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };
  
  // Call doPost
  const response = doPost(mockEvent);
  const result = response.getContent();
  
  Logger.log('Test submission response: ' + result);
}
