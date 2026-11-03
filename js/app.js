
// ============================================================================
// LIVE PREVIEW SCREENSHOT BUKTI TRANSFER CHECKOUT (OVO, LIVIN MANDIRI, BCA MOBILE, QRIS)
// ============================================================================
async function handleOrderProofFileChange(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
  const container = document.getElementById('order-proof-preview-container');
  const imgEl = document.getElementById('order-proof-preview-img');
  const nameEl = document.getElementById('order-proof-filename');
  const sizeEl = document.getElementById('order-proof-filesize');
  const dropzone = document.getElementById('order-proof-dropzone');
  const titleEl = document.getElementById('order-proof-label-title');

  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = (file.size / 1024).toFixed(1) + ' KB';

  try {
    const dataUrl = await compressAndReadImage(file, 900, 0.82);
    if (imgEl) imgEl.src = dataUrl;
    if (container) container.style.display = 'block';
    if (dropzone) {
      dropzone.style.borderColor = '#10B981';
      dropzone.style.background = '#F0FDF4';
    }
    if (titleEl) {
      titleEl.innerHTML = '<span style="color:#10B981; font-weight:800;">✅ Bukti Terlampir</span> (' + (file.size / 1024).toFixed(1) + ' KB) <button type="button" onclick="document.getElementById(\x27order-proof-file\x27).click()" style="margin-left:8px; padding:2px 8px; font-size:11px; border-radius:6px; background:#FFFFFF; border:1px solid #CBD5E1; color:#334155; cursor:pointer;">Ganti Foto</button>';
    }
    showToast('✅ Bukti transfer berhasil dilampirkan!', 'success', 2500);
  } catch (err) {
    console.error('Error reading proof preview:', err);
    try {
      const fallbackUrl = await readFileAsBase64(file);
      if (imgEl) imgEl.src = fallbackUrl;
      if (container) container.style.display = 'block';
    } catch(e) {}
  }
}
window.handleOrderProofFileChange = handleOrderProofFileChange;


// ============================================================================
// DEFAULT ORDERS & MERGED LOCAL STORAGE ENGINE
// ============================================================================
const DEFAULT_RECENT_ORDERS = [
  { ID_Order: 'ORD-20261102-170907-2186', Tanggal_Waktu: '2026-11-02 17:09', Nama_Pembeli: 'Daffa Fazdian', No_WhatsApp: '087894602627', Email: 'daffafazdian50@gmail.com', ID_Produk: 'PRD-1028-02', Produk: 'Kumpulan PRD', Nama_Produk: 'Kumpulan PRD', Total_Bayar: 49000, Status_Bayar: 'Lunas', Bukti_Transfer_URL: '' },
  { ID_Order: 'ORD-20261030-152053-9581', Tanggal_Waktu: '2026-10-30 15:20', Nama_Pembeli: 'Bmuda Member', No_WhatsApp: '081234567890', Email: 'bmuda6838@gmail.com', ID_Produk: 'PRD-000', Produk: 'Social Influence', Nama_Produk: 'Social Influence', Total_Bayar: 25000, Status_Bayar: 'Lunas', Bukti_Transfer_URL: '' },
  { ID_Order: 'ORD-1028-01', Tanggal_Waktu: '2026-10-28 16:30', Nama_Pembeli: 'Budi Santoso', No_WhatsApp: '08123456789', Email: 'budi@gmail.com', ID_Produk: 'PRD-000', Produk: 'Social Influence', Nama_Produk: 'Social Influence', Total_Bayar: 25000, Status_Bayar: 'Lunas', Bukti_Transfer_URL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
  { ID_Order: 'ORD-1028-02', Tanggal_Waktu: '2026-10-28 15:10', Nama_Pembeli: 'Anita Wijaya', No_WhatsApp: '08198765432', Email: 'anita@gmail.com', ID_Produk: 'PRD-1028-02', Produk: 'Kumpulan PRD', Nama_Produk: 'Kumpulan PRD', Total_Bayar: 49000, Status_Bayar: 'Lunas', Bukti_Transfer_URL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
  { ID_Order: 'ORD-1028-03', Tanggal_Waktu: '2026-10-28 14:05', Nama_Pembeli: 'Dimas Prasetyo', No_WhatsApp: '08134567890', Email: 'dimas@gmail.com', ID_Produk: 'PRD-000', Produk: 'Social Influence', Nama_Produk: 'Social Influence', Total_Bayar: 25000, Status_Bayar: 'Lunas', Bukti_Transfer_URL: '' }
];

function getMergedOrdersList() {
  try {
    const raw = localStorage.getItem('etalaseku_orders_data');
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored) && stored.length > 0) {
        const merged = [...stored];
        DEFAULT_RECENT_ORDERS.forEach(def => {
          if (!merged.some(o => (o.ID_Order === def.ID_Order || o.orderId === def.ID_Order))) {
            merged.push(def);
          }
        });
        return merged;
      }
    }
  } catch(e) {
    console.warn('Gagal membaca orders dari storage:', e);
  }
  return [...DEFAULT_RECENT_ORDERS];
}
window.getMergedOrdersList = getMergedOrdersList;

function initAdminAccounts() {
  try {
    const raw = localStorage.getItem('etalaseku_admin_accounts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        STATE.adminAccounts = parsed;
        return;
      }
    }
  } catch(e) {}
  
  STATE.adminAccounts = [
    { id: 'ADM-01', email: 'daffafazdian50@gmail.com', role: 'SUPER_ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: true },
    { id: 'ADM-02', email: 'admin@etalaseku.com', role: 'SUPER_ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: false }
  ];
  localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
}
window.initAdminAccounts = initAdminAccounts;

// ============================================================================
// ============================================================================
// RESILIENT MULTI-TIER STORAGE ENGINE (INDEXEDDB + ZERO-QUOTA SAFE LOCALSTORAGE)
// Mengatasi 'exceeded the quota' selamanya pada semua browser Desktop & HP!
// ============================================================================
const StorageHub = {
  dbPromise: null,

  getDB() {
    if (this.dbPromise) return this.dbPromise;
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }
    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open('EtalaseKu_AppDB', 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('keyval')) {
            db.createObjectStore('keyval');
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
    return this.dbPromise;
  },

  async idbSet(key, val) {
    try {
      const db = await this.getDB();
      if (!db) return false;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('keyval', 'readwrite');
          const store = tx.objectStore('keyval');
          store.put(val, key);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch(e) { resolve(false); }
      });
    } catch (e) { return false; }
  },

  async idbGet(key) {
    try {
      const db = await this.getDB();
      if (!db) return null;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction('keyval', 'readonly');
          const store = tx.objectStore('keyval');
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch(e) { resolve(null); }
      });
    } catch (e) { return null; }
  },

  // Safe localStorage set with QuotaExceeded auto-healing
  safeSet(key, valueStr, isProductsList = false) {
    try {
      localStorage.setItem(key, valueStr);
      return true;
    } catch (err) {
      console.warn('localStorage quota warning on ' + key + ', activating auto-healing:', err);
      if (isProductsList) {
        try {
          const parsed = JSON.parse(valueStr);
          if (Array.isArray(parsed)) {
            const lightweight = parsed.map(item => {
              const clone = { ...item };
              // Pangkas data:image raksasa di localStorage agar muat di bawah batas kuota 5MB browser
              if (clone.Banner_URL && clone.Banner_URL.startsWith('data:image/') && clone.Banner_URL.length > 2000) {
                clone.Banner_URL = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
              }
              delete clone.bannerBase64;
              return clone;
            });
            localStorage.setItem(key, JSON.stringify(lightweight));
            return true;
          }
        } catch (e2) {
          console.warn('Fallback lightweight save failed:', e2);
        }
      }
      return false;
    }
  }
};
window.StorageHub = StorageHub;

function persistProductsSafely(products) {
  if (!Array.isArray(products)) return;
  STATE.products = products;
  
  // 1. Simpan ke IndexedDB (kapasitas 500MB+, tahan semua gambar tanpa batas kuota)
  if (typeof StorageHub !== 'undefined' && StorageHub.idbSet) {
    StorageHub.idbSet('etalaseku_products_data', products);
  }

  // 2. Simpan ke localStorage dengan proteksi QuotaExceeded auto-healing
  if (typeof StorageHub !== 'undefined' && StorageHub.safeSet) {
    StorageHub.safeSet('etalaseku_products_data', JSON.stringify(products), true);
  } else {
    try {
      localStorage.setItem('etalaseku_products_data', JSON.stringify(products));
    } catch(e) {}
  }
}
window.persistProductsSafely = persistProductsSafely;

// HIGH-PERFORMANCE IMAGE COMPRESSION & PERSISTENCE ENGINE (ZERO-QUOTA LOSS)
// ============================================================================
function compressAndReadImage(file, maxWidth = 800, quality = 0.70) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Jika masih di atas 65KB (~85.000 chars), kompres tahap 2 agar sangat hemat storage
        if (dataUrl.length > 85000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.58);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
window.compressAndReadImage = compressAndReadImage;

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
  let str = url.trim();
  if (!str) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';

  // Deteksi & konversi otomatis link Google Drive ke direct viewable CDN
  if (str.includes('drive.google.com')) {
    const fileIdMatch = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  // Jika Data URL terpotong tanpa payload gambar (misal hanya prefix 'data:image/jpeg;base64' atau payload sangat pendek)
  if (str.startsWith('data:image/')) {
    if (!str.includes(',') || str.split(',')[1].length < 30) {
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
    }
    return str;
  }

  if (str.startsWith('http://') || str.startsWith('https://')) {
    return str;
  }
  // Bila format raw base64 tanpa prefix
  if (str.startsWith('/') || str.startsWith('iVBORw') || str.length > 80) {
    return 'data:image/jpeg;base64,' + str;
  }
  return str;
}
window.formatImageUrl = formatImageUrl;

function sanitizeProduct(p) {
  if (!p) return p;
  const pName = String(p.Nama_Produk || '').toLowerCase();
  if (pName.includes('social influence')) {
    // Gunakan file banner aset lokal terkompresi resmi yang sangat ringan & tajam
    if (!p.Banner_URL || p.Banner_URL.includes('unsplash') || p.Banner_URL.length < 50 || p.Banner_URL.startsWith('data:image/')) {
      p.Banner_URL = 'social-influence-banner.jpg';
    }
    // Pastikan harga promo selalu akurat Rp 25.000 jika sebelumnya tersimpan demo Rp 99.000
    if (p.Harga_Promo === 99000 || !p.Harga_Promo) {
      p.Harga_Promo = 25000;
    }
    p.Harga_Normal = 259000;
  } else if (pName.includes('kumpulan prd')) {
    // Gunakan file banner aset lokal terkompresi resmi yang sangat ringan & tajam
    if (!p.Banner_URL || p.Banner_URL.includes('unsplash') || p.Banner_URL.length < 50 || p.Banner_URL.startsWith('data:image/')) {
      p.Banner_URL = 'kumpulan-prd-banner.jpg';
    }
    if (!p.Harga_Promo || p.Harga_Promo === 0) {
      p.Harga_Promo = 49000;
    }
    if (!p.Harga_Normal || p.Harga_Normal === 0) {
      p.Harga_Normal = 149000;
    }
  }

  if (!p.Banner_URL || typeof p.Banner_URL !== 'string' || p.Banner_URL.trim() === '' || 
      (p.Banner_URL.startsWith('data:image/') && (!p.Banner_URL.includes(',') || p.Banner_URL.split(',')[1].length < 30))) {
    p.Banner_URL = pName.includes('prd') ? 'kumpulan-prd-banner.jpg' : 'social-influence-banner.jpg';
  } else {
    p.Banner_URL = formatImageUrl(p.Banner_URL);
  }
  return p;
}
window.sanitizeProduct = sanitizeProduct;

const DEFAULT_SHOWCASES_LIST = [
  {
    ID_Showcase: 'SHW-01',
    Nama_Karya: 'Trailer Web App CRM Lawfirm & Manajemen Klien',
    Nama_Member: 'Aditya Pratama',
    Profesi: 'Alumni Batch 2 • Freelance Developer',
    Kategori: 'CRM & Otomasi',
    Statistik_Pencapaian: '2.450+ Leads Tercatat',
    Gambar_Preview_URL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    Galeri_Karya: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    Foto_Profil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    Testimoni_Kesan: 'Trailer video mendemonstrasikan sistem CRM Lawfirm tanpa hosting bulanan dengan Google Apps Script. WhatsApp otomatis berjalan real-time!',
    Link_Demo: 'https://etalaseku-gules.vercel.app',
    Video_Youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    Status_Tampil: 'Publish'
  },
  {
    ID_Showcase: 'SHW-02',
    Nama_Karya: 'Multi-Slide Showcase Kasir & Billing Ber-QR Code',
    Nama_Member: 'Sarah Amanda',
    Profesi: 'Alumni Batch 1 • Online Store Owner',
    Kategori: 'Kasir & Billing',
    Statistik_Pencapaian: '10x Lebih Cepat',
    Gambar_Preview_URL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    Galeri_Karya: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    Foto_Profil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    Testimoni_Kesan: 'Menampilkan galeri tangkapan layar otomatis (slideshow 4 foto). Kuitansi QR code otomatis terbit ke WhatsApp pelanggan!',
    Link_Demo: 'https://etalaseku-gules.vercel.app',
    Video_Youtube: '',
    Status_Tampil: 'Publish'
  },
  {
    ID_Showcase: 'SHW-03',
    Nama_Karya: 'Aplikasi Absensi & Nilai Siswa Realtime 16:9',
    Nama_Member: 'Khoirul Fajar',
    Profesi: 'Alumni Batch 2 • Guru IT & Pengembang',
    Kategori: 'Web App GAS',
    Statistik_Pencapaian: '500+ Siswa Terdata',
    Gambar_Preview_URL: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    Galeri_Karya: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    Foto_Profil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    Testimoni_Kesan: 'Aplikasi absensi sekolah responsif dengan QR scan instan. Rekap nilai dan kehadiran otomatis terhitung di Google Sheets.',
    Link_Demo: 'https://etalaseku-gules.vercel.app',
    Video_Youtube: '',
    Status_Tampil: 'Publish'
  }
];
/**
 * ============================================================================
 * NEXSTORE PRODUK DIGITAL - BY @DAFFAFAZDIAN.ID — FRONTEND APPLICATION ENGINE
 * ============================================================================
 * Fitur Utama:
 *   1. 3D Realistic Butterfly Cursor Follower (Inertia + Velocity-based Banking + Sparkle Dust)
 *   2. Hero & Product Multi-Image Auto-Slideshows
 *   3. 3D Flip Interactive Testimonials with Auto-Cycle & Detail Pop-Up
 *   4. Instant Modal Checkout with Drive Upload & Anti-CORS REST API
 *   5. Modul Tagihan & Pembayaran Siswa (gas-tagihan-pembayaran)
 *   6. Modul CRM & Notifikasi WhatsApp Gateway (gas-notifikasi-wa-crm)
 *   7. Floating WhatsApp Interactive Widget with Dynamic Pre-filled Chat
 *   8. Admin PIN Authentication & 1-Click Verification Dashboard
 * ============================================================================
 */

// ============================================================================
// ULTRA-MODERN IN-APP TOAST SYSTEM (Zero Browser Alert/Confirm Popups)
// ============================================================================
function showToast(message, type = 'info', duration = 2800) {
  let toastContainer = document.getElementById('app-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'app-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `app-toast toast-${type}`;
  
  let icon = '✨';
  if (type === 'success') icon = '✅';
  if (type === 'error' || type === 'danger') icon = '⚠️';
  if (type === 'logout') icon = '🚪';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// Override native window.alert to stop "etalaseku-gules.vercel.app says" popup
window.confirm = function(msg) {
  return true;
};

window.alert = function(msg) {
  showToast(String(msg), 'error', 3500);
};

window.showToast = showToast;

// Default Payment Channels Configuration (QRIS, GoPay, OVO, Mandiri, BCA, BNI)
const DEFAULT_PAYMENT_CHANNELS = {
  qris: {
    id: 'qris',
    nama: 'QRIS Instant',
    label: 'QRIS (Semua Bank & e-Wallet)',
    badge: 'Otomatis',
    tipe: 'qris',
    rekening: 'Scan QRIS Dinamis',
    atasNama: 'NexStore / Daffa Fazdian',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014ID.LINKAJA.WWW011893600911002234567802150878946026275204581253033605802ID5912ETALASEKUHUB6007JAKARTA61051234062070703A0163041D3F',
    instruksi: 'Scan barcode QRIS di atas via BCA Mobile, Mandiri Livin, BNI Mobile, GoPay, OVO, atau ShopeePay.',
    aktif: true
  },
  bca: {
    id: 'bca',
    nama: 'BCA',
    label: 'BCA Virtual Account / Transfer',
    badge: 'Bank',
    tipe: 'bank',
    rekening: '123-456-7890',
    atasNama: 'NexStore / Daffa Fazdian',
    instruksi: 'Transfer melalui m-BCA, ATM BCA, atau KlikBCA ke rekening di atas.',
    aktif: true
  },
  mandiri: {
    id: 'mandiri',
    nama: 'Mandiri',
    label: 'Mandiri Livin / Transfer',
    badge: 'Bank',
    tipe: 'bank',
    rekening: '987-654-3210',
    atasNama: 'NexStore / Daffa Fazdian',
    instruksi: 'Transfer melalui Livin by Mandiri atau ATM Mandiri ke rekening di atas.',
    aktif: true
  },
  bni: {
    id: 'bni',
    nama: 'BNI',
    label: 'BNI Mobile / Transfer',
    badge: 'Bank',
    tipe: 'bank',
    rekening: '112-233-4455',
    atasNama: 'NexStore / Daffa Fazdian',
    instruksi: 'Transfer via BNI Mobile Banking atau ATM BNI ke rekening di atas.',
    aktif: true
  },
  gopay: {
    id: 'gopay',
    nama: 'GoPay',
    label: 'GoPay / Gojek',
    badge: 'e-Wallet',
    tipe: 'ewallet',
    rekening: '0878-9460-2627',
    atasNama: 'NexStore / Daffa Fazdian',
    instruksi: 'Buka Gojek / GoPay > Pilih Bayar / Transfer Saldo > Masukkan nomor HP di atas.',
    aktif: true
  },
  ovo: {
    id: 'ovo',
    nama: 'OVO',
    label: 'OVO Cash',
    badge: 'e-Wallet',
    tipe: 'ewallet',
    rekening: '0878-9460-2627',
    atasNama: 'NexStore / Daffa Fazdian',
    instruksi: 'Buka aplikasi OVO > Pilih Transfer > Sesama OVO > Masukkan nomor HP di atas.',
    aktif: true
  }
};

// Default Classroom Learning Modules (Materi Pembelajaran Member Area - Foto 2 Reference)
const DEFAULT_MODULES = [
  {
    ID_Materi: 'MOD-01',
    ID_Produk: 'PRD-001',
    Judul_Modul: 'METODE 3 | LANJUTAN - Integrasi GAS ke VERCEL...',
    Urutan: 1,
    Tipe_Badge: 'KELAS',
    Kategori: 'Kelas',
    Tipe_Konten: 'Video HD & Code',
    Episode: 6,
    Materi_Count: 27,
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: 65,
    Status: 'Publish',
    Thumbnail_URL: './assets/modules/thumb-metode3.jpg',
    Button_Text: '▶ Buka Ruang Belajar',
    Deskripsi: 'dari cara Paling Sederhana menjadi Profesional'
  },
  {
    ID_Materi: 'MOD-02',
    ID_Produk: 'PRD-002',
    Judul_Modul: 'Kumpulan PRD (GRATIS)',
    Urutan: 2,
    Tipe_Badge: 'DOKUMEN',
    Kategori: 'Dokumen',
    Tipe_Konten: 'PDF & Template',
    Episode: 1,
    Materi_Count: 1,
    URL_Konten: 'https://drive.google.com/drive/folders/1lzVZt5E57RzmQ8ipcBgraukC8YIwYWwR/',
    Durasi_Menit: 20,
    Status: 'Publish',
    Thumbnail_URL: './assets/modules/thumb-prd.jpg',
    Button_Text: '📂 Akses Produk',
    Deskripsi: 'Silahkan Download PRD yang dibutuhkan sebagai Referensi'
  },
  {
    ID_Materi: 'MOD-03',
    ID_Produk: 'PRD-001',
    Judul_Modul: 'Kumpulan Video Cara Revisi & Upgrade',
    Urutan: 3,
    Tipe_Badge: 'KELAS',
    Kategori: 'Kelas',
    Tipe_Konten: 'Video HD & Tips',
    Episode: 2,
    Materi_Count: 8,
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: 35,
    Status: 'Publish',
    Thumbnail_URL: './assets/modules/thumb-revisi.jpg',
    Button_Text: '▶ Buka Ruang Belajar',
    Deskripsi: 'Kumpulan Video Cara Revisi & Upgrade biar Aman dan Tidak...'
  },
  {
    ID_Materi: 'MOD-04',
    ID_Produk: 'PRD-001',
    Judul_Modul: 'METODE 1 | BASIC - Belajar GAS sangat Mudah...',
    Urutan: 4,
    Tipe_Badge: 'KELAS',
    Kategori: 'Kelas',
    Tipe_Konten: 'Video HD & Latihan',
    Episode: 4,
    Materi_Count: 7,
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: 45,
    Status: 'Publish',
    Thumbnail_URL: './assets/modules/thumb-basic.jpg',
    Button_Text: '▶ Buka Ruang Belajar',
    Deskripsi: 'Pelajari dasar-dasar Google Apps Script dari nol hingga mahir.'
  },
  {
    ID_Materi: 'MOD-05',
    ID_Produk: 'PRD-003',
    Judul_Modul: 'Masterclass: Social Influence in Workplace',
    Urutan: 5,
    Tipe_Badge: 'KELAS',
    Kategori: 'Kelas',
    Tipe_Konten: 'Video HD & E-Book',
    Episode: 6,
    Materi_Count: 18,
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: 90,
    Status: 'Publish',
    Thumbnail_URL: './social-influence-banner.jpg',
    Button_Text: '▶ Buka Ruang Belajar',
    Deskripsi: 'Strategi esensial membangun pengaruh positif tanpa bergantung pada hierarki (Kredibilitas, Komunikasi, Koneksi).'
  },
  {
    ID_Materi: 'MOD-06',
    ID_Produk: 'PRD-004',
    Judul_Modul: 'Digital Agency Notion OS & CRM Terpadu',
    Urutan: 6,
    Tipe_Badge: 'APLIKASI',
    Kategori: 'Aplikasi',
    Tipe_Konten: 'Template Notion & Guide',
    Episode: 1,
    Materi_Count: 15,
    URL_Konten: 'https://notion.so',
    Durasi_Menit: 30,
    Status: 'Publish',
    Thumbnail_URL: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    Button_Text: '📂 Akses Produk',
    Deskripsi: 'Template Notion terlengkap untuk manajemen klien agency, pipeline penjualan, dan invoice otomatis terpusat.'
  },
  {
    ID_Materi: 'MOD-07',
    ID_Produk: 'PRD-001',
    Judul_Modul: 'GAS Pro Web App Masterclass 🎓',
    Urutan: 7,
    Tipe_Badge: 'KELAS',
    Kategori: 'Kelas',
    Tipe_Konten: 'Video HD & Code',
    Episode: 8,
    Materi_Count: 32,
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: 180,
    Status: 'Publish',
    Thumbnail_URL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    Button_Text: '▶ Buka Ruang Belajar',
    Deskripsi: 'Bangun web app skala industri dengan Google Apps Script, Google Sheets, & Tailwind CSS tanpa server eksternal.'
  }
];

// Global State
// ============================================================================
// PERSISTENT CLASSROOM MODULES STORAGE ENGINE (ANTI-REAPPEAR ON DELETE/REFRESH)
// ============================================================================
function getDeletedModuleIds() {
  try {
    const raw = localStorage.getItem('etalaseku_deleted_module_ids');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveDeletedModuleIds(ids) {
  try {
    const unique = Array.from(new Set((ids || []).filter(Boolean)));
    localStorage.setItem('etalaseku_deleted_module_ids', JSON.stringify(unique));
  } catch (e) {}
}

function loadStoredClassroomModules() {
  const deletedSet = new Set(getDeletedModuleIds());
  try {
    const rawPrimary = localStorage.getItem('etalaseku_classroom_modules');
    if (rawPrimary !== null) {
      const parsed = JSON.parse(rawPrimary);
      if (Array.isArray(parsed)) {
        const clean = parsed.filter(m => m && !deletedSet.has(m.ID_Materi));
        // Sync both keys so there is never a mismatch
        const json = JSON.stringify(clean);
        localStorage.setItem('etalaseku_classroom_modules', json);
        localStorage.setItem('etalaseku_modules', json);
        return clean;
      }
    }
    const rawLegacy = localStorage.getItem('etalaseku_modules');
    if (rawLegacy !== null) {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (Array.isArray(parsedLegacy)) {
        const cleanLegacy = parsedLegacy.filter(m => m && !deletedSet.has(m.ID_Materi));
        const json = JSON.stringify(cleanLegacy);
        localStorage.setItem('etalaseku_classroom_modules', json);
        localStorage.setItem('etalaseku_modules', json);
        return cleanLegacy;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca modul tersimpan:', e);
  }
  const initial = DEFAULT_MODULES.filter(m => !deletedSet.has(m.ID_Materi));
  return initial;
}

function persistClassroomModules(mods) {
  const safeMods = Array.isArray(mods) ? mods : [];
  STATE.modules = safeMods;
  try {
    const json = JSON.stringify(safeMods);
    localStorage.setItem('etalaseku_classroom_modules', json);
    localStorage.setItem('etalaseku_modules', json);
  } catch (e) {
    console.warn('Gagal menyimpan modul ke localStorage:', e);
  }
}

// ============================================================================
// PERSISTENT SITE SETTINGS ENGINE (ANNOUNCEMENT BAR, WA CS & COMMUNITY LINK)
// ============================================================================
const DEFAULT_SITE_SETTINGS = {
  announcement_bar_text: '🔥 DISKON 50% - Akses Seumur Hidup Batch 3 Terbatas Hanya 50 Orang!',
  wa_cs_number: '6287894602627',
  link_komunitas_tg: '' // Dikosongkan dulu karena grup belum dibuat; otomatis aktif di Halaman Utama saat diisi di CRM
};

function normalizeWaCsNumber(raw) {
  if (!raw) return APP_CONFIG.DEFAULT_WA_CS || '6287894602627';
  let digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return APP_CONFIG.DEFAULT_WA_CS || '6287894602627';
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  }
  return digits;
}

function isPlaceholderCommunityLink(raw) {
  if (!raw) return true;
  const lower = String(raw).trim().toLowerCase();
  return (
    lower === '' ||
    lower.includes('t.me/etalaseku_community') ||
    lower.includes('t.me/komunitas_etalaseku')
  );
}

function normalizeCommunityLinkUrl(raw) {
  if (isPlaceholderCommunityLink(raw)) return '';
  const trimmed = String(raw).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(t\.me|telegram\.me|chat\.whatsapp\.com|wa\.me)\//i.test(trimmed) || trimmed.includes('.')) {
    return 'https://' + trimmed.replace(/^\/+/, '');
  }
  return trimmed;
}

function loadStoredSiteSettings() {
  try {
    const raw = localStorage.getItem('etalaseku_site_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          announcement_bar_text: typeof parsed.announcement_bar_text === 'string'
            ? parsed.announcement_bar_text
            : DEFAULT_SITE_SETTINGS.announcement_bar_text,
          wa_cs_number: parsed.wa_cs_number
            ? normalizeWaCsNumber(parsed.wa_cs_number)
            : DEFAULT_SITE_SETTINGS.wa_cs_number,
          link_komunitas_tg: typeof parsed.link_komunitas_tg === 'string'
            ? normalizeCommunityLinkUrl(parsed.link_komunitas_tg)
            : '',
          rekening_pembayaran: parsed.rekening_pembayaran || ''
        };
      }
    }
  } catch (e) {
    console.warn('Gagal memuat etalaseku_site_settings:', e);
  }
  return Object.assign({}, DEFAULT_SITE_SETTINGS);
}

function persistSiteSettings(settingsObj) {
  const clean = {
    announcement_bar_text: typeof settingsObj.announcement_bar_text === 'string'
      ? settingsObj.announcement_bar_text.trim()
      : DEFAULT_SITE_SETTINGS.announcement_bar_text,
    wa_cs_number: normalizeWaCsNumber(settingsObj.wa_cs_number || DEFAULT_SITE_SETTINGS.wa_cs_number),
    link_komunitas_tg: normalizeCommunityLinkUrl(settingsObj.link_komunitas_tg || ''),
    rekening_pembayaran: settingsObj.rekening_pembayaran || ''
  };
  STATE.settings = clean;
  try {
    localStorage.setItem('etalaseku_site_settings', JSON.stringify(clean));
  } catch (e) {
    console.warn('Gagal menyimpan etalaseku_site_settings:', e);
  }
  return clean;
}

function getActiveWaCsNumber() {
  if (STATE && STATE.settings && STATE.settings.wa_cs_number) {
    return normalizeWaCsNumber(STATE.settings.wa_cs_number);
  }
  const stored = loadStoredSiteSettings();
  return normalizeWaCsNumber(stored.wa_cs_number || APP_CONFIG.DEFAULT_WA_CS);
}

const STATE = {
  products: [],
  testimonials: [
      {
        ID_Testimoni: 'TST-001',
        Nama_Member: 'Aditya Pratama',
        Profesi: 'Freelance Developer',
        Rating: 5,
        Isi_Ulasan: 'Materi GAS Pro Masterclass sangat aplikatif! Saya berhasil membuat sistem CRM Lawfirm untuk klien dan langsung dibayar 15 juta dalam 2 minggu.',
        Hasil_Pencapaian: 'Closing Proyek Rp 15 Jt',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-002',
        Nama_Member: 'Sarah Amalia',
        Profesi: 'Digital Agency Owner',
        Rating: 5,
        Isi_Ulasan: 'Sistem otomatisasi pengiriman kuitansi dan WhatsApp ini menghemat waktu tim CS kami hingga 90%. Tidak ada lagi komplain akses lambat!',
        Hasil_Pencapaian: 'Hemat 90% Waktu CS',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-003',
        Nama_Member: 'Rian Hidayat',
        Profesi: 'Pemilik UMKM Retail',
        Rating: 5,
        Isi_Ulasan: 'Template Notion OS dan modul penagihan siswa sangat rapi. Penagihan SPP bulanan di tempat bimbel saya jadi 100% otomatis tercatat di Spreadsheet.',
        Hasil_Pencapaian: '100% Otomatisasi SPP',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-004',
        Nama_Member: 'Budi Santoso',
        Profesi: 'Senior Product Manager',
        Rating: 5,
        Isi_Ulasan: 'Kumpulan PRD riil ini menyelamatkan sprint tim kami! Formatnya standar industri tech unicorn dan sangat mudah disesuaikan.',
        Hasil_Pencapaian: 'Dokumentasi Produk 5x Cepat',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-005',
        Nama_Member: 'Dewi Lestari',
        Profesi: 'E-Commerce Specialist',
        Rating: 5,
        Isi_Ulasan: 'Setelah ikut modul Social Influence & Sales Web App, conversion rate toko meningkat drastis. Desainnya sangat meyakinkan pembeli!',
        Hasil_Pencapaian: 'Omset Naik 3x Lipat',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-006',
        Nama_Member: 'Dimas Prasetyo',
        Profesi: 'Fullstack Creator',
        Rating: 5,
        Isi_Ulasan: 'Arsitektur decoupled GAS dengan Google Sheets ini jenius. Bebas biaya langganan bulanan selamanya dan langsung jalan tanpa server rumit.',
        Hasil_Pencapaian: 'Hemat Hosting 100%',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
      }
    ],
    showcases: (function() {
    try {
      const stored = localStorage.getItem('etalaseku_showcases_data');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return DEFAULT_SHOWCASES_LIST;
  })(),
  myShowcases: (function() {
    try {
      const stored = localStorage.getItem('etalaseku_my_showcases');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      {
        ID_Showcase: 'MY-01',
        Nama_Karya: 'Aplikasi Keuangan Digital',
        Profesi: 'Fresh Graduate',
        Tanggal: '23 Okt 2026 11:33',
        Status: 'Tampil di Pameran',
        Link_Demo: 'https://etalaseku-gules.vercel.app',
        Video_Youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ];
  })(),
  settings: loadStoredSiteSettings(),
  modules: loadStoredClassroomModules(),
  activeProductCheckout: null,
  selectedPaymentChannelKey: 'qris',
  selectedPaymentPlan: 'lunas',
  paymentChannels: (function() {
    try {
      const stored = localStorage.getItem('etalaseku_payment_channels');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return Object.assign({}, DEFAULT_PAYMENT_CHANNELS);
  })(),
  adminToken: localStorage.getItem('etalaseku_admin_token') || null,
  adminRole: localStorage.getItem('etalaseku_admin_role') || 'SUPER_ADMIN',
  adminEmail: localStorage.getItem('etalaseku_admin_email') || 'admin@etalaseku.com',
  adminAccounts: (function() {
    try {
      const stored = localStorage.getItem('etalaseku_admin_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [
      { id: 'ADM-01', email: 'daffafazdian50@gmail.com', role: 'SUPER_ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: true },
      { id: 'ADM-02', email: 'admin@etalaseku.com', role: 'ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: false }
    ];
  })(),
  orders: (function() {
    try {
      const stored = localStorage.getItem('etalaseku_orders_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
    return [];
  })(),
  bills: [],
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  butterfly: { x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0, speed: 0 }
};

// ============================================================================
// 1. REALISTIC 3D BUTTERFLY CURSOR FOLLOWER & SPARKLE TRAIL
// ============================================================================
class ButterflyCursor {
  constructor() {
    this.el = document.getElementById('butterfly-container');
    this.canvas = document.getElementById('sparkle-canvas');
    if (!this.el || !this.canvas) return;

    // Deteksi smartphone / touch screen: Matikan total di HP agar scrolling 60/120 FPS lancar dan baterai hemat
    const isMobileDevice = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobileDevice) {
      if (this.el) this.el.style.display = 'none';
      if (this.canvas) this.canvas.style.display = 'none';
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Track mouse
    window.addEventListener('mousemove', (e) => {
      STATE.mouse.x = e.clientX;
      STATE.mouse.y = e.clientY;
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        STATE.mouse.x = e.touches[0].clientX;
        STATE.mouse.y = e.touches[0].clientY;
      }
    });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createSparkle(x, y) {
    if (Math.random() > 0.4) {
      const colors = ['#FF2E63', '#FBBF24', '#7C3AED', '#38BDF8', '#FFFFFF'];
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 + 0.8, // gentle fall
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  animate() {
    // Smooth lerp follow
    const dx = STATE.mouse.x - STATE.butterfly.x;
    const dy = STATE.mouse.y - STATE.butterfly.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    STATE.butterfly.speed = dist;
    STATE.butterfly.x += dx * 0.085;
    STATE.butterfly.y += dy * 0.085;

    // Calculate flight orientation angle
    if (dist > 2) {
      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      STATE.butterfly.angle += (targetAngle - STATE.butterfly.angle) * 0.12;
    }

    // Dynamic wing flap speed based on velocity
    const leftWing = this.el.querySelector('.wing.left');
    const rightWing = this.el.querySelector('.wing.right');
    const flapDuration = Math.max(0.12, 0.35 - Math.min(dist * 0.005, 0.22)) + 's';
    if (leftWing && rightWing) {
      leftWing.style.animationDuration = flapDuration;
      rightWing.style.animationDuration = flapDuration;
    }

    // Apply transform to butterfly element
    this.el.style.transform = `translate3d(${STATE.butterfly.x}px, ${STATE.butterfly.y}px, 0) rotate(${STATE.butterfly.angle}deg)`;

    // Spawn sparkle particle behind butterfly
    if (dist > 1) {
      this.createSparkle(STATE.butterfly.x, STATE.butterfly.y);
    }

    // Render & update sparkles
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================================
// 2. HERO & PRODUCT MULTI-IMAGE AUTO SLIDESHOWS
// ============================================================================
class SlideshowManager {
  static initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slideshow-dots');
    if (!slides.length || !dotsContainer) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => SlideshowManager.goToHeroSlide(idx));
      dotsContainer.appendChild(dot);
    });

    let current = 0;
    // Delay auto-slideshow rotation by 12s so initial FCP & LCP settle with 0 mutations
    setTimeout(() => {
      setInterval(() => {
        current = (current + 1) % slides.length;
        SlideshowManager.goToHeroSlide(current);
      }, 5000);
    }, 12000);
  }

  static goToHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    slides.forEach((s, i) => {
      const isActive = i === index;
      s.classList.toggle('active', isActive);
      if (isActive) {
        const lazyImg = s.querySelector('img[data-src]');
        if (lazyImg) {
          lazyImg.src = lazyImg.dataset.src;
          lazyImg.removeAttribute('data-src');
        }
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  static initProductSlideshows() {
    const carousels = document.querySelectorAll('.product-carousel');
    carousels.forEach(carousel => {
      const slides = carousel.querySelectorAll('.product-slide');
      if (slides.length <= 1) return;

      let idx = 0;
      setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
      }, 3500 + Math.random() * 800); // slight offset between cards
    });
  }
}

// ============================================================================
// 3. 3D FLIP INTERACTIVE TESTIMONIALS (AUTO-FLIP & DETAIL POPUP)
// ============================================================================
class TestimonialFlipManager {
  static timer = null;
  static isPaused = false;
  static currentSlot = 0;
  static queueIndex = 4;
  static activeSlots = [];

  static init() {
    if (this.timer) clearInterval(this.timer);
    const list = (STATE.testimonials && STATE.testimonials.length > 0) ? STATE.testimonials : [];
    if (!list.length) return;

    const cards = document.querySelectorAll('.flip-card-wrapper');
    if (!cards.length) return;

    // Attach hover pause & resume
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => { TestimonialFlipManager.isPaused = true; });
      card.addEventListener('mouseleave', () => { TestimonialFlipManager.isPaused = false; });
    });

    // Jika testimoni > 4, jalankan pergantian satu per satu dengan transisi flip 3D halus
    if (list.length > 4) {
      this.queueIndex = 4 % list.length;
      this.currentSlot = 0;

      this.timer = setInterval(() => {
        if (TestimonialFlipManager.isPaused) return;

        const currentCards = document.querySelectorAll('.flip-card-wrapper');
        if (!currentCards.length) return;

        const slotToFlip = TestimonialFlipManager.currentSlot % currentCards.length;
        const targetCard = currentCards[slotToFlip];
        if (!targetCard) return;

        const nextTesti = list[TestimonialFlipManager.queueIndex];
        TestimonialFlipManager.queueIndex = (TestimonialFlipManager.queueIndex + 1) % list.length;
        TestimonialFlipManager.currentSlot = (TestimonialFlipManager.currentSlot + 1) % currentCards.length;

        // Step 1: Flip out (90deg)
        targetCard.classList.add('flipping-out');
        targetCard.classList.remove('flipping-in');

        setTimeout(() => {
          // Step 2: Swap content at 90deg
          TestimonialFlipManager.updateCardDom(targetCard, nextTesti);

          // Step 3: Flip back in (0deg)
          targetCard.classList.remove('flipping-out');
          targetCard.classList.add('flipping-in');

          setTimeout(() => {
            targetCard.classList.remove('flipping-in');
          }, 350);
        }, 350);

      }, 4000);
    } else {
      // Jika <= 4, sequential 3D peek flip
      let activeIdx = 0;
      this.timer = setInterval(() => {
        if (TestimonialFlipManager.isPaused) return;
        const cList = document.querySelectorAll('.flip-card-wrapper');
        if (!cList.length) return;
        cList.forEach(c => c.classList.remove('flipped'));
        if (cList[activeIdx]) {
          cList[activeIdx].classList.add('flipped');
          setTimeout(() => {
            if (cList[activeIdx]) cList[activeIdx].classList.remove('flipped');
          }, 3000);
        }
        activeIdx = (activeIdx + 1) % cList.length;
      }, 5500);
    }
  }

  static updateCardDom(card, t) {
    if (!card || !t) return;
    card.onclick = () => TestimonialFlipManager.showDetailModal(t);

    const initialEl = card.querySelector('.testi-header > div:first-child');
    if (initialEl) initialEl.textContent = (t.Nama_Member || 'S').charAt(0).toUpperCase();

    const nameEl = card.querySelector('.testi-header h3, .testi-header h4, .testi-author');
    if (nameEl) nameEl.textContent = t.Nama_Member || 'Alumni Member';

    const roleEl = card.querySelector('.testi-header p');
    if (roleEl) roleEl.textContent = t.Profesi || 'Member Siswa';

    const quoteEl = card.querySelector('.testi-quote');
    if (quoteEl) quoteEl.textContent = '"' + (t.Isi_Ulasan || '').slice(0, 110) + '..."';

    const badgeEl = card.querySelector('.testi-result-badge');
    if (badgeEl) badgeEl.textContent = '🚀 ' + (t.Hasil_Pencapaian || 'Verified Result');

    const backTitle = card.querySelector('.flip-card-back h4');
    if (backTitle) backTitle.textContent = t.Hasil_Pencapaian || 'Hasil Maksimal';

    const backQuote = card.querySelector('.flip-card-back p');
    if (backQuote) backQuote.textContent = '"' + (t.Isi_Ulasan || '') + '"';
  }

  static showDetailModal(testi) {
    const modal = document.getElementById('modal-testi-detail');
    if (!modal) return;

    const initialEl = document.getElementById('testi-modal-initial');
    if (initialEl) initialEl.textContent = (testi.Nama_Member || 'S').charAt(0).toUpperCase();
    document.getElementById('testi-modal-name').textContent = testi.Nama_Member || 'Alumni Member';
    document.getElementById('testi-modal-role').textContent = testi.Profesi || 'Digital Creator';
    document.getElementById('testi-modal-quote').textContent = testi.Isi_Ulasan || '-';
    document.getElementById('testi-modal-badge').textContent = testi.Hasil_Pencapaian || 'Verified Student Result';

    modal.classList.add('active');
  }
}

// ============================================================================
// 4. DATA LOADER & RENDERER (GAS-PRO-API WITH SWR CACHE)
// ============================================================================
async function loadPublicData() {
  try {
    const fallback = getFallbackMockData();

    // ⚡ 1. INSTANT RENDERING (0ms Core Web Vitals Optimization):
    // Render produk, testimoni, dan showcase dari cache/fallback seketika agar LCP & FCP < 500ms
    if (!STATE.products || STATE.products.length === 0) {
      let cached = null;
      try {
        const stored = localStorage.getItem('etalaseku_products_data');
        if (stored) cached = JSON.parse(stored);
      } catch(e) {}
      STATE.products = (Array.isArray(cached) && cached.length > 0 ? cached : fallback.products).map(sanitizeProduct);
    }
    if (!STATE.testimonials || STATE.testimonials.length === 0) {
      STATE.testimonials = fallback.testimonials || [];
    }
    if (!STATE.showcases || STATE.showcases.length === 0) {
      STATE.showcases = (typeof DEFAULT_SHOWCASES_LIST !== 'undefined' ? DEFAULT_SHOWCASES_LIST : (fallback.showcases || []));
    }

    renderProducts();
  checkAndRenderVipWelcomeCard();
    renderTestimonials();
    TestimonialFlipManager.init();
    renderShowcases();

    // ⚡ 2. BACKGROUND REVALIDATION (Non-blocking):
    // Tarik data terbaru dari server Google Sheets di latar belakang
    let data = null;
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      try {
        const res = await fetch(`${APP_CONFIG.GAS_URL}?action=getPublicData&_t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) data = json.data;
      } catch (netErr) {
        console.warn('Background sync offline, using local cache:', netErr);
      }
    }
    if (!data) data = fallback;

    // SINKRONISASI KATALOG PRODUK REAL-TIME LINTAS PERANGKAT (DESKTOP <-> MOBILE)
    // Sekali upload di Desktop langsung otomatis muncul di Mobile & Halaman Utama tanpa upload ulang!
    try {
      const serverProducts = (data && Array.isArray(data.products) && data.products.length > 0)
        ? data.products.map(sanitizeProduct)
        : null;

      let localProducts = [];
      try {
        const storedProducts = localStorage.getItem('etalaseku_products_data');
        if (storedProducts) localProducts = JSON.parse(storedProducts);
      } catch(e) {}

      function isObsoleteDemoProduct(p) {
        if (!p || !p.Nama_Produk) return false;
        const n = String(p.Nama_Produk).toLowerCase();
        return n.includes('gas pro web app masterclass') ||
               n.includes('notion os') ||
               n.includes('bootcamp');
      }

      // Hapus produk demo usang dari localProducts
      if (Array.isArray(localProducts)) {
        localProducts = localProducts.filter(lp => !isObsoleteDemoProduct(lp));
      }

      if (serverProducts && serverProducts.length > 0) {
        // Server Google Sheets adalah acuan utama lintas perangkat
        const mergedMap = new Map();
        serverProducts.forEach(p => {
          if (!isObsoleteDemoProduct(p)) mergedMap.set(p.ID_Produk, p);
        });
        if (Array.isArray(localProducts)) {
          localProducts.forEach(lp => {
            if (!mergedMap.has(lp.ID_Produk) && !isObsoleteDemoProduct(lp)) {
              mergedMap.set(lp.ID_Produk, lp);
            }
          });
        }
        STATE.products = Array.from(mergedMap.values()).map(sanitizeProduct);
      } else if (Array.isArray(localProducts) && localProducts.length > 0) {
        STATE.products = localProducts.map(sanitizeProduct);
      } else {
        STATE.products = (fallback.products || []).map(sanitizeProduct);
      }

      // Pastikan kedua produk utama ("Kumpulan PRD" dan "Social Influence") selalu hadir di semua perangkat HP & Desktop
      fallback.products.forEach(defP => {
        const idx = STATE.products.findIndex(p => 
          p.ID_Produk === defP.ID_Produk || 
          (p.Nama_Produk && defP.Nama_Produk && p.Nama_Produk.toLowerCase().includes(defP.Nama_Produk.toLowerCase()))
        );
        if (idx === -1) {
          STATE.products.push(Object.assign({}, defP));
        } else {
          // Sinkronkan harga promo & banner yang paling baru
          if (defP.Nama_Produk.toLowerCase().includes('social influence') && STATE.products[idx].Harga_Promo === 99000) {
            STATE.products[idx].Harga_Promo = 25000;
          }
          if (defP.Nama_Produk.toLowerCase().includes('kumpulan prd')) {
            STATE.products[idx].Harga_Promo = 49000;
            STATE.products[idx].Banner_URL = 'kumpulan-prd-banner.jpg';
          }
        }
      });

      // Bersihkan total dari STATE.products produk usang agar tidak muncul di HP manapun
      STATE.products = STATE.products.filter(p => !isObsoleteDemoProduct(p)).map(sanitizeProduct);

      persistProductsSafely(STATE.products);
    } catch(e) {
      STATE.products = ((data.products && data.products.length > 0) ? data.products : fallback.products).map(sanitizeProduct);
    }

    // Asynchronous IndexedDB synchronization (mengambil versi produk lengkap jika ada foto baru)
    if (typeof StorageHub !== 'undefined' && StorageHub.idbGet) {
      StorageHub.idbGet('etalaseku_products_data').then(idbProds => {
        if (Array.isArray(idbProds) && idbProds.length > 0) {
          const cleanedIdb = idbProds.filter(p => {
            const n = String(p.Nama_Produk || '').toLowerCase();
            return !n.includes('gas pro web app masterclass') && !n.includes('notion os') && !n.includes('bootcamp');
          });
          if (cleanedIdb.length >= STATE.products.length) {
            STATE.products = cleanedIdb.map(sanitizeProduct);
            renderProducts();
            if (typeof renderAdminProductsTable === 'function') {
              renderAdminProductsTable(STATE.products);
            }
          }
        }
      }).catch(() => {});
    }
    STATE.testimonials = (data.testimonials && data.testimonials.length > 0) ? data.testimonials : fallback.testimonials;
    
    // PERSISTENSI HASIL KARYA MEMBER: Jangan buang data karya yang sudah diupload!
    try {
      const storedShowcases = localStorage.getItem('etalaseku_showcases_data');
      if (storedShowcases) {
        const parsed = JSON.parse(storedShowcases);
        if (Array.isArray(parsed) && parsed.length > 0) {
          STATE.showcases = parsed;
        } else {
          STATE.showcases = (data.showcases && data.showcases.length > 0) ? data.showcases : fallback.showcases;
          localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
        }
      } else {
        STATE.showcases = (data.showcases && data.showcases.length > 0) ? data.showcases : fallback.showcases;
        localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
      }
    } catch(e) {
      STATE.showcases = (data.showcases && data.showcases.length > 0) ? data.showcases : fallback.showcases;
    }
    const hasLocalSiteSettings = localStorage.getItem('etalaseku_site_settings') !== null;
    if (hasLocalSiteSettings) {
      STATE.settings = loadStoredSiteSettings();
    } else if (data.settings && Object.keys(data.settings).length > 0) {
      STATE.settings = {
        announcement_bar_text: typeof data.settings.announcement_bar_text === 'string' && data.settings.announcement_bar_text.trim()
          ? data.settings.announcement_bar_text.trim()
          : DEFAULT_SITE_SETTINGS.announcement_bar_text,
        wa_cs_number: data.settings.wa_cs_number
          ? normalizeWaCsNumber(data.settings.wa_cs_number)
          : DEFAULT_SITE_SETTINGS.wa_cs_number,
        link_komunitas_tg: normalizeCommunityLinkUrl(data.settings.link_komunitas_tg || ''),
        rekening_pembayaran: data.settings.rekening_pembayaran || ''
      };
    } else {
      STATE.settings = loadStoredSiteSettings();
    }
    if (data.paymentChannels && Object.keys(data.paymentChannels).length > 0) {
      STATE.paymentChannels = Object.assign({}, DEFAULT_PAYMENT_CHANNELS, data.paymentChannels);
    }

    renderAnnouncementBar();
    renderProducts();
    renderTestimonials();
    renderShowcases();

    // Inisialisasi Carousel setelah elemen di-render
    SlideshowManager.initProductSlideshows();
    TestimonialFlipManager.init();

  } catch (err) {
    console.warn('Gagal load live GAS, menggunakan fallback mock data:', err);
    const mock = getFallbackMockData();
    try {
      STATE.products = mock.products.map(sanitizeProduct);
      persistProductsSafely(STATE.products);
    } catch(e) {
      STATE.products = mock.products.map(sanitizeProduct);
    }
    STATE.testimonials = mock.testimonials;
    try {
      const storedShowcases = localStorage.getItem('etalaseku_showcases_data');
      if (storedShowcases) {
        const parsed = JSON.parse(storedShowcases);
        if (Array.isArray(parsed) && parsed.length > 0) STATE.showcases = parsed;
        else STATE.showcases = mock.showcases;
      } else {
        STATE.showcases = mock.showcases;
      }
    } catch(e) {
      STATE.showcases = mock.showcases;
    }
    STATE.settings = loadStoredSiteSettings();
    renderAnnouncementBar();
    renderProducts();
    renderTestimonials();
    renderShowcases();
    SlideshowManager.initProductSlideshows();
    TestimonialFlipManager.init();
  }
}

function renderAnnouncementBar() {
  if (!STATE.settings || Object.keys(STATE.settings).length === 0) {
    STATE.settings = loadStoredSiteSettings();
  }

  // 1. Update Teks Promo Announcement Bar di Halaman Utama
  const topBar = document.getElementById('top-announcement-bar') || document.querySelector('.announcement-bar');
  const barText = document.getElementById('announcement-text');
  const promoText = typeof STATE.settings.announcement_bar_text === 'string'
    ? STATE.settings.announcement_bar_text.trim()
    : DEFAULT_SITE_SETTINGS.announcement_bar_text;

  if (barText) {
    const rawTxt = promoText || DEFAULT_SITE_SETTINGS.announcement_bar_text;
    if (rawTxt && /DISKON\s*\d+%?/i.test(rawTxt)) {
      barText.innerHTML = rawTxt.replace(/(🔥?\s*DISKON\s*\d+%?)/gi, '<span class="neon-discount-glow">$1</span>');
    } else {
      barText.textContent = rawTxt;
    }
  }
  if (topBar) {
    topBar.style.display = 'flex';
  }

  // 2. Update Tombol Tautan Komunitas Telegram / WhatsApp Group di Halaman Utama
  //    Jika kosong -> disembunyikan (display:none). Jika diisi di CRM -> langsung muncul & bisa diklik!
  const rawCommunityUrl = STATE.settings.link_komunitas_tg || '';
  const communityUrl = normalizeCommunityLinkUrl(rawCommunityUrl);
  const hasCommunity = Boolean(communityUrl && communityUrl.length >= 5);

  const isTelegram = /t\.me|telegram/i.test(communityUrl);
  const isWhatsApp = /whatsapp\.com|wa\.me/i.test(communityUrl);
  const platformLabel = isTelegram ? 'Telegram' : (isWhatsApp ? 'WhatsApp' : 'Komunitas');
  const iconChar = isTelegram ? '✈️' : (isWhatsApp ? '💬' : '👥');

  // 2a. Pill di Announcement Bar
  const annBtn = document.getElementById('announcement-community-btn');
  const annIcon = document.getElementById('announcement-community-icon');
  const annLabel = document.getElementById('announcement-community-label');
  if (annBtn) {
    if (hasCommunity) {
      annBtn.href = communityUrl;
      annBtn.style.display = 'inline-flex';
      if (annIcon) annIcon.textContent = iconChar;
      if (annLabel) annLabel.textContent = 'Gabung Grup ' + platformLabel + ' ↗';
    } else {
      annBtn.style.display = 'none';
      annBtn.removeAttribute('href');
    }
  }

  // 2b. Tombol di Hero Section Halaman Utama
  const heroBtn = document.getElementById('hero-community-btn');
  const heroIcon = document.getElementById('hero-community-icon');
  const heroLabel = document.getElementById('hero-community-label');
  if (heroBtn) {
    if (hasCommunity) {
      heroBtn.href = communityUrl;
      heroBtn.style.display = 'inline-flex';
      if (heroIcon) heroIcon.textContent = iconChar;
      if (heroLabel) heroLabel.textContent = 'Masuk Grup ' + platformLabel + ' ↗';
    } else {
      heroBtn.style.display = 'none';
      heroBtn.removeAttribute('href');
    }
  }

  // 2c. Tombol di Pre-Footer Banner Halaman Utama
  const preBtn = document.getElementById('prefooter-community-btn');
  const preIcon = document.getElementById('prefooter-community-icon');
  const preLabel = document.getElementById('prefooter-community-label');
  if (preBtn) {
    if (hasCommunity) {
      preBtn.href = communityUrl;
      preBtn.style.display = 'inline-flex';
      if (preIcon) preIcon.textContent = iconChar;
      if (preLabel) preLabel.textContent = 'Masuk Grup ' + platformLabel + ' Resmi ↗';
    } else {
      preBtn.style.display = 'none';
      preBtn.removeAttribute('href');
    }
  }

  // 2d. Link di Footer Halaman Utama
  const footerItem = document.getElementById('footer-community-item');
  const footerLink = document.getElementById('footer-community-link');
  if (footerItem && footerLink) {
    if (hasCommunity) {
      footerLink.href = communityUrl;
      footerLink.textContent = iconChar + ' Gabung Grup ' + platformLabel + ' ↗';
      footerItem.style.display = 'list-item';
    } else {
      footerItem.style.display = 'none';
      footerLink.removeAttribute('href');
    }
  }

  // 3. Sinkronkan seluruh link statis CS WhatsApp (wa.me/...) di Halaman Utama & Portal Siswa
  const activeWaCs = getActiveWaCsNumber();
  if (typeof document !== 'undefined' && document.querySelectorAll) {
    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
      if (link.closest && link.closest('#admin-portal-section')) return;
      const curHref = link.getAttribute('href') || '';
      const updated = curHref.replace(/https:\/\/wa\.me\/[0-9]+/, 'https://wa.me/' + activeWaCs);
      if (updated !== curHref) {
        link.setAttribute('href', updated);
      }
    });
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  STATE.products.forEach(p => {
    // 1. Dapatkan banner utama yang aman dan terformat
    const mainBanner = formatImageUrl(p.Banner_URL);

    // 2. Galeri multi-gambar untuk slideshow otomatis
    let images = [];
    if (p.Galeri_URLs && typeof p.Galeri_URLs === 'string' && p.Galeri_URLs.trim()) {
      // Split Galeri_URLs hanya jika dipisahkan oleh tanda koma antar URL valid (bukan membelah base64)
      if (p.Galeri_URLs.includes('data:image/')) {
        images = p.Galeri_URLs.split(/\s*,\s*(?=https?:\/\/|data:image\/)/i).map(s => s.trim()).filter(Boolean);
      } else {
        images = p.Galeri_URLs.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Bila tidak ada galeri multi-gambar, pakai banner utama
    if (!images.length) {
      if (mainBanner) {
        images.push(mainBanner);
      } else {
        images.push('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');
      }
    }

    let slidesHtml = '';
    images.forEach((img, i) => {
      const formattedSrc = formatImageUrl(img);
      slidesHtml += `
        <div class="product-slide ${i === 0 ? 'active' : ''}">
          <img src="${formattedSrc}" alt="${escapeHtml(p.Nama_Produk)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';">
        </div>
      `;
    });

    const isSoldOut = Number(p.Maks_Kuota_Batch || 50) <= 0;
    const badgeText = isSoldOut ? 'Batch Penuh' : `Batch ${p.Batch_Aktif || 1}: Kuota Terbatas`;

    const normalPrice = Number(p.Harga_Normal || 0);
    const promoPrice = Number(p.Harga_Promo || 0);
    let discountPct = 0;
    if (normalPrice > promoPrice && normalPrice > 0) {
      discountPct = Math.round(((normalPrice - promoPrice) / normalPrice) * 100);
    }

    const card = document.createElement('div');
    card.className = 'glow-card product-card';
    card.innerHTML = `
      <div class="product-carousel">
        <span class="product-badge-batch" style="background: ${isSoldOut ? '#EF4444' : '#0F172A'}">${badgeText}</span>
        ${discountPct > 0 ? `
          <span class="product-thumb-discount-badge" title="Diskon Spesial Terbatas!">
            <span class="badge-fire-anim">🔥</span> DISKON ${discountPct}%
          </span>
        ` : ''}
        ${slidesHtml}
      </div>
      <h3 class="product-title">${escapeHtml(p.Nama_Produk)}</h3>
      <p class="product-desc">${escapeHtml(p.Deskripsi || '')}</p>
      <div class="product-pricing" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span class="price-normal">Rp ${normalPrice.toLocaleString('id-ID')}</span>
        <span class="price-promo price-promo-neon">Rp ${promoPrice.toLocaleString('id-ID')}</span>
        ${discountPct > 0 ? `<span class="discount-pill-glow">Hemat ${discountPct}%</span>` : ''}
      </div>
      <button class="shimmer-btn btn-card-buy" onclick="handleProductAction('${p.ID_Produk}')">
        ${isSoldOut ? 'Batch Penuh — Masuk Waitlist ⏳' : 'Daftar & Akses Instan →'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = (STATE.testimonials && STATE.testimonials.length > 0) ? STATE.testimonials : [];
  // Jika testimoni > 4, tampilkan 4 slot awal yang akan bergantian secara dinamis
  const displayList = list.length > 4 ? list.slice(0, 4) : list;

  displayList.forEach((t, index) => {
    const card = document.createElement('div');
    card.className = 'flip-card-wrapper';
    card.title = 'Klik untuk membaca cerita ulasan lengkap';
    card.onclick = () => TestimonialFlipManager.showDetailModal(t);

    card.innerHTML = `
      <div class="flip-card-inner">
        <!-- Front Side -->
        <div class="flip-card-front">
          <div>
            <div class="testi-header" style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #FFF1F4, #FFE4E6); color:#FF2E63; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; border:1px solid rgba(255,46,99,0.25); flex-shrink:0;">
                ${(t.Nama_Member || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 class="testi-author" style="font-weight:700; color:var(--deep-navy); margin:0 0 2px 0; font-size:15px;">${t.Nama_Member}</h3>
                <p style="font-size:12px; color:var(--text-muted); margin:0;">${t.Profesi || 'Member Siswa'}</p>
              </div>
            </div>
            <div class="testi-stars" style="color:#F59E0B; margin:10px 0 6px;">★★★★★</div>
            <p class="testi-quote" style="font-size:13px; color:#334155; line-height:1.5;">"${(t.Isi_Ulasan || '').slice(0, 110)}..."</p>
          </div>
          <div>
            <span class="testi-result-badge">🚀 ${t.Hasil_Pencapaian || 'Verified Result'}</span>
            <div class="testi-click-hint">🔍 Klik untuk baca cerita lengkap →</div>
          </div>
        </div>

        <!-- Back Side -->
        <div class="flip-card-back">
          <div>
            <div style="font-size:12px; text-transform:uppercase; color:#FF2E63; font-weight:700; margin-bottom:8px;">Pencapaian Siswa</div>
            <h4 style="font-size:18px; font-weight:800; margin-bottom:12px; color:#FFFFFF;">${t.Hasil_Pencapaian || 'Hasil Maksimal'}</h4>
            <p style="font-size:13px; opacity:0.95; line-height:1.5; color:#F8FAFC;">"${t.Isi_Ulasan}"</p>
          </div>
          <div>
            <button class="shimmer-btn" style="width:100%; padding:9px; font-size:12px; justify-content:center;" onclick="event.stopPropagation(); TestimonialFlipManager.showDetailModal(STATE.testimonials[${index}])">
              Lihat Cerita Lengkap ↗
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return 'https://www.youtube-nocookie.com/embed/' + match[2] + '?rel=0&modestbranding=1';
  }
  if (clean.includes('embed/')) return clean;
  return '';
}

function extractShowcaseImages(s) {
  let imgs = [];
  if (Array.isArray(s.Galeri_Karya) && s.Galeri_Karya.length > 0) {
    imgs = s.Galeri_Karya.map(formatImageUrl);
  } else if (s.Galeri_Karya && typeof s.Galeri_Karya === 'string' && s.Galeri_Karya.trim()) {
    imgs = s.Galeri_Karya.split(/\s*,\s*(?=https?:\/\/|data:image\/)/i).map(u => formatImageUrl(u.trim())).filter(Boolean);
  } else if (s.Gambar_Preview_URL && typeof s.Gambar_Preview_URL === 'string' && s.Gambar_Preview_URL.trim()) {
    if (s.Gambar_Preview_URL.includes(',')) {
      imgs = s.Gambar_Preview_URL.split(/\s*,\s*(?=https?:\/\/|data:image\/)/i).map(u => formatImageUrl(u.trim())).filter(Boolean);
    } else {
      imgs = [formatImageUrl(s.Gambar_Preview_URL.trim())];
    }
  }
  if (!imgs.length) {
    imgs = ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'];
  }
  // Maksimal 5 gambar sesuai permintaan pengguna
  return imgs.slice(0, 5);
}

function renderShowcases() {
  const container = document.getElementById('showcase-container');
  if (!container) return;
  container.innerHTML = '';

  const list = (STATE.showcases && STATE.showcases.length > 0) ? STATE.showcases : DEFAULT_SHOWCASES_LIST;

  list.slice(0, 6).forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'pameran-card';

    const ytEmbedUrl = getYouTubeEmbedUrl(s.Video_Youtube);
    const images = extractShowcaseImages(s);

    let mediaHtml = '';

    // A. Embed URL YouTube Video Trailer (Landscape 16:9 Facade - Fast Mobile & Desktop)
    if (ytEmbedUrl) {
      const posterImg = (images && images.length > 0) ? images[0] : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
      mediaHtml = `
        <div class="showcase-yt-wrapper" onclick="this.innerHTML='<iframe src=\\'${ytEmbedUrl}?autoplay=1\\' title=\\'${escapeHtml(s.Nama_Karya)}\\' frameborder=\\'0\\' allow=\\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\' allowfullscreen style=\\'width:100%; height:100%; aspect-ratio:16/9; border:none; display:block;\\'></iframe>'" style="aspect-ratio: 16 / 9 !important; width: 100%; position: relative; background: #0F172A; cursor: pointer; overflow: hidden; border-radius: 18px 18px 0 0;" title="Klik untuk memutar video trailer">
          <img src="${posterImg}" alt="${escapeHtml(s.Nama_Karya)}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover; opacity:0.88; transition:transform 0.3s ease;">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15,23,42,0.35);">
            <div style="width: 54px; height: 38px; background: #FF0000; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255,0,0,0.6); transition: transform 0.2s ease;">
              <svg viewBox="0 0 24 24" fill="#FFFFFF" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #FFFFFF; padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); pointer-events: none; z-index: 2;">
            ${escapeHtml(s.Statistik_Pencapaian || 'Hasil Karya')}
          </span>
          <span style="position: absolute; top: 10px; right: 10px; background: #EF4444; color: #FFFFFF; padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); pointer-events: none; z-index: 2;">
            ▶ Putar Video 16:9
          </span>
        </div>
      `;
    } 
    // B. Multi-Gambar Slideshow Otomatis (Maksimal 5 Gambar, Landscape 16:9)
    else if (images.length > 1) {
      mediaHtml = `
        <div class="pameran-card-thumb-wrap showcase-carousel-box" id="showcase-card-carousel-${idx}" style="aspect-ratio: 16 / 9 !important; width: 100%; position: relative; background: #0F172A; overflow: hidden;">
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #FFFFFF; padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); z-index: 5;">
            ${escapeHtml(s.Statistik_Pencapaian || 'Hasil Karya')}
          </span>
          <span style="position: absolute; top: 10px; right: 10px; background: rgba(37, 99, 235, 0.9); color: #FFFFFF; padding: 3px 8px; border-radius: 99px; font-size: 10px; font-weight: 800; z-index: 5;">
            🖼 ${images.length} Foto Slideshow
          </span>
          ${images.map((img, i) => `
            <div class="showcase-slide ${i === 0 ? 'active' : ''}" style="position: absolute; inset: 0; width: 100%; height: 100%; aspect-ratio: 16 / 9; opacity: ${i === 0 ? '1' : '0'}; transition: opacity 0.6s ease-in-out;">
              <img src="${img}" alt="${escapeHtml(s.Nama_Karya)}" style="width: 100%; height: 100%; aspect-ratio: 16 / 9; object-fit: cover;" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';">
            </div>
          `).join('')}
          <div class="showcase-dots" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 6; background: rgba(15, 23, 42, 0.5); padding: 4px 8px; border-radius: 99px;">
            ${images.map((_, i) => `
              <span class="showcase-dot ${i === 0 ? 'active' : ''}" style="width: ${i === 0 ? '16px' : '6px'}; height: 6px; border-radius: 99px; background: ${i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}; transition: all 0.25s ease;"></span>
            `).join('')}
          </div>
        </div>
      `;
    } 
    // C. Single Image (Landscape 16:9)
    else {
      mediaHtml = `
        <div class="pameran-card-thumb-wrap" style="aspect-ratio: 16 / 9 !important; width: 100%; position: relative; background: #0F172A; overflow: hidden;">
          <img src="${images[0]}" class="pameran-card-thumb" alt="${escapeHtml(s.Nama_Karya)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';" style="width: 100%; height: 100%; aspect-ratio: 16 / 9; object-fit: cover;">
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #FFFFFF; padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2);">
            ${escapeHtml(s.Statistik_Pencapaian || 'Hasil Karya')}
          </span>
        </div>
      `;
    }

    const demoBtn = s.Link_Demo ? `
      <a href="${s.Link_Demo}" target="_blank" rel="noopener noreferrer" class="btn-pameran-demo" title="Buka Live Demo">
        🌐 Demo Live ↗
      </a>` : '';

    const ytBtn = (s.Video_Youtube && !ytEmbedUrl) ? `
      <button type="button" class="btn-pameran-yt" onclick="openYouTubeShowcaseModal('${s.Video_Youtube}', '${escapeHtml(s.Nama_Karya)}', '${escapeHtml(s.Nama_Member)}')" title="Tonton Video Demo YouTube">
        ▶ Video YouTube
      </button>` : '';

    card.innerHTML = `
      ${mediaHtml}
      <div class="pameran-card-content">
        <div class="pameran-card-author-row">
          <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #FF2E63, #E11D48); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; flex-shrink:0;">
            ${(s.Nama_Member || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-size:12.5px; font-weight:800; color:var(--deep-navy);">${s.Nama_Member}</div>
            <div style="font-size:10.5px; color:#64748B;">${s.Profesi || 'Alumni Member'}</div>
          </div>
        </div>
        <h3 style="font-size:16px; font-weight:800; margin:0 0 6px; color:var(--deep-navy); line-height:1.3;">${s.Nama_Karya}</h3>
        <p style="font-size:12px; color:#64748B; margin:0 0 14px; line-height:1.5;">${s.Testimoni_Kesan || 'Sistem bisnis dan web app yang dibangun menggunakan Google Workspace & teknologi modern.'}</p>
        <div class="pameran-card-actions">
          ${demoBtn}
          ${ytBtn}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Jalankan slideshow otomatis untuk kartu yang memiliki banyak gambar
  initShowcaseCardSlideshows();
}

function initShowcaseCardSlideshows() {
  const boxes = document.querySelectorAll('.showcase-carousel-box');
  boxes.forEach(box => {
    const slides = box.querySelectorAll('.showcase-slide');
    const dots = box.querySelectorAll('.showcase-dot');
    if (slides.length <= 1) return;

    let cur = 0;
    setInterval(() => {
      slides[cur].classList.remove('active');
      slides[cur].style.opacity = '0';
      if (dots[cur]) {
        dots[cur].classList.remove('active');
        dots[cur].style.width = '6px';
        dots[cur].style.background = 'rgba(255,255,255,0.5)';
      }

      cur = (cur + 1) % slides.length;

      slides[cur].classList.add('active');
      slides[cur].style.opacity = '1';
      if (dots[cur]) {
        dots[cur].classList.add('active');
        dots[cur].style.width = '16px';
        dots[cur].style.background = '#FFFFFF';
      }
    }, 3500);
  });
}

// ============================================================================
// 5. CHECKOUT & WAITLIST HANDLERS (GAS-PRO-API TEXT/PLAIN POST)
// ============================================================================
function handleProductAction(productId) {
  const product = STATE.products.find(p => p.ID_Produk === productId);
  if (!product) return;

  const isSoldOut = Number(product.Maks_Kuota_Batch || 50) <= 0;
  if (isSoldOut) {
    openWaitlistModal(product);
  } else {
    openCheckoutModal(product);
  }
}

function openCheckoutModal(product) {
  STATE.activeProductCheckout = product;
  STATE.selectedPaymentPlan = 'lunas';
  STATE.selectedPaymentChannelKey = 'qris';

  // Selalu muat channel pembayaran terbaru dari LocalStorage atau default
  try {
    const cachedCh = localStorage.getItem('etalaseku_payment_channels');
    if (cachedCh) {
      STATE.paymentChannels = Object.assign({}, DEFAULT_PAYMENT_CHANNELS, JSON.parse(cachedCh));
    }
  } catch(e) {}

  // Background fetch payment channels terbaru dari Google Sheets tanpa blocking
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    fetch(`${APP_CONFIG.GAS_URL}?action=getPaymentChannels&_t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (res && res.success && res.data) {
          STATE.paymentChannels = Object.assign({}, DEFAULT_PAYMENT_CHANNELS, res.data);
          localStorage.setItem('etalaseku_payment_channels', JSON.stringify(STATE.paymentChannels));
          renderCheckoutPaymentChannels();
          selectPaymentChannel(STATE.selectedPaymentChannelKey || 'qris');
        }
      })
      .catch(err => console.warn('Sync payment channels:', err));
  }

  document.getElementById('checkout-product-title').textContent = product.Nama_Produk;
  updateCheckoutPriceDisplay();
  renderCheckoutPaymentChannels();
  selectPaymentChannel('qris');

  const btnLunas = document.getElementById('btn-plan-lunas');
  const btnCicilan = document.getElementById('btn-plan-cicilan');
  if (btnLunas) btnLunas.classList.add('active');
  if (btnCicilan) btnCicilan.classList.remove('active');

  document.getElementById('modal-checkout').classList.add('active');
}

function updateCheckoutPriceDisplay() {
  if (!STATE.activeProductCheckout) return;
  const fullPrice = Number(STATE.activeProductCheckout.Harga_Promo || 0);
  const priceEl = document.getElementById('checkout-product-price');
  const badgeEl = document.getElementById('checkout-installment-badge');
  const noteEl = document.getElementById('checkout-plan-note');

  if (STATE.selectedPaymentPlan === 'cicilan') {
    const cicilan1 = Math.round(fullPrice / 2);
    if (priceEl) priceEl.textContent = 'Rp ' + cicilan1.toLocaleString('id-ID');
    if (badgeEl) {
      badgeEl.textContent = 'Cicilan 1 dari 2';
      badgeEl.style.background = '#FEF9C3';
      badgeEl.style.color = '#854D0E';
    }
    if (noteEl) noteEl.innerHTML = `<strong>Cicilan 1:</strong> Rp ${cicilan1.toLocaleString('id-ID')} dibayar sekarang. <strong>Cicilan 2:</strong> Rp ${cicilan1.toLocaleString('id-ID')} jatuh tempo 30 hari ke depan via menu <em>Cek Tagihan</em>.`;
  } else {
    if (priceEl) priceEl.textContent = 'Rp ' + fullPrice.toLocaleString('id-ID');
    if (badgeEl) {
      badgeEl.textContent = 'Akses Seumur Hidup';
      badgeEl.style.background = '#DCFCE7';
      badgeEl.style.color = '#166534';
    }
    if (noteEl) noteEl.textContent = 'Bayar 100% lunas untuk langsung mendapatkan akses kuitansi resmi & materi seketika.';
  }
}

function setCheckoutPaymentPlan(plan) {
  STATE.selectedPaymentPlan = plan;
  const btnLunas = document.getElementById('btn-plan-lunas');
  const btnCicilan = document.getElementById('btn-plan-cicilan');
  if (plan === 'cicilan') {
    if (btnLunas) btnLunas.classList.remove('active');
    if (btnCicilan) btnCicilan.classList.add('active');
  } else {
    if (btnLunas) btnLunas.classList.add('active');
    if (btnCicilan) btnCicilan.classList.remove('active');
  }
  updateCheckoutPriceDisplay();
}

function renderCheckoutPaymentChannels() {
  const container = document.getElementById('checkout-payment-channels-grid');
  if (!container) return;

  const channels = STATE.paymentChannels || DEFAULT_PAYMENT_CHANNELS;
  const keys = ['qris', 'bca', 'mandiri', 'bni', 'gopay', 'ovo'];

  container.innerHTML = keys.map(k => {
    const c = channels[k] || DEFAULT_PAYMENT_CHANNELS[k];
    if (!c || c.aktif === false) return '';
    const isActive = STATE.selectedPaymentChannelKey === k;
    return `
      <div class="channel-pill-btn ${isActive ? 'active' : ''}" onclick="selectPaymentChannel('${k}')">
        <span class="channel-name">${c.nama || k.toUpperCase()}</span>
        <span class="channel-sub">${c.badge || 'Instant'}</span>
      </div>
    `;
  }).join('');
}

function selectPaymentChannel(channelKey) {
  STATE.selectedPaymentChannelKey = channelKey;
  renderCheckoutPaymentChannels();

  const container = document.getElementById('checkout-payment-details-view');
  if (!container) return;

  const channels = STATE.paymentChannels || DEFAULT_PAYMENT_CHANNELS;
  const c = channels[channelKey] || DEFAULT_PAYMENT_CHANNELS[channelKey];
  if (!c) return;

  if (c.tipe === 'qris') {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:var(--deep-navy); font-size:14px;">${c.label || 'QRIS Instant'}</strong>
          <div style="font-size:11px; color:var(--text-muted);">${c.atasNama || 'EtalaseKu Hub'}</div>
        </div>
        <span class="pill-badge green">Semua Bank / e-Wallet</span>
      </div>
      <div class="qris-display-card">
        <img src="${c.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014ID.LINKAJA.WWW011893600911002234567802150878946026275204581253033605802ID5912ETALASEKUHUB6007JAKARTA61051234062070703A0163041D3F'}" alt="QRIS Barcode" class="qris-img-preview">
        <div style="font-size:11px; color:#64748B; margin-top:8px; font-weight:600;">Scan QRIS di atas via BCA, Mandiri Livin, BNI Mobile, GoPay, OVO, atau ShopeePay</div>
      </div>
      <p style="font-size:11px; color:var(--text-muted); margin:0;">${c.instruksi || 'Buka m-Banking atau e-Wallet favorit Anda, pilih Scan QRIS, lalu unggah bukti transfer.'}</p>
    `;
  } else {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:var(--deep-navy); font-size:14px;">${c.label || c.nama}</strong>
          <div style="font-size:11px; color:var(--text-muted);">a/n ${c.atasNama || 'EtalaseKu Hub'}</div>
        </div>
        <span class="pill-badge blue">${c.tipe === 'ewallet' ? 'e-Wallet' : 'Transfer Bank'}</span>
      </div>
      <div class="payment-rekening-row">
        <div>
          <div style="font-size:10px; color:#64748B; text-transform:uppercase; font-weight:700;">Nomor Rekening / No HP:</div>
          <div class="payment-rekening-number">${c.rekening}</div>
        </div>
        <button type="button" class="btn-copy-account" onclick="copyPaymentRekening('${c.rekening}', this)">
          📋 Salin
        </button>
      </div>
      <p style="font-size:11px; color:var(--text-muted); margin:4px 0 0;">${c.instruksi || 'Transfer ke nomor rekening di atas, lalu unggah screenshot bukti transfer.'}</p>
    `;
  }
}

function copyPaymentRekening(text, btnEl) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const temp = document.createElement('input');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }
  const original = btnEl.innerHTML;
  btnEl.innerHTML = '✓ Tersalin!';
  btnEl.style.background = '#10B981';
  setTimeout(() => {
    btnEl.innerHTML = original;
    btnEl.style.background = '';
  }, 2000);
}

function openWaitlistModal(product) {
  document.getElementById('waitlist-product-name').value = product.Nama_Produk;
  document.getElementById('modal-waitlist').classList.add('active');
}

async function submitOrderForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-order');
  const originalText = btn ? btn.innerHTML : 'Kirim Pesan & Dapatkan Akses Instan →';

  // 1. Ekstraksi Input Form
  const nameInput = document.getElementById('order-name');
  const phoneInput = document.getElementById('order-whatsapp');
  const emailInput = document.getElementById('order-email');
  const fileInput = document.getElementById('order-proof-file');

  const nama = (nameInput ? nameInput.value : '').trim();
  const whatsapp = (phoneInput ? phoneInput.value : '').trim();
  const email = (emailInput ? emailInput.value : '').trim();

  // 2. Strict Validation (Penolakan Ketat Otomatis bila data salah/belum lengkap)
  if (!nama || nama.length < 3) {
    showToast('⚠️ Nama lengkap wajib diisi dengan benar (minimal 3 karakter)!', 'error', 3500);
    if (nameInput) nameInput.focus();
    return;
  }

  const phoneDigits = whatsapp.replace(/\D/g, '');
  if (!phoneDigits || phoneDigits.length < 10) {
    showToast('⚠️ Nomor WhatsApp tidak valid! Masukkan nomor aktif Anda (minimal 10 digit, contoh: 081234567890).', 'error', 3500);
    if (phoneInput) phoneInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast('⚠️ Format alamat email tidak valid! Masukkan email aktif Anda untuk penerimaan akses materi.', 'error', 3500);
    if (emailInput) emailInput.focus();
    return;
  }

  // Wajib melampirkan screenshot bukti transfer yang sah
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showToast('⚠️ Mohon lampirkan screenshot bukti transfer sah (Bank, QRIS, GoPay, atau OVO) agar pesanan dapat diverifikasi!', 'error', 4000);
    return;
  }

  if (btn) {
    btn.innerHTML = 'Mengirim Bukti & Memproses... ⏳';
    btn.disabled = true;
  }

  try {
    const file = fileInput.files[0];
    const fileName = file.name;
    let fileBase64 = '';
    try {
      fileBase64 = await compressAndReadImage(file, 900, 0.78);
    } catch (e) {
      fileBase64 = await readFileAsBase64(file);
    }

    const activeChan = (STATE.paymentChannels && STATE.paymentChannels[STATE.selectedPaymentChannelKey]) || DEFAULT_PAYMENT_CHANNELS[STATE.selectedPaymentChannelKey] || DEFAULT_PAYMENT_CHANNELS.qris;
    const isCicilan = STATE.selectedPaymentPlan === 'cicilan';
    const fullPrice = Number((STATE.activeProductCheckout && STATE.activeProductCheckout.Harga_Promo) || 149000);
    const amountToPay = isCicilan ? Math.round(fullPrice / 2) : fullPrice;

    // Generate Order ID Resmi
    const now = new Date();
    const dateStr = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `ORD-${dateStr}-${timeStr}-${randSuffix}`;

    const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;

    const payload = {
      orderId: generatedOrderId,
      ID_Order: generatedOrderId,
      productId: (STATE.activeProductCheckout && STATE.activeProductCheckout.ID_Produk) || 'PRD-001',
      productName: (STATE.activeProductCheckout && STATE.activeProductCheckout.Nama_Produk) || 'Produk Digital EtalaseKu',
      nama: nama,
      Nama_Pembeli: nama,
      whatsapp: whatsapp,
      No_WhatsApp: whatsapp,
      email: email,
      Email: email,
      total: amountToPay,
      Total_Bayar: amountToPay,
      paymentMethod: `${activeChan.label} (${activeChan.rekening})`,
      paymentPlan: isCicilan ? 'Cicilan Bertahap (Angsuran 1 dari 2)' : 'Lunas',
      fileBase64: cleanBase64,
      fileName: fileName,
      Bukti_Transfer_URL: fileBase64,
      status: 'Menunggu Verifikasi', // MENUNGGU VERIFIKASI SUPER ADMIN & ADMIN (TIDAK LANGSUNG LUNAS)
      Status_Bayar: 'Menunggu Verifikasi',
      tanggal: now.toISOString().split('T')[0],
      Tanggal_Waktu: now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    // Simpan ke STATE.orders & localStorage dengan getMergedOrdersList()
    const allOrders = getMergedOrdersList();
    allOrders.unshift(payload);
    STATE.orders = allOrders;
    localStorage.setItem('etalaseku_orders_data', JSON.stringify(allOrders));

    // Sinkronisasi ke backend GAS secara non-blocking
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'submitOrder', data: payload })
      }).catch(err => console.warn('Sync order ke GAS background:', err));
    }

    closeAllModals();
    showSuccessModal(generatedOrderId, nama, whatsapp, email, payload.productName, payload.total);
    showToast('⏳ Bukti transfer terkirim! Menunggu verifikasi oleh Super Admin & Admin.', 'info', 4500);

  } catch (err) {
    showToast('Terjadi kendala saat memproses: ' + err.message, 'error', 3500);
  } finally {
    if (btn) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }
}

async function submitWaitlistForm(e) {
  e.preventDefault();
  const nama = document.getElementById('waitlist-name').value;
  const whatsapp = document.getElementById('waitlist-whatsapp').value;
  const prodName = document.getElementById('waitlist-product-name').value;

  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'joinWaitlist', data: { nama, whatsapp, productName: prodName } })
    });
  }

  closeAllModals();
  showToast(`Terima kasih kak ${nama}! Nomor antrean prioritas Anda telah tercatat. Kami akan mengirimkan notifikasi via WhatsApp segera setelah kursi batch baru dibuka.`, 'info');
}

function showSuccessModal(orderId, nama, whatsapp, email, productName, amountToPay) {
  const ordIdEl = document.getElementById('success-order-id');
  if (ordIdEl) ordIdEl.textContent = orderId || '-';

  const nameEl = document.getElementById('success-buyer-name');
  if (nameEl) nameEl.textContent = nama || 'Siswa Member';
  const phoneEl = document.getElementById('success-buyer-phone');
  if (phoneEl) phoneEl.textContent = whatsapp || '-';
  const emailEl = document.getElementById('success-buyer-email');
  if (emailEl) emailEl.textContent = email || '-';

  const prodEl = document.getElementById('success-product-name');
  if (prodEl) prodEl.textContent = productName || 'Kelas Digital';

  const totalEl = document.getElementById('success-total-price');
  if (totalEl) totalEl.textContent = 'Rp ' + Number(amountToPay || 99000).toLocaleString('id-ID');

  const modal = document.getElementById('modal-success');
  if (modal) modal.classList.add('active');

  const waBtn = document.getElementById('btn-success-wa');
  if (waBtn) {
    const waText = encodeURIComponent(
      `Halo Super Admin & Admin EtalaseKu,\n` +
      `Saya telah melakukan checkout kelas dengan data berikut:\n` +
      `• *Nama*: ${nama}\n` +
      `• *No. WhatsApp*: ${whatsapp}\n` +
      `• *Email*: ${email}\n` +
      `• *Produk*: ${productName || 'Kelas Digital'}\n` +
      `• *Total Bayar*: Rp ${Number(amountToPay || 0).toLocaleString('id-ID')}\n\n` +
      `Bukti transfer sudah saya upload di website. Mohon bantuannya untuk memverifikasi pesanan saya. Terima kasih!`
    );
    waBtn.href = `https://wa.me/${getActiveWaCsNumber()}?text=${waText}`;
  }
}

function openClassroomFromSuccessModal() {
  closeAllModals();
  openClassroomDashboard();
  showToast('🎓 Selamat datang di Ruang BelajarKu!', 'success', 3000);
}
window.openClassroomFromSuccessModal = openClassroomFromSuccessModal;

// ============================================================================
// 6. MODUL TAGIHAN & PEMBAYARAN SISWA (gas-tagihan-pembayaran)
// ============================================================================
async function checkStudentBills(e) {
  e.preventDefault();
  const phone = document.getElementById('bill-check-phone').value;
  const listContainer = document.getElementById('student-bills-list');
  listContainer.innerHTML = '<p style="text-align:center; padding:20px;">Memeriksa database tagihan... ⏳</p>';

  try {
    let bills = [];
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      const res = await fetch(`${APP_CONFIG.GAS_URL}?action=getStudentBills&phone=${encodeURIComponent(phone)}`);
      const json = await res.json();
      if (json.success) bills = json.data;
    } else {
      // Mock Bills
      bills = [
        {
          TagihanID: 'TGH-202610-001',
          NamaTagihan: 'SPP Mentoring Fullstack Web Apps (Bulan Oktober)',
          Periode: '2026-10',
          Jumlah: 150000,
          Status: 'Belum Bayar',
          JatuhTempo: '31 Oktober 2026'
        }
      ];
    }

    if (!bills.length) {
      listContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#10B981; font-weight:700;">✅ Tidak ada tagihan tertunggak untuk nomor ini.</p>';
      return;
    }

    listContainer.innerHTML = '';
    bills.forEach(b => {
      const item = document.createElement('div');
      item.style.border = '1px solid #E2E8F0';
      item.style.borderRadius = '14px';
      item.style.padding = '16px';
      item.style.marginBottom = '12px';
      item.style.background = '#F8FAFC';

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; color:var(--deep-navy);">${b.NamaTagihan}</span>
          <span style="background:#FEF9C3; color:#854D0E; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700;">${b.Status}</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">Jatuh Tempo: ${b.JatuhTempo}</p>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:18px; font-weight:800; color:var(--deep-navy);">Rp ${Number(b.Jumlah).toLocaleString('id-ID')}</span>
          <button class="shimmer-btn" style="padding:6px 14px; font-size:12px;" onclick="openPayBillModal('${b.TagihanID}', ${b.Jumlah})">Bayar Sekarang →</button>
        </div>
      `;
      listContainer.appendChild(item);
    });
  } catch (err) {
    listContainer.innerHTML = '<p style="color:#EF4444; text-align:center;">Gagal memuat tagihan: ' + err.message + '</p>';
  }
}

function openPayBillModal(tagihanId, nominal) {
  document.getElementById('pay-bill-id').value = tagihanId;
  document.getElementById('pay-bill-nominal').value = 'Rp ' + Number(nominal).toLocaleString('id-ID');
  document.getElementById('modal-pay-bill').classList.add('active');
}

async function submitStudentBillProof(e) {
  e.preventDefault();
  const fileInput = document.getElementById('pay-bill-proof');
  if (!fileInput.files.length) {
    showToast('Mohon lampirkan foto/screenshot bukti transfer.', 'info');
    return;
  }

  const base64 = await readFileAsBase64(fileInput.files[0]);
  const tagihanId = document.getElementById('pay-bill-id').value;

  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'submitStudentProof',
        data: { tagihanId, fileBase64: base64 }
      })
    });
  }

  closeAllModals();
  showToast('Bukti pembayaran tagihan berhasil diunggah! Status akan otomatis diperbarui setelah bendahara melakukan verifikasi.', 'info');
}

// ============================================================================
// 7. FLOATING WHATSAPP CHAT WIDGET
// ============================================================================
function toggleWhatsAppPopover() {
  const popover = document.getElementById('wa-popover');
  if (popover) popover.classList.toggle('active');
}

function sendDirectWaMessage() {
  const input = document.getElementById('wa-custom-msg');
  const text = input ? input.value : 'Halo Admin, saya ingin konsultasi mengenai program EtalaseKu.';
  window.open(`https://wa.me/${getActiveWaCsNumber()}?text=${encodeURIComponent(text)}`, '_blank');
}

// ============================================================================
// 8. FULL-FIDELITY ADMIN & CRM DASHBOARD (SCREEN 08, 09, 10, 11)
// ============================================================================
let ADMIN_STATE = {
  data: null
};

function openMemberLoginModal() {
  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');
  // Hanya buka member dashboard jika ADA order id atau email aktif
  if (savedOrderId || savedEmail) {
    showMemberAreaDashboard(savedOrderId, savedEmail);
  } else {
    closeAllModals();
    const modal = document.getElementById('modal-member-login') || document.getElementById('modal-unified-auth');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
    if (typeof renderRecentDeviceChips === 'function') renderRecentDeviceChips();
  }
}
window.openMemberLoginModal = openMemberLoginModal;

function openAdminModal() {
  if (STATE.adminToken) {
    openAdminPortal();
  } else {
    const emailField = document.getElementById('admin-login-email-input');
    const pinField = document.getElementById('admin-pin-input');
    if (emailField) {
      emailField.value = '';
      emailField.placeholder = 'Masukin Alamat Email SUPER ADMIN & ADMIN TERDAFTAR!';
    }
    if (pinField) {
      pinField.value = '';
      pinField.placeholder = 'Masukin PIN / Sandi';
    }
    document.getElementById('modal-admin-login').classList.add('active');
  }
}

async function handleAdminLogin(e) {
  if (e) e.preventDefault();
  try {
    const authPinInput = document.getElementById('auth-admin-pin-input');
  const adminPinField = document.getElementById('admin-pin-input');
  const authEmailInput = document.getElementById('auth-admin-email-input');
  const adminLoginEmailField = document.getElementById('admin-login-email-input');

  const pin = (adminPinField && adminPinField.value ? adminPinField.value : (authPinInput ? authPinInput.value : '')).trim();
  const email = (adminLoginEmailField && adminLoginEmailField.value ? adminLoginEmailField.value.trim().toLowerCase() : (authEmailInput && authEmailInput.value ? authEmailInput.value.trim().toLowerCase() : (STATE.adminEmail || 'admin@etalaseku.com'))).toLowerCase();

  if (!email || !pin) {
    showToast('⚠️ Mohon masukkan alamat email admin dan PIN / Sandi!', 'error', 3000);
    return;
  }

  // 1. Periksa kecocokan dengan daftar STATE.adminAccounts
  let matchedAccount = null;
  if (Array.isArray(STATE.adminAccounts)) {
    matchedAccount = STATE.adminAccounts.find(acc => acc.email.toLowerCase() === email && String(acc.pin) === String(pin));
  }

  // Fallback: Default Super Admin / Admin bawaan
  if (!matchedAccount) {
    if (pin === '123456' && (email === 'admin@etalaseku.com' || email === 'daffafazdian50@gmail.com')) {
      matchedAccount = {
        email: email,
        role: email.includes('daffa') ? 'SUPER_ADMIN' : 'ADMIN',
        pin: '123456'
      };
    }
  }

  if (matchedAccount) {
    STATE.adminToken = 'AUTH_TOKEN_' + Date.now();
    STATE.adminEmail = matchedAccount.email;
    STATE.adminRole = matchedAccount.role || 'SUPER_ADMIN';
    localStorage.setItem('etalaseku_admin_token', STATE.adminToken);
    localStorage.setItem('etalaseku_admin_email', matchedAccount.email);
    localStorage.setItem('etalaseku_admin_role', matchedAccount.role);

    closeAllModals();
    openAdminPortal();
    showToast(`👑 Selamat datang, ${matchedAccount.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Staff'} (${matchedAccount.email})!`, 'success', 3500);
    return;
  }

  // Jika kredensial salah
  showToast('❌ Email Admin atau PIN / Sandi salah! Periksa kredensial Anda di Pengaturan CRM.', 'error', 3500);
} catch (err) {
    showToast('Kendala autentikasi: ' + err.message, 'error');
  }
}

function openAdminPortal() {
  closeAllModals();
  const portal = document.getElementById('admin-portal-wrapper');
  if (portal) portal.classList.add('active');
  localStorage.setItem('etalaseku_is_in_crm', 'true');
  if (!localStorage.getItem('etalaseku_admin_active_tab')) {
    localStorage.setItem('etalaseku_admin_active_tab', 'tab-dashboard');
  }

  // 1. Reload showcases & orders seketika dari localStorage
  try {
    const stored = localStorage.getItem('etalaseku_showcases_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) STATE.showcases = parsed;
    }
  } catch(e) {}

  STATE.orders = getMergedOrdersList();
  STATE.modules = loadStoredClassroomModules();

  // 2. Render cepat seketika agar tidak ada tab yang kosong
  renderFullOrdersTable(STATE.orders);
  renderAdminPaymentChannels();
  populateAdminSiteSettingsForm();
  renderAdminAccountTab();
  renderStudentBillingTab(STATE.bills || []);
  renderClassroomModulesAdmin();
  renderAdminShowcaseTable(STATE.showcases);

  loadAdminPortalData();
}

function closeAdminPortal() {
  const portal = document.getElementById('admin-portal-wrapper');
  if (portal) portal.classList.remove('active');
}

function switchAdminTab(tabId, navEl) {
  localStorage.setItem('etalaseku_admin_active_tab', tabId);
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  if (navEl) {
    navEl.classList.add('active');
  } else {
    const matchingNav = document.querySelector(`.admin-nav-item[onclick*="${tabId}"]`);
    if (matchingNav) matchingNav.classList.add('active');
  }

  document.querySelectorAll('.admin-tab-content').forEach(pane => pane.classList.remove('active'));
  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');

  const titles = {
    'tab-dashboard': 'Dashboard & Analitik Penjualan',
    'tab-orders': 'Pesanan & Verifikasi Bukti Pembayaran',
    'tab-products': 'Manajemen Katalog Produk Digital',
    'tab-showcase': 'Hasil Karya & Portofolio Siswa (Social Proof)',
    'tab-crm': 'CRM Leads & Antrean Waitlist',
    'tab-testimonials': 'Manajemen Testimoni & Review Alumni',
    'tab-billing': 'Manajemen Tagihan & Cicilan Siswa (Installment Plan)',
    'tab-classroom': 'Editor & Manajemen Portal Ruang BelajarKu',
    'tab-settings': 'Metode Pembayaran Otomatis Server & Pengaturan Situs',
    'tab-account': 'Pengaturan Akun & Hak Akses Portal (Super Admin / Admin)'
  };
  const titleEl = document.getElementById('admin-page-title');
  if (titleEl && titles[tabId]) titleEl.textContent = titles[tabId];

  // Eksekusi render otomatis sesuai tab yang dibuka
  if (tabId === 'tab-settings') {
    renderAdminPaymentChannels();
    populateAdminSiteSettingsForm();
  } else if (tabId === 'tab-account') {
    renderAdminAccountTab();
  } else if (tabId === 'tab-billing') {
    renderStudentBillingTab(STATE.bills || []);
  } else if (tabId === 'tab-classroom') {
    STATE.modules = loadStoredClassroomModules();
    renderClassroomModulesAdmin();
  } else if (tabId === 'tab-showcase') {
    renderAdminShowcaseTable(STATE.showcases || []);
  } else if (tabId === 'tab-testimonials') {
    renderAdminTestimonialsTable(STATE.testimonials || []);
  } else if (tabId === 'tab-orders') {
    STATE.orders = getMergedOrdersList(); renderFullOrdersTable(STATE.orders);
  } else if (tabId === 'tab-crm') {
    renderAdminLeadsTable(STATE.leads || []);
  } else if (tabId === 'tab-products') {
    renderAdminProductsTable(STATE.products || []);
  } else if (tabId === 'tab-dashboard') {
    if (typeof renderAdminDashboardStats === 'function') renderAdminDashboardStats(STATE.stats);
  }
}

async function loadAdminPortalData() {
  try {
    // Reload showcases & products dari localStorage agar data admin selalu up-to-date
    try {
      const stored = localStorage.getItem('etalaseku_showcases_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) STATE.showcases = parsed;
      }
      const storedP = localStorage.getItem('etalaseku_products_data');
      if (storedP) {
        const parsedP = JSON.parse(storedP);
        if (Array.isArray(parsedP) && parsedP.length > 0) STATE.products = parsedP;
      }
    } catch(e) {}

    let data = null;

    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      const res = await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getAdminDashboard', token: STATE.adminToken })
      });
      const json = await res.json();
      if (json.success) data = json.data;
    }

    if (!data) {
      data = {
        metrics: {
          totalRevenue: 24850000,
          paidOrders: 184,
          pendingOrders: 3,
          totalLeads: 48,
          totalProducts: STATE.products.length,
          totalShowcases: STATE.showcases.length,
          totalBills: 3
        },
        adminProfile: {
          email: STATE.adminEmail || 'admin@etalaseku.com',
          role: STATE.adminRole || 'SUPER_ADMIN'
        },
        paymentChannels: STATE.paymentChannels || DEFAULT_PAYMENT_CHANNELS,
        bills: [
          { ID_Tagihan: 'TGH-202610-01', Nama_Siswa: 'Budi Santoso', No_WhatsApp: '08123456789', Nama_Produk: 'GAS Pro Web App Masterclass (Cicilan 2 dari 2)', Subtotal: 49500, Status: 'Belum Bayar', Jatuh_Tempo: '2026-11-15', Keterangan: 'Pelunasan Modul Tahap 2' },
          { ID_Tagihan: 'TGH-202610-02', Nama_Siswa: 'Anita Wijaya', No_WhatsApp: '08198765432', Nama_Produk: 'Fullstack Automation Bootcamp (Cicilan 1 dari 3)', Subtotal: 83000, Status: 'Lunas', Jatuh_Tempo: '2026-10-25', Keterangan: 'Tahap 1 Lunas Terverifikasi' },
          { ID_Tagihan: 'TGH-202610-03', Nama_Siswa: 'Rian Saputra', No_WhatsApp: '08571234567', Nama_Produk: 'Mentoring Eksklusif Batch 3 (Cicilan 2 dari 2)', Subtotal: 125000, Status: 'Terlambat', Jatuh_Tempo: '2026-10-20', Keterangan: 'Jatuh tempo terlewati' }
        ],
        recentOrders: getMergedOrdersList(),
        products: STATE.products,
        showcases: STATE.showcases,
        testimonials: STATE.testimonials,
        leads: [
          { Tanggal: '2026-10-28 16:00', Nama_Prospek: 'Reza Fahmi', No_WhatsApp: '08129876543', Produk_Diminati: 'GAS Pro Web App Masterclass', Status_FollowUp: 'Baru' },
          { Tanggal: '2026-10-28 14:30', Nama_Prospek: 'Dewi Lestari', No_WhatsApp: '08131122334', Produk_Diminati: 'Fullstack Automation Bootcamp (Waitlist)', Status_FollowUp: 'Followed-Up' }
        ],
        settings: STATE.settings
      };
    }

    if (data.adminProfile) {
      STATE.adminRole = data.adminProfile.role || STATE.adminRole;
      STATE.adminEmail = data.adminProfile.email || STATE.adminEmail;
    }
    if (data.paymentChannels && Object.keys(data.paymentChannels).length > 0) {
      STATE.paymentChannels = Object.assign({}, DEFAULT_PAYMENT_CHANNELS, data.paymentChannels);
    }
    if (data.bills) {
      STATE.bills = data.bills;
    }

    ADMIN_STATE.data = data;
    renderAdminPortalViews(data);
  } catch (err) {
    console.error('Gagal memuat portal admin:', err);
  }
}

function renderAdminPortalViews(data) {
  const m = data.metrics || {};

  // Update Topbar Profile & Role
  const roleBadge = document.getElementById('admin-portal-role-badge');
  if (roleBadge) {
    if (STATE.adminRole === 'ADMIN') {
      roleBadge.innerHTML = '🛡️ Admin Staff';
      roleBadge.style.background = '#E0F2FE';
      roleBadge.style.color = '#0369A1';
    } else {
      roleBadge.innerHTML = '👑 Super Admin';
      roleBadge.style.background = '#FFE4E6';
      roleBadge.style.color = '#BE123C';
    }
  }
  const emailEl = document.getElementById('admin-portal-email');
  if (emailEl) emailEl.textContent = STATE.adminEmail;

  // Update Badges
  const pendingCount = (data.recentOrders || []).filter(o => o.Status_Bayar === 'Pending').length;
  const badgeOrders = document.getElementById('badge-pending-orders');
  if (badgeOrders) badgeOrders.textContent = pendingCount;

  const badgeLeads = document.getElementById('badge-leads-count');
  if (badgeLeads) badgeLeads.textContent = (data.leads || []).length;

  const badgeBills = document.getElementById('badge-bills-count');
  if (badgeBills) badgeBills.textContent = (data.bills || []).filter(b => b.Status !== 'Lunas').length;

  STATE.modules = loadStoredClassroomModules();
  const badgeModules = document.getElementById('badge-modules-count');
  if (badgeModules) badgeModules.textContent = (Array.isArray(STATE.modules) ? STATE.modules : []).length;

  // 1. KPI Cards in Tab Dashboard
  const kpiContainer = document.getElementById('admin-kpi-container');
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="admin-kpi-card">
        <span class="kpi-label">Total Omset Penjualan</span>
        <span class="kpi-value">Rp ${Number(m.totalRevenue || 0).toLocaleString('id-ID')}</span>
        <span class="kpi-sub" style="color:#10B981;">↑ +18% vs bulan lalu</span>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Pesanan Lunas</span>
        <span class="kpi-value" style="color:#10B981;">${m.paidOrders || 0}</span>
        <span class="kpi-sub" style="color:var(--text-muted);">Transaksi Terverifikasi</span>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Menunggu Verifikasi</span>
        <span class="kpi-value" style="color:#F59E0B;">${pendingCount}</span>
        <span class="kpi-sub" style="color:#F59E0B;">Perlu Tindakan Admin</span>
      </div>
      <div class="admin-kpi-card">
        <span class="kpi-label">Total Leads CRM</span>
        <span class="kpi-value" style="color:var(--deep-navy);">${(data.leads || []).length}</span>
        <span class="kpi-sub" style="color:#FF2E63;">Prospek & Waitlist</span>
      </div>
    `;
  }

  // 2. Quick Orders in Tab Dashboard
  const quickOrdersTbody = document.getElementById('quick-orders-tbody');
  if (quickOrdersTbody) {
    const pendings = (data.recentOrders || []).filter(o => o.Status_Bayar === 'Pending' || o.Status_Bayar === 'Menunggu Verifikasi');
    if (!pendings.length) {
      quickOrdersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#10B981; font-weight:700;">✅ Semua pesanan telah diverifikasi lunas!</td></tr>`;
    } else {
      quickOrdersTbody.innerHTML = pendings.map(o => `
        <tr>
          <td style="font-weight:700;">${o.ID_Order}</td>
          <td><strong>${o.Nama_Pembeli || o.nama || '-'}</strong><br><small style="color:#64748B;">${o.No_WhatsApp || o.whatsapp || '-'} • ${o.Email || o.email || '-'}</small></td>
          <td style="font-weight:800; color:var(--deep-navy);">Rp ${Number(o.Total_Bayar || o.total || 0).toLocaleString('id-ID')}</td>
          <td>
            ${o.Bukti_Transfer_URL ? `<button type="button" class="btn-secondary" style="padding:4px 10px; font-size:11px; color:#FF2E63; border-color:#FF2E63;" onclick="openProofModal('${o.ID_Order}')">Lihat Bukti 👁️</button>` : '<span style="color:#94A3B8; font-size:11px;">Tanpa Bukti</span>'}
          </td>
          <td><span class="pill-badge yellow">${o.Status_Bayar === 'Lunas' ? 'Lunas' : 'Menunggu Verifikasi'}</span></td>
          <td>
            ${o.Status_Bayar !== 'Lunas' ? `
              <button class="shimmer-btn" style="padding:6px 14px; font-size:11px;" onclick="verifyOrderAdmin('${o.ID_Order}', 'Lunas')">Verifikasi Lunas 🚀</button>
            ` : `<span style="color:#10B981; font-weight:700; font-size:12px;">✓ Lunas</span>`}
          </td>
        </tr>
      `).join('');
    }
  }

  // 3. Full Orders Table in Tab Orders
  renderFullOrdersTable(data.recentOrders || []);

  // 4. Products Table in Tab Products (CRUD)
  renderAdminProductsTable(data.products || STATE.products);

  // 5. Showcase Table in Tab Showcase (CRUD)
  renderAdminShowcaseTable(data.showcases || STATE.showcases);

  // 6. Leads Table in Tab CRM
  renderAdminLeadsTable(data.leads || []);

  // 7. Testimonials Table in Tab Testimonials
  renderAdminTestimonialsTable(data.testimonials || STATE.testimonials);

  // 8. Site Settings in Tab Settings (Gunakan penyimpanan lokal terbaru & jangan timpa saat admin sedang mengetik!)
  const hasStoredSettings = localStorage.getItem('etalaseku_site_settings') !== null;
  if (!hasStoredSettings && data.settings && Object.keys(data.settings).length > 0) {
    STATE.settings = {
      announcement_bar_text: typeof data.settings.announcement_bar_text === 'string' && data.settings.announcement_bar_text.trim()
        ? data.settings.announcement_bar_text.trim()
        : DEFAULT_SITE_SETTINGS.announcement_bar_text,
      wa_cs_number: data.settings.wa_cs_number
        ? normalizeWaCsNumber(data.settings.wa_cs_number)
        : DEFAULT_SITE_SETTINGS.wa_cs_number,
      link_komunitas_tg: normalizeCommunityLinkUrl(data.settings.link_komunitas_tg || ''),
      rekening_pembayaran: data.settings.rekening_pembayaran || ''
    };
  } else {
    STATE.settings = loadStoredSiteSettings();
  }
  populateAdminSiteSettingsForm(true);

  // 9. Automated Payment Channels in Tab Settings
  renderAdminPaymentChannels();

  // 10. Student Billing & Installment in Tab Billing
  renderStudentBillingTab(data.bills || STATE.bills || []);

  // 11. Admin Role & Credentials in Tab Account
  renderAdminAccountTab();

  // 12. Classroom Modules in Tab Classroom
  renderClassroomModulesAdmin();
}

function renderFullOrdersTable(orders) {
  const tbody = document.getElementById('full-orders-tbody');
  if (!tbody) return;
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px;">Belum ada data pesanan.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td style="font-weight:700;">${o.ID_Order}</td>
      <td style="color:#64748B; font-size:12px;">${o.Tanggal_Waktu || '-'}</td>
      <td><strong>${o.Nama_Pembeli}</strong><br><small style="color:#64748B;">${o.No_WhatsApp} • ${o.Email || ''}</small></td>
      <td><strong style="color:var(--deep-navy);">${o.productName || o.Nama_Produk || o.Produk || o.ID_Produk || 'Digital Agency Notion OS'}</strong></td>
      <td style="font-weight:800; color:var(--deep-navy);">Rp ${Number(o.Total_Bayar).toLocaleString('id-ID')}</td>
      <td>
        ${o.Bukti_Transfer_URL ? `<button type="button" class="btn-secondary" style="padding:4px 10px; font-size:11.5px; font-weight:700; color:#FF2E63; border-color:#FF2E63; border-radius:8px; cursor:pointer;" onclick="openProofModal('${o.ID_Order}')">📸 Lihat Bukti</button>` : '<span style="color:#94A3B8; font-size:11.5px;">-</span>'}
      </td>
      <td>
        <span class="pill-badge ${o.Status_Bayar === 'Lunas' ? 'green' : (o.Status_Bayar === 'Ditolak' ? 'red' : 'yellow')}">${o.Status_Bayar}</span>
      </td>
      <td>
        ${o.Status_Bayar !== 'Lunas' ? `
          <button class="shimmer-btn" style="padding:6px 12px; font-size:11px;" onclick="verifyOrderAdmin('${o.ID_Order}', 'Lunas')">Verifikasi Lunas 🚀</button>
        ` : `<div style="display:inline-flex; align-items:center; gap:6px;">
            <span style="color:#10B981; font-weight:700; font-size:12px;">✓ Lunas</span>
            <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#059669; border-color:#6EE7B7; border-radius:6px; cursor:pointer;" onclick="openReceiptSuccessModal('${o.ID_Order}')" title="Lihat Struk Kuitansi">🧾 Struk</button>
            <button class="shimmer-btn" style="padding:4px 8px; font-size:11px; background:#10B981; border-radius:6px; cursor:pointer;" onclick="STATE.activeReceiptOrder = getMergedOrdersList().find(x => (x.ID_Order === '${o.ID_Order}' || x.orderId === '${o.ID_Order}')); sendReceiptToStudentWhatsApp();" title="Kirim Struk ke WhatsApp Siswa">💬 WA Siswa</button>
          </div>`}
      </td>
    </tr>
  `).join('');
}

function filterOrdersTable(query) {
  const q = String(query || '').toLowerCase();
  const filtered = (ADMIN_STATE.data.recentOrders || []).filter(o =>
    (o.Nama_Pembeli || '').toLowerCase().includes(q) ||
    (o.No_WhatsApp || '').includes(q) ||
    (o.ID_Order || '').toLowerCase().includes(q)
  );
  renderFullOrdersTable(filtered);
}

// ============================================================================
// PRODUCT MANAGEMENT (CRUD & DRIVE UPLOAD)
// ============================================================================
function renderAdminProductsTable(products) {
  const tbody = document.getElementById('products-admin-tbody');
  if (!tbody) return;
  const list = Array.isArray(products) && products.length > 0 ? products : (STATE.products || []);
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px;">Belum ada produk dalam katalog. Klik tombol "+ Tambah Produk Baru".</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(p => `
    <tr>
      <td>
        <img src="${formatImageUrl(p.Banner_URL)}" style="width:60px; height:40px; border-radius:8px; object-fit:cover; border:1px solid #CBD5E1; box-shadow:0 1px 3px rgba(0,0,0,0.08);" alt="${escapeHtml(p.Nama_Produk)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80';">
      </td>
      <td><strong>${escapeHtml(p.Nama_Produk)}</strong><br><small style="color:#64748B;">ID: ${escapeHtml(p.ID_Produk)}</small></td>
      <td><span class="pill-badge blue">${escapeHtml(p.Kategori)}</span></td>
      <td>
        <span style="text-decoration:line-through; color:#94A3B8; font-size:12px;">Rp ${Number(p.Harga_Normal).toLocaleString('id-ID')}</span><br>
        <strong style="color:var(--deep-navy);">Rp ${Number(p.Harga_Promo).toLocaleString('id-ID')}</strong>
      </td>
      <td>
        Batch ${p.Batch_Aktif || 1}<br>
        <small style="color:${Number(p.Maks_Kuota_Batch) <= 0 ? '#EF4444' : '#10B981'}; font-weight:700;">
          ${Number(p.Maks_Kuota_Batch) <= 0 ? 'Penuh (Waitlist)' : p.Maks_Kuota_Batch + ' Kursi'}
        </small>
      </td>
      <td>
        <span class="pill-badge ${p.Status === 'Publish' ? 'green' : 'yellow'}">${escapeHtml(p.Status)}</span>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditProductModal('${p.ID_Produk}')">Edit ✏️</button>
          <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#EF4444; border-color:#EF4444;" onclick="deleteProductAdmin('${p.ID_Produk}')">Hapus ✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddProductModal() {
  document.getElementById('product-form-title').textContent = 'Tambah Produk Digital Baru 📦';
  document.getElementById('prod-form-id').value = '';
  document.getElementById('prod-form-name').value = '';
  document.getElementById('prod-form-category').value = 'E-Course Praktis';
  document.getElementById('prod-form-status').value = 'Publish';
  document.getElementById('prod-form-price-normal').value = '';
  document.getElementById('prod-form-price-promo').value = '';
  document.getElementById('prod-form-batch-no').value = '3';
  document.getElementById('prod-form-batch-quota').value = '50';
  document.getElementById('prod-form-banner-url').value = '';
  document.getElementById('prod-form-gallery-urls').value = '';
  document.getElementById('prod-form-access-link').value = '';
  document.getElementById('prod-form-desc').value = '';
  clearModalBannerPhoto();
  document.getElementById('modal-product-form').classList.add('active');
}

function openEditProductModal(productId) {
  const p = (ADMIN_STATE.data.products || STATE.products).find(item => item.ID_Produk === productId);
  if (!p) return;

  document.getElementById('product-form-title').textContent = 'Edit Produk Digital 📦';
  document.getElementById('prod-form-id').value = p.ID_Produk;
  document.getElementById('prod-form-name').value = p.Nama_Produk;
  document.getElementById('prod-form-category').value = p.Kategori;
  document.getElementById('prod-form-status').value = p.Status;
  document.getElementById('prod-form-price-normal').value = p.Harga_Normal;
  document.getElementById('prod-form-price-promo').value = p.Harga_Promo;
  document.getElementById('prod-form-batch-no').value = p.Batch_Aktif || 1;
  document.getElementById('prod-form-batch-quota').value = p.Maks_Kuota_Batch || 50;
  document.getElementById('prod-form-banner-url').value = p.Banner_URL || '';
  document.getElementById('prod-form-gallery-urls').value = p.Galeri_URLs || '';
  document.getElementById('prod-form-access-link').value = p.Link_Akses_Materi || '';
  document.getElementById('prod-form-desc').value = p.Deskripsi || '';
  if (p.Banner_URL) {
    handleModalBannerInput(p.Banner_URL);
  } else {
    clearModalBannerPhoto();
  }
  document.getElementById('modal-product-form').classList.add('active');
}

function toggleInlineProductForm() {
  const box = document.getElementById('inline-product-form-box');
  if (!box) return;
  box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
  if (box.style.display === 'block') {
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function saveProductForm(e, isInline = false) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const btn = isInline ? document.getElementById('btn-save-inline-prod') : document.getElementById('btn-save-product');
  const originalBtnText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = 'Menyimpan Produk... ⏳';
    btn.disabled = true;
  }

  try {
    let payload = {};

    if (isInline) {
      const name = (document.getElementById('inline-prod-name') ? document.getElementById('inline-prod-name').value : '').trim();
      const cat = document.getElementById('inline-prod-category') ? document.getElementById('inline-prod-category').value : 'Template Bisnis';
      const status = document.getElementById('inline-prod-status') ? document.getElementById('inline-prod-status').value : 'Publish';
      const normalPrice = Number(document.getElementById('inline-prod-normal-price') ? document.getElementById('inline-prod-normal-price').value : 0);
      const promoPrice = Number(document.getElementById('inline-prod-promo-price') ? document.getElementById('inline-prod-promo-price').value : 0);
      const batchNo = Number(document.getElementById('inline-prod-batch') ? document.getElementById('inline-prod-batch').value : 1);
      const quota = Number(document.getElementById('inline-prod-quota') ? document.getElementById('inline-prod-quota').value : 50);
      const bannerVal = document.getElementById('inline-prod-banner-url') ? document.getElementById('inline-prod-banner-url').value.trim() : '';
      const accessLink = document.getElementById('inline-prod-access-link') ? document.getElementById('inline-prod-access-link').value.trim() : '';
      const desc = document.getElementById('inline-prod-desc') ? document.getElementById('inline-prod-desc').value.trim() : '';

      // Ekstraksi base64 jika bannerVal berupa data:image agar Google Drive bisa mengupload secara resmi
      let bannerBase64 = '';
      let bannerName = '';
      let bannerType = 'image/jpeg';
      if (bannerVal && bannerVal.startsWith('data:image/')) {
        const parts = bannerVal.split(',');
        if (parts.length > 1) {
          bannerBase64 = parts[1];
          bannerType = parts[0].split(';')[0].replace('data:', '') || 'image/jpeg';
          const ext = bannerType.includes('png') ? '.png' : '.jpg';
          bannerName = 'PROD_' + (name || 'produk').replace(/[^a-zA-Z0-9]/g, '_') + ext;
        }
      }

      payload = {
        ID_Produk: 'PRD-' + Date.now().toString().slice(-6),
        Nama_Produk: name || 'Produk Digital Baru',
        Kategori: cat,
        Status: status,
        Harga_Normal: normalPrice,
        Harga_Promo: promoPrice,
        Batch_Aktif: batchNo,
        Maks_Kuota_Batch: quota,
        Banner_URL: bannerVal ? formatImageUrl(bannerVal) : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        Galeri_URLs: '',
        Link_Akses_Materi: accessLink,
        Deskripsi: desc,
        bannerBase64: bannerBase64,
        bannerName: bannerName,
        bannerType: bannerType
      };
    } else {
      const fileInput = document.getElementById('prod-form-banner-file');
      let bannerBase64 = '';
      let bannerName = '';
      let bannerType = '';

      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        bannerName = file.name;
        bannerType = file.type;
        try {
          const comp = await compressAndReadImage(file, 800, 0.70);
          if (comp && comp.startsWith('data:image/')) {
            const parts = comp.split(',');
            if (parts.length > 1) bannerBase64 = parts[1];
          } else {
            bannerBase64 = await readFileAsBase64(file);
          }
        } catch(err) {}
      }

      const idVal = (document.getElementById('prod-form-id') ? document.getElementById('prod-form-id').value : '').trim();
      const name = (document.getElementById('prod-form-name') ? document.getElementById('prod-form-name').value : '').trim();
      const cat = document.getElementById('prod-form-category') ? document.getElementById('prod-form-category').value : 'E-Course Praktis';
      const status = document.getElementById('prod-form-status') ? document.getElementById('prod-form-status').value : 'Publish';
      const normalPrice = Number(document.getElementById('prod-form-price-normal') ? document.getElementById('prod-form-price-normal').value : 0);
      const promoPrice = Number(document.getElementById('prod-form-price-promo') ? document.getElementById('prod-form-price-promo').value : 0);
      const batchNo = Number(document.getElementById('prod-form-batch-no') ? document.getElementById('prod-form-batch-no').value : 1);
      const quota = Number(document.getElementById('prod-form-batch-quota') ? document.getElementById('prod-form-batch-quota').value : 50);
      const bannerVal = document.getElementById('prod-form-banner-url') ? document.getElementById('prod-form-banner-url').value.trim() : '';
      const galleryUrls = document.getElementById('prod-form-gallery-urls') ? document.getElementById('prod-form-gallery-urls').value.trim() : '';
      const accessLink = document.getElementById('prod-form-access-link') ? document.getElementById('prod-form-access-link').value.trim() : '';
      const desc = document.getElementById('prod-form-desc') ? document.getElementById('prod-form-desc').value.trim() : '';

      if (!bannerBase64 && bannerVal && bannerVal.startsWith('data:image/')) {
        const parts = bannerVal.split(',');
        if (parts.length > 1) {
          bannerBase64 = parts[1];
          bannerType = parts[0].split(';')[0].replace('data:', '') || 'image/jpeg';
          const ext = bannerType.includes('png') ? '.png' : '.jpg';
          bannerName = 'PROD_' + (name || 'produk').replace(/[^a-zA-Z0-9]/g, '_') + ext;
        }
      }

      let finalBanner = bannerVal ? formatImageUrl(bannerVal) : (bannerBase64 ? formatImageUrl('data:' + (bannerType || 'image/jpeg') + ';base64,' + bannerBase64) : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80');

      payload = {
        ID_Produk: idVal || ('PRD-' + Date.now().toString().slice(-6)),
        Nama_Produk: name || 'Produk Digital Baru',
        Kategori: cat,
        Status: status,
        Harga_Normal: normalPrice,
        Harga_Promo: promoPrice,
        Batch_Aktif: batchNo,
        Maks_Kuota_Batch: quota,
        Banner_URL: finalBanner,
        Galeri_URLs: galleryUrls,
        Link_Akses_Materi: accessLink,
        Deskripsi: desc,
        bannerBase64: bannerBase64,
        bannerName: bannerName,
        bannerType: bannerType
      };
    }

    // 1. UPDATE STATE & PERSIST SECARA AMAN (ANTI QUOTA EXCEEDED CRASH)
    if (!Array.isArray(STATE.products)) STATE.products = [];
    const existingIdx = STATE.products.findIndex(p => p.ID_Produk === payload.ID_Produk);
    if (existingIdx >= 0) {
      STATE.products[existingIdx] = { ...STATE.products[existingIdx], ...payload };
    } else {
      STATE.products.unshift(payload);
    }
    
    // Simpan ke IndexedDB & Safe LocalStorage tanpa pernah melempar unhandled QuotaExceededError!
    persistProductsSafely(STATE.products);

    // Refresh semua tampilan tabel dan katalog seketika (Optimistic UI 0ms)
    renderProducts();
    if (typeof renderAdminProductsTable === 'function') {
      renderAdminProductsTable(STATE.products);
    }
    if (typeof SlideshowManager !== 'undefined' && SlideshowManager.initProductSlideshows) {
      SlideshowManager.initProductSlideshows();
    }

    // Tutup / reset form
    closeAllModals();
    if (isInline) {
      toggleInlineProductForm();
      const iName = document.getElementById('inline-prod-name'); if (iName) iName.value = '';
      const iNorm = document.getElementById('inline-prod-normal-price'); if (iNorm) iNorm.value = '';
      const iProm = document.getElementById('inline-prod-promo-price'); if (iProm) iProm.value = '';
      const iLink = document.getElementById('inline-prod-access-link'); if (iLink) iLink.value = '';
      const iDesc = document.getElementById('inline-prod-desc'); if (iDesc) iDesc.value = '';
      clearInlineBannerPhoto();
    } else {
      clearModalBannerPhoto();
    }

    // 2. SINKRONISASI KE GOOGLE APPS SCRIPT (ASYNCHRONOUS NON-BLOCKING)
    let syncSuccess = false;
    let gasMessage = '';
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      try {
        const res = await fetch(APP_CONFIG.GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'saveProduct', token: STATE.adminToken || 'AUTH_TOKEN_' + Date.now(), data: payload })
        });
        const json = await res.json();
        if (json && json.success) {
          syncSuccess = true;
          if (json.bannerUrl) {
            payload.Banner_URL = json.bannerUrl;
            persistProductsSafely(STATE.products);
            renderProducts();
            if (typeof renderAdminProductsTable === 'function') {
              renderAdminProductsTable(STATE.products);
            }
          }
        } else if (json && json.message) {
          gasMessage = json.message;
        }
      } catch (fetchErr) {
        console.warn('Sync to Google Apps Script berjalan lokal:', fetchErr);
      }
    }

    // Feedback Notifikasi ke Pengguna
    if (syncSuccess) {
      showToast('🎉 Produk berhasil disimpan ke Google Sheets & Katalog Halaman Utama!', 'success', 3500);
    } else {
      showToast('✅ Produk berhasil disimpan ke Katalog Halaman Utama & CRM!', 'success', 4000);
    }

  } catch (err) {
    console.error('Error saveProductForm:', err);
    showToast('Gagal memproses produk: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.innerHTML = originalBtnText || 'Simpan Produk ke Google Sheets 💾';
      btn.disabled = false;
    }
  }
}

async function deleteProductAdmin(id) {
  if (!Array.isArray(STATE.products)) return;
  STATE.products = STATE.products.filter(p => p.ID_Produk !== id);
  persistProductsSafely(STATE.products);
  renderProducts();
  if (typeof renderAdminProductsTable === 'function') {
    renderAdminProductsTable(STATE.products);
  }
  showToast('Produk berhasil dihapus dari katalog!', 'info', 2500);

  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    try {
      await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteProduct', token: STATE.adminToken, data: { id } })
      });
    } catch(err) {
      console.warn('Sync deleteProduct to GAS:', err);
    }
  }
}

// ============================================================================
// SHOWCASE & HASIL KARYA MEMBER MANAGEMENT (CRUD & DRIVE UPLOAD)
// ============================================================================
function renderAdminShowcaseTable(showcases) {
  const tbody = document.getElementById('showcase-admin-tbody');
  if (!tbody) return;
  const list = showcases || STATE.showcases || [];
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:#64748B;">Belum ada hasil karya member. Klik "+ Input Manual Hasil Karya" untuk menambahkan.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map((s, idx) => {
    const isApproved = (s.Status_Tampil === 'Publish' || s.Status === 'Tampil di Pameran');
    const statusBadge = isApproved
      ? '<span class="pill-badge green">🟢 Tampil di Pameran</span>'
      : '<span class="pill-badge yellow">⏳ Menunggu Review</span>';

    const demoUrl = s.Link_Demo || s.Tautan_Live;
    const demoBtn = demoUrl
      ? `<a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#2563EB; border-color:#93C5FD; display:inline-flex; align-items:center; gap:3px;">🌐 Demo ↗</a>`
      : '-';

    const ytBtn = s.Video_Youtube
      ? `<button type="button" class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#DC2626; border-color:#FCA5A5; display:inline-flex; align-items:center; gap:3px;" onclick="openYouTubeShowcaseModal('${s.Video_Youtube}', '${escapeHtml(s.Nama_Karya)}', '${escapeHtml(s.Nama_Member)}')">▶️ Video</button>`
      : '';

    const approveBtn = !isApproved
      ? `<button class="shimmer-btn" style="padding:5px 10px; font-size:11px; background:#10B981; color:white; border-radius:6px;" onclick="approveShowcaseItem('${s.ID_Showcase || s.ID_Portofolio || idx}')" title="Setujui karya ini untuk tayang ke publik">✅ Setujui</button>`
      : `<button class="btn-secondary" style="padding:5px 8px; font-size:11px; color:#D97706; border-color:#FCD34D; background:#FEF3C7;" onclick="unapproveShowcaseItem('${s.ID_Showcase || s.ID_Portofolio || idx}')" title="Tarik ke draft">⏸️ Draft</button>`;

    return `
      <tr>
        <td>
          <img src="${formatImageUrl(s.Gambar_Preview_URL)}" style="width:65px; height:44px; border-radius:8px; object-fit:cover; border:1px solid #CBD5E1; box-shadow:0 1px 3px rgba(0,0,0,0.08);" alt="${escapeHtml(s.Nama_Karya)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';">
        </td>
        <td>
          <strong style="color:var(--deep-navy);">${s.Nama_Karya}</strong>
          <div style="font-size:11px; color:#64748B;">${s.Kategori || 'Web App GAS'}</div>
        </td>
        <td>
          <div style="font-weight:700;">${s.Nama_Member}</div>
          <div style="font-size:11px; color:#64748B;">${s.Profesi || 'Member Siswa'}</div>
        </td>
        <td><span class="pill-badge green">${s.Statistik_Pencapaian || 'Hasil Karya'}</span></td>
        <td>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            ${demoBtn}
            ${ytBtn}
          </div>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:5px; align-items:center; justify-content:flex-end; flex-wrap:wrap;">
            ${approveBtn}
            <button class="btn-secondary" style="padding:5px 8px; font-size:11px; color:#2563EB; border-color:#BFDBFE;" onclick="editShowcaseAdmin('${s.ID_Showcase || s.ID_Portofolio || idx}')" title="Edit Manual Data">✏️</button>
            <button class="btn-secondary" style="padding:5px 8px; font-size:11px; color:#EF4444; border-color:#FCA5A5;" onclick="deleteShowcaseAdmin('${s.ID_Showcase || s.ID_Portofolio || idx}')" title="Hapus Karya">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddShowcaseModal() {
  document.getElementById('showcase-form-id').value = '';
  document.getElementById('showcase-form-title').value = '';
  document.getElementById('showcase-form-author').value = '';
  if (document.getElementById('showcase-form-profession')) document.getElementById('showcase-form-profession').value = '';
  if (document.getElementById('showcase-form-category')) document.getElementById('showcase-form-category').value = 'Web App GAS';
  document.getElementById('showcase-form-stats').value = '';
  document.getElementById('showcase-form-url').value = '';
  document.getElementById('showcase-form-link').value = '';
  if (document.getElementById('showcase-form-youtube')) document.getElementById('showcase-form-youtube').value = '';
  if (document.getElementById('showcase-form-story')) document.getElementById('showcase-form-story').value = '';
  if (document.getElementById('showcase-form-status')) document.getElementById('showcase-form-status').value = 'Publish';
  const heading = document.getElementById('showcase-modal-heading');
  if (heading) heading.textContent = 'Input Manual Hasil Karya Member 🌟';
  document.getElementById('modal-showcase-form').classList.add('active');
}
window.openAddShowcaseModal = openAddShowcaseModal;

function editShowcaseAdmin(id) {
  const item = (STATE.showcases || []).find((s, idx) => (s.ID_Showcase === id || s.ID_Portofolio === id || String(idx) === String(id)));
  if (!item) return;

  document.getElementById('showcase-form-id').value = item.ID_Showcase || item.ID_Portofolio || id;
  document.getElementById('showcase-form-title').value = item.Nama_Karya || '';
  document.getElementById('showcase-form-author').value = item.Nama_Member || '';
  if (document.getElementById('showcase-form-profession')) document.getElementById('showcase-form-profession').value = item.Profesi || '';
  if (document.getElementById('showcase-form-category')) document.getElementById('showcase-form-category').value = item.Kategori || 'Web App GAS';
  document.getElementById('showcase-form-stats').value = item.Statistik_Pencapaian || '';
  document.getElementById('showcase-form-url').value = item.Gambar_Preview_URL || '';
  document.getElementById('showcase-form-link').value = item.Link_Demo || item.Tautan_Live || '';
  if (document.getElementById('showcase-form-youtube')) document.getElementById('showcase-form-youtube').value = item.Video_Youtube || '';
  if (document.getElementById('showcase-form-story')) document.getElementById('showcase-form-story').value = item.Testimoni_Kesan || '';
  if (document.getElementById('showcase-form-status')) document.getElementById('showcase-form-status').value = item.Status_Tampil || 'Publish';

  const heading = document.getElementById('showcase-modal-heading');
  if (heading) heading.textContent = 'Edit Data Hasil Karya Member ✏️';
  document.getElementById('modal-showcase-form').classList.add('active');
}
window.editShowcaseAdmin = editShowcaseAdmin;

function approveShowcaseItem(id) {
  const item = (STATE.showcases || []).find((s, idx) => (s.ID_Showcase === id || s.ID_Portofolio === id || String(idx) === String(id)));
  if (item) {
    item.Status_Tampil = 'Publish';
    item.Status = 'Tampil di Pameran';
    localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
  }
  if (Array.isArray(STATE.myShowcases)) {
    const myItem = STATE.myShowcases.find((s, idx) => (s.ID_Showcase === id || s.ID_Portofolio === id || s.Nama_Karya === (item && item.Nama_Karya)));
    if (myItem) {
      myItem.Status = 'Tampil di Pameran';
      myItem.Status_Tampil = 'Publish';
      localStorage.setItem('etalaseku_my_showcases', JSON.stringify(STATE.myShowcases));
    }
  }
  renderAdminShowcaseTable(STATE.showcases);
  renderShowcases();
  renderPameranKaryaPortal();
  showToast('🎉 Hasil karya member berhasil disetujui & langsung tayang di pameran!', 'success', 3500);
}
window.approveShowcaseItem = approveShowcaseItem;

function unapproveShowcaseItem(id) {
  const item = (STATE.showcases || []).find((s, idx) => (s.ID_Showcase === id || s.ID_Portofolio === id || String(idx) === String(id)));
  if (item) {
    item.Status_Tampil = 'Draft';
    item.Status = 'Menunggu Review Admin';
    localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
  }
  if (Array.isArray(STATE.myShowcases)) {
    const myItem = STATE.myShowcases.find((s, idx) => (s.ID_Showcase === id || s.ID_Portofolio === id || s.Nama_Karya === (item && item.Nama_Karya)));
    if (myItem) {
      myItem.Status = 'Menunggu Review Admin';
      myItem.Status_Tampil = 'Draft';
      localStorage.setItem('etalaseku_my_showcases', JSON.stringify(STATE.myShowcases));
    }
  }
  renderAdminShowcaseTable(STATE.showcases);
  renderShowcases();
  renderPameranKaryaPortal();
  showToast('Karya ditarik ke status Draft (Menunggu Review).', 'info', 3000);
}
window.unapproveShowcaseItem = unapproveShowcaseItem;

async function saveShowcaseForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-showcase');
  btn.innerHTML = 'Menyimpan Hasil Karya... ⏳';
  btn.disabled = true;

  try {
    const fileInput = document.getElementById('showcase-form-file');
    let imageBase64 = '';
    if (fileInput && fileInput.files.length > 0) {
      imageBase64 = await compressAndReadImage(fileInput.files[0], 1000, 0.85);
    }

    const editId = document.getElementById('showcase-form-id').value;
    const title = document.getElementById('showcase-form-title').value.trim();
    const author = document.getElementById('showcase-form-author').value.trim();
    const profession = (document.getElementById('showcase-form-profession') ? document.getElementById('showcase-form-profession').value : '').trim();
    const category = document.getElementById('showcase-form-category') ? document.getElementById('showcase-form-category').value : 'Web App GAS';
    const stats = document.getElementById('showcase-form-stats').value.trim();
    const url = (document.getElementById('showcase-form-url') ? document.getElementById('showcase-form-url').value : '').trim();
    const demoLink = (document.getElementById('showcase-form-link') ? document.getElementById('showcase-form-link').value : '').trim();
    const ytLink = (document.getElementById('showcase-form-youtube') ? document.getElementById('showcase-form-youtube').value : '').trim();
    const story = (document.getElementById('showcase-form-story') ? document.getElementById('showcase-form-story').value : '').trim();
    const statusVal = document.getElementById('showcase-form-status') ? document.getElementById('showcase-form-status').value : 'Publish';

    let item = editId ? (STATE.showcases || []).find(s => (s.ID_Showcase === editId || s.ID_Portofolio === editId)) : null;

    if (item) {
      // Mode Edit
      item.Nama_Karya = title;
      item.Nama_Member = author;
      item.Profesi = profession || item.Profesi || 'Member Siswa';
      item.Kategori = category;
      item.Statistik_Pencapaian = stats;
      if (imageBase64) item.Gambar_Preview_URL = formatImageUrl(imageBase64);
      else if (url) item.Gambar_Preview_URL = formatImageUrl(url);
      item.Link_Demo = demoLink;
      item.Tautan_Live = demoLink;
      item.Video_Youtube = ytLink;
      item.Testimoni_Kesan = story;
      item.Status_Tampil = statusVal;
      item.Status = statusVal === 'Publish' ? 'Tampil di Pameran' : 'Menunggu Review Admin';
    } else {
      // Mode Tambah Baru
      const newId = 'PFO-' + Date.now();
      const payload = {
        ID_Portofolio: newId,
        ID_Showcase: newId,
        Nama_Karya: title,
        Nama_Member: author,
        Profesi: profession || 'Member Siswa',
        Kategori: category,
        Statistik_Pencapaian: stats,
        Gambar_Preview_URL: formatImageUrl(imageBase64 || url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'),
        Foto_Profil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        Link_Demo: demoLink,
        Tautan_Live: demoLink,
        Video_Youtube: ytLink,
        Testimoni_Kesan: story || 'Sistem bisnis nyata yang dibangun dengan Google Workspace & Web App modern.',
        Status_Tampil: statusVal,
        Status: statusVal === 'Publish' ? 'Tampil di Pameran' : 'Menunggu Review Admin'
      };
      if (!Array.isArray(STATE.showcases)) STATE.showcases = [];
      STATE.showcases.unshift(payload);
    }

    localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
    renderAdminShowcaseTable(STATE.showcases);
    renderShowcases();
    renderPameranKaryaPortal();
    closeAllModals();
    showToast('Hasil karya member berhasil disimpan ke galeri pameran!', 'success', 3500);
  } catch (err) {
    showToast('Gagal menyimpan hasil karya: ' + err.message, 'error');
  } finally {
    btn.innerHTML = 'Simpan Hasil Karya Siswa 💾';
    btn.disabled = false;
  }
}

async function deleteShowcaseAdmin(id) {
  // Direct delete without browser confirm
  showToast('Menghapus hasil karya dari galeri...', 'info', 2000);
  STATE.showcases = (STATE.showcases || []).filter((s, idx) => !(s.ID_Showcase === id || s.ID_Portofolio === id || String(idx) === String(id)));
  localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));
  renderAdminShowcaseTable(STATE.showcases);
  renderShowcases();
  renderPameranKaryaPortal();
  showToast('Hasil karya berhasil dihapus dari galeri.', 'info', 3000);
}

// CRM LEADS & DIRECT WHATSAPP ACTION (SCREEN 11)
function renderAdminLeadsTable(leads) {
  const tbody = document.getElementById('crm-leads-tbody');
  if (!tbody) return;
  if (!leads.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px;">Belum ada data leads masuk.</td></tr>`;
    return;
  }
  tbody.innerHTML = leads.map(l => {
    const waText = encodeURIComponent(`Halo kak ${l.Nama_Prospek || ''}, saya Admin dari EtalaseKu Hub. Terkait ketertarikan Anda pada program ${l.Produk_Diminati || 'kami'}, apakah ada yang bisa kami bantu jelaskan?`);
    return `
      <tr>
        <td style="color:#64748B; font-size:12px;">${l.Tanggal || '-'}</td>
        <td><strong>${l.Nama_Prospek}</strong></td>
        <td>${l.No_WhatsApp}</td>
        <td>${l.Produk_Diminati}</td>
        <td><span class="pill-badge ${l.Status_FollowUp === 'Closing' ? 'green' : 'yellow'}">${l.Status_FollowUp || 'Baru'}</span></td>
        <td>
          <a href="https://wa.me/${(l.No_WhatsApp || '').replace(/[^0-9]/g, '')}?text=${waText}" target="_blank" class="shimmer-btn" style="text-decoration:none; display:inline-block; padding:6px 14px; font-size:11px; background:#25D366;">
            💬 Chat di WhatsApp
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

async function syncCrmContacts() {
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    const res = await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'syncCrmContacts', token: STATE.adminToken })
    });
    const json = await res.json();
    showToast(`Sinkronisasi selesai! ${json.addedCount || 0} kontak baru telah ditambahkan ke sheet tb_crm_kontak.`, 'info');
  } else {
    showToast('Sinkronisasi Kontak Berhasil (Demo Mode).', 'info');
  }
}

// ============================================================================
// TESTIMONIALS & SETTINGS MANAGEMENT
// ============================================================================
function renderAdminTestimonialsTable(testis) {
  const tbody = document.getElementById('testi-admin-tbody');
  if (!tbody) return;
  tbody.innerHTML = testis.map(t => `
    <tr>
      <td>
        <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #FFF1F4, #FFE4E6); color:#FF2E63; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; border:1px solid rgba(255,46,99,0.3);">
          ${(t.Nama_Member || 'S').charAt(0).toUpperCase()}
        </div>
      </td>
      <td><strong>${t.Nama_Member}</strong></td>
      <td>${t.Profesi || '-'}</td>
      <td>⭐ ${t.Rating || 5}</td>
      <td><span class="pill-badge green">${t.Hasil_Pencapaian || '-'}</span></td>
      <td style="max-width:240px; font-size:12px;">"${(t.Isi_Ulasan || '').slice(0, 80)}..."</td>
      <td>
        <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:#EF4444; border-color:#EF4444;" onclick="deleteTestimonialAdmin('${t.ID_Testimoni}')">Hapus ✕</button>
      </td>
    </tr>
  `).join('');
}

function openAddTestimonialModal() {
  document.getElementById('testi-form-name').value = '';
  document.getElementById('testi-form-role').value = '';
  document.getElementById('testi-form-achievement').value = '';
  const avatarInput = document.getElementById('testi-form-avatar');
  if (avatarInput) avatarInput.value = '';
  document.getElementById('testi-form-quote').value = '';
  document.getElementById('modal-testi-form').classList.add('active');
}

async function saveTestimonialForm(e) {
  e.preventDefault();
  const payload = {
    Nama_Member: document.getElementById('testi-form-name').value,
    Profesi: document.getElementById('testi-form-role').value,
    Hasil_Pencapaian: document.getElementById('testi-form-achievement').value,
    Foto_Avatar_URL: '', // Avatar URL dihilangkan sesuai permintaan Foto 4
    Isi_Ulasan: document.getElementById('testi-form-quote').value,
    Rating: 5,
    Status_Tampil: 'Publish'
  };

  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveTestimonial', token: STATE.adminToken, data: payload })
    });
  }

  STATE.testimonials.push(payload);
  renderTestimonials();
  TestimonialFlipManager.init();
  closeAllModals();
  showToast('Testimoni berhasil disimpan!', 'info');
  loadAdminPortalData();
}

async function deleteTestimonialAdmin(id) {
  // Safe delete without browser confirm
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'deleteTestimonial', token: STATE.adminToken, data: { id } })
    });
  }
  STATE.testimonials = STATE.testimonials.filter(t => t.ID_Testimoni !== id);
  renderTestimonials();
  loadAdminPortalData();
}

function updateAdminCommunityStatusBadge(urlVal) {
  const badge = document.getElementById('setting-komunitas-status-badge');
  if (!badge) return;
  const clean = normalizeCommunityLinkUrl(urlVal || '');
  if (clean && clean.length >= 5) {
    badge.textContent = '🟢 Aktif & Bisa Diklik di Halaman Utama';
    badge.style.background = '#DCFCE7';
    badge.style.color = '#15803D';
  } else {
    badge.textContent = '⚪ Dikosongkan Sementara';
    badge.style.background = '#F1F5F9';
    badge.style.color = '#64748B';
  }
}

function populateAdminSiteSettingsForm(respectFocus = false) {
  const s = (STATE.settings && Object.keys(STATE.settings).length > 0) ? STATE.settings : loadStoredSiteSettings();
  const annEl = document.getElementById('setting-announcement-text');
  const waEl = document.getElementById('setting-wa-cs');
  const komEl = document.getElementById('setting-komunitas-link');

  if (annEl && (!respectFocus || document.activeElement !== annEl)) {
    annEl.removeAttribute('readonly');
    annEl.removeAttribute('disabled');
    annEl.value = typeof s.announcement_bar_text === 'string' ? s.announcement_bar_text : DEFAULT_SITE_SETTINGS.announcement_bar_text;
  }
  if (waEl && (!respectFocus || document.activeElement !== waEl)) {
    waEl.removeAttribute('readonly');
    waEl.removeAttribute('disabled');
    waEl.value = s.wa_cs_number || DEFAULT_SITE_SETTINGS.wa_cs_number;
  }
  if (komEl && (!respectFocus || document.activeElement !== komEl)) {
    komEl.removeAttribute('readonly');
    komEl.removeAttribute('disabled');
    komEl.value = typeof s.link_komunitas_tg === 'string' ? s.link_komunitas_tg : '';
  }
  updateAdminCommunityStatusBadge(komEl ? komEl.value : s.link_komunitas_tg);
}

function enableSiteSettingManual(field) {
  const map = {
    announcement: 'setting-announcement-text',
    wa_cs: 'setting-wa-cs',
    komunitas: 'setting-komunitas-link'
  };
  const labelMap = {
    announcement: 'Teks Promo Announcement Bar',
    wa_cs: 'Nomor WhatsApp CS Utama',
    komunitas: 'Tautan Komunitas Telegram / WhatsApp Group'
  };
  const el = document.getElementById(map[field]);
  if (!el) return;
  el.removeAttribute('readonly');
  el.removeAttribute('disabled');
  el.focus();
  if (el.value) el.select();
  el.style.borderColor = '#FF2E63';
  el.style.boxShadow = '0 0 0 3px rgba(255, 46, 99, 0.16)';
  if (typeof showToast === 'function') {
    showToast('Silakan ketik manual ' + (labelMap[field] || 'pengaturan') + ' ✏️', 'info', 2200);
  }
}
window.enableSiteSettingManual = enableSiteSettingManual;

function saveSiteSettingManual(field) {
  const map = {
    announcement: 'setting-announcement-text',
    wa_cs: 'setting-wa-cs',
    komunitas: 'setting-komunitas-link'
  };
  const el = document.getElementById(map[field]);
  if (el) {
    el.style.borderColor = '#10B981';
    el.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.18)';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 1200);
  }
  saveAdminSettingsForm(null, field);
}
window.saveSiteSettingManual = saveSiteSettingManual;

function clearSiteCommunityLink() {
  const komEl = document.getElementById('setting-komunitas-link');
  if (komEl) {
    komEl.value = '';
  }
  saveAdminSettingsForm(null, 'komunitas_cleared');
}
window.clearSiteCommunityLink = clearSiteCommunityLink;

async function saveAdminSettingsForm(e, triggeredField) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const annEl = document.getElementById('setting-announcement-text');
  const waEl = document.getElementById('setting-wa-cs');
  const komEl = document.getElementById('setting-komunitas-link');
  const bankEl = document.getElementById('setting-bank-details');

  const rawAnn = annEl ? annEl.value.trim() : DEFAULT_SITE_SETTINGS.announcement_bar_text;
  const rawWa = waEl ? waEl.value.trim() : DEFAULT_SITE_SETTINGS.wa_cs_number;
  const rawKom = komEl ? komEl.value.trim() : '';

  const payload = {
    announcement_bar_text: rawAnn || DEFAULT_SITE_SETTINGS.announcement_bar_text,
    wa_cs_number: normalizeWaCsNumber(rawWa),
    link_komunitas_tg: normalizeCommunityLinkUrl(rawKom),
    rekening_pembayaran: bankEl ? bankEl.value : (STATE.settings && STATE.settings.rekening_pembayaran ? STATE.settings.rekening_pembayaran : '')
  };

  // Update input dengan nilai yang telah dirapikan (misal awalan 62 / https://)
  if (annEl) annEl.value = payload.announcement_bar_text;
  if (waEl) waEl.value = payload.wa_cs_number;
  if (komEl) komEl.value = payload.link_komunitas_tg;
  updateAdminCommunityStatusBadge(payload.link_komunitas_tg);

  // 1. SIMPAN INSTAN KE STATE & LOCALSTORAGE + UPDATE HALAMAN UTAMA SEKETIKA (OPTIMISTIC UI)
  persistSiteSettings(payload);
  renderAnnouncementBar();

  const btn = document.getElementById('btn-save-site-settings');
  if (btn && !triggeredField) {
    btn.disabled = true;
    btn.textContent = 'Menyimpan & Menghubungkan... ⏳';
  }

  // 2. SINKRONISASI KE GOOGLE SHEETS (GAS) SECARA AMAN TANPA MEMBLOKIR UI
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    try {
      await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'saveSiteSettings', token: STATE.adminToken, data: payload })
      });
    } catch (err) {
      console.warn('Sync pengaturan situs ke Google Sheets berjalan offline/lokal:', err);
    }
  }

  if (btn && !triggeredField) {
    btn.disabled = false;
    btn.textContent = 'Simpan Teks Banner, CS & Komunitas ke Halaman Utama & Google Sheets 💾';
  }

  if (triggeredField === 'komunitas_cleared') {
    showToast('Tautan Grup Komunitas dikosongkan sementara & disembunyikan dari Halaman Utama! ✨', 'info', 3000);
  } else if (triggeredField === 'announcement') {
    showToast('📢 Teks Promo Announcement Bar berhasil disimpan & tampil di Halaman Utama!', 'success', 3000);
  } else if (triggeredField === 'wa_cs') {
    showToast('📱 Nomor WhatsApp CS (' + payload.wa_cs_number + ') berhasil disimpan & terhubung!', 'success', 3000);
  } else if (triggeredField === 'komunitas') {
    if (payload.link_komunitas_tg) {
      showToast('👥 Tautan Grup Komunitas aktif! Sekarang pengunjung bisa klik masuk grup di Halaman Utama.', 'success', 3500);
    } else {
      showToast('⚪ Tautan Grup Komunitas dikosongkan sementara.', 'info', 2800);
    }
  } else {
    showToast('✅ Teks Banner Promo, Nomor WA CS & Pengaturan Komunitas berhasil disimpan dan terhubung ke Halaman Utama!', 'success', 3500);
  }
}
window.saveAdminSettingsForm = saveAdminSettingsForm;

async function verifyOrderAdmin(orderId, status = 'Lunas') {
  try {
    // 1. Update data lokal di STATE.orders & localStorage
    if (Array.isArray(STATE.orders)) {
      const ord = STATE.orders.find(o => (o.ID_Order === orderId || o.orderId === orderId || o.ID_Pesanan === orderId));
      if (ord) {
        ord.Status = status;
        ord.Status_Bayar = status;
        ord.status = status;
        
        // Simpan sesi member agar bisa langsung masuk
        localStorage.setItem('etalaseku_member_order_id', orderId);
        if (ord.Email || ord.email) {
          localStorage.setItem('etalaseku_member_email', ord.Email || ord.email);
        }

        // Buka draft email Gmail untuk mengirim Order ID resmi
        const destEmail = ord.Email || ord.email || '';
        const destName = ord.Nama_Pembeli || ord.nama || 'Siswa';
        const prodName = ord.productName || ord.Produk || 'Kelas Digital EtalaseKu';
        if (destEmail) {
          const mailSubject = encodeURIComponent(`Verifikasi Lunas & Akses Kelas - Order ID: ${orderId}`);
          const mailBody = encodeURIComponent(`Halo ${destName},\n\nPembayaran Anda untuk ${prodName} telah BERHASIL DIVERIFIKASI LUNAS oleh Super Admin & Admin EtalaseKu.\n\nDetail Akses Anda:\n• Order ID Resmi: ${orderId}\n• Email Terdaftar: ${destEmail}\n• Buka Ruang BelajarKu: ${window.location.origin}\n\nMasukkan Email atau Order ID Anda pada menu Member Area untuk mulai belajar.\n\nSalam hangat,\nSuper Admin & Tim EtalaseKu Hub`);
          window.open(`mailto:${destEmail}?subject=${mailSubject}&body=${mailBody}`, '_blank');
        }
      }
      localStorage.setItem('etalaseku_orders_data', JSON.stringify(STATE.orders));
    }

    // 2. Sync ke backend GAS jika aktif
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'verifyTransaction',
          token: STATE.adminToken,
          data: { orderId, status }
        })
      }).catch(err => console.warn('Sync verify order to GAS:', err));
    }

    showToast(`✅ Pesanan ${orderId} BERHASIL DIVERIFIKASI LUNAS!`, 'success', 3500);
    loadAdminPortalData();
    openReceiptSuccessModal(orderId);
  } catch (err) {
    showToast('Gagal verifikasi: ' + err.message, 'error');
  }
}

function adminLogout() {
  STATE.adminToken = null;
  localStorage.removeItem('etalaseku_admin_token');
  localStorage.removeItem('etalaseku_is_in_crm');
  localStorage.removeItem('etalaseku_admin_active_tab');
  closeAdminPortal();
  showToast('Anda telah keluar dari Portal Admin 🔒', 'logout');
}
window.adminLogout = adminLogout;

function backToWebsiteFromAdmin() {
  localStorage.setItem('etalaseku_is_in_crm', 'false');
  closeAdminPortal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.backToWebsiteFromAdmin = backToWebsiteFromAdmin;

// ============================================================================
// 9. AUTOMATED SERVER PAYMENT CHANNELS CONFIGURATION (CRM SETTINGS)
// ============================================================================
function renderAdminPaymentChannels() {
  const channels = STATE.paymentChannels || DEFAULT_PAYMENT_CHANNELS;
  const keys = ['qris', 'bca', 'mandiri', 'bni', 'gopay', 'ovo'];

  keys.forEach(k => {
    const c = (channels && channels[k]) || (DEFAULT_PAYMENT_CHANNELS && DEFAULT_PAYMENT_CHANNELS[k]) || {};
    const aktifEl = document.getElementById(`cfg-ch-aktif-${k}`);
    const rekEl = document.getElementById(`cfg-ch-rek-${k}`);
    const namaEl = document.getElementById(`cfg-ch-nama-${k}`);
    const qrEl = document.getElementById(`cfg-ch-qr-${k}`);
    const instEl = document.getElementById(`cfg-ch-inst-${k}`);

    if (aktifEl && c.aktif !== undefined) aktifEl.checked = !!c.aktif;
    if (rekEl && c.rekening !== undefined) rekEl.value = c.rekening;
    if (namaEl && c.atasNama !== undefined) namaEl.value = c.atasNama;
    if (qrEl && c.qrUrl !== undefined) qrEl.value = c.qrUrl;
    if (instEl && c.instruksi !== undefined) instEl.value = c.instruksi;
  });

  const qrisUrl = (channels && channels.qris && channels.qris.qrUrl) || (DEFAULT_PAYMENT_CHANNELS && DEFAULT_PAYMENT_CHANNELS.qris && DEFAULT_PAYMENT_CHANNELS.qris.qrUrl) || '';
  updateQrisLivePreview(qrisUrl);
}

function updateQrisLivePreview(url) {
  const img = document.getElementById('qris-admin-preview-img');
  if (img && url) {
    img.src = url;
    img.style.display = 'inline-block';
  }
}

async function handleQrisFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const base64 = await readFileAsBase64(file);
    const mimeType = file.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    const qrInput = document.getElementById('cfg-ch-qr-qris');
    if (qrInput) qrInput.value = dataUrl;
    
    updateQrisLivePreview(dataUrl);
    showToast('Gambar barcode QRIS berhasil dimuat! Klik "Simpan Konfigurasi Pembayaran Otomatis" untuk menyimpan perubahan.', 'info');
  } catch (err) {
    showToast('Gagal membaca berkas barcode QRIS: ' + err.message, 'error');
  }
}

async function savePaymentChannelsForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-channels');
  if (btn) {
    btn.innerHTML = 'Menyimpan ke Server... ⏳';
    btn.disabled = true;
  }

  const keys = ['qris', 'bca', 'mandiri', 'bni', 'gopay', 'ovo'];
  const newConfig = {};

  keys.forEach(k => {
    const existing = (STATE.paymentChannels && STATE.paymentChannels[k]) || DEFAULT_PAYMENT_CHANNELS[k] || {};
    const aktifEl = document.getElementById(`cfg-ch-aktif-${k}`);
    const rekEl = document.getElementById(`cfg-ch-rek-${k}`);
    const namaEl = document.getElementById(`cfg-ch-nama-${k}`);
    const qrEl = document.getElementById(`cfg-ch-qr-${k}`);
    const instEl = document.getElementById(`cfg-ch-inst-${k}`);

    newConfig[k] = {
      id: k,
      nama: existing.nama || k.toUpperCase(),
      label: existing.label || k.toUpperCase(),
      badge: existing.badge || (k === 'qris' ? 'Otomatis' : (['bca','mandiri','bni'].includes(k) ? 'Bank' : 'e-Wallet')),
      tipe: existing.tipe || (k === 'qris' ? 'qris' : (['bca','mandiri','bni'].includes(k) ? 'bank' : 'ewallet')),
      aktif: aktifEl ? aktifEl.checked : true,
      rekening: rekEl ? rekEl.value : existing.rekening,
      atasNama: namaEl ? namaEl.value : existing.atasNama,
      qrUrl: qrEl ? qrEl.value : (existing.qrUrl || ''),
      instruksi: instEl ? instEl.value : existing.instruksi
    };
  });

  // Simpan selalu ke State & LocalStorage
  STATE.paymentChannels = newConfig;
  localStorage.setItem('etalaseku_payment_channels', JSON.stringify(newConfig));
  renderCheckoutPaymentChannels();

  let gasSynced = false;
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    try {
      const res = await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'savePaymentChannels', token: STATE.adminToken, data: newConfig })
      });
      const json = await res.json();
      if (json && json.success) gasSynced = true;
    } catch (err) {
      console.warn('Gagal sync ke GAS:', err);
    }
  }

  if (btn) {
    btn.innerHTML = 'Simpan Konfigurasi Pembayaran Otomatis 💾';
    btn.disabled = false;
  }
  
  if (gasSynced) {
    showToast('Metode pembayaran otomatis berhasil disimpan ke Google Sheets & aktif di Checkout!', 'info');
  } else {
    showToast('Metode pembayaran berhasil disimpan dan langsung aktif di halaman Checkout website!', 'info');
  }
}

// ============================================================================
// ============================================================================
// 10. MULTI-ADMIN CREDENTIALS MANAGER & PASSWORD TRANSPARENCY
// ============================================================================
function renderAdminAccountTab() {
  const currentEmail = STATE.adminEmail || localStorage.getItem('etalaseku_admin_email') || 'admin@etalaseku.com';
  const currentRole = STATE.adminRole || localStorage.getItem('etalaseku_admin_role') || 'SUPER_ADMIN';

  // 1. Update Tampilan Card Akun Aktif
  const activeEmailInput = document.getElementById('active-admin-email-display');
  if (activeEmailInput) activeEmailInput.value = currentEmail;

  const currentBadge = document.getElementById('account-current-badge');
  if (currentBadge) {
    currentBadge.innerHTML = currentRole === 'ADMIN' ? '🛡️ ADMIN STAFF' : '👑 SUPER ADMIN';
    currentBadge.style.background = currentRole === 'ADMIN' ? '#E0F2FE' : '#FFE4E6';
    currentBadge.style.color = currentRole === 'ADMIN' ? '#0369A1' : '#BE123C';
  }

  // Cari pin akun yang sedang aktif
  let activePin = '123456';
  if (Array.isArray(STATE.adminAccounts)) {
    const currentAcc = STATE.adminAccounts.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
    if (currentAcc && currentAcc.pin) activePin = currentAcc.pin;
  }
  const activePinInput = document.getElementById('active-admin-pin-display');
  if (activePinInput) activePinInput.value = activePin;

  // 2. Render Tabel Seluruh Akun Super Admin & Admin
  const tbody = document.getElementById('multi-admin-table-body');
  const countBadge = document.getElementById('admin-account-count-badge');
  if (!tbody) return;

  if (!Array.isArray(STATE.adminAccounts) || STATE.adminAccounts.length === 0) {
    STATE.adminAccounts = [
      { id: 'ADM-01', email: 'daffafazdian50@gmail.com', role: 'SUPER_ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: true },
      { id: 'ADM-02', email: 'admin@etalaseku.com', role: 'ADMIN', pin: '123456', createdAt: '2026-10-28', isPrimary: false }
    ];
    localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
  }

  if (countBadge) {
    countBadge.textContent = `${STATE.adminAccounts.length} Akun Pengelola Terdaftar`;
  }

  tbody.innerHTML = STATE.adminAccounts.map((acc, idx) => {
    const isSuper = acc.role === 'SUPER_ADMIN';
    const roleBadge = isSuper
      ? '<span style="background:#FFE4E6; color:#BE123C; padding:3px 10px; border-radius:99px; font-weight:800; font-size:11.5px;">👑 Super Admin</span>'
      : '<span style="background:#E0F2FE; color:#0369A1; padding:3px 10px; border-radius:99px; font-weight:800; font-size:11.5px;">🛡️ Admin Staff</span>';

    return `
      <tr style="border-bottom:1px solid #F1F5F9;">
        <td style="padding:12px 10px; font-weight:700; color:#64748B;">${idx + 1}</td>
        <td style="padding:12px 10px;">
          <div style="font-weight:700; color:var(--deep-navy);">${acc.email}</div>
          <div style="font-size:10.5px; color:#94A3B8;">ID: ${acc.id || 'ADM-' + (idx + 1)}</div>
        </td>
        <td style="padding:12px 10px;">${roleBadge}</td>
        <td style="padding:12px 10px;">
          <div style="display:inline-flex; align-items:center; gap:6px;">
            <span id="pin-view-val-${idx}" class="admin-pin-view" data-real-pin="${acc.pin}">••••••</span>
            <button type="button" class="btn-icon-tiny" onclick="toggleRevealAdminPin(${idx})" title="Lihat/Sembunyikan Sandi Transparan">👁️</button>
            <button type="button" class="btn-icon-tiny" onclick="copyAdminPinToClipboard('${acc.pin}')" title="Salin Sandi">📋</button>
          </div>
        </td>
        <td style="padding:12px 10px; text-align:right;">
          <div style="display:inline-flex; gap:6px; justify-content:flex-end;">
            <button type="button" class="btn-secondary" onclick="toggleAdminRole(${idx})" style="padding:5px 10px; font-size:11.5px;" title="Ubah Peran Hak Akses">
              🔄 Peran
            </button>
            <button type="button" class="btn-secondary" onclick="deleteAdminAccount(${idx})" style="padding:5px 10px; font-size:11.5px; color:#EF4444; border-color:#FCA5A5;" title="Hapus Akun Pengelola">
              🗑️ Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 1. Transparansi Sandi Sesi Aktif
function toggleViewActivePin() {
  const pinInput = document.getElementById('active-admin-pin-display');
  const btn = document.getElementById('btn-toggle-active-pin');
  if (!pinInput) return;
  if (pinInput.type === 'password') {
    pinInput.type = 'text';
    if (btn) btn.innerHTML = '🙈';
    showToast('👁️ Sandi aktif ditampilkan transparan!', 'info', 2000);
  } else {
    pinInput.type = 'password';
    if (btn) btn.innerHTML = '👁️';
  }
}
window.toggleViewActivePin = toggleViewActivePin;

function copyActivePin() {
  const pinInput = document.getElementById('active-admin-pin-display');
  if (!pinInput || !pinInput.value) return;
  navigator.clipboard.writeText(pinInput.value).then(() => {
    showToast('📋 Sandi aktif berhasil disalin ke clipboard!', 'success', 2500);
  }).catch(() => {
    showToast('Sandi aktif: ' + pinInput.value, 'info', 3000);
  });
}
window.copyActivePin = copyActivePin;

function resetActivePin() {
  const currentEmail = STATE.adminEmail || 'admin@etalaseku.com';
  const acc = STATE.adminAccounts.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
  if (acc) {
    acc.pin = '123456';
    localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
    renderAdminAccountTab();
    showToast('🗑️ Sandi lama berhasil direset ke sandi awal!', 'success', 3000);
  }
}
window.resetActivePin = resetActivePin;

// 2. Simpan Sandi Baru untuk Akun Aktif
function saveActiveAdminNewPassword(e) {
  e.preventDefault();
  const newPin = (document.getElementById('active-new-pin-input').value || '').trim();
  const confirmPin = (document.getElementById('active-new-pin-confirm').value || '').trim();

  if (newPin.length < 4) {
    showToast('⚠️ Sandi baru minimal 4 karakter!', 'error', 3000);
    return;
  }
  if (newPin !== confirmPin) {
    showToast('⚠️ Konfirmasi sandi baru tidak cocok!', 'error', 3000);
    return;
  }

  const currentEmail = STATE.adminEmail || 'admin@etalaseku.com';
  let acc = STATE.adminAccounts.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
  if (!acc) {
    acc = { id: 'ADM-' + Date.now(), email: currentEmail, role: STATE.adminRole || 'SUPER_ADMIN', pin: newPin, createdAt: new Date().toISOString() };
    STATE.adminAccounts.push(acc);
  } else {
    acc.pin = newPin;
  }

  localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
  localStorage.setItem('etalaseku_admin_custom_pin', newPin);
  renderAdminAccountTab();

  document.getElementById('active-new-pin-input').value = '';
  document.getElementById('active-new-pin-confirm').value = '';

  showToast('✅ Sandi baru akun aktif berhasil disimpan dan transparan!', 'success', 3000);
}
window.saveActiveAdminNewPassword = saveActiveAdminNewPassword;

// 3. Tambah Akun Pengelola Baru (Email Google & Sandi Manual)
function handleAddNewAdminAccount(e) {
  e.preventDefault();
  const emailInput = document.getElementById('new-admin-email');
  const roleSelect = document.getElementById('new-admin-role');
  const pinInput = document.getElementById('new-admin-pin');

  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
  const role = roleSelect ? roleSelect.value : 'ADMIN';
  const pin = (pinInput ? pinInput.value : '').trim();

  if (!email || !email.includes('@')) {
    showToast('⚠️ Masukkan alamat Email Google yang valid!', 'error', 3000);
    return;
  }
  if (!pin || pin.length < 4) {
    showToast('⚠️ PIN / Sandi minimal 4 karakter!', 'error', 3000);
    return;
  }

  if (!Array.isArray(STATE.adminAccounts)) STATE.adminAccounts = [];

  const existingIdx = STATE.adminAccounts.findIndex(a => a.email.toLowerCase() === email);
  if (existingIdx >= 0) {
    STATE.adminAccounts[existingIdx].role = role;
    STATE.adminAccounts[existingIdx].pin = pin;
    showToast(`✅ Data akun ${email} berhasil diperbarui!`, 'success', 3000);
  } else {
    STATE.adminAccounts.push({
      id: 'ADM-' + (STATE.adminAccounts.length + 1),
      email: email,
      role: role,
      pin: pin,
      createdAt: new Date().toISOString().split('T')[0]
    });
    showToast(`🎉 Akun pengelola baru berhasil ditambahkan: ${email} (${role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Staff'})!`, 'success', 3500);
  }

  localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
  renderAdminAccountTab();

  if (emailInput) emailInput.value = '';
  if (pinInput) pinInput.value = '';
}
window.handleAddNewAdminAccount = handleAddNewAdminAccount;

// 4. Ubah Peran Hak Akses (Super Admin <-> Admin Staff)
function toggleAdminRole(index) {
  if (!STATE.adminAccounts || !STATE.adminAccounts[index]) return;
  const acc = STATE.adminAccounts[index];
  const newRole = acc.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';

  // Validasi: pastikan setidaknya ada 1 Super Admin di sistem
  if (acc.role === 'SUPER_ADMIN') {
    const superCount = STATE.adminAccounts.filter(a => a.role === 'SUPER_ADMIN').length;
    if (superCount <= 1) {
      showToast('⚠️ Tidak dapat mengubah peran! Minimal harus ada 1 Super Admin di sistem.', 'error', 3500);
      return;
    }
  }

  acc.role = newRole;
  if (acc.email.toLowerCase() === (STATE.adminEmail || '').toLowerCase()) {
    STATE.adminRole = newRole;
    localStorage.setItem('etalaseku_admin_role', newRole);
  }
  localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
  renderAdminAccountTab();
  showToast(`🔄 Peran ${acc.email} diubah menjadi: ${newRole === 'SUPER_ADMIN' ? '👑 Super Admin' : '🛡️ Admin Staff'}`, 'info', 3000);
}
window.toggleAdminRole = toggleAdminRole;

// 5. Hapus Akun Admin
function deleteAdminAccount(index) {
  if (!STATE.adminAccounts || !STATE.adminAccounts[index]) return;
  if (STATE.adminAccounts.length <= 1) {
    showToast('⚠️ Tidak dapat menghapus! Minimal harus ada 1 akun admin aktif di sistem.', 'error', 3500);
    return;
  }

  const acc = STATE.adminAccounts[index];
  if (acc.role === 'SUPER_ADMIN') {
    const superCount = STATE.adminAccounts.filter(a => a.role === 'SUPER_ADMIN').length;
    if (superCount <= 1) {
      showToast('⚠️ Tidak dapat menghapus! Minimal harus ada 1 Super Admin di sistem.', 'error', 3500);
      return;
    }
  }

  const deletedEmail = acc.email;
  STATE.adminAccounts.splice(index, 1);
  localStorage.setItem('etalaseku_admin_accounts', JSON.stringify(STATE.adminAccounts));
  renderAdminAccountTab();
  showToast(`🗑️ Akun pengelola ${deletedEmail} telah dihapus dari sistem.`, 'info', 3000);
}
window.deleteAdminAccount = deleteAdminAccount;

// 6. Toggle Reveal Sandi Transparan di Tabel
function toggleRevealAdminPin(index) {
  const el = document.getElementById(`pin-view-val-${index}`);
  if (!el) return;
  const realPin = el.getAttribute('data-real-pin');
  if (el.textContent === '••••••') {
    el.textContent = realPin;
    el.style.color = '#BE123C';
    el.style.fontWeight = '800';
  } else {
    el.textContent = '••••••';
    el.style.color = 'var(--deep-navy)';
    el.style.fontWeight = '700';
  }
}
window.toggleRevealAdminPin = toggleRevealAdminPin;

function copyAdminPinToClipboard(pin) {
  navigator.clipboard.writeText(pin).then(() => {
    showToast(`📋 Sandi disalin: ${pin}`, 'success', 2000);
  }).catch(() => {
    showToast('Sandi: ' + pin, 'info', 2500);
  });
}
window.copyAdminPinToClipboard = copyAdminPinToClipboard;

// 7. Helper Toggle Input Password Visibility
function toggleInputPasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.innerHTML = '🙈';
  } else {
    input.type = 'password';
    if (btn) btn.innerHTML = '👁️';
  }
}
window.toggleInputPasswordVisibility = toggleInputPasswordVisibility;

// ============================================================================
// 11. STUDENT BILLING & INSTALLMENT CRM DASHBOARD (gas-tagihan-pembayaran)
// ============================================================================
function renderStudentBillingTab(bills) {
  const tbody = document.getElementById('billing-admin-tbody');
  if (!tbody) return;

  const badgeBills = document.getElementById('badge-bills-count');
  if (badgeBills) badgeBills.textContent = bills.filter(b => b.Status !== 'Lunas').length;

  if (!bills || !bills.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px;">Belum ada data tagihan/cicilan siswa. Klik "+ Terbitkan Tagihan Baru".</td></tr>`;
    return;
  }

  tbody.innerHTML = bills.map(b => {
    const isLunas = b.Status === 'Lunas';
    const isTerlambat = b.Status === 'Terlambat';
    const badgeClass = isLunas ? 'green' : (isTerlambat ? 'red' : 'yellow');
    const namaSiswa = b.Nama_Siswa || b.Subjek || 'Siswa';
    const noWa = b.No_WhatsApp || b.NoWhatsApp || '';
    const produk = b.Nama_Produk || b.Kategori || 'Modul Kursus';
    const nominal = Number(b.Subtotal || b.Total || 0);
    const jatuhTempo = b.Jatuh_Tempo || b.JatuhTempo || '-';
    const angsuran = b.Keterangan || 'Cicilan Bertahap';

    return `
      <tr>
        <td style="font-weight:700;">${b.ID_Tagihan || b.ID_Transaksi}</td>
        <td><strong>${namaSiswa}</strong><br><small style="color:#64748B;">${noWa}</small></td>
        <td>${produk}</td>
        <td><span class="pill-badge purple">${angsuran}</span></td>
        <td style="font-weight:800; color:var(--deep-navy);">Rp ${nominal.toLocaleString('id-ID')}</td>
        <td style="font-size:12px; color:#64748B;">${jatuhTempo}</td>
        <td><span class="pill-badge ${badgeClass}">${b.Status}</span></td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${!isLunas ? `
              <button class="btn-secondary" style="padding:4px 8px; font-size:11px; background:#25D366; color:white; border-color:#25D366;" onclick="sendStudentBillReminder('${noWa}', '${namaSiswa}', '${produk}', ${nominal}, '${jatuhTempo}')">
                🔔 Ingatkan WA
              </button>
              <button class="shimmer-btn" style="padding:4px 8px; font-size:11px;" onclick="markBillPaidAdmin('${b.ID_Tagihan || b.ID_Transaksi}')">
                ✓ Lunas
              </button>
            ` : `<span style="color:#10B981; font-weight:700; font-size:12px;">✓ Lunas</span>`}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openCreateBillModal() {
  document.getElementById('bill-form-name').value = '';
  document.getElementById('bill-form-phone').value = '';
  document.getElementById('bill-form-title').value = '';
  document.getElementById('bill-form-amount').value = '';
  document.getElementById('bill-form-due').value = '';
  document.getElementById('bill-form-notes').value = 'Cicilan Bertahap Modul';
  document.getElementById('modal-create-bill').classList.add('active');
}

async function handleCreateBillForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-bill');
  if (btn) {
    btn.innerHTML = 'Menerbitkan Tagihan... ⏳';
    btn.disabled = true;
  }

  const payload = {
    subjek: document.getElementById('bill-form-name').value,
    noWa: document.getElementById('bill-form-phone').value,
    kategori: document.getElementById('bill-form-title').value,
    total: Number(document.getElementById('bill-form-amount').value || 0),
    jatuhTempo: document.getElementById('bill-form-due').value,
    keterangan: document.getElementById('bill-form-notes').value || 'Cicilan Bertahap'
  };

  try {
    if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
      await fetch(APP_CONFIG.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'issueStudentBill', token: STATE.adminToken, data: payload })
      });
    }

    const newBill = {
      ID_Tagihan: 'TGH-' + Date.now().toString().slice(-6),
      Nama_Siswa: payload.subjek,
      No_WhatsApp: payload.noWa,
      Nama_Produk: payload.kategori,
      Subtotal: payload.total,
      Jatuh_Tempo: payload.jatuhTempo,
      Status: 'Belum Bayar',
      Keterangan: payload.keterangan
    };

    if (!STATE.bills) STATE.bills = [];
    STATE.bills.unshift(newBill);
    if (ADMIN_STATE.data) {
      if (!ADMIN_STATE.data.bills) ADMIN_STATE.data.bills = [];
      ADMIN_STATE.data.bills.unshift(newBill);
    }

    renderStudentBillingTab(STATE.bills);
    closeAllModals();
    showToast('Tagihan cicilan siswa berhasil diterbitkan!', 'info');
  } catch (err) {
    showToast('Gagal menerbitkan tagihan: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.innerHTML = 'Terbitkan Tagihan Sekarang 🚀';
      btn.disabled = false;
    }
  }
}

function sendStudentBillReminder(noWa, namaSiswa, namaTagihan, nominal, jatuhTempo) {
  const cleanPhone = (noWa || '').replace(/[^0-9]/g, '');
  const pesan = `Halo kak *${namaSiswa}*! 😊\n\nMengingatkan kembali untuk tagihan cicilan *${namaTagihan}* sebesar *Rp ${Number(nominal).toLocaleString('id-ID')}* dengan jatuh tempo *${jatuhTempo || 'segera'}*.\n\nSilakan cek rincian & unggah bukti transfer melalui menu *Cek Tagihan* di website EtalaseKu Hub.\n\nTerima kasih dan sukses selalu belajarnya! 🚀`;

  // Send background to GAS if connected
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'sendInstallmentReminder',
        token: STATE.adminToken,
        data: { noWa: cleanPhone, namaSiswa, namaTagihan, nominal, jatuhTempo }
      })
    }).catch(e => console.warn(e));
  }

  // Open direct WhatsApp
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(pesan)}`, '_blank');
}

async function markBillPaidAdmin(billId) {
  // Safe bill update without browser confirm

  if (STATE.bills) {
    const b = STATE.bills.find(item => (item.ID_Tagihan === billId || item.ID_Transaksi === billId));
    if (b) b.Status = 'Lunas';
  }
  if (ADMIN_STATE.data && ADMIN_STATE.data.bills) {
    const b = ADMIN_STATE.data.bills.find(item => (item.ID_Tagihan === billId || item.ID_Transaksi === billId));
    if (b) b.Status = 'Lunas';
  }

  renderStudentBillingTab(STATE.bills || []);
  showToast(`Tagihan ${billId} berhasil ditandai Lunas!`, 'info');
}

// ============================================================================
// 12. UNIFIED AUTHENTICATION, REDEEM KODE AKSES & MEMBER DASHBOARD
// ============================================================================

const DEFAULT_REMEMBERED_EMAILS = ['daffafazdian50@gmail.com'];

function getRememberedEmails() {
  try {
    const raw = localStorage.getItem('etalaseku_recent_emails');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...DEFAULT_REMEMBERED_EMAILS];
}

function saveRememberedEmail(email) {
  if (!email || !email.includes('@')) return;
  const list = getRememberedEmails();
  if (!list.includes(email)) {
    list.unshift(email);
  }
  localStorage.setItem('etalaseku_recent_emails', JSON.stringify(list.slice(0, 5)));
  renderRecentDeviceChips();
}

function renderRecentDeviceChips() {
  const container = document.getElementById('auth-chips-container');
  const box = document.getElementById('auth-recent-devices-box');
  if (!container) return;

  const list = getRememberedEmails();
  if (list.length === 0) {
    if (box) box.style.display = 'none';
    return;
  }
  if (box) box.style.display = 'block';

  container.innerHTML = list.map(em => `
    <span class="auth-device-chip" onclick="fillMemberLoginEmail('${em}')">
      <span>🕒</span>
      <span>${em}</span>
      <span class="chip-delete-btn" onclick="event.stopPropagation(); removeDeviceEmail('${em}')" title="Hapus email ini">✕</span>
    </span>
  `).join('');
}

function fillMemberLoginEmail(email) {
  const input = document.getElementById('member-login-email-input');
  if (input) input.value = email;
}

function removeDeviceEmail(email) {
  const list = getRememberedEmails().filter(e => e !== email);
  localStorage.setItem('etalaseku_recent_emails', JSON.stringify(list));
  renderRecentDeviceChips();
}

function clearDeviceHistory() {
  localStorage.setItem('etalaseku_recent_emails', JSON.stringify([]));
  renderRecentDeviceChips();
}

function openUnifiedAuthModal(tab = 'member') {
  closeAllModals();
  if (tab === 'admin') {
    openAdminModal();
  } else {
    openMemberLoginModal();
  }
}

function openRedeemModal() {
  closeAllModals();
  const modal = document.getElementById('modal-redeem-code');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  } else {
    switchAuthTab('member');
    switchMemberSubView('redeem');
    renderRecentDeviceChips();
    const authModal = document.getElementById('modal-unified-auth');
    if (authModal) {
      authModal.classList.add('active');
      authModal.style.display = 'flex';
    }
  }
}

function handleRedeemAccessCodeForm(e) {
  if (e) e.preventDefault();
  const codeInput = document.getElementById('redeem-input-code');
  const emailInput = document.getElementById('redeem-input-email');

  let code = (codeInput ? codeInput.value : '').trim();
  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();

  if (!code) {
    showToast('Silakan masukkan Kode Akses!', 'info');
    return;
  }
  if (!email || !email.includes('@')) {
    showToast('Silakan masukkan Email Google yang valid!', 'info');
    return;
  }

  if (!code.toUpperCase().startsWith('ORD-') && !code.toUpperCase().startsWith('DEMO')) {
    code = 'ORD-' + code;
  }

  // Cek status Order ID di daftar pesanan
  const orders = getMergedOrdersList();
  const matchedOrder = orders.find(o => 
    (o.ID_Order === code || o.orderId === code) || 
    ((o.Email || o.email || '').toLowerCase() === email && (o.Status_Bayar === 'Lunas' || o.Status === 'Lunas'))
  );

  if (matchedOrder) {
    if (matchedOrder.Status_Bayar !== 'Lunas' && matchedOrder.Status !== 'Lunas' && matchedOrder.status !== 'Lunas') {
      showToast('⏳ Order ID / Kode ini masih Menunggu Verifikasi Super Admin & Admin di CRM. Mohon tunggu proses verifikasi lunas!', 'warning', 5000);
      return;
    }
  }

  // Simpan sesi dan riwayat perangkat
  localStorage.setItem('etalaseku_member_order_id', code);
  localStorage.setItem('etalaseku_member_email', email);
  saveRememberedEmail(email);

  // Tentukan produk yang di-redeem secara akurat dari database pesanan atau katalog
  let targetProductName = '';
  let targetProductId = '';

  if (matchedOrder) {
    targetProductName = matchedOrder.productName || matchedOrder.Nama_Produk || '';
    targetProductId = matchedOrder.productId || matchedOrder.ID_Produk || '';
  }

  // Jika belum ada pesanan tercatat, buatkan pesanan lunas resmi agar langsung terhubung ke modul yang tepat
  if (!targetProductName) {
    // Cari produk aktif di katalog atau default ke produk yang sesuai
    const catalogProds = (STATE && Array.isArray(STATE.products) && STATE.products.length > 0) ? STATE.products : [];
    const activeProd = catalogProds.find(p => p.Status === 'Publish') || catalogProds[0] || {
      ID_Produk: 'PRD-976905',
      Nama_Produk: 'Kumpulan PRD'
    };
    targetProductName = activeProd.Nama_Produk;
    targetProductId = activeProd.ID_Produk;

    // Catat order lunas baru ke daftar orders
    const newOrder = {
      orderId: code,
      ID_Order: code,
      productId: targetProductId,
      productName: targetProductName,
      nama: email.split('@')[0],
      Nama_Pembeli: email.split('@')[0],
      email: email,
      Email: email,
      total: activeProd.Harga_Promo || 49000,
      Total_Bayar: activeProd.Harga_Promo || 49000,
      Status_Bayar: 'Lunas',
      Status: 'Lunas',
      status: 'Lunas',
      Tanggal_Waktu: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    const currentOrders = getMergedOrdersList();
    currentOrders.unshift(newOrder);
    STATE.orders = currentOrders;
    try {
      localStorage.setItem('etalaseku_orders_data', JSON.stringify(currentOrders));
    } catch(e) {}
  }

  // Simpan produk terdaftar untuk siswa ini agar Ruang BelajarKu hanya menampilkan 1 modul produk ini!
  localStorage.setItem('etalaseku_member_enrolled_product_id', targetProductId);
  localStorage.setItem('etalaseku_member_enrolled_product_name', targetProductName);

  // Update teks pada Modal Berhasil (Sesuai Foto No. 2) dengan nama produk yang benar
  const successTitleEl = document.getElementById('redeem-success-product-title');
  if (successTitleEl) {
    successTitleEl.textContent = `Produk "${targetProductName}" sudah Anda miliki.`;
  }

  // Tampilkan Modal Berhasil (Sesuai Foto No. 4)
  closeAllModals();
  const modalSuccess = document.getElementById('modal-redeem-success');
  if (modalSuccess) {
    modalSuccess.classList.add('active');
  } else {
    proceedToClassroomPortalFromSuccess();
  }
}

function proceedToClassroomPortalFromSuccess() {
  closeAllModals();
  const code = localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261028-211630-4012';
  const email = localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';
  updateMemberClassroomNavbar(code, email);
  showMemberAreaDashboard(code, email);
}

function openClassroomLoginModal() {
  openUnifiedAuthModal('member');
}

function openClassroomDashboardOrLogin() {
  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');
  if (savedOrderId || savedEmail) {
    showMemberAreaDashboard(savedOrderId, savedEmail);
  } else {
    openUnifiedAuthModal('member');
  }
}

function switchAuthTab(type) {
  const btnMember = document.getElementById('tab-btn-auth-member');
  const btnAdmin = document.getElementById('tab-btn-auth-admin');
  const viewMemberEmail = document.getElementById('auth-view-member-email');
  const viewMemberRedeem = document.getElementById('auth-view-member-redeem');
  const viewAdminPin = document.getElementById('auth-view-admin-pin');

  if (type === 'admin') {
    if (btnMember) btnMember.classList.remove('active');
    if (btnAdmin) btnAdmin.classList.add('active');
    if (viewMemberEmail) viewMemberEmail.style.display = 'none';
    if (viewMemberRedeem) viewMemberRedeem.style.display = 'none';
    if (viewAdminPin) viewAdminPin.style.display = 'block';
  } else {
    if (btnMember) btnMember.classList.add('active');
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (viewAdminPin) viewAdminPin.style.display = 'none';
    if (viewMemberRedeem && viewMemberRedeem.style.display === 'block') {
      // keep redeem view
    } else {
      if (viewMemberEmail) viewMemberEmail.style.display = 'block';
    }
  }
}

function switchMemberSubView(sub) {
  const viewEmail = document.getElementById('auth-view-member-email');
  const viewRedeem = document.getElementById('auth-view-member-redeem');
  if (sub === 'redeem') {
    if (viewEmail) viewEmail.style.display = 'none';
    if (viewRedeem) viewRedeem.style.display = 'block';
  } else {
    if (viewEmail) viewEmail.style.display = 'block';
    if (viewRedeem) viewRedeem.style.display = 'none';
  }
}

function handleMemberEmailLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('member-login-email-input');
  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    showToast('Silakan masukkan alamat Email Google yang valid!', 'info');
    return;
  }

  // Cek database pesanan lokal dan backend
  const orders = getMergedOrdersList();
  const matchingOrders = orders.filter(o => 
    (o.Email || o.email || '').toLowerCase() === email || 
    (o.Nama_Pembeli || o.nama || '').toLowerCase() === email
  );

  // Jika belum ada riwayat order sama sekali
  if (matchingOrders.length === 0) {
    showToast('❌ Email Anda belum terdaftar dalam sistem pemesanan. Silakan lakukan checkout terlebih dahulu!', 'error', 4500);
    return;
  }

  // Cek apakah ada order yang sudah LUNAS diverifikasi Super Admin & Admin
  const verifiedOrder = matchingOrders.find(o => (o.Status_Bayar === 'Lunas' || o.Status === 'Lunas' || o.status === 'Lunas'));
  
  if (!verifiedOrder) {
    // Masih menunggu verifikasi Super Admin & Admin!
    showToast('⏳ Akses Belum Dibuka: Pesanan Anda sedang Menunggu Verifikasi oleh Super Admin & Admin di sistem CRM. Akses materi belajar akan aktif otomatis setelah bukti transfer diverifikasi LUNAS!', 'warning', 6000);
    return;
  }

  // SUDAH LUNAS: Berikan akses instan ke 1 modul produk yang dibeli
  const orderId = verifiedOrder.ID_Order || verifiedOrder.orderId;
  const prodId = verifiedOrder.productId || verifiedOrder.ID_Produk || '';
  const prodName = verifiedOrder.productName || verifiedOrder.Nama_Produk || '';

  saveRememberedEmail(email);
  localStorage.setItem('etalaseku_member_email', email);
  localStorage.setItem('etalaseku_member_order_id', orderId);
  if (prodId) localStorage.setItem('etalaseku_member_enrolled_product_id', prodId);
  if (prodName) localStorage.setItem('etalaseku_member_enrolled_product_name', prodName);

  closeAllModals();
  showToast('🎉 Selamat Datang! Akses Ruang BelajarKu Lunas.', 'success', 3000);
  updateMemberClassroomNavbar(orderId, email);
  openClassroomDashboard(orderId, email);
}

function handleRedeemAccessCode(e) {
  handleRedeemAccessCodeForm(e);
}

function handleAdminAuthLogin(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('auth-admin-email-input');
  const email = emailInput && emailInput.value ? emailInput.value.trim() : (STATE.adminEmail || localStorage.getItem('etalaseku_admin_email') || 'admin@etalaseku.com');
  STATE.adminEmail = email;
  localStorage.setItem('etalaseku_admin_email', email);

  const pinInput = document.getElementById('auth-admin-pin-input');
  const pin = pinInput ? pinInput.value : '';
  const adminPinField = document.getElementById('admin-pin-input');
  if (adminPinField) adminPinField.value = pin;
  handleAdminLogin(e);
}

function handleClassroomLogin(e) {
  e.preventDefault();
  const inputEl = document.getElementById('classroom-login-input');
  let orderId = (inputEl ? inputEl.value : '').trim();
  if (!orderId) orderId = 'ORD-20261028-211630-4012';
  const email = localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';
  localStorage.setItem('etalaseku_member_order_id', orderId);
  closeAllModals();
  updateMemberClassroomNavbar(orderId, email);
  openClassroomDashboard(orderId, email);
}

function openClassroomPortalDemo() {
  const demoOrderId = 'ORD-20261028-DEMO';
  const demoEmail = 'demo.siswa@etalaseku.com';
  localStorage.setItem('etalaseku_member_order_id', demoOrderId);
  localStorage.setItem('etalaseku_member_email', demoEmail);
  closeAllModals();
  updateMemberClassroomNavbar(demoOrderId, demoEmail);
  openClassroomDashboard(demoOrderId, demoEmail);
}

function openClassroomDashboard(orderId, email) {
  if (typeof renderMainMemberDashboardModules === 'function') renderMainMemberDashboardModules();
  if (typeof renderMainMemberDashboardModules === 'function') renderMainMemberDashboardModules();
  if (typeof closeClassroomDetailView === 'function') closeClassroomDetailView();
  closeAllModals();
  const activeId = orderId || localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261102-214204-9617';
  const activeEmail = email || localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';

  // Sinkronkan data profil member (Foto 2 & 3)
  const profile = typeof getMemberProfile === 'function' ? getMemberProfile() : { name: 'Daffa', whatsapp: '087894602627', email: activeEmail };

  const memberNameEl = document.getElementById('member-display-name');
  if (memberNameEl) memberNameEl.textContent = profile.name || 'Daffa';

  const widgetNameEl = document.getElementById('widget-profile-name');
  if (widgetNameEl) widgetNameEl.textContent = profile.name || 'Daffa';

  const widgetEmailEl = document.getElementById('widget-profile-email');
  if (widgetEmailEl) widgetEmailEl.textContent = profile.email || activeEmail;

  const widgetWaEl = document.getElementById('widget-profile-whatsapp');
  if (widgetWaEl) widgetWaEl.textContent = profile.whatsapp || '087894602627';

  const widgetAvatarEl = document.getElementById('widget-avatar-initial');
  if (widgetAvatarEl) widgetAvatarEl.textContent = (profile.name || 'Daffa').charAt(0).toUpperCase();

  // Perbarui teks Order ID & Email di dashboard siswa
  const activeOrderEl = document.getElementById('cls-active-order-id');
  if (activeOrderEl) activeOrderEl.textContent = activeId;

  const activeEmailEl = document.getElementById('cls-active-student-email');
  if (activeEmailEl) activeEmailEl.textContent = activeEmail;

  const greetingEmailEl = document.getElementById('cls-student-greeting-email');
  if (greetingEmailEl) greetingEmailEl.textContent = activeEmail;

  const greetingIdEl = document.getElementById('cls-student-greeting-id');
  if (greetingIdEl) greetingIdEl.textContent = activeId;

  // Muat ulang modul terbaru dari penyimpanan agar modul yang dihapus tidak pernah muncul lagi
  STATE.modules = loadStoredClassroomModules();

  // Render modul ke dalam kartu dashboard
  renderClassroomPortalModules('', 'ALL');

  // Buka Beranda Member Area (Foto 3) sebagai tampilan default
  if (typeof switchMemberPortalView === 'function') {
    switchMemberPortalView('home');
  }

  // Tampilkan Halaman Dashboard Khusus Member Classroom
  const portal = document.getElementById('classroom-dashboard-portal');
  if (portal) portal.classList.add('active');
  localStorage.setItem('etalaseku_is_in_classroom', 'true');

  // Pastikan navigasi di navbar utama halaman dashboard aktif
  updateMemberClassroomNavbar(activeId, activeEmail);
}

function closeClassroomDashboard() {
  const portal = document.getElementById('classroom-dashboard-portal');
  if (portal) portal.classList.remove('active');
  localStorage.removeItem('etalaseku_is_in_classroom');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleClassroomLogout() {
  // 1. Bersihkan seluruh sesi member
  localStorage.removeItem('etalaseku_member_order_id');
  localStorage.removeItem('etalaseku_member_email');
  localStorage.removeItem('etalaseku_member_name');
  localStorage.removeItem('etalaseku_member_profile');
  localStorage.removeItem('nexstore_member_profile');
  localStorage.removeItem('nexstore_profile_completed');
  localStorage.removeItem('etalaseku_is_in_classroom');
  localStorage.removeItem('etalaseku_member_enrolled_product_id');
  localStorage.removeItem('etalaseku_member_enrolled_product_name');

  // 2. Sembunyikan dashboard member & VIP welcome card
  if (typeof hideMemberAreaDashboard === 'function') hideMemberAreaDashboard();
  if (typeof checkAndRenderVipWelcomeCard === 'function') checkAndRenderVipWelcomeCard();
  const vipCard = document.getElementById('vip-member-welcome-card');
  if (vipCard) vipCard.style.display = 'none';

  // 3. Tutup classroom & bersihkan modals
  if (typeof closeClassroomDashboard === 'function') closeClassroomDashboard();
  closeAllModals();

  // 4. Update navbar & hero buttons ke mode pengunjung publik
  if (typeof updateMemberClassroomNavbar === 'function') updateMemberClassroomNavbar(null, null);
  if (typeof updateHeroCtaButtons === 'function') updateHeroCtaButtons();

  // 5. Scroll ke atas
  window.scrollTo({ top: 0, behavior: 'smooth' });

  showToast('Anda telah keluar dari sesi member 👋', 'logout');
}

function updateMemberClassroomNavbar(orderId, email) {
  const navItem = document.getElementById('nav-item-member-classroom');
  const navPill = document.getElementById('member-classroom-nav-pill');
  const navLoginBtn = document.getElementById('nav-btn-member-login');
  const navRedeemBtn = document.getElementById('nav-btn-redeem');
  const badgeText = document.getElementById('top-member-order-badge');
  const heroBtn = document.getElementById('hero-btn-classroom');

  const displayUser = email || orderId;

  if (displayUser) {
    if (navItem) navItem.style.display = 'inline-block';
    if (navPill) navPill.style.display = 'flex';
    if (navLoginBtn) navLoginBtn.style.display = 'none';
    if (navRedeemBtn) navRedeemBtn.style.display = 'none';
    
    if (badgeText) {
      badgeText.textContent = displayUser.length > 20 ? (displayUser.slice(0, 18) + '...') : displayUser;
    }

    if (heroBtn) {
      const shortUser = email ? email.split('@')[0] : (orderId ? orderId.slice(-6) : 'Siswa');
      heroBtn.innerHTML = `🎓 Buka Ruang Belajar (${shortUser}) →`;
      heroBtn.className = 'shimmer-btn btn-primary';
      heroBtn.style.background = 'linear-gradient(135deg, #FF2E63 0%, #0F172A 100%)';
      heroBtn.style.color = '#FFFFFF';
    }
  } else {
    if (navItem) navItem.style.display = 'none';
    if (navPill) navPill.style.display = 'none';
    if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
    if (navRedeemBtn) navRedeemBtn.style.display = 'inline-block';

    if (heroBtn) {
      heroBtn.innerHTML = 'Akses Member Area 🔑';
      heroBtn.className = 'btn-secondary';
      heroBtn.style.background = '';
      heroBtn.style.color = '';
    }
  }
}

// ============================================================================
// STUDENT ENROLLMENT & SINGLE-MODULE ACCESS FILTER ENGINE (FOTO 1 - 4 REFERENCE)
// Siswa hanya boleh melihat modul produk yang telah dibeli / di-redeem secara sah!
// 1 produk = 1 modul di Ruang BelajarKu (tidak menampilkan modul produk lain).
// ============================================================================
function filterModulesForCurrentStudent(allModules, orderId, email) {
  if (!Array.isArray(allModules) || allModules.length === 0) return [];

  const orders = typeof getMergedOrdersList === 'function' ? getMergedOrdersList() : [];
  const cleanId = String(orderId || '').trim().toLowerCase();
  const cleanEmail = String(email || '').trim().toLowerCase();

  // 1. Kumpulkan daftar pesanan yang cocok untuk siswa ini
  let studentOrders = [];
  if (cleanId) {
    studentOrders = orders.filter(o => {
      const oId = String(o.ID_Order || o.orderId || '').toLowerCase().trim();
      return oId === cleanId;
    });
  }

  // Jika tidak ditemukan via orderId atau siswa login via email, cari via email dengan status Lunas
  if (studentOrders.length === 0 && cleanEmail) {
    studentOrders = orders.filter(o => {
      const oEmail = String(o.Email || o.email || '').toLowerCase().trim();
      const oStatus = String(o.Status_Bayar || o.Status || o.status || '').toLowerCase().trim();
      return oEmail === cleanEmail && (oStatus === 'lunas' || oStatus === 'paid');
    });
  }

  // 2. Kumpulkan ID Produk dan Nama Produk yang berhak diakses siswa
  const purchasedPIds = [];
  const purchasedPNames = [];

  studentOrders.forEach(o => {
    const pId = o.productId || o.ID_Produk;
    const pName = o.productName || o.Nama_Produk;
    if (pId) purchasedPIds.push(String(pId).toLowerCase().trim());
    if (pName) purchasedPNames.push(String(pName).toLowerCase().trim());
  });

  const storedPId = localStorage.getItem('etalaseku_member_enrolled_product_id');
  const storedPName = localStorage.getItem('etalaseku_member_enrolled_product_name');
  if (storedPId) purchasedPIds.push(storedPId.toLowerCase().trim());
  if (storedPName) purchasedPNames.push(storedPName.toLowerCase().trim());

  // Jika belum ada pesanan sama sekali yang cocok, default ke 1 modul saja agar tidak menampilkan 2 modul
  if (purchasedPIds.length === 0 && purchasedPNames.length === 0) {
    return allModules.slice(0, 1);
  }

  // 3. Filter allModules: Hanya kembalikan modul yang cocok dengan produk yang dibeli
  const filtered = allModules.filter(m => {
    const mIdProduk = String(m.ID_Produk || '').toLowerCase().trim();
    const mTitle = String(m.Judul_Modul || '').toLowerCase().trim();
    const mDesc = String(m.Deskripsi || '').toLowerCase().trim();

    // Cocok langsung ID Produk
    if (mIdProduk && purchasedPIds.includes(mIdProduk)) return true;

    // Cocokkan Nama / Kata Kunci Produk
    for (const pName of purchasedPNames) {
      if (!pName) continue;
      const cleanP = pName.replace(/[\(\)\[\]\-]/g, ' ').trim();
      const pWords = cleanP.split(/\s+/).filter(w => w.length >= 3);

      if (mTitle.includes(cleanP) || cleanP.includes(mTitle)) return true;

      // Cek kata kunci spesifik
      if (cleanP.includes('prd') && mTitle.includes('prd')) return true;
      if (cleanP.includes('social influence') && mTitle.includes('social influence')) return true;
      if (cleanP.includes('gas pro') && (mTitle.includes('gas pro') || mTitle.includes('metode 3') || mTitle.includes('gas'))) return true;
      if (cleanP.includes('automation') && (mTitle.includes('automation') || mTitle.includes('bootcamp'))) return true;
      if (cleanP.includes('notion') && (mTitle.includes('notion') || mTitle.includes('agency'))) return true;

      // Pencocokan multi kata
      if (pWords.length >= 2) {
        const matches = pWords.filter(w => mTitle.includes(w) || mDesc.includes(w)).length;
        if (matches >= 2) return true;
      }
    }

    return false;
  });

  // Jika ada modul yang cocok, kembalikan modul yang cocok
  if (filtered.length > 0) {
    return filtered;
  }

  // Fallback pengaman: HANYA tampilkan 1 modul pertama yang paling relevan (JANGAN TAMPILKAN 2 MODUL)
  return allModules.slice(0, 1);
}
window.filterModulesForCurrentStudent = filterModulesForCurrentStudent;

function renderClassroomPortalModules(query, filterTag) {
  const container = document.getElementById('cls-portal-modules-list');
  if (!container) return;

  const activeOrderId = localStorage.getItem('etalaseku_member_order_id') || '';
  const activeEmail = (localStorage.getItem('etalaseku_member_email') || '').toLowerCase();

  // Ambil semua modul, lalu filter KHUSUS untuk produk yang dibeli/dimiliki siswa saat ini!
  // Siswa hanya akan melihat 1 modul yang dibeli (tidak ada modul lain yang muncul)!
  let allModules = Array.isArray(STATE.modules) ? STATE.modules : loadStoredClassroomModules();
  let modules = filterModulesForCurrentStudent(allModules, activeOrderId, activeEmail);

  if (query && query.trim()) {
    const q = query.toLowerCase();
    modules = modules.filter(m => 
      (m.Judul_Modul && m.Judul_Modul.toLowerCase().includes(q)) ||
      (m.Deskripsi && m.Deskripsi.toLowerCase().includes(q)) ||
      (m.Tipe_Konten && m.Tipe_Konten.toLowerCase().includes(q)) ||
      (m.Kategori && m.Kategori.toLowerCase().includes(q)) ||
      (m.Tipe_Badge && m.Tipe_Badge.toLowerCase().includes(q))
    );
  }

  if (filterTag && filterTag !== 'ALL') {
    const t = filterTag.toLowerCase();
    modules = modules.filter(m => 
      (m.Tipe_Badge && m.Tipe_Badge.toLowerCase() === t) ||
      (m.Kategori && m.Kategori.toLowerCase() === t) ||
      (m.Tipe_Konten && m.Tipe_Konten.toLowerCase().includes(t))
    );
  }

  const statCount = document.getElementById('cls-stat-modules-count');
  if (statCount) statCount.textContent = `${modules.length} Modul`;

  if (modules.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#FFFFFF; border:1.5px dashed #CBD5E1; border-radius:20px; color:#64748B;">
        <div style="font-size:36px; margin-bottom:10px;">🔍</div>
        <p style="font-weight:800; font-size:16px; margin:0 0 6px; color:#0F172A;">Tidak ada modul atau kelas yang cocok.</p>
        <p style="font-size:13px; margin:0;">Coba gunakan kata kunci pencarian lain atau pilih filter "Semua".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = modules.map((m, idx) => {
    const tipeBadge = m.Tipe_Badge || (m.Kategori ? m.Kategori.toUpperCase() : 'KELAS');
    const badgeTypeClass = (tipeBadge === 'DOKUMEN' ? 'type-dokumen' : (tipeBadge === 'APLIKASI' ? 'type-aplikasi' : 'type-kelas'));
    const kategori = m.Kategori || (tipeBadge === 'DOKUMEN' ? 'Dokumen' : (tipeBadge === 'APLIKASI' ? 'Aplikasi' : 'Kelas'));
    const catPillClass = (kategori.toLowerCase() === 'dokumen' ? 'cat-dokumen' : (kategori.toLowerCase() === 'aplikasi' ? 'cat-aplikasi' : ''));
    
    const bannerUrl = m.Thumbnail_URL || m.Foto_URL || './assets/modules/thumb-metode3.jpg';
    const isDoc = tipeBadge === 'DOKUMEN' || tipeBadge === 'APLIKASI';
    const btnText = m.Button_Text || (isDoc ? '📂 Akses Produk' : '▶ Buka Ruang Belajar');
    const url = m.URL_Konten || 'https://drive.google.com';

    let metaText = '';
    if (m.Episode && m.Materi_Count) {
      metaText = `<span>🎬 ${m.Episode} episode</span> <span>•</span> <span>📚 ${m.Materi_Count} materi</span>`;
    } else if (m.Materi_Count) {
      metaText = `<span>📚 ${m.Materi_Count} materi</span>`;
    } else if (m.Durasi_Menit) {
      metaText = `<span>⏱️ ${m.Durasi_Menit} Menit</span>`;
    } else {
      metaText = `<span>🎬 Full Akses</span> <span>•</span> <span>📚 Materi Lengkap</span>`;
    }

    return `
      <div class="rb-card">
        <div class="rb-thumb-wrap" onclick="${isDoc ? `openDocumentPackageView('${m.ID_Materi}')` : `openCourseClassroomView('${m.ID_Materi}')`}" style="cursor:pointer;" title="Buka ${isDoc ? 'Dokumen' : 'Kelas'}">
          <img src="${bannerUrl}" alt="${escapeHtml(m.Judul_Modul)}" class="rb-thumb-img" onerror="this.onerror=null;this.src='./assets/modules/thumb-metode3.jpg';">
          <div class="rb-badge-left ${badgeTypeClass}">${tipeBadge}</div>
          <div class="rb-badge-right">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Dimiliki</span>
          </div>
        </div>
        <div class="rb-card-content">
          <div class="rb-cat-pill ${catPillClass}">${kategori}</div>
          <h3 class="rb-card-title" onclick="${isDoc ? `openDocumentPackageView('${m.ID_Materi}')` : `openCourseClassroomView('${m.ID_Materi}')`}" style="cursor:pointer;" title="${escapeHtml(m.Judul_Modul)}">${m.Judul_Modul}</h3>
          <p class="rb-card-desc">${m.Deskripsi || 'Akses modul dan materi lengkap seumur hidup.'}</p>
          <div class="rb-card-meta">
            ${metaText}
          </div>
          <div class="rb-card-action">
            ${isDoc ? `
              <button type="button" class="rb-btn-action rb-btn-doc" onclick="openDocumentPackageView('${m.ID_Materi}')" title="Buka Dashboard Paket Dokumen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="rb-btn-svg" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <polyline points="9 14 12 17 15 14"></polyline>
                </svg>
                <span>Akses Produk</span>
              </button>
            ` : `
              <button type="button" class="rb-btn-action" onclick="openCourseClassroomView('${m.ID_Materi}')" title="Buka Dashboard Video Pembelajaran">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rb-btn-svg" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
                </svg>
                <span>Buka Ruang Belajar</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterClassroomPortalModules(query) {
  renderClassroomPortalModules(query, 'ALL');
}

function filterClassroomByTag(tag, btnElement) {
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) {
      const pills = parent.querySelectorAll('.rb-pill');
      pills.forEach(p => p.classList.remove('active'));
      btnElement.classList.add('active');
    }
  }
  const searchInput = document.getElementById('cls-portal-search-input');
  const query = searchInput ? searchInput.value : '';
  renderClassroomPortalModules(query, tag);
}

// Fallback untuk modal lama
function openClassroomPortal(studentName) {
  openClassroomDashboard(studentName);
}

function filterClassroomModules(query) {
  renderClassroomPortalModules(query, 'ALL');
}

function renderClassroomStudentView(query) {
  renderClassroomPortalModules(query, 'ALL');
}

function renderClassroomModulesAdmin() {
  if (!Array.isArray(STATE.modules)) {
    STATE.modules = loadStoredClassroomModules();
  }
  if (typeof renderClassroomCrmCards === 'function') {
    renderClassroomCrmCards(currentCrmRbQuery || '', currentCrmRbFilterTag || 'ALL');
  }
  const badgeEl = document.getElementById('badge-modules-count');
  if (badgeEl) badgeEl.textContent = STATE.modules.length;

  const tbody = document.getElementById('classroom-admin-tbody');
  if (!tbody) return;

  const modules = STATE.modules;

  if (modules.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:28px; color:#64748B;">Belum ada kartu/modul di Portal Ruang BelajarKu. Klik tombol <strong>+ Tambah Kartu / Modul Baru</strong> di atas.</td></tr>`;
    return;
  }

  tbody.innerHTML = modules.map((m, idx) => {
    const id = m.ID_Materi || ('MOD-' + (idx + 1));
    const urutan = m.Urutan || (idx + 1);
    const banner = m.Thumbnail_URL || m.Foto_URL || './assets/modules/thumb-metode3.jpg';
    const kategori = m.Kategori || m.Tipe_Badge || 'Kelas';
    const tipe = m.Tipe_Konten || 'Video HD';
    const ep = m.Episode || 1;
    const mat = m.Materi_Count || 1;
    const url = m.URL_Konten || 'https://drive.google.com';
    const status = m.Status || 'Publish';
    const isPublish = status === 'Publish';

    return `
      <tr>
        <td style="font-weight:800; text-align:center;">#${urutan}</td>
        <td>
          <img src="${banner}" alt="Banner" style="width:64px; height:40px; object-fit:cover; border-radius:8px; border:1px solid #E2E8F0;" onerror="this.onerror=null;this.src='./assets/modules/thumb-metode3.jpg';">
        </td>
        <td>
          <strong style="color:#0F172A;">${m.Judul_Modul}</strong><br>
          <small style="color:#64748B;">${(m.Deskripsi || '').slice(0, 60)}${(m.Deskripsi && m.Deskripsi.length > 60) ? '...' : ''}</small>
        </td>
        <td>
          <span class="pill-badge purple">${kategori}</span>
          <div style="font-size:11px; color:#64748B; margin-top:3px;">${tipe}</div>
        </td>
        <td>
          <span style="font-size:12px; font-weight:700; color:#1E1B4B;">🎬 ${ep} Ep • 📚 ${mat} Materi</span>
        </td>
        <td>
          <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--coral-pink); text-decoration:none; font-size:12px; font-weight:700;">
            🔗 Buka Tautan ↗
          </a>
        </td>
        <td><span class="pill-badge ${isPublish ? 'green' : 'yellow'}">${status}</span></td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn-secondary" style="padding:5px 10px; font-size:11px;" onclick="openEditModuleModal('${id}')">✏️ Edit</button>
            <button type="button" class="btn-secondary" style="padding:5px 10px; font-size:11px; color:#EF4444; border-color:#FCA5A5;" onclick="deleteClassroomModuleAdmin('${id}')">🗑️ Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewModuleModal() { openAddModuleModal(); }
window.openNewModuleModal = openNewModuleModal;
function toggleInlineModuleForm() {
  const box = document.getElementById('inline-module-form-box');
  if (!box) return;
  box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
}


// ============================================================================

// ============================================================================
// MANUAL INPUT HELPERS (EDIT & SAVE BUTTONS FOR KATEGORI & TIPE KONTEN)
// ============================================================================

function enableManualInput(field, isInline) {
  if (field === 'cat') {
    const selectWrap = document.getElementById(isInline ? 'inline-cat-select-wrap' : 'mod-cat-select-wrap');
    const inputWrap = document.getElementById(isInline ? 'inline-cat-input-wrap' : 'mod-cat-input-wrap');
    const selectEl = document.getElementById(isInline ? 'inline-mod-product' : 'mod-form-product');
    const inputEl = document.getElementById(isInline ? 'inline-mod-product-manual' : 'mod-form-product-manual');

    if (selectWrap && inputWrap && inputEl && selectEl) {
      selectWrap.style.display = 'none';
      inputWrap.style.display = 'block';
      inputEl.value = selectEl.value || '';
      inputEl.focus();
    }
  } else if (field === 'type') {
    const selectWrap = document.getElementById(isInline ? 'inline-type-select-wrap' : 'mod-type-select-wrap');
    const inputWrap = document.getElementById(isInline ? 'inline-type-input-wrap' : 'mod-type-input-wrap');
    const selectEl = document.getElementById(isInline ? 'inline-mod-type' : 'mod-form-type');
    const inputEl = document.getElementById(isInline ? 'inline-mod-type-manual' : 'mod-form-type-manual');

    if (selectWrap && inputWrap && inputEl && selectEl) {
      selectWrap.style.display = 'none';
      inputWrap.style.display = 'block';
      inputEl.value = selectEl.value || '';
      inputEl.focus();
    }
  }
}

function saveManualInput(field, isInline) {
  if (field === 'cat') {
    const selectWrap = document.getElementById(isInline ? 'inline-cat-select-wrap' : 'mod-cat-select-wrap');
    const inputWrap = document.getElementById(isInline ? 'inline-cat-input-wrap' : 'mod-cat-input-wrap');
    const selectEl = document.getElementById(isInline ? 'inline-mod-product' : 'mod-form-product');
    const inputEl = document.getElementById(isInline ? 'inline-mod-product-manual' : 'mod-form-product-manual');

    if (inputEl && selectEl) {
      const val = inputEl.value.trim();
      if (val) {
        let optExists = false;
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].value.toLowerCase() === val.toLowerCase() || selectEl.options[i].text.toLowerCase() === val.toLowerCase()) {
            selectEl.selectedIndex = i;
            optExists = true;
            break;
          }
        }
        if (!optExists) {
          const newOpt = document.createElement('option');
          newOpt.value = val;
          newOpt.textContent = val;
          newOpt.selected = true;
          selectEl.appendChild(newOpt);
        }
        if (typeof showToast === 'function') {
          showToast('Kategori "' + val + '" berhasil disimpan & dipilih! ✨', 'info');
        }
      }
      if (selectWrap && inputWrap) {
        inputWrap.style.display = 'none';
        selectWrap.style.display = 'block';
      }
    }
  } else if (field === 'type') {
    const selectWrap = document.getElementById(isInline ? 'inline-type-select-wrap' : 'mod-type-select-wrap');
    const inputWrap = document.getElementById(isInline ? 'inline-type-input-wrap' : 'mod-type-input-wrap');
    const selectEl = document.getElementById(isInline ? 'inline-mod-type' : 'mod-form-type');
    const inputEl = document.getElementById(isInline ? 'inline-mod-type-manual' : 'mod-form-type-manual');

    if (inputEl && selectEl) {
      const val = inputEl.value.trim();
      if (val) {
        let optExists = false;
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].value.toLowerCase() === val.toLowerCase() || selectEl.options[i].text.toLowerCase() === val.toLowerCase()) {
            selectEl.selectedIndex = i;
            optExists = true;
            break;
          }
        }
        if (!optExists) {
          const newOpt = document.createElement('option');
          newOpt.value = val;
          newOpt.textContent = val;
          newOpt.selected = true;
          selectEl.appendChild(newOpt);
        }
        if (typeof showToast === 'function') {
          showToast('Tipe Konten "' + val + '" berhasil disimpan & dipilih! ✨', 'info');
        }
      }
      if (selectWrap && inputWrap) {
        inputWrap.style.display = 'none';
        selectWrap.style.display = 'block';
      }
    }
  }
}

function handleModalModuleBannerUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const bannerInput = document.getElementById('mod-form-banner');
    if (bannerInput) bannerInput.value = dataUrl;
    updateModalBannerPreview(dataUrl);
    if (typeof showToast === 'function') {
      showToast('Foto banner modul berhasil dimuat! 🖼️', 'info');
    }
  };
  reader.readAsDataURL(file);
}

function updateModalBannerPreview(url) {
  const box = document.getElementById('modal-banner-preview-box');
  const img = document.getElementById('modal-banner-preview-img');
  if (box && img) {
    if (url && url.trim()) {
      img.src = url;
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  }
}

function handleInlineModuleBannerUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const bannerInput = document.getElementById('inline-mod-banner');
    if (bannerInput) bannerInput.value = dataUrl;
    if (typeof showToast === 'function') {
      showToast('Foto banner modul berhasil dimuat! 🖼️', 'info');
    }
  };
  reader.readAsDataURL(file);
}

function switchInlineModuleType(type) {
  const btnCourse = document.getElementById('btn-inline-type-course');
  const btnDoc = document.getElementById('btn-inline-type-doc');
  const secCourse = document.getElementById('inline-sec-course');
  const secDoc = document.getElementById('inline-sec-doc');
  const selectedTypeInput = document.getElementById('inline-mod-editor-selected-type');

  if (selectedTypeInput) selectedTypeInput.value = type;

  if (type === 'document') {
    if (btnCourse) btnCourse.classList.remove('active');
    if (btnDoc) btnDoc.classList.add('active');
    if (secCourse) secCourse.style.display = 'none';
    if (secDoc) secDoc.style.display = 'block';
  } else {
    if (btnDoc) btnDoc.classList.remove('active');
    if (btnCourse) btnCourse.classList.add('active');
    if (secDoc) secDoc.style.display = 'none';
    if (secCourse) secCourse.style.display = 'block';
  }
}

// DYNAMIC COURSE & DOCUMENT STORAGE SYNC (CONNECTED TO CRM & RUANG BELAJARKU)
// ============================================================================


function enableManualCountInput(field, isInline) {
  const elId = isInline 
    ? (field === 'episode' ? 'inline-mod-episode-count' : 'inline-mod-materi-count')
    : (field === 'episode' ? 'mod-form-episode-count' : 'mod-form-materi-count');
  const input = document.getElementById(elId);
  if (!input) return;
  input.removeAttribute('readonly');
  input.focus();
  input.select();
  input.style.borderColor = '#2563EB';
  input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
  if (typeof showToast === 'function') {
    showToast('Silakan ketik manual jumlah ' + (field === 'episode' ? 'Video / Episode (0-100+)' : 'Materi / File (0-100+)') + ' ✏️', 'info');
  }
}

function saveManualCountInput(field, isInline) {
  const elId = isInline 
    ? (field === 'episode' ? 'inline-mod-episode-count' : 'inline-mod-materi-count')
    : (field === 'episode' ? 'mod-form-episode-count' : 'mod-form-materi-count');
  const input = document.getElementById(elId);
  if (!input) return;
  let val = parseInt(input.value);
  if (isNaN(val) || val < 0) val = 0;
  if (val > 1000) val = 1000;
  input.value = val;
  input.style.borderColor = '#10B981';
  input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }, 1200);
  if (typeof showToast === 'function') {
    showToast('Jumlah ' + (field === 'episode' ? 'Video/Episode' : 'Materi/File') + ' berhasil disimpan: ' + val + ' 💾', 'info');
  }
}


function enableManualDocHeading(type, isInline) {
  const prefix = isInline ? 'inline-doc-' : 'mod-doc-';
  const displayId = (type === 'sec-heading') ? (prefix + 'sec-heading-display') : (prefix + 'list-heading-display');
  const inputId = (type === 'sec-heading') ? (prefix + 'sec-heading-input') : (prefix + 'list-heading-input');
  const displayEl = document.getElementById(displayId);
  const inputEl = document.getElementById(inputId);
  if (displayEl && inputEl) {
    displayEl.style.display = 'none';
    inputEl.style.display = 'inline-block';
    inputEl.removeAttribute('readonly');
    inputEl.focus();
    inputEl.select();
    inputEl.style.borderColor = '#2563EB';
    inputEl.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
    if (typeof showToast === 'function') {
      showToast('Silakan edit penamaan ' + (type === 'sec-heading' ? 'Paket Dokumen & Berkas' : 'Daftar paket Dokumen') + ' ✏️', 'info');
    }
  }
}

function saveManualDocHeading(type, isInline) {
  const prefix = isInline ? 'inline-doc-' : 'mod-doc-';
  const displayId = (type === 'sec-heading') ? (prefix + 'sec-heading-display') : (prefix + 'list-heading-display');
  const inputId = (type === 'sec-heading') ? (prefix + 'sec-heading-input') : (prefix + 'list-heading-input');
  const countSpan = document.getElementById('mod-form-doc-count');
  const count = countSpan ? countSpan.textContent : '0';
  const displayEl = document.getElementById(displayId);
  const inputEl = document.getElementById(inputId);
  if (displayEl && inputEl) {
    const defaultVal = (type === 'sec-heading') ? 'Paket Dokumen & Berkas' : 'Daftar paket Dokumen';
    const val = inputEl.value.trim() || defaultVal;
    inputEl.value = val;
    if (type === 'sec-heading') {
      displayEl.innerHTML = `📄 ${escapeHtml(val)}`;
    } else {
      displayEl.innerHTML = `${escapeHtml(val)} (<span id="mod-form-doc-count">${count}</span> Berkas)`;
    }
    inputEl.style.display = 'none';
    displayEl.style.display = 'inline-block';
    inputEl.style.borderColor = '#10B981';
    setTimeout(() => {
      inputEl.style.borderColor = '';
      inputEl.style.boxShadow = '';
    }, 1200);
    if (typeof showToast === 'function') {
      showToast(`Penamaan "${val}" berhasil disimpan! 💾`, 'info');
    }
  }
}


// ============================================================================
// CRM PORTAL RUANG BELAJARKU — EDIT & SAVE BADGE DAN NAMA FILE DOKUMEN
// ============================================================================
function enableManualDocBadge(isInline) {
  const elId = isInline ? 'inline-mod-doc-badge-label' : 'mod-doc-badge-label';
  const input = document.getElementById(elId);
  if (!input) return;
  input.removeAttribute('readonly');
  input.focus();
  input.select();
  input.style.borderColor = '#FF2E63';
  input.style.boxShadow = '0 0 0 3px rgba(255, 46, 99, 0.15)';
  if (typeof showToast === 'function') {
    showToast('Silakan ketik Label / Badge Dokumen di CRM ✏️', 'info');
  }
}

function saveManualDocBadge(isInline) {
  const elId = isInline ? 'inline-mod-doc-badge-label' : 'mod-doc-badge-label';
  const input = document.getElementById(elId);
  if (!input) return;
  const val = input.value.trim() || 'Dokumen Social Influence';
  input.value = val;
  input.style.borderColor = '#10B981';
  input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }, 1200);

  // Bila sedang mengedit modul di modal CRM, langsung sinkronkan ke penyimpanan dokumen
  if (!isInline) {
    const activeModId = document.getElementById('mod-form-id') ? document.getElementById('mod-form-id').value : '';
    if (activeModId) {
      const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
      if (docMap[activeModId]) {
        docMap[activeModId].badge = val;
        DOCUMENT_FILES_MAP[activeModId] = docMap[activeModId];
        try {
          localStorage.setItem('etalaseku_document_files_map', JSON.stringify(docMap));
        } catch (e) {}
      }
    }
  }
  if (typeof showToast === 'function') {
    showToast('Label Badge Dokumen "' + val + '" berhasil disimpan di CRM! 💾', 'info');
  }
}

function enableManualDocFilenameInline() {
  const input = document.getElementById('inline-mod-doc-filename');
  if (!input) return;
  input.removeAttribute('readonly');
  input.focus();
  input.select();
  input.style.borderColor = '#FF2E63';
  input.style.boxShadow = '0 0 0 3px rgba(255, 46, 99, 0.15)';
  if (typeof showToast === 'function') {
    showToast('Silakan edit Nama File Dokumen (.md) di CRM ✏️', 'info');
  }
}

function saveManualDocFilenameInline() {
  const input = document.getElementById('inline-mod-doc-filename');
  if (!input) return;
  let val = input.value.trim() || 'Dokumen_Materi.md';
  if (!val.includes('.')) val += '.md';
  input.value = val;
  input.style.borderColor = '#10B981';
  input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }, 1200);
  if (typeof showToast === 'function') {
    showToast('Nama File "' + val + '" berhasil disimpan di CRM! 💾', 'info');
  }
}

function enableDocRowFieldEdit(btn, fieldType) {
  const row = btn ? btn.closest('.crm-row-builder-item') : null;
  if (!row) return;
  const selector = fieldType === 'filename' ? '.doc-item-filename' : '.doc-item-badge';
  const input = row.querySelector(selector);
  if (!input) return;
  input.removeAttribute('readonly');
  input.focus();
  input.select();
  input.style.borderColor = '#FF2E63';
  input.style.boxShadow = '0 0 0 3px rgba(255, 46, 99, 0.15)';
  if (typeof showToast === 'function') {
    showToast('Silakan edit ' + (fieldType === 'filename' ? 'Nama File Dokumen' : 'Label Badge Berkas') + ' ✏️', 'info');
  }
}

function saveDocRowFieldEdit(btn, fieldType) {
  const row = btn ? btn.closest('.crm-row-builder-item') : null;
  if (!row) return;
  const selector = fieldType === 'filename' ? '.doc-item-filename' : '.doc-item-badge';
  const input = row.querySelector(selector);
  if (!input) return;

  let val = input.value.trim();
  if (fieldType === 'filename') {
    if (!val) val = 'Dokumen_Materi.md';
    if (!val.includes('.')) val += '.md';
  } else {
    const mainBadge = document.getElementById('mod-doc-badge-label');
    if (!val) val = (mainBadge && mainBadge.value.trim()) ? mainBadge.value.trim() : 'Dokumen Social Influence';
  }
  input.value = val;
  input.style.borderColor = '#10B981';
  input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
  setTimeout(() => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }, 1200);

  // Langsung sinkronkan ke DOCUMENT_FILES_MAP & localStorage jika sedang mengedit modul
  const activeModId = document.getElementById('mod-form-id') ? document.getElementById('mod-form-id').value : '';
  const container = document.getElementById('mod-documents-container');
  if (activeModId && container) {
    const rows = Array.from(container.querySelectorAll('.crm-row-builder-item'));
    const rowIdx = rows.indexOf(row);
    const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
    if (docMap[activeModId] && docMap[activeModId].files && docMap[activeModId].files[rowIdx]) {
      if (fieldType === 'filename') {
        docMap[activeModId].files[rowIdx].filename = val;
      } else {
        docMap[activeModId].files[rowIdx].badge = val;
      }
      DOCUMENT_FILES_MAP[activeModId] = docMap[activeModId];
      try {
        localStorage.setItem('etalaseku_document_files_map', JSON.stringify(docMap));
      } catch (e) {}
    }
  }

  if (typeof showToast === 'function') {
    showToast((fieldType === 'filename' ? 'Nama File "' : 'Badge Dokumen "') + val + '" berhasil disimpan! 💾', 'info');
  }
}

function getActiveCourseEpisodesMap() {
  try {
    const saved = localStorage.getItem('etalaseku_course_episodes_map');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.assign({}, COURSE_EPISODES_MAP, parsed);
    }
  } catch (e) {
    console.warn('Error reading etalaseku_course_episodes_map:', e);
  }
  return COURSE_EPISODES_MAP;
}

function getActiveDocumentFilesMap() {
  try {
    const saved = localStorage.getItem('etalaseku_document_files_map');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.assign({}, DOCUMENT_FILES_MAP, parsed);
    }
  } catch (e) {
    console.warn('Error reading etalaseku_document_files_map:', e);
  }
  return DOCUMENT_FILES_MAP;
}

function switchModuleEditorType(type) {
  const btnCourse = document.getElementById('btn-mod-type-course');
  const btnDoc = document.getElementById('btn-mod-type-doc');
  const secCourse = document.getElementById('crm-sec-course-editor');
  const secDoc = document.getElementById('crm-sec-doc-editor');
  const selectedTypeInput = document.getElementById('mod-editor-selected-type');
  const badgeSelect = document.getElementById('mod-form-badge');

  if (selectedTypeInput) selectedTypeInput.value = type;

  if (type === 'document') {
    if (btnCourse) btnCourse.classList.remove('active');
    if (btnDoc) btnDoc.classList.add('active');
    if (secCourse) secCourse.style.display = 'none';
    if (secDoc) secDoc.style.display = 'block';
    if (badgeSelect) badgeSelect.value = 'Dokumen';
  } else {
    if (btnDoc) btnDoc.classList.remove('active');
    if (btnCourse) btnCourse.classList.add('active');
    if (secDoc) secDoc.style.display = 'none';
    if (secCourse) secCourse.style.display = 'block';
    if (badgeSelect) badgeSelect.value = 'Kelas';
  }
}

function addEpisodeRowToForm(epData) {
  const container = document.getElementById('mod-episodes-container');
  if (!container) return;
  const data = epData || {};
  const index = container.children.length + 1;
  const title = data.title || ('Step ' + index + ' - Materi Baru');
  const duration = data.duration || '10:00';
  const url = data.url || data.videoEmbedUrl || '';
  const summary = data.summary || '';

  const div = document.createElement('div');
  div.className = 'crm-row-builder-item';
  div.innerHTML = `
    <button type="button" class="crm-row-del-btn" onclick="this.closest('.crm-row-builder-item').remove(); updateFormCounters();" title="Hapus Episode">&times;</button>
    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:8px; padding-right:30px;">
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Judul Episode *</label>
        <input type="text" class="form-input ep-item-title" value="${escapeHtml(title)}" placeholder="Contoh: Step 1 - Setup Github + Repo">
      </div>
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Durasi</label>
        <input type="text" class="form-input ep-item-duration" value="${escapeHtml(duration)}" placeholder="07:40">
      </div>
    </div>
    <div style="margin-bottom:8px;">
      <label class="form-label" style="font-size:10.5px; font-weight:700;">URL Video YouTube / Google Drive</label>
      <input type="text" class="form-input ep-item-url" value="${escapeHtml(url)}" placeholder="https://youtube.com/embed/... atau https://drive.google.com/...">
    </div>
    <div>
      <label class="form-label" style="font-size:10.5px; font-weight:700;">Ringkasan Singkat Episode</label>
      <input type="text" class="form-input ep-item-summary" value="${escapeHtml(summary)}" placeholder="Penjelasan ringkas materi episode ini">
    </div>
  `;
  container.appendChild(div);
  updateFormCounters();
}

function addMaterialRowToForm(matData) {
  const container = document.getElementById('mod-materials-container');
  if (!container) return;
  const data = matData || {};
  const name = data.name || '';
  const type = data.type || 'Source Code';
  const url = data.url || '';

  const div = document.createElement('div');
  div.className = 'crm-row-builder-item';
  div.innerHTML = `
    <button type="button" class="crm-row-del-btn" onclick="this.closest('.crm-row-builder-item').remove(); updateFormCounters();" title="Hapus Berkas">&times;</button>
    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px; margin-bottom:8px; padding-right:30px;">
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Nama Berkas / File *</label>
        <input type="text" class="form-input mat-item-name" value="${escapeHtml(name)}" placeholder="Contoh: Snippet Script CORS">
      </div>
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Tipe File</label>
        <input type="text" class="form-input mat-item-type" value="${escapeHtml(type)}" placeholder="JavaScript Code / PDF / Zip">
      </div>
    </div>
    <div>
      <label class="form-label" style="font-size:10.5px; font-weight:700;">Link Download / Drive URL</label>
      <input type="text" class="form-input mat-item-url" value="${escapeHtml(url)}" placeholder="https://drive.google.com/... atau https://github.com/...">
    </div>
  `;
  container.appendChild(div);
  updateFormCounters();
}

function addDocumentRowToForm(docData) {
  const container = document.getElementById('mod-documents-container');
  if (!container) return;
  const data = docData || {};
  const index = container.children.length + 1;
  const name = data.name || ('Dokumen Materi ' + index);
  const cleanDefaultName = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  const filename = data.filename || ('Dokumen_' + cleanDefaultName + '.md');
  const mainBadgeInput = document.getElementById('mod-doc-badge-label');
  const defaultBadge = (mainBadgeInput && mainBadgeInput.value.trim()) ? mainBadgeInput.value.trim() : ('Dokumen ' + name);
  const badge = data.badge || defaultBadge;
  const size = data.size || '0.01 MB';
  const url = data.url || 'https://drive.google.com';
  const rawContent = data.content || ('# Dokumen: ' + name + '\n\n## 1. Ringkasan Eksekutif\nDokumen spesifikasi produk dan panduan implementasi.\n\n## 2. Fitur Utama\n- Arsitektur sistem Google Apps Script\n- Skema database Google Sheets\n- Endpoint REST API modern.');
  const content = rawContent.replace(/^#\s*PRD:\s*/i, '# Dokumen: ');

  const div = document.createElement('div');
  div.className = 'crm-row-builder-item';
  div.innerHTML = `
    <button type="button" class="crm-row-del-btn" onclick="this.closest('.crm-row-builder-item').remove(); updateFormCounters();" title="Hapus Dokumen">&times;</button>
    <div class="crm-doc-row-grid-top" style="display:grid; grid-template-columns: 3fr 1fr; gap:10px; margin-bottom:10px; padding-right:30px;">
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Judul Dokumen *</label>
        <input type="text" class="form-input doc-item-name" value="${escapeHtml(name)}" placeholder="Contoh: Social Influence / E-TOKO">
      </div>
      <div>
        <label class="form-label" style="font-size:10.5px; font-weight:700;">Ukuran Berkas</label>
        <input type="text" class="form-input doc-item-size" value="${escapeHtml(size)}" placeholder="0.01 MB">
      </div>
    </div>
    <div class="crm-doc-row-grid-mid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 10px; border-radius:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
          <label class="form-label" style="font-size:10.5px; font-weight:700; margin:0; color:#1E1B4B;">Nama File (Tampil di Reader)</label>
          <div style="display:flex; gap:4px;">
            <button type="button" class="btn-micro-edit" onclick="enableDocRowFieldEdit(this, 'filename')" title="Edit Nama File Dokumen">✏️ Edit</button>
            <button type="button" class="btn-micro-save" onclick="saveDocRowFieldEdit(this, 'filename')" title="Simpan Nama File Dokumen">💾 Save</button>
          </div>
        </div>
        <input type="text" class="form-input doc-item-filename" value="${escapeHtml(filename)}" placeholder="Contoh: Dokumen_Social_Influence.md" style="font-family:'Courier New', monospace; font-size:12px;">
      </div>
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 10px; border-radius:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
          <label class="form-label" style="font-size:10.5px; font-weight:700; margin:0; color:#1E1B4B;">Label Badge (Header Reader)</label>
          <div style="display:flex; gap:4px;">
            <button type="button" class="btn-micro-edit" onclick="enableDocRowFieldEdit(this, 'badge')" title="Edit Label Badge Berkas">✏️ Edit</button>
            <button type="button" class="btn-micro-save" onclick="saveDocRowFieldEdit(this, 'badge')" title="Simpan Label Badge Berkas">💾 Save</button>
          </div>
        </div>
        <input type="text" class="form-input doc-item-badge" value="${escapeHtml(badge)}" placeholder="Contoh: Dokumen Social Influence">
      </div>
    </div>
    <div style="margin-bottom:8px;">
      <label class="form-label" style="font-size:10.5px; font-weight:700;">Tautan Unduh File / Drive</label>
      <input type="text" class="form-input doc-item-url" value="${escapeHtml(url)}" placeholder="https://drive.google.com/...">
    </div>
    <div>
      <label class="form-label" style="font-size:10.5px; font-weight:700;">Isi Teks Dokumen</label>
      <textarea class="form-input doc-item-content" rows="3" placeholder="Teks lengkap dokumen format markdown...">${escapeHtml(content)}</textarea>
    </div>
  `;
  container.appendChild(div);
  updateFormCounters();
}

function updateFormCounters() {
  const epCount = document.getElementById('mod-form-ep-count');
  const epBox = document.getElementById('mod-episodes-container');
  if (epCount && epBox) epCount.textContent = epBox.children.length;

  const matCount = document.getElementById('mod-form-mat-count');
  const matBox = document.getElementById('mod-materials-container');
  if (matCount && matBox) matCount.textContent = matBox.children.length;

  const docCount = document.getElementById('mod-form-doc-count');
  const docBox = document.getElementById('mod-documents-container');
  if (docCount && docBox) docCount.textContent = docBox.children.length;
}

function openAddModuleModal() {
  const titleEl = document.getElementById('module-form-modal-title');
  if (titleEl) titleEl.textContent = 'Tambah Kartu / Modul Baru Ruang BelajarKu 🎓';

  const btnSave = document.getElementById('btn-save-module-modal');
  if (btnSave) btnSave.textContent = 'Simpan & Hubungkan ke Dashboard Ruang Belajar & Akses Produk 🚀';

  document.getElementById('mod-form-id').value = '';
  document.getElementById('mod-form-title').value = '';
  document.getElementById('mod-form-order').value = ((Array.isArray(STATE.modules) ? STATE.modules : loadStoredClassroomModules()).length + 1);
  document.getElementById('mod-form-badge').value = 'Kelas';
  document.getElementById('mod-form-duration').value = '30 Menit';
  document.getElementById('mod-form-banner').value = './assets/modules/thumb-metode3.jpg';
  document.getElementById('mod-form-desc').value = '';

  // Reset course fields
  document.getElementById('mod-form-wa-name').value = 'Grup Diskusi Siswa';
  document.getElementById('mod-form-wa-link').value = 'https://chat.whatsapp.com/';
  document.getElementById('mod-form-summary-text').value = 'Ringkasan materi pembelajaran dan penjelasan modul lengkap.';

  // Reset doc fields
  document.getElementById('mod-doc-pkg-files').value = '10 berkas';
  document.getElementById('mod-doc-pkg-format').value = '10 Dokumen';
  document.getElementById('mod-doc-subtitle').value = 'Silahkan Download PRD yang dibutuhkan sebagai Referensi';

  // Clear builders
  const epBox = document.getElementById('mod-episodes-container');
  if (epBox) epBox.innerHTML = '';
  const matBox = document.getElementById('mod-materials-container');
  if (matBox) matBox.innerHTML = '';
  const docBox = document.getElementById('mod-documents-container');
  if (docBox) docBox.innerHTML = '';

  // Add sample rows
  addEpisodeRowToForm({ title: 'Step 1 - Pengenalan Modul', duration: '08:20', summary: 'Pengantar materi dan sasaran kompetensi.' });
  addEpisodeRowToForm({ title: 'Step 2 - Praktek Coding & Implementasi', duration: '15:40', summary: 'Hands-on koding langkah demi langkah.' });
  addMaterialRowToForm({ name: 'Starter Kit Source Code (Zip)', type: 'GitHub Zip', url: 'https://drive.google.com' });
  if (document.getElementById('mod-doc-badge-label')) document.getElementById('mod-doc-badge-label').value = 'Dokumen Social Influence';
  addDocumentRowToForm({ name: 'Dokumen Referensi Utama', filename: 'Dokumen_Referensi_Utama.md', badge: 'Dokumen Social Influence', size: '0.02 MB', url: 'https://drive.google.com' });

  switchModuleEditorType('course');
  document.getElementById('modal-module-form').classList.add('active');
}

function openEditModuleModal(id) {
  const modules = Array.isArray(STATE.modules) ? STATE.modules : loadStoredClassroomModules();
  const mod = modules.find(m => m.ID_Materi === id);
  if (!mod) return;

  const titleEl = document.getElementById('module-form-modal-title');
  if (titleEl) titleEl.textContent = 'Edit Kartu Modul Pembelajaran Ruang BelajarKu ✏️';

  const btnSave = document.getElementById('btn-save-module-modal');
  if (btnSave) btnSave.textContent = 'Simpan & Hubungkan ke Dashboard Ruang Belajar & Akses Produk 🚀';

  document.getElementById('mod-form-id').value = mod.ID_Materi;
  document.getElementById('mod-form-title').value = mod.Judul_Modul || '';
  document.getElementById('mod-form-order').value = mod.Urutan || 1;
  document.getElementById('mod-form-duration').value = mod.Durasi_Menit ? (mod.Durasi_Menit + ' Menit') : (mod.Durasi || '30 Menit');
  document.getElementById('mod-form-banner').value = mod.Thumbnail_URL || mod.Foto_URL || '';
  document.getElementById('mod-form-desc').value = mod.Deskripsi || '';
  updateModalBannerPreview(mod.Thumbnail_URL || mod.Foto_URL || '');

  const isDoc = (mod.Tipe_Badge === 'DOKUMEN' || mod.Tipe_Badge === 'APLIKASI' || (mod.Kategori && (mod.Kategori.toLowerCase() === 'dokumen' || mod.Kategori.toLowerCase() === 'aplikasi')));
  const badgeSelect = document.getElementById('mod-form-badge');
  if (badgeSelect) {
    badgeSelect.value = (mod.Tipe_Badge === 'APLIKASI' || (mod.Kategori && mod.Kategori.toLowerCase() === 'aplikasi')) ? 'Aplikasi' : (isDoc ? 'Dokumen' : 'Kelas');
  }

  // Load Course Data & Document Data upfront safely to prevent TDZ ReferenceError
  const courseMap = typeof getActiveCourseEpisodesMap === 'function' ? getActiveCourseEpisodesMap() : COURSE_EPISODES_MAP;
  const courseData = courseMap[id] || courseMap['MOD-01'] || null;

  const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
  const docData = docMap[id] || docMap['MOD-02'] || null;

  // Set episode count & materi count safely
  const epCountField = document.getElementById('mod-form-episode-count');
  if (epCountField) {
    if (typeof mod.Episode !== 'undefined' && mod.Episode !== null && mod.Episode !== '') {
      epCountField.value = mod.Episode;
    } else if (courseData && courseData.episodes && courseData.episodes.length > 0) {
      epCountField.value = courseData.episodes.length;
    } else {
      epCountField.value = isDoc ? 1 : 1;
    }
  }

  const matCountField = document.getElementById('mod-form-materi-count');
  if (matCountField) {
    if (typeof mod.Materi_Count !== 'undefined' && mod.Materi_Count !== null && mod.Materi_Count !== '') {
      matCountField.value = mod.Materi_Count;
    } else if (isDoc && docData && docData.files && docData.files.length > 0) {
      matCountField.value = docData.files.length;
    } else if (courseData && courseData.materials && courseData.materials.length > 0) {
      matCountField.value = courseData.materials.length;
    } else {
      matCountField.value = isDoc ? 10 : 1;
    }
  }

  // WhatsApp & Summary
  const waNameEl = document.getElementById('mod-form-wa-name');
  if (waNameEl) waNameEl.value = (courseData && courseData.waGroupTitle) ? courseData.waGroupTitle : ('Khusus peserta ' + (mod.Judul_Modul || ''));
  const waLinkEl = document.getElementById('mod-form-wa-link');
  if (waLinkEl) waLinkEl.value = (courseData && courseData.waGroupLink) ? courseData.waGroupLink : 'https://chat.whatsapp.com/';
  const summaryEl = document.getElementById('mod-form-summary-text');
  if (summaryEl) summaryEl.value = (courseData && courseData.summary) ? courseData.summary : (mod.Deskripsi || '');

  // Populate episodes
  const epBox = document.getElementById('mod-episodes-container');
  if (epBox) {
    epBox.innerHTML = '';
    const episodes = (courseData && courseData.episodes && courseData.episodes.length > 0) ? courseData.episodes : [
      { title: 'Step 1 - Setup & Persiapan', duration: '07:40', summary: 'Instalasi dan persiapan lingkungan kerja.' }
    ];
    episodes.forEach(ep => addEpisodeRowToForm(ep));
  }

  // Populate materials
  const matBox = document.getElementById('mod-materials-container');
  if (matBox) {
    matBox.innerHTML = '';
    const materials = (courseData && courseData.materials && courseData.materials.length > 0) ? courseData.materials : [
      { name: 'Snippet Script & Dokumen', type: 'JavaScript Code', url: 'https://drive.google.com' }
    ];
    materials.forEach(mat => addMaterialRowToForm(mat));
  }

  // Populate doc headings with custom saved names or defaults
  const secHeadingDisplay = document.getElementById('mod-doc-sec-heading-display');
  const secHeadingInput = document.getElementById('mod-doc-sec-heading-input');
  const listHeadingDisplay = document.getElementById('mod-doc-list-heading-display');
  const listHeadingInput = document.getElementById('mod-doc-list-heading-input');

  const curSecTitle = (docData && docData.sectionTitle) ? docData.sectionTitle : 'Paket Dokumen & Berkas';
  const curListTitle = (docData && docData.listTitle) ? docData.listTitle : 'Daftar paket Dokumen';

  if (secHeadingDisplay) secHeadingDisplay.innerHTML = '📄 ' + escapeHtml(curSecTitle);
  if (secHeadingInput) secHeadingInput.value = curSecTitle;
  if (listHeadingDisplay) {
    const curFilesCount = (docData && docData.files) ? docData.files.length : (docData && docData.totalFiles ? docData.totalFiles : 0);
    listHeadingDisplay.innerHTML = escapeHtml(curListTitle) + ' (<span id="mod-form-doc-count">' + curFilesCount + '</span> Berkas)';
  }
  if (listHeadingInput) listHeadingInput.value = curListTitle;

  // Document fields
  const docBadgeEl = document.getElementById('mod-doc-badge-label');
  if (docBadgeEl) {
    docBadgeEl.value = (docData && docData.badge) ? docData.badge : ('Dokumen ' + (mod.Judul_Modul || 'Social Influence'));
  }

  const pkgFilesEl = document.getElementById('mod-doc-pkg-files');
  if (pkgFilesEl) pkgFilesEl.value = (docData && docData.pkgFilesText) ? docData.pkgFilesText : ((docData && docData.totalFiles) ? (docData.totalFiles + ' berkas') : '10 berkas');
  const pkgFormatEl = document.getElementById('mod-doc-pkg-format');
  if (pkgFormatEl) pkgFormatEl.value = (docData && docData.pkgFormatText) ? docData.pkgFormatText : '10 Dokumen';
  const docSubEl = document.getElementById('mod-doc-subtitle');
  if (docSubEl) docSubEl.value = (docData && docData.subtitle) ? docData.subtitle : (mod.Deskripsi || 'Silahkan Download PRD yang dibutuhkan sebagai Referensi');

  // Populate documents
  const docContainer = document.getElementById('mod-documents-container');
  if (docContainer) {
    docContainer.innerHTML = '';
    const docFiles = (docData && docData.files && docData.files.length > 0) ? docData.files : [
      { name: 'E-TOKO Mini', filename: 'PRD-E-TOKO.md', size: '0.01 MB', url: 'https://drive.google.com', content: '# PRD E-Toko' }
    ];
    docFiles.forEach(df => addDocumentRowToForm(df));
  }

  updateFormCounters();
  switchModuleEditorType(isDoc ? 'document' : 'course');
  document.getElementById('modal-module-form').classList.add('active');
}

async function saveClassroomModuleForm(e, isInline) {
  if (e && e.preventDefault) e.preventDefault();

  if (isInline) {
    const inlineId = 'MOD-' + Date.now().toString().slice(-4);
    const inlineTitleInput = document.getElementById('inline-mod-title');
    const inlineTitle = inlineTitleInput ? inlineTitleInput.value.trim() : '';
    if (!inlineTitle) {
      if (typeof showToast === 'function') showToast('Judul modul wajib diisi!', 'warning');
      if (inlineTitleInput) inlineTitleInput.focus();
      return;
    }
    const inlineOrder = Number(document.getElementById('inline-mod-order').value || 1);
    const inlineProduct = document.getElementById('inline-mod-product').value || 'GAS Pro Web App Masterclass';
    const inlineType = document.getElementById('inline-mod-type').value || 'Video HD & Code';
    const inlineDurationText = document.getElementById('inline-mod-duration').value || '30 Menit';
    const inlineDurationNum = parseInt(inlineDurationText) || 30;
    const inlineBanner = document.getElementById('inline-mod-banner').value || './assets/modules/thumb-metode3.jpg';
    const inlineUrl = document.getElementById('inline-mod-url').value || 'https://drive.google.com';
    const inlineDesc = document.getElementById('inline-mod-desc').value || '';
    const editorType = (document.getElementById('inline-mod-editor-selected-type') ? document.getElementById('inline-mod-editor-selected-type').value : 'course');

    const isDoc = (editorType === 'document' || inlineType.toLowerCase().includes('dokumen') || inlineType.toLowerCase().includes('prd') || inlineProduct.toLowerCase().includes('prd'));

    const customEpCount = parseInt(document.getElementById('inline-mod-episode-count') ? document.getElementById('inline-mod-episode-count').value : 0) || (isDoc ? 1 : 1);
    const customMatCount = parseInt(document.getElementById('inline-mod-materi-count') ? document.getElementById('inline-mod-materi-count').value : 0) || (isDoc ? 10 : 1);

    const newMod = {
      ID_Materi: inlineId,
      ID_Produk: inlineProduct,
      Judul_Modul: inlineTitle,
      Urutan: inlineOrder,
      Tipe_Badge: isDoc ? 'DOKUMEN' : 'KELAS',
      Kategori: isDoc ? 'Dokumen' : 'Kelas',
      Tipe_Konten: inlineType,
      URL_Konten: inlineUrl,
      Durasi_Menit: inlineDurationNum,
      Status: 'Publish',
      Deskripsi: inlineDesc,
      Thumbnail_URL: inlineBanner,
      Foto_URL: inlineBanner,
      Episode: customEpCount,
      Materi_Count: customMatCount
    };

    if (!isDoc) {
      const inlineWaName = (document.getElementById('inline-mod-wa-name') && document.getElementById('inline-mod-wa-name').value) ? document.getElementById('inline-mod-wa-name').value : ('Khusus peserta ' + inlineTitle);
      const inlineWaLink = (document.getElementById('inline-mod-wa-link') && document.getElementById('inline-mod-wa-link').value) ? document.getElementById('inline-mod-wa-link').value : 'https://chat.whatsapp.com/';
      const inlineSummary = (document.getElementById('inline-mod-summary-text') && document.getElementById('inline-mod-summary-text').value) ? document.getElementById('inline-mod-summary-text').value : inlineDesc;

      const courseObj = {
        title: inlineTitle,
        shortTitle: inlineTitle.length > 45 ? (inlineTitle.slice(0, 42) + '...') : inlineTitle,
        poster: inlineBanner,
        materialsCount: customMatCount,
        summary: inlineSummary,
        waGroupTitle: inlineWaName,
        waGroupLink: inlineWaLink,
        episodes: [
          {
            title: 'Step 1 - ' + inlineTitle,
            duration: inlineDurationText,
            summary: inlineSummary,
            videoEmbedUrl: inlineUrl,
            posterTag: inlineTitle
          }
        ],
        materials: [
          {
            name: 'Aset & Source Code Modul',
            type: inlineType,
            url: inlineUrl
          }
        ]
      };

      const courseMap = typeof getActiveCourseEpisodesMap === 'function' ? getActiveCourseEpisodesMap() : COURSE_EPISODES_MAP;
      courseMap[inlineId] = courseObj;
      COURSE_EPISODES_MAP[inlineId] = courseObj;
      try {
        localStorage.setItem('etalaseku_course_episodes_map', JSON.stringify(courseMap));
      } catch (err) {}
    } else {
      const inlinePkgFiles = (document.getElementById('inline-mod-doc-pkg-files') && document.getElementById('inline-mod-doc-pkg-files').value) ? document.getElementById('inline-mod-doc-pkg-files').value : (customMatCount + ' berkas');
      const inlinePkgFormat = (document.getElementById('inline-mod-doc-pkg-format') && document.getElementById('inline-mod-doc-pkg-format').value) ? document.getElementById('inline-mod-doc-pkg-format').value : (customMatCount + ' Dokumen');
      const inlineDocSubtitle = (document.getElementById('inline-mod-doc-subtitle') && document.getElementById('inline-mod-doc-subtitle').value) ? document.getElementById('inline-mod-doc-subtitle').value : (inlineDesc || 'Silahkan Download PRD yang dibutuhkan sebagai Referensi');

      const cleanInlineName = inlineTitle.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
      const inlineBadgeInput = document.getElementById('inline-mod-doc-badge-label');
      const inlineBadgeVal = (inlineBadgeInput && inlineBadgeInput.value.trim()) ? inlineBadgeInput.value.trim() : ('Dokumen ' + inlineTitle);
      const inlineFilenameInput = document.getElementById('inline-mod-doc-filename');
      let inlineFilenameVal = (inlineFilenameInput && inlineFilenameInput.value.trim()) ? inlineFilenameInput.value.trim() : ('Dokumen_' + cleanInlineName + '.md');
      if (!inlineFilenameVal.includes('.')) inlineFilenameVal += '.md';
      const inlineSecHeadingInput = document.getElementById('inline-doc-sec-heading-input');
      const inlineSecTitle = (inlineSecHeadingInput && inlineSecHeadingInput.value.trim()) ? inlineSecHeadingInput.value.trim() : 'Paket Dokumen & Berkas';
      const inlineDocContentInput = document.getElementById('inline-mod-doc-content');
      const inlineDocContentVal = (inlineDocContentInput && inlineDocContentInput.value.trim())
        ? inlineDocContentInput.value.trim()
        : ('# Dokumen: ' + inlineTitle + '\n\n## 1. Ringkasan Eksekutif\n' + (inlineDesc || 'Dokumen materi, panduan teknis, dan implementasi referensi lengkap.') + '\n\n## 2. Poin Utama Pembelajaran & Berkas\n- Modul Pembelajaran Terverifikasi\n- Repositori dan Berkas Referensi\n- Panduan Implementasi Langkah demi Langkah');

      const docObj = {
        title: inlineTitle,
        subtitle: inlineDocSubtitle,
        banner: inlineBanner,
        sectionTitle: inlineSecTitle,
        badge: inlineBadgeVal,
        totalFiles: customMatCount,
        totalLinks: 0,
        pkgFilesText: inlinePkgFiles,
        pkgFormatText: inlinePkgFormat,
        files: [
          {
            name: inlineTitle,
            filename: inlineFilenameVal,
            badge: inlineBadgeVal,
            size: '0.01 MB',
            url: inlineUrl,
            content: inlineDocContentVal
          }
        ]
      };

      const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
      docMap[inlineId] = docObj;
      DOCUMENT_FILES_MAP[inlineId] = docObj;
      try {
        localStorage.setItem('etalaseku_document_files_map', JSON.stringify(docMap));
      } catch (err) {}
    }

    if (!Array.isArray(STATE.modules)) STATE.modules = loadStoredClassroomModules();
    // Pastikan ID baru tidak ada di daftar terhapus
    saveDeletedModuleIds(getDeletedModuleIds().filter(delId => delId !== inlineId));
    STATE.modules.push(newMod);
    STATE.modules.sort((a, b) => (Number(a.Urutan) || 0) - (Number(b.Urutan) || 0));
    persistClassroomModules(STATE.modules);

    renderClassroomModulesAdmin();
    renderClassroomPortalModules('', 'ALL');

    const inlineBox = document.getElementById('inline-module-form-box');
    if (inlineBox) inlineBox.style.display = 'none';

    if (typeof showToast === 'function') {
      showToast('Modul berhasil disimpan dan otomatis terhubung ke Buka Ruang Belajar & Akses Produk! 🚀', 'info');
    }
    return;
  }

  // Modal Save Handler
  const id = document.getElementById('mod-form-id').value || ('MOD-' + Date.now().toString().slice(-4));
  const titleInput = document.getElementById('mod-form-title');
  const title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    if (typeof showToast === 'function') showToast('Judul modul wajib diisi!', 'warning');
    if (titleInput) titleInput.focus();
    return;
  }
  const order = Number(document.getElementById('mod-form-order').value || 1);
  const badgeSelect = document.getElementById('mod-form-badge');
  const badgeType = badgeSelect ? badgeSelect.value : 'Kelas';
  const durationText = document.getElementById('mod-form-duration').value || '30 Menit';
  const durationNum = parseInt(durationText) || 30;
  const bannerUrl = document.getElementById('mod-form-banner').value || './assets/modules/thumb-metode3.jpg';
  const desc = document.getElementById('mod-form-desc').value || '';
  const editorTypeInput = document.getElementById('mod-editor-selected-type');
  const editorType = editorTypeInput ? editorTypeInput.value : 'course';

  const isDoc = (editorType === 'document' || badgeType.toLowerCase() === 'dokumen' || badgeType.toLowerCase() === 'aplikasi');

  // Input episode count & materi count from manual inputs (0 - 100+)
  const inputEpCount = parseInt(document.getElementById('mod-form-episode-count') ? document.getElementById('mod-form-episode-count').value : 0) || 0;
  const inputMatCount = parseInt(document.getElementById('mod-form-materi-count') ? document.getElementById('mod-form-materi-count').value : 0) || 0;

  // Format module record for STATE.modules
  const formattedModule = {
    ID_Materi: id,
    ID_Produk: 'PRD-001',
    Judul_Modul: title,
    Urutan: order,
    Tipe_Badge: isDoc ? (badgeType.toUpperCase() === 'APLIKASI' ? 'APLIKASI' : 'DOKUMEN') : 'KELAS',
    Kategori: isDoc ? (badgeType === 'Aplikasi' ? 'Aplikasi' : 'Dokumen') : 'Kelas',
    Tipe_Konten: isDoc ? 'Dokumen & Template' : 'Video HD & Code',
    URL_Konten: 'https://drive.google.com',
    Durasi_Menit: durationNum,
    Status: 'Publish',
    Deskripsi: desc,
    Thumbnail_URL: bannerUrl,
    Foto_URL: bannerUrl,
    Episode: inputEpCount,
    Materi_Count: inputMatCount
  };

  // Process Course Curriculum & Episodes (Foto 1 - Buka Ruang Belajar)
  if (!isDoc) {
    const epContainer = document.getElementById('mod-episodes-container');
    const epRows = epContainer ? Array.from(epContainer.querySelectorAll('.crm-row-builder-item')) : [];
    const episodes = epRows.map((row, idx) => {
      const epTitle = (row.querySelector('.ep-item-title') ? row.querySelector('.ep-item-title').value.trim() : '') || ('Step ' + (idx + 1));
      const epDur = (row.querySelector('.ep-item-duration') ? row.querySelector('.ep-item-duration').value.trim() : '') || '10:00';
      const epUrl = (row.querySelector('.ep-item-url') ? row.querySelector('.ep-item-url').value.trim() : '') || '';
      const epSum = (row.querySelector('.ep-item-summary') ? row.querySelector('.ep-item-summary').value.trim() : '') || '';
      return {
        title: epTitle,
        duration: epDur,
        summary: epSum,
        videoEmbedUrl: epUrl,
        posterTag: epTitle
      };
    });

    const matContainer = document.getElementById('mod-materials-container');
    const matRows = matContainer ? Array.from(matContainer.querySelectorAll('.crm-row-builder-item')) : [];
    const materials = matRows.map(row => {
      const matName = (row.querySelector('.mat-item-name') ? row.querySelector('.mat-item-name').value.trim() : '') || 'Aset Modul';
      const matType = (row.querySelector('.mat-item-type') ? row.querySelector('.mat-item-type').value.trim() : '') || 'Source Code';
      const matUrl = (row.querySelector('.mat-item-url') ? row.querySelector('.mat-item-url').value.trim() : '') || 'https://drive.google.com';
      return {
        name: matName,
        type: matType,
        url: matUrl
      };
    });

    const waName = (document.getElementById('mod-form-wa-name') && document.getElementById('mod-form-wa-name').value) ? document.getElementById('mod-form-wa-name').value : ('Khusus peserta ' + title);
    const waLink = (document.getElementById('mod-form-wa-link') && document.getElementById('mod-form-wa-link').value) ? document.getElementById('mod-form-wa-link').value : 'https://chat.whatsapp.com/';
    const summaryText = (document.getElementById('mod-form-summary-text') && document.getElementById('mod-form-summary-text').value) ? document.getElementById('mod-form-summary-text').value : desc;

    const courseObj = {
      title: title,
      shortTitle: title.length > 45 ? (title.slice(0, 42) + '...') : title,
      poster: bannerUrl,
      materialsCount: inputMatCount || materials.length || 1,
      summary: summaryText,
      waGroupTitle: waName,
      waGroupLink: waLink,
      episodes: episodes.length > 0 ? episodes : [
        { title: 'Step 1 - ' + title, duration: durationText, summary: summaryText }
      ],
      materials: materials
    };

    const courseMap = typeof getActiveCourseEpisodesMap === 'function' ? getActiveCourseEpisodesMap() : COURSE_EPISODES_MAP;
    courseMap[id] = courseObj;
    COURSE_EPISODES_MAP[id] = courseObj;
    try {
      localStorage.setItem('etalaseku_course_episodes_map', JSON.stringify(courseMap));
    } catch (err) {}
  } else {
    // Process Documents & PRD (Foto 2 - Akses Produk)
    const mainBadgeVal = (document.getElementById('mod-doc-badge-label') ? document.getElementById('mod-doc-badge-label').value.trim() : '') || ('Dokumen ' + title);
    const docContainer = document.getElementById('mod-documents-container');
    const docRows = docContainer ? Array.from(docContainer.querySelectorAll('.crm-row-builder-item')) : [];
    const docFiles = docRows.map((row, idx) => {
      const dName = (row.querySelector('.doc-item-name') ? row.querySelector('.doc-item-name').value.trim() : '') || ('Dokumen Materi ' + (idx + 1));
      const cleanDName = dName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
      let dFilename = (row.querySelector('.doc-item-filename') ? row.querySelector('.doc-item-filename').value.trim() : '') || ('Dokumen_' + cleanDName + '.md');
      if (!dFilename.includes('.')) dFilename += '.md';
      const dBadge = (row.querySelector('.doc-item-badge') ? row.querySelector('.doc-item-badge').value.trim() : '') || mainBadgeVal;
      const dSize = (row.querySelector('.doc-item-size') ? row.querySelector('.doc-item-size').value.trim() : '') || '0.01 MB';
      const dUrl = (row.querySelector('.doc-item-url') ? row.querySelector('.doc-item-url').value.trim() : '') || 'https://drive.google.com';
      const dContent = (row.querySelector('.doc-item-content') ? row.querySelector('.doc-item-content').value.trim() : '') || ('# Dokumen: ' + dName);
      return {
        name: dName,
        filename: dFilename,
        badge: dBadge,
        size: dSize,
        url: dUrl,
        content: dContent
      };
    });

    const pkgFiles = (document.getElementById('mod-doc-pkg-files') && document.getElementById('mod-doc-pkg-files').value) ? document.getElementById('mod-doc-pkg-files').value : ((inputMatCount || docFiles.length || 10) + ' berkas');
    const pkgFormat = (document.getElementById('mod-doc-pkg-format') && document.getElementById('mod-doc-pkg-format').value) ? document.getElementById('mod-doc-pkg-format').value : ((inputMatCount || docFiles.length || 10) + ' Dokumen');
    const subTitle = (document.getElementById('mod-doc-subtitle') && document.getElementById('mod-doc-subtitle').value) ? document.getElementById('mod-doc-subtitle').value : (desc || 'Silahkan Download PRD yang dibutuhkan sebagai Referensi');

    const secHeadingInput = document.getElementById(isInline ? 'inline-doc-sec-heading-input' : 'mod-doc-sec-heading-input');
    const secTitle = secHeadingInput ? secHeadingInput.value.trim() : 'Paket Dokumen & Berkas';
    const listHeadingInput = document.getElementById('mod-doc-list-heading-input');
    const listTitle = listHeadingInput ? listHeadingInput.value.trim() : 'Daftar paket Dokumen';

    const validLinksCount = docFiles.filter(f => f.url && f.url.trim() && f.url !== '#' && !f.url.startsWith('javascript:')).length;
    const finalLinksCount = validLinksCount > 0 ? validLinksCount : (docFiles[0] && docFiles[0].url ? 1 : 1);
    const mainDocUrl = (docFiles[0] && docFiles[0].url) ? docFiles[0].url : 'https://drive.google.com/drive/folders/1lzVZt5E57RzmQ8ipcBgraukC8YIwYWwR/';
    formattedModule.URL_Konten = mainDocUrl;

    const docObj = {
      title: title,
      subtitle: subTitle,
      banner: bannerUrl,
      sectionTitle: secTitle || 'Paket Dokumen & Berkas',
      listTitle: listTitle || 'Daftar paket Dokumen',
      totalFiles: docFiles.length || inputMatCount || 1,
      totalLinks: finalLinksCount,
      pkgFilesText: (docFiles.length || inputMatCount || 1) + ' berkas',
      pkgFormatText: pkgFormat,
      url: mainDocUrl,
      badge: (document.getElementById('mod-doc-badge-label') ? document.getElementById('mod-doc-badge-label').value.trim() : '') || ('Dokumen ' + title),
      files: docFiles.length > 0 ? docFiles : [
        {
          name: title,
          filename: 'Dokumen_' + title.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_') + '.md',
          badge: (document.getElementById('mod-doc-badge-label') ? document.getElementById('mod-doc-badge-label').value.trim() : '') || ('Dokumen ' + title),
          size: '0.01 MB',
          url: 'https://drive.google.com',
          content: '# Dokumen: ' + title + '\n\n## 1. Ringkasan Eksekutif\n' + (desc || 'Dokumen materi, panduan teknis, dan implementasi referensi lengkap.') + '\n\n## 2. Poin Utama Pembelajaran & Berkas\n- Modul Pembelajaran Terverifikasi\n- Repositori dan Berkas Referensi\n- Panduan Implementasi Langkah demi Langkah'
        }
      ]
    };

    const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
    docMap[id] = docObj;
    DOCUMENT_FILES_MAP[id] = docObj;
    try {
      localStorage.setItem('etalaseku_document_files_map', JSON.stringify(docMap));
    } catch (err) {}
  }

  // Update STATE.modules & simpan ke kedua key localStorage secara permanen
  if (!Array.isArray(STATE.modules)) STATE.modules = loadStoredClassroomModules();
  saveDeletedModuleIds(getDeletedModuleIds().filter(delId => delId !== id));
  const existingIdx = STATE.modules.findIndex(m => m.ID_Materi === id);
  if (existingIdx >= 0) {
    STATE.modules[existingIdx] = formattedModule;
  } else {
    STATE.modules.push(formattedModule);
  }

  STATE.modules.sort((a, b) => (Number(a.Urutan) || 0) - (Number(b.Urutan) || 0));
  persistClassroomModules(STATE.modules);

  // Sync non-blocking ke GAS jika backend tersedia
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveClassroomModule', token: STATE.adminToken, data: formattedModule })
    }).catch(err => console.warn('Sync modul ke GAS:', err));
  }

  renderClassroomModulesAdmin();
  renderClassroomPortalModules('', 'ALL');

  // If this module is currently opened in classroom, update the view live
  if (typeof activeCourseData !== 'undefined' && activeCourseData && activeCourseData.id === id) {
    openCourseClassroomView(id);
  } else if (typeof activeDocData !== 'undefined' && activeDocData && activeDocData.id === id) {
    openDocumentPackageView(id);
  }

  closeAllModals();
  if (typeof showToast === 'function') {
    showToast('Modul berhasil disimpan dan terhubung langsung ke Ruang Belajar & Akses Produk! 🚀', 'info');
  }
}

function deleteClassroomModuleAdmin(id) {
  if (!id) return;

  // 1. Catat ID ke daftar terhapus permanen agar saat refresh tidak pernah muncul kembali
  const deletedIds = getDeletedModuleIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    saveDeletedModuleIds(deletedIds);
  }

  // 2. Filter dari STATE.modules & simpan sinkron ke etalaseku_classroom_modules DAN etalaseku_modules
  const currentMods = Array.isArray(STATE.modules) ? STATE.modules : loadStoredClassroomModules();
  const updatedMods = currentMods.filter(m => m && m.ID_Materi !== id);
  persistClassroomModules(updatedMods);

  // 3. Bersihkan data terkait di map episode & dokumen lokal
  try {
    const savedCourseRaw = localStorage.getItem('etalaseku_course_episodes_map');
    if (savedCourseRaw) {
      const cMap = JSON.parse(savedCourseRaw);
      if (cMap && cMap[id]) {
        delete cMap[id];
        localStorage.setItem('etalaseku_course_episodes_map', JSON.stringify(cMap));
      }
    }
    const savedDocRaw = localStorage.getItem('etalaseku_document_files_map');
    if (savedDocRaw) {
      const dMap = JSON.parse(savedDocRaw);
      if (dMap && dMap[id]) {
        delete dMap[id];
        localStorage.setItem('etalaseku_document_files_map', JSON.stringify(dMap));
      }
    }
  } catch (e) {}

  // 4. Kirim penghapusan non-blocking ke backend GAS bila tersedia
  if (APP_CONFIG.GAS_URL && !APP_CONFIG.GAS_URL.includes('AKfycbw6H8jQ7iR5wUu9tJ8eEtalaseKu_Demo')) {
    fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'deleteClassroomModule', token: STATE.adminToken, data: { id: id } })
    }).catch(err => console.warn('Gagal delete modul di GAS:', err));
  }

  // 5. Render ulang seketika baik di CRM (Kartu Visual + Tabel + Badge) maupun di Portal Ruang BelajarKu Siswa!
  renderClassroomModulesAdmin();
  renderClassroomPortalModules('', 'ALL');
  showToast('Modul berhasil dihapus permanen dari CRM & Portal Ruang BelajarKu! 🗑️', 'info');
}

function previewModuleFromCrm(moduleId, isDoc) {
  closeAdminPortal();
  localStorage.setItem('etalaseku_is_in_crm', 'false');
  openClassroomDashboard();
  if (isDoc) {
    openDocumentPackageView(moduleId);
  } else {
    openCourseClassroomView(moduleId);
  }
}
window.previewModuleFromCrm = previewModuleFromCrm;

// ============================================================================
// 9. UTILITIES & MODAL HELPERS
// ============================================================================
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('active');
    m.style.display = '';
  });
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getFallbackMockData() {
  return {
    settings: {
      announcement_bar_text: '🔥 DISKON 50% - Akses Seumur Hidup Batch 3 Terbatas Hanya 50 Orang!',
      wa_cs_number: '6287894602627',
      link_komunitas_tg: '',
      rekening_pembayaran: 'BCA: 5540732461 a/n Muhammad Daffa Fazdian'
    },
    products: [
      {
        ID_Produk: 'PRD-1028-02',
        Nama_Produk: 'Kumpulan PRD',
        Kategori: 'Template Bisnis',
        Deskripsi: 'Kumpulan template & contoh riil Product Requirement Document (PRD) siap pakai untuk Product Manager, UI/UX, dan Developer. Dilengkapi struktur standar industri untuk mempercepat pembuatan dokumentasi produk digital.',
        Harga_Normal: 149000,
        Harga_Promo: 49000,
        Banner_URL: 'kumpulan-prd-banner.jpg',
        Galeri_URLs: '',
        Batch_Aktif: 1,
        Maks_Kuota_Batch: 1000,
        Status: 'Publish',
        Link_Akses_Materi: 'https://drive.google.com/file/d/19LUSJgmNJo7pbdUsn4-6r-tNQFEUjzgZ/view?usp=sharing'
      },
      {
        ID_Produk: 'PRD-000',
        Nama_Produk: 'Social Influence',
        Kategori: 'Template Bisnis',
        Deskripsi: 'Pemateri: Dr. Dasep Suryanto, AT., SH., MM., MIKom., PhD. (Inisiatif Kemnaker & GNIK) Ringkasan: Dalam lanskap karier modern, kompetensi teknis (hard skills) membuka pintu kesempatan, namun kecakapan pengaruh sosial (social influence) yang menentukan seberapa jauh Anda mampu melangkah dan memimpin. Modul panduan ini merangkum strategi esensial bagaimana membangun pengaruh positif tanpa bergantung semata pada jabatan hierarki.',
        Harga_Normal: 259000,
        Harga_Promo: 25000,
        Banner_URL: 'social-influence-banner.jpg',
        Galeri_URLs: '',
        Batch_Aktif: 1,
        Maks_Kuota_Batch: 50,
        Status: 'Publish',
        Link_Akses_Materi: 'https://drive.google.com/file/d/1BeH_fPc2UEY5gFmjpi4dnuLzmiTernOR/view'
      }
    ],
    testimonials: [
      {
        ID_Testimoni: 'TST-001',
        Nama_Member: 'Aditya Pratama',
        Profesi: 'Freelance Developer',
        Rating: 5,
        Isi_Ulasan: 'Materi GAS Pro Masterclass sangat aplikatif! Saya berhasil membuat sistem CRM Lawfirm untuk klien dan langsung dibayar 15 juta dalam 2 minggu.',
        Hasil_Pencapaian: 'Closing Proyek Rp 15 Jt',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-002',
        Nama_Member: 'Sarah Amalia',
        Profesi: 'Digital Agency Owner',
        Rating: 5,
        Isi_Ulasan: 'Sistem otomatisasi pengiriman kuitansi dan WhatsApp ini menghemat waktu tim CS kami hingga 90%. Tidak ada lagi komplain akses lambat!',
        Hasil_Pencapaian: 'Hemat 90% Waktu CS',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      },
      {
        ID_Testimoni: 'TST-003',
        Nama_Member: 'Rian Hidayat',
        Profesi: 'Pemilik UMKM Retail',
        Rating: 5,
        Isi_Ulasan: 'Template Notion OS dan modul penagihan siswa sangat rapi. Penagihan SPP bulanan di tempat bimbel saya jadi 100% otomatis tercatat di Spreadsheet.',
        Hasil_Pencapaian: '100% Otomatisasi SPP',
        Foto_Avatar_URL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      }
    ],
    showcases: [
      {
        Nama_Karya: 'Lawfirm Client Management CRM',
        Nama_Member: 'Karya Aditya — Alumni Batch 2',
        Statistik_Pencapaian: '2.450+ Leads Tercatat',
        Gambar_Preview_URL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
      },
      {
        Nama_Karya: 'Sistem Kuitansi & Invoice Toko Online',
        Nama_Member: 'Karya Sarah — Alumni Batch 1',
        Statistik_Pencapaian: '10x Lebih Cepat',
        Gambar_Preview_URL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  };
}

// Inisialisasi Aplikasi saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
  // 1. Prioritaskan render konten kritis (FCP & LCP)
  renderAnnouncementBar();
  loadPublicData();
  SlideshowManager.initHeroSlideshow();
  initAdminAccounts();
  updateHeroCtaButtons();

  // 2. Tunda animasi kursor 3D ke waktu senggang (idle) agar Total Blocking Time (TBT) = 0ms
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => new ButterflyCursor());
  } else {
    setTimeout(() => new ButterflyCursor(), 300);
  }

  // 1. Bersihkan semua overlay modal saat inisialisasi agar layar tidak buram
  closeAllModals();

  // 2. Cek sesi login siswa member classroom dari LocalStorage
  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');
  const isInClassroom = localStorage.getItem('etalaseku_is_in_classroom') === 'true';
  if (savedOrderId || savedEmail) {
    updateMemberClassroomNavbar(savedOrderId, savedEmail);
    if (isInClassroom) {
      openClassroomDashboard(savedOrderId, savedEmail);
    }
  }

  // 2. Cek sesi CRM Admin saat refresh browser agar tetap berada di Portal CRM
  const savedAdminToken = localStorage.getItem('etalaseku_admin_token');
  const isInCrm = localStorage.getItem('etalaseku_is_in_crm');
  if (savedAdminToken && isInCrm === 'true') {
    STATE.adminToken = savedAdminToken;
    STATE.adminEmail = localStorage.getItem('etalaseku_admin_email') || 'admin@etalaseku.com';
    STATE.adminRole = localStorage.getItem('etalaseku_admin_role') || 'SUPER_ADMIN';
    
    openAdminPortal();
    
    const lastTab = localStorage.getItem('etalaseku_admin_active_tab') || 'tab-dashboard';
    const navBtn = document.querySelector(`.admin-nav-item[onclick*="${lastTab}"]`);
    switchAdminTab(lastTab, navBtn);
  } else if (localStorage.getItem('etalaseku_is_in_classroom') === 'true' && (savedOrderId || savedEmail)) {
    openClassroomDashboard(savedOrderId, savedEmail);
  }
});


// ============================================================================
// 13. DEDICATED SHOWCASE & PAMERAN KARYA MEMBER PORTAL (FOTO 4 & 5)
// ============================================================================
function openPameranKaryaPortal() {
  closeAllModals();
  const portal = document.getElementById('pameran-karya-portal');
  if (portal) {
    portal.classList.add('active');
    portal.scrollTop = 0;
  }
  renderPameranKaryaPortal();
}
window.openPameranKaryaPortal = openPameranKaryaPortal;

function closePameranKaryaPortal() {
  const portal = document.getElementById('pameran-karya-portal');
  if (portal) portal.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.closePameranKaryaPortal = closePameranKaryaPortal;

function renderPameranKaryaPortal(filterCat = 'Semua') {
  // 1. Render Section Pengajuan Saya (Foto 4)
  const mySubContainer = document.getElementById('my-submissions-container');
  if (mySubContainer) {
    if (!STATE.myShowcases || STATE.myShowcases.length === 0) {
      mySubContainer.innerHTML = `
        <div style="text-align:center; padding:20px; background:#F8FAFC; border-radius:12px; border:1px dashed #CBD5E1;">
          <p style="font-size:12.5px; color:#64748B; margin:0 0 10px;">Anda belum mengajukan karya ke pameran. Tampilkan portofolio terbaik Anda sekarang!</p>
          <button class="shimmer-btn" onclick="openSubmitShowcaseModal()" style="padding:8px 18px; font-size:12.5px;">+ Ajukan Karya Sekarang</button>
        </div>
      `;
    } else {
      mySubContainer.innerHTML = STATE.myShowcases.map(item => {
        const isApproved = item.Status === 'Tampil di Pameran';
        const badge = isApproved
          ? '<span style="background:#DCFCE7; color:#15803D; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px;">🟢 Tampil di Pameran</span>'
          : '<span style="background:#FEF3C7; color:#B45309; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px;">⏳ Menunggu Review Super Admin</span>';

        return `
          <div class="my-submission-card">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:10px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
                🖥️
              </div>
              <div>
                <h4 style="font-size:14px; font-weight:800; color:var(--deep-navy); margin:0 0 2px;">${item.Nama_Karya}</h4>
                <div style="font-size:11.5px; color:#64748B;">Diajukan: ${item.Tanggal || 'Hari ini'} • ${item.Profesi || 'Member'}</div>
              </div>
            </div>
            <div>
              ${badge}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render Gallery Cards (Foto 4)
  const galleryGrid = document.getElementById('pameran-gallery-grid');
  if (galleryGrid) {
    const list = (STATE.showcases && STATE.showcases.length > 0) ? STATE.showcases : DEFAULT_SHOWCASES_LIST;
    const filtered = filterCat === 'Semua' ? list : list.filter(item => (item.Kategori || '').toLowerCase().includes(filterCat.toLowerCase()));

    if (!filtered.length) {
      galleryGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#64748B;">Belum ada karya untuk kategori ini.</div>';
      return;
    }

    galleryGrid.innerHTML = filtered.map(s => {
      const demoBtn = s.Link_Demo ? `
        <a href="${s.Link_Demo}" target="_blank" rel="noopener noreferrer" class="btn-pameran-demo" title="Buka Live Demo">
          🌐 Demo Live ↗
        </a>` : '';

      const ytBtn = s.Video_Youtube ? `
        <button type="button" class="btn-pameran-yt" onclick="openYouTubeShowcaseModal('${s.Video_Youtube}', '${escapeHtml(s.Nama_Karya)}', '${escapeHtml(s.Nama_Member)}')" title="Tonton Video Demo YouTube">
          ▶️ Video YouTube
        </button>` : '';

      return `
        <div class="pameran-card">
          <div class="pameran-card-thumb-wrap">
            <img src="${formatImageUrl(s.Gambar_Preview_URL)}" class="pameran-card-thumb" alt="${s.Nama_Karya}">
            <span style="position:absolute; top:12px; left:12px; background:var(--deep-navy); color:#FFFFFF; padding:4px 10px; border-radius:99px; font-size:11px; font-weight:800; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
              ${s.Statistik_Pencapaian || 'Hasil Karya'}
            </span>
          </div>
          <div class="pameran-card-content">
            <div class="pameran-card-author-row">
              
              <div>
                <div style="font-size:12.5px; font-weight:800; color:var(--deep-navy);">${s.Nama_Member}</div>
                <div style="font-size:10.5px; color:#64748B;">${s.Profesi || 'Alumni Member'}</div>
              </div>
            </div>
            <h3 style="font-size:16px; font-weight:800; margin:0 0 6px; color:var(--deep-navy); line-height:1.3;">${s.Nama_Karya}</h3>
            <p style="font-size:12px; color:#64748B; margin:0 0 14px; line-height:1.5;">${s.Testimoni_Kesan || 'Sistem bisnis dan web app yang dibangun menggunakan Google Workspace & teknologi modern.'}</p>
            <div class="pameran-card-actions">
              ${demoBtn}
              ${ytBtn}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}
window.renderPameranKaryaPortal = renderPameranKaryaPortal;

function filterPameranCategory(cat, btn) {
  const buttons = document.querySelectorAll('.pameran-filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPameranKaryaPortal(cat);
}
window.filterPameranCategory = filterPameranCategory;

function openSubmitShowcaseModal() {
  closeAllModals();
  const modal = document.getElementById('modal-showcase-submit');
  if (modal) modal.classList.add('active');
}
window.openSubmitShowcaseModal = openSubmitShowcaseModal;

let tempShowcaseAvatar = '';
let tempShowcaseImg = '';

async function handleShowcaseAvatarSelect(input) {
  if (input.files && input.files[0]) {
    try {
      tempShowcaseAvatar = await compressAndReadImage(input.files[0], 250, 0.85);
      const preview = document.getElementById('user-showcase-avatar-preview');
      if (preview) {
        preview.innerHTML = `<img src="${tempShowcaseAvatar}" style="width:100%; height:100%; object-fit:cover;">`;
      }
      showToast('Foto profil berhasil dipilih!', 'info', 2000);
    } catch (err) {
      showToast('Gagal memproses foto profil: ' + err.message, 'error');
    }
  }
}
window.handleShowcaseAvatarSelect = handleShowcaseAvatarSelect;

async function handleShowcaseImgSelect(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    try {
      const dataUrl = await compressAndReadImage(file, 1000, 0.85);
      tempShowcaseImg = dataUrl;
      const label = document.getElementById('user-showcase-img-label');
      if (label) label.innerHTML = `<span style="color:#10B981; font-weight:800;">✓ ${escapeHtml(file.name)}</span>`;
      const previewBox = document.getElementById('user-showcase-img-preview-box');
      const previewEl = document.getElementById('user-showcase-img-preview-el');
      if (previewBox && previewEl) {
        previewEl.src = dataUrl;
        previewBox.style.display = 'block';
      }
      showToast('Gambar / Mockup berhasil dipilih & siap disimpan ke CRM! 🖼️', 'success', 2500);
    } catch (err) {
      showToast('Gagal memproses gambar: ' + err.message, 'error', 3000);
    }
  }
}
window.handleShowcaseImgSelect = handleShowcaseImgSelect;

async function handleUserSubmitShowcase(e) {
  e.preventDefault();
  const title = (document.getElementById('user-showcase-title') ? document.getElementById('user-showcase-title').value : '').trim();
  const profession = (document.getElementById('user-showcase-profession') ? document.getElementById('user-showcase-profession').value : '').trim();
  const classEl = document.getElementById('user-showcase-class');
  const className = classEl ? classEl.value : 'GAS Pro Web App Masterclass';
  const author = (document.getElementById('user-showcase-author') ? document.getElementById('user-showcase-author').value : '').trim();
  const story = (document.getElementById('user-showcase-story') ? document.getElementById('user-showcase-story').value : '').trim();
  const demoLink = (document.getElementById('user-showcase-demo-link') ? document.getElementById('user-showcase-demo-link').value : '').trim();
  const ytLink = (document.getElementById('user-showcase-youtube-link') ? document.getElementById('user-showcase-youtube-link').value : '').trim();

  // Pastikan bila file dipilih di input file langsung terkompres
  const fileInput = document.getElementById('user-showcase-img-file');
  if (!tempShowcaseImg && fileInput && fileInput.files && fileInput.files[0]) {
    try {
      tempShowcaseImg = await compressAndReadImage(fileInput.files[0], 1000, 0.85);
    } catch(err) {}
  }

  const finalImg = formatImageUrl(tempShowcaseImg);

  const btn = document.getElementById('btn-submit-user-showcase');
  if (btn) {
    btn.innerHTML = 'Menyimpan ke CRM... ⏳';
    btn.disabled = true;
  }

  try {
    const newId = 'SHW-' + Date.now();
    const newSubmission = {
      ID_Showcase: newId,
      ID_Portofolio: newId,
      Nama_Karya: title || 'Aplikasi Web & Sistem Bisnis',
      Nama_Member: author || 'Member Siswa',
      Profesi: profession || 'Alumni Member',
      Kategori: className.includes('GAS') ? 'Web App GAS' : (className.includes('CRM') ? 'CRM & Otomasi' : 'Kasir & Billing'),
      Kelas_Diikuti: className,
      Statistik_Pencapaian: 'Karya Baru Member',
      Gambar_Preview_URL: finalImg,
      Foto_Profil: tempShowcaseAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      Testimoni_Kesan: story || 'Sistem bisnis nyata yang dibangun dengan Google Workspace & Web App modern.',
      Link_Demo: demoLink,
      Tautan_Live: demoLink,
      Video_Youtube: ytLink,
      Tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      Status: 'Menunggu Review Admin',
      Status_Tampil: 'Draft'
    };

    if (!Array.isArray(STATE.myShowcases)) STATE.myShowcases = [];
    STATE.myShowcases.unshift(newSubmission);
    localStorage.setItem('etalaseku_my_showcases', JSON.stringify(STATE.myShowcases));

    if (!Array.isArray(STATE.showcases)) STATE.showcases = [];
    STATE.showcases.unshift(newSubmission);
    localStorage.setItem('etalaseku_showcases_data', JSON.stringify(STATE.showcases));

    // Reset temp state
    tempShowcaseImg = '';
    tempShowcaseAvatar = '';

    closeAllModals();
    showToast('🎉 Pengajuan karya berhasil disimpan ke sistem CRM! Siap diverifikasi oleh Super Admin & Admin.', 'success', 4500);

    // Refresh views
    renderShowcases();
    renderPameranKaryaPortal();
    renderAdminShowcaseTable(STATE.showcases);
  } catch (err) {
    showToast('Gagal mengajukan karya: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.innerHTML = 'Kirim Pengajuan';
      btn.disabled = false;
    }
  }
}
window.handleUserSubmitShowcase = handleUserSubmitShowcase;

// 4. Modal YouTube Video Player
function openYouTubeShowcaseModal(ytUrl, title, author) {
  closeAllModals();
  const modal = document.getElementById('modal-showcase-youtube');
  const iframe = document.getElementById('youtube-player-iframe');
  const titleEl = document.getElementById('youtube-modal-title');
  const authorEl = document.getElementById('youtube-modal-author');

  if (!modal || !iframe) return;

  // Ekstrak YouTube ID
  let videoId = '';
  const match = ytUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }

  if (videoId) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else {
    iframe.src = ytUrl;
  }

  if (titleEl) titleEl.textContent = title || 'Video Demo Showcase';
  if (authorEl) authorEl.textContent = author ? 'Oleh: ' + author : '';

  modal.classList.add('active');
}
window.openYouTubeShowcaseModal = openYouTubeShowcaseModal;

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'");
}
window.escapeHtml = escapeHtml;

function updateShowcaseStoryCounter(textarea) {
  const countEl = document.getElementById('user-showcase-story-count');
  if (countEl && textarea) {
    countEl.textContent = textarea.value.length;
    if (textarea.value.length >= 30) {
      countEl.style.color = '#10B981';
      countEl.style.fontWeight = '700';
    } else {
      countEl.style.color = '#64748B';
      countEl.style.fontWeight = 'normal';
    }
  }
}
window.updateShowcaseStoryCounter = updateShowcaseStoryCounter;


// ============================================================================
// IN-APP PROOF VIEWER MODAL
// ============================================================================
function openProofModal(orderId) {
  const orders = getMergedOrdersList();
  const order = orders.find(o => (o.ID_Order === orderId || o.orderId === orderId));
  if (!order) {
    showToast('Data pesanan tidak ditemukan.', 'error');
    return;
  }

  const modal = document.getElementById('modal-proof-viewer');
  const subEl = document.getElementById('proof-modal-subtitle');
  const imgEl = document.getElementById('proof-modal-img');
  const actEl = document.getElementById('proof-modal-actions');

  if (subEl) {
    subEl.innerHTML = `<strong>${order.ID_Order}</strong> • ${order.Nama_Pembeli || order.nama || 'Pembeli'} &bull; <span style="color:var(--deep-navy); font-weight:800;">Rp ${Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID')}</span>`;
  }

  let proofSrc = order.Bukti_Transfer_URL || order.fileBase64 || '';
  if (!proofSrc || proofSrc.startsWith('Gagal upload') || proofSrc.length < 10) {
    proofSrc = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';
  } else {
    proofSrc = formatImageUrl(proofSrc);
  }

  if (imgEl) {
    imgEl.src = proofSrc;
    imgEl.onerror = function() {
      this.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';
    };
  }

  if (actEl) {
    const isLunas = order.Status_Bayar === 'Lunas';
    if (!isLunas) {
      actEl.innerHTML = `
        <button type="button" class="shimmer-btn" style="padding:10px 20px; font-size:13px; font-weight:700;" onclick="verifyOrderAdmin('${order.ID_Order}', 'Lunas'); closeAllModals();">
          🚀 Verifikasi Lunas Sekarang
        </button>
        <button type="button" class="btn-secondary" style="padding:10px 16px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" onclick="openProofImageInNewWindow('${order.ID_Order}')">
          🔍 Buka Gambar Penuh (Tab Baru)
        </button>
        <button type="button" class="btn-secondary" style="padding:10px 18px; font-size:13px;" onclick="closeAllModals()">
          Tutup
        </button>
      `;
    } else {
      actEl.innerHTML = `
        <span style="color:#10B981; font-weight:800; font-size:13px; padding:8px 12px; background:#DCFCE7; border-radius:8px;">
          ✓ Pembayaran Ini Sudah Terverifikasi Lunas
        </span>
        <button type="button" class="btn-secondary" style="padding:10px 18px; font-size:13px;" onclick="closeAllModals()">
          Tutup
        </button>
      `;
    }
  }

  if (modal) modal.classList.add('active');
}
window.openProofModal = openProofModal;

function openProofImageInNewWindow(orderId) {
  const orders = getMergedOrdersList();
  const order = orders.find(o => (o.ID_Order === orderId || o.orderId === orderId));
  let proofSrc = order ? (order.Bukti_Transfer_URL || order.fileBase64 || '') : '';
  if (!proofSrc || proofSrc.startsWith('Gagal upload') || proofSrc.length < 10) {
    proofSrc = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80';
  } else {
    proofSrc = formatImageUrl(proofSrc);
  }
  const w = window.open('', '_blank');
  if (w) {
    const oId = order ? (order.ID_Order || '') : '';
    const oName = order ? (order.Nama_Pembeli || order.nama || '') : '';
    const oTotal = order ? Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID') : '0';
    w.document.write(`<!DOCTYPE html><html><head><title>Bukti Transfer - ${oId}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{margin:0;padding:24px;background:#0B0F19;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,-apple-system,sans-serif;color:#fff;}img{max-width:95vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.6);border:2px solid #334155;}.meta{margin-top:16px;text-align:center;font-size:13px;color:#94A3B8;}.title{font-size:15px;font-weight:700;color:#F8FAFC;margin-bottom:4px;}</style></head><body><img src="${proofSrc}" alt="Bukti Transfer"><div class="meta"><div class="title">Bukti Transfer: ${oName} &bull; Rp ${oTotal}</div><div>Order ID: ${oId} &bull; EtalaseKu CRM Verified</div></div></body></html>`);
    w.document.close();
  }
}
window.openProofImageInNewWindow = openProofImageInNewWindow;



// ============================================================================
// STRUK KUITANSI RESMI & PDF GENERATOR (PAYMENT SUCCESSFUL - FOTO 2)
// ============================================================================
function openReceiptSuccessModal(orderId) {
  const orders = getMergedOrdersList();
  const order = orders.find(o => (o.ID_Order === orderId || o.orderId === orderId));
  if (!order) {
    showToast('Data kuitansi pesanan tidak ditemukan.', 'error');
    return;
  }

  STATE.activeReceiptOrder = order;

  // Isi data ke modal struk
  const ordEl = document.getElementById('receipt-order-id');
  if (ordEl) ordEl.textContent = order.ID_Order;

  const dateEl = document.getElementById('receipt-order-date');
  if (dateEl) dateEl.textContent = order.Tanggal_Waktu || order.tanggal || new Date().toLocaleDateString('id-ID');

  const payMethodEl = document.getElementById('receipt-payment-method');
  if (payMethodEl) payMethodEl.textContent = order.paymentMethod || 'Transfer Bank / e-Wallet';

  const amountEl = document.getElementById('receipt-total-amount');
  if (amountEl) amountEl.textContent = 'Rp ' + Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID');

  const nameEl = document.getElementById('receipt-buyer-name');
  if (nameEl) nameEl.textContent = order.Nama_Pembeli || order.nama || 'Siswa Member';

  const emailEl = document.getElementById('receipt-buyer-email');
  if (emailEl) emailEl.textContent = order.Email || order.email || '-';

  const phoneEl = document.getElementById('receipt-buyer-phone');
  if (phoneEl) phoneEl.textContent = order.No_WhatsApp || order.whatsapp || '-';

  const prodEl = document.getElementById('receipt-product-name');
  if (prodEl) prodEl.textContent = order.productName || order.Nama_Produk || order.ID_Produk || 'Kelas Digital EtalaseKu';

  closeAllModals();
  const modal = document.getElementById('modal-receipt-success');
  if (modal) modal.classList.add('active');
}
window.openReceiptSuccessModal = openReceiptSuccessModal;

function downloadReceiptPdf() {
  const order = STATE.activeReceiptOrder;
  if (!order) {
    showToast('Pilih pesanan untuk mengunduh struk.', 'error');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const receiptContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Kuitansi_${order.ID_Order}</title>
      <style>
        @page { size: auto; margin: 15mm; }
        body {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #0F172A;
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
        }
        .header { text-align: center; border-bottom: 2px dashed #CBD5E1; padding-bottom: 16px; margin-bottom: 18px; }
        .logo { font-size: 18px; font-weight: 800; color: #0F172A; letter-spacing: -0.3px; }
        .sub { font-size: 11.5px; color: #64748B; margin-top: 3px; }
        .status-badge {
          display: inline-block;
          background: #DCFCE7;
          color: #15803D;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 800;
          margin-top: 10px;
        }
        .section-title {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #94A3B8;
          letter-spacing: 0.8px;
          margin: 14px 0 8px;
        }
        .row { display: flex; justify-content: space-between; margin-bottom: 7px; font-size: 13px; }
        .label { color: #64748B; }
        .val { font-weight: 700; text-align: right; }
        .divider { border-top: 2px dashed #E2E8F0; margin: 14px 0; }
        .total-row { border-top: 2px dashed #0F172A; padding-top: 10px; margin-top: 10px; font-size: 15px; }
        .footer { text-align: center; font-size: 11px; color: #94A3B8; margin-top: 22px; border-top: 1px solid #F1F5F9; padding-top: 12px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ETALASEKU DIGITAL HUB &amp; ACADEMY</div>
        <div class="sub">Kuitansi Pembayaran &amp; Akses Kelas Digital Resmi</div>
        <div class="status-badge">✓ PAYMENT SUCCESSFUL (LUNAS)</div>
      </div>

      <div class="section-title">Detail Transaksi</div>
      <div class="row"><span class="label">Order ID:</span><span class="val">${order.ID_Order}</span></div>
      <div class="row"><span class="label">Tanggal:</span><span class="val">${order.Tanggal_Waktu || '-'}</span></div>
      <div class="row"><span class="label">Metode Bayar:</span><span class="val">${order.paymentMethod || 'Transfer'}</span></div>
      <div class="row"><span class="label">Status:</span><span class="val" style="color:#10B981;">Lunas &amp; Terverifikasi</span></div>

      <div class="divider"></div>

      <div class="section-title">Data Siswa &amp; Produk</div>
      <div class="row"><span class="label">Nama Lengkap:</span><span class="val">${order.Nama_Pembeli || order.nama}</span></div>
      <div class="row"><span class="label">Email:</span><span class="val">${order.Email || order.email}</span></div>
      <div class="row"><span class="label">WhatsApp:</span><span class="val">${order.No_WhatsApp || order.whatsapp}</span></div>
      <div class="row"><span class="label">Produk:</span><span class="val">${order.productName || order.Nama_Produk || 'Kelas Digital'}</span></div>

      <div class="row total-row">
        <span class="label" style="font-weight:800; color:#0F172A;">Total Biaya:</span>
        <span class="val" style="color:#059669; font-size:18px;">Rp ${Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID')}</span>
      </div>

      <div class="footer">
        <p>Akses materi kelas seumur hidup di: <strong>https://etalaseku-gules.vercel.app</strong><br>
        Masukkan Email atau Order ID Anda pada menu Member Area untuk mulai belajar.</p>
        <p style="font-size:10px;">ID Transaksi Sah Terverifikasi &bull; EtalaseKu Hub 2026</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(receiptContent);
  printWindow.document.close();
}
window.downloadReceiptPdf = downloadReceiptPdf;

function sendReceiptToStudentWhatsApp() {
  const order = STATE.activeReceiptOrder;
  if (!order) {
    showToast('Pilih pesanan untuk mengirim WhatsApp.', 'error');
    return;
  }

  let phone = String(order.No_WhatsApp || order.whatsapp || '').replace(/\D/g, '');
  if (phone.startsWith('0')) phone = '62' + phone.slice(1);
  if (!phone.startsWith('62')) phone = '62' + phone;

  const waMsg = encodeURIComponent(
    `*KUITANSI PEMBAYARAN RESMI - NEXSTORE PRODUK DIGITAL - BY @DAFFAFAZDIAN.ID*\n` +
    `======================================\n` +
    `Status: *PAYMENT SUCCESSFUL (LUNAS)* ✅\n\n` +
    `Halo kak *${order.Nama_Pembeli || order.nama || 'Siswa'}*,\n` +
    `Pembayaran Anda telah BERHASIL DIVERIFIKASI LUNAS oleh Super Admin & Admin EtalaseKu.\n\n` +
    `🧾 *Rincian Pembayaran:*\n` +
    `• Order ID (Produk): *${order.ID_Order}*\n` +
    `• Tanggal Transaksi: *${order.Tanggal_Waktu || '-'}*\n` +
    `• Produk Digital: *${order.productName || order.Nama_Produk || 'Kelas Digital'}*\n` +
    `• Biaya Produk: *Rp ${Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID')}*\n` +
    `• Metode Bayar: *${order.paymentMethod || 'Transfer'}*\n` +
    `• Nama Lengkap: *${order.Nama_Pembeli || order.nama}*\n` +
    `• Email Terdaftar: *${order.Email || order.email}*\n` +
    `• Nomor WhatsApp: *${order.No_WhatsApp || order.whatsapp}*\n\n` +
    `🎓 *Akses Ruang BelajarKu:*\n` +
    `Kunjungi: https://etalaseku-gules.vercel.app\n` +
    `Masukkan Email atau Order ID Anda pada tombol *Member Area* untuk mulai belajar.\n\n` +
    `Terima kasih atas kepercayaannya!\n` +
    `Salam hangat,\n` +
    `*Super Admin & Tim EtalaseKu Hub*`
  );

  window.open(`https://wa.me/${phone}?text=${waMsg}`, '_blank');
  showToast('💬 WhatsApp web/app dibuka dengan struk kuitansi!', 'success', 3000);
}
window.sendReceiptToStudentWhatsApp = sendReceiptToStudentWhatsApp;

function sendReceiptToStudentGmail() {
  const order = STATE.activeReceiptOrder;
  if (!order) {
    showToast('Pilih pesanan untuk mengirim Gmail.', 'error');
    return;
  }

  const destEmail = order.Email || order.email || '';
  const destName = order.Nama_Pembeli || order.nama || 'Siswa';
  const prodName = order.productName || order.Nama_Produk || 'Kelas Digital EtalaseKu';
  const totalStr = Number(order.Total_Bayar || order.total || 0).toLocaleString('id-ID');

  const subject = encodeURIComponent(`Struk Kuitansi Pembayaran Lunas - Order ID: ${order.ID_Order} (${destName})`);
  const body = encodeURIComponent(
    `Halo ${destName},\n\n` +
    `Pembayaran Anda untuk ${prodName} telah BERHASIL DIVERIFIKASI LUNAS oleh Super Admin & Admin EtalaseKu.\n\n` +
    `==========================================\n` +
    `KUITANSI RESMI - NEXSTORE PRODUK DIGITAL - BY @DAFFAFAZDIAN.ID\n` +
    `==========================================\n` +
    `Status: PAYMENT SUCCESSFUL (LUNAS)\n` +
    `Order ID (Produk): ${order.ID_Order}\n` +
    `Tanggal Transaksi: ${order.Tanggal_Waktu || '-'}\n` +
    `Produk Digital: ${prodName}\n` +
    `Biaya Produk: Rp ${totalStr}\n` +
    `Metode Bayar: ${order.paymentMethod || 'Transfer'}\n` +
    `Nama Lengkap: ${destName}\n` +
    `Email Terdaftar: ${destEmail}\n` +
    `Nomor WhatsApp: ${order.No_WhatsApp || order.whatsapp}\n\n` +
    `DETAIL AKSES RUANG BELAJAR SISWA:\n` +
    `1. Buka website: https://etalaseku-gules.vercel.app\n` +
    `2. Klik menu "Member Area"\n` +
    `3. Masukkan Email (${destEmail}) atau Order ID (${order.ID_Order}) Anda\n` +
    `4. Seluruh video modul, repository code, dan spreadsheet siap dipelajari seumur hidup.\n\n` +
    `Terima kasih telah bergabung bersama EtalaseKu Digital Hub & Academy!\n\n` +
    `Salam hangat,\n` +
    `Super Admin & Tim EtalaseKu Hub`
  );

  window.open(`mailto:${destEmail}?subject=${subject}&body=${body}`, '_blank');
  showToast('📧 Draft Gmail kuitansi resmi disiapkan!', 'info', 3000);
}
window.sendReceiptToStudentGmail = sendReceiptToStudentGmail;


// ============================================================================
// UPLOAD FOTO DI FOLDER / URL GOOGLE DRIVE / UPLOAD FOTO (KATALOG PRODUK CRM)
// ============================================================================
async function handleInlineBannerFile(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    try {
      const dataUrl = await compressAndReadImage(file, 800, 0.70);
      const urlInput = document.getElementById('inline-prod-banner-url');
      if (urlInput) urlInput.value = dataUrl;
      const previewBox = document.getElementById('inline-prod-banner-preview');
      const previewImg = document.getElementById('inline-prod-banner-preview-img');
      const filenameEl = document.getElementById('inline-prod-banner-filename');
      if (previewBox && previewImg) {
        previewImg.src = dataUrl;
        if (filenameEl) filenameEl.textContent = '✓ ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
        previewBox.style.display = 'flex';
      }
      showToast('Foto banner dari folder berhasil dimuat! 🖼️', 'success', 2500);
    } catch (err) {
      showToast('Gagal memproses file foto: ' + err.message, 'error');
    }
  }
}
window.handleInlineBannerFile = handleInlineBannerFile;

function handleInlineBannerInput(val) {
  const previewBox = document.getElementById('inline-prod-banner-preview');
  const previewImg = document.getElementById('inline-prod-banner-preview-img');
  const filenameEl = document.getElementById('inline-prod-banner-filename');
  if (!val || val.trim().length < 5) {
    if (previewBox) previewBox.style.display = 'none';
    return;
  }
  const formatted = formatImageUrl(val);
  if (previewBox && previewImg) {
    previewImg.src = formatted;
    if (filenameEl) filenameEl.textContent = val.includes('drive.google.com') ? '✓ Google Drive Banner Terhubung' : '✓ Link Foto Banner Terhubung';
    previewBox.style.display = 'flex';
  }
}
window.handleInlineBannerInput = handleInlineBannerInput;

function clearInlineBannerPhoto() {
  const urlInput = document.getElementById('inline-prod-banner-url');
  if (urlInput) urlInput.value = '';
  const fileInput = document.getElementById('inline-prod-banner-file');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('inline-prod-banner-preview');
  if (previewBox) previewBox.style.display = 'none';
}
window.clearInlineBannerPhoto = clearInlineBannerPhoto;

async function handleModalBannerFile(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    try {
      const dataUrl = await compressAndReadImage(file, 800, 0.70);
      const urlInput = document.getElementById('prod-form-banner-url');
      if (urlInput) urlInput.value = dataUrl;
      const previewBox = document.getElementById('modal-prod-banner-preview');
      const previewImg = document.getElementById('modal-prod-banner-preview-img');
      const filenameEl = document.getElementById('modal-prod-banner-filename');
      if (previewBox && previewImg) {
        previewImg.src = dataUrl;
        if (filenameEl) filenameEl.textContent = '✓ ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
        previewBox.style.display = 'flex';
      }
      showToast('Foto banner dari folder berhasil dimuat! 🖼️', 'success', 2500);
    } catch (err) {
      showToast('Gagal memproses file foto: ' + err.message, 'error');
    }
  }
}
window.handleModalBannerFile = handleModalBannerFile;

function handleModalBannerInput(val) {
  const previewBox = document.getElementById('modal-prod-banner-preview');
  const previewImg = document.getElementById('modal-prod-banner-preview-img');
  const filenameEl = document.getElementById('modal-prod-banner-filename');
  if (!val || val.trim().length < 5) {
    if (previewBox) previewBox.style.display = 'none';
    return;
  }
  const formatted = formatImageUrl(val);
  if (previewBox && previewImg) {
    previewImg.src = formatted;
    if (filenameEl) filenameEl.textContent = val.includes('drive.google.com') ? '✓ Google Drive Banner Terhubung' : '✓ Link Foto Banner Terhubung';
    previewBox.style.display = 'flex';
  }
}
window.handleModalBannerInput = handleModalBannerInput;

function clearModalBannerPhoto() {
  const urlInput = document.getElementById('prod-form-banner-url');
  if (urlInput) urlInput.value = '';
  const fileInput = document.getElementById('prod-form-banner-file');
  if (fileInput) fileInput.value = '';
  const previewBox = document.getElementById('modal-prod-banner-preview');
  if (previewBox) previewBox.style.display = 'none';
}
window.clearModalBannerPhoto = clearModalBannerPhoto;


// ==========================================================================
// COURSE CLASSROOM & DOCUMENT FILES PORTAL LOGIC (Foto 2 & Foto 3)
// ==========================================================================

const COURSE_EPISODES_MAP = {
  'MOD-01': {
    title: 'METODE 3 | LANJUTAN - Integrasi GAS ke VERCEL [CLAUDE]',
    shortTitle: 'METODE 3 | LANJUTAN - Integrasi GAS ke VERCEL...',
    poster: './assets/modules/banner-video-metode3.jpg',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    materialsCount: 27,
    episodes: [
      {
        title: 'Step 1 - Setup Github + Repo',
        duration: '07:40',
        summary: 'Integrasi Apps Script sebagai REST API dan Github Frontend dan Vercel untuk Deploy persiapkan Domain Sendiri.',
        posterTag: 'Step 1 - Setup Github ( Integrasi Apps Script, GITHUB, Vercel )'
      },
      {
        title: 'Step 2 - Setup Vercel',
        duration: '02:22',
        summary: 'Menghubungkan repository GitHub ke platform hosting Vercel dengan continuous automated deployment dan custom domain gratis.',
        posterTag: 'Step 2 - Setup Vercel & Automated CI/CD'
      },
      {
        title: 'Step 3 - Setup Git Bash Dekstop',
        duration: '03:02',
        summary: 'Instalasi dan konfigurasi Git command line di laptop/PC agar push & pull kode berjalan lancar tanpa kendala kredensial.',
        posterTag: 'Step 3 - Konfigurasi Git Bash di Laptop'
      },
      {
        title: 'Step 4 - Setup Cursor Dekstop',
        duration: '02:03',
        summary: 'Mengaktifkan IDE modern Cursor AI untuk coding berbantuan AI prompt pintar dan debugging kode otomatis.',
        posterTag: 'Step 4 - Setup Cursor AI untuk Pengembangan Cepat'
      },
      {
        title: 'Step 5 - Instalasi App Script by GITHUB',
        duration: '18:50',
        summary: 'Menghubungkan script Google Apps Script ke GitHub menggunakan Google Clasp dan token rahasia Script Properties.',
        posterTag: 'Step 5 - Deploy Kode GAS Langsung dari GitHub'
      },
      {
        title: 'Step 6 - Instalasi App Script by Vercel',
        duration: '09:00',
        summary: 'Konfigurasi route rewrites, proxy bypass CORS, dan penyesuaian CSP headers agar aplikasi web stabil diakses publik.',
        posterTag: 'Step 6 - Menjalankan Fullstack Headless GAS di Vercel'
      }
    ],
    materials: [
      { name: 'Master Boilerplate Repository GitHub', type: 'GitHub Repo', url: 'https://github.com' },
      { name: 'Template Spreadsheet Database Master', type: 'Google Sheets', url: 'https://docs.google.com/spreadsheets' },
      { name: 'Snippet Script doPost & doGet Bypass CORS', type: 'JavaScript Code', url: 'https://drive.google.com' },
      { name: 'Panduan PDF Step-by-Step Integrasi Vercel', type: 'E-Book PDF', url: 'https://drive.google.com' },
      { name: 'Konfigurasi vercel.json & environment variables', type: 'Config File', url: 'https://drive.google.com' }
    ]
  },
  'MOD-03': {
    title: 'Kumpulan Video Cara Revisi & Upgrade AppWeb',
    shortTitle: 'Kumpulan Video Cara Revisi & Upgrade',
    poster: './assets/modules/thumb-revisi.jpg',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    materialsCount: 8,
    episodes: [
      {
        title: 'Modul 01: Cara Revisi Script Tanpa Mengubah ID Spreadsheet',
        duration: '15:20',
        summary: 'Metode aman melakukan upgrade fitur web app tanpa merusak database dan tanpa mengganggu pengguna aktif.',
        posterTag: 'Modul 01 - Revisi Script Aman Tanpa Ganti Spreadsheet'
      },
      {
        title: 'Modul 02: Manajemen Versi New Deployment di Google Apps Script',
        duration: '18:40',
        summary: 'Langkah mengelola nomor versi deployment GAS agar perubahan frontend seketika aktif tanpa caching lama.',
        posterTag: 'Modul 02 - Cara Buat New Deployment Baru yang Benar'
      }
    ],
    materials: [
      { name: 'Checklist Pra-Deployment Update', type: 'Dokumen PDF', url: 'https://drive.google.com' },
      { name: 'Script Backup Spreadsheet Otomatis', type: 'Google Script', url: 'https://drive.google.com' }
    ]
  },
  'MOD-04': {
    title: 'METODE 1 | BASIC - Belajar GAS sangat Mudah dari Dasar',
    shortTitle: 'METODE 1 | BASIC - Belajar GAS sangat Mudah...',
    poster: './assets/modules/thumb-basic.jpg',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    materialsCount: 7,
    episodes: [
      {
        title: 'Dasar 1: Pengenalan Google Apps Script & Editor Web',
        duration: '10:15',
        summary: 'Mengenal struktur project GAS, console log, dan eksekusi fungsi pertama.',
        posterTag: 'Dasar 1 - Pengenalan Lingkungan Google Apps Script'
      },
      {
        title: 'Dasar 2: Membaca & Menulis Data Spreadsheet dengan Range API',
        duration: '12:30',
        summary: 'Mempelajari SpreadsheetApp, getActiveSpreadsheet, getSheetByName, dan getValue/setValue.',
        posterTag: 'Dasar 2 - CRUD Spreadsheet dengan Apps Script'
      },
      {
        title: 'Dasar 3: Membuat Web App dengan HtmlService & Templated HTML',
        duration: '14:20',
        summary: 'Membangun antarmuka HTML langsung dari Google Apps Script.',
        posterTag: 'Dasar 3 - Web App Sederhana dengan HtmlService'
      },
      {
        title: 'Dasar 4: Mengirim Email & Notifikasi Otomatis dengan MailApp',
        duration: '08:45',
        summary: 'Kirim notifikasi email otomatis saat ada form submit.',
        posterTag: 'Dasar 4 - Kirim Email Otomatis dengan Apps Script'
      }
    ],
    materials: [
      { name: 'Latihan Kode Dasar GAS (Zip)', type: 'Source Code', url: 'https://drive.google.com' },
      { name: 'Cheatsheet Sintaks Penting GAS', type: 'PDF Ringkas', url: 'https://drive.google.com' }
    ]
  },
  'MOD-05': {
    title: 'Masterclass: Social Influence in Workplace & Leadership',
    shortTitle: 'Masterclass: Social Influence in Workplace',
    poster: './social-influence-banner.jpg',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    materialsCount: 18,
    episodes: [
      {
        title: 'Pilar 1: Kredibilitas & Kepercayaan Profesional',
        duration: '16:00',
        summary: 'Membangun otoritas keahlian dan rekam jejak tanpa harus memiliki jabatan formal.',
        posterTag: 'Pilar 1 - Kredibilitas & Pengaruh Organik'
      },
      {
        title: 'Pilar 2: Komunikasi Persuasif & Storytelling Bisnis',
        duration: '18:15',
        summary: 'Teknik menyusun argumen yang meyakinkan atasan, klien, dan tim kerja.',
        posterTag: 'Pilar 2 - Komunikasi yang Menggerakkan Orang Lain'
      },
      {
        title: 'Pilar 3: Membangun Jaringan Aliansi & Koneksi Strategis',
        duration: '22:30',
        summary: 'Menjalin kolaborasi lintas divisi dan memperluas lingkar pengaruh positif.',
        posterTag: 'Pilar 3 - Jaringan Aliansi di Dunia Kerja Modern'
      }
    ],
    materials: [
      { name: 'E-Book Lengkap Social Influence (PDF)', type: 'Buku Panduan', url: 'https://drive.google.com' },
      { name: 'Template Rencana Aksi Pengembangan Pengaruh', type: 'Notion/Doc', url: 'https://drive.google.com' }
    ]
  },
  'MOD-07': {
    title: 'GAS Pro Web App Masterclass 🎓 (Skala Industri)',
    shortTitle: 'GAS Pro Web App Masterclass 🎓',
    poster: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    materialsCount: 32,
    episodes: [
      {
        title: 'Modul 01: Arsitektur GAS Pro Headless & Google Sheets REST API',
        duration: '28:00',
        summary: 'Memahami cara kerja decoupled frontend modern dengan Google Apps Script tanpa hosting bulanan.',
        posterTag: 'Modul 01 - Arsitektur GAS Pro Headless'
      },
      {
        title: 'Modul 02: Setup Endpoint doGet & doPost JSON Bebas Masalah CORS',
        duration: '42:00',
        summary: 'Teknik output text/plain;charset=utf-8 untuk bypass preflight OPTIONS CORS secara sempurna.',
        posterTag: 'Modul 02 - Setup Endpoint Bebas CORS'
      },
      {
        title: 'Modul 03: Desain UI/UX SPA Interaktif, Animasi Kupu-Kupu 3D & Shimmer',
        duration: '35:00',
        summary: 'Membangun antarmuka kelas dunia dengan mikro-interaksi, 3D flip card, dan sparkle glow.',
        posterTag: 'Modul 03 - UI/UX SPA Interaktif Kelas Dunia'
      }
    ],
    materials: [
      { name: 'Master Starter Project Boilerplate', type: 'GitHub Zip', url: 'https://drive.google.com' },
      { name: 'Dokumentasi REST API & Skema Spreadsheet', type: 'Google Sheets', url: 'https://drive.google.com' }
    ]
  }
};

const DOCUMENT_FILES_MAP = {
  'MOD-02': {
    title: 'Kumpulan PRD',
    subtitle: 'Silahkan Download PRD yang dibutuhkan sebagai Referensi',
    banner: 'kumpulan-prd-banner.jpg',
    sectionTitle: 'Paket Dokumen & Berkas',
    listTitle: 'Daftar paket Dokumen',
    totalFiles: 1,
    totalLinks: 1,
    pkgFilesText: '1 berkas',
    pkgFormatText: '1 Dokumen',
    url: 'https://drive.google.com/drive/folders/1lzVZt5E57RzmQ8ipcBgraukC8YIwYWwR/',
    badge: 'Dokumen PRD',
    files: [
      {
        name: 'Dokumen PRD',
        filename: 'Kumpulan_PRD.md',
        badge: 'Dokumen PRD',
        size: '0.02 MB',
        url: 'https://drive.google.com/drive/folders/1lzVZt5E57RzmQ8ipcBgraukC8YIwYWwR/',
        content: '# Dokumen PRD\n\nKumpulan PRD Website Keuangan Digital,Produk Digital,Portofolio,Toko Website,E-Toko,'
      }
    ]
  },
  'MOD-06': {
    title: 'Digital Agency Notion OS Workspace & CRM',
    subtitle: 'Template Notion terlengkap untuk manajemen klien agency, pipeline penjualan, dan invoice otomatis',
    banner: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    totalFiles: 5,
    totalLinks: 2,
    files: [
      {
        name: 'Workspace Notion OS Agency Template',
        filename: 'Notion_Agency_OS_Master_Template.md',
        size: '0.02 MB',
        content: '# Notion OS Master Template\n\nKoleksi database lengkap untuk manajemen proyek, timesheet tim, dan pipeline klien agensi.'
      },
      {
        name: 'Sales CRM & Client Pipeline Tracker',
        filename: 'Sales_Pipeline_CRM.md',
        size: '0.01 MB',
        content: '# Sales CRM Tracker\n\nFormat pipeline penjualan berbasis Kanban untuk mengonversi prospek menjadi klien aktif.'
      },
      {
        name: 'Invoice Generator & Financial Spreadsheet',
        filename: 'Invoice_Generator_Template.md',
        size: '0.01 MB',
        content: '# Invoice Generator\n\nTemplate invoice otomatis dengan formula pajak, diskon, dan nomor seri tagihan.'
      }
    ]
  }
};

let activeCourseData = null;
let activeCourseEpisodeIndex = 0;
let activeDocData = null;
let activeDocFileIndex = 0;

// Buka Halaman Dashboard Video Kelas (Foto 2)
function openCourseClassroomView(moduleId) {
  const courseMap = typeof getActiveCourseEpisodesMap === 'function' ? getActiveCourseEpisodesMap() : COURSE_EPISODES_MAP;
  let course = courseMap[moduleId];

  if (!course) {
    const mod = (STATE.modules || DEFAULT_MODULES).find(m => m.ID_Materi === moduleId);
    if (mod) {
      course = {
        title: mod.Judul_Modul,
        shortTitle: mod.Judul_Modul.length > 45 ? (mod.Judul_Modul.slice(0, 42) + '...') : mod.Judul_Modul,
        poster: mod.Thumbnail_URL || mod.Foto_URL || './assets/modules/thumb-metode3.jpg',
        materialsCount: mod.Materi_Count || 1,
        summary: mod.Deskripsi || 'Akses modul dan materi lengkap seumur hidup.',
        waGroupTitle: 'Khusus peserta ' + mod.Judul_Modul,
        waGroupLink: 'https://chat.whatsapp.com/',
        episodes: [
          {
            title: 'Step 1 - ' + mod.Judul_Modul,
            duration: mod.Durasi_Menit ? (mod.Durasi_Menit + ' Menit') : '30:00',
            summary: mod.Deskripsi || '',
            videoEmbedUrl: mod.URL_Konten || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
            posterTag: mod.Judul_Modul
          }
        ],
        materials: [
          {
            name: 'Aset & Source Code Modul',
            type: mod.Tipe_Konten || 'Source Code',
            url: mod.URL_Konten || 'https://drive.google.com'
          }
        ]
      };
      courseMap[moduleId] = course;
      COURSE_EPISODES_MAP[moduleId] = course;
      try {
        localStorage.setItem('etalaseku_course_episodes_map', JSON.stringify(courseMap));
      } catch(e) {}
    } else {
      course = Object.assign({}, courseMap['MOD-01'] || {
        title: 'Materi Pembelajaran',
        shortTitle: 'Materi Pembelajaran',
        poster: './assets/modules/thumb-metode3.jpg',
        materialsCount: 1,
        summary: 'Akses materi lengkap.',
        episodes: [{ title: 'Step 1 - Video', duration: '10:00', summary: 'Materi' }],
        materials: []
      });
    }
  }

  course.id = moduleId;
  activeCourseData = course;
  activeCourseEpisodeIndex = 0;

  // Toggle view
  const viewHome = document.getElementById('rb-view-home');
  const viewGrid = document.getElementById('rb-view-grid');
  const viewCourse = document.getElementById('rb-view-course');
  const viewDoc = document.getElementById('rb-view-document');

  if (viewHome) viewHome.style.display = 'none';
  if (viewGrid) viewGrid.style.display = 'none';
  if (viewDoc) viewDoc.style.display = 'none';
  if (viewCourse) viewCourse.style.display = 'block';

  // Update Breadcrumbs & Titles
  const crumbTitle = document.getElementById('course-crumb-title');
  if (crumbTitle) crumbTitle.textContent = course.shortTitle || course.title;

  const activeCourseName = document.getElementById('course-active-course-name');
  if (activeCourseName) activeCourseName.textContent = course.title;

  const sidebarName = document.getElementById('course-sidebar-name');
  if (sidebarName) sidebarName.textContent = course.shortTitle || course.title;

  const sidebarCount = document.getElementById('course-sidebar-count');
  if (sidebarCount) sidebarCount.textContent = (course.episodes.length) + ' materi';

  const waTarget = document.getElementById('course-wa-target-title');
  if (waTarget) waTarget.textContent = course.title;

  const matCountBadge = document.getElementById('course-materials-count-badge');
  if (matCountBadge) matCountBadge.textContent = course.materialsCount || (course.materials ? course.materials.length : 27);

  // Render episode list in sidebar
  renderCourseEpisodesSidebar(course);

  // Render materials tab
  renderCourseMaterialsList(course);

  // Select Episode 0 by default
  selectEpisode(0);

  // Scroll to top of classroom wrapper
  const wrapper = document.getElementById('classroom-dashboard-portal');
  if (wrapper) wrapper.scrollTop = 0;
}

// Buka Halaman Dashboard Dokumen & Berkas Produk (Foto 3)
function openDocumentPackageView(moduleId) {
  const docMap = typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap() : DOCUMENT_FILES_MAP;
  let docPkg = docMap[moduleId];

  if (!docPkg) {
    const mod = (STATE.modules || DEFAULT_MODULES).find(m => m.ID_Materi === moduleId);
    if (mod) {
      docPkg = {
        title: mod.Judul_Modul,
        subtitle: mod.Deskripsi || 'Silahkan Download Dokumen yang dibutuhkan sebagai Referensi',
        banner: mod.Thumbnail_URL || mod.Foto_URL || './assets/modules/thumb-prd.jpg',
        totalFiles: mod.Materi_Count || 10,
        totalLinks: 0,
        pkgFilesText: (mod.Materi_Count || 10) + ' berkas',
        pkgFormatText: (mod.Materi_Count || 10) + ' Dokumen',
        files: [
          {
            name: mod.Judul_Modul,
            filename: 'Dokumen_' + (mod.ID_Materi || '01') + '.md',
            size: '0.01 MB',
            url: mod.URL_Konten || 'https://drive.google.com',
            content: '# ' + mod.Judul_Modul + '\n\n## 1. Ringkasan Eksekutif\n' + (mod.Deskripsi || 'Dokumen spesifikasi teknis dan implementasi produk.')
          }
        ]
      };
      docMap[moduleId] = docPkg;
      DOCUMENT_FILES_MAP[moduleId] = docPkg;
      try {
        localStorage.setItem('etalaseku_document_files_map', JSON.stringify(docMap));
      } catch(e) {}
    } else {
      docPkg = Object.assign({}, docMap['MOD-02'] || {
        title: 'Paket Dokumen',
        subtitle: 'Dokumen referensi',
        banner: './assets/modules/thumb-prd.jpg',
        totalFiles: 1,
        files: []
      });
    }
  }

  docPkg.id = moduleId;
  activeDocData = docPkg;

  // Toggle view
  const viewHome = document.getElementById('rb-view-home');
  const viewGrid = document.getElementById('rb-view-grid');
  const viewCourse = document.getElementById('rb-view-course');
  const viewDoc = document.getElementById('rb-view-document');

  if (viewHome) viewHome.style.display = 'none';
  if (viewGrid) viewGrid.style.display = 'none';
  if (viewCourse) viewCourse.style.display = 'none';
  if (viewDoc) viewDoc.style.display = 'block';

  // Update Breadcrumbs & Titles
  const crumbTitle = document.getElementById('doc-crumb-title');
  if (crumbTitle) crumbTitle.textContent = docPkg.title;

  const pageTitle = document.getElementById('doc-page-title');
  if (pageTitle) pageTitle.textContent = docPkg.title;

  const pageSubtitle = document.getElementById('doc-page-subtitle');
  if (pageSubtitle) pageSubtitle.textContent = docPkg.subtitle;

  const bannerImg = document.getElementById('doc-active-banner-img');
  if (bannerImg && docPkg.banner) bannerImg.src = docPkg.banner;

  const bannerText = document.getElementById('doc-banner-items-text');
  if (bannerText) bannerText.textContent = 'Lihat ' + (docPkg.files ? docPkg.files.length : 10) + ' Berkas';

  const extLinks = (docPkg.files || []).filter(f => f.url && f.url.trim() && f.url !== '#' && !f.url.startsWith('javascript:'));
  const finalExtCount = extLinks.length > 0 ? extLinks.length : (typeof docPkg.totalLinks === 'number' && docPkg.totalLinks > 0 ? docPkg.totalLinks : (docPkg.url ? 1 : 1));
  const finalFilesCount = (docPkg.files ? docPkg.files.length : (docPkg.totalFiles || 1));

  const pkgFilesVal = document.getElementById('doc-pkg-files-val');
  if (pkgFilesVal) pkgFilesVal.textContent = finalFilesCount + ' berkas';

  const pkgLinksVal = document.getElementById('doc-pkg-links-val');
  if (pkgLinksVal) pkgLinksVal.textContent = finalExtCount + ' tautan';

  const filesCountBadge = document.getElementById('doc-files-count-badge');
  if (filesCountBadge) filesCountBadge.textContent = (docPkg.files ? docPkg.files.length : 10) + ' Item';

  // Render list of files
  renderDocumentFilesList(docPkg);

  // Scroll to top of classroom wrapper
  const wrapper = document.getElementById('classroom-dashboard-portal');
  if (wrapper) wrapper.scrollTop = 0;
}

// Kembali ke Halaman Ruang BelajarKu Grid (Foto 1)
function closeClassroomDetailView() {
  const viewHome = document.getElementById('rb-view-home');
  const viewGrid = document.getElementById('rb-view-grid');
  const viewCourse = document.getElementById('rb-view-course');
  const viewDoc = document.getElementById('rb-view-document');

  if (viewCourse) viewCourse.style.display = 'none';
  if (viewDoc) viewDoc.style.display = 'none';
  if (viewHome) viewHome.style.display = 'flex';
  else if (viewGrid) viewGrid.style.display = 'block';

  // Stop video iframe if playing
  const embedBox = document.getElementById('rb-video-embed');
  const posterBox = document.getElementById('rb-video-poster');
  const iframe = document.getElementById('rb-video-iframe');
  if (iframe) iframe.src = '';
  if (embedBox) embedBox.style.display = 'none';
  if (posterBox) posterBox.style.display = 'flex';

  // Scroll to top
  const wrapper = document.getElementById('classroom-dashboard-portal');
  if (wrapper) wrapper.scrollTop = 0;
}

// Render Sidebar Episode List
function renderCourseEpisodesSidebar(course) {
  const container = document.getElementById('course-ep-items-list');
  if (!container || !course.episodes) return;

  container.innerHTML = course.episodes.map((ep, idx) => {
    const isActive = idx === activeCourseEpisodeIndex;
    const isCompleted = idx < activeCourseEpisodeIndex;

    let statusBadgeHtml = '';
    if (isActive) {
      statusBadgeHtml = `
        <span class="rb-ep-status-badge playing">
          <div class="equalizer-anim"><span></span><span></span><span></span></div>
          Sedang Diputar
        </span>`;
    } else if (isCompleted) {
      statusBadgeHtml = `
        <span class="rb-ep-status-badge completed">
          ✓ Selesai
        </span>`;
    } else {
      statusBadgeHtml = `
        <span class="rb-ep-status-badge upcoming">
          ▶ Step ${idx + 1}
        </span>`;
    }

    return `
      <div class="rb-ep-item ${isActive ? 'active' : ''}" id="rb-ep-item-${idx}" onclick="selectEpisode(${idx})" style="display:flex; align-items:center; gap:10px;">
        <div class="rb-ep-num" style="${isActive ? 'background:linear-gradient(135deg, #FF2E63, #E11D48); color:#FFFFFF; border-color:#FF2E63;' : (isCompleted ? 'background:#ECFDF5; color:#10B981; border-color:#A7F3D0;' : '')}">
          ${isActive ? '▶' : (isCompleted ? '✓' : (idx + 1))}
        </div>
        <div class="rb-ep-info" style="flex:1; min-width:0;">
          <div class="rb-ep-item-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(ep.title)}</div>
          <div class="rb-ep-item-meta" style="display:flex; align-items:center; gap:6px;">
            <span>${ep.duration}</span>
            ${statusBadgeHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Select Episode
function selectEpisode(idx) {
  if (!activeCourseData || !activeCourseData.episodes) return;
  if (idx < 0 || idx >= activeCourseData.episodes.length) return;

  activeCourseEpisodeIndex = idx;
  const ep = activeCourseData.episodes[idx];
  const total = activeCourseData.episodes.length;

  // Update top badge
  const topBadge = document.getElementById('course-ep-top-badge');
  if (topBadge) topBadge.textContent = '🎬 Episode ' + (idx + 1) + ' / ' + total;

  // Update episode card tags
  const epBadge = document.getElementById('course-active-ep-badge');
  if (epBadge) epBadge.textContent = 'EPISODE ' + (idx + 1) + '/' + total;

  const epDuration = document.getElementById('course-active-ep-duration');
  if (epDuration) epDuration.textContent = '• Durasi ' + ep.duration;

  const epTitle = document.getElementById('course-active-ep-title');
  if (epTitle) epTitle.textContent = ep.title;

  const summaryText = document.getElementById('course-active-summary-text');
  if (summaryText) summaryText.textContent = ep.summary || activeCourseData.title;

  const videoTag = document.getElementById('rb-video-top-tag');
  if (videoTag) videoTag.textContent = ep.posterTag || ep.title;

  // Update Progress
  const progressRatio = document.getElementById('course-progress-ratio');
  if (progressRatio) progressRatio.textContent = (idx + 1) + ' / ' + total;

  const progressBar = document.getElementById('course-progress-bar');
  if (progressBar) progressBar.style.width = Math.round(((idx + 1) / total) * 100) + '%';

  // Prev / Next button states
  const btnPrev = document.getElementById('btn-ep-prev');
  const btnNext = document.getElementById('btn-ep-next');
  if (btnPrev) btnPrev.disabled = (idx === 0);
  if (btnNext) btnNext.disabled = (idx === total - 1);

  // Update active class in sidebar items
  const totalItems = activeCourseData.episodes.length;
  for (let i = 0; i < totalItems; i++) {
    const el = document.getElementById('rb-ep-item-' + i);
    if (el) {
      if (i === idx) {
        el.className = 'rb-ep-item active';
        const num = el.querySelector('.rb-ep-num');
        if (num) num.textContent = '▶';
        const meta = el.querySelector('.rb-ep-item-meta');
        if (meta) meta.textContent = activeCourseData.episodes[i].duration + ' • Sedang diputar';
      } else {
        el.className = 'rb-ep-item';
        const num = el.querySelector('.rb-ep-num');
        if (num) num.textContent = (i + 1);
        const meta = el.querySelector('.rb-ep-item-meta');
        if (meta) meta.textContent = activeCourseData.episodes[i].duration;
      }
    }
  }

  // Reset video poster
  const embedBox = document.getElementById('rb-video-embed');
  const posterBox = document.getElementById('rb-video-poster');
  const iframe = document.getElementById('rb-video-iframe');
  if (iframe) iframe.src = '';
  if (embedBox) embedBox.style.display = 'none';
  if (posterBox) posterBox.style.display = 'flex';
}

function navigateEpisode(direction) {
  selectEpisode(activeCourseEpisodeIndex + direction);
}

function playCurrentCourseVideo() {
  const embedBox = document.getElementById('rb-video-embed');
  const posterBox = document.getElementById('rb-video-poster');
  const iframe = document.getElementById('rb-video-iframe');

  if (activeCourseData && activeCourseData.videoEmbedUrl && iframe) {
    iframe.src = activeCourseData.videoEmbedUrl;
    if (posterBox) posterBox.style.display = 'none';
    if (embedBox) embedBox.style.display = 'block';
  } else {
    showToast('Memutar video materi pembelajaran...', 'success', 2000);
  }
}

function switchCourseTab(tabName) {
  const btnSummary = document.getElementById('tab-btn-summary');
  const btnMaterials = document.getElementById('tab-btn-materials');
  const paneSummary = document.getElementById('rb-tab-pane-summary');
  const paneMaterials = document.getElementById('rb-tab-pane-materials');

  if (tabName === 'materials') {
    if (btnSummary) btnSummary.classList.remove('active');
    if (btnMaterials) btnMaterials.classList.add('active');
    if (paneSummary) paneSummary.style.display = 'none';
    if (paneMaterials) paneMaterials.style.display = 'block';
  } else {
    if (btnMaterials) btnMaterials.classList.remove('active');
    if (btnSummary) btnSummary.classList.add('active');
    if (paneMaterials) paneMaterials.style.display = 'none';
    if (paneSummary) paneSummary.style.display = 'block';
  }
}

function renderCourseMaterialsList(course) {
  const container = document.getElementById('course-active-materials-list');
  if (!container) return;

  const materials = course.materials || [
    { name: 'Master Boilerplate Repository GitHub', type: 'GitHub Repo', url: 'https://github.com' },
    { name: 'Template Spreadsheet Database Master', type: 'Google Sheets', url: 'https://docs.google.com/spreadsheets' },
    { name: 'Snippet Script doPost & doGet Bypass CORS', type: 'JavaScript Code', url: 'https://drive.google.com' },
    { name: 'Panduan PDF Step-by-Step Integrasi Vercel', type: 'E-Book PDF', url: 'https://drive.google.com' }
  ];

  container.innerHTML = materials.map(mat => `
    <div class="rb-material-row">
      <div class="rb-mat-left">
        <div style="font-size:20px;">📦</div>
        <div>
          <div class="rb-mat-name">${mat.name}</div>
          <div class="rb-mat-type">${mat.type} • Siap diunduh</div>
        </div>
      </div>
      <a href="${mat.url}" target="_blank" rel="noopener noreferrer" class="rb-mat-btn">
        Akses Berkas ↗
      </a>
    </div>
  `).join('');
}

// Render Document Files List (Foto 3)
function renderDocumentFilesList(docPkg) {
  const container = document.getElementById('doc-items-list');
  if (!container || !docPkg.files) return;

  container.innerHTML = docPkg.files.map((file, idx) => `
    <div class="rb-doc-row">
      <div class="rb-doc-row-left">
        <div class="rb-doc-file-icon">MD</div>
        <div class="rb-doc-file-meta">
          <div class="rb-doc-file-name">${file.name}</div>
          <p class="rb-doc-file-sub">${file.filename} • ${file.size} • bisa disalin langsung</p>
        </div>
      </div>
      <div class="rb-doc-row-right" style="display:flex; align-items:center; gap:8px;">
        <button class="btn-doc-view" onclick="openDocReaderModal(${idx})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Lihat &amp; Salin</span>
        </button>
        ${file.url && file.url !== '#' && !file.url.startsWith('javascript:') ? `
        <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer" class="btn-doc-drive-pill" title="Buka Tautan Google Drive" onclick="event.stopPropagation();">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y3="3"/></svg>
          <span>Drive ↗</span>
        </a>` : ''}
        <button class="btn-doc-dl" title="Unduh File Markdown" onclick="downloadDocFile(${idx})">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function scrollToDocList() {
  const target = document.getElementById('rb-doc-files-container');
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}

function openDocReaderModal(idx) {
  if (!activeDocData || !activeDocData.files || !activeDocData.files[idx]) return;
  activeDocFileIndex = idx;
  const file = activeDocData.files[idx];

  const titleEl = document.getElementById('modal-doc-title');
  if (titleEl) titleEl.textContent = file.name || activeDocData.title;

  // Badge diambil dari pengaturan CRM Portal Ruang BelajarKu (per berkas -> per paket -> default judul)
  const badgeEl = document.getElementById('modal-doc-badge');
  let badgeVal = file.badge || activeDocData.badge;
  if (!badgeVal || badgeVal === 'DOKUMEN PRD') {
    badgeVal = 'Dokumen ' + (activeDocData.title || file.name || 'Social Influence');
  }
  if (badgeEl) badgeEl.textContent = badgeVal;

  // Nama File diambil dari pengaturan CRM Portal Ruang BelajarKu (bersih tanpa PRD_MOD-...)
  let rawFilename = file.filename || '';
  if (!rawFilename || rawFilename.startsWith('PRD_MOD-')) {
    const cleanName = (file.name || activeDocData.title || 'Dokumen').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    rawFilename = 'Dokumen_' + cleanName + '.md';
    file.filename = rawFilename;
  }
  const filenameEl = document.getElementById('modal-doc-meta-filename');
  if (filenameEl) filenameEl.textContent = rawFilename;

  const sizeEl = document.getElementById('modal-doc-meta-size');
  if (sizeEl) sizeEl.textContent = file.size || '0.01 MB';

  const driveLink = document.getElementById('modal-doc-drive-link');
  if (driveLink && file.url) driveLink.href = file.url;

  let bodyContent = file.content || ('# Dokumen: ' + (file.name || activeDocData.title) + '\n\n## 1. Ringkasan Eksekutif\nDokumen referensi resmi siap digunakan.');
  bodyContent = bodyContent.replace(/^#\s*PRD:\s*/i, '# Dokumen: ');
  const bodyEl = document.getElementById('modal-doc-body');
  if (bodyEl) bodyEl.textContent = bodyContent;

  const modal = document.getElementById('modal-doc-reader');
  if (modal) modal.classList.add('active');
}

function copyActiveDocContent() {
  const bodyEl = document.getElementById('modal-doc-body');
  if (!bodyEl) return;
  const text = bodyEl.textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Seluruh teks dokumen berhasil disalin ke clipboard!', 'success', 3000);
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('📋 Seluruh teks dokumen PRD berhasil disalin ke clipboard!', 'success', 3000);
  } catch (err) {
    showToast('Gagal menyalin otomatis, silakan salin manual.', 'error', 3000);
  }
  document.body.removeChild(textArea);
}

function downloadDocFile(idx) {
  if (!activeDocData || !activeDocData.files || !activeDocData.files[idx]) return;
  const file = activeDocData.files[idx];
  const blob = new Blob([file.content || ''], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename || (file.name + '.md');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 Mengunduh ' + file.filename, 'success', 2500);
}

function openWhatsAppDiscussionGroup() {
  const courseTitle = activeCourseData ? activeCourseData.title : 'Kelas Ruang BelajarKu';
  const url = 'https://wa.me/' + getActiveWaCsNumber() + '?text=' + encodeURIComponent('Halo Admin EtalaseKu, saya siswa terverifikasi ingin bergabung ke Grup Diskusi untuk kelas: ' + courseTitle);
  window.open(url, '_blank');
}


// ============================================================================
// PORTAL RUANG BELAJARKU LIVE CMS & VISUAL CARDS IN CRM (Foto 1 Reference)
// ============================================================================

let currentCrmRbFilterTag = 'ALL';
let currentCrmRbQuery = '';

function switchCrmClassroomViewMode(mode) {
  const cardsWrap = document.getElementById('crm-rb-cards-view-wrap');
  const tableWrap = document.getElementById('crm-rb-table-view-wrap');
  const btnCards = document.getElementById('crm-rb-btn-view-cards');
  const btnTable = document.getElementById('crm-rb-btn-view-table');

  if (mode === 'table') {
    if (cardsWrap) cardsWrap.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';
    if (btnCards) btnCards.classList.remove('active');
    if (btnTable) btnTable.classList.add('active');
  } else {
    if (tableWrap) tableWrap.style.display = 'none';
    if (cardsWrap) cardsWrap.style.display = 'block';
    if (btnTable) btnTable.classList.remove('active');
    if (btnCards) btnCards.classList.add('active');
  }
}

function filterCrmClassroomModules(query) {
  currentCrmRbQuery = query || '';
  renderClassroomCrmCards(currentCrmRbQuery, currentCrmRbFilterTag);
}

function filterCrmClassroomByTag(tag, btnElement) {
  currentCrmRbFilterTag = tag || 'ALL';
  if (btnElement) {
    const parent = btnElement.parentElement;
    if (parent) {
      const pills = parent.querySelectorAll('.rb-pill');
      pills.forEach(p => p.classList.remove('active'));
      btnElement.classList.add('active');
    }
  }
  renderClassroomCrmCards(currentCrmRbQuery, currentCrmRbFilterTag);
}

function renderClassroomCrmCards(query, filterTag) {
  const container = document.getElementById('crm-rb-cards-grid');
  if (!container) return;

  const allModules = Array.isArray(STATE.modules) ? STATE.modules : loadStoredClassroomModules();
  let modules = allModules;

  if (query && query.trim()) {
    const q = query.toLowerCase();
    modules = modules.filter(m =>
      (m.Judul_Modul && m.Judul_Modul.toLowerCase().includes(q)) ||
      (m.Deskripsi && m.Deskripsi.toLowerCase().includes(q)) ||
      (m.Tipe_Konten && m.Tipe_Konten.toLowerCase().includes(q)) ||
      (m.Kategori && m.Kategori.toLowerCase().includes(q)) ||
      (m.Tipe_Badge && m.Tipe_Badge.toLowerCase().includes(q))
    );
  }

  if (filterTag && filterTag !== 'ALL') {
    const t = filterTag.toLowerCase();
    modules = modules.filter(m =>
      (m.Tipe_Badge && m.Tipe_Badge.toLowerCase() === t) ||
      (m.Kategori && m.Kategori.toLowerCase() === t) ||
      (m.Tipe_Konten && m.Tipe_Konten.toLowerCase().includes(t))
    );
  }

  // Update badge count in CRM sidebar
  const badgeEl = document.getElementById('badge-modules-count');
  if (badgeEl) badgeEl.textContent = allModules.length;

  if (modules.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#FFFFFF; border:1.5px dashed #CBD5E1; border-radius:20px; color:#64748B;">
        <div style="font-size:36px; margin-bottom:10px;">🔍</div>
        <p style="font-weight:800; font-size:16px; margin:0 0 6px; color:#0F172A;">Tidak ada kartu modul yang cocok.</p>
        <p style="font-size:13px; margin:0 0 16px;">Klik tombol di bawah untuk menambahkan kartu baru ke Portal Ruang BelajarKu.</p>
        <button class="shimmer-btn" style="padding:10px 18px; font-size:13px; border-radius:9999px;" onclick="openNewModuleModal()">
          + Tambah Kartu Baru 🚀
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = modules.map((m, idx) => {
    const tipeBadge = m.Tipe_Badge || (m.Kategori ? m.Kategori.toUpperCase() : 'KELAS');
    const badgeTypeClass = (tipeBadge === 'DOKUMEN' ? 'type-dokumen' : (tipeBadge === 'APLIKASI' ? 'type-aplikasi' : 'type-kelas'));
    const kategori = m.Kategori || (tipeBadge === 'DOKUMEN' ? 'Dokumen' : (tipeBadge === 'APLIKASI' ? 'Aplikasi' : 'Kelas'));
    const catPillClass = (kategori.toLowerCase() === 'dokumen' ? 'cat-dokumen' : (kategori.toLowerCase() === 'aplikasi' ? 'cat-aplikasi' : ''));
    const bannerUrl = m.Thumbnail_URL || m.Foto_URL || './assets/modules/thumb-metode3.jpg';
    const isDoc = tipeBadge === 'DOKUMEN' || tipeBadge === 'APLIKASI';
    const epCount = m.Episode || 1;
    const matCount = m.Materi_Count || 1;

    let metaText = '';
    if (m.Episode && m.Materi_Count) {
      metaText = `<span>🎬 ${m.Episode} episode</span> <span>•</span> <span>📚 ${m.Materi_Count} materi</span>`;
    } else if (m.Materi_Count) {
      metaText = `<span>📚 ${m.Materi_Count} materi</span>`;
    } else {
      metaText = `<span>🎬 ${epCount} episode</span> <span>•</span> <span>📚 ${matCount} materi</span>`;
    }

    return `
      <div class="rb-card" style="box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05); border: 1.5px solid #E2E8F0;">
        <div class="rb-thumb-wrap">
          <img src="${bannerUrl}" alt="${escapeHtml(m.Judul_Modul)}" class="rb-thumb-img" onerror="this.onerror=null;this.src='./assets/modules/thumb-metode3.jpg';">
          <div class="rb-badge-left ${badgeTypeClass}">${tipeBadge}</div>
          <div class="rb-badge-right">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Dimiliki</span>
          </div>
        </div>
        <div class="rb-card-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="rb-cat-pill ${catPillClass}">${kategori}</div>
            <span style="font-size:11px; font-weight:700; color:#64748B;">Urutan #${m.Urutan || (idx + 1)}</span>
          </div>
          <h3 class="rb-card-title" title="${escapeHtml(m.Judul_Modul)}">${m.Judul_Modul}</h3>
          <p class="rb-card-desc">${m.Deskripsi || 'Akses modul dan materi lengkap seumur hidup.'}</p>
          <div class="rb-card-meta">
            ${metaText}
          </div>
          <div class="crm-rb-card-actions">
            <button type="button" class="crm-rb-btn-edit" onclick="openEditModuleModal('${m.ID_Materi}')" title="Edit Banner, Judul, Ringkasan, Video & Materi">
              ✏️ Edit Kartu Ruang BelajarKu
            </button>
            <div style="display:flex; gap:6px;">
              <button type="button" class="crm-rb-btn-preview" style="flex:1;" onclick="previewModuleFromCrm('${m.ID_Materi}', ${isDoc})" title="Lihat Tampilan Siswa (Buka Ruang Belajar / Akses Produk)">
                👁️ Pratinjau Siswa
              </button>
              <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; color:#EF4444; border-color:#FCA5A5; border-radius:9999px; cursor:pointer;" onclick="deleteClassroomModuleAdmin('${m.ID_Materi}')" title="Hapus Modul">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}


// ============================================================================
// MODAL TAUTAN EKSTERNAL & GOOGLE DRIVE (FOTO 2 AKSES PRODUK)
// ============================================================================
function openExternalLinksModal() {
  const modal = document.getElementById('modal-external-links');
  if (!modal) return;

  const titleEl = document.getElementById('ext-links-modal-title');
  const countBadge = document.getElementById('ext-links-count-badge');
  const container = document.getElementById('ext-links-list-container');

  const docPkg = activeDocData || (typeof getActiveDocumentFilesMap === 'function' ? getActiveDocumentFilesMap()['MOD-02'] : null);
  const title = (docPkg && docPkg.title) ? docPkg.title : 'Kumpulan PRD';

  if (titleEl) titleEl.textContent = title;

  let links = [];
  if (docPkg && Array.isArray(docPkg.files)) {
    docPkg.files.forEach((f, idx) => {
      const url = f.url ? f.url.trim() : '';
      if (url && url !== '#' && !url.startsWith('javascript:')) {
        links.push({
          title: f.name || ('Dokumen ' + (idx + 1)),
          filename: f.filename || '',
          url: url,
          size: f.size || '0.02 MB'
        });
      }
    });
  }

  // Jika di file tidak ada tetapi di objek paket ada URL Drive utama
  if (links.length === 0 && docPkg && docPkg.url && docPkg.url.trim() && docPkg.url !== '#') {
    links.push({
      title: docPkg.title || 'Folder Google Drive',
      filename: 'Google Drive',
      url: docPkg.url.trim(),
      size: ''
    });
  }

  // Fallback ke Google Drive PRD jika belum ada
  if (links.length === 0) {
    links.push({
      title: 'Folder Google Drive Kumpulan PRD',
      filename: 'Kumpulan_PRD_Drive',
      url: 'https://drive.google.com/drive/folders/1lzVZt5E57RzmQ8ipcBgraukC8YIwYWwR/',
      size: 'Folder'
    });
  }

  if (countBadge) countBadge.textContent = links.length + ' Tautan';

  if (container) {
    container.innerHTML = links.map((lnk, i) => `
      <div class="ext-link-card" style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:10px; min-width:0;">
            <div style="width:38px; height:38px; border-radius:10px; background:#EFF6FF; border:1.5px solid #BFDBFE; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:18px;">
              📁
            </div>
            <div style="min-width:0;">
              <h4 style="font-size:14px; font-weight:700; color:#0F172A; margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(lnk.title)}</h4>
              <p style="font-size:11.5px; color:#2563EB; margin:0; word-break:break-all; font-weight:600;">${escapeHtml(lnk.url)}</p>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:8px; margin-top:2px; flex-wrap:wrap;">
          <a href="${escapeHtml(lnk.url)}" target="_blank" rel="noopener noreferrer" class="shimmer-btn" style="flex:1; justify-content:center; padding:10px 16px; font-size:13px; text-decoration:none; border-radius:10px;" onclick="closeAllModals()">
            <span>🚀</span> Buka di Google Drive
          </a>
          <button class="btn-secondary" style="padding:10px 14px; font-size:12.5px; font-weight:700; border-radius:10px; background:#FFFFFF; border:1.5px solid #CBD5E1; color:#334155; cursor:pointer;" onclick="copyExtLinkToClipboard('${escapeHtml(lnk.url)}')">
            📋 Salin Link
          </button>
        </div>
      </div>
    `).join('');
  }

  modal.classList.add('active');
}
window.openExternalLinksModal = openExternalLinksModal;

function copyExtLinkToClipboard(url) {
  if (!url) return;
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Tautan berhasil disalin ke clipboard! 📋', 'success', 2500);
    }).catch(() => {
      fallbackCopyText(url);
    });
  } else {
    fallbackCopyText(url);
  }
}
window.copyExtLinkToClipboard = copyExtLinkToClipboard;

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Tautan berhasil disalin ke clipboard! 📋', 'success', 2500);
  } catch(e) {
    showToast('Silakan salin tautan secara manual.', 'info', 2500);
  }
  document.body.removeChild(ta);
}


function updateHeroCtaButtons() {
  const primaryBtn = document.getElementById('hero-btn-primary');
  const secondaryBtn = document.getElementById('hero-btn-secondary');
  const mobileTopPill = document.getElementById('mobile-top-user-pill');
  const mobileTopLabel = document.getElementById('mobile-top-user-label');
  const bnavClassroomDot = document.getElementById('bnav-classroom-dot');

  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');
  const savedName = localStorage.getItem('etalaseku_member_name') || (savedEmail ? savedEmail.split('@')[0] : '');

  const isLoggedIn = !!(savedOrderId || savedEmail);

  if (isLoggedIn) {
    if (primaryBtn) {
      primaryBtn.href = 'javascript:void(0)';
      primaryBtn.onclick = () => openClassroomDashboard();
      primaryBtn.innerHTML = '<span>🎓 Lanjutkan Belajar (' + escapeHtml(savedName || 'Siswa') + ') ➔</span>';
      primaryBtn.className = 'shimmer-btn btn-primary cta-pulse-glow';
    }
    if (secondaryBtn) {
      secondaryBtn.textContent = 'Jelajahi Katalog Produk ➔';
      secondaryBtn.onclick = () => {
        const el = document.getElementById('produk');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };
    }
    if (mobileTopLabel) mobileTopLabel.textContent = (savedName ? savedName.slice(0, 10) : 'Belajar');
    if (bnavClassroomDot) bnavClassroomDot.style.display = 'block';
  } else {
    if (primaryBtn) {
      primaryBtn.href = '#produk';
      primaryBtn.onclick = null;
      primaryBtn.innerHTML = '<span>Jelajahi Katalog Produk ➔</span>';
      primaryBtn.className = 'shimmer-btn btn-primary cta-pulse-glow';
    }
    if (secondaryBtn) {
      secondaryBtn.textContent = 'Masuk Member Area 🔑';
      secondaryBtn.onclick = () => openMemberLoginModal();
    }
    if (mobileTopLabel) mobileTopLabel.textContent = 'Ruang Belajar';
    if (bnavClassroomDot) bnavClassroomDot.style.display = 'none';
  }
}
window.updateHeroCtaButtons = updateHeroCtaButtons;


function handleBottomNavTab(tab) {
  // Update active states
  const tabs = ['home', 'classroom', 'bills', 'cs'];
  tabs.forEach(t => {
    const el = document.getElementById('bnav-' + t);
    if (el) el.classList.remove('active');
  });

  const curEl = document.getElementById('bnav-' + (tab === 'beranda' ? 'home' : tab));
  if (curEl) curEl.classList.add('active');

  if (tab === 'beranda') {
    closeAllModals();
    const classroomWrapper = document.getElementById('classroom-dashboard-portal');
    if (classroomWrapper && classroomWrapper.classList.contains('active')) {
      closeClassroomPortal();
    }
    const hero = document.getElementById('hero');
    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'classroom') {
    openClassroomDashboardOrLogin();
  } else if (tab === 'tagihan') {
    closeAllModals();
    const billsModal = document.getElementById('modal-student-bills');
    if (billsModal) billsModal.classList.add('active');
  } else if (tab === 'cs') {
    const wa = getActiveWaCsNumber();
    const url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Halo Admin EtalaseKu Hub, saya butuh bantuan terkait produk & pembelajaran.');
    window.open(url, '_blank');
  }
}
window.handleBottomNavTab = handleBottomNavTab;


function openProductDetailModal(productId) {
  const prod = (STATE.products || []).find(p => p.ID_Produk === productId) || 
               (getFallbackMockData().products || []).find(p => p.ID_Produk === productId);
  if (!prod) return;

  const modal = document.getElementById('modal-product-detail-preview');
  if (!modal) return;

  const imgEl = document.getElementById('prod-preview-modal-img');
  const titleEl = document.getElementById('prod-preview-modal-title');
  const catEl = document.getElementById('prod-preview-modal-cat');
  const descEl = document.getElementById('prod-preview-modal-desc');
  const normalPriceEl = document.getElementById('prod-preview-modal-price-normal');
  const promoPriceEl = document.getElementById('prod-preview-modal-price-promo');
  const badgeEl = document.getElementById('prod-preview-modal-badge');
  const ctaBtn = document.getElementById('prod-preview-modal-cta');

  if (imgEl) imgEl.src = formatImageUrl(prod.Banner_URL);
  if (titleEl) titleEl.textContent = prod.Nama_Produk;
  if (catEl) catEl.textContent = prod.Kategori || 'Produk Digital';
  if (descEl) descEl.textContent = prod.Deskripsi;
  if (normalPriceEl) normalPriceEl.textContent = 'Rp ' + Number(prod.Harga_Normal || 0).toLocaleString('id-ID');
  if (promoPriceEl) promoPriceEl.textContent = 'Rp ' + Number(prod.Harga_Promo || 0).toLocaleString('id-ID');
  if (badgeEl) badgeEl.textContent = 'Batch ' + (prod.Batch_Aktif || 1) + ': Kuota Terbatas';

  if (ctaBtn) {
    ctaBtn.onclick = () => {
      closeAllModals();
      openCheckoutModal(prod.ID_Produk);
    };
  }

  modal.classList.add('active');
}
window.openProductDetailModal = openProductDetailModal;


function sendMagicLinkToWhatsApp() {
  const order = STATE.activeReceiptOrder;
  if (!order) {
    showToast('Pesanan tidak ditemukan.', 'error');
    return;
  }
  const phone = (order.No_WhatsApp || order.NoWhatsApp || '').replace(/[^0-9]/g, '');
  const name = order.Nama_Pembeli || order.nama || 'Siswa';
  const prod = order.productName || order.Nama_Produk || order.Produk || 'Produk Digital';
  const orderId = order.ID_Order || order.orderId || '';

  const siteUrl = window.location.origin + window.location.pathname;
  const magicLink = siteUrl + '?redeem=' + encodeURIComponent(orderId) + '&email=' + encodeURIComponent(order.Email || '');

  const msg = encodeURIComponent(
    'Halo Kak ' + name + ', terima kasih! Pembayaran untuk ' + prod + ' telah LUNAS terverifikasi.\n\n' +
    '🔑 Order ID: ' + orderId + '\n' +
    '🎓 Akses Ruang Belajar Anda langsung di sini:\n' + magicLink + '\n\n' +
    'Selamat belajar & sukses selalu bersama EtalaseKu Digital Hub!'
  );

  const waUrl = 'https://wa.me/' + (phone.startsWith('0') ? ('62' + phone.slice(1)) : phone) + '?text=' + msg;
  window.open(waUrl, '_blank');
  showToast('Membuka WhatsApp untuk mengirim tautan belajar... 📲', 'success');
}
window.sendMagicLinkToWhatsApp = sendMagicLinkToWhatsApp;

function copyClassroomPortalLink() {
  const order = STATE.activeReceiptOrder;
  const orderId = order ? (order.ID_Order || order.orderId || '') : '';
  const email = order ? (order.Email || '') : '';
  const siteUrl = window.location.origin + window.location.pathname;
  const fullLink = orderId ? (siteUrl + '?redeem=' + encodeURIComponent(orderId) + '&email=' + encodeURIComponent(email)) : siteUrl;

  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullLink).then(() => {
      showToast('Tautan Ruang BelajarKu berhasil disalin! 📋', 'success', 2500);
    }).catch(() => {
      prompt('Salin tautan Ruang BelajarKu:', fullLink);
    });
  } else {
    prompt('Salin tautan Ruang BelajarKu:', fullLink);
  }
}
window.copyClassroomPortalLink = copyClassroomPortalLink;


// ============================================================================
// VIP MEMBER WELCOME & ANNOUNCEMENT VOUCHER CONTROLS (Items 1, 2, 6)
// ============================================================================
function checkAndRenderVipWelcomeCard() {
  const card = document.getElementById('vip-member-welcome-card');
  if (!card) return;

  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');

  // Hanya tampilkan jika member benar-benar sedang login aktif!
  if (savedOrderId || savedEmail) {
    card.style.display = 'block';

    const profile = typeof getMemberProfile === 'function' ? getMemberProfile() : { name: 'Daffa' };
    const displayName = profile.name || (savedEmail ? savedEmail.split('@')[0] : 'Daffa');
    const activeEmail = savedEmail || 'daffafazdian50@gmail.com';
    const activeOrderId = savedOrderId || 'ORD-20261102-214204-9617';

    const nameEl = document.getElementById('vip-user-display-name');
    if (nameEl) nameEl.textContent = displayName;

    const orderEl = document.getElementById('vip-user-order-id');
    if (orderEl) orderEl.textContent = activeOrderId;

    const emailEl = document.getElementById('vip-user-email-text');
    if (emailEl) emailEl.textContent = activeEmail;
  } else {
    card.style.display = 'none';
  }
}

function copyVipOrderId() {
  const orderEl = document.getElementById('vip-user-order-id');
  const text = orderEl ? orderEl.textContent.trim() : (localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261028-211630-4012');
  navigator.clipboard.writeText(text).then(() => {
    showToast('Order ID berhasil disalin ke clipboard! 📋');
  }).catch(() => {
    showToast('Order ID: ' + text);
  });
}

function openAnnouncementVoucherModal(code, title, desc) {
  const modal = document.getElementById('modal-announcement-voucher');
  if (!modal) return;

  const activeCode = code || 'BOOT-5J6T3T';
  const activeTitle = title || 'KODE REEDEM BOOTCAMP [ CATAT !! ]';
  const activeDesc = desc || 'Silahkan salin kode voucher resmi di bawah untuk membuka akses Bootcamp & Kelas di Portal:';

  const titleEl = document.getElementById('modal-voucher-title');
  if (titleEl) titleEl.textContent = activeTitle;

  const descEl = document.getElementById('modal-voucher-desc');
  if (descEl) descEl.textContent = activeDesc;

  const codeEl = document.getElementById('modal-voucher-code');
  if (codeEl) codeEl.textContent = activeCode;

  modal.style.display = 'flex';
}

function closeAnnouncementVoucherModal() {
  const modal = document.getElementById('modal-announcement-voucher');
  if (modal) modal.style.display = 'none';
}

function copyModalVoucherCode() {
  const codeEl = document.getElementById('modal-voucher-code');
  const code = codeEl ? codeEl.textContent.trim() : 'BOOT-5J6T3T';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Kode ' + code + ' berhasil disalin! 🚀');
  }).catch(() => {
    showToast('Kode: ' + code);
  });
}

function redeemModalVoucherNow() {
  const codeEl = document.getElementById('modal-voucher-code');
  const code = codeEl ? codeEl.textContent.trim() : 'BOOT-5J6T3T';
  closeAnnouncementVoucherModal();
  openRedeemModal();
  const inputCode = document.getElementById('redeem-input-code');
  if (inputCode) {
    inputCode.value = code;
    inputCode.focus();
  }
  showToast('Kode ' + code + ' otomatis terisi! Masukkan email Anda.');
}

function handleBootcampRegistration() {
  const wa = (DEFAULT_SITE_SETTINGS && DEFAULT_SITE_SETTINGS.wa_cs_number) || '6287894602627';
  const msg = encodeURIComponent('Halo Admin NexStore, saya ingin mendaftar BootCamp Batch 1 (NOVEMBER) : Dari Ide di Kepala Jadi AppWeb Nyata. Mohon info pembayaran & aksesnya.');
  window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
}


// ============================================================================
// THUMBALL & BOOTCAMP DYNAMIC SYNC ENGINE (CRM & FRONTEND)
// ============================================================================
const DEFAULT_THUMBALL_SETTINGS = {
  eyebrow: '✦ PRODUK DIGITAL - BY @DAFFAFAZDIAN.ID',
  title: 'Aplikasi & Kelas Siap Pakai',
  desc: 'Lihat hasil aplikasi kami, ikuti kelas & bootcamp intensif, lalu akses materinya langsung di portal member siswa tanpa hambatan.',
  btn1Text: '🚀 Lihat Bootcamp & Kelas Live',
  btn1Link: '#bootcamp',
  btn2Text: '🛍️ Katalog Produk',
  btn2Link: '#produk',
  promoBtnText: '📢 Kode Promo',
  promoCode: 'BOOT-5J6T3T',
  imageUrl: 'assets/hero/hero-slide-1.jpg'
};

const DEFAULT_BOOTCAMP_DATA = {
  badge: '⚡ Pendaftaran Dibuka',
  title: 'BootCamp Batch 1 (NOVEMBER)',
  duration: '⏱️ 4 pertemuan',
  schedule: '🕒 Mulai Minggu, 8 Nov 2026 • 19.30 WIB',
  pricePromo: 299000,
  priceNormal: 700000,
  quota: 100,
  meetings: '4x live (WIB)',
  buyUrl: 'https://lynk.id/daffafazdian',
  bannerUrl: 'assets/hero/hero-slide-3.jpg',
  classes: [
    'METODE 3 | LANJUTAN - Integrasi GAS ke VERCEL [CLAUDE]',
    'Kumpulan PRD (GRATIS)',
    'Kumpulan Video Cara Revisi & Upgrade',
    'METODE 1 | BASIC - Belajar GAS sangat Mudah [CLAUDE]',
    'METODE 2 | MENENGAH - Integrasi GAS ke GITHUB [CLAUDE]',
    'METODE 3 | LANJUTAN - Integrasi GAS ke Vercel [GEMINI]',
    'MIGRASI KE SUPABASE'
  ],
  curriculum: [
    { num: 1, title: 'Pertemuan 1', time: 'Minggu, 8 Nov 2026 • 19.30 WIB - 22.30 WIB' },
    { num: 2, title: 'Pertemuan 2', time: 'Minggu, 15 Nov 2026 • 19.30 WIB - 22.30 WIB' },
    { num: 3, title: 'Pertemuan 3', time: 'Minggu, 22 Nov 2026 • 19.30 WIB - 22.30 WIB' },
    { num: 4, title: 'Pertemuan 4', time: 'Minggu, 29 Nov 2026 • 19.30 WIB - 22.30 WIB' }
  ]
};

function getThumballSettings() {
  try {
    const raw = localStorage.getItem('nexstore_hero_thumball_data');
    if (raw) return { ...DEFAULT_THUMBALL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {}
  return DEFAULT_THUMBALL_SETTINGS;
}

function applyThumballSettingsToDom() {
  const d = getThumballSettings();

  const eyebrowEl = document.querySelector('.hero-tag');
  if (eyebrowEl && d.eyebrow) eyebrowEl.textContent = d.eyebrow;

  const titleEl = document.querySelector('.hero-title');
  if (titleEl && d.title) {
    titleEl.innerHTML = escapeHtml(d.title).replace(/Siap Pakai/i, '<span class="highlight">Siap Pakai</span>');
  }

  const descEl = document.querySelector('.hero-desc');
  if (descEl && d.desc) descEl.textContent = d.desc;

  const btn1 = document.getElementById('hero-btn-bootcamp');
  if (btn1) {
    if (d.btn1Text) btn1.innerHTML = '<span>' + escapeHtml(d.btn1Text) + '</span>';
    if (d.btn1Link) btn1.setAttribute('href', d.btn1Link);
  }

  const btn2 = document.getElementById('hero-btn-primary');
  if (btn2) {
    if (d.btn2Text) btn2.innerHTML = '<span>' + escapeHtml(d.btn2Text) + '</span>';
    if (d.btn2Link) btn2.setAttribute('href', d.btn2Link);
  }

  // Update Hero Slide 1 image
  if (d.imageUrl) {
    const heroImg1 = document.querySelector('.hero-slide.active img') || document.querySelector('.hero-slide img');
    if (heroImg1) heroImg1.src = formatImageUrl(d.imageUrl);
  }

  // Populate CRM Thumball Form fields if present
  const crmEyebrow = document.getElementById('crm-hero-eyebrow');
  if (crmEyebrow) crmEyebrow.value = d.eyebrow;
  const crmTitle = document.getElementById('crm-hero-title');
  if (crmTitle) crmTitle.value = d.title;
  const crmDesc = document.getElementById('crm-hero-desc');
  if (crmDesc) crmDesc.value = d.desc;
  const crmBtn1Text = document.getElementById('crm-hero-btn1-text');
  if (crmBtn1Text) crmBtn1Text.value = d.btn1Text;
  const crmBtn1Link = document.getElementById('crm-hero-btn1-link');
  if (crmBtn1Link) crmBtn1Link.value = d.btn1Link;
  const crmBtn2Text = document.getElementById('crm-hero-btn2-text');
  if (crmBtn2Text) crmBtn2Text.value = d.btn2Text;
  const crmBtn2Link = document.getElementById('crm-hero-btn2-link');
  if (crmBtn2Link) crmBtn2Link.value = d.btn2Link;
  const crmPromoText = document.getElementById('crm-hero-promo-btn-text');
  if (crmPromoText) crmPromoText.value = d.promoBtnText;
  const crmPromoCode = document.getElementById('crm-hero-promo-code');
  if (crmPromoCode) crmPromoCode.value = d.promoCode;
  const crmImgUrl = document.getElementById('crm-hero-img-url');
  if (crmImgUrl) crmImgUrl.value = d.imageUrl;
  const crmImgPrev = document.getElementById('crm-hero-img-preview');
  if (crmImgPrev) crmImgPrev.src = formatImageUrl(d.imageUrl);
}

function handleHeroUrlInput(val) {
  const prev = document.getElementById('crm-hero-img-preview');
  if (prev && val) prev.src = formatImageUrl(val);
}

function handleHeroFileInput(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      const urlInput = document.getElementById('crm-hero-img-url');
      if (urlInput) urlInput.value = base64;
      const prev = document.getElementById('crm-hero-img-preview');
      if (prev) prev.src = base64;
    };
    reader.readAsDataURL(file);
  }
}

function saveThumballSettings(e) {
  if (e && e.preventDefault) e.preventDefault();

  const data = {
    eyebrow: document.getElementById('crm-hero-eyebrow')?.value || DEFAULT_THUMBALL_SETTINGS.eyebrow,
    title: document.getElementById('crm-hero-title')?.value || DEFAULT_THUMBALL_SETTINGS.title,
    desc: document.getElementById('crm-hero-desc')?.value || DEFAULT_THUMBALL_SETTINGS.desc,
    btn1Text: document.getElementById('crm-hero-btn1-text')?.value || DEFAULT_THUMBALL_SETTINGS.btn1Text,
    btn1Link: document.getElementById('crm-hero-btn1-link')?.value || DEFAULT_THUMBALL_SETTINGS.btn1Link,
    btn2Text: document.getElementById('crm-hero-btn2-text')?.value || DEFAULT_THUMBALL_SETTINGS.btn2Text,
    btn2Link: document.getElementById('crm-hero-btn2-link')?.value || DEFAULT_THUMBALL_SETTINGS.btn2Link,
    promoBtnText: document.getElementById('crm-hero-promo-btn-text')?.value || DEFAULT_THUMBALL_SETTINGS.promoBtnText,
    promoCode: document.getElementById('crm-hero-promo-code')?.value || DEFAULT_THUMBALL_SETTINGS.promoCode,
    imageUrl: document.getElementById('crm-hero-img-url')?.value || DEFAULT_THUMBALL_SETTINGS.imageUrl
  };

  localStorage.setItem('nexstore_hero_thumball_data', JSON.stringify(data));
  applyThumballSettingsToDom();
  showToast('Perubahan Thumball Dashboard Utama berhasil disimpan! 🎨✨');
}

// ----------------------------------------------------------------------------
// BOOTCAMP SETTINGS & MODAL ENGINE
// ----------------------------------------------------------------------------
function getBootcampData() {
  try {
    const raw = localStorage.getItem('nexstore_bootcamp_data');
    if (raw) return { ...DEFAULT_BOOTCAMP_DATA, ...JSON.parse(raw) };
  } catch (e) {}
  return DEFAULT_BOOTCAMP_DATA;
}

function applyBootcampDataToDom() {
  const bc = getBootcampData();

  // Front card
  const frontBadge = document.getElementById('front-bc-badge-txt');
  if (frontBadge) frontBadge.textContent = bc.badge || '⚡ Pendaftaran Dibuka';

  const frontDuration = document.getElementById('front-bc-duration-txt');
  if (frontDuration) frontDuration.textContent = bc.duration || '⏱️ 4 pertemuan';

  const frontTitle = document.getElementById('front-bc-title-txt');
  if (frontTitle) frontTitle.textContent = bc.title;

  const frontSchedule = document.getElementById('front-bc-schedule-txt');
  if (frontSchedule) frontSchedule.innerHTML = '<span>' + escapeHtml(bc.schedule) + '</span>';

  const frontPrice = document.getElementById('front-bc-price-txt');
  if (frontPrice) frontPrice.textContent = 'Rp ' + Number(bc.pricePromo || 299000).toLocaleString('id-ID');

  const frontBanner = document.getElementById('front-bc-banner-img');
  if (frontBanner && bc.bannerUrl) frontBanner.src = formatImageUrl(bc.bannerUrl);

  // Detail Modal Elements
  const modalTitle = document.getElementById('modal-bc-title');
  if (modalTitle) modalTitle.textContent = bc.title;

  const modalBadge = document.getElementById('modal-bc-status-badge');
  if (modalBadge) modalBadge.textContent = bc.badge.replace(/[⚡🔥]/g, '').trim() || 'Pendaftaran dibuka';

  const modalInvest = document.getElementById('modal-bc-investasi');
  if (modalInvest) modalInvest.textContent = bc.pricePromo;

  const modalMeetings = document.getElementById('modal-bc-pertemuan');
  if (modalMeetings) modalMeetings.textContent = bc.meetings || '4x live (WIB)';

  const modalQuota = document.getElementById('modal-bc-kuota');
  if (modalQuota) modalQuota.textContent = bc.quota || '100';

  const modalSharp = document.getElementById('modal-bc-sharp-img');
  if (modalSharp && bc.bannerUrl) modalSharp.src = formatImageUrl(bc.bannerUrl);

  const modalBlur = document.getElementById('modal-bc-blur-bg');
  if (modalBlur && bc.bannerUrl) modalBlur.style.backgroundImage = 'url("' + formatImageUrl(bc.bannerUrl) + '")';

  // Classes list
  const classListEl = document.getElementById('modal-bc-class-list');
  if (classListEl && Array.isArray(bc.classes)) {
    classListEl.innerHTML = bc.classes.map(c => `
      <li class="modal-bc-class-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${escapeHtml(c)}</span>
      </li>
    `).join('');
  }

  // Populate CRM Bootcamp Form if present
  const crmBadge = document.getElementById('crm-bc-badge');
  if (crmBadge) crmBadge.value = bc.badge;
  const crmTitle = document.getElementById('crm-bc-title');
  if (crmTitle) crmTitle.value = bc.title;
  const crmPricePromo = document.getElementById('crm-bc-price-promo');
  if (crmPricePromo) crmPricePromo.value = bc.pricePromo;
  const crmPriceNormal = document.getElementById('crm-bc-price-normal');
  if (crmPriceNormal) crmPriceNormal.value = bc.priceNormal;
  const crmQuota = document.getElementById('crm-bc-quota');
  if (crmQuota) crmQuota.value = bc.quota;
  const crmMeetings = document.getElementById('crm-bc-meetings');
  if (crmMeetings) crmMeetings.value = bc.meetings;
  const crmSchedule = document.getElementById('crm-bc-schedule');
  if (crmSchedule) crmSchedule.value = bc.schedule;
  const crmBuyUrl = document.getElementById('crm-bc-buy-url');
  if (crmBuyUrl) crmBuyUrl.value = bc.buyUrl;
  const crmBannerUrl = document.getElementById('crm-bc-banner-url');
  if (crmBannerUrl) crmBannerUrl.value = bc.bannerUrl;
  const crmBannerPrev = document.getElementById('crm-bc-banner-preview');
  if (crmBannerPrev) crmBannerPrev.src = formatImageUrl(bc.bannerUrl);

  const crmClasses = document.getElementById('crm-bc-classes');
  if (crmClasses && Array.isArray(bc.classes)) crmClasses.value = bc.classes.join('\n');
}

function handleBootcampUrlInput(val) {
  const prev = document.getElementById('crm-bc-banner-preview');
  if (prev && val) prev.src = formatImageUrl(val);
}

function handleBootcampFileInput(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      const urlInput = document.getElementById('crm-bc-banner-url');
      if (urlInput) urlInput.value = base64;
      const prev = document.getElementById('crm-bc-banner-preview');
      if (prev) prev.src = base64;
    };
    reader.readAsDataURL(file);
  }
}

function saveBootcampSettings(e) {
  if (e && e.preventDefault) e.preventDefault();

  const rawClasses = document.getElementById('crm-bc-classes')?.value || '';
  const classes = rawClasses.split('\n').map(s => s.trim()).filter(Boolean);

  const data = {
    badge: document.getElementById('crm-bc-badge')?.value || DEFAULT_BOOTCAMP_DATA.badge,
    title: document.getElementById('crm-bc-title')?.value || DEFAULT_BOOTCAMP_DATA.title,
    duration: '⏱️ 4 pertemuan',
    schedule: document.getElementById('crm-bc-schedule')?.value || DEFAULT_BOOTCAMP_DATA.schedule,
    pricePromo: Number(document.getElementById('crm-bc-price-promo')?.value || 299000),
    priceNormal: Number(document.getElementById('crm-bc-price-normal')?.value || 700000),
    quota: Number(document.getElementById('crm-bc-quota')?.value || 100),
    meetings: document.getElementById('crm-bc-meetings')?.value || DEFAULT_BOOTCAMP_DATA.meetings,
    buyUrl: document.getElementById('crm-bc-buy-url')?.value || DEFAULT_BOOTCAMP_DATA.buyUrl,
    bannerUrl: document.getElementById('crm-bc-banner-url')?.value || DEFAULT_BOOTCAMP_DATA.bannerUrl,
    classes: classes.length > 0 ? classes : DEFAULT_BOOTCAMP_DATA.classes,
    curriculum: DEFAULT_BOOTCAMP_DATA.curriculum
  };

  localStorage.setItem('nexstore_bootcamp_data', JSON.stringify(data));
  applyBootcampDataToDom();
  showToast('Data Bootcamp & Kelas Live berhasil disimpan ke website! ⚡');
}

function openBootcampDetailModal() {
  const modal = document.getElementById('modal-bootcamp-detail');
  if (modal) {
    applyBootcampDataToDom();
    modal.style.display = 'flex';
  }
}

function closeBootcampDetailModal() {
  const modal = document.getElementById('modal-bootcamp-detail');
  if (modal) modal.style.display = 'none';
}

function handleBootcampBuyNow() {
  const bc = getBootcampData();
  const targetUrl = bc.buyUrl || 'https://lynk.id/daffafazdian';
  window.open(targetUrl, '_blank');
}


// ============================================================================
// 15. MEMBER AREA HOME & PROFILE MANAGEMENT ENGINE (FOTO 2 & 3 REFERENCE)
// Brand: NexStore Produk Digital - by @daffafazdian.id
// ============================================================================

function switchMemberPortalView(viewName) {
  const viewHome = document.getElementById('rb-view-home');
  const viewGrid = document.getElementById('rb-view-grid');
  const viewCourse = document.getElementById('rb-view-course');
  const viewDoc = document.getElementById('rb-view-document');

  if (viewHome) viewHome.style.display = 'none';
  if (viewGrid) viewGrid.style.display = 'none';
  if (viewCourse) viewCourse.style.display = 'none';
  if (viewDoc) viewDoc.style.display = 'none';

  const tabs = document.querySelectorAll('#cls-portal-tabs-nav .cls-tab-link');
  tabs.forEach(t => t.classList.remove('active'));

  if (viewName === 'home') {
    if (viewHome) viewHome.style.display = 'flex';
    const tabHome = document.getElementById('tab-link-home');
    if (tabHome) tabHome.classList.add('active');
  } else if (viewName === 'grid' || viewName === 'kelas') {
    if (viewGrid) viewGrid.style.display = 'block';
    const tabKelas = document.getElementById('tab-link-kelas');
    if (tabKelas) tabKelas.classList.add('active');
    if (typeof renderClassroomPortalModules === 'function') {
      renderClassroomPortalModules('', 'ALL');
    }
  } else if (viewName === 'jalur') {
    if (viewGrid) viewGrid.style.display = 'block';
    const tabJalur = document.getElementById('tab-link-jalur');
    if (tabJalur) tabJalur.classList.add('active');
  }

  const wrapper = document.getElementById('classroom-dashboard-portal');
  if (wrapper) wrapper.scrollTop = 0;
}
window.switchMemberPortalView = switchMemberPortalView;

function filterMemberHomeCategory(category, btn) {
  const buttons = document.querySelectorAll('.member-tab-pills .tab-pill-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('#member-home-cards-grid .member-product-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all') {
      card.style.display = 'flex';
    } else if (cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterMemberHomeCategory = filterMemberHomeCategory;

function getMemberProfile() {
  try {
    const raw = localStorage.getItem('nexstore_member_profile') || localStorage.getItem('etalaseku_member_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const savedEmail = localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';
  return {
    name: 'Daffa',
    whatsapp: '087894602627',
    email: savedEmail
  };
}
window.getMemberProfile = getMemberProfile;

function openMemberProfileModal() {
  const profile = getMemberProfile();
  const inputEmail = document.getElementById('cp-input-email');
  const inputName = document.getElementById('cp-input-name');
  const inputPhone = document.getElementById('cp-input-whatsapp');

  const activeEmail = profile.email || localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';
  const activeOrderId = localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261102-214204-9617';

  if (inputEmail) inputEmail.value = activeEmail;
  if (inputName) inputName.value = profile.name || 'Daffa';
  if (inputPhone) inputPhone.value = profile.whatsapp || '087894602627';

  const badgeEmail = document.getElementById('setting-modal-email');
  if (badgeEmail) badgeEmail.textContent = activeEmail;
  const badgeOrderId = document.getElementById('setting-modal-order-id');
  if (badgeOrderId) badgeOrderId.textContent = activeOrderId;

  const modal = document.getElementById('modal-complete-profile');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}
window.openMemberProfileModal = openMemberProfileModal;

function closeMemberProfileModal() {
  const modal = document.getElementById('modal-complete-profile');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closeMemberProfileModal = closeMemberProfileModal;

function handleSaveMemberProfile(event) {
  if (event && event.preventDefault) event.preventDefault();

  const inputEmail = document.getElementById('cp-input-email');
  const inputName = document.getElementById('cp-input-name');
  const inputPhone = document.getElementById('cp-input-whatsapp');

  const name = inputName ? inputName.value.trim() : 'Daffa';
  const whatsapp = inputPhone ? inputPhone.value.trim() : '087894602627';
  const email = inputEmail ? inputEmail.value.trim() : (localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com');

  if (!name) {
    if (typeof showToast === 'function') showToast('Nama panggilan wajib diisi!', 'error');
    return;
  }
  if (!whatsapp || whatsapp.length < 8) {
    if (typeof showToast === 'function') showToast('Nomor WhatsApp wajib diisi dengan benar (min. 8 digit)!', 'error');
    return;
  }

  const profileData = { name, whatsapp, email };
  try {
    localStorage.setItem('nexstore_member_profile', JSON.stringify(profileData));
    localStorage.setItem('etalaseku_member_profile', JSON.stringify(profileData));
    localStorage.setItem('nexstore_member_profile_completed', 'true');
    localStorage.setItem('etalaseku_member_email', email);
  } catch (e) {}

  // Update UI strings everywhere
  const memberNameEl = document.getElementById('member-display-name');
  if (memberNameEl) memberNameEl.textContent = name;

  const widgetNameEl = document.getElementById('widget-profile-name');
  if (widgetNameEl) widgetNameEl.textContent = name;

  const widgetEmailEl = document.getElementById('widget-profile-email');
  if (widgetEmailEl) widgetEmailEl.textContent = email;

  const widgetWaEl = document.getElementById('widget-profile-whatsapp');
  if (widgetWaEl) widgetWaEl.textContent = whatsapp;

  const widgetAvatarEl = document.getElementById('widget-avatar-initial');
  if (widgetAvatarEl) widgetAvatarEl.textContent = name.charAt(0).toUpperCase();

  const vipGreetingEl = document.getElementById('vip-user-greeting-name');
  if (vipGreetingEl) vipGreetingEl.textContent = name;

  closeMemberProfileModal();

  if (typeof showToast === 'function') {
    showToast('Profil member berhasil disimpan! Akses telah terbuka 🚀', 'success');
  }

  document.querySelectorAll('.member-display-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.widget-profile-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.widget-profile-email').forEach(el => el.textContent = email);
  document.querySelectorAll('.member-profile-whatsapp').forEach(el => el.textContent = whatsapp);
  document.querySelectorAll('.member-avatar-initial').forEach(el => el.textContent = name.charAt(0).toUpperCase());

  showMemberAreaDashboard();
}
window.handleSaveMemberProfile = handleSaveMemberProfile;

function openBootcampAnnouncementModal() {
  const modal = document.getElementById('modal-bootcamp-announcement');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}
window.openBootcampAnnouncementModal = openBootcampAnnouncementModal;

function closeBootcampAnnouncementModal() {
  const modal = document.getElementById('modal-bootcamp-announcement');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closeBootcampAnnouncementModal = closeBootcampAnnouncementModal;

function dismissMemberAnnouncement() {
  const card = document.getElementById('member-announcement-card');
  if (card) card.style.display = 'none';
}
window.dismissMemberAnnouncement = dismissMemberAnnouncement;

function copyBootcampRedeemCode() {
  const codeEl = document.getElementById('modal-bca-code-text');
  const code = codeEl ? codeEl.textContent.trim() : 'BOOT-5J6T3T';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      if (typeof showToast === 'function') showToast('Kode redeem ' + code + ' berhasil disalin! 📋', 'success');
    }).catch(() => {
      if (typeof showToast === 'function') showToast('Kode: ' + code, 'info');
    });
  } else {
    if (typeof showToast === 'function') showToast('Kode: ' + code, 'info');
  }
}
window.copyBootcampRedeemCode = copyBootcampRedeemCode;

function openKaryaFromMember() {
  if (typeof openPameranKaryaPortal === 'function') {
    openPameranKaryaPortal();
  } else if (typeof openAjukanKaryaModal === 'function') {
    openAjukanKaryaModal();
  } else {
    closeClassroomDashboard();
    scrollToSection('showcase');
  }
}
window.openKaryaFromMember = openKaryaFromMember;

function openPanduanModal() {
  if (typeof showToast === 'function') {
    showToast('Membuka Panduan Pembelajaran NexStore...', 'info');
  }
  closeClassroomDashboard();
  scrollToSection('features');
}
window.openPanduanModal = openPanduanModal;


// ============================================================================
// MAIN DASHBOARD MEMBER AREA ENGINE (FOTO 3 & FOTO 2 REFERENCE)
// ============================================================================
function showMemberAreaDashboard(orderId, email) {
  if (typeof renderMainMemberDashboardModules === 'function') renderMainMemberDashboardModules();
  const activeId = orderId || localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261102-214204-9617';
  const activeEmail = email || localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';
  
  localStorage.setItem('etalaseku_member_order_id', activeId);
  localStorage.setItem('etalaseku_member_email', activeEmail);

  // Tutup portal kelas fullscreen jika sedang aktif
  const classPortal = document.getElementById('classroom-dashboard-portal');
  if (classPortal) classPortal.classList.remove('active');
  localStorage.removeItem('etalaseku_is_in_classroom');

  // Sembunyikan Hero publik dan VIP welcome banner kecil
  const heroEl = document.getElementById('hero');
  if (heroEl) heroEl.style.display = 'none';

  const vipWelcomeCard = document.getElementById('vip-member-welcome-card');
  if (vipWelcomeCard) vipWelcomeCard.style.display = 'none';

  // Tampilkan View Member Area di Dashboard Utama (Foto 3)
  const mainDash = document.getElementById('main-member-area-dashboard');
  if (mainDash) {
    mainDash.style.display = 'block';
  }

  // Sinkronkan data profil member
  const profile = typeof getMemberProfile === 'function' ? getMemberProfile() : {
    name: 'Daffa',
    whatsapp: '087894602627',
    email: activeEmail
  };

  // Update semua elemen nama member di halaman
  document.querySelectorAll('.member-display-name').forEach(el => el.textContent = profile.name || 'Daffa');
  document.querySelectorAll('.widget-profile-name').forEach(el => el.textContent = profile.name || 'Daffa');
  document.querySelectorAll('.widget-profile-email').forEach(el => el.textContent = profile.email || activeEmail);
  document.querySelectorAll('.member-profile-whatsapp').forEach(el => el.textContent = profile.whatsapp || '087894602627');
  document.querySelectorAll('.member-avatar-initial').forEach(el => el.textContent = (profile.name || 'Daffa').charAt(0).toUpperCase());

  const memberNameEl = document.getElementById('member-display-name');
  if (memberNameEl) memberNameEl.textContent = profile.name || 'Daffa';

  // Perbarui status navbar
  updateMemberClassroomNavbar(activeId, activeEmail);

  // Scroll ke atas dengan halus agar melihat dashboard member
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Sesi profil dimuat tanpa memblokir layar dengan popup otomatis
  closeMemberProfileModal();
}
window.showMemberAreaDashboard = showMemberAreaDashboard;

function hideMemberAreaDashboard() {
  const mainDash = document.getElementById('main-member-area-dashboard');
  if (mainDash) mainDash.style.display = 'none';

  const heroEl = document.getElementById('hero');
  if (heroEl) heroEl.style.display = '';

  updateMemberClassroomNavbar(null, null);
}
window.hideMemberAreaDashboard = hideMemberAreaDashboard;

function openMemberAreaOrLogin() {
  const savedOrderId = localStorage.getItem('etalaseku_member_order_id');
  const savedEmail = localStorage.getItem('etalaseku_member_email');
  if (savedOrderId || savedEmail) {
    showMemberAreaDashboard(savedOrderId, savedEmail);
  } else {
    // Pengunjung belum login, buka auth modal
    closeAllModals();
    const modal = document.getElementById('modal-member-login') || document.getElementById('modal-unified-auth');
    if (modal) modal.classList.add('active');
  }
}
window.openMemberAreaOrLogin = openMemberAreaOrLogin;

function filterMainMemberCategory(category, btn) {
  // Update active pill button
  const pills = document.querySelectorAll('#main-member-area-dashboard .tab-pill-btn');
  pills.forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const grid = document.getElementById('main-member-home-cards-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.member-product-card');

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterMainMemberCategory = filterMainMemberCategory;

function filterMainMemberSearch(query) {
  const q = (query || '').toLowerCase().trim();
  const grid = document.getElementById('main-member-home-cards-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.member-product-card');

  cards.forEach(card => {
    const title = (card.querySelector('.mp-card-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.mp-card-desc')?.textContent || '').toLowerCase();
    if (!q || title.includes(q) || desc.includes(q)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterMainMemberSearch = filterMainMemberSearch;


// ============================================================================
// DYNAMIC CRM MODULE SYNC ENGINE (ITEM 5 REFERENCE)
// Menghubungkan Beranda Member Area secara otomatis dengan Modul Portal Ruang Belajar CRM
// ============================================================================
function renderMainMemberDashboardModules(filterCategory, searchQuery) {
  const container = document.getElementById('main-member-home-cards-grid');
  const containerAlt = document.getElementById('member-home-cards-grid');

  let allModules = [];
  if (typeof loadStoredClassroomModules === 'function') {
    allModules = loadStoredClassroomModules();
  }
  if (!Array.isArray(allModules) || allModules.length === 0) {
    allModules = (typeof DEFAULT_MODULES !== 'undefined' && Array.isArray(DEFAULT_MODULES)) ? DEFAULT_MODULES : [];
  }

  // Point 2: Filter modul berdasarkan Order ID & Email Member yang sedang aktif
  // Siswa dengan Order ID Kumpulan PRD hanya menampilkan 1 modul miliknya (Sesuai Alur Sistem Foto 1 & 2)
  const activeOrderId = localStorage.getItem('etalaseku_member_order_id') || 'ORD-20261102-214204-9617';
  const activeEmail = localStorage.getItem('etalaseku_member_email') || 'daffafazdian50@gmail.com';

  let memberModules = [];
  if (typeof filterModulesForCurrentStudent === 'function') {
    memberModules = filterModulesForCurrentStudent(allModules, activeOrderId, activeEmail);
  }
  if (!Array.isArray(memberModules) || memberModules.length === 0) {
    // Fallback: Jika member memiliki order PRD, filter modul PRD
    memberModules = allModules.filter(m => {
      const title = (m.Judul_Modul || '').toLowerCase();
      const desc = (m.Deskripsi || '').toLowerCase();
      return title.includes('prd') || desc.includes('prd');
    });
    if (memberModules.length === 0) {
      memberModules = allModules.slice(0, 1);
    }
  }

  const totalCount = memberModules.length;
  let kelasCount = 0;
  let dokumenCount = 0;

  memberModules.forEach(m => {
    const isDoc = (m.Tipe_Badge || m.Kategori || '').toLowerCase().includes('dokumen') ||
                  (m.Tipe_Konten || '').toLowerCase().includes('pdf') ||
                  (m.Tipe_Konten || '').toLowerCase().includes('template') ||
                  (m.Tipe_Konten || '').toLowerCase().includes('dokumen');
    if (isDoc) dokumenCount++;
    else kelasCount++;
  });

  // Sinkronkan Kartu KPI & Badge Jumlah
  const kpiEl = document.getElementById('main-kpi-owned-count');
  if (kpiEl) kpiEl.textContent = `${totalCount} Produk Dimiliki`;
  const kpiAltEl = document.getElementById('kpi-owned-count');
  if (kpiAltEl) kpiAltEl.textContent = `${totalCount} Produk Dimiliki`;

  const countAll = document.getElementById('main-count-home-all');
  if (countAll) countAll.textContent = totalCount;
  const countKelas = document.getElementById('main-count-home-kelas');
  if (countKelas) countKelas.textContent = kelasCount;
  const countDokumen = document.getElementById('main-count-home-dokumen');
  if (countDokumen) countDokumen.textContent = dokumenCount;

  const countAllAlt = document.getElementById('count-home-all');
  if (countAllAlt) countAllAlt.textContent = totalCount;
  const countKelasAlt = document.getElementById('count-home-kelas');
  if (countKelasAlt) countKelasAlt.textContent = kelasCount;
  const countDokumenAlt = document.getElementById('count-home-dokumen');
  if (countDokumenAlt) countDokumenAlt.textContent = dokumenCount;

  // Render HTML kartu dinamis dari database modul CRM
  const generateCardsHtml = () => {
    return memberModules.map(m => {
      const isDoc = (m.Tipe_Badge || m.Kategori || '').toLowerCase().includes('dokumen') ||
                    (m.Tipe_Konten || '').toLowerCase().includes('pdf') ||
                    (m.Tipe_Konten || '').toLowerCase().includes('template') ||
                    (m.Tipe_Konten || '').toLowerCase().includes('dokumen');
      const cat = isDoc ? 'dokumen' : 'kelas';
      const badgeText = isDoc ? 'DOKUMEN' : 'KELAS';
      const thumb = m.Thumbnail_URL || m.Banner_URL || 'assets/hero/hero-slide-1.jpg';
      const episodes = m.Episode || (m.Durasi_Menit ? Math.ceil(m.Durasi_Menit / 15) : 6);
      const materiCount = m.Materi_Count || (m.Durasi_Menit ? Math.ceil(m.Durasi_Menit / 2) : 27);
      const metaText = isDoc ? `${materiCount} materi • Template & Berkas Dokumen` : `${episodes} episode • ${materiCount} materi`;

      const actionBtn = isDoc
        ? `<button type="button" class="mp-card-action-btn mp-btn-doc" onclick="openClassroomDashboard(); if(typeof openDocumentPackageView==='function') openDocumentPackageView('${m.ID_Materi}');">📑 Akses Produk</button>`
        : `<button type="button" class="mp-card-action-btn mp-btn-primary" onclick="openClassroomDashboard(); if(typeof openCourseView==='function') openCourseView('${m.ID_Materi}');">📖 Buka Ruang Belajar</button>`;

      return `
        <div class="member-product-card" data-category="${cat}">
          <div class="mp-card-thumb-wrap">
            <img src="${thumb}" alt="${escapeHtml(m.Judul_Modul)}" class="mp-card-img" onerror="this.onerror=null; this.src='assets/hero/hero-slide-1.jpg';">
            <span class="mp-badge-category">${badgeText}</span>
            <span class="mp-badge-status mp-badge-dimiliki">Dimiliki</span>
          </div>
          <div class="mp-card-body">
            <h3 class="mp-card-title">${escapeHtml(m.Judul_Modul)}</h3>
            <p class="mp-card-desc">${escapeHtml(m.Deskripsi || 'Modul kurikulum pembelajaran resmi dari CRM.')}</p>
            <div class="mp-card-meta">${metaText}</div>
            ${actionBtn}
          </div>
        </div>
      `;
    }).join('');
  };

  const cardsHtml = generateCardsHtml();
  if (container) container.innerHTML = cardsHtml;
  if (containerAlt) containerAlt.innerHTML = cardsHtml;

  if (filterCategory) filterMainMemberCategory(filterCategory);
  if (searchQuery) filterMainMemberSearch(searchQuery);
}
window.renderMainMemberDashboardModules = renderMainMemberDashboardModules;



// ============================================================================
// COMPREHENSIVE AUTOMATIC THEME MANAGER ENGINE
// Mendukung Mode Terang (Default Warm Pastel Tech) & Mode Gelap
// Berjalan otomatis, tanpa teks (hanya icon), dan merubah seluruh halaman website!
// ============================================================================
function initAppTheme() {
  let theme = localStorage.getItem('nexstore_theme');
  if (!theme) {
    // Berjalan otomatis: deteksi preferensi sistem OS / browser
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
  }
  applyAppTheme(theme);

  // Listener otomatis jika user merubah preferensi tema di level OS / browser
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('nexstore_theme_manual')) {
          applyAppTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch(err) {}
  }
}

function applyAppTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (isDark) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }

  // Update seluruh tombol toggle tema di seluruh website (hanya tombol icon, tanpa tulisan teks)
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    // Pastikan tidak ada teks tulisan mode di dalam tombol
    const label = btn.querySelector('.theme-toggle-label');
    if (label) label.remove();

    let icon = btn.querySelector('.theme-toggle-icon');
    if (!icon) {
      icon = document.createElement('span');
      icon.className = 'theme-toggle-icon';
      btn.appendChild(icon);
    }

    if (isDark) {
      icon.textContent = '☀️';
      btn.title = 'Beralih ke Mode Terang (Warm Pastel Tech)';
      btn.setAttribute('aria-label', 'Beralih ke Mode Terang');
    } else {
      icon.textContent = '🌙';
      btn.title = 'Beralih ke Mode Gelap';
      btn.setAttribute('aria-label', 'Beralih ke Mode Gelap');
    }
  });
}

function toggleAppTheme() {
  const current = document.documentElement.getAttribute('data-theme') || (document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('nexstore_theme', next);
  localStorage.setItem('nexstore_theme_manual', 'true');
  applyAppTheme(next);
  if (typeof showToast === 'function') {
    showToast(next === 'dark' ? '🌙 Mode Gelap Aktif (Seluruh Halaman)' : '☀️ Mode Terang Aktif (Warm Pastel Tech)', 'info', 2000);
  }
}
window.initAppTheme = initAppTheme;
window.applyAppTheme = applyAppTheme;
window.toggleAppTheme = toggleAppTheme;

// Inisialisasi tema otomatis secepat mungkin saat halaman dimuat
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
  initAppTheme();
  if (typeof renderMainMemberDashboardModules === 'function') renderMainMemberDashboardModules(); // On DOM ready
});
  } else {
    initAppTheme();
  }
}
