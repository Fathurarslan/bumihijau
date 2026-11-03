import { useState } from 'react';

// Warna ilustrasi pengganti untuk tiap kategori
const TINTS = {
  'makan-minum': ['#d8ecd9', '#a9d3ae'],
  'tas-kemasan': ['#f1e6cf', '#dfc597'],
  'perawatan-diri': ['#e2eef0', '#b4d4d9'],
  'rumah-kebun': ['#e3ecd2', '#b9cf8f'],
  'energi-hemat': ['#fbeccb', '#f1c96a'],
};

// Menampilkan foto produk. Kalau file foto belum ada di public/images,
// tampilkan ilustrasi berupa emoji di atas latar berwarna.
export default function ProductImage({ product, className = '', alt }) {
  const [failed, setFailed] = useState(false);
  const [a, b] = TINTS[product.category] || ['#e8efe6', '#c5d8c2'];

  if (failed || !product.image) {
    return (
      <div
        className={`product-img placeholder ${className}`}
        style={{ background: `radial-gradient(circle at 30% 25%, ${a}, ${b})` }}
        role="img"
        aria-label={alt || product.name}
      >
        <span>{product.emoji}</span>
      </div>
    );
  }

  return (
    <img
      className={`product-img ${className}`}
      src={product.image}
      alt={alt || product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
