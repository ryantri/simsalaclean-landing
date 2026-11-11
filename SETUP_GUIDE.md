# Simsalaclean Landing Page - Setup Guide

Panduan lengkap untuk menjalankan landing page Simsalaclean secara lokal dan deploy ke production.

## 🏃 Quick Start (Lokal)

### Opsi 1: Direct File Opening
1. Buka file `index.html` dengan double-click
2. Browser akan membuka landing page
3. Selesai!

**Catatan**: Beberapa fitur JavaScript mungkin tidak bekerja sempurna jika dibuka langsung sebagai file (karena CORS limitations). Gunakan local server untuk testing yang lebih baik.

### Opsi 2: Local Server (Recommended)

#### Dengan Python 3
```bash
cd /Users/ryantrinugraha/Downloads/LP\ Mentor\ Simulation
python -m http.server 8000
```
Akses di: `http://localhost:8000`

#### Dengan Node.js
```bash
cd /Users/ryantrinugraha/Downloads/LP\ Mentor\ Simulation
npx serve
```

#### Dengan PHP
```bash
cd /Users/ryantrinugraha/Downloads/LP\ Mentor\ Simulation
php -S localhost:8000
```

## 📁 File Structure

```
simsalaclean-landing/
├── index.html              # HTML structure & content
├── styles.css              # CSS styling & responsive design
├── script.js               # JavaScript interactivity
├── .env.example            # Environment variables template
├── README.md               # Project overview & checklist
├── SETUP_GUIDE.md          # Panduan ini
└── DEPLOYMENT.md           # Deployment instructions (opsional)
```

## ✅ Pre-Deployment Checklist

Sebelum deploy ke production, pastikan:

### Content
- [x] Seluruh copy sudah review dan approved
- [x] Tidak ada lorem ipsum atau placeholder text
- [x] Tidak ada klaim layanan yang belum dikonfirmasi
- [x] Pre-launch messaging konsisten
- [x] Privacy Policy content sudah final

### Functionality
- [x] Form validation berjalan sempurna
- [x] Error messages jelas dan helpful
- [x] Loading state visible saat submit
- [x] FAQ accordion smooth dan responsif
- [x] Mobile menu toggle berfungsi
- [x] Modal (Privacy Policy & Thank You) work as expected

### Design & Responsive
- [x] Layout terlihat bagus di desktop
- [x] Layout responsif di tablet
- [x] Layout responsif di mobile (tested di iPhone SE 375px, iPhone 12 390px, iPhone 14 430px)
- [x] No horizontal scrolling
- [x] Form above the fold di semua device sizes
- [x] Favicon tampil di browser tab

### Performance
- [x] CSS load cepat (inline, tidak banyak external requests)
- [x] JavaScript efficient (vanilla JS, tidak perlu bundling)
- [x] Tidak ada unused CSS atau JS
- [x] Images optimized (SVG untuk favicon)

### Accessibility
- [x] Semantic HTML (header, nav, section, footer)
- [x] Form labels terhubung dengan input
- [x] Button text jelas dan descriptive
- [x] Color contrast memadai
- [x] Keyboard navigation support (Tab, Enter, Escape)

### Security
- [x] Tidak ada credential atau secret di frontend
- [x] Form validation di client-side (+ akan ada di backend nanti)
- [x] Privacy Policy visible dan accessible
- [x] No external tracking (GTM/GA4 excluded sesuai requirement)

## 🚀 Deployment Options

### Opsi 1: Vercel (Recommended)

**Keuntungan:**
- Free tier memadai untuk landing page
- Automatic deployments dari Git
- Great performance dengan CDN global
- Built-in SSL/HTTPS
- Easy custom domain

**Steps:**
1. Push ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Simsalaclean landing page"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/simsalaclean-landing.git
   git push -u origin main
   ```

2. Buka https://vercel.com
3. Sign up / Log in
4. Import GitHub repository
5. Konfigurasi:
   - Framework: None (static)
   - Build command: (kosong)
   - Output directory: (kosong)
   - Environment variables: (tidak ada yang dibutuhkan saat ini)
6. Deploy!

**Custom Domain:**
1. Di Vercel dashboard, buka project > Settings > Domains
2. Tambahkan domain kamu
3. Update DNS di registrar kamu sesuai instruksi Vercel

### Opsi 2: Netlify

**Keuntungan:**
- Free tier generous
- Deploy dari Git atau manual drag-drop
- Form handling built-in (optional, future)
- Great for static sites

**Steps:**
1. Buka https://netlify.com
2. Sign up / Log in dengan GitHub
3. Click "New site from Git"
4. Pilih repository simsalaclean-landing
5. Konfigurasi default sudah pas
6. Deploy!

### Opsi 3: GitHub Pages

**Keuntungan:**
- Gratis
- Langsung terintegrasi dengan GitHub
- Cocok untuk portfolio atau project kecil

**Steps:**
1. Rename repo menjadi `simsalaclean-landing` (atau nama lain)
2. Di Settings > Pages, set Source ke "Deploy from a branch"
3. Pilih branch "main"
4. GitHub akan deploy otomatis
5. Akses di: `https://YOUR_USERNAME.github.io/simsalaclean-landing`

### Opsi 4: Custom Server / VPS

Jika pakai custom server (AWS, DigitalOcean, Linode, dll):

