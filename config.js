/**
 * ============================================================================
 * ETALASEKU DIGITAL HUB & ACADEMY — FRONTEND CONFIGURATION
 * ============================================================================
 * Standar: gas-pro-api & gas-rahasia-script-properties
 * File ini hanya memuat URL endpoint GAS dan konfigurasi publik.
 * Tidak ada token rahasia, password, atau API key di sisi klien.
 * ============================================================================
 */

const APP_CONFIG = {
  // Ganti dengan URL deployment Web App GAS Anda (Execute as: Me, Access: Anyone)
  // Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
  GAS_URL: 'https://script.google.com/macros/s/AKfycbw8uzOamJtwPIq3kd8DGIIiWtNWu-xHfBs1rU4DOhvDQ42awELmVYn3elAh2aJP5x4SSQ/exec',

  // Nama Brand & Default Contact
  BRAND_NAME: 'EtalaseKu Digital Hub & Academy',
  DEFAULT_WA_CS: '6287894602627',
  DEFAULT_CS_NAME: 'Admin Daffa (Support)',
  
  // Data Fallback Offline / Mock jika belum tersambung ke URL GAS asli
  USE_MOCK_FALLBACK: false,

  // Versi Frontend
  VERSION: '2.0.0'
};
