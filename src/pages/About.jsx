import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container page narrow">
      <div className="page-head">
        <span className="eyebrow">Tentang Kami</span>
        <h1>Toko kecil untuk masalah besar: global warming.</h1>
      </div>

      <div className="prose">
        <p>
          BumiHijau adalah toko online yang menjual produk pengganti barang sekali pakai dan produk hemat energi. Kami
          percaya perubahan iklim bisa dilawan dari kebiasaan sehari hari: membawa tumbler sendiri, menolak kantong plastik,
          mengolah sisa makanan menjadi kompos, dan memakai energi matahari.
        </p>
        <p>
          Plastik sekali pakai dibuat dari minyak bumi. Proses produksinya melepas karbon dioksida, dan sampahnya
          menghasilkan gas rumah kaca saat dibakar atau menumpuk di TPA. Sisa makanan yang membusuk di TPA juga melepas
          metana, gas yang memerangkap panas jauh lebih kuat dari karbon dioksida.
        </p>
      </div>

      <div className="sdg-grid">
        <article className="sdg sdg12">
          <span className="sdg-num">12</span>
          <h3>Konsumsi dan Produksi yang Bertanggung Jawab</h3>
          <p>
            Semua produk kami dirancang untuk dipakai berulang kali, sehingga mengurangi barang yang diproduksi lalu
            dibuang. Pengiriman memakai kemasan kertas daur ulang tanpa plastik.
          </p>
        </article>
        <article className="sdg sdg13">
          <span className="sdg-num">13</span>
          <h3>Penanganan Perubahan Iklim</h3>
          <p>
            Komposter, bibit pohon, lampu dan power bank tenaga surya membantu mengurangi emisi gas rumah kaca dari sampah
            dan pemakaian listrik.
          </p>
        </article>
      </div>

      <div className="prose">
        <h2>Misi kami</h2>
        <ul>
          <li>Menyediakan alternatif pakai ulang untuk barang sekali pakai yang paling sering dibuang.</li>
          <li>Mengirim pesanan tanpa plastik sama sekali.</li>
          <li>Mengajak pelanggan mengukur dampak kecil yang mereka buat setiap hari.</li>
        </ul>
      </div>

      <div className="center">
        <Link to="/belanja" className="btn btn-primary">Lihat Produk</Link>
      </div>
    </div>
  );
}
