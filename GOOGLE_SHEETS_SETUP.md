# Google Sheets + Google Apps Script Setup Guide
## Simsalaclean Early Access Lead Collection

Complete guide untuk setup Google Sheets dan deploy Google Apps Script Web App untuk menerima form submissions dari landing page.

---

## 📋 Overview

Sistem ini terdiri dari:
- **Google Sheets**: Spreadsheet untuk menyimpan leads
- **Google Apps Script**: Backend Web App untuk menerima & validate submissions
- **Frontend**: Landing page form yang mengirim data ke Web App
- **LockService**: Concurrency protection untuk prevent data race

---

## PHASE 1: Buat Google Sheets

### Step 1: Buat Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** untuk membuat spreadsheet baru
3. Rename spreadsheet menjadi **"Simsalaclean - Early Access Leads"**
4. Click **Share** dan set akses sesuai preferensi Anda

### Step 2: Buat Tab "Leads"

1. Di sheet yang baru dibuat, klik sheet tab di bawah (default "Sheet1")
2. Right-click pada tab dan pilih **"Rename"**
3. Ubah nama menjadi **"Leads"**
4. Click **OK**

### Step 3: Buat Header Columns

Di row pertama, buat 3 kolom:

```
Column A: Timestamp
Column B: Full Name
Column C: Instagram Username
```

**Cara:**
1. Click cell A1
2. Ketik "Timestamp" dan press Enter
3. Click cell B1
4. Ketik "Full Name" dan press Enter
5. Click cell C1
6. Ketik "Instagram Username" dan press Enter

**Result:**
```
+------------------------+------------------+------------------------+
| Timestamp              | Full Name        | Instagram Username     |
+------------------------+------------------+------------------------+
| (data akan masuk here) | (data akan here) | (data akan masuk here) |
+------------------------+------------------+------------------------+
```

### Step 4: Copy Spreadsheet ID

1. Lihat URL spreadsheet di browser:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

2. Copy bagian **[SPREADSHEET_ID]** (string panjang di tengah URL)

3. **Simpan ID ini** - akan digunakan di Script Properties

**Example:**
```
URL: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit

SPREADSHEET_ID: 1a2b3c4d5e6f7g8h9i0j
```

---

## PHASE 2: Setup Google Apps Script

### Step 1: Buka Google Apps Script Editor

1. Di Google Sheets Anda, click **Extensions** di menu atas
2. Click **Apps Script**
3. Tunggu editor membuka di tab baru

### Step 2: Ganti Code Default

1. Di editor Apps Script, lihat file **"Code.gs"** di sidebar kiri
2. Select semua kode default (Ctrl+A atau Cmd+A)
3. Delete semua kode

### Step 3: Paste Code.gs

1. Copy seluruh kode dari file **Code.gs** yang sudah disiapkan
2. Paste ke dalam editor Apps Script
3. Click **Save** (atau Ctrl+S)

**Verify:**
- Tidak ada red error indicators
- Syntax highlighting visible
- File name shows "Code.gs"
- Ada fungsi `doGet` dan `doPost`

**Note:** 
- `doPost` = Handle POST requests (form submissions)
- `doGet` = Handle GET requests (Web App verification)

### Step 4: Setup Script Properties

Script Properties menyimpan Spreadsheet ID secara aman (tidak hardcoded).

**Cara:**

1. Di Apps Script editor, click **Project Settings** (gear icon di sidebar kiri)
2. Scroll ke bawah dan cari **"Script Properties"**
3. Click **Add script property**

4. Masukkan:
   ```
   Property: SPREADSHEET_ID
   Value: [Paste Spreadsheet ID dari Step 1.4]
   ```

5. Click **Save**

**Verify:**
```
✓ Property name: SPREADSHEET_ID
✓ Value: [Long string yang Anda copy tadi]
✓ Saved state: terlihat di list
```

### Step 5: Test Setup (Optional)

Untuk verify script dapat akses Sheets:

1. Di Apps Script editor, click **Run** button
2. Select function: **testSetup**
3. Click **Run**
4. Di **Execution log** di bawah, lihat hasil:

```
SUCCESS: Can access spreadsheet and "Leads" sheet
Current number of rows: 1
```

Jika ada error, cek:
- Spreadsheet ID correct?
- Tab "Leads" exists?
- Authorization granted?