1. SSH ke server
2. Clone repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/simsalaclean-landing.git
   cd simsalaclean-landing
   ```
3. Setup web server (Nginx/Apache)
4. Setup SSL dengan Let's Encrypt
5. Point domain ke server

## 🔧 Environment Configuration

Saat ini, tidak ada `.env` yang dibutuhkan untuk landing page skeleton ini.

Setelah Google Apps Script integration ditambahkan, kamu akan perlu:

```env
REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercopy/exec
```

## 🧪 Testing Before Deployment

### Testing Checklist

#### Functionality Testing
1. **Form Submission**
   - [ ] Submit dengan nama lengkap saja → Error
   - [ ] Submit dengan Instagram username saja → Error
   - [ ] Submit dengan kedua field kosong → Error
   - [ ] Submit dengan nama < 2 karakter → Error
   - [ ] Submit dengan nama valid → Success (Thank You modal)
   - [ ] Submit dengan Instagram username dengan @ → Success & normalized
   - [ ] Submit dengan Instagram username invalid chars → Error

2. **Navigation**
   - [ ] Klik setiap link di header → smooth scroll ke section
   - [ ] Klik "Gabung Early Access" buttons → scroll ke form
   - [ ] Mobile menu toggle → open/close smooth
   - [ ] Mobile menu link click → close menu & scroll

3. **Modals**
   - [ ] Privacy Policy link → modal opens
   - [ ] Modal close button → closes
   - [ ] Click outside modal → closes
   - [ ] Press Escape → closes
   - [ ] Thank You modal → appears after form submit
   - [ ] Thank You button → closes modal

4. **Accordion**
   - [ ] Click FAQ question → answer appears
   - [ ] Click another FAQ → previous closes, new opens
   - [ ] Click same FAQ again → closes
   - [ ] Icon rotation smooth

#### Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Device Testing
- [ ] iPhone 5/SE (375px width)
- [ ] iPhone 12/13/14 (390px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px width)
- [ ] Tablet landscape

#### Performance Testing
1. DevTools > Network
   - [ ] Total file size < 500KB
   - [ ] Load time < 3 seconds
   - [ ] Lighthouse score > 90

2. DevTools > Lighthouse
   - [ ] Performance ≥ 90
   - [ ] Accessibility ≥ 90
   - [ ] Best Practices ≥ 90
   - [ ] SEO ≥ 90

#### Accessibility Testing
- [ ] Tab through page → dapat navigate ke semua interactive elements
- [ ] Form labels properly associated
- [ ] Color contrast checked (WCAG AA minimum)
- [ ] Screen reader test (optional, manual QA)

## 📋 Post-Deployment Checklist

Setelah deploy ke production:

1. **Verify Deployment**
   - [ ] Website accessible dari custom domain
   - [ ] Tidak ada 404 errors
   - [ ] HTTPS working
   - [ ] Favicon visible

2. **Cross-Browser Testing**
   - [ ] Test di Chrome, Firefox, Safari, Edge
   - [ ] Test form submission
   - [ ] Test modals dan FAQ

3. **Mobile Testing**
   - [ ] Test di real mobile devices
   - [ ] Test form di mobile (tap, swipe, etc)
   - [ ] Test landscape orientation

4. **Analytics Setup** (tahap selanjutnya)
   - [ ] Setup Google Tag Manager (jika diperlukan)
   - [ ] Setup Google Analytics 4 (jika diperlukan)
   - [ ] Track form submissions (jika diperlukan)

5. **Monitoring**
   - [ ] Setup uptime monitoring
   - [ ] Setup error logging (optional)

## 🐛 Troubleshooting

### Form tidak submit / Error muncul

**Possible causes:**
1. JavaScript tidak load → Check browser console (F12 > Console tab)
2. Form validation error → Check error message di form
3. Browser compatibility issue → Try different browser

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab untuk errors
3. Lihat Network tab untuk failed requests
4. Check HTML elements (Inspect Element)

### Modal tidak terbuka

**Possible causes:**
1. JavaScript error → Check console
2. Modal element hidden → Check CSS di DevTools

**Solution:**
1. Click Privacy Policy link
2. Open DevTools > Console
3. Lihat apakah ada error message
4. Try manual: `document.getElementById('privacyModal').classList.add('open')`

### Mobile responsiveness issues

**Possible causes:**
1. Viewport meta tag missing → Check di `<head>`
2. CSS media query tidak work → Check styles.css
3. Element width too wide → Check CSS width properties

**Solution:**
1. Open DevTools > Device Toolbar (Ctrl/Cmd + Shift + M)
2. Select different device sizes
3. Resize window dan lihat breakpoints

### Performance issues

**Possible causes:**
1. Large images → Check Network tab (tapi harusnya hanya SVG)
2. Unoptimized CSS/JS → Tidak ada, file minimal
3. External requests → Hanya Google Fonts, tidak ada blocking

**Solution:**
1. DevTools > Lighthouse
2. Run Performance audit
3. Lihat recommendations

## 📞 Support & Questions

### Common Questions

**Q: Bagaimana cara update copy setelah deploy?**
A: Edit file HTML, commit & push ke GitHub. Vercel/Netlify otomatis redeploy dalam beberapa detik.

**Q: Bagaimana tracking form submissions?**
A: Integrasi Google Sheets akan ditambahkan di tahap berikutnya.

**Q: Bagaimana setup email notifications saat ada new lead?**
A: Bisa setup automation di Google Sheets (Apps Script notifications) atau pake third-party service seperti Zapier.

**Q: Bagaimana redirect ke landing page dari URL lain?**
A: Tergantung platform hosting. Untuk Vercel: setup di `vercel.json` dengan redirects. Untuk Netlify: setup di `_redirects` file.

## 📚 Resources

- [HTML Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/semantics)
- [CSS Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

**Last Updated**: November 2026
