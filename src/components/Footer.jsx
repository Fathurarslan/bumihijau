import { Link } from 'react-router-dom';
import { categories } from '../data/products.js';
import { Logo } from './Header.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-about">
            Toko produk pakai ulang dan hemat energi. Bersama mengurangi sampah plastik dan emisi karbon, mendukung SDG 12
            (Konsumsi dan Produksi yang Bertanggung Jawab) dan SDG 13 (Penanganan Perubahan Iklim).
          </p>
        </div>
        <div>
          <h4>Kategori</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/belanja?kategori=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Bantuan</h4>
          <ul>
            <li><Link to="/pesanan">Riwayat Pesanan</Link></li>
            <li><Link to="/keranjang">Keranjang</Link></li>
            <li><Link to="/tentang">Tentang Kami</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4>Hubungi Kami</h4>
          <ul className="contact">
            <li>Jl. Ketintang No. 12, Surabaya</li>
            <li>halo@bumihijau.id</li>
            <li>0812 3456 7890</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Copyright © {new Date().getFullYear()} BumiHijau</span>
        <span>Dibuat untuk tugas E-Commerce · Isu Global Warming</span>
      </div>
    </footer>
  );
}
