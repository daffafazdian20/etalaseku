# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## EtalaseKu Digital Hub & Academy
*Platform E-Commerce Produk Digital, Kursus Online, dan Sistem Otomatisasi Penjualan Berbasis Google Workspace (GAS & Sheets)*

---

## 1. Judul & Ringkasan Eksekutif
- **Nama Produk**: **EtalaseKu Digital Hub & Academy** *(Katalog & Platform Kursus Produk Digital)*
- **Klasifikasi Solusi**: Web Application SPA (*Single Page Application*) terintegrasi penuh dengan ekosistem **Google Apps Script (GAS)**, **Google Sheets**, dan **Google Drive**.
- **Ringkasan Eksekutif**:
  EtalaseKu Digital Hub & Academy adalah platform *all-in-one* yang menggabungkan *high-converting landing page* bergaya modern *playful-professional* (kartu mengambang, aksen gelombang pastel, dan tombol kontras tinggi), sistem pembelian produk digital instan, ruang belajar kursus (*member classroom area*), serta sistem otomasi konfirmasi pesanan terpusat. Solusi ini meniadakan pencatatan manual dan kebingungan pengiriman link akses materi dengan memanfaatkan Google Sheets sebagai database utama tanpa biaya bulanan (*zero-infrastructure cost*), Google Drive untuk penyimpanan materi berkapasitas besar, serta pengiriman kuitansi PDF resmi ber-QR code dan notifikasi WhatsApp/Email instan.

---

## 2. Tujuan Produk & Nilai Bisnis

### 2.1 Masalah Utama yang Diselesaikan
1. **Pencatatan Pesanan Berantakan & Rawan Selip**: Menghilangkan input manual melalui pencatatan otomatis transaksi langsung ke Google Sheets.
2. **Keterlambatan Pengiriman Link Akses**: Mengeliminasi konfirmasi manual yang memakan waktu berjam-jam; sekali Admin klik *"Verifikasi Lunas"*, sistem secara instan mengirimkan tautan akses ke Email dan WhatsApp pembeli dalam hitungan detik.
3. **Konversi Penjualan Rendah Tanpa Social Proof**: Menyediakan modul etalase interaktif yang dilengkapi *Announcement Bar* promo berjalan, galeri portofolio karya member (*Showcase*), serta ulasan berbintang.
4. **Kelebihan Kapasitas Batch Kursus**: Menghindari *overcapacity* peserta kelas mentoring melalui logika pembatasan kuota otomatis per batch dan pengalihan otomatis ke *Waitlist*.

### 2.2 Metrik Keberhasilan (KPI)
- **100% Otomatisasi Penyerahan Akses**: Seluruh pembeli terverifikasi menerima akses materi < 10 detik pasca konfirmasi.
- **Zero Database Hosting Cost**: Mengoptimalkan 100% *free-tier* Google Sheets dan Google Drive tanpa perlu berlangganan VPS/database eksternal.
- **Respon Cepat Prospek**: *Widget WhatsApp Floating* dengan *pre-filled message* meningkatkan rasio kontak calon pembeli hingga lebih dari 40%.

---

## 3. Pengguna Target & Matriks Hak Akses (RBAC)

