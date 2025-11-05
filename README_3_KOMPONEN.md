# 🏥 Puskesau - Platform Kesehatan TNI Angkatan Udara

## 🎯 Overview Sistem 3 Komponen

Platform terintegrasi untuk TNI Angkatan Udara dengan **3 komponen terpisah**:

### 1. 🏛️ PUSKESAU - Pusat Kesehatan Angkatan Udara
**Fungsi**: Pengawasan dan monitoring seluruh fasilitas kesehatan TNI AU
- Monitor 3 RSAU dan 15 FKTP secara real-time
- Akses langsung ke sistem SIMRS dan SIM Klinik
- Laporan konsolidasi nasional

### 2. 🏥 RSAU - Rumah Sakit Angkatan Udara (SIMRS)
**Fungsi**: Sistem Informasi Manajemen Rumah Sakit lengkap
- 3 Rumah Sakit: Jakarta, Bandung, Malang
- 21 modul operasional lengkap
- IGD, Rawat Inap, Operasi, CSSD, Bank Darah, dll

### 3. 🏥 FKTP - Fasilitas Kesehatan Tingkat Pertama (SIM Klinik)
**Fungsi**: Sistem Informasi Manajemen Klinik
- 15 Klinik di seluruh Lanud
- 13 modul klinik dasar
- Poli Umum, Poli Gigi, Farmasi, Lab Sederhana

⚠️ **DEMO MODE**: Aplikasi ini menggunakan localStorage (tanpa backend). Data bersifat lokal dan tidak persisten.

---

## 📊 Data Fasilitas

### 🏥 3 RSAU (Rumah Sakit Angkatan Udara)

#### 1. RSAU dr. Esnawan Antariksa - Jakarta Timur
- **Tingkat**: A
- **Kapasitas**: 250 Tempat Tidur
- **Lanud**: Halim Perdanakusuma
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT, Mata, Kulit, Jiwa, Jantung, Paru

#### 2. RSAU dr. M. Salamun - Bandung
- **Tingkat**: A
- **Kapasitas**: 200 Tempat Tidur
- **Lanud**: Sulaiman
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT, Mata, Kulit, Jiwa

#### 3. RSAU dr. Siswondo Parman - Malang
- **Tingkat**: B
- **Kapasitas**: 120 Tempat Tidur
- **Lanud**: Abdulrachman Saleh
- **Spesialisasi**: Penyakit Dalam, Bedah, Anak, Kebidanan, THT

### 🏥 15 FKTP (Klinik Kesehatan Lanud)

1. **Lanud Halim Perdanakusuma** (Jakarta)
2. **Lanud Sulaiman** (Bandung)
3. **Lanud Abdulrachman Saleh** (Malang)
4. **Lanud Iswahjudi** (Madiun)
5. **Lanud Adisutjipto** (Yogyakarta)
6. **Lanud Ngurah Rai** (Bali)
7. **Lanud Sultan Hasanuddin** (Makassar)
8. **Lanud Sam Ratulangi** (Manado)
9. **Lanud Roesmin Nurjadin** (Pekanbaru)
10. **Lanud Sultan Mahmud Badaruddin II** (Palembang)
11. **Lanud Soewondo** (Medan)
12. **Lanud Sjamsudin Noor** (Banjarmasin)
13. **Lanud Supadio** (Pontianak)
14. **Lanud Pattimura** (Ambon)
15. **Lanud Manuhua** (Biak, Papua)

---

## 🚀 Quick Start

### Instalasi

```bash
# Clone repository
git clone [repository-url]
cd project

# Install dependencies
npm install

# Jalankan aplikasi
npm start
```

Aplikasi akan terbuka di `http://localhost:3000`

### Penggunaan

#### 1️⃣ Mulai dari Puskesau
Saat pertama kali dibuka, Anda akan berada di **Dashboard Puskesau** yang menampilkan:
- Overview 3 RSAU dengan informasi lengkap
- Overview 15 FKTP di seluruh Indonesia
- Statistik agregat

#### 2️⃣ Akses SIMRS (RSAU)
Klik tombol **"Akses SIMRS"** pada card RSAU yang ingin diawasi:
- Sistem otomatis switch ke mode RSAU
- 21 menu modul SIMRS muncul
- Dashboard operasional rumah sakit ditampilkan

#### 3️⃣ Akses SIM Klinik (FKTP)
Klik tombol **"Akses SIM Klinik"** pada card FKTP yang ingin diawasi:
- Sistem otomatis switch ke mode FKTP
- 13 menu modul klinik muncul
- Dashboard operasional klinik ditampilkan

