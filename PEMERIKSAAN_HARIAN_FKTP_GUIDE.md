# Panduan Modul Pemeriksaan Harian Pasien FKTP

## Deskripsi
Modul Pemeriksaan Harian Pasien adalah fitur khusus untuk FKTP (Fasilitas Kesehatan Tingkat Pertama) yang memungkinkan petugas medis untuk melakukan pemeriksaan pasien dari pendaftaran hingga penyelesaian pelayanan. Modul ini mencakup pencatatan keluhan, pemeriksaan fisik dasar, diagnosis, tindakan medis sederhana, dan resep obat.

## Fitur Utama

### 1. **Daftar Pemeriksaan Hari Ini**
Halaman utama yang menampilkan semua pasien yang telah mendaftar pada hari ini.

**Fitur:**
- **Summary Cards**: Menampilkan statistik
  - Total Pasien: Jumlah pasien yang mendaftar hari ini
  - Belum Diperiksa: Pasien yang menunggu untuk diperiksa
  - Selesai: Pasien yang sudah selesai diperiksa
  
- **Filter Tabs**: Memfilter pasien berdasarkan status
  - Semua: Menampilkan semua pasien
  - Belum Diperiksa: Hanya pasien yang belum diperiksa
  - Selesai: Hanya pasien yang sudah selesai diperiksa

- **Patient Cards**: Menampilkan informasi pasien
  - Nomor antrean
  - Nama pasien dan NIK/NRP
  - Jenis kelamin dan umur
  - Poli tujuan
  - Waktu pendaftaran
  - Status pemeriksaan (Belum Diperiksa / Sedang Diperiksa / Selesai)
  - Tombol aksi (Periksa / Lanjutkan / Lihat Detail)

### 2. **Form Pemeriksaan Pasien**
Form lengkap untuk mencatat hasil pemeriksaan pasien.

#### A. **Keluhan Utama** (Wajib)
- Subjective: Keluhan yang disampaikan pasien
- Riwayat penyakit sebelumnya, alergi, dll

#### B. **Pemeriksaan Fisik & Vital Signs**
- **Tekanan Darah**: Format 120/80 mmHg
- **Nadi**: Denyut nadi per menit
- **Suhu**: Suhu tubuh dalam Celsius
- **Respirasi**: Frekuensi napas per menit
- **Berat Badan**: Dalam kilogram
- **Tinggi Badan**: Dalam sentimeter
- **Lingkar Perut**: Dalam sentimeter
- **Pemeriksaan Lain**: Hasil pemeriksaan fisik lainnya (kepala, leher, thorax, abdomen, ekstremitas)

#### C. **Diagnosis** (Wajib)
- **Diagnosis Utama**: Diagnosis penyakit pasien
- **Kode ICD-10**: Kode diagnosis (opsional)

#### D. **Tindakan Medis**
Pencatatan tindakan medis yang dilakukan:
- Nama tindakan
- Keterangan tambahan
- Dapat menambah multiple tindakan

#### E. **Resep Obat**
Pencatatan resep obat untuk pasien:
- Nama obat
- Dosis (mg)
- Jumlah
- Aturan pakai (contoh: 3x1 sehari)
- Dapat menambah multiple obat

#### F. **Rujukan**
Jika pasien perlu dirujuk ke fasilitas kesehatan lain:
- Checkbox "Perlu Rujukan"
- Tujuan rujukan (RSAU atau faskes lain)
- Alasan rujukan
- Diagnosa rujukan

#### G. **Catatan & Petugas**
- Catatan tambahan untuk rekam medis
- Nama dokter/petugas yang memeriksa (wajib)
- Pencatat (auto-filled dari user login)

### 3. **Riwayat Pemeriksaan**
Melihat riwayat pemeriksaan pasien yang sudah dilakukan.

**Fitur:**
- **Filter & Pencarian**:
  - Search box: Cari berdasarkan nama pasien, diagnosis, atau keluhan
  - Filter periode: Semua Waktu / Hari Ini / 7 Hari Terakhir / 30 Hari Terakhir

- **Statistics Cards**: Menampilkan ringkasan
  - Total Pemeriksaan
  - Jumlah Rujukan
  - Total Tindakan Medis
  - Total Resep Obat

- **Expandable Rows**: Klik untuk melihat detail pemeriksaan
  - Riwayat penyakit
  - Vital signs lengkap
  - Tindakan medis yang dilakukan
  - Resep obat yang diberikan
  - Rujukan (jika ada)
  - Catatan tambahan
  - Petugas yang memeriksa

### 4. **Cetak Ringkasan Laporan**
Mencetak laporan pemeriksaan untuk laporan bulanan ke Dinas Kesehatan TNI AU.

**Fitur:**
- **Pilih Periode**: 
  - Tanggal mulai
  - Tanggal akhir
  - Tombol "Muat Data"

