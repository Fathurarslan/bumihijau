// Fungsi kecil untuk memanggil server Express
async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan. Pastikan server sudah berjalan.');
  return data;
}

export const api = {
  config: () => request('/api/config'),
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (id, email) => request(`/api/orders/${encodeURIComponent(id)}?email=${encodeURIComponent(email)}`),
  myOrders: (emails) => request('/api/orders/mine', { method: 'POST', body: JSON.stringify({ emails }) }),
  refreshOrder: (id, email) =>
    request(`/api/orders/${encodeURIComponent(id)}/refresh`, { method: 'POST', body: JSON.stringify({ email }) }),
  adminOrders: (password) => request('/api/admin/orders', { headers: { 'x-admin-password': password } }),
  adminSetStatus: (password, id, status) =>
    request(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'x-admin-password': password },
      body: JSON.stringify({ status }),
    }),
};

// Memuat script Snap Midtrans satu kali saja
let snapPromise = null;
export function loadSnap(clientKey, isProduction) {
  if (window.snap) return Promise.resolve(window.snap);
  if (snapPromise) return snapPromise;
  snapPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = isProduction ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';
    s.setAttribute('data-client-key', clientKey);
    s.onload = () => resolve(window.snap);
    s.onerror = () => {
      snapPromise = null;
      reject(new Error('Gagal memuat Midtrans. Periksa koneksi internet.'));
    };
    document.body.appendChild(s);
  });
  return snapPromise;
}

export const STATUS_LABEL = {
  pending: 'Menunggu pembayaran',
  'on-hold': 'Menunggu konfirmasi transfer',
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Dikembalikan',
};

export const PAYMENT_LABEL = {
  midtrans: 'Pembayaran online (Midtrans)',
  transfer: 'Transfer bank',
  cod: 'Bayar di tempat (COD)',
};

// Nama metode yang dipilih pembeli di popup Midtrans
export const MIDTRANS_TYPE_LABEL = {
  bank_transfer: 'Virtual Account bank',
  echannel: 'Mandiri Bill',
  permata: 'Virtual Account Permata',
  credit_card: 'kartu kredit',
  gopay: 'GoPay',
  qris: 'QRIS',
  shopeepay: 'ShopeePay',
  cstore: 'gerai minimarket',
};

export function formatDate(iso) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}
