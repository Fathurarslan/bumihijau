// Server Express BumiHijau
// Tugasnya: menyimpan pesanan, menghitung harga (supaya tidak bisa diakali dari browser),
// dan berkomunikasi dengan Midtrans memakai Server Key yang dirahasiakan di file .env.

import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { findProduct, priceOf, shippingCost, provinces } from '../src/data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const DIST_DIR = path.join(ROOT, 'dist');

const PORT = Number(process.env.PORT) || 3001;
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || '';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Midtrans dianggap aktif kalau kedua kunci sudah diisi dan bukan contoh dari .env.example
const MIDTRANS_ENABLED =
  SERVER_KEY.length > 10 && CLIENT_KEY.length > 10 && !SERVER_KEY.includes('xxxx') && !CLIENT_KEY.includes('xxxx');

const SNAP_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const CORE_API_URL = IS_PRODUCTION ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';

// ---------- Penyimpanan pesanan (file JSON sederhana) ----------

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = ORDERS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(orders, null, 2));
  fs.renameSync(tmp, ORDERS_FILE);
}

function saveOrder(order) {
  const orders = readOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i >= 0) orders[i] = order;
  else orders.unshift(order);
  writeOrders(orders);
  return order;
}

function getOrder(id) {
  return readOrders().find((o) => o.id === id);
}

function newOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BH${ymd}${rand}`;
}

// Data pesanan yang aman diperlihatkan ke pembeli (tanpa token internal)
function publicOrder(o) {
  const { midtrans, ...rest } = o;
  return {
    ...rest,
    payment: midtrans
      ? {
          redirectUrl: midtrans.redirectUrl,
          token: o.status === 'pending' ? midtrans.token : undefined,
          transactionStatus: midtrans.transactionStatus,
          paymentType: midtrans.paymentType,
        }
      : undefined,
  };
}

// ---------- Midtrans ----------

function midtransAuthHeader() {
  return 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64');
}

async function createSnapTransaction(order, origin) {
  const itemDetails = order.items.map((it) => ({
    id: String(it.productId) + (it.variant ? '-' + it.variant : ''),
    price: it.price,
    quantity: it.qty,
    name: (it.name + (it.variant ? ' ' + it.variant : '')).slice(0, 50),
  }));
  if (order.shipping > 0) {
    itemDetails.push({ id: 'ONGKIR', price: order.shipping, quantity: 1, name: 'Ongkos kirim' });
  }

  const c = order.customer;
  const body = {
    transaction_details: { order_id: order.id, gross_amount: order.total },
    item_details: itemDetails,
    customer_details: {
      first_name: c.name,
      email: c.email,
      phone: c.phone,
      shipping_address: {
        first_name: c.name,
        phone: c.phone,
        address: c.address,
        city: c.city,
        postal_code: c.postcode,
        country_code: 'IDN',
      },
    },
    callbacks: {
      finish: `${origin}/pesanan/${order.id}?email=${encodeURIComponent(c.email)}`,
    },
  };

  let res;
  try {
    res = await fetch(SNAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: midtransAuthHeader(),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Tidak bisa terhubung ke Midtrans. Periksa koneksi internet laptop kamu.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Server Key Midtrans salah. Cek lagi isi file .env (pastikan kunci Sandbox).');
  if (!res.ok || !data.token) {
    const msg = Array.isArray(data.error_messages) ? data.error_messages.join(', ') : res.statusText;
    throw new Error('Midtrans menolak transaksi: ' + msg);
  }
  return { token: data.token, redirectUrl: data.redirect_url };
}

async function fetchMidtransStatus(orderId) {
  const res = await fetch(`${CORE_API_URL}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: 'application/json', Authorization: midtransAuthHeader() },
  });
  return res.json();
}

// Ubah status Midtrans menjadi status pesanan toko
function mapMidtransStatus(trx) {
  const s = trx.transaction_status;
  if (s === 'settlement') return 'processing';
  if (s === 'capture') return trx.fraud_status === 'challenge' ? 'on-hold' : 'processing';
  if (s === 'pending') return 'pending';
  if (s === 'deny' || s === 'cancel' || s === 'expire' || s === 'failure') return 'cancelled';
  if (s === 'refund' || s === 'partial_refund') return 'refunded';
  return null;
}

