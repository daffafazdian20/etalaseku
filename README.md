# 🚀 EtalaseKu Digital Hub & Academy — Full-Stack Web App

Aplikasi web publik *all-in-one* untuk katalog produk digital, platform kursus online (*academy*), dan otomasi penjualan instan. Dibangun menggunakan arsitektur modern **Frontend Terpisah (GitHub Pages)** dan **Google Apps Script (GAS) sebagai REST API JSON Murni**, bebas biaya server bulanan (*zero infrastructure cost*).

---

## 🌟 Fitur & Keunggulan Utama

1. **3D Realistic Butterfly Cursor Follower**:
   - Karakter kupu-kupu hidup 3D yang mengepakkan sayap secara alami dan mengikuti gerakan kursor pengguna dengan fisika inersia halus (*lerp smoothing*).
   - Efek jejak butiran cahaya berkilau (*fairy dust sparkle trail*) pada canvas dinamis.
2. **Kartu Produk & Tombol CTA Berkilau (*Interactive Glow & Shimmer*)**:
   - Efek aura menyala (*neon border glow*) dan sapuan kilauan (*shimmer sweep*) saat kursor diarahkan ke tombol aksi dan kartu produk.
3. **Multi-Image Auto-Slideshow**:
   - *Hero section* dilengkapi rotasi slide produk unggulan otomatis beserta *caption* dan indikator titik (*dots*).
   - Setiap kartu produk mendukung multi-gambar dengan transisi *cross-fade* otomatis.
4. **3D Flip Interactive Testimonial Cards**:
   - Kartu testimoni interaktif dengan efek 3D flip otomatis berurutan.
   - Efek menyala (*intense hover glow*) dan tombol pop-up untuk membaca cerita pencapaian lengkap siswa.
5. **Floating WhatsApp Chat Widget**:
   - Tombol mengambang di pojok kanan bawah dengan animasi *beacon radar pulse* dan kartu popover obrolan cepat berpesan otomatis (*pre-filled message*).
6. **Modul Tagihan & Pembayaran Siswa (`/gas-tagihan-pembayaran`)**:
   - Fitur pencarian tagihan siswa berbasis nomor WhatsApp terdaftar.
   - Pengecekan status tagihan (Belum Bayar, Jatuh Tempo, Lunas) dan form unggah bukti transfer langsung ke Google Drive.
7. **Modul CRM & Notifikasi WhatsApp Gateway (`/gas-notifikasi-wa-crm`)**:
   - Antrean non-blocking (`tb_antrian_notif`) dan sinkronisasi kontak otomatis (`tb_crm_kontak`).
   - Integrasi pengiriman pesan via Fonnte WhatsApp API Gateway dan kuitansi email resmi via `MailApp`.
8. **Keamanan & Skalabilitas Tinggi (`/gas-rahasia-script-properties` & `/gas-scale-turbo`)**:
   - Zero hardcoded secrets, token sesi HMAC stateless, PIN Admin ber-hash & salt, dan caching ber-chunking (`CacheX`).

---

## 📁 Struktur Folder Proyek

```text
1. Produk Digital Marketing/
├── PRD.md                       # Dokumen Spesifikasi Produk Lengkap
├── WIREFRAME_PROMPT.md          # 12-Screen Grayscale Wireframe Prompt
├── UIUX_DESIGN_PROMPT.md        # UI/UX Visual Prompt & Design Tokens
├── README.md                    # Panduan Instalasi & Deployment Ini
│
├── backend/
│   └── Kode.gs                  # REST API JSON Google Apps Script (doGet & doPost)
│
└── frontend/
    ├── index.html               # Antarmuka SPA Modern Responsif
    ├── css/
    │   └── style.css            # Desain Visual, Animasi 3D, & Efek Berkilau
    └── js/
        ├── config.js            # Konfigurasi URL GAS Endpoint
        └── app.js               # Mesin Aplikasi, Kupu-kupu 3D, Slideshow & Modals
```

---

## 🛠️ Langkah 1: Setup Backend Google Apps Script (GAS)

