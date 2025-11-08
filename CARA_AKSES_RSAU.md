# 🎯 PANDUAN AKSES 23 RSAU TNI AU

## Semua 23 RSAU sudah siap digunakan! Berikut cara mengaksesnya:

---

## 📍 CARA 1: Via Dashboard Puskesau

### Langkah-langkah:

1. **Buka Aplikasi**
   ```
   http://localhost:3000
   atau
   https://[your-netlify-url].netlify.app
   ```

2. **Login** (Mock - automatic)
   - User: Demo User
   - Role: PUSKESAU
   - Branch: TNI AU

3. **Lihat Dashboard**
   - Dashboard menampilkan 2 section:
     - **Section 1**: Rumah Sakit Angkatan Udara (RSAU) - 23 cards
     - **Section 2**: Fasilitas Kesehatan Tingkat Pertama (FKTP) - 15 cards

4. **Klik "Akses SIMRS"**
   - Setiap RSAU memiliki tombol "Akses SIMRS"
   - Klik tombol pada RSAU yang ingin diakses
   - Otomatis masuk ke sistem SIMRS RSAU tersebut

### Screenshot Area:
```
┌─────────────────────────────────────────────┐
│  Dashboard Puskesau                         │
│  Pengawasan & Monitoring Fasilitas TNI AU  │
├─────────────────────────────────────────────┤
│                                             │
│  [23 RSAU]  [15 FKTP]  [X Pasien]  [Kapasitas] │
│                                             │
├─────────────────────────────────────────────┤
│  Rumah Sakit Angkatan Udara (RSAU)  23 RS  │
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐   │
│  │RSAU 1│  │RSAU 2│  │RSAU 3│  │RSAU 4│   │
│  │Yogya │  │Jakart│  │Bandun│  │RSGM  │   │
│  │[AKSES│  │[AKSES│  │[AKSES│  │[AKSES│   │
│  │SIMRS]│  │SIMRS]│  │SIMRS]│  │SIMRS]│   │
│  └──────┘  └──────┘  └──────┘  └──────┘   │
│  ... (19 RSAU lainnya)                     │
└─────────────────────────────────────────────┘
```

---

## 📍 CARA 2: Via Dropdown Selector (Switching)

### Langkah-langkah:

1. **Setelah masuk ke salah satu RSAU**
   - Anda sudah berada di mode SIMRS RSAU

2. **Lihat Header**
   - Di bagian header, ada dropdown menampilkan nama RSAU aktif
   - Contoh: "RSAU dr. Esnawan Antariksa" dengan icon chevron-down

3. **Klik Dropdown**
   - Dropdown akan menampilkan list semua 23 RSAU
   - Setiap item menunjukkan:
     - Nama lengkap RSAU
     - Lokasi kota
   - RSAU yang sedang aktif akan di-highlight

4. **Pilih RSAU Lain**
   - Scroll untuk melihat semua 23 RSAU
   - Klik RSAU yang ingin diakses
   - Sistem otomatis switch ke RSAU tersebut
   - Dashboard akan reload dengan data RSAU baru

### Screenshot Area:
```
┌──────────────────────────────────────────────┐
│ [☰] SIMRS    [TNI AU▼] [RSAU Esnawan▼] [⚕Admin▼] [🔔] [👤] │
├──────────────────────────────────────────────┤
│                    ↓                         │
│            ┌─────────────────────┐           │
│            │ Pilih RSAU          │           │
│            ├─────────────────────┤           │
│            │ □ RSPAU dr. Suhardi │           │
│            │   Yogyakarta        │           │
│            ├─────────────────────┤           │
│            │ ■ RSAU dr. Esnawan  │← Active   │
│            │   Jakarta Timur     │           │
│            ├─────────────────────┤           │
│            │ □ RSAU dr. Moch...  │           │
│            │   Bandung           │           │
│            ├─────────────────────┤           │
│            │ ... (20 RSAU lain)  │           │
│            └─────────────────────┘           │
└──────────────────────────────────────────────┘
```

---

## 📍 CARA 3: Tombol "Kembali ke Puskesau"

### Langkah-langkah:

1. **Saat di SIMRS RSAU**
   - Anda berada di mode fasilitas (bukan mode pengawasan)

2. **Lihat Sidebar**
   - Di bagian atas sidebar, ada tombol:
   - **"Kembali ke Puskesau"** (dengan icon shield)

3. **Klik Tombol**
   - Sistem kembali ke mode pengawasan Puskesau
   - Dashboard menampilkan semua 23 RSAU lagi
   - Anda bisa pilih RSAU lain

### Screenshot Area:
```
┌──────────────────┐
│ SIMRS            │
│ TNI Angkatan Udara│
├──────────────────┤
│                  │
│ [⛨ Kembali ke   ]│
│ [  Puskesau     ]│← Klik ini
│                  │
├──────────────────┤
│ ☐ Dashboard      │
│ ☐ Pasien         │
│ ☐ Pendaftaran    │
│ ☐ Antrean        │
│ ...              │
└──────────────────┘
```

---

## 📍 CARA 4: Direct URL Navigation

### Untuk Development:

Jika Anda tahu nama RSAU, bisa akses langsung via code:

```javascript
// Di component atau page
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { switchToRSAU } = useAuth();
  
  // Akses RSAU tertentu
  const accessRSAU = () => {
    switchToRSAU('RSAU dr. Esnawan Antariksa');
    navigate('/');
  };
  
  return <button onClick={accessRSAU}>Akses RSAU</button>;
}
```

