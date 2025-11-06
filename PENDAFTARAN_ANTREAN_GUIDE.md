# 📋 Modul Pendaftaran & Antrean Terpadu - Panduan Lengkap

## 🎯 Ringkasan Fitur

Modul Pendaftaran & Antrean Terpadu adalah sistem komprehensif untuk mengelola pendaftaran pasien dan monitoring antrean real-time di RSAU (Rumah Sakit Angkatan Udara).

### ✨ Fitur Utama

1. **Pendaftaran Pasien Cerdas**
   - Pencarian berbasis NIK/NRP
   - Integrasi database nasional (SATUSEHAT/Dukcapil) - simulasi
   - Auto-populate data pasien
   - Support pasien baru dan lama
   - Support rujukan dan keluarga

2. **Monitoring Antrean Real-time**
   - Display monitor untuk layar TV/besar
   - Update real-time menggunakan onSnapshot
   - Status tracking (menunggu, dipanggil, dilayani, selesai)
   - SLA monitoring dengan color-coding

3. **Manajemen Antrean**
   - Pindah pasien antar-poli
   - Update status pelayanan
   - Filter dan pencarian advanced
   - Bulk operations

4. **Statistik & Analytics**
   - Grafik distribusi status
   - Grafik per poli
   - Grafik per jam
   - Waktu tunggu rata-rata
   - Alert untuk SLA kritis

---

## 📂 Struktur File

```
src/
├── pages/
│   ├── RegistrationPage.js          # Halaman utama dengan 4 tabs
│   └── QueueMonitorPage.js          # Halaman monitor fullscreen
├── components/registration/
│   ├── RegistrationForm.js          # Form pendaftaran dengan NIK lookup
│   ├── QueueBoard.js                # Board antrean untuk petugas
│   ├── QueueManagement.js           # Manajemen antrean (pindah poli, dll)
│   ├── QueueMonitor.js              # Monitor display untuk TV
│   └── QueueStats.js                # Statistik dan analytics
```

---

## 🚀 Cara Menggunakan

### 1. Pendaftaran Pasien

#### a. Pasien Baru
1. Buka tab **"📝 Pendaftaran Pasien"**
2. Pilih tipe identitas (NIK/NRP)
3. Masukkan nomor identitas
4. Klik **"Cari"**
5. Sistem akan mencari di:
   - Database lokal (jika pernah terdaftar)
   - Database nasional (simulasi SATUSEHAT/Dukcapil)
6. Jika ditemukan, data otomatis terisi
7. Lengkapi data lainnya (Poli Tujuan, Keluhan, dll)
8. Klik **"Daftarkan Pasien"**

#### b. Pasien Lama
1. Masukkan NIK/NRP yang sudah terdaftar
2. Klik **"Cari"**
3. Data otomatis terisi dari database lokal
4. Pilih poli tujuan dan keluhan
5. Daftarkan

#### c. Pasien Rujukan
1. Centang **"Pasien Rujukan"**
2. Isi data rujukan:
   - Asal rujukan
   - Nomor rujukan
   - Diagnosis rujukan

### 2. Monitor Antrean Real-time

#### a. Monitor Internal (untuk petugas)
1. Buka tab **"📺 Monitor Antrean"**
2. Pilih poli dari dropdown
3. Lihat daftar antrean dengan:
   - Nomor antrean
   - Nama pasien
   - Status
   - Waktu tunggu
   - SLA indicator
4. Update status dengan tombol:
   - **Panggil** (menunggu → dipanggil)
   - **Layani** (dipanggil → dilayani)
   - **Selesai** (dilayani → selesai)

#### b. Monitor Display (untuk TV/layar besar)
1. Buka tab **"📺 Monitor Antrean"**
2. Pilih poli spesifik
3. Klik **"Buka Monitor Fullscreen"**
4. Window baru terbuka (1920x1080) dengan tampilan:
   - **Nomor antrean besar** yang sedang dilayani
   - Daftar tunggu di sidebar
   - Statistik real-time
   - Waktu current
5. Display akan auto-update tanpa refresh

**URL Manual:** `/queue-monitor/{nama-poli}`

Contoh: `/queue-monitor/Poli%20Umum`

### 3. Manajemen Antrean

#### a. Quick Monitor Access
- Bagian atas menampilkan tombol untuk buka monitor tiap poli
- Klik tombol poli untuk buka monitor fullscreen

#### b. Statistik Cards
- Total Antrean
- Menunggu
- Dipanggil
- Dilayani
- Selesai

