# Frontend Integration - Google Apps Script Web App
## Simsalaclean Landing Page Form Submission

Complete guide untuk mengintegrasikan landing page form dengan Google Apps Script Web App.

---

## 📋 Prerequisites

Sebelum integration:

- ✅ Google Sheets spreadsheet dibuat dengan tab "Leads"
- ✅ Google Apps Script Web App sudah di-deploy
- ✅ Web App URL sudah digenerate
- ✅ Script Properties SPREADSHEET_ID sudah dikonfigurasi

---

## STEP 1: Add Environment Variables

### Create .env.local file

Di root folder project, buat file `.env.local`:

```bash
# .env.local
# Google Apps Script Web App endpoint
REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec
```

**Catatan:**
- Replace `[SCRIPT_ID]` dengan Script ID dari Web App URL Anda
- `.env.local` harus dalam `.gitignore` (jangan commit)
- Development/production bisa punya .env.local berbeda

### Alternative: Direct in Code (Not Recommended)

Jika tidak pakai environment variables:

```javascript
const WEB_APP_URL = 'https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec';
```

❌ **Not recommended** karena hardcoded, tapi bisa digunakan untuk quick testing.

---

## STEP 2: Update Form Submission Code

### Locate Current Form Handler

Di `script.js`, cari bagian form submission:

```javascript
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // ... validation code ...
    
    // THIS IS WHERE WE INTEGRATE
});
```

### Update Submission Logic

Replace bagian placeholder dengan actual integration:

```javascript
// ========================================
// FORM SUBMISSION WITH GOOGLE APPS SCRIPT
// ========================================

leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    // Validate both fields
    const fullNameValidation = validateFullName(fullNameInput.value);
    const instagramValidation = validateInstagramUsername(instagramUsernameInput.value);

    if (!fullNameValidation.valid) {
        showError(fullNameInput, fullNameError, fullNameValidation.message);
        fullNameInput.focus();
        return;
    } else {
        hideError(fullNameInput, fullNameError);
    }

    if (!instagramValidation.valid) {
        showError(instagramUsernameInput, instagramUsernameError, instagramValidation.message);
        instagramUsernameInput.focus();
        return;
    } else {
        hideError(instagramUsernameInput, instagramUsernameError);
    }

    // Set submitting state
    isSubmitting = true;
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    try {
        // Prepare data
        const fullName = fullNameInput.value.trim();
        const instagramUsername = instagramUsernameInput.value.trim().startsWith('@')
            ? instagramUsernameInput.value.trim().slice(1)
            : instagramUsernameInput.value.trim();

        const formData = {
            fullName: fullName,
            instagramUsername: instagramUsername
        };

        // Get Web App URL from environment
        const appsScriptUrl = process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL;
        
        if (!appsScriptUrl) {
            throw new Error('Web App URL tidak dikonfigurasi');
        }

        // Send to Google Apps Script
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Parse response
        const result = await response.json();

        // Check if submission was successful
        if (!result || !result.success) {
            const errorMsg = result?.message || 'Gagal menyimpan data. Silakan coba lagi.';
            throw new Error(errorMsg);
        }

        // SUCCESS: Show thank you modal
        showThankYouModal();

        // Reset form
        leadForm.reset();
        hideError(fullNameInput, fullNameError);
        hideError(instagramUsernameInput, instagramUsernameError);

    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message to user
        const errorMessage = error.message || 'Terjadi kesalahan saat mengirim form. Silakan coba lagi.';
        showError(instagramUsernameInput, instagramUsernameError, errorMessage);
        
        // Log full error for debugging (console only)
        console.log('Debug info:', {
            message: error.message,
            url: process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL,
            timestamp: new Date().toISOString()
        });
        
    } finally {
        // Reset submitting state
        isSubmitting = false;
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});
```

---

## STEP 3: Handle CORS Limitations

### Understanding the Issue

Google Apps Script Web App memiliki keterbatasan CORS:
- Response mungkin tidak terbaca di browser
- Mode "no-cors" membuat response opaque
- Behavior bisa berbeda per browser/environment

