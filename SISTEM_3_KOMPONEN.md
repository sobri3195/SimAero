# Dokumentasi Sistem 3 Komponen: Puskesau, RSAU, dan FKTP

## 🎯 Overview

Sistem telah direstrukturisasi dari 2 role (PUSAT/FASKES) menjadi 3 komponen yang terpisah dan spesifik:

1. **PUSKESAU** - Pusat Kesehatan Angkatan Udara (Pengawasan/Supervision)
2. **RSAU** - Rumah Sakit Angkatan Udara (SIMRS - Sistem Informasi Manajemen Rumah Sakit)
3. **FKTP** - Fasilitas Kesehatan Tingkat Pertama (SIM Klinik)

## 📊 Struktur Organisasi

```
PUSKESAU (Komando Pusat)
├── RSAU (3 Rumah Sakit)
│   ├── RSAU dr. Esnawan Antariksa (Jakarta Timur) - Tingkat A
│   ├── RSAU dr. M. Salamun (Bandung) - Tingkat A
│   └── RSAU dr. Siswondo Parman (Malang) - Tingkat B
│
└── FKTP (15 Klinik Lanud)
    ├── Klinik Kesehatan Lanud Halim Perdanakusuma (Jakarta)
    ├── Klinik Kesehatan Lanud Sulaiman (Bandung)
    ├── Klinik Kesehatan Lanud Abdulrachman Saleh (Malang)
    ├── Klinik Kesehatan Lanud Iswahjudi (Madiun)
    ├── Klinik Kesehatan Lanud Adisutjipto (Yogyakarta)
    ├── Klinik Kesehatan Lanud Ngurah Rai (Bali)
    ├── Klinik Kesehatan Lanud Sultan Hasanuddin (Makassar)
    ├── Klinik Kesehatan Lanud Sam Ratulangi (Manado)
    ├── Klinik Kesehatan Lanud Roesmin Nurjadin (Pekanbaru)
    ├── Klinik Kesehatan Lanud Sultan Mahmud Badaruddin II (Palembang)
    ├── Klinik Kesehatan Lanud Soewondo (Medan)
    ├── Klinik Kesehatan Lanud Sjamsudin Noor (Banjarmasin)
    ├── Klinik Kesehatan Lanud Supadio (Pontianak)
    ├── Klinik Kesehatan Lanud Pattimura (Ambon)
    └── Klinik Kesehatan Lanud Manuhua (Biak, Papua)
```

## 🏛️ 1. PUSKESAU (Pengawasan)

### Fungsi Utama
- Monitoring dan pengawasan seluruh fasilitas kesehatan TNI AU
- Akses ke sistem SIMRS di semua RSAU
- Akses ke sistem SIM Klinik di semua FKTP
- Laporan konsolidasi nasional

### Fitur Menu
- Dashboard Pengawasan
- Laporan Konsolidasi
- Pengaturan

### Dashboard Pengawasan
- Statistik total RSAU dan FKTP
- Daftar lengkap RSAU dengan informasi:
  - Tingkat rumah sakit (A/B)
  - Kapasitas tempat tidur
  - Fasilitas utama
  - Spesialisasi tersedia
  - Tombol "Akses SIMRS"
- Daftar lengkap FKTP dengan informasi:
  - Lokasi Lanud
  - Kapasitas
  - Fasilitas dasar
  - Tombol "Akses SIM Klinik"

### Cara Kerja
1. Saat login pertama kali, user masuk sebagai role **PUSKESAU**
2. Dari dashboard, user dapat mengklik tombol "Akses SIMRS" atau "Akses SIM Klinik"
3. Sistem otomatis switch role dan redirect ke dashboard RSAU/FKTP yang dipilih
4. User dapat kembali ke Puskesau dengan tombol "Kembali ke Puskesau"

## 🏥 2. RSAU (SIMRS - Sistem Informasi Manajemen Rumah Sakit)

### Data RSAU di Sistem

#### 1. RSAU dr. Esnawan Antariksa (Jakarta Timur)
- **Tingkat**: A
- **Kapasitas**: 250 Tempat Tidur
- **Lanud**: Lanud Halim Perdanakusuma
- **Fasilitas**: IGD 24 Jam, Rawat Inap, ICU, Operasi, Hemodialisa, CSSD, Lab, Radiologi
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT, Mata, Kulit, Jiwa, Jantung, Paru

