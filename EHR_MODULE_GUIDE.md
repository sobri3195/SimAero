# Panduan Lengkap Modul Rekam Medis Elektronik (EHR)

## Gambaran Umum

Modul EHR (Electronic Health Record) adalah sistem pencatatan rekam medis elektronik yang lengkap dengan format SOAP (Subjective, Objective, Assessment, Planning). Sistem ini dirancang khusus untuk fasilitas kesehatan TNI Angkatan Udara (RSAU dan FKTP).

## Fitur Utama

### 1. **Pencatatan SOAP Note**
- Format standar SOAP (Subjective, Objective, Assessment, Planning)
- Tanda vital lengkap (Tekanan Darah, Nadi, Suhu, Respirasi, BB, TB)
- Jenis kunjungan (Reguler, Kontrol, Darurat, Pemeriksaan Berkala)
- Resep obat
- Catatan tambahan
- Integrasi AI untuk auto-fill (opsional)

### 2. **Manajemen Riwayat Penyakit Kronis & Alergi**
- Pencatatan penyakit kronis dengan kode ICD-10
- Status penyakit (Aktif, Terkontrol, Sembuh)
- Pencatatan alergi (Obat, Makanan, Lingkungan, Lainnya)
- Tingkat keparahan alergi (Ringan, Sedang, Berat)
- **Alert otomatis** saat pasien dibuka (alergi ditampilkan dengan warna merah mencolok)

### 3. **Riwayat Kunjungan Lengkap**
- Timeline kunjungan pasien
- Detail lengkap setiap kunjungan (SOAP, tanda vital, resep)
- Expandable view untuk detail
- Filter berdasarkan tanggal
- Real-time updates

### 4. **Cetak & Export Ringkasan Medis**
- Export ke PDF format resmi
- Print langsung dari browser
- Filter berdasarkan periode waktu
- Includes: Identitas, Alergi, Penyakit Kronis, Riwayat Kunjungan
- Format profesional dengan header faskes

## Struktur Komponen

```
src/
├── pages/
│   └── EHRPage.js                    # Halaman utama dengan tab navigation
├── components/ehr/
│   ├── SOAPForm.js                   # Form SOAP dengan alert alergi/kronis
│   ├── ChronicDiseaseManager.js      # Manajemen penyakit kronis & alergi
│   ├── MedicalHistory.js             # Timeline riwayat kunjungan
│   └── MedicalRecordPrint.js         # Print/Export ringkasan medis
```

## Cara Penggunaan

### A. Membuka Rekam Medis Pasien

1. **Akses Halaman EHR**
   - Dari menu utama, klik "EHR" atau navigasi ke `/ehr`

2. **Pilih Pasien**
   - Gunakan search bar untuk mencari pasien (nama, NIK, NRP)
   - Klik pada kartu pasien untuk membuka rekam medis

3. **Navigasi Tab**
   - **SOAP Note**: Form pencatatan kunjungan
   - **Riwayat Kronis & Alergi**: Manajemen kondisi kronis
   - **Riwayat Kunjungan**: Timeline kunjungan lengkap
   - **Cetak Ringkasan**: Export dan print

### B. Pencatatan Kunjungan (SOAP Note)

1. **Alert Otomatis**
   - Jika pasien memiliki **alergi**, akan muncul alert merah di bagian atas
   - Jika pasien memiliki **penyakit kronis aktif**, akan ditampilkan di badge kuning

2. **Isi Form SOAP**
   - **Jenis Kunjungan**: Pilih tipe kunjungan
   - **Keluhan Utama**: Masukkan keluhan pasien
   - **Tanda Vital**: Isi tekanan darah, nadi, suhu, dll (opsional tapi disarankan)
   - **Subjective (S)**: Anamnesis, keluhan, riwayat penyakit
   - **Objective (O)**: Pemeriksaan fisik, hasil pemeriksaan
   - **Assessment (A)**: Diagnosis dengan kode ICD-10
   - **Plan (P)**: Rencana terapi, tindakan, edukasi
   - **Resep Obat**: Nama obat, dosis, frekuensi (satu per baris)
   - **Catatan Tambahan**: Instruksi khusus (opsional)

3. **Fitur AI (Opsional)**
   - Klik "Isi Seluruh Form dengan AI" untuk auto-fill berdasarkan keluhan
   - Atau klik "Isi dengan AI" per section (S, O, A, P)
   - Memerlukan API Key OpenAI

4. **Simpan Rekam Medis**
   - Klik "Simpan Rekam Medis"
   - Data tersimpan otomatis dengan timestamp

### C. Mengelola Penyakit Kronis & Alergi

#### Menambah Penyakit Kronis

1. Klik tab **"Riwayat Kronis & Alergi"**
2. Di bagian "Riwayat Penyakit Kronis", klik **"Tambah Penyakit"**
3. Isi form:
   - **Nama Penyakit**: Contoh: Diabetes Mellitus, Hipertensi
   - **Kode ICD-10**: Contoh: E11.9, I10
   - **Tanggal Diagnosis**: Kapan pertama kali didiagnosis
   - **Status**: Aktif / Terkontrol / Sembuh
   - **Catatan**: Informasi tambahan (opsional)
4. Klik **"Simpan"**

#### Menambah Alergi

1. Klik tab **"Riwayat Kronis & Alergi"**
2. Di bagian alert merah "Alergi Pasien", klik **"Tambah Alergi"**
3. Isi form:
   - **Alergen**: Nama substansi (Amoxicillin, Udang, Debu, dll)
   - **Tipe Alergi**: Obat / Makanan / Lingkungan / Lainnya
   - **Tingkat Keparahan**: Ringan / Sedang / Berat
   - **Reaksi yang Timbul**: Gatal-gatal, sesak napas, dll
   - **Catatan**: Informasi tambahan (opsional)