### Test Approach 1: Direct Fetch (Simple)

```javascript
// Try direct fetch first
const response = await fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(formData)
});

const result = await response.json();  // May fail if CORS blocked
```

**Pros:** Simple, no extra infrastructure  
**Cons:** May fail in some browsers/environments

### Test Approach 2: Check Response Status

```javascript
// Better approach - check status first
const response = await fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(formData)
});

// Apps Script may return 200 even with CORS restrictions
// The actual response might not be readable
if (response.ok) {
    try {
        const result = await response.json();
        if (result.success) {
            showThankYouModal();
        }
    } catch (jsonError) {
        // Response not readable due to CORS
        // Treat as potential success (Apps Script likely processed it)
        console.warn('Response not readable, but request was successful');
        
        // Option: Show thank you anyway (risky)
        // Or: Show "Submission received" state
        // Best: Setup proxy (see below)
    }
}
```

### Recommended Approach 3: Server-Side Proxy

Jika encounter CORS issues di production, setup proxy:

**Your Backend Flow:**
```
Frontend
  ↓ POST /api/submit-lead
Backend (Your Server)
  ↓ POST Google Apps Script URL
  ↓ GET Response
Frontend
  ↓ Return Result
```

**Frontend Code:**
```javascript
const response = await fetch('/api/submit-lead', {  // Your server
    method: 'POST',
    body: JSON.stringify(formData)
});

const result = await response.json();  // Now readable

if (result.success) {
    showThankYouModal();
}
```

**Backend (Node.js Example):**
```javascript
app.post('/api/submit-lead', async (req, res) => {
    const { fullName, instagramUsername } = req.body;
    
    // Validate
    if (!fullName || !instagramUsername) {
        return res.json({ success: false, message: 'Data tidak lengkap' });
    }
    
    try {
        // Forward to Google Apps Script
        const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ fullName, instagramUsername })
        });
        
        const result = await response.json();
        return res.json(result);
        
    } catch (error) {
        return res.json({ success: false, message: 'Gagal menyimpan' });
    }
});
```

---

## STEP 4: Testing Integration

### Test 1: Verify Setup

Before submitting forms:

```javascript
// Add to console in DevTools to check URL
console.log('Web App URL:', process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL);

// Try manual fetch
fetch(process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({
        fullName: 'Test User',
        instagramUsername: 'testuser'
    })
}).then(r => {
    console.log('Response status:', r.status);
    console.log('Response headers:', r.headers);
    return r.json();
}).then(data => {
    console.log('Response data:', data);
}).catch(error => {
    console.error('Error:', error);
});
```

### Test 2: Valid Submission

1. Open http://localhost:8000
2. Fill form:
   - Full Name: "John Doe"
   - Instagram: "johndoe"
3. Click submit
4. **Verify:**
   - Loading spinner shows
   - Thank You modal appears
   - Check Google Sheets (should have new row)

### Test 3: Instagram with @

1. Fill form:
   - Full Name: "Jane Doe"
   - Instagram: "@janedoe"
2. Submit
3. **Verify Google Sheets:** @ removed, stored as "janedoe"

### Test 4: Invalid Data

1. Try submit dengan invalid data
2. Verify error message shows
3. Verify data NOT saved to Sheets

### Test 5: Network Issue Handling

1. In DevTools, set network to "Offline"
2. Try to submit form
3. Verify error message shows
4. Verify form data NOT reset (user can retry)

---

## STEP 5: Production Deployment

### Before Deploy

Checklist:

- [ ] Environment variables correctly set
- [ ] Web App URL working
- [ ] Test submissions working
- [ ] Google Sheets receiving data
- [ ] Error handling working
- [ ] Mobile testing passed
- [ ] CORS approach confirmed working

### During Deploy

```bash
# Example with Vercel
vercel deploy

# Or manual:
git push origin main  # If auto-deploy setup
```

### After Deploy

Verify on production:

1. Open production URL
2. Submit test lead
3. Check Google Sheets for new row
4. Check browser console for errors

