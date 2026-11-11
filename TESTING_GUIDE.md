# Testing Guide - Google Apps Script Integration
## Simsalaclean Early Access Form Submission

Comprehensive testing procedures untuk verify seluruh submission flow bekerja correctly.

---

## 📋 Pre-Testing Checklist

Sebelum mulai testing, verify:

- [ ] Google Sheets spreadsheet dibuat
- [ ] Tab "Leads" dengan headers (Timestamp, Full Name, Instagram Username)
- [ ] Google Apps Script Code.gs sudah di-deploy
- [ ] Script Properties SPREADSHEET_ID sudah set
- [ ] Web App URL sudah copy dan verified
- [ ] Frontend form submission code sudah updated
- [ ] Environment variables atau config sudah set
- [ ] Dev server running (http://localhost:8000)

---

## TEST 1: Google Apps Script Setup Verification

### 1.1: Test Script Can Access Spreadsheet

**In Google Apps Script Editor:**

1. Open Apps Script editor (Extensions → Apps Script dari Sheets)
2. Select function dropdown: **testSetup**
3. Click **Run** button
4. Check **Execution log** at bottom

**Expected Output:**
```
SUCCESS: Can access spreadsheet and "Leads" sheet
Current number of rows: 1
```

**If Error:**
- ❌ `ERROR: SPREADSHEET_ID not set` → Check Script Properties
- ❌ `ERROR: Sheet "Leads" not found` → Create tab "Leads" in sheet
- ❌ `ERROR: Cannot open spreadsheet` → Check Spreadsheet ID value

### 1.2: Verify Web App URL Accessible

1. Copy your Web App URL
2. Open browser, paste URL
3. Page should load (might show auth error or blank)
4. **Not** 404 or server error

**Expected:** Browser loads (even if shows auth message)  
**Not Expected:** 404 error, server error, timeout

---

## TEST 2: Form Validation Tests

### 2.1: Empty Submission

**Action:**
1. Open http://localhost:8000
2. Leave both fields empty
3. Click "Daftar Early Access"

**Expected:**
- ✅ Error message under Full Name: "Nama lengkap harus diisi."
- ✅ Error message under Instagram: "Instagram username harus diisi."
- ✅ Form NOT submitted (no loading state)
- ✅ Fields highlighted in red

**Not Expected:**
- ❌ Loading spinner appears
- ❌ Modal shows
- ❌ Data saved to Sheets

---

### 2.2: Full Name Too Short

**Action:**
1. Fill "Full Name": "A"
2. Fill "Instagram": "testuser"
3. Click submit

**Expected:**
- ✅ Error: "Nama lengkap minimal 2 karakter."
- ✅ Form NOT submitted
- ✅ Data NOT saved

---

### 2.3: Full Name Too Long

**Action:**
1. Fill "Full Name": (string with 101+ characters)
2. Fill "Instagram": "testuser"
3. Click submit

**Expected:**
- ✅ Error: "Nama lengkap maksimal 100 karakter."
- ✅ Form NOT submitted

---

### 2.4: Instagram Username Empty

**Action:**
1. Fill "Full Name": "Test User"
2. Leave "Instagram" empty
3. Click submit

**Expected:**
- ✅ Error: "Instagram username harus diisi."
- ✅ Form NOT submitted

---

### 2.5: Instagram With Invalid Characters

**Action:**
1. Fill "Full Name": "Test User"
2. Fill "Instagram": "test-user" (dash not allowed)
3. Click submit

**Expected:**
- ✅ Error message about invalid characters
- ✅ Form NOT submitted
- ✅ Data NOT saved

---

### 2.6: Instagram Too Long

**Action:**
1. Fill "Full Name": "Test User"
2. Fill "Instagram": (string with 31+ characters)
3. Click submit

**Expected:**
- ✅ Error: "Instagram username terlalu panjang."
- ✅ Form NOT submitted

---

## TEST 3: Valid Submission Tests

### 3.1: Basic Valid Submission

**Action:**
1. Fill "Full Name": "John Doe"
2. Fill "Instagram": "johndoe"
3. Click "Daftar Early Access"

**Expected (Frontend):**
- ✅ Loading spinner appears
- ✅ Button disabled (grayed out)
- ✅ Button text hidden, spinner visible
- ✅ After ~1-2 seconds: Thank You modal appears

**Expected (Google Sheets):**
- ✅ New row in "Leads" tab:
  ```
  Timestamp: [Current date/time]
  Full Name: "John Doe"
  Instagram Username: "johndoe"
  ```

**Verify:**
1. Open Google Sheets
2. Check "Leads" tab
3. Should see new row with exact data

---

### 3.2: Instagram With @ Symbol

**Action:**
1. Fill "Full Name": "Jane Doe"
2. Fill "Instagram": "@janedoe" (WITH @ sign)
3. Click submit

**Expected (Frontend):**
- ✅ Loading spinner appears
- ✅ Thank You modal shows

**Expected (Google Sheets):**
- ✅ New row with:
  ```
  Full Name: "Jane Doe"
  Instagram Username: "janedoe"  (@ REMOVED)
  ```

**Critical:** Verify @ is removed before saving

---

### 3.3: Instagram With Valid Special Characters

**Action:**
1. Fill "Full Name": "Test User"
2. Fill "Instagram": "test_user.123" (underscore & dot OK)
3. Click submit

**Expected (Frontend):**
- ✅ Loading spinner appears
- ✅ Thank You modal shows

**Expected (Google Sheets):**
- ✅ New row with Instagram: "test_user.123"

---

### 3.4: Thank You Modal Interaction

**After successful submission:**

**Test Close via Button:**
1. Modal shows
2. Click "Oke, Got It" button
3. Modal closes
4. Form visible again

**Test Close via Escape:**
1. Modal shows
2. Press Escape key
3. Modal closes

**Test Close via Outside Click:**
1. Modal shows
2. Click outside modal
3. Modal closes

**Expected:** All 3 close methods work

---

## TEST 4: Data Processing Tests

### 4.1: Whitespace Trimming

**Action:**
1. Fill "Full Name": "  John Doe  " (spaces around)
2. Fill "Instagram": "  johndoe  " (spaces around)
3. Submit

**Expected (Google Sheets):**
- ✅ Data saved as "John Doe" (no spaces)
- ✅ Instagram as "johndoe" (no spaces)

---

### 4.2: Formula Injection Prevention

**Action:**
1. Fill "Full Name": "=1+1" (formula)
2. Fill "Instagram": "testuser"
3. Submit

**Expected (Google Sheets):**
- ✅ Data saved as "=1+1" (displayed as text, not calculated)
- ✅ Cell shows formula as text, not result "2"

**Test Other Formulas:**
- "@1+1" → Should be sanitized
- "+1+1" → Should be sanitized
- "-1+1" → Should be sanitized

---

### 4.3: Timestamp Generation

**Action:**
1. Submit form
2. Check Google Sheets timestamp

**Expected:**
- ✅ Timestamp shows server time (not client time)
- ✅ Format: "yyyy-MM-dd HH:mm:ss"
- ✅ Close to current time (within seconds)

---

## TEST 5: Error Handling Tests

### 5.1: Network Error

**Action:**
1. In DevTools, Network tab set to "Offline"
2. Fill form with valid data
3. Click submit

**Expected (Frontend):**
- ✅ Loading spinner shows briefly
- ✅ Error message appears: "Terjadi kesalahan..."
- ✅ Form NOT reset (data stays for retry)
- ✅ Button enabled again for retry

**Expected (Google Sheets):**
- ❌ NO new row (data not saved)

---

### 5.2: Invalid Web App URL

**Action:**
1. Update Web App URL to fake/invalid URL
2. Submit valid form data

**Expected:**
- ✅ Loading spinner shows
- ✅ Error message appears
- ✅ Form data preserved
- ✅ Button enabled for retry

---

### 5.3: Spreadsheet ID Wrong

**Action:**
1. In Apps Script, change SPREADSHEET_ID in Script Properties to wrong ID
2. Deploy new version
3. Submit form

**Expected (Frontend):**
- ✅ Loading spinner shows
- ✅ Error message appears
- ✅ Form preserved

**Expected (Google Sheets):**
- ❌ NO new row (failed to save)

---

## TEST 6: Double Submit Prevention

### 6.1: Rapid Double Click

**Action:**
1. Fill form with valid data
2. Click "Daftar Early Access" button twice rapidly
3. Wait for response

**Expected:**
- ✅ Only ONE submission to Google Apps Script
- ✅ Only ONE row added to Google Sheets
- ✅ Button disabled during loading

**Verify:**
- Check Google Sheets
- Should have only 1 new row (not 2)

---

### 6.2: Click While Loading

**Action:**
1. Fill form
2. Click submit
3. While loading spinner visible, click submit again

**Expected:**
- ✅ Second click ignored
- ✅ Still only one submission
- ✅ Only one row in Sheets

---

## TEST 7: Concurrent Submissions

**Action:**
1. Open landing page in 2 browser tabs
2. In both tabs, submit different form data
3. Submit both within seconds of each other

**Expected:**
- ✅ Both submissions succeed
- ✅ Both rows appear in Google Sheets
- ✅ No data corruption
- ✅ Both Thank You modals show

**Verify:** Google Sheets has 2 new rows with correct data

---

## TEST 8: Mobile Responsiveness

### 8.1: Form Visibility

**Action:**
1. Open DevTools (F12)
2. Toggle "Device Toolbar" (Ctrl+Shift+M)
3. Select mobile device (iPhone 12)

**Expected:**
- ✅ Form visible above fold (no scroll needed)
- ✅ Full Name input visible
- ✅ Instagram input visible
- ✅ Submit button visible

---

### 8.2: Mobile Submission

**Action:**
1. Fill form on mobile view
2. Click submit
3. Verify submission works

**Expected:**
- ✅ Loading spinner visible
- ✅ Thank You modal responsive
- ✅ Modal readable
- ✅ Can close modal

---

### 8.3: Mobile Error Handling

**Action:**
1. Try submit with empty fields on mobile

**Expected:**
- ✅ Error messages visible
- ✅ Input highlighted
- ✅ Text readable
- ✅ Can correct and retry

---

## TEST 9: Cross-Browser Testing

Test submission in:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**For Each Browser:**
1. Open http://localhost:8000
2. Submit valid form
3. Verify: Loading shows → Modal appears → Row in Sheets

**Expected:** All browsers work identically

---

## TEST 10: Edge Cases

### 10.1: Unicode Characters

**Action:**
1. Full Name: "José García" (accents)
2. Instagram: "usuario_español"
3. Submit

**Expected:**
- ✅ Saves with unicode preserved
- ✅ Appears correctly in Sheets

---

### 10.2: Maximum Length Boundary

**Action:**
1. Full Name: Exactly 100 characters
2. Instagram: Exactly 30 characters
3. Submit

**Expected:**
- ✅ Accepts both
- ✅ Saves successfully
- ✅ No truncation

---

### 10.3: Minimum After Normalization

**Action:**
1. Full Name: "JD" (2 characters, minimum)
2. Instagram: "@a" (1 after removing @)
3. Submit

**Expected:**
- ✅ Accepts both (at minimum boundary)
- ✅ Saves as "JD" and "a"

---

## TEST 11: Real-World Scenarios

### 11.1: Multiple Submissions Over Time

**Action:**
1. Submit form
2. Wait 30 seconds
3. Submit again (different data)

**Expected (Google Sheets):**
- ✅ Both rows present
- ✅ Different timestamps
- ✅ All data correct

---

### 11.2: Form Reset After Success

**Action:**
1. Fill and submit form
2. Thank You modal shows
3. Close modal

**Expected:**
- ✅ Form fields cleared (empty)
- ✅ Error messages gone
- ✅ Ready for new submission
- ✅ Can submit again immediately

---

### 11.3: Retry After Error

**Action:**
1. Submit with network offline
2. Error appears
3. Go online
4. Submit same form again

**Expected:**
- ✅ Second submission succeeds
- ✅ Thank You modal appears
- ✅ Data saved to Sheets

---

## TEST 12: Console & Network Inspection

### 12.1: Check Console

**Action:**
1. Open DevTools (F12)
2. Console tab
3. Submit form

**Expected (Console):**
- ✅ No JavaScript errors
- ✅ May see fetch request logged
- ✅ Response data visible

**Not Expected:**
- ❌ Red errors
- ❌ Failed to fetch messages
- ❌ Undefined errors

---

### 12.2: Check Network Tab

**Action:**
1. DevTools → Network tab
2. Submit form

**Expected:**
- ✅ POST request to Web App URL visible
- ✅ Status: 200 OK
- ✅ Response shows JSON: `{success: true}`

**Check Details:**
1. Click POST request
2. View Headers tab
3. View Response tab
4. Should show JSON response

---

## TEST 13: Apps Script Logs

### 13.1: Check Execution Logs

**Action:**
1. Open Google Apps Script editor
2. View → Execution log
3. Submit form from landing page
4. Check logs

**Expected:**
- ✅ Execution appears in logs
- ✅ Status shows success or error
- ✅ Duration shows (usually <1 second)
- ✅ No error messages

---

## Final Verification Checklist

After all tests pass:

- [ ] All validation tests pass
- [ ] All valid submissions save correctly
- [ ] All error messages clear and helpful
- [ ] Double submit prevention works
- [ ] Mobile view works
- [ ] Cross-browser works
- [ ] Google Sheets has all submitted data
- [ ] No data corruption
- [ ] No console errors
- [ ] Network requests look good

---

## Troubleshooting Quick Reference

| Issue | Cause | Solution |
|-------|-------|----------|
| Form not submitting | Validation error | Check error messages |
| Loading forever | CORS issue | Check Web App URL |
| Error message shows | Backend error | Check Apps Script logs |
| No row in Sheets | Save failed | Verify SPREADSHEET_ID |
| Wrong data in Sheets | Normalization issue | Verify formula injection protection |
| Double submit happens | Lock failed | Check LockService timeout |
| Mobile broken | Responsive CSS issue | Check mobile view in DevTools |

---

## Test Report Template

```
Date: [Date]
Browser: [Chrome/Firefox/etc]
Device: [Desktop/Mobile/Tablet]

✅ Test 1: Valid Submission - PASS
✅ Test 2: Validation - PASS
✅ Test 3: Error Handling - PASS
✅ Test 4: Data in Sheets - PASS
✅ Test 5: Mobile - PASS

Issues Found:
[List any issues]

Status: READY FOR PRODUCTION / NEEDS FIXES
```

---

## Next Steps

1. ✅ Complete all tests
2. ✅ Fix any issues found
3. ✅ Deploy to production
4. ✅ Monitor submissions
5. ✅ Collect leads for launch

---

**All Tests Ready - Proceed with Testing!**