#### 2. RSAU dr. M. Salamun (Bandung)
- **Tingkat**: A
- **Kapasitas**: 200 Tempat Tidur
- **Lanud**: Lanud Sulaiman
- **Fasilitas**: IGD 24 Jam, Rawat Inap, ICU, Operasi, Hemodialisa, CSSD, Lab, Radiologi
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT, Mata, Kulit, Jiwa

#### 3. RSAU dr. Siswondo Parman (Malang)
- **Tingkat**: B
- **Kapasitas**: 120 Tempat Tidur
- **Lanud**: Lanud Abdulrachman Saleh
- **Fasilitas**: IGD, Rawat Inap, Operasi, CSSD, Lab, Radiologi
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT

### Fitur Menu SIMRS (21 Modul)
1. Dashboard
2. Database Pasien
3. Pendaftaran & Antrean
4. Rekam Medis (EHR)
5. IGD (Instalasi Gawat Darurat)
6. Rawat Inap
7. Jadwal Operasi
8. CSSD (Central Sterile Supply Department)
9. Bank Darah
10. Rikkes (Pemeriksaan Kesehatan)
11. Farmasi
12. Laboratorium
13. Radiologi
14. SDM & Jadwal
15. Aset & Kalibrasi
16. Logistik
17. Laporan Insiden
18. Laporan & Analitik
19. Bridging (BPJS, SATUSEHAT)
20. Broadcast
21. Pengaturan

### Dashboard SIMRS
- Quick Access: Pendaftaran, IGD, Rawat Inap, Operasi, Bank Darah, Farmasi, Lab, CSSD
- Statistik operasional harian
- Tugas dan notifikasi penting

## 🏥 3. FKTP (SIM Klinik)

### Data FKTP di Sistem (15 Klinik)

Semua klinik memiliki fasilitas dasar:
- Poli Umum
- Poli Gigi
- Apotek
- Laboratorium Sederhana (beberapa klinik)

**Daftar lengkap klinik dengan lokasi Lanud:**

1. **Lanud Halim Perdanakusuma** (Jakarta Timur) - Kapasitas: 50
2. **Lanud Sulaiman** (Bandung) - Kapasitas: 40
3. **Lanud Abdulrachman Saleh** (Malang) - Kapasitas: 35
4. **Lanud Iswahjudi** (Madiun) - Kapasitas: 30
5. **Lanud Adisutjipto** (Yogyakarta) - Kapasitas: 35
6. **Lanud Ngurah Rai** (Bali) - Kapasitas: 40
7. **Lanud Sultan Hasanuddin** (Makassar) - Kapasitas: 45
8. **Lanud Sam Ratulangi** (Manado) - Kapasitas: 30
9. **Lanud Roesmin Nurjadin** (Pekanbaru) - Kapasitas: 35
10. **Lanud Sultan Mahmud Badaruddin II** (Palembang) - Kapasitas: 40
11. **Lanud Soewondo** (Medan) - Kapasitas: 35
12. **Lanud Sjamsudin Noor** (Banjarmasin) - Kapasitas: 30
13. **Lanud Supadio** (Pontianak) - Kapasitas: 30
14. **Lanud Pattimura** (Ambon) - Kapasitas: 25
15. **Lanud Manuhua** (Biak, Papua) - Kapasitas: 25

### Fitur Menu SIM Klinik (13 Modul)
1. Dashboard
2. Database Pasien
3. Pendaftaran & Antrean
4. Rekam Medis (EHR)
5. Rikkes (Pemeriksaan Kesehatan)
6. Farmasi
7. Laboratorium
8. SDM & Jadwal
9. Logistik
10. Laporan Insiden
11. Laporan & Analitik
12. Broadcast
13. Pengaturan

### Dashboard SIM Klinik
- Quick Access: Pendaftaran, Database Pasien, Farmasi, Lab
- Statistik operasional harian
- Tugas dan notifikasi penting

## 🔄 Alur Kerja Sistem

### 1. Login Awal
```
User Login → Role: PUSKESAU → Dashboard Pengawasan
```

### 2. Akses ke RSAU
```
Dashboard Puskesau → Klik "Akses SIMRS" pada RSAU tertentu 
→ Role: RSAU 
→ selectedFaskes: [Nama RSAU]
→ Dashboard SIMRS dengan 21 modul lengkap
```

### 3. Akses ke FKTP
```
Dashboard Puskesau → Klik "Akses SIM Klinik" pada FKTP tertentu 
→ Role: FKTP 
→ selectedFaskes: [Nama FKTP]
→ Dashboard SIM Klinik dengan 13 modul
```

