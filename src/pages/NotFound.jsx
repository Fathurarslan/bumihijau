import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty big">
        <span className="empty-icon">🍂</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    </div>
  );
}