| Peran Pengguna | Deskripsi & Tujuan | Hak Akses Fitur Utama |
| :--- | :--- | :--- |
| **Pengunjung Publik / Calon Pembeli** | Mempelajari kurikulum, melihat *social proof*, dan membeli produk digital/kelas. | - Melihat Landing Page, Announcement Bar, & Galeri Karya.<br>- Melakukan checkout instan & upload bukti transfer.<br>- Bergabung ke daftar tunggu (*Waitlist*) jika kuota batch penuh.<br>- Akses konsultasi instan via *Floating WhatsApp Widget*. |
| **Member Terdaftar / Siswa** | Mengakses modul kursus dan materi digital yang telah dibeli secara sah. | - Akses ke **Portal Belajar (Classroom Area)** via verifikasi Order ID / Email.<br>- Memutar video materi (*YouTube Unlisted embed*), membaca modul PDF Drive, & download aset digital. |
| **Tim CS / Mentor** | Menjawab pertanyaan prospek, membantu verifikasi, dan memandu member. | - Mengakses Panel CRM Leads & Waitlist.<br>- *Quick-reply WhatsApp* ke calon pembeli.<br>- Melihat data kontak member untuk sesi mentoring/Q&A. |
| **Admin / Owner Toko** | Pengelola bisnis dengan hak kendali mutlak atas seluruh sistem. | - Akses penuh Dashboard Admin (Laporan Grafik Omset & Analitik).<br>- Verifikasi 1-klik transaksi pembayaran.<br>- CRUD Produk, Kurikulum Modul, Portofolio, & Testimoni.<br>- Konfigurasi teks banner promo, kuota batch, dan link komunitas di `tb_pengaturan_situs`. |

---

## 4. Arsitektur Data & Integrasi Ekosistem Google Workspace

### 4.1 Skema Tabel Spreadsheet (7 Tabel Utama)

1. **`tb_produk`** (Katalog Produk & Paket Kelas):
   - `ID_Produk` *(String, Primary Key, misal: PRD-001)*
   - `Nama_Produk` *(String)*
   - `Kategori` *(E-Book / Kursus Video / Template / Bundling)*
   - `Deskripsi` *(Text)*
   - `Harga_Normal` *(Number)*
   - `Harga_Promo` *(Number)*
   - `Banner_URL` *(Drive / Web URL)*
   - `Link_Akses_Materi` *(Tautan Google Drive / Folder Eksklusif)*
   - `Batch_Aktif` *(Number, misal: 3)*
   - `Maks_Kuota_Batch` *(Number, misal: 50)*
   - `Status` *(Publish / Draft)*

2. **`tb_transaksi`** (Pencatatan Pesanan & Pembayaran):
   - `ID_Order` *(String, misal: ORD-20261028-XXXX)*
   - `Tanggal_Waktu` *(Datetime ISO)*
   - `Nama_Pembeli` *(String)*
   - `No_WhatsApp` *(String)*
   - `Email` *(String)*
   - `ID_Produk` *(String, Foreign Key)*
   - `Batch_Ke` *(Number)*
   - `Total_Bayar` *(Number)*
   - `Metode_Bayar` *(Transfer Bank BCA/Mandiri / QRIS / e-Wallet)*
   - `Bukti_Transfer_URL` *(Google Drive Link)*
   - `Status_Bayar` *(Pending / Lunas / Ditolak)*
   - `Status_Notifikasi` *(Terkirim / Belum)*

3. **`tb_materi_kursus`** (Struktur Kurikulum Belajar):
   - `ID_Materi` *(String, PK)*
   - `ID_Produk` *(String, FK)*
   - `Judul_Modul` *(String)*
   - `Urutan` *(Number: 1, 2, 3...)*
   - `Tipe_Konten` *(Video YouTube Unlisted / File PDF Drive / Teks Rangkuman)*
   - `URL_Konten` *(Link embed / direct link)*
   - `Durasi_Menit` *(Number)*

4. **`tb_testimoni`** (Social Proof Ulasan):
   - `ID_Testimoni` *(String, PK)*
   - `Nama_Member` *(String)*
   - `Profesi` *(String, misal: Freelancer / Pemilik UMKM)*
   - `Rating` *(Number: 1-5)*
   - `Isi_Ulasan` *(Text)*
   - `Foto_Avatar_URL` *(Drive URL / Image Link)*
   - `Status_Tampil` *(Publish / Draft)*

5. **`tb_portfolio_member`** (Showcase Hasil Karya Member):
   - `ID_Portofolio` *(String, PK)*
   - `Nama_Karya` *(String, misal: Lawfirm CRM Dashboard)*
   - `Nama_Member` *(String)*
   - `Gambar_Preview_URL` *(Drive Link)*
   - `Statistik_Pencapaian` *(String, misal: "2.450+ Leads Tercatat")*
   - `Tautan_Live` *(URL demo/hasil karya)*
   - `Status_Tampil` *(Publish / Draft)*