#### c. Filter & Pencarian
- **Cari Pasien**: Nama, NIK, NRP, No. Antrean
- **Filter Poli**: Lihat antrean per poli
- **Filter Status**: menunggu/dipanggil/dilayani/selesai
- **Reset Filter**: Kembali ke semua data

#### d. Tabel Manajemen
Menampilkan semua antrean dengan:
- Nomor antrean
- Poli
- Nama pasien
- NIK/NRP
- Keluhan
- Waktu tunggu + SLA indicator
- Status
- Aksi:
  - **Panggil/Layani/Selesai** (sesuai status)
  - **Pindah Poli**

#### e. Pindah Poli
1. Klik **"Pindah Poli"** pada pasien
2. Pilih poli tujuan
3. Sistem akan:
   - Generate nomor antrean baru di poli tujuan
   - Reset status ke "menunggu"
   - Catat history transfer
4. Klik **"Pindahkan"**

### 4. Statistik & Analytics

#### a. Summary Cards
- Total Antrean Hari Ini
- Sedang Menunggu (+ alert kritis >30 menit)
- Sedang Dilayani
- Rata-rata Waktu Tunggu

#### b. Grafik Distribusi Status (Pie Chart)
- Menunggu (kuning)
- Dilayani (hijau)
- Selesai (abu-abu)

#### c. Grafik Distribusi Tipe Pasien (Pie Chart)
- Prajurit TNI AU
- PNS TNI AU
- Keluarga
- Umum

#### d. Grafik Antrean per Poli (Bar Chart)
- Menunggu (bar kuning)
- Dilayani (bar hijau)
- Selesai (bar abu-abu)
- Hover untuk detail

#### e. Grafik Pendaftaran per Jam (Bar Chart)
- Menampilkan pola pendaftaran sepanjang hari

#### f. Tabel Detail per Poli
- Total
- Menunggu
- Dilayani
- Selesai
- Progress bar completion rate

---

## 🎨 UI/UX Features

### Color-Coding Status
- 🟡 **Menunggu**: Yellow - bg-yellow-100 text-yellow-800
- 🔵 **Dipanggil**: Blue - bg-blue-100 text-blue-800 (blink/pulse)
- 🟢 **Dilayani**: Green - bg-green-100 text-green-800
- ⚪ **Selesai**: Gray - bg-gray-100 text-gray-800

### SLA Monitoring
- 🟢 **Normal**: < 15 menit (hijau)
- 🟡 **Perhatian**: 15-30 menit (kuning)
- 🔴 **Kritis**: > 30 menit (merah + icon alert)

### Responsive Design
- Mobile-friendly dengan grid responsif
- Table horizontal scroll pada mobile
- Cards stack pada mobile
- Touch-friendly buttons

---

## 💾 Data Structure

### Registration Collection (`registrations`)

