# Google Apps Script Backend - Implementation Checklist
## Quick Reference for Setting Up End-to-End

---

## ✅ PHASE 1: Google Sheets Setup (5 minutes)

- [ ] Go to [Google Sheets](https://sheets.google.com)
- [ ] Click **+ Blank** to create new spreadsheet
- [ ] Rename to "Simsalaclean - Early Access Leads"
- [ ] Right-click sheet tab, rename to "Leads"
- [ ] In row 1, add headers:
  - [ ] A1: "Timestamp"
  - [ ] B1: "Full Name"
  - [ ] C1: "Instagram Username"
- [ ] Copy Spreadsheet ID from URL (the long string between `/d/` and `/edit`)
- [ ] **Save this ID** - you'll need it next

**✓ Result:** Spreadsheet ready with proper structure

---

## ✅ PHASE 2: Google Apps Script Setup (10 minutes)

- [ ] In Google Sheets, go to **Extensions** → **Apps Script**
- [ ] Wait for editor to open in new tab
- [ ] Select all code (Ctrl+A / Cmd+A)
- [ ] Delete all default code
- [ ] Go to **Code.gs** file in this repo
- [ ] Copy ALL the code
- [ ] Paste into Apps Script editor
- [ ] Click **Save** button
- [ ] Go to **Project Settings** (gear icon)
- [ ] Scroll to **Script Properties**
- [ ] Click **Add script property**
- [ ] Enter:
  - [ ] Property: `SPREADSHEET_ID`
  - [ ] Value: `[Paste your Spreadsheet ID here]`
- [ ] Click **Save**
- [ ] Go back to editor
- [ ] Select function dropdown: **testSetup**
- [ ] Click **Run** button
- [ ] Check **Execution log** - should show SUCCESS

**✓ Result:** Apps Script configured and verified working

---

## ✅ PHASE 3: Deploy Web App (5 minutes)

- [ ] Still in Apps Script editor
- [ ] Click **Deploy** button (blue, top right)
- [ ] Click **New deployment**
- [ ] Select dropdown (says "Select type")
- [ ] Choose **Web app**
- [ ] In form:
  - [ ] Execute as: [Select your email/account]
  - [ ] Who has access: Choose **Anyone**
- [ ] Click **Deploy** button
- [ ] Authorization dialog appears - click **Authorize**
- [ ] Select your account
- [ ] Review permissions, click **Allow**
- [ ] Wait for deployment to complete
- [ ] **COPY the Web App URL** - looks like:
  ```
  https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec
  ```
- [ ] **Save this URL** - you'll need it in frontend

**✓ Result:** Web App deployed and publicly accessible

---

## ✅ PHASE 4: Frontend Setup (5 minutes)

- [ ] In landing page folder
- [ ] Create file `.env.local` (note the dot at start)
- [ ] Add this line:
  ```
  REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec
  ```
- [ ] Replace `[SCRIPT_ID]` with actual value from Web App URL
- [ ] Save `.env.local`
- [ ] Open `script.js`
- [ ] Find section: "// INTEGRATION POINT: Google Apps Script"
- [ ] **UNCOMMENT** the fetch code block (remove `/*` and `*/`)
- [ ] Verify the URL is being read from `process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL`
- [ ] Save `script.js`
- [ ] Restart dev server (stop and start again)
- [ ] Verify no console errors

**✓ Result:** Frontend connected to backend

---

## ✅ PHASE 5: Quick Testing (10 minutes)

### Test 5a: Valid Submission
- [ ] Open http://localhost:8000
- [ ] Fill "Full Name": "Test User"
- [ ] Fill "Instagram": "testuser"
- [ ] Click "Daftar Early Access"
- [ ] See loading spinner
- [ ] See "You're on the list!" modal
- [ ] Click "Oke, Got It"
- [ ] Check Google Sheets: New row should appear

### Test 5b: Validation
- [ ] Clear form (reload page)
- [ ] Leave both fields empty
- [ ] Click submit
- [ ] See error messages

### Test 5c: Instagram @ Handling
- [ ] Clear form
- [ ] Fill "Full Name": "Jane Doe"
- [ ] Fill "Instagram": "@janedoe"
- [ ] Submit
- [ ] Check Google Sheets: Should be saved as "janedoe" (no @)

### Test 5d: Error Handling
- [ ] In DevTools (F12), set Network to "Offline"
- [ ] Try to submit form
- [ ] See error message (not modal)
- [ ] Go online
- [ ] Submit again - should work

**✓ Result:** All core functionality verified

---

## 📊 Verification Summary

After completing all phases:

**Google Sheets:**
- [ ] Spreadsheet created
- [ ] Tab "Leads" with 3 headers
- [ ] Leads are being saved correctly

**Google Apps Script:**
- [ ] Code.gs deployed
- [ ] Script Properties configured
- [ ] Web App accessible
- [ ] testSetup() shows SUCCESS

**Frontend:**
- [ ] .env.local created with correct URL
- [ ] script.js updated with integration code
- [ ] Form submissions send to backend
- [ ] Thank You modal appears
- [ ] Data appears in Google Sheets

**Testing:**
- [ ] Valid submissions work
- [ ] Validation shows errors
- [ ] Error recovery works
- [ ] @ handling works
- [ ] No console errors

---

## 🚀 You're Live!

If all checkboxes checked ✓:

✅ Landing page collecting leads  
✅ Leads automatically saved to Google Sheets  
✅ Error handling working  
✅ Mobile verified  
✅ Ready to share/promote  

---

## ⚠️ If Something Doesn't Work

**Check these in order:**

### "Web App URL tidak dikonfigurasi"
1. Verify `.env.local` exists
2. Check SPREADSHEET_ID is set correctly
3. Restart dev server

### "Loading forever / Error appears"
1. Check Web App URL is correct
2. Open DevTools Console (F12)
3. Look for error messages
4. Check Apps Script Execution Log

### "Data not in Google Sheets"
1. Verify SPREADSHEET_ID in Script Properties
2. Verify "Leads" tab exists
3. Check column headers match (Timestamp, Full Name, Instagram Username)
4. Check Apps Script logs for errors

### "CORS Error"
1. Web App URL might need CORS proxy
2. Check FRONTEND_INTEGRATION.md for solutions
3. Consider server-side proxy for production

---

## 📞 Quick Reference

**Save these URLs/IDs:**

```
Spreadsheet URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
Spreadsheet ID: [Paste here]

Web App URL: [Paste here]

Apps Script Project: [Link to Apps Script editor]
```

---

## 📚 Detailed Guides

If you need more detail for any step:

- **GOOGLE_SHEETS_SETUP.md** - Complete setup guide with screenshots
- **FRONTEND_INTEGRATION.md** - Detailed integration instructions
- **TESTING_GUIDE.md** - Comprehensive testing procedures

---

## ✅ Status: Ready to Implement

**All code written and documented.**

**Follow this checklist step-by-step.**

**~30 minutes from start to live.**

**Good luck! 🚀**
