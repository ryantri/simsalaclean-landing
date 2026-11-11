# Simsalaclean Landing Page

Landing page pre-launch untuk Simsalaclean, layanan laundry online yang sedang dikembangkan di Jakarta Selatan.

## 📋 File Structure

```
.
├── index.html          # HTML utama (struktur dan konten)
├── styles.css          # Stylesheet (desain dan responsive)
├── script.js           # JavaScript (interaktivitas dan form handling)
├── README.md           # Dokumentasi ini
└── .env.example        # Template environment variables (untuk tahap integrasi Google Sheets)
```

## 🎯 Fitur Skeleton

Skeleton landing page ini mencakup:

### 1. **Header / Navigation**
- Logo Simsalaclean
- Menu navigasi (Beranda, Kenapa Simsalaclean, Cara Kerja, FAQ)
- CTA button "Gabung Early Access"
- Mobile menu responsif

### 2. **Hero Section**
- Eyebrow text
- Headline utama
- Supporting copy
- **Lead Form (above the fold)**
  - Field: Full Name, Instagram Username
  - Validasi real-time
  - Loading state saat submit
  - Error handling
  - Microcopy di bawah button
  - Privacy Policy link
- Visual placeholder (ilustrasi laundry bag)

### 3. **Problem & Solution Section**
- Headline dan supporting copy
- 3 benefit cards dengan icons

### 4. **How It Works Section**
- 3 langkah konseptual dengan nomor dan deskripsi
- Visual step numbers

### 5. **Brand Value Section**
- Headline dan supporting copy
- Background gradient primary color

### 6. **Early Access CTA Section**
- Headline dan supporting copy
- Button yang scroll kembali ke hero form

### 7. **FAQ Section**
- Accordion interaktif
- 5 pertanyaan umum
- Open/close animations

### 8. **Footer**
- Logo/wordmark
- Short description
- Menu links
- Privacy Policy link
- Copyright

### 9. **Modals**
- Privacy Policy modal (pop-up, bukan halaman terpisah)
- Thank You modal (muncul setelah form berhasil disubmit)

### 10. **Favicon**
- Monogram "SC" dengan warna primary teal

## 🎨 Design System

### Color Palette
- **Primary (Deep Teal)**: `#1a7c7c`
- **Primary Light**: `#2a9d9d`
- **Secondary (Soft Mint)**: `#a8ddd6`
- **Secondary Light**: `#d4e8e6`
- **Accent (Warm)**: `#f5a962`
- **Text Dark**: `#2c3e3e`
- **Text Light**: `#6b8485`
- **Background**: `#ffffff`
- **Background Light**: `#f8fafa`
- **Footer Dark**: `#1a3d3d`

### Typography
- **Font**: Inter (dari Google Fonts)
- **Font sizes**: xs (0.75rem) hingga 4xl (3rem)
- **Font weights**: 400, 500, 600, 700

### Spacing & Radius
- Menggunakan CSS variables untuk consistency
- Border radius: sm (0.5rem), md (0.875rem), lg (1rem)
- Shadows: sm, md, lg

## 📱 Responsive Design

Landing page responsive di:
- **Desktop**: Full layout dengan 2-column hero
- **Tablet** (≤768px): Adjusted spacing, flexible grid
- **Mobile** (≤480px): Single column, mobile menu, optimized form

### Key Points:
- Lead form tetap above the fold di mobile
- No horizontal scrolling
- Touch-friendly buttons dan inputs
- Mobile menu hamburger

## ⚙️ Functionality

### Form Validation
- **Full Name**: Min 2, max 100 karakter
- **Instagram Username**: 
  - Diterima dengan atau tanpa `@`
  - Max 30 karakter (setelah menghapus `@`)
  - Hanya alphanumeric, underscore, dan titik
  - Automatically normalized (remove @ if present)

### Form Behavior
- Real-time validation pada blur event
- Error messages yang jelas
- Loading state saat submit
- Prevent double submission
- Thank You modal setelah success (untuk sekarang simulasi 500ms delay)

### FAQ Accordion
- Single open (menutup FAQ lain saat membuka satu)
- Smooth open/close animations
- Icon rotation indicator

### Navigation
- Sticky header
- Smooth scroll untuk internal links
- Mobile menu toggle
- Auto-close mobile menu pada link click

### Modals
- Privacy Policy: Buka sebagai modal, tutup dengan close button atau Escape
- Thank You: Muncul setelah form submit, tutup dengan button atau Escape
- Prevent body scroll saat modal open
- Click outside untuk menutup (Privacy Policy dan Thank You)

## 🔗 Integration Points (Tahap Selanjutnya)

### Google Sheets Integration
Saat ini, form submit sudah siap untuk diintegrasikan dengan Google Apps Script. Placeholder ada di `script.js` (lihat comment di bagian form submission).

Untuk tahap ini:
- Form validation sudah jalan
- Error handling sudah implemented
- Loading state sudah visual
- Thank You modal sudah siap

Tahap berikutnya akan menambahkan:
1. Google Apps Script endpoint
2. Environment variable untuk Apps Script URL
3. Real form submission ke Google Sheets
4. Success confirmation dari backend

### Environment Variables
Saat ini tidak ada `.env` yang dibutuhkan. Nanti akan ditambahkan:
- `REACT_APP_GOOGLE_APPS_SCRIPT_URL` atau similar