---

## PHASE 3: Deploy Web App

Deployment membuat Apps Script accessible via URL yang public visitors bisa akses.

### Step 1: Deploy Web App

1. Di Apps Script editor, click **Deploy** (tombol biru atas kanan)
2. Click **New deployment**

### Step 2: Configure Deployment

Dialog akan muncul:

```
Select type:
  [▼] (dropdown)
  
  Choose: "Web app"
```

Click dropdown dan select **Web app**

### Step 3: Set Execution & Access

Setelah select "Web app", akan muncul options:

```
Execute as:
  [Your email/account dropdown]
  → Pilih akun yang punya access ke spreadsheet

Who has access:
  [Anyone (Public) dropdown]
  → HARUS set ke "Anyone" agar form bisa submit
```

**PENTING:** 
- Execute as: Harus akun yang own spreadsheet
- Access: Harus "Anyone" agar public dapat submit

### Step 4: Deploy

1. Click **Deploy** button
2. Tunggu proses selesai
3. Dialog akan show **Deployment ID** dan **Web App URL**

**Copy URL Web App** - ini yang akan digunakan di frontend

Example URL:
```
https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec
```

### Step 5: Authorization

Google akan prompt untuk authorize:

1. Click **Authorize access**
2. Select akun Anda (yang own spreadsheet)
3. Review permissions (Apps Script membutuhkan access ke Sheets)
4. Click **Allow**

Setelah authorized, deployment URL akan digenerate.

---

## PHASE 4: Update Frontend Form

### Step 1: Add Web App URL ke Environment

Update file `.env` atau `.env.local` frontend Anda:

```env
# .env.local (jangan commit file ini)
REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/[SCRIPT_ID]/usercopy/exec
```

**Atau:** Add ke file konfigurasi Anda sesuai setup.

### Step 2: Update Form Submission Code

Di `script.js`, uncomment dan update bagian:

```javascript
// In leadForm submit handler:

const appsScriptUrl = process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL;

const response = await fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify({
        fullName: fullName,
        instagramUsername: instagramUsername
    })
});

const result = await response.json();

if (result.success) {
    showThankYouModal();
} else {
    throw new Error(result.message);
}
```

---

## PHASE 5: Testing

### Test 1: Valid Submission

1. Buka landing page: http://localhost:8000
2. Isi form:
   - Full Name: "Test User"
   - Instagram: "testuser"
3. Click submit
4. Verify:
   - Loading spinner muncul
   - Thank You modal appears
   - Check Google Sheets: Row baru muncul dengan data

### Test 2: Instagram dengan @

1. Isi form:
   - Full Name: "Test User 2"
   - Instagram: "@testuser2"
2. Submit
3. Verify Google Sheets: @ dihapus, tersimpan sebagai "testuser2"

### Test 3: Invalid Data

1. Isi form:
   - Full Name: "A" (terlalu pendek)
   - Instagram: "testuser"
2. Submit
3. Verify: Error message muncul, tidak tersimpan

### Test 4: Empty Fields

1. Jangan isi apa-apa
2. Click submit
3. Verify: Error messages muncul untuk semua field

### Test 5: Formula Injection Prevention

1. Isi form:
   - Full Name: "=1+1"
   - Instagram: "testuser"
2. Submit
3. Verify Google Sheets: Data tersimpan, formula tidak dijalankan (tampil sebagai text)

---

## CORS & Browser Response Handling

### Important Notes

**Google Apps Script Response:**
- Apps Script ContentService memiliki keterbatasan CORS
- Browser tidak selalu bisa membaca response body dengan fetch standar
- Mode "no-cors" akan membuat response opaque (tidak dapat dibaca)

### Recommended Approach

**Option 1: Simple (Current Setup)**
```javascript
fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(data)
})
.then(r => r.json())
.then(result => {
    if (result.success) showModal();
})
```

**Limitation:** Tergantung CORS policy Apps Script, response mungkin tidak terbaca di beberapa browser.

**Option 2: Add CORS Proxy (Recommended for Production)**

Jika encounter CORS issues, setup server-side proxy:

```javascript
// Instead of direct Apps Script call:
// POST to your own backend → Backend forwards to Apps Script

fetch('/api/submit-lead', {  // Your backend
    method: 'POST',
    body: JSON.stringify(data)
})
```

