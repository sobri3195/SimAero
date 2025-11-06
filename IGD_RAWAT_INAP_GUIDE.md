# Panduan IGD dan Rawat Inap - Puskesau Healthcare Platform

## 📋 Deskripsi

Modul IGD (Instalasi Gawat Darurat) dan Rawat Inap telah ditingkatkan dengan fitur-fitur baru:

### IGD - Digital Triage Board
- **Papan Status Triase Digital**: Menampilkan pasien berdasarkan kategori triase
- **Drag-and-Drop**: Memindahkan pasien antar-kategori dengan mudah
- **Real-time Updates**: Perubahan langsung terlihat di semua user

### Rawat Inap - Bed Management System
- **Denah Tempat Tidur Visual**: Tampilan layout tempat tidur per ruangan
- **Drag-and-Drop Bed Transfer**: Pindahkan pasien antar-tempat tidur
- **Status Management**: Tersedia, Terisi, Dibersihkan, Dalam Perawatan
- **BOR Statistics**: Perhitungan Bed Occupancy Rate otomatis
- **Length of Stay Tracking**: Monitor durasi rawat inap pasien

---

## 🚑 MODUL IGD (Instalasi Gawat Darurat)

### Fitur Papan Triase Digital

#### Kategori Triase
1. **RESUSITASI** (Hitam) - Prioritas tertinggi, kritis
2. **DARURAT** (Merah) - Sangat mendesak
3. **MENDESAK** (Kuning) - Perlu penanganan segera
4. **TIDAK MENDESAK** (Hijau) - Dapat menunggu

#### Cara Menggunakan

**1. Menambah Pasien Baru**
   - Klik tombol "+ Tambah Pasien"
   - Isi data pasien:
     - Nama Pasien
     - Keluhan Utama
     - Vital Signs (Tekanan Darah, Nadi, Respirasi, Suhu)
   - (Opsional) Klik "Saran Triase AI" untuk rekomendasi kategori
   - Pilih kategori triase dengan klik tombol warna sesuai prioritas

**2. Memindahkan Pasien Antar-Kategori (Drag-and-Drop)**
   - Klik dan tahan pada card pasien
   - Drag (seret) ke kolom kategori triase yang diinginkan
   - Drop (lepas) di kolom target
   - Sistem akan otomatis mengupdate kategori triase pasien
   - Notifikasi konfirmasi akan muncul

**3. Menyelesaikan Penanganan Pasien**
   - Klik tombol centang hijau (✓) pada card pasien
   - Pasien akan dipindahkan ke status "selesai"
   - Waktu selesai akan tercatat otomatis

#### Informasi pada Card Pasien
- Nama pasien
- Keluhan utama
- Vital signs (TD, Nadi, Resp, Suhu)
- Waktu masuk IGD
- Tombol aksi (selesai)

---

## 🏥 MODUL RAWAT INAP

### Tab Navigation
1. **Denah Tempat Tidur** - Visual bed layout dengan drag-and-drop
2. **Daftar Pasien** - List view dengan catatan perawat
3. **Statistik BOR** - Dashboard analytics dan metrics

---

### 1. TAB DENAH TEMPAT TIDUR

#### Filter Ruangan
- **Semua Ruangan**: Tampilkan semua tempat tidur
- **VIP**: Ruang VIP saja
- **Kelas 1, 2, 3**: Filter per kelas
- **ICU**: Intensive Care Unit

#### Status Tempat Tidur
| Status | Warna | Deskripsi |
|--------|-------|-----------|
| **Tersedia** | Hijau | Siap ditempati pasien baru |
| **Terisi** | Merah | Sudah ada pasien |
| **Dibersihkan** | Biru | Sedang dalam proses cleaning |
| **Dalam Perawatan** | Kuning | Maintenance/perbaikan |

#### Cara Menggunakan

**A. Rawat Inap Pasien Baru**
1. Klik tombol "Rawat Inap Pasien"
2. Isi form:
   - Nama Pasien
   - Dokter Penanggung Jawab (DPJP)
   - Jenis Ruangan (VIP/Kelas 1/2/3/ICU)
   - Diagnosis
3. Klik "Rawat Inap"
4. Sistem akan otomatis mencari tempat tidur kosong sesuai jenis ruangan
5. Tempat tidur akan berubah status menjadi "Terisi"

**B. Memindahkan Pasien Antar-Tempat Tidur (Drag-and-Drop)**
1. Pada denah, cari card pasien yang ingin dipindahkan
2. Klik dan tahan pada area pasien (kotak dengan info pasien)
3. Drag (seret) ke tempat tidur tujuan
4. Hanya bisa drop ke tempat tidur dengan status "Tersedia" atau "Dibersihkan"
5. Sistem akan:
   - Memindahkan pasien ke tempat tidur baru
   - Set tempat tidur lama ke status "Dibersihkan"
   - Set tempat tidur baru ke status "Terisi"
   - Mencatat riwayat transfer
