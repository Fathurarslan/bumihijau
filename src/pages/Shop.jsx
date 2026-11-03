import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories, minPrice } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const kategori = params.get('kategori') || '';
  const q = params.get('q') || '';
  const urut = params.get('urut') || 'terbaru';

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const list = useMemo(() => {
    let r = products.filter((p) => !kategori || p.category === kategori);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(s) || p.short.toLowerCase().includes(s));
    }
    r = [...r];
    if (urut === 'murah') r.sort((a, b) => minPrice(a) - minPrice(b));
    else if (urut === 'mahal') r.sort((a, b) => minPrice(b) - minPrice(a));
    else if (urut === 'nama') r.sort((a, b) => a.name.localeCompare(b.name, 'id'));
    else r.sort((a, b) => b.id - a.id);
    return r;
  }, [kategori, q, urut]);

  const activeCat = categories.find((c) => c.id === kategori);

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{activeCat ? activeCat.name : 'Semua Produk'}</h1>
        <p>{list.length} produk ramah lingkungan</p>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <h4>Kategori</h4>
          <button className={!kategori ? 'active' : ''} onClick={() => setParam('kategori', '')}>
            Semua produk <span>{products.length}</span>
          </button>
          {categories.map((c) => (
            <button key={c.id} className={kategori === c.id ? 'active' : ''} onClick={() => setParam('kategori', c.id)}>
              {c.icon} {c.name} <span>{products.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}
        </aside>

        <div>
          <div className="toolbar">
            <input
              type="search"
              placeholder="Cari produk, misalnya tumbler"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              aria-label="Cari produk"
            />
            <select value={urut} onChange={(e) => setParam('urut', e.target.value)} aria-label="Urutkan">
              <option value="terbaru">Terbaru</option>
              <option value="murah">Harga terendah</option>
              <option value="mahal">Harga tertinggi</option>
              <option value="nama">Nama A sampai Z</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="empty">
              <p>Produk dengan kata kunci “{q}” tidak ditemukan.</p>
              <button className="btn btn-outline" onClick={() => setParams({})}>Tampilkan semua produk</button>
            </div>
          ) : (
            <div className="product-grid three">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
