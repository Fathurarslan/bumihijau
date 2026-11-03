import { Link, useNavigate } from 'react-router-dom';
import { categoryName, minPrice, maxPrice, rupiah } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const lo = minPrice(product);
  const hi = maxPrice(product);

  function handleAdd() {
    // Produk variasi harus memilih variasi dulu di halaman detail
    if (product.variants) navigate(`/produk/${product.slug}`);
    else addItem(product.id, null, 1);
  }

  return (
    <article className="product-card">
      <Link to={`/produk/${product.slug}`} className="product-card-media">
        <ProductImage product={product} />
        {product.featured && <span className="badge">Unggulan</span>}
      </Link>
      <div className="product-card-body">
        <span className="product-cat">{categoryName(product.category)}</span>
        <h3>
          <Link to={`/produk/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="price">{lo === hi ? rupiah(lo) : `${rupiah(lo)} sampai ${rupiah(hi)}`}</p>
        <button className="btn btn-outline btn-sm" onClick={handleAdd}>
          {product.variants ? 'Pilih variasi' : '+ Keranjang'}
        </button>
      </div>
    </article>
  );
}