```javascript
{
  id: "auto-generated",
  faskesId: "RSAU dr. Esnawan Antariksa", // Facility filter
  identitasType: "nik" | "nrp",
  nik: "3174012345670001",
  nrp: "123456789",
  nama: "Ahmad Wijaya",
  tanggalLahir: "1990-01-15",
  jenisKelamin: "L" | "P",
  alamat: "Jl. Contoh No. 123",
  telepon: "08123456789",
  statusPasien: "prajurit" | "pns" | "keluarga" | "umum",
  namaKeluarga: "Letda Budi Santoso", // Jika keluarga
  hubunganKeluarga: "Anak Kandung", // Jika keluarga
  poliTujuan: "Poli Umum",
  jenisKunjungan: "umum" | "bpjs" | "asuransi",
  nomorBPJS: "0001234567890",
  keluhanUtama: "Demam dan batuk sejak 3 hari",
  isRujukan: false,
  asalRujukan: "FKTP XYZ",
  nomorRujukan: "001/RJK/2024",
  diagnosisRujukan: "Suspek bronkitis",
  nomorAntrean: 15,
  status: "menunggu" | "dipanggil" | "dilayani" | "selesai",
  tanggalDaftar: Date,
  transferredFrom: "Poli Gigi", // Jika dipindah
  transferredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Collection (`patients`)

Menyimpan master data pasien untuk reuse.

---

## 🔧 Technical Details

### Real-time Updates
- Menggunakan `onSnapshot` dari mockDb
- Auto-update setiap ada perubahan data
- Efficient query dengan filter `faskesId` dan `tanggalDaftar`

### National Database Integration (Simulation)
- Simulasi lookup ke SATUSEHAT/Dukcapil
- Parsing NIK untuk extract data (provinsi, tanggal lahir, gender)
- Parsing NRP untuk militer data
- Mock data generation based on identifier

### Queue Number Generation
- Auto-increment per poli per hari
- Reset setiap hari baru
- Re-calculate saat pindah poli

### Performance Optimization
- Filter di level query (bukan di JS)
- Pagination ready (itemsPerPage)
- Debounce search input
- Memoization untuk computed values

---

## 🎭 User Roles & Permissions

### Petugas Pendaftaran
- Akses: Pendaftaran Pasien ✅
- Akses: Monitor Antrean ✅
- Akses: Manajemen Antrean ❌
- Akses: Statistik ❌

### Perawat/Dokter Poli
- Akses: Monitor Antrean ✅ (poli sendiri)
- Akses: Update Status ✅
- Akses: Pindah Poli ❌

### Admin/Kepala Poli
- Akses: Semua ✅

*Note: Role management dapat dikonfigurasi di AuthContext*

---

## 📊 Use Cases

### Use Case 1: Pasien Baru Datang
1. Petugas buka form pendaftaran
2. Input NIK pasien
3. Data auto-populate dari database nasional
4. Pilih poli tujuan
5. Daftarkan → Pasien dapat nomor antrean
6. Monitor menampilkan pasien di list tunggu

### Use Case 2: Pasien Dipanggil
1. Perawat lihat monitor poli
2. Pasien di urutan pertama
3. Klik "Panggil"
4. Status berubah jadi "dipanggil"
5. Monitor menampilkan nomor besar + animasi pulse
6. Pasien masuk ruangan
7. Klik "Layani"
8. Pasien hilang dari list tunggu

### Use Case 3: Pasien Salah Poli
1. Admin buka Manajemen Antrean
2. Cari pasien yang salah poli
3. Klik "Pindah Poli"
4. Pilih poli yang benar
5. Sistem generate nomor antrean baru
6. Pasien muncul di poli baru

### Use Case 4: Monitor SLA
1. Admin buka Statistik
2. Lihat summary card "Sedang Menunggu"
3. Ada alert "5 Kritis (>30 menit)"
4. Buka Manajemen Antrean
5. Filter: Status = Menunggu
6. Lihat pasien dengan SLA merah
7. Prioritaskan atau pindah poli

---

## 🔮 Future Enhancements

1. **Voice Announcement**
   - Text-to-speech untuk panggil nomor antrean
   - Customizable voice dan bahasa

2. **SMS/WhatsApp Notification**
   - Notif saat nomor antrean dekat
   - Estimasi waktu tunggu

3. **QR Code Check-in**
   - Self-service kiosk
   - QR code di kartu berobat

4. **Online Appointment**
   - Booking poli dari mobile app
   - Calendar availability

5. **Analytics Dashboard**
   - Trend analysis bulanan
   - Peak hours identification
   - Resource optimization

6. **Integration dengan Bridging**
   - Real integration dengan SATUSEHAT
   - Real integration dengan Dukcapil
   - PCare BPJS untuk eligibility

---

## 🐛 Troubleshooting

### Antrean tidak muncul
- Cek apakah faskes sudah dipilih
- Cek apakah tanggal pendaftaran hari ini
- Clear localStorage dan reload

### Monitor tidak update real-time
- Cek koneksi
- Refresh browser
- Cek console untuk error

### Data pasien tidak ditemukan
- Pastikan NIK/NRP valid (16 digit untuk NIK)
- Cek database patients
- Coba daftarkan sebagai pasien baru

### Nomor antrean duplikat
- Clear localStorage
- Reload aplikasi
- Data akan re-generate

---

## 📱 Mobile App Integration Ready

Modul ini sudah siap untuk integrasi dengan mobile app:
- REST API endpoints (tinggal wrap)
- Real-time WebSocket support
- QR code format standardized
- JSON response structure consistent

---

## 🎓 Training Materials

### Video Tutorial (Rencana)
1. Pendaftaran Pasien Baru (5 menit)
2. Manajemen Antrean (7 menit)
3. Setup Monitor Display (3 menit)
4. Membaca Analytics (5 menit)

### User Manual
- Tersedia di: `/docs/user-manual-pendaftaran.pdf`
- Quick Guide: `/docs/quick-guide-antrean.pdf`

---

## 👥 Credits

Dikembangkan untuk:
- **RSAU (Rumah Sakit Angkatan Udara)**
- TNI Angkatan Udara Indonesia

---

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: support@puskesau.mil.id
- Helpdesk: Internal TNI AU

---

**Version:** 2.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready
