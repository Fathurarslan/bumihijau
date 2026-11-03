// Toko ini tidak memakai akun, jadi email pembeli dipakai sebagai identitas.
// Email yang pernah dipakai checkout disimpan di browser supaya Riwayat Pesanan langsung terisi.
const STORAGE_KEY = 'bumihijau_emails';

export function loadEmails() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((e) => typeof e === 'string' && e.includes('@')) : [];
  } catch {
    return [];
  }
}

function saveEmails(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* penyimpanan browser tidak tersedia, email bisa dimasukkan manual */
  }
}

export function rememberEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return loadEmails();
  const list = [e, ...loadEmails().filter((x) => x !== e)].slice(0, 5);
  saveEmails(list);
  return list;
}

export function forgetEmail(email) {
  const list = loadEmails().filter((x) => x !== email);
  saveEmails(list);
  return list;
}