function applyMidtransResult(order, trx) {
  const newStatus = mapMidtransStatus(trx);
  order.midtrans = {
    ...order.midtrans,
    transactionStatus: trx.transaction_status,
    paymentType: trx.payment_type,
  };
  // Pesanan yang sudah dikirim atau selesai oleh admin tidak dikembalikan ke status lama
  if (newStatus && !['shipped', 'completed'].includes(order.status)) {
    if (order.status !== newStatus) order.history.push({ at: new Date().toISOString(), status: newStatus, by: 'Midtrans' });
    order.status = newStatus;
  }
  order.updatedAt = new Date().toISOString();
  return order;
}

// ---------- Validasi pesanan ----------

function clean(v, max = 200) {
  return String(v ?? '').trim().slice(0, max);
}

function buildOrder(body) {
  const c = body.customer || {};
  const customer = {
    name: clean(c.name, 80),
    email: clean(c.email, 120).toLowerCase(),
    phone: clean(c.phone, 20),
    address: clean(c.address, 250),
    city: clean(c.city, 80),
    province: clean(c.province, 60),
    postcode: clean(c.postcode, 10),
    note: clean(c.note, 300),
  };

  const errors = [];
  if (customer.name.length < 2) errors.push('Nama wajib diisi');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.push('Email tidak valid');
  if (!/^[0-9+ ]{8,20}$/.test(customer.phone)) errors.push('Nomor telepon tidak valid');
  if (customer.address.length < 5) errors.push('Alamat wajib diisi');
  if (customer.city.length < 2) errors.push('Kota wajib diisi');
  if (!provinces.includes(customer.province)) errors.push('Provinsi wajib dipilih');
  if (!/^[0-9]{5}$/.test(customer.postcode)) errors.push('Kode pos harus 5 angka');

  const items = [];
  for (const raw of Array.isArray(body.items) ? body.items : []) {
    const p = findProduct(raw.productId);
    const qty = Math.floor(Number(raw.qty));
    if (!p || !(qty >= 1 && qty <= 99)) {
      errors.push('Ada produk di keranjang yang tidak valid');
      continue;
    }
    const price = priceOf(p, raw.variant);
    if (price == null) {
      errors.push(`Variasi ${p.name} tidak valid`);
      continue;
    }
    items.push({ productId: p.id, name: p.name, variant: p.variants ? raw.variant : null, price, qty });
  }
  if (items.length === 0) errors.push('Keranjang masih kosong');

  const paymentMethod = ['midtrans', 'transfer', 'cod'].includes(body.paymentMethod) ? body.paymentMethod : null;
  if (!paymentMethod) errors.push('Metode pembayaran wajib dipilih');
  if (paymentMethod === 'midtrans' && !MIDTRANS_ENABLED) errors.push('Pembayaran Midtrans belum diaktifkan di server');

  if (errors.length) return { errors };

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = shippingCost(customer.province);
  const now = new Date().toISOString();
  const status = paymentMethod === 'transfer' ? 'on-hold' : paymentMethod === 'cod' ? 'processing' : 'pending';

  return {
    order: {
      id: newOrderId(),
      createdAt: now,
      updatedAt: now,
      customer,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod,
      status,
      history: [{ at: now, status, by: 'Sistem' }],
    },
  };
}

// ---------- Aplikasi Express ----------

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/config', (req, res) => {
  res.json({ midtransEnabled: MIDTRANS_ENABLED, clientKey: MIDTRANS_ENABLED ? CLIENT_KEY : null, isProduction: IS_PRODUCTION });
});

// Membuat pesanan baru
app.post('/api/orders', async (req, res) => {
  const { order, errors } = buildOrder(req.body || {});
  if (errors) return res.status(400).json({ error: errors.join('. ') });

  if (order.paymentMethod === 'midtrans') {
    const origin = req.get('origin') || `${req.protocol}://${req.get('host')}`;
    try {
      const snap = await createSnapTransaction(order, origin);
      order.midtrans = { token: snap.token, redirectUrl: snap.redirectUrl, transactionStatus: 'pending' };
    } catch (err) {
      console.error(err);
      return res.status(502).json({ error: err.message });
    }
  }

  saveOrder(order);
  res.status(201).json({ order: publicOrder(order) });
});