#### 4️⃣ Kembali ke Puskesau
Klik tombol **"Kembali ke Puskesau"** di sidebar untuk kembali ke mode pengawasan.

---

## 📋 Fitur per Komponen

### 🏛️ Menu PUSKESAU (3 Modul)
1. Dashboard Pengawasan
2. Laporan Konsolidasi
3. Pengaturan

### 🏥 Menu RSAU/SIMRS (21 Modul)
1. Dashboard
2. Database Pasien
3. Pendaftaran & Antrean
4. Rekam Medis (EHR)
5. IGD (Instalasi Gawat Darurat)
6. Rawat Inap
7. Jadwal Operasi
8. CSSD
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

### 🏥 Menu FKTP/SIM Klinik (13 Modul)
1. Dashboard
2. Database Pasien
3. Pendaftaran & Antrean
4. Rekam Medis (EHR)
5. Rikkes
6. Farmasi
7. Laboratorium
8. SDM & Jadwal
9. Logistik
10. Laporan Insiden
11. Laporan & Analitik
12. Broadcast
13. Pengaturan

---

## 🤖 Fitur AI (Opsional)

Untuk mengaktifkan fitur AI, tambahkan OpenAI API Key:

```bash
# .env.local
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
```

**Fitur AI yang tersedia:**
- 🧠 Auto-fill Form SOAP berdasarkan keluhan
- 🚑 Saran triase IGD dengan AI
- 💊 Pemeriksaan interaksi obat
- 📊 Analisis data kesehatan natural language
- 📅 Penjadwalan shift otomatis
- 🔬 Analisis hasil laboratorium

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router v7
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: localStorage (Mock Database)
- **AI**: OpenAI GPT-4 (Optional)
- **Deployment**: Netlify

---

## 📁 Struktur Kode

```
src/
├── contexts/
│   ├── AuthContext.js          # 3-role management
│   └── AppContext.js           # Global state
├── components/
│   ├── common/
│   │   └── Layout.js           # Dynamic menu per role
│   └── dashboard/
│       ├── DashboardPuskesau.js   # Supervision dashboard
│       └── DashboardFaskes.js     # RSAU/FKTP dashboard
├── pages/
│   └── HomePage.js             # Dashboard router
└── mockDb.js                   # Mock database with all facilities
```

---

## 🎨 Screenshots

### Dashboard Puskesau
- Overview semua RSAU dan FKTP
- Statistik agregat nasional
- Akses langsung ke sistem

### Dashboard RSAU (SIMRS)
- Quick access modul utama
- Statistik operasional
- Notifikasi penting

### Dashboard FKTP (SIM Klinik)
- Quick access modul klinik
- Statistik harian
- Task management

---

## 📖 Dokumentasi Lengkap

- **[SISTEM_3_KOMPONEN.md](./SISTEM_3_KOMPONEN.md)** - Dokumentasi user lengkap
- **[TECHNICAL_IMPLEMENTATION.md](./TECHNICAL_IMPLEMENTATION.md)** - Dokumentasi teknis developer
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Struktur project
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Panduan getting started

---

## 🔒 Security & Limitations

### ⚠️ Important Notes
1. **No Backend**: Semua data di localStorage browser
2. **No Authentication**: Mock authentication only
3. **No Data Persistence**: Data hilang saat clear cache
4. **Demo Purpose**: Hanya untuk demo/testing
5. **Not Production Ready**: Butuh backend real untuk production

### 🚀 For Production Use
Implement:
- Backend API (Node.js/Python)
- Real Database (PostgreSQL/MongoDB)
- User Authentication (JWT/OAuth)
- Role-based Permissions
- Data Encryption
- Audit Logging
- HTTPS/SSL

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📝 License

[Your License Here]

---

## 👥 Team & Support

**Developed for**: TNI Angkatan Udara
**Version**: 1.0.0
**Last Updated**: 2024

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] 3-component architecture
- [x] All RSAU and FKTP data
- [x] Role-based menu system
- [x] Supervision dashboard

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] Real database
- [ ] User management
- [ ] Audit logging

### Phase 3 (Future)
- [ ] Mobile apps
- [ ] BPJS integration
- [ ] SATUSEHAT interoperability
- [ ] Advanced analytics

---

## 📞 Contact

For questions or support, contact the development team.

---

**Made with ❤️ for TNI Angkatan Udara**