### Daftar Nama untuk switchToRSAU():

```javascript
// Tingkat A
switchToRSAU('RSPAU dr. Suhardi Hardjolukito');
switchToRSAU('RSAU dr. Esnawan Antariksa');
switchToRSAU('RSAU dr. Moch. Salamun');
switchToRSAU('RSGM drg.R.Poerwanto');

// Tingkat B
switchToRSAU('RSAU dr. Hasan Toto Lanud Atang Sendjaja');
switchToRSAU('RSAU dr. Efram Harsana Lanud Iswahjudi');
switchToRSAU('RSAU dr. Dody Sardjoto Lanud Hasanuddin');
switchToRSAU('RSAU dr. Siswanto Lanud Adi Soemarmo');
switchToRSAU('RSAU dr. M. Munir Lanud Abdulrachman Saleh');
switchToRSAU('RSAU dr. Mohammad Moenir Lanud Abd');
switchToRSAU('RSAU dr. Sukirman Lanud Roesmin Nurjadin');
switchToRSAU('RSAU dr. Mohammad Sutomo Lanud Supadio');
switchToRSAU('RSAU dr. Abdul Malik Lanud Soewondo');
switchToRSAU('RSAU Soemitro Lanud Surabaya');
switchToRSAU('RS TNI AU Sjamsudin Noor');
switchToRSAU('RSAU dr. Charles P. J. Suoth Lanud Sam Ratulangi');
switchToRSAU('RSAU dr. Norman T. Lubis Lanud Sulaiman');

// Tingkat C
switchToRSAU('RSAU. dr. Yuniati Wisma Karyani Lanud R.Sadjad');
switchToRSAU('RSAU  dr. Hoediono Lanud Suryadarma');
switchToRSAU('Rumkit Lanud Dhomber');
switchToRSAU('Rumkit Lanud Silas Papare');
switchToRSAU('RSAU. dr. Kresno Lanud Manuhua, Biak');
switchToRSAU('RSAU.Lanud Eltari');
```

---

## 🎯 Tips & Trik

### 1. **Quick Access dengan Keyboard**
- Tab: Navigate antar element
- Enter: Akses RSAU yang di-focus
- Esc: Close dropdown

### 2. **Mobile Responsive**
- Semua 23 RSAU dapat diakses di mobile
- Grid akan menyesuaikan (1-2 kolom)
- Dropdown tetap berfungsi

### 3. **Search Function** (Coming Soon)
- Akan ada fitur search untuk cari RSAU by nama/lokasi
- Filter by tingkat (A/B/C)
- Sort by nama/lokasi/kapasitas

### 4. **Bookmark Favorites**
- Browser bookmark untuk RSAU favorit
- URL akan sama karena SPA (Single Page App)
- State management via localStorage

---

## 🔍 Troubleshooting

### **Dropdown tidak muncul?**
- Refresh browser (Ctrl+F5)
- Clear localStorage: `localStorage.clear()`
- Restart dev server

### **RSAU tidak muncul di dashboard?**
- Check console untuk errors
- Verify mockDb.js initialized
- Check: `localStorage.getItem('mockdb_faskes')`

### **Data tidak tersimpan?**
- localStorage hanya untuk demo
- Data tidak persisten antar browser/device
- Reset dengan refresh page

---

## 📊 Monitoring & Analytics

### **Melihat Data RSAU di Console:**

```javascript
// Open browser console (F12)

// Lihat semua faskes
const faskes = JSON.parse(localStorage.getItem('mockdb_faskes'));
console.log('Total Faskes:', faskes.length);

// Filter RSAU saja
const rsau = faskes.filter(f => f.tipe === 'rsau');
console.log('Total RSAU:', rsau.length); // Should be 23

// Lihat detail RSAU
console.table(rsau.map(r => ({
  nama: r.nama,
  lokasi: r.lokasi,
  tingkat: r.tingkat,
  kapasitas: r.kapasitas
})));

// RSAU per tingkat
console.log('Tingkat A:', rsau.filter(r => r.tingkat === 'A').length);
console.log('Tingkat B:', rsau.filter(r => r.tingkat === 'B').length);
console.log('Tingkat C:', rsau.filter(r => r.tingkat === 'C').length);
```

---

## ✅ Checklist Verification

Pastikan semua berfungsi:

- [ ] Dashboard Puskesau menampilkan 23 RSAU
- [ ] Setiap RSAU memiliki tombol "Akses SIMRS"
- [ ] Klik tombol berhasil masuk ke RSAU
- [ ] Dropdown selector menampilkan 23 RSAU
- [ ] Switching antar RSAU berfungsi
- [ ] Tombol "Kembali ke Puskesau" berfungsi
- [ ] Data RSAU lengkap (nama, lokasi, kapasitas)
- [ ] Grid responsive di mobile
- [ ] Build success tanpa error

---

## 🎉 KESIMPULAN

**SEMUA 23 RSAU DAPAT DIAKSES DENGAN 4 CARA:**

1. ✅ Dashboard Puskesau → Tombol "Akses SIMRS"
2. ✅ Dropdown Selector → Pilih dari 23 RSAU
3. ✅ Tombol "Kembali ke Puskesau" → Dashboard
4. ✅ Programmatic Access → switchToRSAU()

**Status: FULLY FUNCTIONAL** 🚀

---

**Dibuat**: ${new Date().toLocaleString('id-ID')}
**Untuk**: Healthcare Platform TNI AU
**Versi**: 1.0.0