1. Buka browser dan kunjungi [Google Apps Script](https://script.google.com/).
2. Buat proyek baru dengan nama **"EtalaseKu Backend API"**.
3. Buka file `backend/Kode.gs` dari folder proyek Anda, salin seluruh kodenya, lalu tempelkan ke editor Apps Script (menggantikan kode bawaan).
4. **Jalankan Inisialisasi Otomatis**:
   - Pada dropdown pilihan fungsi di toolbar atas editor, pilih fungsi `setupAppEnvironment`.
   - Klik tombol **Run (Jalankan)** dan berikan izin akses Google Drive & Sheets.
   - Sistem akan otomatis membuat:
     - Folder Google Drive: `📁 EtalaseKu Digital Hub & Academy`
     - Folder Bukti Transfer: `📂 Uploads Bukti`
     - Google Spreadsheet Database dengan 11 tabel skema lengkap.
     - PIN Admin Default: `123456`
   - Buka menu **Execution log (Catatan eksekusi)** untuk melihat tautan spreadsheet database Anda.
5. **Deploy sebagai Web App REST API**:
   - Klik tombol **Deploy** di pojok kanan atas → **New deployment**.
   - Klik ikon gerigi (Select type) → pilih **Web app**.
   - Konfigurasi:
     - **Description**: `EtalaseKu Production v2.0`
     - **Execute as**: `Me (email Anda)`
     - **Who has access**: `Anyone (Siapa saja)`
   - Klik **Deploy** dan salin **Web app URL** yang berakhiran `/exec`.

---

## 🌐 Langkah 2: Hubungkan Frontend ke Backend

1. Buka file `frontend/js/config.js` di komputer Anda.
2. Tempelkan URL Web App GAS Anda ke variabel `GAS_URL`:
   ```javascript
   const APP_CONFIG = {
     GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
     BRAND_NAME: 'EtalaseKu Digital Hub & Academy',
     DEFAULT_WA_CS: '6281234567890', // Ganti dengan nomor WhatsApp CS Anda
     USE_MOCK_FALLBACK: false,        // Ubah jadi false saat live
     VERSION: '2.0.0'
   };
   ```
3. Simpan file `frontend/js/config.js`.

---

## 🚀 Langkah 3: Deploy Frontend ke GitHub Pages (`/github-pages-deploy-guide`)

1. **Buat Repositori Baru di GitHub**:
   - Buka [GitHub](https://github.com/) dan buat repositori baru (misal: `etalaseku-academy`, visibilitas: Public).
2. **Push Berkas Frontend via Terminal**:
   Buka terminal di dalam folder `frontend`:
   ```bash
   cd "c:\Users\Daffa Fazdian\OneDrive\Dokumen\Aplikasi & Skill\12. ANTIGRAVITY\Aplikasi\1. Produk Digital Marketing\frontend"
   git init
   git add .
   git commit -m "feat: initial commit EtalaseKu Digital Hub & Academy"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/etalaseku-academy.git
   git push -u origin main
   ```
3. **Aktifkan GitHub Pages**:
   - Di repositori GitHub, buka tab **Settings** → **Pages**.
   - Pada bagian **Build and deployment**:
     - Source: `Deploy from a branch`
     - Branch: `main` / folder `/ (root)`
   - Klik **Save**.
   - Dalam 1-2 menit, situs Anda akan aktif di:
     `https://USERNAME_ANDA.github.io/etalaseku-academy/`

---

## 🔑 Akses Dashboard Admin & CRM

- Klik tombol **Admin Portal ⚙️** di pojok kanan atas navbar situs.
- Masukkan PIN Admin Default: `123456`.
- Di dalam dashboard admin, Anda dapat:
  - Melihat ringkasan omset penjualan harian & pesanan lunas.
  - Memverifikasi transaksi pembayaran 1-klik (otomatis memicu pengiriman email kuitansi & pesan WhatsApp ke pembeli).
  - Mengelola data leads dan calon pendaftar antrean *Waitlist*.
