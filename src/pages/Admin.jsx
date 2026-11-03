import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, MIDTRANS_TYPE_LABEL, PAYMENT_LABEL, STATUS_LABEL } from '../api.js';
import { rupiah } from '../data/products.js';

const KEY = 'bumihijau_admin';

function savedPassword() {
  try {
    return sessionStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export default function Admin() {
  const [password, setPassword] = useState(savedPassword);
  const [input, setInput] = useState('');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  async function load(pw = password) {
    setError('');
    try {
      const { orders } = await api.adminOrders(pw);
      setOrders(orders);
      setPassword(pw);
      try {
        sessionStorage.setItem(KEY, pw);
      } catch {
        /* abaikan */
      }
    } catch (err) {
      setError(err.message);
      setOrders(null);
      setPassword('');
    }
  }

  useEffect(() => {
    if (password) load(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeStatus(id, status) {
    try {
      const { order } = await api.adminSetStatus(password, id, status);
      setOrders((list) => list.map((o) => (o.id === id ? order : o)));
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* abaikan */
    }
    setPassword('');
    setOrders(null);
  }

  if (!orders) {
    return (
      <div className="container page narrow">
        <div className="page-head center">
          <span className="eyebrow">Admin</span>
          <h1>Masuk dashboard toko</h1>
          <p>Password diatur di file .env (ADMIN_PASSWORD). Bawaannya admin123.</p>
        </div>
        <form
          className="track-form card"
          onSubmit={(e) => {
            e.preventDefault();
            load(input);
          }}
        >
          <label>
            Password admin
            <input type="password" required value={input} onChange={(e) => setInput(e.target.value)} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary block">Masuk</button>
        </form>
      </div>
    );
  }

  const shown = filter ? orders.filter((o) => o.status === filter) : orders;
  const paid = orders.filter((o) => ['processing', 'shipped', 'completed'].includes(o.status));
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  return (
    <div className="container page">
      <div className="page-head row">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Pesanan masuk</h1>
        </div>
        <div className="admin-actions">
          <button className="btn btn-outline btn-sm" onClick={() => load()}>Muat ulang</button>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Keluar</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><span>Total pesanan</span><b>{orders.length}</b></div>
        <div className="stat"><span>Perlu dikirim</span><b>{orders.filter((o) => o.status === 'processing').length}</b></div>
        <div className="stat"><span>Sudah dibayar</span><b>{paid.length}</b></div>
        <div className="stat"><span>Pendapatan</span><b>{rupiah(revenue)}</b></div>
      </div>

      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status">
          <option value="">Semua status</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {error && <p className="form-error">{error}</p>}

      {shown.length === 0 ? (
        <div className="empty"><p>Belum ada pesanan.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Tanggal</th>
                <th>Pembeli</th>
                <th>Barang</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/pesanan/${o.id}?email=${encodeURIComponent(o.customer.email)}`} state={{ fromAdmin: true }}>
                      {o.id}
                    </Link>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    <b>{o.customer.name}</b>
                    <small>{o.customer.city}, {o.customer.province}</small>
                    <small>{o.customer.phone}</small>
                  </td>
                  <td>
                    {o.items.map((it, i) => (
                      <small key={i}>{it.qty}× {it.name}{it.variant ? ` (${it.variant})` : ''}</small>
                    ))}
                  </td>
                  <td>{rupiah(o.total)}</td>
                  <td>
                    {PAYMENT_LABEL[o.paymentMethod]}
                    {o.midtrans?.paymentType && (
                      <small>{MIDTRANS_TYPE_LABEL[o.midtrans.paymentType] || o.midtrans.paymentType.replaceAll('_', ' ')}</small>
                    )}
                  </td>
                  <td>
                    <select
                      className={`status-select s-${o.status}`}
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      aria-label={`Status ${o.id}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
