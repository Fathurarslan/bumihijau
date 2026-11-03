import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, PAYMENT_LABEL, STATUS_LABEL } from '../api.js';
import { findProduct, rupiah } from '../data/products.js';
import { forgetEmail, loadEmails, rememberEmail } from '../orderHistory.js';
import ProductImage from '../components/ProductImage.jsx';

// Tab seperti di aplikasi belanja: satu tab bisa berisi beberapa status
const TABS = [
  { id: 'all', label: 'Semua', statuses: null },
  { id: 'unpaid', label: 'Belum Bayar', statuses: ['pending', 'on-hold'] },
  { id: 'processing', label: 'Diproses', statuses: ['processing'] },
  { id: 'shipped', label: 'Dikirim', statuses: ['shipped'] },
  { id: 'completed', label: 'Selesai', statuses: ['completed'] },
  { id: 'cancelled', label: 'Dibatalkan', statuses: ['cancelled', 'refunded'] },
];

// Keterangan singkat posisi pesanan saat ini
const STATUS_NOTE = {
  pending: 'Selesaikan pembayaran lewat Midtrans.',
  'on-hold': 'Menunggu admin mengonfirmasi transfermu.',
  processing: 'Pembayaran diterima, pesanan sedang dikemas.',
  shipped: 'Pesanan sedang dalam perjalanan ke alamatmu.',
  completed: 'Pesanan sudah sampai. Terima kasih!',
  cancelled: 'Pesanan dibatalkan.',
  refunded: 'Dana sudah dikembalikan.',
};

function inTab(order, tab) {
  return !tab.statuses || tab.statuses.includes(order.status);
}

function OrderCard({ order }) {
  const url = `/pesanan/${order.id}?email=${encodeURIComponent(order.customer.email)}`;
  const first = order.items[0];
  const product = findProduct(first.productId) || { name: first.name, emoji: '📦' };
  const count = order.items.reduce((s, it) => s + it.qty, 0);
  const unpaid = order.status === 'pending';

  return (
    <article className="order-card">
      <header className="order-card-head">
        <span>
          <b>{order.id}</b>
          <small>{formatDate(order.createdAt)} · {PAYMENT_LABEL[order.paymentMethod]}</small>
        </span>
        <span className={`status-pill s-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </header>
      <Link to={url} className="order-card-body">
        <ProductImage product={product} className="order-thumb" />
        <span className="order-card-items">
          <b>
            {first.name}
            {first.variant && <small> ({first.variant})</small>}
          </b>
          <small>{first.qty} × {rupiah(first.price)}</small>
          {order.items.length > 1 && <small>+{order.items.length - 1} produk lainnya</small>}
        </span>
        <span className="order-card-total">
          <small>Total {count} barang</small>
          <b>{rupiah(order.total)}</b>
        </span>
      </Link>
      <footer className="order-card-foot">
        <span>{STATUS_NOTE[order.status]}</span>
        <Link to={url} className={`btn btn-sm ${unpaid ? 'btn-primary' : 'btn-outline'}`}>
          {unpaid ? 'Bayar Sekarang' : 'Lihat Detail'}
        </Link>
      </footer>
    </article>
  );
}

function EmailForm({ onSubmit, button }) {
  const [value, setValue] = useState('');
  return (
    <form
      className="email-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
        setValue('');
      }}
    >
      <input
        required
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Email yang dipakai saat checkout"
        aria-label="Email pembeli"
      />
      <button className="btn btn-primary">{button}</button>
    </form>
  );
}

export default function Orders() {
  const [emails, setEmails] = useState(loadEmails);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (emails.length === 0) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const { orders } = await api.myOrders(emails);
      setOrders(orders);
      setError('');
    } catch (err) {
      setError(err.message);
      setOrders((o) => o ?? []);
    } finally {
      setLoading(false);
    }
  }, [emails]);

  useEffect(() => {
    load();
    // Muat ulang saat kembali ke tab ini, supaya perubahan status dari admin langsung terlihat
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [load]);

  function addEmail(email) {
    setEmails(rememberEmail(email));
    setTab(TABS[0]);
  }

  // Belum ada email tersimpan: minta pembeli memasukkan email dulu
  if (emails.length === 0) {
    return (
      <div className="container page narrow">
        <div className="page-head center">
          <span className="eyebrow">Pesanan Saya</span>
          <h1>Riwayat Pesanan</h1>
          <p>Masukkan email yang kamu pakai saat checkout untuk melihat semua pesananmu.</p>
        </div>
        <div className="card email-card">
          <EmailForm onSubmit={addEmail} button="Lihat Pesanan" />
          <p className="hint">Setelah checkout, email otomatis tersimpan sehingga kamu tidak perlu mengetiknya lagi.</p>
        </div>
      </div>
    );
  }

  const shown = orders ? orders.filter((o) => inTab(o, tab)) : [];

  return (
    <div className="container page narrow">
      <div className="page-head row">
        <div>
          <span className="eyebrow">Pesanan Saya</span>
          <h1>Riwayat Pesanan</h1>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
          {loading ? 'Memuat...' : '↻ Perbarui'}
        </button>
      </div>

      <div className="email-chips">
        <span>Pesanan untuk:</span>
        {emails.map((e) => (
          <span className="email-chip" key={e}>
            {e}
            <button onClick={() => setEmails(forgetEmail(e))} aria-label={`Hapus ${e}`} title="Hapus email ini">×</button>
          </span>
        ))}
      </div>

      <div className="order-tabs" role="tablist">
        {TABS.map((t) => {
          const n = orders ? orders.filter((o) => inTab(o, t)).length : 0;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab.id === t.id}
              className={tab.id === t.id ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t.label}
              {n > 0 && t.statuses && <span>{n}</span>}
            </button>
          );
        })}
      </div>

      {error && <p className="form-error">{error}</p>}

      {!orders ? (
        <p className="loading">Memuat pesanan...</p>
      ) : shown.length === 0 ? (
        <div className="empty">
          <span className="empty-icon">🧾</span>
          <h3>{orders.length === 0 ? 'Belum ada pesanan' : `Tidak ada pesanan "${tab.label}"`}</h3>
          <p>{orders.length === 0 ? 'Pesanan yang kamu buat akan muncul di sini.' : 'Coba lihat tab lainnya.'}</p>
          {orders.length === 0 && <Link to="/belanja" className="btn btn-primary">Mulai Belanja</Link>}
        </div>
      ) : (
        <div className="order-list">
          {shown.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}

      <details className="order-search card">
        <summary>Checkout memakai email lain? Tambahkan di sini</summary>
        <EmailForm onSubmit={addEmail} button="Tambah" />
      </details>
    </div>
  );
}