### 4. Kembali ke Puskesau
```
Tombol "Kembali ke Puskesau" (tersedia di sidebar saat role RSAU/FKTP)
→ Role: PUSKESAU
→ selectedFaskes: null
→ Dashboard Pengawasan
```

## 💾 Struktur Data (mockDb)

### Collection: faskes
```javascript
{
  id: 'rsau_1' | 'fktp_1',
  nama: 'RSAU dr. Esnawan Antariksa',
  lokasi: 'Jakarta Timur',
  alamat: 'Jl. Halim Perdanakusuma...',
  tipe: 'rsau' | 'fktp',
  tingkat: 'A' | 'B', // hanya untuk RSAU
  kapasitas: 250,
  status: 'aktif',
  lanud: 'Lanud Halim Perdanakusuma',
  fasilitasUtama: [...],
  spesialisasi: [...] // hanya untuk RSAU
}
```

## 🎨 Perbedaan Visual

### Header Title
- **PUSKESAU**: "PUSKESAU - Komando Kesehatan TNI AU"
- **RSAU**: "SIMRS - [Nama RSAU]"
- **FKTP**: "SIM Klinik - [Nama FKTP]"

### Sidebar Title
- **PUSKESAU**: "PUSKESAU"
- **RSAU**: "SIMRS"
- **FKTP**: "SIM Klinik"

### Tombol Navigasi
- Saat di RSAU/FKTP, muncul tombol "Kembali ke Puskesau" di sidebar

## 🔐 AuthContext

### State Variables
```javascript
{
  userRole: 'PUSKESAU' | 'RSAU' | 'FKTP',
  selectedFaskes: string | null,
  facilityType: 'rsau' | 'fktp' | null
}
```

### Helper Functions
- `switchToRSAU(faskesName)` - Switch ke mode RSAU dengan faskes tertentu
- `switchToFKTP(faskesName)` - Switch ke mode FKTP dengan faskes tertentu
- `switchToPuskes()` - Kembali ke mode pengawasan Puskesau

## 📝 File Changes

### New Files
- `/src/components/dashboard/DashboardPuskesau.js` - Dashboard pengawasan

### Modified Files
- `/src/contexts/AuthContext.js` - Support 3 roles
- `/src/components/common/Layout.js` - Menu berbeda per role
- `/src/components/dashboard/DashboardFaskes.js` - Support RSAU & FKTP
- `/src/pages/HomePage.js` - Routing 3 dashboard
- `/src/mockDb.js` - Data lengkap 3 RSAU + 15 FKTP

## 🚀 Cara Penggunaan

1. **Buka aplikasi** - Otomatis masuk sebagai Puskesau
2. **Lihat overview** - Dashboard menampilkan 3 RSAU dan 15 FKTP
3. **Akses RSAU** - Klik "Akses SIMRS" pada card RSAU → Masuk ke sistem lengkap SIMRS
4. **Akses FKTP** - Klik "Akses SIM Klinik" pada card FKTP → Masuk ke sistem klinik
5. **Kembali** - Klik "Kembali ke Puskesau" untuk monitoring lagi

## 📊 Statistik Sistem

- **Total RSAU**: 3 (2 Tingkat A, 1 Tingkat B)
- **Total FKTP**: 15 Klinik
- **Total Kapasitas RSAU**: 570 Tempat Tidur
- **Total Kapasitas FKTP**: 520 Pasien
- **Cakupan Wilayah**: Seluruh Indonesia (Sabang - Merauke)

## ✅ Keunggulan Sistem Baru

1. **Pemisahan Fungsi Jelas**
   - Puskesau: Fokus monitoring dan pengawasan
   - RSAU: Operasional rumah sakit lengkap
   - FKTP: Operasional klinik dasar

2. **Data Real TNI AU**
   - Menggunakan nama RSAU dan Lanud yang sebenarnya
   - Lokasi geografis akurat
   - Kapasitas realistis

3. **User Experience Lebih Baik**
   - Tidak ada menu yang tidak relevan
   - Navigasi lebih intuitif
   - Clear separation of concerns

4. **Skalabilitas**
   - Mudah menambah RSAU/FKTP baru
   - Data terstruktur dengan baik
   - Role-based access control

## 🔮 Future Enhancements

1. Real-time monitoring dari Puskesau
2. Alerts dan notifikasi ke Puskesau
3. Comparative analytics antar faskes
4. Performance benchmarking
5. Resource allocation optimization

---

**Dibuat**: 2024
**Versi**: 1.0.0
**Status**: ✅ Implemented & Tested
