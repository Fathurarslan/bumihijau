# BumiHijau, toko online ramah lingkungan

Website e-commerce untuk tugas bertema **isu global: mengurangi global warming**, terkait **SDG 12** (Konsumsi dan Produksi yang Bertanggung Jawab) dan **SDG 13** (Penanganan Perubahan Iklim). Berisi **20 produk** pakai ulang dan hemat energi.

Dibuat dengan JavaScript:

| Bagian | Teknologi | Fungsi |
| --- | --- | --- |
| Tampilan (frontend) | React + Vite | Halaman toko, keranjang, checkout |
| Server (backend) | Node.js + Express | Menyimpan pesanan, menghitung harga, menghubungi Midtrans |
| Pembayaran | Midtrans Snap (Sandbox) | QRIS, GoPay, Virtual Account, kartu kredit |
| Penyimpanan | File `data/orders.json` | Daftar pesanan (tanpa database) |

## Fitur

1. Beranda: banner, 3 keunggulan, kategori, produk unggulan, produk terbaru, testimoni, ajakan belanja
2. Halaman Belanja: filter kategori, pencarian, urutkan harga
3. Detail produk: produk variasi (Tumbler 3 ukuran, Tote Bag 3 warna), berat, dimensi, produk terkait
4. Keranjang tersimpan di browser (tidak hilang saat refresh)
5. Checkout tanpa akun, ongkir otomatis: Jawa Timur Rp10.000, provinsi lain Rp50.000
6. Pembayaran: Midtrans, transfer bank, atau COD
7. **Riwayat Pesanan** seperti di aplikasi belanja: semua pesanan milik email pembeli, dengan tab Belum Bayar, Diproses, Dikirim, Selesai, Dibatalkan
8. Detail pesanan dengan langkah: Pesanan dibuat → Pembayaran → Dikemas → Dikirim → Selesai
8. Halaman **Tentang Kami** berisi penjelasan isu global warming dan SDGs
9. Halaman **Admin** (`/admin`): lihat semua pesanan dan ubah statusnya
10. Tampilan responsif untuk HP

## Cara menjalankan

### 1. Install Node.js

Download versi LTS di https://nodejs.org lalu install. Cek di terminal (Command Prompt / PowerShell / terminal VS Code):

```
node -v
```

Minimal versi 18.

### 2. Install paket proyek

Buka folder proyek ini di VS Code, buka terminal (**Terminal › New Terminal**), lalu jalankan:

```
npm install
```

### 3. Isi kunci Midtrans

1. Login ke https://dashboard.midtrans.com, ubah **Environment** menjadi **Sandbox**.
2. Buka **Pengaturan › Access Keys**, salin **Server Key** dan **Client Key**.
3. Salin file `.env.example` menjadi `.env` (di folder yang sama).
4. Buka `.env`, tempel kuncinya:

```
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
```

Kalau langkah ini dilewati, toko tetap jalan, hanya pilihan pembayaran Midtrans yang nonaktif (transfer bank dan COD tetap bisa).

### 4. Jalankan

```
npm run dev
```

Buka **http://localhost:5173** di browser. Server dan tampilan berjalan bersamaan. Hentikan dengan **Ctrl + C**.

## Mencoba pembayaran Midtrans (Sandbox)

1. Masukkan produk ke keranjang, checkout, pilih **Pembayaran online (Midtrans)**, klik **Bayar Sekarang**.
2. Muncul popup Midtrans. Pilih misalnya **QRIS** atau **GoPay**, lalu tutup popup.
3. Untuk mensimulasikan bayar, buka **https://simulator.sandbox.midtrans.com**, pilih metode yang sama, tempel kode QR atau nomor VA dari popup.
4. Kembali ke halaman pesanan, klik **Cek status pembayaran**. Status berubah jadi **Diproses**.
5. Transaksi juga terlihat di dashboard Midtrans menu **Transaksi**.

Catatan: Midtrans tidak bisa mengirim notifikasi otomatis ke `localhost`, karena itu status dicek lewat tombol **Cek status pembayaran** (otomatis juga dicek setiap halaman pesanan dibuka).

## Halaman admin

Klik tombol **Admin** di kanan atas (atau buka **http://localhost:5173/admin**), password bawaan `admin123` (ubah di `.env`, bagian `ADMIN_PASSWORD`).

- Pesanan **Midtrans** otomatis berubah ke **Diproses** setelah dibayar, admin tidak perlu ACC.
- Pesanan **transfer bank**: admin mengubah **Menunggu konfirmasi transfer** menjadi **Diproses**.
- Setelah barang dikirim, ubah ke **Dikirim**, lalu **Selesai** saat barang sampai. Perubahan langsung terlihat di Riwayat Pesanan pembeli.

## Foto produk

Foto ke-20 produk sudah terpasang di folder `public/images` (persegi 900 x 900 px). Untuk mengganti foto, timpa file dengan nama berikut (format .jpg, sebaiknya persegi 800 x 800 px):

| Produk | Nama file |
| --- | --- |
| Tumbler Stainless | `tumbler.jpg` |
| Sedotan Bambu | `sedotan-bambu.jpg` |
| Sedotan Stainless | `sedotan-stainless.jpg` |
| Alat Makan Bambu | `alat-makan-bambu.jpg` |
| Kotak Makan Stainless | `kotak-makan.jpg` |
| Tote Bag Kanvas | `tote-bag.jpg` |
| Tas Belanja Lipat | `tas-lipat.jpg` |
| Beeswax Wrap | `beeswax-wrap.jpg` |
| Kantong Jaring Sayur | `kantong-jaring.jpg` |
| Sikat Gigi Bambu | `sikat-gigi-bambu.jpg` |
| Sabun Batang | `sabun-batang.jpg` |
| Sampo Batang | `sampo-batang.jpg` |
| Kapas Wajah | `kapas-wajah.jpg` |
| Pisau Cukur | `pisau-cukur.jpg` |
| Komposter | `komposter.jpg` |
| Spons Sabut Kelapa | `spons-sabut.jpg` |
| Deterjen Isi Ulang | `deterjen.jpg` |
| Bibit Pohon | `bibit-pohon.jpg` |
| Lampu Taman Surya | `lampu-surya.jpg` |
| Power Bank Surya | `power-bank-surya.jpg` |

Foto langsung muncul tanpa mengubah kode. Kalau sebuah file foto dihapus, toko otomatis menampilkan ilustrasi emoji sebagai pengganti.

## Mengubah produk

Semua data produk (nama, harga, deskripsi, variasi, berat) ada di satu file: `src/data/products.js`. Server juga memakai file ini, jadi harga yang dibayar selalu sesuai data, bukan dari browser.

## Struktur folder

```
bumihijau/
├── server/index.js          Server Express + Midtrans
├── src/
│   ├── data/products.js     Data 20 produk, ongkir, rekening
│   ├── context/CartContext.jsx  Keranjang belanja
│   ├── components/          Header, Footer, kartu produk
│   ├── pages/               Beranda, Belanja, Detail, Keranjang, Checkout,
│   │                        Pesanan, Lacak, Tentang, Admin
│   ├── api.js               Fungsi pemanggil server
│   └── styles.css           Seluruh tampilan
├── public/images/           Tempat foto produk
├── data/orders.json         Pesanan (dibuat otomatis)
└── .env                     Kunci Midtrans (jangan dibagikan)
```

## Mode produksi (opsional)

```
npm run build
npm start
```

Lalu buka **http://localhost:3001**. Server menyajikan tampilan hasil build sekaligus API.
