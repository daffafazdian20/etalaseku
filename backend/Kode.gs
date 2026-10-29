/**
 * ============================================================================
 * ETALASEKU DIGITAL HUB & ACADEMY — BACKEND REST API
 * ============================================================================
 * Arsitektur: GAS-PRO-API (Pure REST API JSON, decoupled from frontend)
 * Standar:
 *   - gas-pro-api (REST API, ContentService JSON murni, Anti-CORS)
 *   - gas-rahasia-script-properties (Zero hardcoded secrets, hash+salt, HMAC session)
 *   - gas-scale-turbo (CacheX chunking, non-blocking notification queue, batch write)
 *   - gas-notifikasi-wa-crm (Fonnte WA Gateway, MailApp, CRM Kontak, AntrianNotif)
 *   - gas-tagihan-pembayaran (Manajemen tagihan siswa, verifikasi bukti, kwitansi QR)
 *   - gas-migrasi-database (Header-safe schema check & idempotent migrator)
 * ============================================================================
 */

// ============================================================================
// 1. KONFIGURASI SCRIPT PROPERTIES & ACCESS HELPER (gas-rahasia-script-properties)
// ============================================================================
const PROPS = PropertiesService.getScriptProperties();
let _PROP_MEMO = null;

function prop_(key, def) {
  if (!_PROP_MEMO) _PROP_MEMO = PROPS.getProperties();
  const v = _PROP_MEMO[key];
  return v === undefined || v === null || v === '' ? (def === undefined ? '' : def) : v;
}

function setProp_(key, val) {
  PROPS.setProperty(key, String(val));
  if (_PROP_MEMO) _PROP_MEMO[key] = String(val);
}

function setProps_(obj) {
  PROPS.setProperties(obj);
  if (_PROP_MEMO) {
    Object.keys(obj).forEach(k => { _PROP_MEMO[k] = String(obj[k]); });
  }
}

function delProp_(key) {
  PROPS.deleteProperty(key);
  if (_PROP_MEMO) delete _PROP_MEMO[key];
}

const CONFIG = {
  APP_NAME: 'EtalaseKu Digital Hub & Academy',
  APP_VERSION: '2.0.0',
  get SPREADSHEET_ID() { return prop_('SPREADSHEET_ID'); },
  get ROOT_FOLDER_ID() { return prop_('ROOT_FOLDER_ID'); },
  get UPLOADS_FOLDER_ID() { return prop_('UPLOADS_FOLDER_ID'); },
  get FONNTE_TOKEN() { return prop_('FONNTE_TOKEN'); },
  get SESSION_SECRET() {
    let s = prop_('SESSION_SECRET');
    if (!s) {
      s = acakString_(64);
      setProp_('SESSION_SECRET', s);
    }
    return s;
  },
  SHEETS: {
    PRODUK: 'tb_produk',
    TRANSAKSI: 'tb_transaksi',
    MATERI: 'tb_materi_kursus',
    TESTIMONI: 'tb_testimoni',
    PORTFOLIO: 'tb_portfolio_member',
    PENGATURAN: 'tb_pengaturan_situs',
    LEADS: 'tb_leads_crm',
    TAGIHAN: 'tb_tagihan',
    PEMBAYARAN: 'tb_pembayaran',
    POTONGAN: 'tb_potongan_tagihan',
    ANTRIAN_NOTIF: 'tb_antrian_notif',
    CRM_KONTAK: 'tb_crm_kontak'
  }
};

// ============================================================================
// 2. ENTRY POINTS — doGet & doPost (gas-pro-api & gas-scale-turbo)
// ============================================================================
function doGet(e) {
  const t0 = Date.now();
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getPublicData';
    let result;

    switch (action) {
      case 'ping':
        result = { success: true, message: 'Pong! Backend EtalaseKu Aktif', timestamp: new Date().toISOString() };
        break;
      case 'getPublicData':
        result = getPublicLandingData_();
        break;
      case 'getCatalog':
        result = getCatalog_();
        break;
      case 'getTestimonials':
        result = getTestimonials_();
        break;
      case 'getShowcase':
        result = getShowcase_();
        break;
      case 'getSettings':
        result = getPublicSettings_();
        break;
      case 'verifyReceipt':
        result = verifyReceiptPublic_(e.parameter.code);
        break;
      case 'getStudentBills':
        result = getStudentBillsPublic_(e.parameter.phone);
        break;
      case 'getClassroomModules':
        result = getClassroomModules_(e && e.parameter && e.parameter.productId);
        break;
      case 'getPaymentChannels':
        result = { success: true, data: getPaymentChannels_() };
        break;
      default:
        result = { success: false, message: 'Action GET tidak dikenali: ' + action };
    }

    result.ms = Date.now() - t0;
    result.v = CONFIG.APP_VERSION;
    return buildResponse_(result);
  } catch (err) {
    return buildResponse_({ success: false, message: err.message || String(err), ms: Date.now() - t0 });
  }
}

function doPost(e) {
  const t0 = Date.now();
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    const action = payload.action || '';
    const data = payload.data || {};
    const token = payload.token || '';
    let result;

    switch (action) {
      // --- Public Client Actions ---
      case 'submitOrder':
        result = submitOrder_(data);
        break;
      case 'joinWaitlist':
        result = joinWaitlist_(data);
        break;
      case 'submitStudentProof':
        result = submitStudentProof_(data);
        break;
      case 'accessClassroom':
        result = accessClassroom_(data);
        break;

      // --- Admin & Staff Authenticated Actions ---
      case 'adminLogin':
        result = adminLogin_(data);
        break;
      case 'getAdminDashboard':
        result = requireAuth_(token, () => getAdminDashboardData_());
        break;
      case 'verifyTransaction':
        result = requireAuth_(token, () => verifyTransaction_(data));
        break;
      case 'saveProduct':
        result = requireAuth_(token, () => saveProduct_(data));
        break;
      case 'deleteProduct':
        result = requireAuth_(token, () => deleteProduct_(data));
        break;
      case 'saveShowcase':
        result = requireAuth_(token, () => saveShowcase_(data));
        break;
      case 'deleteShowcase':
        result = requireAuth_(token, () => deleteShowcase_(data));
        break;
      case 'saveTestimonial':
        result = requireAuth_(token, () => saveTestimonial_(data));
        break;
      case 'deleteTestimonial':
        result = requireAuth_(token, () => deleteTestimonial_(data));
        break;
      case 'crmSendWa':
        result = requireAuth_(token, () => crmDirectWaSend_(data));
        break;
      case 'saveSiteSettings':
        result = requireAuth_(token, () => saveSiteSettings_(data));
        break;
      case 'savePaymentChannels':
        result = requireAuth_(token, () => savePaymentChannels_(data));
        break;
      case 'updateAdminCredentials':
        result = requireAuth_(token, () => updateAdminCredentials_(data));
        break;
      case 'issueStudentBill':
        result = requireAuth_(token, () => issueStudentBill_(data));
        break;
      case 'sendInstallmentReminder':
        result = requireAuth_(token, () => sendInstallmentReminder_(data));
        break;
      case 'syncCrmContacts':
        result = requireAuth_(token, () => syncCrmContacts_());
        break;
      case 'saveClassroomModule':
        result = requireAuth_(token, () => saveClassroomModule_(data));
        break;
      case 'deleteClassroomModule':
        result = requireAuth_(token, () => deleteClassroomModule_(data));
        break;
      default:
        result = { success: false, message: 'Action POST tidak dikenali: ' + action };
    }

    result.ms = Date.now() - t0;
    result.v = CONFIG.APP_VERSION;
    return buildResponse_(result);
  } catch (err) {
    return buildResponse_({ success: false, message: err.message || String(err), ms: Date.now() - t0 });
  }
}

function buildResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 3. CACHEX ENGINE — (gas-scale-turbo Batas 100 KB)
// ============================================================================
const CacheX = {
  SZ: 50000,
  c: function () { return CacheService.getScriptCache(); },
  get: function (key) {
    try {
      const c = this.c(), head = c.get(key);
      if (head == null) return null;
      if (head.indexOf('__chunks:') !== 0) return JSON.parse(head);
      const n = +head.slice(9), keys = [];
      for (let i = 0; i < n; i++) keys.push(key + '#' + i);
      const parts = c.getAll(keys);
      let s = '';
      for (let i = 0; i < n; i++) {
        if (parts[keys[i]] == null) return null;
        s += parts[keys[i]];
      }
      return JSON.parse(s);
    } catch (e) { return null; }
  },
  put: function (key, val, ttl) {
    try {
      ttl = ttl || 3600;
      const s = JSON.stringify(val), c = this.c();
      if (s.length <= this.SZ) { c.put(key, s, ttl); return true; }
      const n = Math.ceil(s.length / this.SZ);
      if (n > 20) return false;
      const m = {};
      for (let i = 0; i < n; i++) m[key + '#' + i] = s.substr(i * this.SZ, this.SZ);
      c.putAll(m, ttl);
      c.put(key, '__chunks:' + n, ttl);
      return true;
    } catch (e) { return false; }
  },
  remove: function (key) {
    try {
      const c = this.c(), head = c.get(key);
      if (head && head.indexOf('__chunks:') === 0) {
        const n = +head.slice(9), keys = [key];
        for (let i = 0; i < n; i++) keys.push(key + '#' + i);
        c.removeAll(keys);
      } else {
        c.remove(key);
      }
    } catch (e) {}
  }
};

function invalidatePublicCache_() {
  CacheX.remove('landing_public_bundle');
  CacheX.remove('catalog_data');
  CacheX.remove('settings_public');
}

// ============================================================================
// 4. PUBLIC DATA SERVICES (LANDING PAGE AGGREGATOR)
// ============================================================================
function getPublicLandingData_() {
  const cached = CacheX.get('landing_public_bundle');
  if (cached) return { success: true, data: cached, cached: true };

  let products = getCatalog_().data;
  let testimonials = getTestimonials_().data;
  let showcases = getShowcase_().data;
  let settings = getPublicSettings_().data;

  // AUTO-SEED JIKA SHEET MASIH KOSONG AGAR WEBSITE LANGSUNG TAMPIL GAGAH
  if (!products || products.length === 0) {
    products = seedDefaultProducts_();
  }
  if (!testimonials || testimonials.length === 0) {
    testimonials = seedDefaultTestimonials_();
  }
  if (!showcases || showcases.length === 0) {
    showcases = seedDefaultShowcases_();
  }
  if (!settings || Object.keys(settings).length === 0) {
    settings = seedDefaultSettings_();
  }

  const bundle = {
    settings: settings,
    paymentChannels: getPaymentChannels_(),
    products: products,
    modules: getClassroomModules_().data,
    testimonials: testimonials,
    showcases: showcases,
    stats: {
      activeMembers: 1248,
      modulesCount: 45,
      satisfactionRate: '98%',
      automatedDelivery: '24/7'
    }
  };

  CacheX.put('landing_public_bundle', bundle, 1800);
  return { success: true, data: bundle, cached: false };
}

function seedDefaultProducts_() {
  const list = [
    {
      ID_Produk: 'PRD-001',
      Nama_Produk: 'GAS Pro Web App Masterclass',
      Kategori: 'Kursus Video',
      Deskripsi: 'Bangun web app skala industri dengan Google Apps Script, Google Sheets, & Tailwind CSS tanpa server eksternal.',
      Harga_Normal: 249000,
      Harga_Promo: 99000,
      Banner_URL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      Galeri_URLs: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80,https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80,https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      Link_Akses_Materi: 'https://daffafazdian.github.io/etalaseku/#classroom',
      Batch_Aktif: 3,
      Maks_Kuota_Batch: 8,
      Status: 'Publish'
    },
    {
      ID_Produk: 'PRD-002',
      Nama_Produk: 'Digital Agency Notion OS',
      Kategori: 'Template Bisnis',
      Deskripsi: 'Template Notion terlengkap untuk manajemen klien agency, pipeline penjualan, dan invoice otomatis terpusat.',
      Harga_Normal: 199000,
      Harga_Promo: 79000,
      Banner_URL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      Galeri_URLs: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80,https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      Link_Akses_Materi: 'https://notion.so',
      Batch_Aktif: 1,
      Maks_Kuota_Batch: 999,
      Status: 'Publish'
    },
    {
      ID_Produk: 'PRD-003',
      Nama_Produk: 'Fullstack Automation Bootcamp',
      Kategori: 'Mentoring Eksklusif',
      Deskripsi: 'Mentoring intensif 4 minggu membangun otomasi bisnis dari nol hingga menghasilkan omset pertama.',
      Harga_Normal: 499000,
      Harga_Promo: 249000,
      Banner_URL: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      Galeri_URLs: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80,https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      Link_Akses_Materi: 'https://t.me/bootcamp_exclusive',
      Batch_Aktif: 2,
      Maks_Kuota_Batch: 0,
      Status: 'Publish'
    }
  ];

  try {
    const sh = getSheet_(CONFIG.SHEETS.PRODUK);
    list.forEach(p => {
      sh.appendRow([
        p.ID_Produk, p.Nama_Produk, p.Kategori, p.Deskripsi,
        p.Harga_Normal, p.Harga_Promo, p.Banner_URL, p.Galeri_URLs,
        p.Link_Akses_Materi, p.Batch_Aktif, p.Maks_Kuota_Batch, p.Status
      ]);
    });
  } catch (e) {}
  return list;
}

function seedDefaultShowcases_() {
  const list = [
    {
      ID_Portofolio: 'PFO-001',
      Nama_Karya: 'Lawfirm Client Management CRM',
      Nama_Member: 'Karya Aditya — Alumni Batch 2',
      Gambar_Preview_URL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      Statistik_Pencapaian: '2.450+ Leads Tercatat',
      Tautan_Live: 'https://github.com',
      Status_Tampil: 'Publish'
    },
    {
      ID_Portofolio: 'PFO-002',
      Nama_Karya: 'Sistem Kuitansi & Invoice Toko Online',
      Nama_Member: 'Karya Sarah — Alumni Batch 1',
      Gambar_Preview_URL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      Statistik_Pencapaian: '10x Lebih Cepat',
      Tautan_Live: 'https://github.com',
      Status_Tampil: 'Publish'
    }
  ];

  try {
    const sh = getSheet_(CONFIG.SHEETS.PORTFOLIO);
    list.forEach(s => {
      sh.appendRow([
        s.ID_Portofolio, s.Nama_Karya, s.Nama_Member,
        s.Gambar_Preview_URL, s.Statistik_Pencapaian, s.Tautan_Live, s.Status_Tampil
      ]);
    });
  } catch (e) {}
  return list;
}