4. Klik **"Simpan"**

⚠️ **PENTING**: Alergi akan **otomatis muncul** sebagai alert merah setiap kali dokter membuka SOAP Form pasien tersebut!

#### Edit/Hapus Data

- Klik ikon pensil (✏️) untuk edit
- Klik ikon tempat sampah (🗑️) untuk hapus

### D. Melihat Riwayat Kunjungan

1. Klik tab **"Riwayat Kunjungan"**
2. Lihat timeline kunjungan pasien (terbaru di atas)
3. Klik pada kunjungan untuk expand detail:
   - SOAP lengkap (S, O, A, P)
   - Tanda vital
   - Resep obat
   - Hasil lab (jika ada)
   - Catatan tambahan

### E. Cetak & Export Ringkasan Medis

1. Klik tab **"Cetak Ringkasan"**
2. **Pilih Periode** (opsional):
   - Tanggal Mulai
   - Tanggal Akhir
   - Kosongkan untuk semua riwayat
3. Review preview data yang akan dicetak
4. Pilih metode output:
   - **Download PDF**: Klik "Download PDF" untuk export ke file PDF
   - **Print**: Klik "Print" untuk print langsung

#### Isi Ringkasan Medis

Dokumen akan berisi:
- **Header**: Logo dan nama faskes
- **Data Pasien**: Identitas lengkap
- **⚠️ ALERGI**: Highlighted dengan background merah
- **Penyakit Kronis**: List penyakit dengan status
- **Riwayat Kunjungan**: Detail SOAP semua kunjungan sesuai periode
- **Tanda Tangan**: Tempat untuk TTD dokter

## Keamanan & Privasi

### Alert Sistem Alergi

Sistem dilengkapi dengan **3 tingkat peringatan alergi**:

1. **Level 1 (Alert di Form SOAP)**: 
   - Background merah terang dengan icon ⚠️
   - Font besar dan bold
   - Tidak bisa dilewatkan

2. **Level 2 (Badge di Tab Kronis & Alergi)**:
   - Badge merah pada tab
   - List alergi dengan color-coding severity

3. **Level 3 (Export/Print)**:
   - Highlighted dengan border merah tebal
   - Section terpisah dengan warning icon

### Data Storage

- Data disimpan **per faskes** (RSAU/FKTP)
- Filter otomatis berdasarkan `faskesId`
- Real-time updates menggunakan localStorage
- Tidak ada sharing data antar faskes

## Tips Penggunaan

### Best Practices

1. **Selalu cek alert alergi** sebelum meresepkan obat
2. **Perbarui penyakit kronis** secara berkala (ubah status ke "Terkontrol" jika membaik)
3. **Isi tanda vital** setiap kunjungan untuk tracking
4. **Gunakan kode ICD-10** yang tepat untuk diagnosis
5. **Resep obat**: Tulis dengan format jelas (Nama - Dosis - Frekuensi - Aturan)
6. **Catatan tambahan**: Gunakan untuk instruksi follow-up atau rujukan

### Contoh Format Resep

```
Paracetamol 500mg - 3x1 tablet - Sesudah makan
Amoxicillin 500mg - 3x1 kapsul - Sebelum makan - 5 hari
Vitamin B Complex - 1x1 tablet - Pagi hari
```

### Contoh Diagnosis dengan ICD-10

```
Diabetes Mellitus Tipe 2 (E11.9)
Hipertensi Esensial (I10)
Gastritis Akut (K29.0)
ISPA (J06.9)
```

## Troubleshooting

### Masalah: Alert alergi tidak muncul
- **Solusi**: Pastikan alergi sudah disimpan di tab "Riwayat Kronis & Alergi"
- Refresh halaman atau buka ulang pasien

### Masalah: Data tidak tersimpan
- **Solusi**: Pastikan terkoneksi dengan sistem
- Cek console browser untuk error
- Pastikan field required sudah diisi

### Masalah: PDF tidak ter-download
- **Solusi**: Pastikan browser tidak memblock pop-up
- Coba gunakan Print jika PDF gagal
- Check browser compatibility (Chrome/Firefox recommended)

### Masalah: Riwayat kunjungan tidak muncul
- **Solusi**: Pastikan filter tanggal sudah benar
- Cek apakah kunjungan sudah disimpan di SOAP Form

## Integrasi dengan Modul Lain

### Modul Pendaftaran (Registration)
- Pasien yang terdaftar otomatis muncul di list EHR
- NIK/NRP auto-sync

### Modul Farmasi (Pharmacy)
- Resep dari EHR dapat diproses di Farmasi
- Integration point untuk e-prescription

### Modul Billing
- Kunjungan EHR dapat di-link ke billing
- Track service billing per visit

### Modul Laboratorium
- Hasil lab dapat ditambahkan ke medical records
- Reference dari SOAP notes

## Roadmap & Future Features

- [ ] E-signature untuk dokter
- [ ] Template SOAP untuk kondisi umum
- [ ] Drug interaction checker (integration)
- [ ] Clinical decision support
- [ ] Mobile app untuk pasien (view own records)
- [ ] Telemedicine integration
- [ ] Voice-to-text untuk SOAP notes
- [ ] AI-powered diagnosis suggestion enhancement

## Support

Untuk pertanyaan atau bantuan:
- **Dokumentasi**: Baca file ini secara lengkap
- **Training**: Contact admin untuk training session
- **Technical Support**: Hubungi IT support faskes

---

**Versi**: 1.0  
**Tanggal**: 2024  
**Platform**: Puskesau Healthcare Management System  
**Organisasi**: TNI Angkatan Udara