6. Notifikasi konfirmasi akan muncul

**C. Mengubah Status Tempat Tidur**
1. Klik pada card tempat tidur yang kosong/dibersihkan/maintenance
2. Menu popup akan muncul dengan opsi:
   - Set Tersedia
   - Set Dibersihkan
   - Set Maintenance
3. Pilih status yang diinginkan
4. Status akan langsung terupdate

**D. Memulangkan Pasien**
1. Klik tombol "X" (close) pada card tempat tidur yang terisi
2. Atau pada Tab "Daftar Pasien", klik tombol "Keluar"
3. Konfirmasi pemulangan
4. Sistem akan:
   - Set status pasien menjadi "keluar"
   - Catat waktu keluar (discharge time)
   - Set tempat tidur ke status "Dibersihkan"
   - Hitung durasi rawat inap (Length of Stay)

#### Informasi pada Card Tempat Tidur

**Tempat Tidur Kosong:**
- Nomor tempat tidur (TT-X)
- Status (Tersedia/Dibersihkan/Maintenance)
- Click untuk ubah status

**Tempat Tidur Terisi:**
- Nomor tempat tidur
- Nama pasien
- Diagnosis
- Durasi rawat inap (hari)
- Tombol pemulangan (X)

---

### 2. TAB DAFTAR PASIEN

#### Fitur
- List semua pasien rawat inap aktif
- Informasi detail per pasien
- Catatan perawat (nurse notes)
- Recording vital signs

#### Cara Menambah Catatan Perawat
1. Pada card pasien, klik tombol "Catatan"
2. Form catatan akan expand
3. Lihat history catatan sebelumnya
4. Isi catatan baru:
   - Textarea untuk catatan perawat
   - Input vital signs (TD, Nadi, Suhu, Resp)
5. Klik "Simpan Catatan"
6. Catatan akan tersimpan dengan timestamp dan nama perawat

#### Informasi Pasien
- Nama pasien dan diagnosis
- Ruangan dan nomor tempat tidur
- Dokter Penanggung Jawab (DPJP)
- History catatan perawat dengan vital signs
- Tombol aksi (Catatan, Keluar)

---

### 3. TAB STATISTIK BOR

#### Metrics Cards
**1. BOR (Bed Occupancy Rate)**
- Persentase tingkat hunian tempat tidur
- Status: Optimal (≥85%), Baik (70-84%), Rendah (50-69%), Sangat Rendah (<50%)

**2. Total Tempat Tidur**
- Jumlah total tempat tidur
- Breakdown: Terisi vs Tersedia

**3. Pasien Aktif**
- Jumlah pasien rawat inap saat ini

**4. Rata-rata LOS (Length of Stay)**
- Rata-rata durasi rawat inap dalam hari
- Dihitung dari pasien yang sudah pulang

#### Grafik dan Visualisasi

**A. BOR per Jenis Ruangan (Bar Chart)**
- Menampilkan jumlah tempat tidur terisi vs tersedia
- Per jenis ruangan (VIP, Kelas 1-3, ICU)

**B. Distribusi Status Tempat Tidur (Pie Chart)**
- Persentase status: Terisi, Tersedia, Dibersihkan, Maintenance
- Dengan jumlah dan persentase

**C. Tabel Detail BOR**
- Per jenis ruangan
- Total TT, Terisi, Tersedia
- BOR percentage dengan progress bar
- Visual indicator per ruangan

#### Cara Membaca BOR
```
BOR = (Jumlah TT Terisi / Total TT) × 100%

Contoh:
- Total TT: 100
- Terisi: 75
- BOR: 75%
```

---

## 📊 Database Structure

### Collection: igd_patients
```javascript
{
  id: string,
  nama: string,
  keluhan: string,
  tekananDarah: string,
  nadi: string,
  respirasi: string,
  suhu: string,
  triase: 'RESUSITASI' | 'DARURAT' | 'MENDESAK' | 'TIDAK_MENDESAK',
  status: 'aktif' | 'selesai',
  waktuMasuk: Date,
  waktuSelesai: Date?,
  faskesId: string
}
```

### Collection: beds
```javascript
{
  id: string,
  roomType: 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'ICU',
  roomNumber: string,
  bedNumber: string,
  status: 'kosong' | 'terisi' | 'dibersihkan' | 'maintenance',
  occupiedBy: string?,
  faskesId: string
}
```

### Collection: inpatients
```javascript
{
  id: string,
  patientName: string,
  diagnosis: string,
  doctor: string,
  roomType: string,
  roomNumber: string,
  bedNumber: string,
  bedId: string,
  admitDate: string (ISO),
  dischargeDate: string? (ISO),
  status: 'aktif' | 'keluar',
  nurseNotes: [
    {
      timestamp: string (ISO),
      note: string,
      vitals: { bp, pulse, temp, resp },
      nurse: string
    }
  ],
  transferHistory: [
    {
      from: string,
      to: string,
      timestamp: string (ISO)
    }
  ],
  faskesId: string
}
```