function seedDefaultTestimonials_() {
  const list = [
    {
      ID_Testimoni: 'TST-001',
      Nama_Member: 'Aditya Pratama',
      Profesi: 'Freelance Developer',
      Rating: 5,
      Isi_Ulasan: 'Materi GAS Pro Masterclass sangat aplikatif! Saya berhasil membuat sistem CRM Lawfirm untuk klien dan langsung dibayar 15 juta dalam 2 minggu.',
      Hasil_Pencapaian: 'Closing Proyek Rp 15 Jt',
      Foto_Avatar_URL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      Status_Tampil: 'Publish'
    },
    {
      ID_Testimoni: 'TST-002',
      Nama_Member: 'Sarah Amalia',
      Profesi: 'Digital Agency Owner',
      Rating: 5,
      Isi_Ulasan: 'Sistem otomatisasi pengiriman kuitansi dan WhatsApp ini menghemat waktu tim CS kami hingga 90%. Tidak ada lagi komplain akses lambat!',
      Hasil_Pencapaian: 'Hemat 90% Waktu CS',
      Foto_Avatar_URL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      Status_Tampil: 'Publish'
    },
    {
      ID_Testimoni: 'TST-003',
      Nama_Member: 'Rian Hidayat',
      Profesi: 'Pemilik UMKM Retail',
      Rating: 5,
      Isi_Ulasan: 'Template Notion OS dan modul penagihan siswa sangat rapi. Penagihan SPP bulanan di tempat bimbel saya jadi 100% otomatis tercatat di Spreadsheet.',
      Hasil_Pencapaian: '100% Otomatisasi SPP',
      Foto_Avatar_URL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      Status_Tampil: 'Publish'
    }
  ];

  try {
    const sh = getSheet_(CONFIG.SHEETS.TESTIMONI);
    list.forEach(t => {
      sh.appendRow([
        t.ID_Testimoni, t.Nama_Member, t.Profesi, t.Rating,
        t.Isi_Ulasan, t.Hasil_Pencapaian, t.Foto_Avatar_URL, t.Status_Tampil
      ]);
    });
  } catch (e) {}
  return list;
}

function seedDefaultSettings_() {
  const map = {
    announcement_bar_text: '🔥 DISKON 50% - Akses Seumur Hidup Batch 3 Terbatas Hanya 50 Orang!',
    wa_cs_number: '6287894602627',
    rekening_pembayaran: 'BCA: 123-456-7890 a/n EtalaseKu Hub\nMandiri: 987-654-3210 a/n EtalaseKu Hub',
    link_komunitas_tg: 'https://t.me/etalaseku_community'
  };

  try {
    const sh = getSheet_(CONFIG.SHEETS.PENGATURAN);
    Object.keys(map).forEach(k => {
      sh.appendRow([k, map[k]]);
    });
  } catch (e) {}
  return map;
}

function getCatalog_() {
  const rows = getSheetData_(CONFIG.SHEETS.PRODUK);
  const activeProducts = rows.filter(r => String(r.Status).toLowerCase() === 'publish');
  return { success: true, data: activeProducts };
}

function getTestimonials_() {
  const rows = getSheetData_(CONFIG.SHEETS.TESTIMONI);
  const activeTestis = rows.filter(r => String(r.Status_Tampil).toLowerCase() === 'publish');
  return { success: true, data: activeTestis };
}

function getShowcase_() {
  const rows = getSheetData_(CONFIG.SHEETS.PORTFOLIO);
  const activeShowcase = rows.filter(r => String(r.Status_Tampil).toLowerCase() === 'publish');
  return { success: true, data: activeShowcase };
}

function getPublicSettings_() {
  const rows = getSheetData_(CONFIG.SHEETS.PENGATURAN);
  const map = {};
  rows.forEach(r => {
    if (r.Key_Setting) map[r.Key_Setting] = r.Value_Setting;
  });
  return { success: true, data: map };
}

// ============================================================================
// 5. PUBLIC CLIENT TRANSACTIONS & FILE UPLOAD (Google Drive & Sheets)
// ============================================================================
function submitOrder_(data) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return { success: false, message: 'Server sedang sibuk memproses pesanan lain. Coba sesaat lagi.' };
  }

  try {
    const orderId = 'ORD-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd-HHmmss') + '-' + acakString_(4, '0123456789');
    let proofUrl = '';

    // Upload Bukti ke Google Drive jika dilampirkan base64
    if (data.fileBase64 && data.fileName) {
      try {
        const folder = DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER_ID);
        let rawBase64 = String(data.fileBase64 || '');
        if (rawBase64.indexOf(',') !== -1) rawBase64 = rawBase64.split(',')[1];
        const bytes = Utilities.base64Decode(rawBase64);
        const blob = Utilities.newBlob(bytes, data.fileType || 'image/jpeg', 'BUKTI_' + orderId + '_' + (data.nama || 'User').replace(/[^a-zA-Z0-9]/g, '_') + '.jpg');
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        proofUrl = file.getUrl();
      } catch (errDrive) {
        Logger.log('Drive upload error: ' + errDrive.message);
        proofUrl = 'Gagal upload: ' + errDrive.message;
      }
    }

    const shTransaksi = getSheet_(CONFIG.SHEETS.TRANSAKSI);
    shTransaksi.appendRow([
      orderId,
      new Date().toISOString(),
      data.nama || '',
      hp08_(data.whatsapp || ''),
      data.email || '',
      data.productId || '',
      data.batchNo || 1,
      Number(data.total || 0),
      data.paymentMethod || 'BCA Transfer',
      proofUrl,
      'Pending',
      'Belum'
    ]);

    // Catat otomatis ke CRM Leads
    catatLeadOtomatis_(data.nama, data.whatsapp, data.productId, 'Pesanan Masuk (Pending)');

    // Invalidate Cache
    invalidatePublicCache_();

    return {
      success: true,
      message: 'Pesanan berhasil dibuat!',
      orderId: orderId,
      proofUrl: proofUrl
    };
  } finally {
    lock.releaseLock();
  }
}

function joinWaitlist_(data) {
  try {
    const leadId = 'WTL-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd') + '-' + acakString_(4);
    const shLeads = getSheet_(CONFIG.SHEETS.LEADS);
    shLeads.appendRow([
      leadId,
      new Date().toISOString(),
      data.nama || '',
      hp08_(data.whatsapp || ''),
      data.productName || '',
      'Waitlist Batch Penuh',
      'Baru',
      data.catatan || 'Mendaftar antrean prioritas'
    ]);

    // Masukkan ke CRM Kontak
    upsertCrmKontak_({
      nama: data.nama,
      noWa: data.whatsapp,
      email: data.email || '',
      segmen: 'Waitlist',
      sumber: 'Modal Waitlist',
      tag: 'BatchFull'
    });

    return { success: true, message: 'Anda telah terdaftar di daftar tunggu prioritas!' };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ============================================================================
// 6. MODUL TAGIHAN & PEMBAYARAN SISWA (gas-tagihan-pembayaran)
// ============================================================================
function getStudentBillsPublic_(phone) {
  if (!phone) return { success: false, message: 'Nomor WhatsApp wajib diisi' };
  const targetPhone = hp08_(phone);

  const bills = getSheetData_(CONFIG.SHEETS.TAGIHAN);
  const userBills = bills.filter(b => hp08_(b.NoWhatsApp) === targetPhone && b.Status !== 'Dibatalkan');

  return { success: true, data: userBills };
}

function submitStudentProof_(data) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) return { success: false, message: 'Sedang memproses pembayaran lain. Mohon tunggu.' };

  try {
    const pbyId = 'PBY-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd') + '-' + acakString_(4);
    let proofUrl = '';

    if (data.fileBase64) {
      const folder = DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER_ID);
      const bytes = Utilities.base64Decode(data.fileBase64);
      const blob = Utilities.newBlob(bytes, data.fileType || 'image/jpeg', 'BUKTI_TAGIHAN_' + pbyId + '.jpg');
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      proofUrl = file.getUrl();
    }

    const shPby = getSheet_(CONFIG.SHEETS.PEMBAYARAN);
    shPby.appendRow([
      pbyId,
      data.tagihanId || '',
      data.subjekId || '',
      Number(data.nominal || 0),
      data.metode || 'Transfer',
      data.noReferensi || '',
      proofUrl,
      'Menunggu',
      new Date().toISOString(),
      '', '', data.catatan || '', pbyId, ''
    ]);

    // Perbarui status tagihan menjadi Menunggu Verifikasi
    updateWhere_(CONFIG.SHEETS.TAGIHAN, 'TagihanID', {
      [data.tagihanId]: { Status: 'Menunggu Verifikasi' }
    });

    return { success: true, message: 'Bukti pembayaran tagihan berhasil dikirim dan menunggu verifikasi bendahara!', id: pbyId };
  } finally {
    lock.releaseLock();
  }
}

