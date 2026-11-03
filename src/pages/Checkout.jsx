import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { provinces, rupiah, shippingCost, SHIPPING_LOCAL_PROVINCE } from '../data/products.js';
import { api, loadSnap, PAYMENT_LABEL } from '../api.js';
import { rememberEmail } from '../orderHistory.js';

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', province: '', postcode: '', note: '' };

// Membuka popup pembayaran Midtrans, lalu pindah ke halaman pesanan apa pun hasilnya
export async function openSnap(config, token, onDone) {
  const snap = await loadSnap(config.clientKey, config.isProduction);
  snap.pay(token, {
    onSuccess: onDone,
    onPending: onDone,
    onError: onDone,
    onClose: onDone,
  });
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState('');
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .config()
      .then((c) => {
        setConfig(c);
        setPayment(c.midtransEnabled ? 'midtrans' : 'transfer');
      })
      .catch(() => {
        setConfig({ midtransEnabled: false, offline: true });
        setPayment('transfer');
      });
  }, []);

  if (items.length === 0 && !loading) return <Navigate to="/keranjang" replace />;

  const shipping = shippingCost(form.province);
  const total = subtotal + shipping;

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { order } = await api.createOrder({
        customer: form,
        items: items.map((it) => ({ productId: it.productId, variant: it.variant, qty: it.qty })),
        paymentMethod: payment,
      });
      const target = `/pesanan/${order.id}?email=${encodeURIComponent(order.customer.email)}`;
      rememberEmail(order.customer.email);
      clearCart();

      if (order.paymentMethod === 'midtrans' && order.payment?.token) {
        try {
          await openSnap(config, order.payment.token, () => navigate(target));
        } catch {
          navigate(target);
        }
      } else {
        navigate(target);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Checkout</h1>
        <p>Pesan tanpa perlu membuat akun. Pesananmu otomatis tersimpan di menu Riwayat Pesanan.</p>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <fieldset>
            <legend>Data pengiriman</legend>
            <div className="field-row">
              <label>
                Nama lengkap
                <input required value={form.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label>
                Nomor telepon
                <input required value={form.phone} onChange={set('phone')} inputMode="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" />
              </label>
            </div>
            <label>
              Email
              <input required type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            </label>
            <label>
              Alamat lengkap
              <textarea required rows="2" value={form.address} onChange={set('address')} placeholder="Nama jalan, nomor rumah, RT/RW" autoComplete="street-address" />
            </label>
            <div className="field-row three">
              <label>
                Kota / Kabupaten
                <input required value={form.city} onChange={set('city')} autoComplete="address-level2" />
              </label>
              <label>
                Provinsi
                <select required value={form.province} onChange={set('province')}>
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label>
                Kode pos
                <input required value={form.postcode} onChange={set('postcode')} inputMode="numeric" maxLength="5" pattern="[0-9]{5}" autoComplete="postal-code" />
              </label>
            </div>
            <label>
              Catatan (opsional)
              <input value={form.note} onChange={set('note')} placeholder="Misalnya: titip ke satpam" />
            </label>
          </fieldset>

          <fieldset>
            <legend>Metode pembayaran</legend>
            {config?.offline && (
              <p className="form-error">Server belum berjalan. Jalankan perintah npm run dev terlebih dahulu.</p>
            )}
            <div className="pay-options">
              <label className={`pay ${payment === 'midtrans' ? 'active' : ''} ${!config?.midtransEnabled ? 'disabled' : ''}`}>
                <input
                  type="radio"
                  name="pay"
                  value="midtrans"
                  checked={payment === 'midtrans'}
                  disabled={!config?.midtransEnabled}
                  onChange={() => setPayment('midtrans')}
                />
                <span>
                  <b>{PAYMENT_LABEL.midtrans}</b>
                  <small>
                    {config?.midtransEnabled
                      ? 'QRIS, GoPay, ShopeePay, Virtual Account bank, kartu kredit. Status terkonfirmasi otomatis.'
                      : 'Belum aktif. Isi kunci Midtrans di file .env server.'}
                  </small>
                </span>
              </label>
              <label className={`pay ${payment === 'transfer' ? 'active' : ''}`}>
                <input type="radio" name="pay" value="transfer" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} />
                <span>
                  <b>{PAYMENT_LABEL.transfer}</b>
                  <small>Nomor rekening muncul setelah pesanan dibuat. Admin mengonfirmasi secara manual.</small>
                </span>
              </label>
              <label className={`pay ${payment === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="pay" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                <span>
                  <b>{PAYMENT_LABEL.cod}</b>
                  <small>Bayar tunai ke kurir saat barang tiba.</small>
                </span>
              </label>
            </div>
            {config?.midtransEnabled && !config.isProduction && (
              <p className="hint">Mode Sandbox: pembayaran hanya simulasi, tidak ada uang sungguhan.</p>
            )}
          </fieldset>
        </div>

        <aside className="summary">
          <h3>Pesanan kamu</h3>
          <ul className="sum-items">
            {items.map((it) => (
              <li key={it.key}>
                <span>
                  {it.product.name}
                  {it.variant && <small> ({it.variant})</small>} × {it.qty}
                </span>
                <span>{rupiah(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row"><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>
          <div className="sum-row">
            <span>Ongkos kirim</span>
            <span>{form.province ? rupiah(shipping) : 'Pilih provinsi'}</span>
          </div>
          {form.province && (
            <p className="hint">
              {form.province === SHIPPING_LOCAL_PROVINCE ? 'Tarif dalam Jawa Timur.' : 'Tarif luar Jawa Timur.'}
            </p>
          )}
          <div className="sum-row total"><span>Total</span><b>{rupiah(total)}</b></div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary block" disabled={loading || !payment}>
            {loading ? 'Memproses...' : payment === 'midtrans' ? 'Bayar Sekarang' : 'Buat Pesanan'}
          </button>
          <Link to="/keranjang" className="link-more center">← Kembali ke keranjang</Link>
        </aside>
      </form>
    </div>
  );
}