6. **`tb_pengaturan_situs`** (Konfigurasi Dinamis Tanpa Ubah Kode):
   - `Key_Setting` *(PK: announcement_bar_text, wa_cs_number, link_komunitas_tg, status_batch_global, rekening_pembayaran)*
   - `Value_Setting` *(Text: "🔥 DISKON 50% - Batch 3 Terbatas Hanya 50 Orang!", "628123456789", dll.)*

7. **`tb_leads_crm`** (Manajemen Prospek & Antrean Waitlist):
   - `ID_Lead` *(String, PK)*
   - `Tanggal` *(Datetime)*
   - `Nama_Prospek` *(String)*
   - `No_WhatsApp` *(String)*
   - `Produk_Diminati` *(String)*
   - `Tipe_Lead` *(Konsultasi Produk / Waitlist Batch Penuh)*
   - `Status_FollowUp` *(Baru / Followed-Up / Closing / Batal)*
   - `Catatan_CS` *(Text)*

### 4.2 Arsitektur Google Drive
- **Root Folder**: `[Aplikasi] EtalaseKu Digital Hub`
  - Sub-folder `1. Bukti_Transfer_Pembeli`: Menampung unggahan struk (otomatis dinamai: `BUKTI_{ID_Order}_{Nama}.jpg`).
  - Sub-folder `2. Aset_Materi_Digital`: Master file e-book PDF, template zip, dan materi ber-hak akses *viewer*.
  - Sub-folder `3. Aset_Gambar_Web`: Banner promosi, mockup produk, avatar testimoni, dan preview portofolio member.

### 4.3 Integrasi Otomatisasi (Gmail & WhatsApp)
- **Gmail (`MailApp` / `GmailApp`)**: Kuitansi digital otomatis berformat HTML responsif lengkap dengan rincian transaksi, tautan instan ruang kelas/download materi, dan QR code verifikasi.
- **WhatsApp Gateway (Fonnte API / Direct Link Engine)**: Notifikasi instan saat pesanan berstatus lunas (salam hangat, kredensial akses, link modul, dan link grup diskusi Telegram/WhatsApp).

---

## 5. Persyaratan Fungsional

### 5.1 Landing Page & Etalase Interaktif (Frontend)
1. **Dynamic Sticky Announcement Bar**: Promo bar di atas header dengan teks berjalan/sorotan diskon yang dibaca dinamis dari `tb_pengaturan_situs`.
2. **Hero Section Modern Playful-Tech**:
   - Header & Navigasi: Logo, Menu Navigasi, dan Tombol CTA *"Akses Kelas 🔑"*.
   - Headline persuasif dengan kata sorotan beraksen pink (*hot pink*), tombol ganda (*Katalog Produk* dan *Akses Member*), serta ilustrasi 2.5D modern gadget & laptop.
   - **4 Floating Metric Badges**: Menampilkan metrik nyata (misal: *1.200+ Member*, *45+ Modul & Template*, *98% Rating Kepuasan*, *Akses Seumur Hidup*).
3. **Kategori Unggulan (Services & Categories Grid)**:
   - 4 kartu mengambang (*floating white cards*) dengan ikon pastel lembut: E-Course Praktis, Template Bisnis, Source Code & Web App, serta Bundling & Mentoring.
4. **Selected Products & Batch Limiter (Katalog & Kuota)**:
   - Daftar produk dengan harga normal coret, harga promo, indikator sisa kuota batch, dan tombol beli instan.
   - **Logika Otomasi Kuota**: Jika transaksi lunas telah mencapai `Maks_Kuota_Batch`, tombol beli otomatis berubah menjadi **"Batch Penuh - Masuk Waitlist"** dan membuka form tunggu yang datanya dialirkan ke `tb_leads_crm`.