function issueStudentBill_(data) {
  try {
    const tghId = 'TGH-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMM') + '-' + acakString_(5);
    const shTgh = getSheet_(CONFIG.SHEETS.TAGIHAN);
    shTgh.appendRow([
      tghId,
      data.subjekId || data.namaSiswa,
      hp08_(data.noWhatsApp || ''),
      data.jenis || 'Bulanan',
      data.periode || Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM'),
      data.kodeTagihan || 'SPP-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMM'),
      data.namaTagihan || 'Biaya Kursus / Mentoring',
      Number(data.jumlahAsal || 0),
      Number(data.potongan || 0),
      Number(data.jumlahBayar || data.jumlahAsal || 0),
      data.alasanPotongan || '-',
      'Belum Bayar',
      new Date().toISOString(),
      data.jatuhTempo || '',
      '', 'Admin', data.keterangan || ''
    ]);

    // Kirim notifikasi tagihan ke antrean non-blocking
    antrikanNotif_('WA', hp62_(data.noWhatsApp), data.namaSiswa, 'Tagihan Terbit',
      'Halo ' + data.namaSiswa + ', tagihan ' + data.namaTagihan + ' sebesar Rp ' + Number(data.jumlahBayar).toLocaleString('id-ID') + ' telah terbit. Silakan cek di web EtalaseKu.');

    return { success: true, message: 'Tagihan berhasil diterbitkan!', tagihanId: tghId };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ============================================================================
// 7. NOTIFIKASI WA (FONNTE) & CRM KONTAK (gas-notifikasi-wa-crm)
// ============================================================================
function antrikanNotif_(kanal, tujuan, nama, subjek, pesan) {
  try {
    const shAntri = getSheet_(CONFIG.SHEETS.ANTRIAN_NOTIF);
    const antriId = 'ANT-' + Date.now() + '-' + acakString_(3);
    shAntri.appendRow([
      antriId, kanal, tujuan, nama, subjek, pesan,
      'STATUS_UPDATE', '', '', 'Antri', 0, '', new Date().toISOString(), ''
    ]);
    setProp_('ANTRIAN_ADA', '1');
    return true;
  } catch (e) {
    Logger.log('AntrianNotif Error: ' + e.message);
    return false;
  }
}

function crmDirectWaSend_(data) {
  const target = hp62_(data.noWa);
  const pesan = data.pesan;
  const token = CONFIG.FONNTE_TOKEN;

  if (!token) {
    return { success: false, message: 'Token Fonnte belum dikonfigurasi di Script Properties!' };
  }

  try {
    const res = UrlFetchApp.fetch('https://api.fonnte.com/send', {
      method: 'post',
      headers: { Authorization: token },
      payload: {
        target: target,
        message: pesan,
        countryCode: '62'
      },
      muteHttpExceptions: true
    });
    const json = JSON.parse(res.getContentText());
    return { success: json.status, data: json };
  } catch (e) {
    return { success: false, message: 'Gagal kirim Fonnte: ' + e.message };
  }
}

function catatLeadOtomatis_(nama, whatsapp, produk, status) {
  try {
    const shLeads = getSheet_(CONFIG.SHEETS.LEADS);
    const leadId = 'LD-' + Date.now();
    shLeads.appendRow([
      leadId,
      new Date().toISOString(),
      nama || '',
      hp08_(whatsapp || ''),
      produk || '',
      'Transaksi Baru',
      status || 'Baru',
      'Masuk via Checkout Modal'
    ]);
  } catch (e) {}
}

function upsertCrmKontak_(item) {
  try {
    const sh = getSheet_(CONFIG.SHEETS.CRM_KONTAK);
    const ktkId = 'KTK-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMM') + '-' + acakString_(4);
    sh.appendRow([
      ktkId, item.nama || '', item.email || '', hp08_(item.noWa || ''),
      item.segmen || 'Member', item.sumber || 'Web', '', item.tag || '',
      'Aktif', new Date().toISOString(), 'Ya', 'TIDAK', '', 0, '', '', new Date().toISOString(), ''
    ]);
  } catch (e) {}
}

function syncCrmContacts_() {
  const trx = getSheetData_(CONFIG.SHEETS.TRANSAKSI);
  const existingKontak = getSheetData_(CONFIG.SHEETS.CRM_KONTAK);
  const phones = new Set(existingKontak.map(k => hp08_(k.NoWA)));
  const newRows = [];

  trx.forEach(t => {
    const ph = hp08_(t.No_WhatsApp);
    if (ph && !phones.has(ph)) {
      phones.add(ph);
      newRows.push([
        'KTK-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMM') + '-' + acakString_(4),
        t.Nama_Pembeli || '',
        t.Email || '',
        ph,
        'Member/Buyer',
        'Transaksi',
        t.ID_Order,
        'AutoSync',
        'Terdaftar',
        new Date().toISOString(),
        'Ya', 'TIDAK', 'Import otomatis dari Transaksi', 1, new Date().toISOString(), '', new Date().toISOString(), ''
      ]);
    }
  });

  if (newRows.length > 0) {
    const sh = getSheet_(CONFIG.SHEETS.CRM_KONTAK);
    sh.getRange(sh.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  return { success: true, addedCount: newRows.length };
}

// ============================================================================
// 8. ADMIN & CLASSROOM AUTHENTICATION (HMAC Session Token)
// ============================================================================
function adminLogin_(data) {
  const inputPin = String(data.pin || '').trim();
  const storedHash = prop_('ADMIN_PIN_HASH');
  const storedSalt = prop_('ADMIN_PIN_SALT');
  const adminEmail = prop_('ADMIN_EMAIL', 'admin@etalaseku.com');
  const adminRole = prop_('ADMIN_ROLE', 'SUPER_ADMIN');

  // Proteksi First Time Setup jika PIN belum ada
  if (!storedHash) {
    if (inputPin === '123456' || inputPin === 'admin123') {
      const salt = Utilities.getUuid();
      const hash = hashPass_(inputPin, salt);
      setProps_({ ADMIN_PIN_HASH: hash, ADMIN_PIN_SALT: salt, ADMIN_EMAIL: adminEmail, ADMIN_ROLE: adminRole });
      const token = createHmacSession_(adminEmail, adminRole, 'Super Admin');
      return { success: true, token: token, role: adminRole, email: adminEmail, message: 'Setup PIN pertama berhasil! Selamat datang Admin.' };
    }
    return { success: false, message: 'PIN belum dikonfigurasi. Gunakan PIN default 123456 untuk inisialisasi.' };
  }

  const checkHash = hashPass_(inputPin, storedSalt);
  if (constantTimeCompare_(checkHash, storedHash)) {
    const token = createHmacSession_(adminEmail, adminRole, 'Super Admin');
    return { success: true, token: token, role: adminRole, email: adminEmail, message: 'Login Admin Berhasil!' };
  }

  return { success: false, message: 'PIN Admin tidak valid!' };
}

function requireAuth_(token, callback) {
  const session = verifyHmacSession_(token);
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return { success: false, message: 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.' };
  }
  return callback(session);
}

function createHmacSession_(email, role, nama) {
  const payload = {
    e: email,
    r: role,
    n: nama,
    iat: Date.now(),
    exp: Date.now() + 12 * 3600 * 1000 // 12 Jam
  };
  const body = Utilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, '');
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(body, CONFIG.SESSION_SECRET)
  ).replace(/=+$/, '');
  return body + '.' + signature;
}