- **Preview Laporan**:
  - Jumlah total pemeriksaan
  - Periode laporan

- **Export Options**:
  - **Download PDF**: Download laporan dalam format PDF
  - **Print Langsung**: Print laporan langsung ke printer

**Konten Laporan PDF**:
- Header: Nama FKTP dan periode
- Tabel lengkap dengan kolom:
  - No
  - Tanggal & Jam pemeriksaan
  - Nama Pasien
  - Poli
  - Keluhan
  - Vital Signs (TD, Nadi, Suhu)
  - Diagnosis
  - Tindakan Medis
  - Obat yang diberikan
  - Rujukan
  - Dokter
- Ringkasan statistik:
  - Total pemeriksaan
  - Total rujukan
  - Distribusi per poli
- Footer: Waktu cetak dan nomor halaman

## Alur Penggunaan

### Skenario 1: Pemeriksaan Pasien Baru
1. Buka menu **"Pemeriksaan Harian"** dari sidebar
2. Di tab **"Daftar Pemeriksaan Hari Ini"**, lihat daftar pasien yang sudah mendaftar
3. Klik tombol **"Periksa"** pada kartu pasien yang ingin diperiksa
4. Isi form pemeriksaan:
   - Keluhan utama (wajib)
   - Vital signs dan pemeriksaan fisik
   - Diagnosis (wajib)
   - Tindakan medis (jika ada)
   - Resep obat (jika ada)
   - Rujukan (jika diperlukan)
   - Nama dokter/petugas (wajib)
5. Klik **"Simpan Pemeriksaan"**
6. Pasien akan otomatis berstatus "Selesai"

### Skenario 2: Melihat Riwayat Pemeriksaan
1. Buka menu **"Pemeriksaan Harian"**
2. Pilih tab **"Riwayat Pemeriksaan"**
3. Gunakan filter periode atau search box untuk mencari pemeriksaan
4. Klik pada baris pemeriksaan untuk melihat detail lengkap
5. Detail akan expand menampilkan semua informasi pemeriksaan

### Skenario 3: Cetak Laporan Bulanan
1. Buka menu **"Pemeriksaan Harian"**
2. Pilih tab **"Cetak Ringkasan"**
3. Pilih periode laporan:
   - Untuk laporan bulanan: pilih tanggal 1 - 31 bulan yang diinginkan
   - Untuk laporan harian: pilih tanggal yang sama untuk mulai dan akhir
4. Klik **"Muat Data"**
5. Review preview laporan
6. Pilih salah satu:
   - **Download PDF**: Untuk menyimpan file PDF
   - **Print Langsung**: Untuk langsung print

## Status Pemeriksaan

| Status | Deskripsi | Warna Badge |
|--------|-----------|-------------|
| **Belum Diperiksa** | Pasien sudah mendaftar tapi belum diperiksa | Kuning |
| **Sedang Diperiksa** | Pemeriksaan sedang berlangsung (form sudah dibuka) | Biru |
| **Selesai** | Pemeriksaan sudah selesai dan tersimpan | Hijau |

## Data yang Tersimpan

Semua data pemeriksaan disimpan dalam collection `daily_examinations` dengan struktur:
- **ID Pemeriksaan**: Auto-generated unique ID
- **Data Pasien**: ID, nama, registrationId
- **Tanggal & Waktu**: Tanggal pemeriksaan, waktu mulai, waktu selesai
- **Keluhan & Riwayat**: Keluhan utama, riwayat penyakit
- **Pemeriksaan Fisik**: Object dengan vital signs lengkap
- **Diagnosis**: Diagnosis utama dan kode ICD-10
- **Tindakan Medis**: Array of tindakan
- **Resep Obat**: Array of obat
- **Rujukan**: Object dengan info rujukan
- **Petugas**: Nama dokter dan pencatat
- **Status**: Status pemeriksaan (completed)
- **FaskesId**: ID FKTP (untuk filter per faskes)

## Integrasi dengan Modul Lain

### 1. **Integrasi dengan Modul Pendaftaran**
- Data pasien yang sudah mendaftar hari ini otomatis muncul di daftar pemeriksaan
- Nomor antrean dari pendaftaran ditampilkan
- Data identitas pasien (NIK/NRP, nama, umur, poli) otomatis ter-populate

### 2. **Integrasi dengan Rekam Medis (EHR)**
- Hasil pemeriksaan dapat diintegrasikan ke modul EHR untuk riwayat medis lengkap
- Data pemeriksaan fisik dan diagnosis tersimpan dalam database yang sama

### 3. **Integrasi dengan Farmasi**
- Resep obat yang dibuat dapat diteruskan ke modul farmasi
- Data obat dapat di-link dengan inventory farmasi

### 4. **Integrasi dengan Billing**
- Tindakan medis yang dicatat dapat digunakan untuk billing
- Data pemeriksaan dapat di-link dengan sistem pembayaran

## Tips Penggunaan

### Untuk Petugas Medis:
1. **Kelengkapan Data**: Pastikan mengisi keluhan dan diagnosis (wajib) serta vital signs untuk dokumentasi lengkap
2. **Tindakan Medis**: Catat semua tindakan yang dilakukan untuk keperluan billing dan laporan
3. **Resep Obat**: Tuliskan aturan pakai yang jelas agar pasien tidak bingung
4. **Rujukan**: Jika merujuk, tuliskan alasan dan diagnosa rujukan dengan jelas

### Untuk Kepala Klinik:
1. **Monitor Harian**: Gunakan summary cards untuk monitoring cepat jumlah pemeriksaan
2. **Review Riwayat**: Gunakan tab Riwayat untuk review pemeriksaan yang sudah dilakukan
3. **Laporan Bulanan**: Cetak laporan di akhir bulan untuk laporan ke Dinas Kesehatan TNI AU
4. **Quality Control**: Review detail pemeriksaan untuk memastikan kelengkapan dokumentasi

### Untuk Admin:
1. **Backup Data**: Pastikan data pemeriksaan di-backup secara berkala
2. **Filter per Faskes**: Setiap FKTP memiliki data terpisah berdasarkan faskesId
3. **Format Laporan**: Laporan PDF sudah dalam format standar sesuai kebutuhan TNI AU

## Keamanan & Privasi

- **Data Terpisah**: Setiap FKTP memiliki database terpisah (filtered by faskesId)
- **Akses Terbatas**: Hanya user dengan role FKTP yang dapat mengakses modul ini
- **Pencatatan Petugas**: Setiap pemeriksaan tercatat petugas yang melakukan
- **Timestamp**: Waktu pemeriksaan terekam untuk audit trail

## FAQ

**Q: Apakah bisa mengedit pemeriksaan yang sudah selesai?**
A: Saat ini belum ada fitur edit untuk pemeriksaan yang sudah completed. Jika ada kesalahan, bisa dicatat di catatan tambahan atau buat pemeriksaan follow-up.

**Q: Bagaimana jika pasien datang tanpa pendaftaran?**
A: Pasien harus melalui proses pendaftaran terlebih dahulu di modul "Pendaftaran & Antrean". Setelah terdaftar, baru akan muncul di daftar pemeriksaan.

**Q: Apakah resep obat otomatis masuk ke farmasi?**
A: Data resep tersimpan dalam pemeriksaan. Untuk integrasi penuh dengan farmasi, bisa dikembangkan fitur tambahan untuk auto-create prescription di modul farmasi.

**Q: Format laporan PDF bisa diubah?**
A: Ya, format laporan bisa disesuaikan dengan kebutuhan di file `ExaminationSummaryPrint.js`. Layout, kolom, dan konten dapat dimodifikasi.

**Q: Apakah data pemeriksaan aman?**
A: Data disimpan di localStorage browser untuk demo. Untuk production, harus menggunakan backend dengan database yang aman dan enkripsi.

## Struktur File

```
src/
├── components/
│   └── fktp/
│       ├── DailyExaminationList.js       # Daftar pasien hari ini
│       ├── DailyExaminationForm.js       # Form pemeriksaan lengkap
│       ├── ExaminationHistory.js         # Riwayat pemeriksaan
│       └── ExaminationSummaryPrint.js    # Cetak laporan PDF
├── pages/
│   └── DailyExaminationPage.js           # Main page dengan tabs
└── mockDb.js                              # Database handler (localStorage)
```

## Future Enhancements

1. **Auto-populate dari EHR**: Riwayat penyakit dan alergi auto-populate dari EHR
2. **Template Diagnosis**: Template diagnosis yang sering digunakan untuk input cepat
3. **Voice Input**: Input keluhan menggunakan voice recognition
4. **Photo Attachment**: Upload foto untuk dokumentasi luka atau kondisi fisik
5. **E-Signature**: Tanda tangan digital dokter pada laporan
6. **SMS Notification**: Kirim SMS ke pasien dengan ringkasan pemeriksaan
7. **Integration with Lab**: Request lab test langsung dari form pemeriksaan
8. **Clinical Decision Support**: Rekomendasi diagnosis berdasarkan gejala (AI)
9. **Prescription Integration**: Auto-create prescription di modul farmasi
10. **Billing Auto-calculation**: Auto-calculate biaya berdasarkan tindakan

## Support

Untuk pertanyaan atau dukungan teknis, hubungi:
- Tim IT Puskesau TNI AU
- Developer: Team SIMRS TNI AU

---

**Versi**: 1.0  
**Tanggal**: 2024  
**Modul**: Pemeriksaan Harian Pasien FKTP  
**Platform**: SIM Klinik TNI AU (React.js)
