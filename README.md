# Platform Komando dan Kontrol Kesehatan Puskesau

Platform terintegrasi untuk TNI Angkatan Udara yang mengintegrasikan seluruh aspek operasional kesehatan dari Pusat hingga Faskes (Rumah Sakit dan Klinik).

⚠️ **PERHATIAN**: Aplikasi ini adalah **DEMO TANPA BACKEND**. Semua data disimpan di browser menggunakan localStorage. Data akan hilang jika browser cache dibersihkan.

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

### Fitur AI (Opsional)
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
- (Opsional) API Key OpenAI - untuk fitur AI

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

3. (Opsional) Setup AI Features:
```bash
cp .env.example .env
```

Edit `.env` dan isi dengan API Key OpenAI jika ingin menggunakan fitur AI:
```
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

4. Jalankan development server:
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
5. (Opsional) Tambahkan `REACT_APP_OPENAI_API_KEY` di Netlify:
   - Settings → Build & deploy → Environment
6. Deploy!

### Deploy Manual

```bash
npm run build
netlify deploy --prod
```

## 💾 Penyimpanan Data

Aplikasi ini **TIDAK menggunakan backend atau database eksternal**. Semua data disimpan di browser menggunakan `localStorage`:

- Data akan tetap ada selama browser tidak membersihkan cache
- Data bersifat lokal untuk setiap browser/device
- Cocok untuk demo dan testing
- **TIDAK untuk production** - data tidak persistent dan tidak terbackup

### Sample Data
Aplikasi sudah dilengkapi dengan sample data:
- 3 Faskes (RSAU Jakarta, Bandung, dan Klinik Halim)
- 3 Pasien sample
- Data akan otomatis ter-load saat pertama kali membuka aplikasi

### Reset Data
Untuk reset semua data, buka browser console dan jalankan:
```javascript
localStorage.clear()
```
Kemudian refresh halaman.

## 🎨 Kustomisasi

### Whitelabel Branding
Ubah logo dan warna di halaman Settings untuk menyesuaikan tampilan aplikasi.

### Role Management
Dua role utama:
- **PUSAT**: Akses penuh monitoring dan analitik seluruh Faskes
- **FASKES**: Akses operasional untuk Faskes tertentu

Switch role di header aplikasi untuk melihat tampilan yang berbeda.

## 🔧 Teknologi

- **Frontend**: React.js 19
- **Routing**: React Router v7
- **Storage**: localStorage (Mock Database)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API (opsional)
- **Hosting**: Netlify

## 📝 Catatan Pengembangan

Aplikasi ini adalah versi MVP dengan modul-modul utama yang sudah berfungsi:
- ✅ Dashboard Pusat & Faskes
- ✅ Pendaftaran & Antrean Real-time
- ✅ Rekam Medis dengan AI
- ✅ IGD Triase dengan AI

Modul lainnya masih dalam tahap pengembangan dan menampilkan placeholder.

### Mengintegrasikan Backend
Untuk mengintegrasikan dengan backend real:
1. Replace `src/mockDb.js` dengan API calls ke backend Anda
2. Update semua import dari `mockDb` ke service API baru
3. Implementasikan authentication dengan backend

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