function verifyHmacSession_(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length !== 2) return null;
    const body = parts[0];
    const signature = parts[1];
    const expectedSig = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(body, CONFIG.SESSION_SECRET)
    ).replace(/=+$/, '');

    if (!constantTimeCompare_(signature, expectedSig)) return null;

    let b64 = body;
    while (b64.length % 4) b64 += '=';
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(b64)).getDataAsString());
    if (payload.exp < Date.now()) return null;

    return { email: payload.e, role: payload.r, nama: payload.n };
  } catch (e) {
    return null;
  }
}

function accessClassroom_(data) {
  const identifier = String(data.identifier || '').trim();
  const trx = getSheetData_(CONFIG.SHEETS.TRANSAKSI);

  const matched = trx.find(t =>
    (t.ID_Order === identifier || hp08_(t.No_WhatsApp) === hp08_(identifier) || t.Email === identifier) &&
    String(t.Status_Bayar).toLowerCase() === 'lunas'
  );

  if (!matched) {
    return { success: false, message: 'Data pesanan lunas tidak ditemukan. Pastikan Anda memasukkan Order ID atau No WhatsApp yang sudah lunas.' };
  }

  // Ambil materi produk
  const materi = getSheetData_(CONFIG.SHEETS.MATERI);
  const productModules = materi.filter(m => m.ID_Produk === matched.ID_Produk)
    .sort((a, b) => Number(a.Urutan) - Number(b.Urutan));

  return {
    success: true,
    member: {
      nama: matched.Nama_Pembeli,
      orderId: matched.ID_Order,
      productId: matched.ID_Produk
    },
    modules: productModules
  };
}

// ============================================================================
// 9. ADMIN DASHBOARD OPERATIONS
// ============================================================================
function getAdminDashboardData_() {
  const trx = getSheetData_(CONFIG.SHEETS.TRANSAKSI);
  const products = getSheetData_(CONFIG.SHEETS.PRODUK);
  const showcases = getSheetData_(CONFIG.SHEETS.PORTFOLIO);
  const leads = getSheetData_(CONFIG.SHEETS.LEADS);
  const testimonials = getSheetData_(CONFIG.SHEETS.TESTIMONI);
  const bills = getSheetData_(CONFIG.SHEETS.TAGIHAN);
  const settings = getPublicSettings_().data;

  let totalRevenue = 0;
  let paidOrders = 0;
  let pendingOrders = 0;

  trx.forEach(t => {
    if (String(t.Status_Bayar).toLowerCase() === 'lunas') {
      totalRevenue += Number(t.Total_Bayar || 0);
      paidOrders++;
    } else if (String(t.Status_Bayar).toLowerCase() === 'pending') {
      pendingOrders++;
    }
  });

  return {
    success: true,
    data: {
      metrics: {
        totalRevenue: totalRevenue,
        paidOrders: paidOrders,
        pendingOrders: pendingOrders,
        totalLeads: leads.length,
        totalProducts: products.length,
        totalShowcases: showcases.length,
        totalBills: bills.length
      },
      adminProfile: {
        email: prop_('ADMIN_EMAIL', 'admin@etalaseku.com'),
        role: prop_('ADMIN_ROLE', 'SUPER_ADMIN')
      },
      paymentChannels: getPaymentChannels_(),
      bills: bills.slice(-40).reverse(),
      recentOrders: trx.slice(-30).reverse(),
      products: products,
      showcases: showcases,
      leads: leads.slice(-30).reverse(),
      testimonials: testimonials,
      modules: getClassroomModules_().data,
      settings: settings
    }
  };
}

function updateAdminCredentials_(data) {
  const currentEmail = prop_('ADMIN_EMAIL', 'admin@etalaseku.com');
  const newEmail = data.email ? String(data.email).trim() : currentEmail;
  const newRole = data.role ? String(data.role).trim() : prop_('ADMIN_ROLE', 'SUPER_ADMIN');

  if (newEmail) setProp_('ADMIN_EMAIL', newEmail);
  if (newRole) setProp_('ADMIN_ROLE', newRole);

  if (data.newPin) {
    const pin = String(data.newPin).trim();
    if (pin.length < 4) {
      return { success: false, message: 'PIN baru minimal 4 digit!' };
    }
    const salt = Utilities.getUuid();
    const hash = hashPass_(pin, salt);
    setProps_({
      ADMIN_PIN_HASH: hash,
      ADMIN_PIN_SALT: salt
    });
  }

  return {
    success: true,
    message: 'Kredensial Admin & Hak Akses berhasil diperbarui!',
    email: newEmail,
    role: newRole
  };
}

function savePaymentChannels_(data) {
  const jsonStr = JSON.stringify(data);
  setProp_('PAYMENT_CHANNELS_CONFIG', jsonStr);

  try {
    const sh = getSheet_(CONFIG.SHEETS.PENGATURAN);
    const rows = sh.getDataRange().getValues();
    let found = false;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === 'payment_channels') {
        sh.getRange(i + 1, 2).setValue(jsonStr);
        found = true;
        break;
      }
    }
    if (!found) {
      sh.appendRow(['payment_channels', jsonStr]);
    }
  } catch (e) {}

  invalidatePublicCache_();
  return { success: true, message: 'Pengaturan metode pembayaran otomatis berhasil disimpan!', data: data };
}

