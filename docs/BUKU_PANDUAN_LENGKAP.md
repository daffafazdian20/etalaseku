# 📖 BUKU PANDUAN LENGKAP & PRAKTIS
## **EtalaseKu Digital Hub & Academy**
*Panduan Langkah demi Langkah Membangun, Menjalankan, dan Mengelola Website E-Commerce Produk Digital & Kursus Online*

---

Selamat datang! Buku panduan ini disusun khusus dengan bahasa yang ramah, jelas, dan mudah dipahami bagi siapa saja (termasuk pemula) agar Anda tidak mengalami kesulitan dalam menjalankan dan meluncurkan website **EtalaseKu Digital Hub & Academy**.

---

## 📑 DAFTAR ISI
1. [BAB 1: Mengenal Struktur Berkas & Uji Coba Langsung di Komputer](#bab-1-mengenal-struktur-berkas--uji-coba-langsung-di-komputer)
2. [BAB 2: Setup Otomatis Database (Google Sheets & Drive) Sekali Klik](#bab-2-setup-otomatis-database-google-sheets--drive-sekali-klik)
3. [BAB 3: Deploy Backend Google Apps Script (Mendapatkan URL API)](#bab-3-deploy-backend-google-apps-script-mendapatkan-url-api)
4. [BAB 4: Menghubungkan Frontend ke Backend](#bab-4-menghubungkan-frontend-ke-backend)
5. [BAB 5: Upload Website ke Internet via GitHub Pages (Gratis Selamanya)](#bab-5-upload-website-ke-internet-via-github-pages-gratis-selamanya)
6. [BAB 6: Panduan Pengoperasian Fitur-Fitur Interaktif](#bab-6-panduan-pengoperasian-fitur-fitur-interaktif)
7. [BAB 7: Panduan Penggunaan Dashboard Admin & CRM Penjualan](#bab-7-panduan-penggunaan-dashboard-admin--crm-penjualan)
8. [BAB 8: Tanya-Jawab & Solusi Kendala (Troubleshooting FAQ)](#bab-8-tanya-jawab--solusi-kendala-troubleshooting-faq)

---

## BAB 1: Mengenal Struktur Berkas & Uji Coba Langsung di Komputer

Folder proyek Anda memiliki susunan sebagai berikut:

```text
📁 1. Produk Digital Marketing/
├── 📄 PRD.md                       -> Dokumen spesifikasi kebutuhan aplikasi
├── 📄 WIREFRAME_PROMPT.md          -> Prompt wireframe 12 layar untuk Google Stitch
├── 📄 UIUX_DESIGN_PROMPT.md        -> Panduan warna HEX, font, & styling visual
├── 📄 BUKU_PANDUAN_LENGKAP.md      -> Buku panduan pengoperasian (berkas ini)
├── 📄 README.md                    -> Ringkasan teknis proyek
│
├── 📁 backend/
│   └── 📄 Kode.gs                  -> Seluruh kode mesin server Google Apps Script
│
└── 📁 frontend/
    ├── 📄 index.html               -> Halaman utama website (tampilan visual)
    ├── 📁 css/
    │   └── 📄 style.css            -> Efek kilau, animasi kupu-kupu 3D, & tata letak
    └── 📁 js/
        ├── 📄 config.js            -> Pengaturan alamat link backend & nomor WhatsApp
        └── 📄 app.js               -> Logika gerak kupu-kupu, slideshow, & form belanja
```

### 🎯 Cara Mencoba Website Langsung (Tanpa Internet / Server)
1. Buka folder `frontend` di File Explorer komputer Anda.
2. Cari berkas bernama **`index.html`**.
3. **Klik dua kali berkas tersebut**.
4. Website akan langsung terbuka di browser Anda (Google Chrome / Edge).
5. Anda dapat langsung menggerakkan mouse untuk melihat **kupu-kupu 3D yang hidup dan mengikuti kursor**, melihat **slideshow produk otomatis**, mengarahkan mouse ke **testimoni yang berputar 3D (flip)**, dan mencoba tombol WhatsApp melayang.

---

## BAB 2: Setup Otomatis Database (Google Sheets & Drive) Sekali Klik

Anda **TIDAK PERLU** membuat tabel-tabel di Spreadsheet secara manual satu per satu. Sistem sudah dilengkapi dengan fitur *auto-setup* sekali klik!

### Langkah-Langkah:
1. Buka browser dan buka situs: **[https://script.google.com/](https://script.google.com/)**.
2. Pastikan Anda sudah login dengan akun Google Anda.
3. Klik tombol **"Proyek Baru" (New Project)** di pojok kiri atas.
4. Beri nama proyek di kiri atas, misalnya: **"EtalaseKu Backend API"**.
5. Pada editor kode yang muncul, hapus semua kode bawaan `function myFunction() { ... }`.
6. Buka berkas **`backend/Kode.gs`** di komputer Anda, salin (**Copy**) seluruh isinya, lalu tempel (**Paste**) ke editor Google Apps Script tersebut.
7. Klik ikon **Simpan** (ikon disket 💾 atau tekan `Ctrl + S`).
8. **Jalankan Inisialisasi Otomatis**:
   - Di toolbar bagian atas, cari dropdown yang bertuliskan fungsi (biasanya tertulis `doGet` atau `doPost`).
   - Klik dropdown tersebut dan pilih fungsi: **`setupAppEnvironment`**.
   - Klik tombol **"Run" (Jalankan) ▶️**.
9. **Memberikan Izin Akses (Authorization)**:
   - Akan muncul jendela popup bertuliskan *"Authorization required"*. Klik **Review permissions**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, jangan khawatir! Klik tulisan kecil **Advanced** (Lanjutan) di bawah, lalu klik **"Go to EtalaseKu Backend API (unsafe)"**.
   - Klik tombol **Allow (Izinkan)**.
10. Tunggu 5-10 detik sampai muncul keterangan di *Execution log*:
    ```text
    ✅ Setup Berhasil! Spreadsheet: https://docs.google.com/spreadsheets/d/...
    🔐 PIN Admin Default diinisialisasi: 123456
    ```
11. Buka Google Drive Anda, sekarang otomatis sudah tersedia:
    - Folder: `📁 EtalaseKu Digital Hub & Academy`
    - Folder: `📂 Uploads Bukti` (untuk menampung foto transfer pembeli)
    - File Spreadsheet: `🗃️ Database — EtalaseKu Digital Hub & Academy` (lengkap dengan 11 lembar sheet siap pakai).

---

## BAB 3: Deploy Backend Google Apps Script (Mendapatkan URL API)

Agar website bisa membaca data produk dan menerima pesanan dari pembeli, kita perlu menerbitkan script menjadi Web App:

1. Di halaman editor Google Apps Script tadi, klik tombol biru **Deploy** di pojok kanan atas → pilih **New deployment**.
2. Klik ikon gerigi (roda gigi ⚙️) di sebelah kiri *"Select type"*, lalu pilih **Web app**.
3. Isi formulir pengaturan sebagai berikut:
   - **Description**: `Versi 1.0 Produksi`
   - **Execute as**: Pilih **Me (emailanda@gmail.com)** *(Sangat penting agar pembeli bisa upload bukti ke Drive Anda)*.
   - **Who has access**: Pilih **Anyone (Siapa saja)** *(Sangat penting agar website dapat diakses publik tanpa login Google)*.
4. Klik tombol **Deploy**.
5. Jika diminta verifikasi lagi, klik *Review permissions* dan izinkan seperti langkah sebelumnya.
6. Salin teks yang ada di kotak **Web app URL** (URL ini berakhiran `/exec`).  
   *Contoh URL: `https://script.google.com/macros/s/AKfycbxAbCdEf123456789/exec`*

---

## BAB 4: Menghubungkan Frontend ke Backend

Sekarang kita hubungkan website visual Anda ke database Google:

1. Buka folder `frontend/js/` di komputer Anda.
2. Buka berkas **`config.js`** menggunakan aplikasi Text Editor (Notepad, VS Code, atau Notepad++).
3. Cari baris berikut:
   ```javascript
   GAS_URL: 'https://script.google.com/macros/s/AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo/exec',
   ```
4. Ganti URL demo tersebut dengan **Web app URL** yang Anda salin pada BAB 3 di atas.
5. Sesuaikan nomor WhatsApp CS Anda:
   ```javascript
   DEFAULT_WA_CS: '6281234567890', // Masukkan nomor WA Anda diawali 62 (tanpa tanda + atau spasi)
   ```
6. Ubah `USE_MOCK_FALLBACK` menjadi `false`:
   ```javascript
   USE_MOCK_FALLBACK: false,
   ```
7. Simpan file (**Ctrl + S**). Sekarang website Anda sudah terhubung 100% secara langsung ke Google Sheets & Google Drive Anda!

---

## BAB 5: Upload Website ke Internet via GitHub Pages (Gratis Selamanya)

Ada 2 cara mudah agar website Anda memiliki alamat domain internet sendiri (misal: `https://nama-anda.github.io/etalaseku/`) dan dapat dibuka dari HP siapa saja secara online:

### 🌟 Cara Paling Mudah: Upload via Website GitHub (Tanpa Terminal)
1. Buka situs **[https://github.com/](https://github.com/)** dan buat akun jika belum punya.
2. Klik tombol hijau **New** (atau tanda `+` di kanan atas → **New repository**).
3. Beri nama repositori, misalnya: `etalaseku`.
4. Pilih opsi **Public**, lalu klik **Create repository**.
5. Pada halaman yang muncul, cari tulisan *"uploading an existing file"*. Klik link tersebut.
6. Buka folder `frontend` di komputer Anda.
7. Tarik (*drag & drop*) seluruh isi di dalam folder `frontend` (berkas `index.html`, folder `css`, dan folder `js`) ke dalam kotak upload GitHub.
8. Tunggu hingga semua berkas selesai terunggah, lalu klik tombol hijau **Commit changes** di bagian bawah.
9. **Mengaktifkan Website**:
   - Di repositori GitHub Anda, klik menu **Settings** (tab paling kanan).
   - Di menu sebelah kiri, klik **Pages**.
   - Pada bagian **Branch**, ubah dari `None` menjadi **`main`** (atau `master`), lalu pastikan foldernya `/ (root)`.
   - Klik tombol **Save**.
10. Tunggu sekitar 1-2 menit, lalu refresh halaman tersebut. Akan muncul kotak hijau bertuliskan:  
    `Your site is live at https://username.github.io/etalaseku/`  
    *Selamat! Website Anda sudah online di internet dan bisa disebarkan ke pembeli!*

---

## BAB 6: Panduan Pengoperasian Fitur-Fitur Interaktif

Website Anda dirancang dengan teknologi modern untuk memikat calon pembeli:

1. **🦋 Karakter Kupu-Kupu 3D Hidup**:
   - Kupu-kupu memiliki sayap transparan yang mengepak dinamis mengikuti kecepatan kursor.
   - Saat kursor bergerak cepat, kepakan sayap makin cepat; saat kursor berhenti, kupu-kupu meluncur anggun dan mengeluarkan jejak butiran cahaya (*sparkles*).
   - Di perangkat HP layar sentuh, kupu-kupu akan terbang menghampiri titik sentuhan jari Anda.
2. **✨ Tombol & Kartu Berkilau Menyala**:
   - Setiap tombol utama (*CTA*) memiliki efek kilauan putih yang menyapu permukaannya secara berkala.
   - Kartu produk memiliki garis tepi neon (*gradient border glow*) yang menyala saat kursor didekatkan.
3. **🖼️ Slideshow Otomatis**:
   - Bagian atas (*Hero Section*) berganti gambar dan deskripsi setiap 4.5 detik.
   - Setiap kartu produk di katalog memiliki beberapa slide foto produk yang berganti otomatis secara halus (*cross-fade*).
4. **🔄 Testimoni 3D Flip (Berputar)**:
   - Kartu testimoni berputar bolak-balik sendiri setiap 6 detik sehingga pengunjung penasaran membaca hasil pencapaian siswa.
   - Pengunjung bisa mengarahkan kursor untuk membalik kartu secara manual atau mengklik kartu untuk memunculkan **jendela pop-up cerita lengkap**.
5. **💳 Formulir Cek Tagihan Siswa (`/gas-tagihan-pembayaran`)**:
   - Siswa atau member dapat mengklik tombol **"💳 Cek Tagihan"** di navbar.
   - Cukup masukkan nomor WhatsApp, sistem akan langsung menampilkan rincian tagihan (SPP bulanan, biaya bimbingan, dsb.). Siswa bisa langsung upload bukti bayar di tempat.
6. **💬 Tombol WhatsApp Melayang**:
   - Tombol hijau di pojok kanan bawah selalu berdenyut (*beacon pulse*).
   - Saat diklik, muncul kotak chat ramah dengan pesan pengantar otomatis yang siap dikirim langsung ke WhatsApp Anda.

---

## BAB 7: Panduan Penggunaan Dashboard Admin & CRM Penjualan

Anda dapat memantau penjualan dan mengelola pesanan tanpa perlu membuka Google Sheets:

### 1. Masuk ke Panel Admin & CRM
- Buka website Anda, lalu klik tombol **"Admin Portal ⚙️"** di pojok kanan atas navbar.
- Masukkan PIN Keamanan default: **`123456`**.
- Seketika antarmuka website akan bertransformasi menjadi **Suite Dashboard Admin & CRM Penuh Layar (Full-Screen)** dengan bilah navigasi kiri (*sidebar*) berwarna *Deep Midnight Navy* (`#0F172A`) sesuai dokumen desain UI/UX.

### 2. Navigasi 9 Menu Utama Dashboard Admin & CRM Suite
Di bilah navigasi kiri, tersedia 9 modul lengkap:
1. **📊 Dashboard & Analitik**: Memantau total omset, jumlah transaksi lunas, kuota batch, dan tabel verifikasi cepat.
2. **🛍️ Pesanan & Verifikasi**: Seluruh riwayat pesanan pembeli lengkap dengan tombol **"Lihat Bukti ↗"** (foto transfer Google Drive) dan tombol 1-klik **"Verifikasi Lunas 🚀"** yang otomatis memicu pengiriman email kuitansi & pesan WhatsApp akses kelas ke pembeli.
3. **📦 Katalog Produk (+ Input Cepat Inline Tanpa Keluar Portal)**:
   - Dilengkapi tombol **"⚡ Form Cepat Inline"** yang langsung membuka form isian produk di dalam dashboard tanpa modal dan tanpa keluar portal.
   - Serta tombol **"+ Tambah Produk Baru 📦"** (modal berlapislapis di atas dashboard).
   - Masukkan Nama Produk, Kategori, Harga Normal, Harga Promo, dan Kuota Kursi Batch.
   - Foto banner dapat langsung diunggah ke Google Drive secara otomatis!
4. **🌟 Hasil Karya Member (+ Upload Mockup Showcase)**:
   - Klik tombol **"+ Upload Hasil Karya Member 🌟"**.
   - Masukkan Nama Proyek (misal: *"Lawfirm Client Management CRM"*), Nama Siswa (misal: *"Aditya — Alumni Batch 2"*), dan Statistik Pencapaian (misal: *"2.450+ Leads Tercatat"*).
   - Unggah foto preview screenshot mockup ke Google Drive.
5. **👥 CRM Leads & Waitlist**:
   - Melihat daftar calon pembeli yang bertanya atau terdaftar di antrean *Waitlist* (saat kuota batch penuh).
   - Dilengkapi tombol hijau **"💬 Chat di WhatsApp"** yang seketika membuka WhatsApp Web dengan salam otomatis.
6. **⭐ Testimoni Alumni**: Mengelola kartu ulasan berbintang yang berputar 3D flip otomatis di beranda.
7. **💳 Tagihan & Cicilan Siswa (gas-tagihan-pembayaran)**:
   - Dashboard pengelolaan tagihan bertahap siswa (Cicilan 1, Cicilan 2, dst.).
   - Tombol **"+ Terbitkan Tagihan Baru 💳"** untuk menerbitkan tagihan siswa baru.
   - Tombol hijau **"🔔 Ingatkan WA"** untuk mengirim pengingat WhatsApp 1-klik dengan teks tagihan otomatis dan tautan bayar.
   - Tombol **"✓ Lunas"** untuk menandai pelunasan cicilan siswa.
8. **⚙️ Metode Bayar & Pengaturan Situs**:
   - **Metode Pembayaran Otomatis Server**: Mengatur status aktif/nonaktif, nomor rekening, atas nama, petunjuk transfer, dan barcode QRIS untuk 6 metode: **QRIS, GoPay, OVO, BCA, Mandiri, dan BNI** yang langsung muncul di formulir checkout pengunjung tanpa perlu diketik manual.
   - Pengaturan teks banner promo atas, nomor WhatsApp CS, dan link grup Telegram/WA.
9. **🔐 Akun & Hak Akses Portal**:
   - Ganti peran portal antara **👑 Super Admin** (akses penuh) dan **🛡️ Admin Staff** (operasional & CS).
   - Ubah email admin dan ganti PIN keamanan masuk dashboard.

### 3. Otomatisasi Metode Pembayaran di Checkout Pengunjung
- Pada modal checkout pengunjung, kini terdapat pilihan skema pembayaran:
  - **⚡ Bayar Penuh (Lunas)**: Langsung membayar harga promo 100%.
  - **📅 Cicilan Bertahap (2x)**: Pembeli hanya membayar 50% saat checkout pertama, dan 50% sisanya dapat dicicil dan dilunasi via menu **"Cek Tagihan"**.
- Pilihan channel pembayaran: **QRIS, BCA, Mandiri, BNI, GoPay, OVO**.
- Dilengkapi tombol **"📋 Salin"** nomor rekening dan tampilan barcode QRIS dinamis yang bisa discan langsung dari aplikasi perbankan atau e-Wallet mana saja.

### 3. Kembali ke Tampilan Pengunjung
- Kapan pun Anda selesai mengelola data di dashboard, cukup klik tombol **"← Kembali ke Website"** di pojok kanan atas topbar dashboard untuk kembali ke tampilan landing page pengunjung.

---

## BAB 8: Tanya-Jawab & Solusi Kendala (Troubleshooting FAQ)

### Q1: Bagaimana cara mengubah teks promo di banner atas website?
> **Jawaban:** Buka Google Spreadsheet database Anda → buka sheet **`tb_pengaturan_situs`** → cari baris `announcement_bar_text` → ganti teksnya di kolom sebelahnya. Dalam beberapa menit teks di website akan berubah otomatis tanpa perlu mengedit kode!

### Q2: Bagaimana cara menambah atau mengganti foto produk?
> **Jawaban:** Buka sheet **`tb_produk`** di Spreadsheet Anda:
> - Masukkan link gambar foto produk di kolom `Banner_URL`.
> - Jika ingin lebih dari 1 gambar agar slideshow otomatis berputar, masukkan beberapa link gambar dipisahkan tanda koma pada kolom `Galeri_URLs`. Contoh: `https://link-foto1.jpg, https://link-foto2.jpg`.

### Q3: Bagaimana cara membuat produk berstatus "Batch Penuh (Waitlist)"?
> **Jawaban:** Pada sheet **`tb_produk`**, ubah angka pada kolom `Maks_Kuota_Batch` menjadi `0`. Seketika tombol di website akan otomatis berubah dari "Daftar Sekarang" menjadi **"Batch Penuh — Masuk Waitlist ⏳"**, dan formulir antrean prioritas akan aktif.

### Q4: Mengapa saat klik "Deploy as Web App", pembeli tidak bisa upload bukti bayar?
> **Jawaban:** Pastikan saat melakukan Deploy Web App di Apps Script (BAB 3), Anda memilih:
> - **Execute as**: `Me (email Anda)`
> - **Who has access**: `Anyone (Siapa saja)`  
> Jika opsi ini salah diatur, Google akan menolak unggahan berkas dari pengunjung umum.

### Q5: Bagaimana cara mengganti PIN Admin?
> **Jawaban:** Buka Google Apps Script → menu **Project Settings** (ikon gerigi di kiri) → scroll ke bagian **Script Properties** → Anda dapat mengedit atau mereset properti `ADMIN_PIN_HASH` atau mengatur PIN baru melalui fungsi pengaturan.

---

🎉 **Selamat Menggunakan & Mengembangkan EtalaseKu Digital Hub & Academy!**  
*Jika ada bagian atau fitur tambahan yang ingin Anda sesuaikan, Anda cukup bertanya kembali di percakapan ini.*
