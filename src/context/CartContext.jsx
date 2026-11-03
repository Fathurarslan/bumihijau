import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findProduct, priceOf } from '../data/products.js';

// Keranjang disimpan di localStorage supaya tidak hilang saat halaman di-refresh
const STORAGE_KEY = 'bumihijau_cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Buang item yang produknya sudah tidak ada
    return Array.isArray(raw) ? raw.filter((it) => findProduct(it.productId)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* penyimpanan browser tidak tersedia, keranjang tetap jalan di memori */
    }
  }, [items]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function addItem(productId, variant, qty = 1) {
    const key = `${productId}|${variant || ''}`;
    setItems((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) return prev.map((it) => (it.key === key ? { ...it, qty: Math.min(99, it.qty + qty) } : it));
      return [...prev, { key, productId, variant: variant || null, qty }];
    });
    const p = findProduct(productId);
    setToast(`${p.name}${variant ? ' (' + variant + ')' : ''} masuk keranjang`);
  }

  function updateQty(key, qty) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, qty: Math.max(1, Math.min(99, qty)) } : it)));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  // Gabungkan item keranjang dengan data produk lengkap
  const detailed = useMemo(
    () =>
      items.map((it) => {
        const product = findProduct(it.productId);
        const price = priceOf(product, it.variant) ?? 0;
        return { ...it, product, price, lineTotal: price * it.qty };
      }),
    [items]
  );

  const count = items.reduce((s, it) => s + it.qty, 0);
  const subtotal = detailed.reduce((s, it) => s + it.lineTotal, 0);
  const totalWeight = detailed.reduce((s, it) => s + it.product.weight * it.qty, 0);

  const value = { items: detailed, count, subtotal, totalWeight, addItem, updateQty, removeItem, clearCart, toast };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