5. **Showcase "Hasil Karya & Portofolio Member" (Social Proof)**:
   - Kartu showcase karya member (preview mockup layar ganda, metrik keberhasilan member, dan nama pembuat).
6. **Testimonial Slider & Social Proof**:
   - Kartu ulasan member dengan foto avatar, profesi, bintang rating, dan kutipan pengalaman belajar.
7. **Pre-Footer CTA "High-Five Banner"**:
   - Banner penutup dengan ilustrasi kolaboratif ramah: *"Punya Ide & Ingin Membangun Bisnis Digital Sendiri? Mari Wujudkan Bersama!"*
8. **Floating WhatsApp Widget**:
   - Tombol melayang di sudut kanan bawah dengan dialog pembuka instan dan *pre-filled text* yang otomatis mencantumkan nama produk yang sedang dilihat pengunjung.

### 5.2 Checkout Instan & Portal Belajar Member
1. **Modal Checkout Cepat**:
   - Formulir modal 1-layar: Input Nama, Nomor WhatsApp, Email, Pilihan Rekening Pembayaran, dan Unggah File Bukti Transfer langsung ke Google Drive.
2. **Classroom Area (Portal Belajar Tanpa Login Rumit)**:
   - Member memasukkan Order ID atau Email terdaftar untuk membuka modul kelas.
   - Tampilan pemutar video terintegrasi (*YouTube Unlisted iframe embed*) yang aman tanpa tombol download eksternal, dilengkapi daftar silabus modul di sebelah samping/bawah dan tombol download lampiran materi dari Google Drive.

### 5.3 Dashboard Admin & Panel CS
1. **Verifikasi 1-Klik Transaksi**:
   - Tabel transaksi status *Pending* dilengkapi thumbnail bukti transfer yang bisa di-zoom.
   - Tombol sekali klik: **"Konfirmasi Lunas"** (Seketika mengubah status jadi *Lunas*, mengurangi sisa kuota batch, dan memicu pengiriman email kuitansi + pesan WhatsApp ke pembeli).
2. **Dashboard Visualisasi Data & Laporan**:
   - **Kartu Ringkasan (KPI Cards)**: Total Omset Bulan Ini, Jumlah Transaksi Berhasil, Total Member Aktif, dan Sisa Kuota Batch.
   - **Grafik Tren Omset (Line Chart)**: Perkembangan omset penjualan harian dan bulanan.
   - **Diagram Proporsi Produk Terlaris (Donut/Pie Chart)**: Menampilkan produk atau kelas yang paling diminati.
   - **Tabel Transaksi Lengkap**: Dilengkapi filter rentang tanggal, pencarian nama/order ID, dan tombol **"Unduh Laporan Excel / CSV"**.
3. **Panel CS & CRM Leads**:
   - Monitoring calon pembeli yang masuk ke formulir konsultasi maupun *Waitlist*, dilengkapi tombol *1-Click WhatsApp Chat* untuk follow-up cepat.

---

## 6. Batasan Teknis & Mitigasi Kuota Google Apps Script

| Aspek Teknis | Batasan Standar GAS | Solusi & Strategi Mitigasi Terapan |
| :--- | :--- | :--- |
| **Batas Waktu Eksekusi** | Maksimal 6 menit per pemanggilan fungsi. | Seluruh pemanggilan fungsi menggunakan pola *batch processing* (`getValues()` / `setValues()` satu kali operasi). Transaksi diproses dalam < 1.5 detik. |
| **Limit Kuota Pengiriman Email** | Akun Gmail biasa: 100 email/hari; Google Workspace: 1.500 email/hari. | Sistem memeriksa kuota harian via `MailApp.getRemainingDailyQuota()`. Jika menipis, sistem memprioritaskan pengiriman via WhatsApp API Gateway. |
| **Konkurensi Checkout & Kuota Batch** | Risiko *race condition* jika beberapa pembeli checkout bersamaan. | Menerapkan `LockService.getScriptLock()` selama 10 detik saat penghitungan kuota batch dan penerbitan nomor invoice untuk menjamin tidak ada nomor ganda atau *overquota*. |
| **Kecepatan Akses (Latency)** | Eksekusi GAS murni kadang mengalami jeda (*cold-start*). | Mengimplementasikan **Server-Side Caching** menggunakan `CacheService` untuk katalog produk, testimoni, dan pengaturan situs. Frontend SPA me-load data dalam hitungan milidetik. |

---

## 7. Spesifikasi Tampilan & Antarmuka (UI/UX)

### 7.1 Palet Warna & Tipografi
- **Background Utama**: *Warm Ivory / Cream Canvas* (`#FFFDF9`) dengan pembagi seksi bergelombang (*wavy section dividers*) bernuansa pastel (*Soft Pink* `#FDEEF1`, *Soft Lavender* `#F3EDFD`, dan *Soft Mint* `#E8F8F5`).
- **Aksen Primer (High-Contrast CTA)**: *Vibrant Hot Pink / Magenta* (`#FF2E63` / `#E11D48`) untuk tombol aksi utama, penanda diskon, dan teks sorotan penting.
- **Teks & Kontras Tinggi**: *Deep Navy / Midnight Indigo* (`#0F172A` / `#1E1B4B`) untuk teks judul, subjudul, dan latar belakang *footer*.
- **Warna Kartu & Kontainer**: Putih murni (`#FFFFFF`) dengan sudut melengkung halus (*rounded-2xl*), bayangan tipis mengambang (*soft drop-shadow*), dan garis batas pastel halus.
- **Tipografi**: Font modern sans-serif (*Plus Jakarta Sans* atau *Inter*) yang tajam, profesional, dan ramah di layar smartphone.

---

## 8. Rencana Deployment & Tahapan Pengujian

### 8.1 Model Deployment Google Apps Script
- **Deploy Configuration**:
  - `Execute as`: **Me** (Pemilik script/spreadsheet agar otomatis memiliki akses tulis ke Drive & Sheet).
  - `Who has access`: **Anyone** (Akses publik bebas untuk katalog produk dan form pendaftaran).
- **Keamanan Dashboard Admin**:
  - Panel Admin dilindungi autentikasi sesi internal berbasis PIN/Token yang terverifikasi via `tb_pengaturan_situs` tanpa membocorkan data sensitif ke publik.

### 8.2 Rencana Pengujian (Testing Matrix)
1. **Uji Alur Pembelian & Bukti Transfer**:
   - Memastikan file upload bukti transfer berhasil tersimpan ke folder Google Drive dan URL-nya tercatat rapi di `tb_transaksi`.
2. **Uji Logika Kuota Batch & Waitlist**:
   - Mensimulasikan pembelian hingga kuota penuh, memastikan status tombol berubah seketika menjadi formulir *Waitlist* dan data masuk ke `tb_leads_crm`.
3. **Uji Otomasi Notifikasi**:
   - Verifikasi pengiriman email kuitansi digital instan dan pesan WhatsApp saat status pembayaran diubah menjadi *Lunas*.
4. **Uji Responsivitas & Performa**:
   - Memastikan tampilan landing page, video modul, dan dashboard admin berjalan lancar di layar desktop, tablet, dan smartphone (Android & iOS).

---

🎨 **Tahapan Khusus: Penentuan Visual UI/UX**
1. Unggah Referensi: Silakan unggah referensi tangkapan layar, warna, dan gaya antarmuka yang diinginkan.
2. Jika Belum Ada Referensi Visual:
   - Salin seluruh teks dokumen PRD Final di atas.
   - Buka Google Stitch, lalu tempelkan teks PRD ke dalamnya.
   - Unduh hasil pratinjau desain visual yang dihasilkan oleh Google Stitch.
   - Unggah gambar hasil desain tersebut ke percakapan ini untuk diimplementasikan ke dalam kode HTML/CSS.
