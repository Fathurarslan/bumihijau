import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { api, formatDate, MIDTRANS_TYPE_LABEL, PAYMENT_LABEL, STATUS_LABEL } from '../api.js';
import { bankAccount, rupiah } from '../data/products.js';
import { rememberEmail } from '../orderHistory.js';
import { openSnap } from './Checkout.jsx';

const STEPS = ['Pesanan dibuat', 'Pembayaran', 'Dikemas', 'Dikirim', 'Selesai'];

function stepIndex(status) {
  if (status === 'completed') return 4;
  if (status === 'shipped') return 3;
  if (status === 'processing') return 2;
  return 1;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  // Pesanan yang dibuka admin dari dashboard tidak dimasukkan ke riwayat pembeli
  const fromAdmin = Boolean(useLocation().state?.fromAdmin);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [config, setConfig] = useState(null);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const { order } = await api.refreshOrder(id, email);
      setOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }, [id, email]);

  useEffect(() => {
    if (!email) {
      setError('Buka pesanan lewat halaman Riwayat Pesanan.');
      return;
    }
    api
      .getOrder(id, email)
      .then(({ order }) => {
        setOrder(order);
        if (!fromAdmin) rememberEmail(order.customer.email);
        // Pesanan Midtrans yang belum dibayar: langsung cek status terbaru
        if (order.paymentMethod === 'midtrans' && order.status === 'pending') refresh();
      })
      .catch((err) => setError(err.message));
    api.config().then(setConfig).catch(() => {});
  }, [id, email, refresh, fromAdmin]);

  if (error && !order) {
    return (
      <div className="container page narrow">
        <div className="empty big">
          <span className="empty-icon">🔍</span>
          <h1>Pesanan tidak bisa ditampilkan</h1>
          <p>{error}</p>
          <Link to="/pesanan" className="btn btn-primary">Riwayat Pesanan</Link>
        </div>
      </div>
    );
  }

  if (!order) return <div className="container page"><p className="loading">Memuat pesanan...</p></div>;

  const cancelled = order.status === 'cancelled' || order.status === 'refunded';
  const step = stepIndex(order.status);
  const c = order.customer;

  return (
    <div className="container page narrow">
      <div className="order-hero">
        <span className="eyebrow">Terima kasih, {c.name.split(' ')[0]}!</span>
        <h1>Pesanan {order.id}</h1>
        <p>
          Dibuat {formatDate(order.createdAt)} · Pesanan ini tersimpan di menu Riwayat Pesanan.
        </p>
        <span className={`status-pill s-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      {!cancelled && (
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= step ? (i === step && order.status !== 'completed' ? 'current' : 'done') : ''}>
              <span>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      )}

      {/* Petunjuk pembayaran sesuai metode */}
      {order.paymentMethod === 'transfer' && order.status === 'on-hold' && (
        <div className="pay-box">
          <h3>Selesaikan pembayaran</h3>
          <p>Transfer sebesar <b>{rupiah(order.total)}</b> ke rekening berikut, lalu admin akan mengonfirmasi pesananmu.</p>
          <dl className="bank">
            <div><dt>Bank</dt><dd>{bankAccount.bank}</dd></div>
            <div><dt>Nomor rekening</dt><dd>{bankAccount.number}</dd></div>
            <div><dt>Atas nama</dt><dd>{bankAccount.holder}</dd></div>
            <div><dt>Berita transfer</dt><dd>{order.id}</dd></div>
          </dl>
        </div>
      )}

      {order.paymentMethod === 'midtrans' && order.status === 'pending' && (
        <div className="pay-box">
          <h3>Menunggu pembayaran</h3>
          <p>Kalau popup pembayaran tadi tertutup, kamu masih bisa membayar dari sini.</p>
          <div className="pay-actions">
            {order.payment?.token && config?.midtransEnabled ? (
              <button className="btn btn-primary" onClick={() => openSnap(config, order.payment.token, refresh)}>
                Bayar Sekarang
              </button>
            ) : (
              order.payment?.redirectUrl && (
                <a className="btn btn-primary" href={order.payment.redirectUrl}>Bayar Sekarang</a>
              )
            )}
            <button className="btn btn-outline" onClick={refresh} disabled={checking}>
              {checking ? 'Mengecek...' : 'Cek status pembayaran'}
            </button>
          </div>
        </div>
      )}

      {order.paymentMethod === 'cod' && order.status === 'processing' && (
        <div className="pay-box">
          <h3>Bayar di tempat</h3>
          <p>Siapkan uang tunai <b>{rupiah(order.total)}</b> untuk dibayarkan ke kurir saat barang tiba.</p>
        </div>
      )}

      {order.paymentMethod === 'midtrans' && order.status === 'processing' && (
        <div className="pay-box success">
          <h3>Pembayaran berhasil ✓</h3>
          <p>
            Dibayar lewat{' '}
            {MIDTRANS_TYPE_LABEL[order.payment?.paymentType] || order.payment?.paymentType?.replaceAll('_', ' ') || 'Midtrans'}{' '}
            (Midtrans). Pesanan sedang kami siapkan.
          </p>
        </div>
      )}

      {order.status === 'shipped' && (
        <div className="pay-box success">
          <h3>Pesanan sedang dikirim 🚚</h3>
          <p>Paketmu sedang dalam perjalanan ke {c.city}. Ongkos kirim sudah termasuk, tinggal tunggu kurir datang.</p>
        </div>
      )}

      {order.status === 'completed' && (
        <div className="pay-box success">
          <h3>Pesanan selesai ✓</h3>
          <p>Paket sudah sampai. Terima kasih sudah ikut mengurangi sampah plastik bersama BumiHijau!</p>
        </div>
      )}

      <div className="order-grid">
        <section className="card">
          <h3>Rincian pesanan</h3>
          <ul className="sum-items">
            {order.items.map((it, i) => (
              <li key={i}>
                <span>
                  {it.name}
                  {it.variant && <small> ({it.variant})</small>} × {it.qty}
                </span>
                <span>{rupiah(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row"><span>Subtotal</span><span>{rupiah(order.subtotal)}</span></div>
          <div className="sum-row"><span>Ongkos kirim</span><span>{rupiah(order.shipping)}</span></div>
          <div className="sum-row total"><span>Total</span><b>{rupiah(order.total)}</b></div>
          <div className="sum-row muted"><span>Pembayaran</span><span>{PAYMENT_LABEL[order.paymentMethod]}</span></div>
        </section>

        <section className="card">
          <h3>Alamat pengiriman</h3>
          <address>
            <b>{c.name}</b>
            <br />
            {c.address}
            <br />
            {c.city}, {c.province} {c.postcode}
            <br />
            {c.phone}
            <br />
            {c.email}
          </address>
          {c.note && <p className="hint">Catatan: {c.note}</p>}

          <h3 className="mt">Riwayat status</h3>
          <ul className="history">
            {[...order.history].reverse().map((h, i) => (
              <li key={i}>
                <b>{STATUS_LABEL[h.status]}</b>
                <small>{formatDate(h.at)} · {h.by}</small>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="center pay-actions">
        <Link to="/pesanan" className="btn btn-outline">← Riwayat Pesanan</Link>
        <Link to="/belanja" className="btn btn-outline">Lanjut Belanja</Link>
      </div>
    </div>
  );
}
