import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="BumiHijau, ke beranda">
      <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="var(--forest)" />
        <path d="M20 40c0-14 10-22 26-22-1 15-9 24-22 24l-6 6-2-2 6-6z" fill="var(--mint)" />
      </svg>
      <span>
        Bumi<b>Hijau</b>
      </span>
    </Link>
  );
}

export default function Header() {
  const { count, toast } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="announce">Gratis kemasan kertas daur ulang untuk setiap pesanan · Ongkir Jawa Timur Rp10.000</div>
      <div className="container header-row">
        <Logo />
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Menu utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/belanja">Belanja</NavLink>
          <NavLink to="/tentang">Tentang Kami</NavLink>
          <NavLink to="/pesanan">Riwayat Pesanan</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/admin" className="admin-btn" title="Masuk sebagai admin toko">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <span>Admin</span>
          </Link>
          <Link to="/keranjang" className="cart-btn" aria-label={`Keranjang, ${count} barang`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Buka menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>✓ {toast}</span>
          <Link to="/keranjang">Lihat keranjang</Link>
        </div>
      )}
    </header>
  );
}
