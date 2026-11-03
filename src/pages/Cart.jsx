import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { rupiah } from '../data/products.js';
import ProductImage from '../components/ProductImage.jsx';

export default function Cart() {
  const { items, subtotal, totalWeight, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty big">
          <span className="empty-icon">🛒</span>
          <h1>Keranjang masih kosong</h1>
          <p>Yuk mulai dari satu barang pakai ulang.</p>
          <Link to="/belanja" className="btn btn-primary">Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Keranjang</h1>
      </div>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((it) => (
            <li key={it.key} className="cart-item">
              <Link to={`/produk/${it.product.slug}`} className="cart-thumb">
                <ProductImage product={it.product} />
              </Link>
              <div className="cart-info">
                <Link to={`/produk/${it.product.slug}`} className="cart-name">{it.product.name}</Link>
                {it.variant && <span className="cart-variant">{it.product.attribute}: {it.variant}</span>}
                <span className="cart-price">{rupiah(it.price)}</span>
              </div>
              <div className="qty small">
                <button onClick={() => updateQty(it.key, it.qty - 1)} aria-label="Kurangi">−</button>
                <input
                  type="number"
                  value={it.qty}
                  min="1"
                  max="99"
                  onChange={(e) => updateQty(it.key, Number(e.target.value) || 1)}
                  aria-label="Jumlah"
                />
                <button onClick={() => updateQty(it.key, it.qty + 1)} aria-label="Tambah">+</button>
              </div>
              <span className="cart-line">{rupiah(it.lineTotal)}</span>
              <button className="remove" onClick={() => removeItem(it.key)} aria-label={`Hapus ${it.product.name}`}>×</button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h3>Ringkasan</h3>
          <div className="sum-row"><span>Subtotal</span><b>{rupiah(subtotal)}</b></div>
          <div className="sum-row muted"><span>Berat total</span><span>{(totalWeight / 1000).toLocaleString('id-ID')} kg</span></div>
          <div className="sum-row muted"><span>Ongkos kirim</span><span>Dihitung saat checkout</span></div>
          <button className="btn btn-primary block" onClick={() => navigate('/checkout')}>Lanjut ke Checkout</button>
          <Link to="/belanja" className="link-more center">← Lanjut belanja</Link>
        </aside>
      </div>
    </div>
  );
}