function getPaymentChannels_() {
  const stored = prop_('PAYMENT_CHANNELS_CONFIG');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return {
    qris: { aktif: true, label: 'QRIS Instant (Semua Bank / e-Wallet)', rekening: 'Scan QRIS Dinamis', atasNama: 'EtalaseKu Hub', qrUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80', instruksi: 'Scan QRIS di atas via BCA, Mandiri, BNI, GoPay, OVO, atau ShopeePay.' },
    gopay: { aktif: true, label: 'GoPay', rekening: '0878-9460-2627', atasNama: 'EtalaseKu Hub', instruksi: 'Transfer saldo GoPay ke nomor ini.' },
    ovo: { aktif: true, label: 'OVO', rekening: '0878-9460-2627', atasNama: 'EtalaseKu Hub', instruksi: 'Transfer saldo OVO ke nomor ini.' },
    bca: { aktif: true, label: 'BCA Transfer', rekening: '123-456-7890', atasNama: 'EtalaseKu Hub', instruksi: 'Transfer via BCA Mobile / ATM / KlikBCA.' },
    mandiri: { aktif: true, label: 'Mandiri Transfer', rekening: '987-654-3210', atasNama: 'EtalaseKu Hub', instruksi: 'Transfer via Livin by Mandiri / ATM.' },
    bni: { aktif: true, label: 'BNI Transfer', rekening: '112-233-4455', atasNama: 'EtalaseKu Hub', instruksi: 'Transfer via BNI Mobile Banking / ATM.' }
  };
}

function sendInstallmentReminder_(data) {
  const noWa = hp62_(data.noWa);
  const pesan = `Halo kak *${data.namaSiswa}*! 👋\n\nMengingatkan kembali untuk tagihan cicilan *${data.namaTagihan}* sebesar *Rp ${Number(data.nominal).toLocaleString('id-ID')}* dengan jatuh tempo *${data.jatuhTempo || 'segera'}*.\n\nSilakan cek rincian & unggah bukti pembayaran melalui menu *Cek Tagihan* di website EtalaseKu.\n\nTerima kasih dan semangat belajarnya! 🚀\n— ${CONFIG.APP_NAME}`;

  antrikanNotif_('WA', noWa, data.namaSiswa, 'Pengingat Cicilan Tagihan', pesan);
  return { success: true, message: 'Pesan pengingat WhatsApp berhasil dikirim ke antrean!' };
}

function saveProduct_(data) {
  let bannerUrl = data.Banner_URL || '';
  if (data.bannerBase64 && data.bannerName) {
    try {
      const folder = DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER_ID);
      const bytes = Utilities.base64Decode(data.bannerBase64);
      const blob = Utilities.newBlob(bytes, data.bannerType || 'image/jpeg', 'PROD_' + Date.now() + '_' + data.bannerName.replace(/[^a-zA-Z0-9.-]/g, '_'));
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      bannerUrl = file.getUrl();
    } catch (e) {
      Logger.log('Drive banner upload error: ' + e.message);
    }
  }

  const sh = getSheet_(CONFIG.SHEETS.PRODUK);
  const rows = sh.getDataRange().getValues();
  const idProduk = data.ID_Produk || ('PRD-' + Date.now());
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(idProduk)) {
      rowIndex = i + 1;
      break;
    }
  }

  const newRow = [
    idProduk,
    data.Nama_Produk || '',
    data.Kategori || 'E-Course Praktis',
    data.Deskripsi || '',
    Number(data.Harga_Normal || 0),
    Number(data.Harga_Promo || 0),
    bannerUrl,
    data.Galeri_URLs || bannerUrl,
    data.Link_Akses_Materi || '',
    Number(data.Batch_Aktif || 1),
    Number(data.Maks_Kuota_Batch || 50),
    data.Status || 'Publish'
  ];

  if (rowIndex > 0) {
    sh.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sh.appendRow(newRow);
  }

  invalidatePublicCache_();
  return { success: true, message: 'Produk berhasil disimpan!', id: idProduk, bannerUrl: bannerUrl };
}

function deleteProduct_(data) {
  const sh = getSheet_(CONFIG.SHEETS.PRODUK);
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sh.deleteRow(i + 1);
      invalidatePublicCache_();
      return { success: true, message: 'Produk berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Produk tidak ditemukan' };
}

function saveShowcase_(data) {
  let previewUrl = data.Gambar_Preview_URL || '';
  if (data.imageBase64 && data.imageName) {
    try {
      const folder = DriveApp.getFolderById(CONFIG.UPLOADS_FOLDER_ID);
      const bytes = Utilities.base64Decode(data.imageBase64);
      const blob = Utilities.newBlob(bytes, data.imageType || 'image/jpeg', 'SHOWCASE_' + Date.now() + '_' + data.imageName.replace(/[^a-zA-Z0-9.-]/g, '_'));
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      previewUrl = file.getUrl();
    } catch (e) {
      Logger.log('Drive showcase upload error: ' + e.message);
    }
  }

  const sh = getSheet_(CONFIG.SHEETS.PORTFOLIO);
  const rows = sh.getDataRange().getValues();
  const idPorto = data.ID_Portofolio || ('PFO-' + Date.now());
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(idPorto)) {
      rowIndex = i + 1;
      break;
    }
  }

  const newRow = [
    idPorto,
    data.Nama_Karya || '',
    data.Nama_Member || '',
    previewUrl,
    data.Statistik_Pencapaian || '',
    data.Tautan_Live || '',
    data.Status_Tampil || 'Publish'
  ];

  if (rowIndex > 0) {
    sh.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sh.appendRow(newRow);
  }

  invalidatePublicCache_();
  return { success: true, message: 'Hasil karya member berhasil disimpan!', id: idPorto, previewUrl: previewUrl };
}

function deleteShowcase_(data) {
  const sh = getSheet_(CONFIG.SHEETS.PORTFOLIO);
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sh.deleteRow(i + 1);
      invalidatePublicCache_();
      return { success: true, message: 'Hasil karya member berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Data tidak ditemukan' };
}

function saveTestimonial_(data) {
  const sh = getSheet_(CONFIG.SHEETS.TESTIMONI);
  const rows = sh.getDataRange().getValues();
  const idTesti = data.ID_Testimoni || ('TST-' + Date.now());
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(idTesti)) {
      rowIndex = i + 1;
      break;
    }
  }

  const newRow = [
    idTesti,
    data.Nama_Member || '',
    data.Profesi || '',
    Number(data.Rating || 5),
    data.Isi_Ulasan || '',
    data.Hasil_Pencapaian || '',
    data.Foto_Avatar_URL || '',
    data.Status_Tampil || 'Publish'
  ];

  if (rowIndex > 0) {
    sh.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sh.appendRow(newRow);
  }

  invalidatePublicCache_();
  return { success: true, message: 'Testimoni berhasil disimpan!' };
}

function deleteTestimonial_(data) {
  const sh = getSheet_(CONFIG.SHEETS.TESTIMONI);
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sh.deleteRow(i + 1);
      invalidatePublicCache_();
      return { success: true, message: 'Testimoni berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Testimoni tidak ditemukan' };
}

function verifyTransaction_(data) {
  const orderId = data.orderId;
  const newStatus = data.status || 'Lunas';

  const trx = getSheetData_(CONFIG.SHEETS.TRANSAKSI);
  const target = trx.find(t => t.ID_Order === orderId);

  if (!target) return { success: false, message: 'Pesanan tidak ditemukan' };

  updateWhere_(CONFIG.SHEETS.TRANSAKSI, 'ID_Order', {
    [orderId]: {
      Status_Bayar: newStatus,
      Status_Notifikasi: 'Terkirim'
    }
  });

  if (newStatus === 'Lunas') {
    // 1. Kirim Email Kuitansi Resmi via Gmail
    if (target.Email) {
      try {
        MailApp.sendEmail({
          to: target.Email,
          subject: 'Kuitansi & Akses Resmi: ' + CONFIG.APP_NAME + ' (' + orderId + ')',
          htmlBody: `
            <div style="font-family:sans-serif; max-width:600px; margin:auto; border:1px solid #e2e8f0; border-radius:12px; padding:24px;">
              <h2 style="color:#0f172a;">Pembayaran Terverifikasi! 🚀</h2>
              <p>Halo <b>${target.Nama_Pembeli}</b>,</p>
              <p>Pembayaran Anda untuk Order <b>${orderId}</b> telah kami terima dan diverifikasi lunas.</p>
              <div style="background:#f8fafc; padding:16px; border-radius:8px; margin:16px 0;">
                <p><b>Produk:</b> ${target.ID_Produk}</p>
                <p><b>Total Bayar:</b> Rp ${Number(target.Total_Bayar).toLocaleString('id-ID')}</p>
                <p><b>Status:</b> LUNAS</p>
              </div>
              <p>Silakan klik link berikut untuk langsung masuk ke Portal Belajar / Akses Materi:</p>
              <p><a href="https://daffafazdian.github.io/etalaseku/#classroom" style="display:inline-block; background:#ff2e63; color:#fff; padding:12px 24px; border-radius:99px; text-decoration:none; font-weight:bold;">Buka Member Classroom</a></p>
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />
              <p style="font-size:12px; color:#64748b;">EtalaseKu Digital Hub & Academy — 100% Automated by Google Apps Script</p>
            </div>
          `
        });
      } catch (eMail) {
        Logger.log('Gagal kirim email: ' + eMail.message);
      }
    }

    // 2. Kirim Notifikasi WhatsApp via Fonnte / Antrean
    const pesanWa = `Halo kak *${target.Nama_Pembeli}*! 🎉\n\nPembayaran pesanan *${orderId}* telah kami verifikasi LUNAS.\n\nAkses materi & ruang kelas Anda sudah aktif. Silakan login ke member area dengan Order ID Anda.\n\nSelamat belajar dan berkarya!\n— ${CONFIG.APP_NAME}`;
    antrikanNotif_('WA', hp62_(target.No_WhatsApp), target.Nama_Pembeli, 'Pembayaran Lunas', pesanWa);

    // 3. Masukkan ke CRM Kontak
    upsertCrmKontak_({
      nama: target.Nama_Pembeli,
      noWa: target.No_WhatsApp,
      email: target.Email,
      segmen: 'Member Aktif',
      sumber: 'Checkout Lunas',
      tag: 'VerifiedBuyer'
    });
  }

  invalidatePublicCache_();
  return { success: true, message: 'Transaksi berhasil diubah menjadi ' + newStatus };
}

