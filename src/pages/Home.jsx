import { Link } from 'react-router-dom';
import { products, categories } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';

const featured = products.filter((p) => p.featured).slice(0, 4);
// Produk terbaru = produk dengan id paling besar
const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 8);

const benefits = [
  { icon: '🍃', title: 'Bebas Plastik Sekali Pakai', text: 'Semua produk dirancang untuk dipakai berulang kali.' },
  { icon: '🌏', title: 'Mendukung SDG 12 dan 13', text: 'Konsumsi bertanggung jawab dan aksi nyata melawan perubahan iklim.' },
  { icon: '♻️', title: 'Kemasan Ramah Lingkungan', text: 'Dikirim dengan kemasan kertas daur ulang tanpa plastik.' },
];

const testimonials = [
  { name: 'Rina', role: 'Mahasiswa, Surabaya', text: 'Sejak pakai tumbler BumiHijau, saya tidak pernah beli air botolan lagi. Awet dan tetap dingin seharian.' },
  { name: 'Budi', role: 'Karyawan, Malang', text: 'Komposternya mudah dipakai, sisa dapur sekarang jadi pupuk untuk tanaman di rumah.' },
  { name: 'Sari', role: 'Ibu rumah tangga, Sidoarjo', text: 'Tas lipat dan kantong jaring sayur selalu ada di tas. Belanja ke pasar tanpa kantong plastik.' },
];

export default function Home() {
  const [hero1, hero2, hero3] = featured;

  return (
    <>
      {/* 1. Banner */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow">Toko ramah lingkungan · SDG 12 dan 13</span>
            <h1>
              Belanja bijak,
              <br />
              <em>bumi sehat.</em>
            </h1>
            <p>
              Produk pakai ulang dan hemat energi untuk mengurangi sampah plastik dan emisi karbon. Langkah kecil kita,
              dampak besar untuk bumi.
            </p>
            <div className="hero-cta">
              <Link to="/belanja" className="btn btn-primary">Belanja Sekarang</Link>
              <Link to="/tentang" className="btn btn-ghost">Kenapa BumiHijau?</Link>
            </div>
            <dl className="hero-stats">
              <div><dt>20</dt><dd>produk pakai ulang</dd></div>
              <div><dt>5</dt><dd>kategori kebutuhan</dd></div>
              <div><dt>0</dt><dd>kemasan plastik</dd></div>
            </dl>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-circle" />
            {hero1 && <ProductImage product={hero1} className="hero-tile t1" />}
            {hero2 && <ProductImage product={hero2} className="hero-tile t2" />}
            {hero3 && <ProductImage product={hero3} className="hero-tile t3" />}
            <div className="hero-note">
              <b>1 tumbler</b>
              <span>menggantikan ratusan botol plastik per tahun</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tiga keunggulan */}
      <section className="section benefits">
        <div className="container benefit-grid">
          {benefits.map((b) => (
            <div className="benefit" key={b.title}>
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Kategori */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Belanja per kategori</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/belanja?kategori=${c.id}`} className="cat-chip">
                <span>{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Produk unggulan */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Produk Unggulan</h2>
            <Link to="/belanja" className="link-more">Lihat semua →</Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 5. Dampak */}
      <section className="impact">
        <div className="container impact-grid">
          <div>
            <span className="eyebrow light">Kenapa ini penting</span>
            <h2>Plastik sekali pakai ikut memanaskan bumi.</h2>
          </div>
          <p>
            Plastik dibuat dari minyak bumi, dan sampahnya melepas gas rumah kaca saat dibakar atau menumpuk di TPA. Setiap
            barang pakai ulang yang kamu pilih berarti lebih sedikit plastik baru diproduksi dan lebih sedikit sampah yang
            menghasilkan emisi.
          </p>
        </div>
      </section>

      {/* 6. Produk terbaru */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Produk Terbaru</h2>
            <Link to="/belanja" className="link-more">Lihat semua →</Link>
          </div>
          <div className="product-grid">
            {newest.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* 7. Testimoni */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-head center">
            <h2>Kata Pelanggan</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t) => (
              <figure className="testi" key={t.name}>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <span className="avatar">{t.name[0]}</span>
                  <span>
                    <b>{t.name}</b>
                    <small>{t.role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Ajakan belanja */}
      <section className="cta-band">
        <div className="container cta-inner">
          <h2>Mulai dari satu langkah kecil.</h2>
          <p>Setiap barang pakai ulang yang kamu pilih berarti satu sampah plastik berkurang dari bumi.</p>
          <Link to="/belanja" className="btn btn-sun">Lihat Semua Produk</Link>
        </div>
      </section>
    </>
  );
}