Backend kemudian:
```
POST /api/submit-lead
  ↓ (forward)
POST Google Apps Script URL
  ↓ (response)
Return to frontend
```

**Trade-offs:**
- Pro: Reliable response handling, added security layer
- Con: Requires backend server, extra latency

---

## Security Considerations

### Data Security

✅ **What's Implemented:**
- Input validation on backend
- Formula injection prevention
- LockService for concurrency
- Timestamp created on server (not client)
- Type checking on all inputs

⚠️ **What's NOT Implemented (Optional):**
- Rate limiting (recommend add at proxy/server level)
- Honeypot field (can add if spam issues)
- CAPTCHA verification
- API key authentication (Apps Script URL is public)

### Sensitive Data

❌ **Never put in frontend:**
- Spreadsheet ID (✓ We use Script Properties)
- Google credentials
- Authorization tokens
- API keys

✅ **Can put in frontend:**
- Web App URL (publicly accessible by design)
- Form field names
- Error messages

---

## Troubleshooting

### Issue: "Cannot open spreadsheet - check Spreadsheet ID"

**Cause:** Spreadsheet ID wrong atau tidak ada akses

**Fix:**
1. Copy Spreadsheet ID lagi dari URL
2. Verify Script Properties SPREADSHEET_ID value
3. Verify akun yang authorize memiliki access ke sheet

### Issue: "Sheet 'Leads' not found"

**Cause:** Tab bernama "Leads" tidak ada di spreadsheet

**Fix:**
1. Buka spreadsheet
2. Verify tab "Leads" exists
3. Jika tidak ada, rename sheet atau buat baru

### Issue: Form tidak submit / Loading forever

**Cause:** CORS issue atau Apps Script error

**Fix:**
1. Check browser console (F12) untuk error
2. Check Apps Script logs untuk server error
3. Test dengan curl:
   ```
   curl -X POST [WEB_APP_URL] \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","instagramUsername":"test"}'
   ```

### Issue: Response null atau undefined

**Cause:** Apps Script response tidak readable

**Fix:**
1. Add server-side proxy (Option 2 di atas)
2. Atau check response di Network tab (DevTools)

### Issue: Data tidak muncul di Sheets

**Cause:** Append row failed, atau salah sheet

**Fix:**
1. Check Apps Script logs untuk error
2. Verify sheet "Leads" correct dan column headers setup
3. Try test submission dari Apps Script editor

---

## Update Deployment

Jika update Code.gs:

1. Edit code di Apps Script editor
2. Click **Save**
3. Click **Deploy** → **Manage deployments**
4. Click pensil icon (edit) deployment yang aktif
5. New version akan auto-create
6. Keep menggunakan URL yang sama (otomatis redirect ke latest)

---

## Monitoring & Maintenance

### Check Submissions

1. Buka Google Sheets
2. Check tab "Leads"
3. Setiap row = satu submission
4. Timestamp auto-generated

### View Logs (Debugging)

1. Buka Apps Script editor
2. Click **View** → **Execution log**
3. Lihat logs dari submissions
4. Errors akan terlihat di sini

### Export Data

1. Di Google Sheets, select data
2. Download sebagai CSV/Excel
3. Import ke tools lain sesuai kebutuhan

---

## Quick Reference - URLs & IDs

**Simpan di safe place:**

```
SPREADSHEET_ID: [Your ID here]
WEB_APP_URL: [Your URL here]
WEB_APP_SCRIPT_ID: [Extract dari URL]
ACCOUNT_EMAIL: [Email yang authorize]
```

---

## Next Steps

1. ✅ Setup Google Sheets spreadsheet
2. ✅ Copy Code.gs ke Apps Script
3. ✅ Configure Script Properties
4. ✅ Deploy Web App
5. ✅ Update frontend form code
6. ✅ Test submissions
7. ✅ Monitor data in Sheets
8. ✅ Deploy landing page

---

## Support & Questions

Jika ada issues:

1. Check **Troubleshooting** section di atas
2. Check Apps Script **Execution logs**
3. Check browser **Console** (F12)
4. Verify all steps di setup guide ini

---

**Status: Ready for Setup**

Follow steps Phase 1-5 above untuk complete setup.