// Melihat pesanan (pembeli wajib tahu email pemesan)
app.get('/api/orders/:id', (req, res) => {
  const order = getOrder(clean(req.params.id, 40).toUpperCase());
  const email = clean(req.query.email, 120).toLowerCase();
  if (!order || order.customer.email !== email) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan. Periksa kembali Order ID dan email.' });
  }
  res.json({ order: publicOrder(order) });
});

// Riwayat pesanan: semua pesanan milik email pembeli (toko ini tanpa akun, jadi email menjadi identitas pembeli)
app.post('/api/orders/mine', async (req, res) => {
  const emails = (Array.isArray(req.body?.emails) ? req.body.emails : [])
    .slice(0, 5)
    .map((e) => clean(e, 120).toLowerCase())
    .filter(Boolean);
  const found = readOrders().filter((o) => emails.includes(o.customer.email));

  // Pesanan Midtrans yang belum dibayar: cek dulu status terbarunya
  await Promise.all(
    found
      .filter((o) => o.paymentMethod === 'midtrans' && o.status === 'pending' && MIDTRANS_ENABLED)
      .map(async (order) => {
        try {
          const trx = await fetchMidtransStatus(order.id);
          if (trx.transaction_status) {
            applyMidtransResult(order, trx);
            saveOrder(order);
          }
        } catch (err) {
          console.error(err);
        }
      })
  );

  found.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders: found.map(publicOrder) });
});

// Mengecek ulang status pembayaran ke Midtrans
app.post('/api/orders/:id/refresh', async (req, res) => {
  const order = getOrder(clean(req.params.id, 40).toUpperCase());
  const email = clean(req.body?.email, 120).toLowerCase();
  if (!order || order.customer.email !== email) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  if (order.paymentMethod !== 'midtrans' || !MIDTRANS_ENABLED) return res.json({ order: publicOrder(order) });

  try {
    const trx = await fetchMidtransStatus(order.id);
    if (trx.transaction_status) {
      applyMidtransResult(order, trx);
      saveOrder(order);
    }
    res.json({ order: publicOrder(order) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Gagal menghubungi Midtrans' });
  }
});

// Notifikasi otomatis dari Midtrans (Payment Notification URL).
// Di localhost ini tidak akan terpanggil karena Midtrans tidak bisa mengakses laptop kamu,
// jadi status juga bisa dicek manual lewat tombol "Cek status pembayaran".
app.post('/api/midtrans/notification', (req, res) => {
  const n = req.body || {};
  const expected = crypto
    .createHash('sha512')
    .update(String(n.order_id) + String(n.status_code) + String(n.gross_amount) + SERVER_KEY)
    .digest('hex');
  if (!MIDTRANS_ENABLED || n.signature_key !== expected) return res.status(403).json({ error: 'Signature tidak valid' });

  const order = getOrder(String(n.order_id));
  if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  applyMidtransResult(order, n);
  saveOrder(order);
  res.json({ ok: true });
});

// ---------- Admin ----------

function requireAdmin(req, res, next) {
  if (req.get('x-admin-password') !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Password admin salah' });
  next();
}

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  res.json({ orders: readOrders() });
});

const ADMIN_STATUSES = ['pending', 'on-hold', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'];

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
  const status = req.body?.status;
  if (!ADMIN_STATUSES.includes(status)) return res.status(400).json({ error: 'Status tidak valid' });
  if (order.status !== status) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.history.push({ at: order.updatedAt, status, by: 'Admin' });
    saveOrder(order);
  }
  res.json({ order });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan' }));

// Mode produksi: setelah "npm run build", server ini juga menyajikan tampilan React
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server BumiHijau berjalan di http://localhost:${PORT}`);
  console.log(
    MIDTRANS_ENABLED
      ? `Midtrans aktif (${IS_PRODUCTION ? 'PRODUCTION' : 'Sandbox'})`
      : 'Midtrans BELUM aktif: isi MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY di file .env'
  );
});