## ✅ Verification Checklist

- [x] Seluruh copy menggunakan bahasa Indonesia (natural, bukan template)
- [x] Pre-launch messaging konsisten di semua section
- [x] Hero section visible above the fold
- [x] Lead form hanya memiliki Full Name dan Instagram Username
- [x] Both fields memiliki validasi
- [x] Error handling dan loading state
- [x] Thank You modal muncul setelah submit
- [x] Privacy Policy link membuka modal
- [x] Favicon ditampilkan
- [x] Responsive di desktop, tablet, mobile
- [x] No horizontal scrolling di mobile
- [x] FAQ accordion berfungsi
- [x] Smooth scroll untuk CTA buttons
- [x] Mobile menu toggle
- [x] Semantic HTML dan accessibility considerations
- [x] Tidak ada GTM atau GA4

## 🚀 Cara Membuka Secara Lokal

1. Buka file `index.html` di browser
   - Langsung double-click file, atau
   - Gunakan local server (recommended):
     ```bash
     # Dengan Python 3
     python -m http.server 8000
     
     # Atau dengan Node.js/npm
     npx serve
     ```

2. Akses di browser: `http://localhost:8000` (atau port yang ditampilkan)

3. Test fitur:
   - Coba navigasi ke setiap section
   - Test form validation (submit dengan field kosong, lihat error)
   - Test form dengan data valid, lihat Thank You modal
   - Buka Privacy Policy modal
   - Toggle FAQ accordion
   - Test responsive design di DevTools

## 📝 Copy & Content Notes

Semua copy dalam file HTML sudah sesuai dengan brief. Tidak ada lorem ipsum, data fiktif, atau klaim yang belum dikonfirmasi.

**Penting**: Landing page menekankan bahwa Simsalaclean masih dalam tahap pre-launch dan belum menerima pesanan. CTA hanya untuk "early access leads", bukan untuk order.

## 🔄 Next Steps

1. **Tahap 2**: Refinement visual dan polish UI (jika diperlukan)
2. **Tahap 3**: Implementasi Google Apps Script
3. **Tahap 4**: Integasi lead form dengan Google Sheets
4. **Tahap 5**: QA lengkap sebelum deployment
5. **Deployment**: Push ke GitHub, deploy di Vercel (atau service lain)

## ❓ FAQ (tentang Landing Page Development)

**Q: Bagaimana cara mengubah copy?**
A: Edit langsung di `index.html`. Cari section yang ingin diubah dan edit text-nya.

**Q: Bagaimana cara mengubah warna?**
A: Ubah CSS variables di bagian `:root` dalam `styles.css`.

**Q: Bagaimana menambahkan social media links?**
A: Tambahkan di footer section di `index.html`.

**Q: Bagaimana cara test form ke Google Sheets?**
A: Tunggu tahap integrasi Google Apps Script (Tahap 3-4).

**Q: Apa yang harus di-review?**
A: Lihat bagian "Review Checklist" di bawah.

## 👀 Review Checklist

Silakan review bagian-bagian berikut sebelum melanjutkan ke tahap selanjutnya:

### Visual & Design
- [ ] Apakah hero section menarik dan memorable?
- [ ] Apakah layout terasa lega dan tidak crowded?
- [ ] Apakah color palette (teal, mint, warm accent) cocok dengan brand?
- [ ] Apakah typography hierarchy jelas dan mudah dibaca?
- [ ] Apakah visual placeholder (laundry bag) pas dengan brand?

### Content & Messaging
- [ ] Apakah headline hero terasa compelling?
- [ ] Apakah supporting copy jelas dan persuasive (tidak terlalu formal)?
- [ ] Apakah Problem & Solution section resonates dengan target audience?
- [ ] Apakah brand value section communicate dengan baik?
- [ ] Apakah FAQ menjawab pertanyaan yang paling umum?

### Form & Lead Collection
- [ ] Apakah form terlihat prominent di hero section?
- [ ] Apakah dua field (Full Name & Instagram Username) tepat?
- [ ] Apakah microcopy "Gratis untuk bergabung..." membantu trust?
- [ ] Apakah validasi error message jelas dan helpful?
- [ ] Apakah Thank You modal message appropriate?

### User Experience
- [ ] Apakah navigation mudah digunakan?
- [ ] Apakah button/CTA text jelas dan compelling?
- [ ] Apakah Privacy Policy modal mudah diakses dan dibaca?
- [ ] Apakah FAQ accordion responsif dan smooth?

### Responsive & Technical
- [ ] Apakah halaman responsif di mobile, tablet, desktop?
- [ ] Apakah form mudah diisi di mobile?
- [ ] Apakah tidak ada yang terpotong atau overflow?
- [ ] Apakah favicon tampil di browser tab?

### Brand Consistency
- [ ] Apakah seluruh halaman konsisten dalam tone dan messaging?
- [ ] Apakah pre-launch positioning clear di semua section?
- [ ] Apakah tidak ada klaim layanan yang belum dikonfirmasi?
- [ ] Apakah tidak ada unsur yang terasa "templat" atau generic?

---

**Created with Kiro AI** | Simsalaclean Pre-Launch Landing Page | November 2026
