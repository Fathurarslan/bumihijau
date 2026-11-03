import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products, categoryName, rupiah, minPrice, maxPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import NotFound from './NotFound.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [variant, setVariant] = useState('');
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState('');

  if (!product) return <NotFound />;

  const selected = product.variants?.find((v) => v.name === variant);
  const priceText = product.variants
    ? selected
      ? rupiah(selected.price)
      : minPrice(product) === maxPrice(product)
        ? rupiah(minPrice(product))
        : `${rupiah(minPrice(product))} sampai ${rupiah(maxPrice(product))}`
    : rupiah(product.price);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function handleAdd() {
    if (product.variants && !selected) {
      setWarn(`Pilih ${product.attribute.toLowerCase()} terlebih dahulu.`);
      return;
    }
    setWarn('');
    addItem(product.id, selected?.name || null, qty);
  }

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link> / <Link to={`/belanja?kategori=${product.category}`}>{categoryName(product.category)}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="detail-grid">
        <div className="detail-media">
          <ProductImage product={product} className="detail-img" />
        </div>

        <div className="detail-info">
          <span className="product-cat">{categoryName(product.category)}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">{priceText}</p>
          <p className="detail-short">{product.short}</p>

          {product.variants && (
            <div className="variant-block">
              <span className="label">{product.attribute}</span>
              <div className="variant-options" role="radiogroup" aria-label={product.attribute}>
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    role="radio"
                    aria-checked={variant === v.name}
                    className={`variant ${variant === v.name ? 'active' : ''}`}
                    onClick={() => {
                      setVariant(v.name);
                      setWarn('');
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              {selected && <p className="variant-note">{selected.note}</p>}
            </div>
          )}

          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Kurangi jumlah">−</button>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                aria-label="Jumlah"
              />
              <button onClick={() => setQty((n) => Math.min(99, n + 1))} aria-label="Tambah jumlah">+</button>
            </div>
            <button className="btn btn-primary" onClick={handleAdd}>Tambah ke Keranjang</button>
          </div>
          {warn && <p className="form-error">{warn}</p>}

          <table className="spec">
            <tbody>
              <tr><th>Berat</th><td>{product.weight.toLocaleString('id-ID')} g</td></tr>
              <tr><th>Dimensi</th><td>{product.dimensions}</td></tr>
              <tr><th>Kategori</th><td>{categoryName(product.category)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <section className="detail-desc">
        <h2>Deskripsi</h2>
        <p>{product.description}</p>
        <div className="eco-note">
          🌱 Dengan memilih produk ini kamu ikut mendukung <b>SDG 12</b> (konsumsi bertanggung jawab) dan <b>SDG 13</b>{' '}
          (penanganan perubahan iklim).
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Produk terkait</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