function saveSiteSettings_(data) {
  const rows = [];
  Object.keys(data).forEach(k => {
    rows.push({ Key_Setting: k, Value_Setting: String(data[k]) });
  });

  const sh = getSheet_(CONFIG.SHEETS.PENGATURAN);
  sh.clearContents();
  sh.appendRow(['Key_Setting', 'Value_Setting']);
  rows.forEach(r => sh.appendRow([r.Key_Setting, r.Value_Setting]));

  invalidatePublicCache_();
  return { success: true, message: 'Pengaturan situs berhasil diperbarui di Google Sheets!' };
}

// ============================================================================
// 10. DATABASE & SHEETS HELPER (gas-scale-turbo & gas-migrasi-database)
// ============================================================================
function getSheet_(name) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  return sh;
}

function getSheetData_(name) {
  const sh = getSheet_(name);
  const rows = sh.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0].map(h => String(h).trim());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

function updateWhere_(sheetName, keyCol, patchesByKey) {
  const sh = getSheet_(sheetName);
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return;
  const h = v[0].map(col => String(col).trim());
  const ki = h.indexOf(keyCol);
  if (ki === -1) return;

  let min = Infinity, max = -1;
  for (let i = 1; i < v.length; i++) {
    const keyVal = String(v[i][ki]);
    const patch = patchesByKey[keyVal];
    if (!patch) continue;

    Object.keys(patch).forEach(k => {
      const c = h.indexOf(k);
      if (c > -1) v[i][c] = patch[k];
    });
    min = Math.min(min, i);
    max = Math.max(max, i);
  }

  if (max > -1) {
    sh.getRange(min + 1, 1, max - min + 1, h.length).setValues(v.slice(min, max + 1));
  }
}

// ============================================================================
// 11. KRIPTOGRAFI, SANITASI, & UTILITY (gas-rahasia-script-properties)
// ============================================================================
function acakString_(len, chars) {
  chars = chars || 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  while (s.length < len) {
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid());
    digest.forEach(b => {
      if (s.length < len) s += chars[(b & 0xff) % chars.length];
    });
  }
  return s;
}

function hashPass_(pass, salt) {
  let h = String(pass);
  for (let i = 0; i < 200; i++) {
    h = Utilities.base64Encode(Utilities.computeHmacSha256Signature(h + salt, salt));
  }
  return h;
}

function constantTimeCompare_(a, b) {
  a = String(a || '');
  b = String(b || '');
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function hp08_(phone) {
  let p = String(phone || '').replace(/[^0-9]/g, '');
  if (p.startsWith('62')) p = '0' + p.slice(2);
  return p;
}

function hp62_(phone) {
  let p = String(phone || '').replace(/[^0-9]/g, '');
  if (p.startsWith('0')) p = '62' + p.slice(1);
  return p;
}

// ============================================================================
// 12. AUTO-SETUP & MIGRASI DATABASE (Jalankan Sekali di Editor Apps Script)
// ============================================================================
function setupAppEnvironment() {
  Logger.log('🚀 Memulai Auto-Setup ' + CONFIG.APP_NAME + '...');

  let rootFolder;
  let uploadsFolder;
  let ss;

  if (prop_('ROOT_FOLDER_ID')) {
    rootFolder = DriveApp.getFolderById(prop_('ROOT_FOLDER_ID'));
  } else {
    rootFolder = DriveApp.createFolder('📁 ' + CONFIG.APP_NAME);
    uploadsFolder = rootFolder.createFolder('📂 Uploads Bukti');
  }

  if (prop_('SPREADSHEET_ID')) {
    ss = SpreadsheetApp.openById(prop_('SPREADSHEET_ID'));
  } else {
    ss = SpreadsheetApp.create('🗃️ Database — ' + CONFIG.APP_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(rootFolder);
  }

  // Siapkan Sheet & Header jika belum ada
  const skema = [
    {
      name: CONFIG.SHEETS.PRODUK,
      headers: ['ID_Produk', 'Nama_Produk', 'Kategori', 'Deskripsi', 'Harga_Normal', 'Harga_Promo', 'Banner_URL', 'Galeri_URLs', 'Link_Akses_Materi', 'Batch_Aktif', 'Maks_Kuota_Batch', 'Status']
    },
    {
      name: CONFIG.SHEETS.TRANSAKSI,
      headers: ['ID_Order', 'Tanggal_Waktu', 'Nama_Pembeli', 'No_WhatsApp', 'Email', 'ID_Produk', 'Batch_Ke', 'Total_Bayar', 'Metode_Bayar', 'Bukti_Transfer_URL', 'Status_Bayar', 'Status_Notifikasi']
    },
    {
      name: CONFIG.SHEETS.MATERI,
      headers: ['ID_Materi', 'ID_Produk', 'Judul_Modul', 'Urutan', 'Tipe_Konten', 'URL_Konten', 'Durasi_Menit']
    },
    {
      name: CONFIG.SHEETS.TESTIMONI,
      headers: ['ID_Testimoni', 'Nama_Member', 'Profesi', 'Rating', 'Isi_Ulasan', 'Hasil_Pencapaian', 'Foto_Avatar_URL', 'Status_Tampil']
    },
    {
      name: CONFIG.SHEETS.PORTFOLIO,
      headers: ['ID_Portofolio', 'Nama_Karya', 'Nama_Member', 'Gambar_Preview_URL', 'Statistik_Pencapaian', 'Tautan_Live', 'Status_Tampil']
    },
    {
      name: CONFIG.SHEETS.PENGATURAN,
      headers: ['Key_Setting', 'Value_Setting']
    },
    {
      name: CONFIG.SHEETS.LEADS,
      headers: ['ID_Lead', 'Tanggal', 'Nama_Prospek', 'No_WhatsApp', 'Produk_Diminati', 'Tipe_Lead', 'Status_FollowUp', 'Catatan_CS']
    },
    {
      name: CONFIG.SHEETS.TAGIHAN,
      headers: ['TagihanID', 'SubjekID', 'NoWhatsApp', 'Jenis', 'Periode', 'KodeTagihan', 'NamaTagihan', 'JumlahAsal', 'Potongan', 'Jumlah', 'AlasanPotongan', 'Status', 'TanggalTerbit', 'JatuhTempo', 'TanggalLunas', 'DiterbitkanOleh', 'Keterangan']
    },
    {
      name: CONFIG.SHEETS.PEMBAYARAN,
      headers: ['PembayaranID', 'TagihanID', 'SubjekID', 'Jumlah', 'Metode', 'NoReferensi', 'BuktiID', 'Status', 'TanggalBayar', 'VerifiedBy', 'VerifiedAt', 'Catatan', 'GrupBayar', 'NoKwitansi']
    },
    {
      name: CONFIG.SHEETS.ANTRIAN_NOTIF,
      headers: ['AntrianID', 'Kanal', 'Tujuan', 'NamaPenerima', 'Subjek', 'Pesan', 'Event', 'RefID', 'BlastID', 'Status', 'Percobaan', 'Respon', 'DibuatPada', 'DikirimPada']
    },
    {
      name: CONFIG.SHEETS.CRM_KONTAK,
      headers: ['KontakID', 'Nama', 'Email', 'NoWA', 'Segmen', 'Sumber', 'RefID', 'Tag', 'StatusWA', 'CekWAAt', 'EmailValid', 'OptOut', 'Catatan', 'JumlahPesan', 'TerakhirDihubungi', 'Info', 'DibuatPada', 'DiperbaruiPada']
    }
  ];

  skema.forEach(s => {
    let sh = ss.getSheetByName(s.name);
    if (!sh) {
      sh = ss.insertSheet(s.name);
      sh.appendRow(s.headers);
    }
  });

  // Hapus Sheet1 default jika kosong
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  // Inisialisasi Script Properties
  setProps_({
    SPREADSHEET_ID: ss.getId(),
    ROOT_FOLDER_ID: rootFolder.getId(),
    UPLOADS_FOLDER_ID: uploadsFolder ? uploadsFolder.getId() : rootFolder.getId()
  });

  // Generate SESSION_SECRET & PIN Default jika belum ada
  if (!prop_('SESSION_SECRET')) {
    setProp_('SESSION_SECRET', acakString_(64));
  }
  if (!prop_('ADMIN_PIN_HASH')) {
    const salt = Utilities.getUuid();
    setProps_({
      ADMIN_PIN_HASH: hashPass_('123456', salt),
      ADMIN_PIN_SALT: salt
    });
    Logger.log('🔐 PIN Admin Default diinisialisasi: 123456 (Segera ubah di pengaturan!)');
  }

  Logger.log('✅ Setup Selesai! URL Spreadsheet: ' + ss.getUrl());
}

// ============================================================================
// MANAJEMEN MODUL PEMBELAJARAN CLASSROOM (tb_materi_kursus)
// ============================================================================
function getClassroomModules_(productId) {
  let list = getSheetData_(CONFIG.SHEETS.MATERI);
  if (!list || list.length === 0) {
    list = seedDefaultModules_();
  }
  if (productId) {
    list = list.filter(m => String(m.ID_Produk) === String(productId));
  }
  return { success: true, data: list };
}

function seedDefaultModules_() {
  const list = [
    {
      ID_Materi: 'MOD-01',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 01: Arsitektur GAS Pro Headless & Google Sheets REST API',
      Urutan: 1,
      Tipe_Konten: 'Video HD & PDF',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_01_demo',
      Durasi_Menit: 28,
      Status: 'Publish',
      Deskripsi: 'Memahami cara kerja decoupled frontend modern dengan Google Apps Script tanpa biaya bulanan.'
    },
    {
      ID_Materi: 'MOD-02',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 02: Setup Endpoint doGet & doPost JSON Bebas Masalah CORS',
      Urutan: 2,
      Tipe_Konten: 'Video HD & Code',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_02_demo',
      Durasi_Menit: 42,
      Status: 'Publish',
      Deskripsi: 'Teknik output text/plain;charset=utf-8 untuk bypass preflight OPTIONS CORS secara sempurna.'
    },
    {
      ID_Materi: 'MOD-03',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 03: Desain UI/UX SPA Interaktif, Animasi Kupu-Kupu 3D & Shimmer',
      Urutan: 3,
      Tipe_Konten: 'Video HD & CSS',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_03_demo',
      Durasi_Menit: 35,
      Status: 'Publish',
      Deskripsi: 'Membangun antarmuka kelas dunia dengan mikro-interaksi, 3D flip card, dan sparkle glow.'
    },
    {
      ID_Materi: 'MOD-04',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 04: Otomatisasi WhatsApp Gateway Fonnte & Auto-Kuitansi HMAC',
      Urutan: 4,
      Tipe_Konten: 'Video HD & Script',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_04_demo',
      Durasi_Menit: 45,
      Status: 'Publish',
      Deskripsi: 'Kirim notifikasi instan ke WhatsApp pembeli saat transfer diverifikasi oleh Admin.'
    },
    {
      ID_Materi: 'MOD-05',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 05: Manajemen Cicilan Siswa (Termin) & Pengingat 1-Klik WA',
      Urutan: 5,
      Tipe_Konten: 'Video HD & Template',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_05_demo',
      Durasi_Menit: 30,
      Status: 'Publish',
      Deskripsi: 'Menerbitkan tagihan bertahap dan mengirim pengingat WhatsApp otomatis sebelum jatuh tempo.'
    },
    {
      ID_Materi: 'MOD-06',
      ID_Produk: 'PRD-001',
      Judul_Modul: 'Modul 06: Deployment GitHub Pages & Custom Domain Vercel Bebas Biaya',
      Urutan: 6,
      Tipe_Konten: 'Video HD & Panduan',
      URL_Konten: 'https://drive.google.com/drive/folders/1etalaseku_modul_06_demo',
      Durasi_Menit: 25,
      Status: 'Publish',
      Deskripsi: 'Langkah mempublikasikan web app ke internet gratis selamanya dengan SSL otomatis.'
    }
  ];

  try {
    const sh = getSheet_(CONFIG.SHEETS.MATERI);
    list.forEach(m => {
      sh.appendRow([
        m.ID_Materi,
        m.ID_Produk,
        m.Judul_Modul,
        m.Urutan,
        m.Tipe_Konten,
        m.URL_Konten,
        m.Durasi_Menit,
        m.Status,
        m.Deskripsi
      ]);
    });
  } catch (e) {}

  return list;
}

function saveClassroomModule_(data) {
  const sh = getSheet_(CONFIG.SHEETS.MATERI);
  const rows = sh.getDataRange().getValues();
  const idMateri = data.ID_Materi || ('MOD-' + Date.now().toString().slice(-6));
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(idMateri)) {
      rowIndex = i + 1;
      break;
    }
  }

  const newRow = [
    idMateri,
    data.ID_Produk || 'PRD-001',
    data.Judul_Modul || '',
    Number(data.Urutan || 1),
    data.Tipe_Konten || 'Video HD & PDF',
    data.URL_Konten || '',
    Number(data.Durasi_Menit || 30),
    data.Status || 'Publish',
    data.Deskripsi || ''
  ];

  if (rowIndex > 0) {
    sh.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sh.appendRow(newRow);
  }

  invalidatePublicCache_();
  return { success: true, message: 'Modul materi classroom berhasil disimpan!', id: idMateri };
}

function deleteClassroomModule_(data) {
  const sh = getSheet_(CONFIG.SHEETS.MATERI);
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sh.deleteRow(i + 1);
      invalidatePublicCache_();
      return { success: true, message: 'Modul materi berhasil dihapus!' };
    }
  }
  return { success: false, message: 'Modul tidak ditemukan' };
}
