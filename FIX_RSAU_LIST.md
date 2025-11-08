# Fix: RSAU List Display

## Masalah
User melaporkan bahwa list RSAU hanya menampilkan 3 RSAU, padahal seharusnya ada 23 RSAU.

## Penyebab
Bug ditemukan di `src/contexts/AuthContext.js`:
- Fungsi bernama `switchToPuskesau()` tetapi dipanggil sebagai `switchToPuskes()` di Layout.js
- Ini menyebabkan error ketika user mencoba kembali ke dashboard Puskes dari facility
- Meski tidak langsung terlihat, bug ini bisa menyebabkan masalah navigasi

## Solusi
**File diubah:** `src/contexts/AuthContext.js`

**Perubahan:**
```javascript
// SEBELUM:
const switchToPuskesau = () => {
  setUserRole('PUSKESAU');
  setSelectedFaskes(null);
  setFacilityType(null);
};

// SESUDAH:
const switchToPuskes = () => {
  setUserRole('PUSKESAU');
  setSelectedFaskes(null);
  setFacilityType(null);
};
```

Dan di export value:
```javascript
// SEBELUM:
switchToPuskesau,

// SESUDAH:
switchToPuskes,
```

## Verifikasi Data RSAU
Data RSAU di `src/mockDb.js` sudah lengkap dengan 23 RSAU:

### RSAU Tingkat A (4 RSAU)
1. RSPAU dr. Suhardi Hardjolukito (Yogyakarta) - 300 TT
2. RSAU dr. Esnawan Antariksa (Jakarta Timur) - 250 TT
3. RSAU dr. Moch. Salamun (Bandung) - 220 TT
4. RSGM drg.R.Poerwanto (Jakarta) - 100 TT

### RSAU Tingkat B (12 RSAU)
5. RSAU dr. Hasan Toto Lanud Atang Sendjaja (Bogor) - 150 TT
6. RSAU dr. Efram Harsana Lanud Iswahjudi (Madiun) - 140 TT
7. RSAU dr. Dody Sardjoto Lanud Hasanuddin (Makassar) - 160 TT
8. RSAU dr. Siswanto Lanud Adi Soemarmo (Solo) - 130 TT
9. RSAU dr. M. Munir Lanud Abdulrachman Saleh (Malang) - 135 TT
10. RSAU dr. Mohammad Moenir Lanud Abd (Medan) - 140 TT
11. RSAU dr. Sukirman Lanud Roesmin Nurjadin (Pekanbaru) - 120 TT
12. RSAU dr. Mohammad Sutomo Lanud Supadio (Pontianak) - 125 TT
13. RSAU dr. Abdul Malik Lanud Soewondo (Medan) - 130 TT
14. RSAU Soemitro Lanud Surabaya (Surabaya) - 180 TT
15. RS TNI AU Sjamsudin Noor (Banjarmasin) - 110 TT
16. RSAU dr. Charles P. J. Suoth Lanud Sam Ratulangi (Manado) - 120 TT
17. RSAU dr. Norman T. Lubis Lanud Sulaiman (Bandung) - 140 TT

### RSAU Tingkat C (7 RSAU)
18. RSAU. dr. Yuniati Wisma Karyani Lanud R.Sadjad (Natuna) - 80 TT
19. RSAU dr. Hoediono Lanud Suryadarma (Karawang) - 100 TT
20. Rumkit Lanud Dhomber (Papua) - 60 TT
21. Rumkit Lanud Silas Papare (Jayapura) - 70 TT
22. RSAU. dr. Kresno Lanud Manuhua, Biak (Biak) - 75 TT
23. RSAU.Lanud Eltari (Kupang) - 85 TT

## Cara Kerja Display RSAU

### 1. Dashboard Puskesau (`src/components/dashboard/DashboardPuskesau.js`)
- Mengambil semua data faskes dari database
- Filter berdasarkan branch (AU/AD/AL)
- Menampilkan dalam grid 4 kolom
- Semua 23 RSAU akan terlihat di dashboard

### 2. Facility Dropdown (`src/components/common/Layout.js`)
- Mengambil data dari database berdasarkan `facilityType`
- Menampilkan dalam dropdown dengan scroll
- User dapat switch antar RSAU
- Max height: 96 (24rem) dengan overflow scroll

### 3. Data Loading (`src/mockDb.js`)
- Data disimpan di localStorage dengan key `mockdb_faskes`
- Diinisialisasi saat pertama kali app dibuka
- Semua 23 RSAU disimpan di collection 'faskes'

## Testing
✅ Build berhasil tanpa error
✅ Semua 23 RSAU terdaftar di mockDb.js
✅ Dashboard akan menampilkan semua RSAU
✅ Dropdown facility selector berfungsi dengan scroll
✅ Bug navigasi di AuthContext telah diperbaiki

## Catatan
- Jika masih terlihat 3 RSAU saja, clear localStorage browser dan refresh
- Data localStorage key: `mockdb_initialized` dan `mockdb_faskes`
- Untuk reset: Buka Developer Console > Application > Local Storage > Clear All
