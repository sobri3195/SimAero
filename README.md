# Platform Komando dan Kontrol Kesehatan Puskesau

Platform terintegrasi untuk TNI Angkatan Udara yang mengintegrasikan seluruh aspek operasional kesehatan dari Pusat hingga Faskes (Rumah Sakit dan Klinik) dengan teknologi real-time Firebase Firestore.

## 🎯 Fitur Utama

### Dashboard Komando Terintegrasi
- **Dashboard Pusat**: Monitoring agregat dari seluruh Faskes dengan statistik real-time, status kesiapan RS, analitik SDM & logistik
- **Dashboard Faskes**: Operasional harian dengan akses cepat ke modul penting dan notifikasi tugas

### Modul Kesehatan
- ✅ **Database Pasien Terpusat**: Pencarian dan manajemen data pasien
- ✅ **Pendaftaran & Antrean**: Sistem antrean real-time dengan integrasi NIK dan scan KTP
- ✅ **Rekam Medis Elektronik (EHR)**: Form SOAP dengan AI Assistant untuk pengisian otomatis
- ✅ **IGD**: Papan triase digital dengan saran AI dan manajemen pasien drag-and-drop
- 🚧 **Rawat Inap**: Peta visual tempat tidur dan manajemen pasien inap
- 🚧 **Jadwal Operasi**: Penjadwalan dan monitoring operasi
- 🚧 **CSSD**: Pelacakan siklus sterilisasi instrumen
- 🚧 **Bank Darah**: Monitoring stok dan transaksi darah
- 🚧 **Rikkes**: Pemeriksaan kesehatan dengan odontogram interaktif
- 🚧 **Farmasi**: Inventaris, resep elektronik, dan pemeriksaan interaksi obat AI
- 🚧 **Laboratorium**: Manajemen order dan input hasil
- 🚧 **Radiologi**: Analisis gambar dengan AI

### Fitur AI
- 🤖 Pengisian otomatis Form SOAP berdasarkan keluhan
- 🤖 Saran triase IGD berdasarkan keluhan dan vital signs
- 🤖 Rekomendasi tempat tidur untuk rawat inap
- 🤖 Pemeriksaan interaksi obat
- 🤖 Analisis gambar radiologi
- 🤖 Penjadwalan shift otomatis
- 🤖 Analisis data kesehatan natural language

### Manajemen
- 🚧 **SDM & Penjadwalan**: Penjadwalan shift dengan AI
- 🚧 **Aset & Kalibrasi**: Pelacakan aset medis dan jadwal pemeliharaan
- 🚧 **Logistik**: Pengadaan dan distribusi antar Faskes
- 🚧 **Laporan Insiden**: Pelaporan dan pelacakan insiden
- 🚧 **Laporan & Analitik**: Dashboard analitik dengan AI
- 🚧 **Bridging**: Integrasi BPJS VClaim dan SATUSEHAT
- 🚧 **Broadcast**: Pengumuman ke seluruh Faskes
- 🚧 **Pengaturan**: Whitelabel branding dan manajemen user

## 🚀 Setup dan Instalasi

### Prerequisites
- Node.js v18 atau lebih tinggi
- Firebase Project dengan Firestore
- API Key OpenAI (untuk fitur AI)

### Instalasi Lokal

1. Clone repository:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Setup Firebase:
   - Buat project baru di [Firebase Console](https://console.firebase.google.com)
   - Aktifkan Firestore Database
   - Aktifkan Authentication (Email/Password)
   - Aktifkan Storage
   - Copy konfigurasi Firebase

4. Setup Environment Variables:
```bash
cp .env.example .env
```

Edit `.env` dan isi dengan kredensial Firebase dan OpenAI:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

5. Jalankan development server:
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🌐 Deploy ke Netlify

### Deploy Otomatis (Recommended)

1. Push repository ke GitHub
2. Login ke [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Pilih repository
5. Tambahkan environment variables di Netlify:
   - Settings → Build & deploy → Environment
   - Tambahkan semua variabel dari `.env`
6. Deploy!

### Deploy Manual

```bash
npm run build
netlify deploy --prod
```

## 📊 Struktur Database Firestore

### Collections:
- `patients`: Data pasien
- `faskes`: Data fasilitas kesehatan
- `registrations`: Pendaftaran dan antrean
- `medical_records`: Rekam medis SOAP
- `igd_patients`: Pasien IGD dengan triase
- `inpatient_beds`: Data tempat tidur rawat inap
- `surgeries`: Jadwal operasi
- `blood_bank`: Stok darah
- `pharmacy_inventory`: Inventaris farmasi
- `prescriptions`: Resep obat
- `lab_orders`: Order laboratorium
- `radiology_orders`: Order radiologi
- `staff`: Data pegawai
- `schedules`: Jadwal shift
- `assets`: Aset medis
- `logistics`: Order logistik
- `incidents`: Laporan insiden

## 🎨 Kustomisasi

### Whitelabel Branding
Ubah logo dan warna di halaman Settings untuk menyesuaikan tampilan aplikasi.

### Role Management
Dua role utama:
- **PUSAT**: Akses penuh monitoring dan analitik seluruh Faskes
- **FASKES**: Akses operasional untuk Faskes tertentu

Switch role di header aplikasi untuk melihat tampilan yang berbeda.

## 🔧 Teknologi

- **Frontend**: React.js
- **Routing**: React Router v6
- **Database**: Firebase Firestore (Real-time)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4 API
- **Hosting**: Netlify

## 📝 Catatan Pengembangan

Aplikasi ini adalah versi MVP dengan modul-modul utama yang sudah berfungsi:
- ✅ Dashboard Pusat & Faskes
- ✅ Pendaftaran & Antrean Real-time
- ✅ Rekam Medis dengan AI
- ✅ IGD Triase dengan AI

Modul lainnya masih dalam tahap pengembangan dan menampilkan placeholder.

## 🤝 Kontribusi

Untuk menambahkan fitur atau modul baru:
1. Buat component di folder `src/components/{module}/`
2. Buat page di folder `src/pages/`
3. Tambahkan route di `src/App.js`
4. Update menu di `src/components/common/Layout.js`

## 📄 Lisensi

Internal TNI Angkatan Udara

## 📞 Kontak

Untuk pertanyaan dan dukungan, hubungi tim Puskesau.
