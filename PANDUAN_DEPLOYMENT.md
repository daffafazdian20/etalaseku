# 📘 BUKU PANDUAN LENGKAP DEPLOYMENT & PEMELIHARAAN APLIKASI
### **NexStore Produk Digital - by @daffafazdian.id**
*Versi Dokumen: 2026.11.06 | Arsitektur SPA Headless High-Performance (GAS Pro + Vercel / GitHub)*

---

## 📌 DAFTAR ISI
1. [Ringkasan Arsitektur & Struktur 10 File Mirror](#1-ringkasan-arsitektur--struktur-10-file-mirror)
2. [Panduan Deploy Standar: GitHub & Vercel (Produksi)](#2-panduan-deploy-standar-github--vercel-produksi)
3. [Pengamanan Token & Kredensial API](#3-pengamanan-token--kredensial-api)
4. [Panduan Jika Berganti Platform Hosting (Alternatif)](#4-panduan-jika-berganti-platform-hosting-alternatif)
   - [Opsi A: GitHub Pages](#opsi-a-deploy-ke-github-pages)
   - [Opsi B: Netlify](#opsi-b-deploy-ke-netlify)
   - [Opsi C: Cloudflare Pages](#opsi-c-deploy-ke-cloudflare-pages)
   - [Opsi D: Hosting Tradisional (cPanel / Apache / Nginx / VPS)](#opsi-d-deploy-ke-cpanel--apache--nginx)
5. [Panduan Operasional Fitur Server Maintenance dari Dashboard CRM](#5-panduan-operasional-fitur-server-maintenance)
6. [Troubleshooting & Checklist Rilis Produksi](#6-troubleshooting--checklist-rilis-produksi)

---

## 1. Ringkasan Arsitektur & Struktur 10 File Mirror

Aplikasi ini dibangun menggunakan arsitektur **Modern Decoupled Single-Page Application (SPA)**:
- **Frontend**: HTML5, CSS3 Modern (Plus Jakarta Sans, skema Sapphire Blue & Dark Slate), JavaScript murni tanpa ketergantungan framework berat.
- **Backend / Database**: Google Apps Script (GAS) Web App + Google Sheets sebagai database real-time.
- **Sistem Dual-Mirror (10 Mirror Files)**:
  Untuk memastikan kompatibilitas penuh di semua platform hosting (baik yang membaca file di root maupun di dalam folder `/frontend/`), aplikasi menggunakan **10 file identik**:
  ```
  ├── index.html                  <-- Root entry point
  ├── style.css                   <-- Root stylesheet
  ├── app.js                      <-- Root client logic
  ├── css/
  │   └── style.css               <-- Subfolder CSS
  ├── js/
  │   ├── app.js                  <-- Subfolder JS
  │   └── config.js               <-- Config runtime
  └── frontend/
      ├── index.html              <-- Subfolder frontend entry point
      ├── style.css               <-- Subfolder frontend style
      ├── app.js                  <-- Subfolder frontend app
      ├── css/
      │   └── style.css           <-- Subfolder frontend css
      └── js/
          └── app.js              <-- Subfolder frontend js
  ```
  > ⚠️ **Aturan Emas**: Setiap perubahan pada file root (`index.html`, `style.css`, `app.js`) harus selalu disinkronkan ke seluruh file mirror agar memiliki 100% byte parity!

---

## 2. Panduan Deploy Standar: GitHub & Vercel (Produksi)

Deployment aktif saat ini terhubung langsung dari repositori Git ke **Vercel**:
- **Repositori Git**: `https://github.com/daffafazdian20/etalaseku.git`
- **Domain Live**: `https://portalkelas-etalasekubydaffafazadia.vercel.app`

### Langkah-Langkah Deploy & Update:
1. **Periksa Status Git**:
   ```bash
   git status
   ```
2. **Tambahkan Perubahan ke Staging**:
   ```bash
   git add .
   ```
3. **Commit dengan Pesan Jelas**:
   ```bash
   git commit -m "feat: upgrade sistem desain sapphire unified metrics dan maintenance mode"
   ```
4. **Push ke Kedua Branch (Dual-Push `main` & `master`)**:
   ```bash
   git push origin main
   git push origin main:master
   ```
5. **Otomatisasi Vercel**:
   Vercel akan mendeteksi push pada branch `main` atau `master` dan secara instan mempublikasikan versi terbaru dalam hitungan detik.

### Konfigurasi `vercel.json` (Proteksi Keamanan):
File `vercel.json` di root telah disetel dengan:
- **Clean URLs**: Mengaktifkan navigasi URL bersih tanpa ekstensi `.html`.
- **Security Headers**: HSTS, CSP (Content Security Policy), X-Frame-Options SAMEORIGIN, X-Content-Type nosniff.
- **Route Blocking**: Memblokir akses publik ke folder internal `/.git`, `/.env`, dan folder temporary `/scratch`.
- **SPA Rewrites**: Mengarahkan semua rute dinamis ke `index.html`.

---

## 3. Pengamanan Token & Kredensial API

Sesuai standar keamanan modern:
1. **Zero Literal Secrets**:
   - Jangan pernah meletakkan API Key rahasia (seperti Token Fonnte WhatsApp, Private Secret HMAC, atau kredensial database) secara terang-terangan di file frontend JavaScript.
2. **Google Apps Script Properties**:
   - Di sisi backend Google Apps Script, simpan token pada **Project Settings > Script Properties**:
     * `FONNTE_TOKEN` = Token WhatsApp dari Fonnte.
     * `HMAC_SECRET` = Kunci acak untuk menghasilkan QR verifikasi transaksi resmi.
     * `ADMIN_MASTER_PIN` = PIN verifikasi Super Admin.
3. **Environment Variables di Vercel / Hosting**:
   - Jika Anda menambahkan fungsi serverless Node.js di folder `/api`, tambahkan variabel lingkungan di dashboard Vercel (**Project Settings > Environment Variables**).

---

## 4. Panduan Jika Berganti Platform Hosting (Alternatif)

Jika di kemudian hari Anda ingin memindahkan hosting dari Vercel ke layanan lain, ikuti panduan berikut:

### OPSI A: Deploy ke GitHub Pages
Cocok untuk hosting gratis langsung dari repositori GitHub Anda.
1. Buka repositori di GitHub: `https://github.com/daffafazdian20/etalaseku`
2. Klik tab **Settings** > **Pages** (di menu sebelah kiri).
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`.
   - **Branch**: Pilih `main` (atau `master`) dan folder `/ (root)`.
   - Klik **Save**.
4. Tunggu 1–2 menit, link GitHub Pages Anda akan aktif di format:
   `https://daffafazdian20.github.io/etalaseku/`
5. **Catatan Penting**: Karena GitHub Pages tidak mendukung `vercel.json`, tambahkan file `404.html` yang isinya menduplikasi `index.html` jika Anda menggunakan navigasi history.

---

### OPSI B: Deploy ke Netlify
Layanan hosting alternatif yang sangat cepat dan kompatibel dengan static SPA.
1. Buka [Netlify.com](https://www.netlify.com) dan login dengan akun GitHub Anda.
2. Klik **Add new site** > **Import an existing project** > **GitHub**.
3. Pilih repositori `etalaseku`.
4. Pengaturan Build:
   - **Base directory**: kosongkan (default root).
   - **Build command**: kosongkan (karena merupakan static SPA tanpa compiler).
   - **Publish directory**: `.` (titik atau root).
5. Buat file `_redirects` di root dengan isi:
   ```text
   /*    /index.html   200
   ```
6. Klik **Deploy site**.

---

### OPSI C: Deploy ke Cloudflare Pages
Sangat cocok jika ingin performa CDN global super cepat dan proteksi DDoS gratis tak terbatas.
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Klik **Create application** > **Pages** > **Connect to Git**.
3. Pilih repositori `etalaseku`.
4. Konfigurasi:
   - **Framework preset**: `None`.
   - **Build command**: kosongkan.
   - **Build output directory**: `.`.
5. Klik **Save and Deploy**.

---

### OPSI D: Deploy ke cPanel / Apache / Nginx
Jika ingin menempatkan website di shared hosting cPanel atau VPS sendiri:
1. **cPanel File Manager**:
   - Buka cPanel > **File Manager** > buka folder `public_html/`.
   - Upload seluruh file dan folder repositori ini.
   - Pastikan file `.htaccess` dibuat dengan konfigurasi mod_rewrite berikut:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       # Cegah akses ke folder .git dan file sensitif
       RewriteRule ^\.git - [F,L]
       RewriteRule ^\.env - [F,L]
       # Rute SPA ke index.html
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```
2. **Nginx (VPS)**:
   - Tambahkan blok konfigurasi:
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     location ~ /\.(git|env) {
       deny all;
     }
     ```

---

## 5. Panduan Operasional Fitur Server Maintenance

Website kini dilengkapi dengan **Sistem Mode Pemeliharaan (Server Maintenance)** terintegrasi yang dapat dikendalikan langsung oleh Pengelola/Admin tanpa menyentuh kode program.

### Cara Mengaktifkan Server Maintenance:
1. Buka website dan klik tombol **Admin Portal** di kanan atas (atau tekan pintasan `openAdminModal()`).
2. Masukkan PIN Admin (Default Super Admin: `123456`).
3. Pada sidebar CRM, klik menu **Server Maintenance** (dengan ikon obeng/server).
4. Geser saklar switch **Status Mode Server Maintenance** menjadi **ON**.
5. Sesuaikan formulir jika ingin mengubah:
   - **Judul**: misal *"Pemeliharaan Server & Pembaruan Sistem"*
   - **Estimasi Selesai**: misal *"± 30 Menit"* atau *"19.00 WIB"*
   - **Pesan Penjelasan**: Pesan khusus bagi para member/pengunjung.
   - **Beri Akses Member**: Centang jika member yang sedang belajar tetap diizinkan membuka materi kelas.
6. Klik **Simpan Pengaturan Maintenance**.
7. **Hasil Seketika**: Pengunjung umum yang membuka website akan langsung melihat layar pemeliharaan profesional ber-animasi dengan tombol WhatsApp Admin dan tombol muat ulang halaman.

### Cara Mematikan Server Maintenance:
1. Buka website (sebagai admin, layar pemeliharaan dilengkapi tombol **Admin Bypass** di bagian bawah kartu).
2. Masuk ke CRM > menu **Server Maintenance**.
3. Geser saklar switch menjadi **OFF** dan klik **Simpan Pengaturan Maintenance**.
4. Website langsung kembali online untuk seluruh publik secara instan.

---

## 6. Troubleshooting & Checklist Rilis Produksi

| Gejala Masalah | Penyebab Umum | Solusi Cepat |
| :--- | :--- | :--- |
| Perubahan kode tidak muncul di browser pengguna | Browser caching | Naikkan versi parameter query cache pada tag `<link>` dan `<script>` di `index.html` (misal dari `?v=20261106-01` ke versi berikutnya). |
| Layar Maintenance terus muncul padahal sudah dimatikan | Cache localStorage | Buka DevTools > Application > Storage > Clear `nexstore_maintenance_settings` atau klik tombol Muat Ulang. |
| Tombol hero tidak muncul di mobile | Switch OFF di CRM | Buka CRM > menu **Thumball Editing** > pastikan switch ON untuk tombol aksi yang ingin ditampilkan. |
| Form tidak bisa submit / pesan "terlalu banyak permintaan" | Proteksi Rate Limiting aktif | Ini adalah fitur keamanan sistem (Upgrade Point 10) yang mencegah spam. Cukup tunggu 60 detik sebelum submit kembali. |
| Ada ketidaksesuaian tampilan saat dibuka di subdirectory | Perbedaan file mirror | Jalankan sinkronisasi 10 file mirror untuk memastikan file di `root`, `/css`, `/js`, dan `/frontend` memiliki byte yang identik. |

---
*Dokumen ini dibuat otomatis sebagai referensi teknis resmi operasional sistem NexStore Digital.*
