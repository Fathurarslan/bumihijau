// Data produk BumiHijau.
// File ini dipakai oleh tampilan React DAN oleh server Express,
// supaya harga dihitung ulang di server dan tidak bisa diubah pembeli.
//
// Foto produk: taruh file gambar di folder public/images dengan nama sesuai
// kolom "image" (misalnya public/images/tumbler.jpg). Kalau file belum ada,
// toko otomatis menampilkan ilustrasi pengganti.

export const categories = [
  { id: 'makan-minum', name: 'Alat Makan dan Minum', icon: '🥤' },
  { id: 'tas-kemasan', name: 'Tas dan Kemasan', icon: '👜' },
  { id: 'perawatan-diri', name: 'Perawatan Diri', icon: '🧼' },
  { id: 'rumah-kebun', name: 'Rumah Tangga dan Kebun', icon: '🌱' },
  { id: 'energi-hemat', name: 'Energi Hemat', icon: '☀️' },
];

export const products = [
  {
    id: 1,
    slug: 'tumbler-stainless',
    name: 'Tumbler Stainless BumiHijau',
    category: 'makan-minum',
    featured: true,
    emoji: '🥤',
    image: '/images/tumbler.jpg',
    weight: 350,
    dimensions: '8 x 8 x 25 cm',
    short: 'Tumbler stainless panas 12 jam dan dingin 24 jam, pengganti botol plastik sekali pakai. Tersedia 3 ukuran.',
    description:
      'Tumbler stainless steel dua lapis vakum yang menjaga minuman tetap panas hingga 12 jam dan dingin hingga 24 jam. Tutupnya rapat, bebas BPA, dan mudah dicuci. Dengan membawa tumbler sendiri, kamu menolak botol plastik sekali pakai yang menjadi salah satu penyumbang sampah terbesar.',
    attribute: 'Ukuran',
    variants: [
      { name: '350 ml', price: 75000, note: 'Pas untuk kopi atau teh di perjalanan.' },
      { name: '500 ml', price: 85000, note: 'Cukup untuk kebutuhan minum di kampus atau kantor.' },
      { name: '750 ml', price: 99000, note: 'Cocok untuk olahraga dan kegiatan seharian.' },
    ],
  },
  {
    id: 2,
    slug: 'sedotan-bambu',
    name: 'Sedotan Bambu Set 6 + Sikat',
    category: 'makan-minum',
    emoji: '🎋',
    image: '/images/sedotan-bambu.jpg',
    price: 25000,
    weight: 60,
    dimensions: '22 x 5 x 3 cm',
    short: 'Pengganti sedotan plastik yang sulit terurai. Isi 6 sedotan bambu, 1 sikat, dan 1 kantong kain.',
    description:
      'Set sedotan bambu alami berisi 6 batang sepanjang 20 cm, dilengkapi sikat pembersih dan kantong kain. Cuci dengan air sabun setelah dipakai lalu keringkan. Satu set bisa menggantikan ratusan sedotan plastik sekali pakai yang sulit terurai.',
  },
  {
    id: 3,
    slug: 'sedotan-stainless',
    name: 'Sedotan Stainless Set 4',
    category: 'makan-minum',
    emoji: '🥢',
    image: '/images/sedotan-stainless.jpg',
    price: 30000,
    weight: 80,
    dimensions: '22 x 5 x 3 cm',
    short: 'Sedotan stainless food grade yang bisa dipakai bertahun-tahun. Isi 4 sedotan dan 1 sikat.',
    description:
      'Set 4 sedotan stainless steel food grade, terdiri dari 2 sedotan lurus dan 2 sedotan bengkok, lengkap dengan sikat pembersih. Tidak berkarat dan aman untuk minuman panas maupun dingin. Sekali beli bisa dipakai bertahun-tahun tanpa menambah sampah plastik.',
  },
  {
    id: 4,
    slug: 'alat-makan-bambu',
    name: 'Alat Makan Bambu Travel Set',
    category: 'makan-minum',
    featured: true,
    emoji: '🍴',
    image: '/images/alat-makan-bambu.jpg',
    price: 45000,
    weight: 150,
    dimensions: '24 x 7 x 3 cm',
    short: 'Sendok, garpu, sumpit, dan sedotan bambu dalam kantong kain. Makan di mana saja tanpa alat makan plastik.',
    description:
      'Satu set alat makan bambu berisi sendok, garpu, sumpit, dan sedotan, dikemas dalam kantong kain. Ringan dan mudah dibawa ke kampus, kantor, atau saat bepergian. Membantu menolak sendok dan garpu plastik sekali pakai saat membeli makanan.',
  },
  {
    id: 5,
    slug: 'kotak-makan-stainless',
    name: 'Kotak Makan Stainless',
    category: 'makan-minum',
    emoji: '🍱',
    image: '/images/kotak-makan.jpg',
    price: 95000,
    weight: 450,
    dimensions: '18 x 13 x 7 cm',
    short: 'Kotak makan stainless 800 ml dua sekat, pengganti styrofoam dan kemasan bungkus makanan.',
    description:
      'Kotak makan stainless steel dua sekat dengan tutup rapat, kapasitas 800 ml. Kuat, tidak menyerap bau, dan mudah dicuci. Bawa saat membeli makanan supaya tidak perlu kemasan styrofoam atau plastik.',
  },
  {
    id: 6,
    slug: 'tote-bag-kanvas',
    name: 'Tote Bag Kanvas Daur Ulang',
    category: 'tas-kemasan',
    featured: true,
    emoji: '👜',
    image: '/images/tote-bag.jpg',
    weight: 200,
    dimensions: '40 x 35 x 2 cm',
    short: 'Tote bag kanvas daur ulang 40 x 35 cm, pengganti kantong plastik belanja. Tersedia 3 warna.',
    description:
      'Tote bag dari kanvas daur ulang yang dibuat dari sisa kain produksi garmen. Ukurannya 40 x 35 cm dengan tali bahu panjang, kuat menampung belanjaan hingga 8 kg. Satu tote bag bisa menggantikan ratusan kantong plastik belanja setiap tahun.',
    attribute: 'Warna',
    variants: [
      { name: 'Natural', price: 55000, note: 'Warna natural krem, cocok untuk semua gaya.' },
      { name: 'Hitam', price: 55000, note: 'Warna hitam, tidak mudah terlihat kotor.' },
      { name: 'Hijau', price: 55000, note: 'Warna hijau daun, sesuai semangat BumiHijau.' },
    ],
  },
  {
    id: 7,
    slug: 'tas-belanja-lipat',
    name: 'Tas Belanja Lipat',
    category: 'tas-kemasan',
    emoji: '🛍️',
    image: '/images/tas-lipat.jpg',
    price: 35000,
    weight: 80,
    dimensions: '12 x 10 x 3 cm',
    short: 'Tas belanja lipat sekecil dompet, kuat menampung hingga 10 kg.',
    description:
      'Tas belanja dari kain parasut yang bisa dilipat sekecil dompet dan dikaitkan ke tas atau gantungan kunci. Saat dibuka mampu menampung belanjaan hingga 10 kg. Selalu siap dibawa sehingga kamu tidak perlu meminta kantong plastik di kasir.',
  },
  {
    id: 8,
    slug: 'beeswax-wrap',
    name: 'Beeswax Wrap Set 3',
    category: 'tas-kemasan',
    emoji: '🐝',
    image: '/images/beeswax-wrap.jpg',
    price: 65000,
    weight: 100,
    dimensions: '20 x 15 x 2 cm',
    short: 'Pembungkus makanan dari lilin lebah, pengganti plastik wrap. Isi 3 ukuran.',
    description:
      'Set 3 kain pembungkus berlapis lilin lebah dalam ukuran kecil, sedang, dan besar. Cukup dibentuk dengan hangat tangan untuk membungkus roti, buah, atau menutup mangkuk. Bisa dicuci dengan air dingin dan dipakai ulang hingga sekitar 1 tahun.',
  },
  {
    id: 9,
    slug: 'kantong-jaring-sayur',
    name: 'Kantong Jaring Sayur Set 5',
    category: 'tas-kemasan',
    emoji: '🥕',
    image: '/images/kantong-jaring.jpg',
    price: 40000,
    weight: 120,
    dimensions: '20 x 15 x 3 cm',
    short: 'Kantong jaring katun untuk belanja sayur dan buah tanpa kantong plastik. Isi 5.',
    description:
      'Set 5 kantong jaring dari katun organik dengan tali serut, dalam berbagai ukuran. Seratnya berpori sehingga udara mengalir dan sayur tetap segar. Cocok dibawa ke pasar atau supermarket sebagai pengganti kantong plastik kecil.',
  },
  {
    id: 10,
    slug: 'sikat-gigi-bambu',
    name: 'Sikat Gigi Bambu isi 4',
    category: 'perawatan-diri',
    emoji: '🪥',
    image: '/images/sikat-gigi-bambu.jpg',
    price: 40000,
    weight: 90,
    dimensions: '20 x 10 x 2 cm',
    short: 'Sikat gigi gagang bambu yang bisa terurai. Isi 4, cukup untuk setahun.',
    description:
      'Paket 4 sikat gigi dengan gagang bambu dan bulu sikat lembut. Gagang bambu bisa terurai secara alami, berbeda dengan sikat gigi plastik yang bertahan ratusan tahun. Ganti sikat setiap 3 bulan, jadi satu paket cukup untuk setahun.',
  },
  {
    id: 11,
    slug: 'sabun-batang-alami',
    name: 'Sabun Batang Alami',
    category: 'perawatan-diri',
    emoji: '🧼',
    image: '/images/sabun-batang.jpg',
    price: 28000,
    weight: 110,
    dimensions: '8 x 6 x 3 cm',
    short: 'Sabun batang bahan alami dalam kemasan kertas, tanpa botol plastik.',
    description:
      'Sabun mandi batang dari minyak kelapa dan minyak zaitun dengan aroma serai. Dikemas dengan kertas daur ulang tanpa plastik sama sekali. Satu batang setara dengan satu botol sabun cair 250 ml.',
  },
  {
    id: 12,
    slug: 'sampo-batang',
    name: 'Sampo Batang',
    category: 'perawatan-diri',
    emoji: '🫧',
    image: '/images/sampo-batang.jpg',
    price: 45000,
    weight: 90,
    dimensions: '7 x 7 x 3 cm',
    short: 'Sampo padat setara 2 sampai 3 botol sampo cair, tanpa botol plastik.',
    description:
      'Sampo padat untuk semua jenis rambut dengan bahan alami dan aroma lavender. Basahi rambut, gosokkan sampo hingga berbusa, lalu bilas. Satu batang setara 2 sampai 3 botol sampo cair sehingga mengurangi sampah botol plastik.',
  },
  {
    id: 13,
    slug: 'kapas-wajah-pakai-ulang',
    name: 'Kapas Wajah Pakai Ulang isi 10',
    category: 'perawatan-diri',
    emoji: '⚪',
    image: '/images/kapas-wajah.jpg',
    price: 50000,
    weight: 60,
    dimensions: '12 x 10 x 3 cm',
    short: 'Kapas wajah katun bambu yang bisa dicuci. Isi 10 lembar dan 1 kantong cuci.',
    description:
      '10 lembar kapas wajah dari kain katun bambu yang lembut, lengkap dengan kantong cuci. Dipakai untuk membersihkan makeup atau mengoleskan toner, lalu dicuci dan dipakai lagi. Bisa menggantikan ribuan lembar kapas sekali pakai.',
  },
  {
    id: 14,
    slug: 'pisau-cukur-stainless',
    name: 'Pisau Cukur Stainless',
    category: 'perawatan-diri',
    emoji: '🪒',
    image: '/images/pisau-cukur.jpg',
    price: 120000,
    weight: 150,
    dimensions: '15 x 6 x 4 cm',
    short: 'Pisau cukur gagang stainless dengan 5 mata pisau cadangan. Cukup ganti mata pisau.',
    description:
      'Pisau cukur dengan gagang stainless steel yang awet dan 5 mata pisau cadangan. Saat tumpul, cukup ganti mata pisaunya dan gagangnya tetap dipakai. Mengurangi sampah pisau cukur plastik sekali pakai.',
  },
  {
    id: 15,
    slug: 'komposter-20l',
    name: 'Komposter Rumah Tangga 20 L',
    category: 'rumah-kebun',
    featured: true,
    emoji: '🪴',
    image: '/images/komposter.jpg',
    price: 250000,
    weight: 3000,
    dimensions: '35 x 35 x 45 cm',
    short: 'Ubah sisa makanan jadi kompos dan pupuk cair, kurangi gas metana dari TPA.',
    description:
      'Wadah komposter 20 liter dengan keran untuk mengambil pupuk cair, dilengkapi 1 kg bahan aktivator. Masukkan sisa sayur, buah, dan nasi setiap hari, dalam 3 sampai 4 minggu menjadi kompos untuk tanaman. Mengolah sampah organik di rumah mengurangi gas metana dari tumpukan sampah di TPA.',
  },
  {
    id: 16,
    slug: 'spons-sabut-kelapa',
    name: 'Spons Sabut Kelapa isi 3',
    category: 'rumah-kebun',
    emoji: '🥥',
    image: '/images/spons-sabut.jpg',
    price: 20000,
    weight: 60,
    dimensions: '12 x 8 x 6 cm',
    short: 'Spons cuci piring sabut kelapa yang bisa dijadikan kompos. Isi 3.',
    description:
      '3 spons cuci piring dari serat sabut kelapa alami. Kuat untuk membersihkan kerak tanpa menggores. Setelah aus, spons bisa dimasukkan ke komposter, tidak seperti spons sintetis yang menjadi sampah mikroplastik.',
  },
  {
    id: 17,
    slug: 'deterjen-isi-ulang',
    name: 'Deterjen Cair Isi Ulang 1 L',
    category: 'rumah-kebun',
    emoji: '🧴',
    image: '/images/deterjen.jpg',
    price: 45000,
    weight: 1100,
    dimensions: '20 x 10 x 8 cm',
    short: 'Deterjen cair ramah lingkungan dalam kemasan isi ulang 1 liter.',
    description:
      'Deterjen cair berbahan dasar tumbuhan yang mudah terurai, dalam kemasan pouch isi ulang 1 liter. Cukup 1 tutup untuk sekali cuci. Dengan membeli isi ulang, kamu tidak menambah botol plastik baru setiap bulan.',
  },
  {
    id: 18,
    slug: 'bibit-pohon-peneduh',
    name: 'Paket Bibit Pohon Peneduh',
    category: 'rumah-kebun',
    emoji: '🌳',
    image: '/images/bibit-pohon.jpg',
    price: 35000,
    weight: 500,
    dimensions: '15 x 15 x 30 cm',
    short: 'Paket 2 bibit pohon peneduh yang menyerap karbon dioksida dan menyejukkan lingkungan.',
    description:
      'Paket 2 bibit pohon peneduh setinggi sekitar 30 cm dalam pot sabut kelapa, beserta panduan menanam. Tanam di halaman atau lahan kosong dan siram rutin. Pohon menyerap karbon dioksida, menghasilkan oksigen, dan membuat lingkungan lebih sejuk.',
  },
  {
    id: 19,
    slug: 'lampu-taman-surya',
    name: 'Lampu Taman Tenaga Surya',
    category: 'energi-hemat',
    emoji: '💡',
    image: '/images/lampu-surya.jpg',
    price: 120000,
    weight: 500,
    dimensions: '15 x 15 x 40 cm',
    short: 'Lampu taman LED tenaga surya yang menyala otomatis di malam hari tanpa listrik PLN.',
    description:
      'Lampu taman LED dengan panel surya kecil di bagian atasnya. Siang hari mengisi daya dari sinar matahari, malam hari menyala otomatis hingga 8 jam. Tidak memakai listrik PLN sehingga mengurangi emisi dari pembangkit listrik.',
  },
  {
    id: 20,
    slug: 'power-bank-surya',
    name: 'Power Bank Tenaga Surya 10.000 mAh',
    category: 'energi-hemat',
    emoji: '🔋',
    image: '/images/power-bank-surya.jpg',
    price: 275000,
    weight: 400,
    dimensions: '15 x 8 x 2 cm',
    short: 'Power bank 10.000 mAh yang bisa diisi dari sinar matahari.',
    description:
      'Power bank kapasitas 10.000 mAh dengan panel surya di permukaannya, bisa diisi dari sinar matahari atau kabel USB. Dilengkapi 2 port USB dan senter LED. Cocok untuk kegiatan luar ruangan sekaligus menghemat listrik.',
  },
];