---

## Debugging Guide

### Common Issues & Solutions

#### Issue: "Web App URL tidak dikonfigurasi"

**Cause:** Environment variable not set

**Solution:**
```
1. Check .env.local file exists
2. Verify REACT_APP_GOOGLE_APPS_SCRIPT_URL is set
3. Restart dev server
4. Check that .env.local is NOT in .gitignore (add if missing)
```

#### Issue: "NetworkError" atau "Failed to fetch"

**Cause:** CORS blocked or Apps Script URL wrong

**Solution:**
```
1. Check Web App URL is correct
2. Verify Apps Script is deployed
3. Try in Incognito mode
4. Check browser console for details
5. Consider server-side proxy
```

#### Issue: "Unexpected token < in JSON at position 0"

**Cause:** Response is HTML (error page), not JSON

**Solution:**
```
1. Check Web App URL is accessible in browser
2. Verify Google Apps Script has code
3. Check Script Properties SPREADSHEET_ID is set
4. View Apps Script logs for errors
```

#### Issue: Data tidak muncul di Sheets

**Cause:** Submission failed silently

**Solution:**
```
1. Check browser console for errors
2. Check Apps Script execution logs
3. Verify sheet "Leads" exists
4. Verify columns are correct (Timestamp, Full Name, Instagram Username)
5. Check SPREADSHEET_ID in Script Properties
```

### Debugging Steps

1. **Check Frontend Console (F12)**
   - Look for JavaScript errors
   - Check network tab for POST request
   - Verify response status & data

2. **Check Apps Script Logs**
   - Open Apps Script editor
   - View → Execution log
   - See what happened server-side

3. **Test with curl**
   ```bash
   curl -X POST [WEB_APP_URL] \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","instagramUsername":"test"}'
   ```

4. **Add Console Logs**
   - Add `console.log()` in submission handler
   - Check values being sent
   - Check response received

---

## Security Best Practices

### Frontend

❌ Never expose:
- Spreadsheet ID
- Google credentials
- API keys
- Authorization tokens

✅ Safe to expose:
- Web App URL (public by design)
- Field validation messages
- General error messages

### Data Validation

✅ Validate on frontend:
- Required fields
- Data types
- Length constraints
- Character sets

✅ Validate on backend:
- All of above (don't trust client)
- Sanitize input
- Check for injection

### Rate Limiting

Consider adding for production:

```javascript
// Simple client-side rate limiting
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN_MS = 3000;

const canSubmit = () => {
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
        return false;
    }
    lastSubmitTime = now;
    return true;
};

// In form submit handler:
if (!canSubmit()) {
    showError(..., 'Silakan tunggu sebelum submit lagi');
    return;
}
```

Or implement server-side rate limiting via proxy.

---

## Monitoring

### Check Submissions

```javascript
// Add to Apps Script to monitor
function getRecentSubmissions() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    Logger.log('Total submissions: ' + (lastRow - 1));  // Exclude header
}
```

### Export Data

1. Open Google Sheets
2. Download as CSV or Excel
3. Import to analytics or email tool

### Email Notifications (Optional)

Add to Apps Script:

```javascript
// After successful save
function sendNotificationEmail(fullName, instagramUsername) {
    GmailApp.sendEmail(
        'your-email@example.com',
        'New Early Access Lead: ' + fullName,
        'Full Name: ' + fullName + '\n' +
        'Instagram: ' + instagramUsername
    );
}
```

---

## Next Steps

1. ✅ Create .env.local with Web App URL
2. ✅ Update script.js form submission
3. ✅ Test form submission
4. ✅ Verify Google Sheets receives data
5. ✅ Handle any CORS issues
6. ✅ Deploy to production
7. ✅ Monitor submissions

---

## Support

If issues occur:

1. Check Troubleshooting section above
2. Check Apps Script execution logs
3. Check browser console (F12)
4. Verify all setup steps completed
5. Test with curl command

---

**Status: Ready for Integration**

Follow steps 1-5 above to complete integration.