---

## 🎯 Use Cases

### Scenario 1: Pasien IGD Perlu Di-upgrade Prioritas
1. Pasien masuk sebagai "MENDESAK" (kuning)
2. Kondisi memburuk, perlu upgrade ke "DARURAT" (merah)
3. Petugas drag card pasien dari kolom kuning ke kolom merah
4. Sistem update kategori triase
5. Tim medis mendapat notifikasi perubahan prioritas

### Scenario 2: Transfer Pasien ICU ke Kelas 1
1. Pasien di ICU kondisi membaik
2. Dokter instruksikan pindah ke Kelas 1
3. Perawat filter ruangan "ICU" → cari pasien
4. Drag card pasien ke tempat tidur kosong di Kelas 1
5. Sistem:
   - Tempat tidur ICU → "Dibersihkan"
   - Tempat tidur Kelas 1 → "Terisi"
   - Record transfer history
6. Petugas cleaning dapat membersihkan tempat tidur ICU

### Scenario 3: Monitoring BOR Real-time
1. Manager masuk Tab "Statistik BOR"
2. Lihat BOR saat ini: 82% (Status: Baik)
3. Analisis:
   - ICU: 100% (penuh)
   - VIP: 60% (rendah)
   - Kelas 2: 85% (optimal)
4. Tindakan:
   - Siapkan tempat tidur cadangan ICU
   - Marketing VIP bisa ditingkatkan

### Scenario 4: Perawatan Pasien dengan Catatan
1. Pasien rawat inap hari ke-3
2. Perawat jaga shift malam cek kondisi
3. Buka Tab "Daftar Pasien" → klik "Catatan"
4. Baca history catatan shift sebelumnya
5. Tambah catatan baru:
   - "Pasien tidur nyenyak, tidak demam"
   - TD: 120/80, Nadi: 75, Suhu: 36.5°C, Resp: 18
6. Simpan catatan
7. Shift pagi dapat membaca kondisi malam

---

## 🔧 Technical Implementation

### Drag-and-Drop (HTML5 API)
```javascript
// IGD Triage
onDragStart={(e, patient) => {
  e.dataTransfer.setData('patientId', patient.id);
}}

onDrop={(e, targetTriage) => {
  const patientId = e.dataTransfer.getData('patientId');
  updateTriage(patientId, targetTriage);
}}
```

### Bed Layout Visual
- Grid responsive layout
- Color-coded status badges
- Real-time listeners (onSnapshot)
- Click handlers for status management

### BOR Calculation
```javascript
BOR = (occupiedBeds / totalBeds) × 100

Average LOS = Σ(dischargeDate - admitDate) / totalDischargedPatients
```

---

## 🎨 UI/UX Features

### Visual Feedback
- **Hover effects**: Card elevation on hover
- **Drag cursor**: `cursor-move` on draggable items
- **Drop zones**: Ring highlight when dragging over valid targets
- **Color coding**: Consistent status colors throughout
- **Animations**: Smooth transitions on status changes

### Responsive Design
- Mobile-friendly grid layouts
- Touch-friendly drag-and-drop
- Collapsible forms and sections
- Adaptive columns based on screen size

### Accessibility
- Clear status indicators
- Readable font sizes
- High contrast colors
- Intuitive button labels

---

## 📝 Notes

### Data Isolation
- Setiap faskes (RSAU/FKTP) memiliki data terpisah
- Filter otomatis berdasarkan `selectedFaskes`
- Real-time updates hanya untuk faskes aktif

### Sample Data
- Sistem generate sample data saat pertama kali load
- 3 RSAU dengan bed layouts lengkap
- Beberapa pasien IGD dan rawat inap untuk demo

### Performance
- Real-time updates menggunakan onSnapshot listeners
- Efficient filtering and querying
- Debounced drag operations

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Bed reservation system
- [ ] Patient waitlist management
- [ ] Automated bed assignment algorithm
- [ ] SMS/Email notifications for bed availability
- [ ] Integration with EHR module
- [ ] Discharge planning workflow
- [ ] Bed turnover time tracking
- [ ] Infection control alerts
- [ ] VIP bed upgrade requests

### Analytics Enhancements
- [ ] Historical BOR trends (monthly/yearly)
- [ ] Peak hours analysis
- [ ] Average LOS by diagnosis
- [ ] Readmission rates
- [ ] Patient satisfaction scores

---

## 📞 Support

Untuk pertanyaan atau bantuan terkait modul IGD dan Rawat Inap, hubungi:
- Help Desk: support@puskesau.mil.id
- WhatsApp: +62-xxx-xxxx-xxxx
- Dokumentasi Online: https://docs.puskesau.mil.id

---

**Last Updated**: November 2024  
**Version**: 2.1  
**Module**: IGD & Inpatient Management