// Harga terendah sebuah produk (untuk produk variasi ditampilkan "mulai dari")
export function minPrice(p) {
  return p.variants ? Math.min(...p.variants.map((v) => v.price)) : p.price;
}

export function maxPrice(p) {
  return p.variants ? Math.max(...p.variants.map((v) => v.price)) : p.price;
}

// Harga sebuah item keranjang (produk + nama variasi)
export function priceOf(product, variantName) {
  if (!product.variants) return product.price;
  const v = product.variants.find((x) => x.name === variantName);
  return v ? v.price : null;
}

export function findProduct(id) {
  return products.find((p) => p.id === Number(id));
}

export function categoryName(id) {
  return categories.find((c) => c.id === id)?.name ?? id;
}

// Ongkos kirim: Jawa Timur Rp10.000, provinsi lain Rp50.000
export const SHIPPING_LOCAL_PROVINCE = 'Jawa Timur';
export function shippingCost(province) {
  if (!province) return 0;
  return province === SHIPPING_LOCAL_PROVINCE ? 10000 : 50000;
}

export const provinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Banten', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah',
  'Papua Pegunungan', 'Papua Selatan',
];

export const bankAccount = {
  bank: 'Bank BNI',
  number: '1234567890',
  holder: 'BumiHijau',
};

export function rupiah(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}
