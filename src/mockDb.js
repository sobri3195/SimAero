// Mock Database menggunakan localStorage
class MockDB {
  constructor() {
    this.prefix = 'mockdb_';
    this.dataVersion = 'v2.1';
    this.initializeData();
  }

  initializeData() {
    const currentVersion = localStorage.getItem(this.prefix + 'version');
    const shouldReinitialize = !localStorage.getItem(this.prefix + 'initialized') || currentVersion !== this.dataVersion;
    
    if (shouldReinitialize) {
      // Faskes TNI AU - RSAU (Rumah Sakit Angkatan Udara) - 23 RSAU
      const rsauData = [
        {
          id: 'rsau_1',
          nama: 'RSPAU dr. Suhardi Hardjolukito',
          lokasi: 'Yogyakarta',
          alamat: 'Jl. Laksda Adisucipto, Yogyakarta',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 300,
          status: 'aktif',
          lanud: 'Lanud Adisutjipto',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru', 'Saraf']
        },
        {
          id: 'rsau_2',
          nama: 'RSAU dr. Esnawan Antariksa',
          lokasi: 'Jakarta Timur',
          alamat: 'Jl. Halim Perdanakusuma, Jakarta Timur 13610',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 250,
          status: 'aktif',
          lanud: 'Lanud Halim Perdanakusuma',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Farmasi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru', 'Saraf', 'Gigi & Mulut'],
          fiturKhusus: ['SIMRS Terintegrasi', 'Aerospace Medicine', 'Aviation Health']
        },
        {
          id: 'rsau_3',
          nama: 'RSAU dr. Moch. Salamun',
          lokasi: 'Bandung',
          alamat: 'Jl. Dr. Cipto No. 3, Bandung 40171',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 200,
          status: 'aktif',
          lanud: 'Lanud Sulaiman',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Farmasi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru', 'Saraf'],
          fiturKhusus: ['SIMRS Terintegrasi', 'Aerospace Medicine', 'Aviation Health']
        },
        {
          id: 'rsau_4',
          nama: 'RSGM drg.R.Poerwanto',
          lokasi: 'Jakarta',
          alamat: 'Jl. Halim Perdanakusuma, Jakarta Timur',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 100,
          status: 'aktif',
          lanud: 'Lanud Halim Perdanakusuma',
          fasilitasUtama: ['Poli Gigi', 'Bedah Mulut', 'Orthodonti', 'Prosthodonti', 'Konservasi'],
          spesialisasi: ['Gigi & Mulut', 'Bedah Mulut', 'Orthodonti', 'Prosthodonti']
        },
        {
          id: 'rsau_5',
          nama: 'RSAU dr. Hasan Toto Lanud Atang Sendjaja',
          lokasi: 'Bogor',
          alamat: 'Lanud Atang Sendjaja, Bogor, Jawa Barat',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 150,
          status: 'aktif',
          lanud: 'Lanud Atang Sendjaja',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_6',
          nama: 'RSAU dr. Efram Harsana Lanud Iswahjudi',
          lokasi: 'Madiun',
          alamat: 'Lanud Iswahjudi, Madiun, Jawa Timur',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 140,
          status: 'aktif',
          lanud: 'Lanud Iswahjudi',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata']
        },
        {
          id: 'rsau_7',
          nama: 'RSAU dr. Dody Sardjoto Lanud Hasanuddin',
          lokasi: 'Makassar',
          alamat: 'Lanud Hasanuddin, Makassar, Sulawesi Selatan',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 160,
          status: 'aktif',
          lanud: 'Lanud Hasanuddin',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit']
        },
        {
          id: 'rsau_8',
          nama: 'RSAU dr. Siswanto Lanud Adi Soemarmo',
          lokasi: 'Solo',
          alamat: 'Lanud Adi Soemarmo, Solo, Jawa Tengah',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 130,
          status: 'aktif',
          lanud: 'Lanud Adi Soemarmo',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_9',
          nama: 'RSAU dr. M. Munir Lanud Abdulrachman Saleh',
          lokasi: 'Malang',
          alamat: 'Lanud Abdulrachman Saleh, Malang, Jawa Timur',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 120,
          status: 'aktif',
          lanud: 'Lanud Abdulrachman Saleh',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi', 'Farmasi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata'],
          fiturKhusus: ['SIMRS Terintegrasi', 'Aerospace Medicine']
        },
        {
          id: 'rsau_10',
          nama: 'RSAU dr. Mohammad Moenir  Lanud Abd(Baru)',
          lokasi: 'Medan',
          alamat: 'Lanud Soewondo, Medan, Sumatera Utara',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 140,
          status: 'aktif',
          lanud: 'Lanud Soewondo',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_11',
          nama: 'RSAU dr. Sukirman Lanud Roesmin Nurjadin',
          lokasi: 'Pekanbaru',
          alamat: 'Lanud Roesmin Nurjadin, Pekanbaru, Riau',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 120,
          status: 'aktif',
          lanud: 'Lanud Roesmin Nurjadin',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_12',
          nama: 'RSAU dr. Mohammad Sutomo Lanud Supadio',
          lokasi: 'Pontianak',
          alamat: 'Lanud Supadio, Pontianak, Kalimantan Barat',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 125,
          status: 'aktif',
          lanud: 'Lanud Supadio',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan']
        },
        {
          id: 'rsau_13',
          nama: 'RSAU. dr. Yuniati Wisma Karyani Lanud R.Sadjad',
          lokasi: 'Natuna',
          alamat: 'Lanud Raden Sadjad, Natuna, Kepulauan Riau',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 80,
          status: 'aktif',
          lanud: 'Lanud Raden Sadjad',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak']
        },
        {
          id: 'rsau_14',
          nama: 'RSAU  dr. Hoediono Lanud Suryadarma',
          lokasi: 'Karawang',
          alamat: 'Lanud Suryadarma, Karawang, Jawa Barat',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 100,
          status: 'aktif',
          lanud: 'Lanud Suryadarma',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan']
        },
        {
          id: 'rsau_15',
          nama: 'RSAU dr. Abdul Malik Lanud Soewondo',
          lokasi: 'Medan',
          alamat: 'Lanud Soewondo, Medan, Sumatera Utara',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 130,
          status: 'aktif',
          lanud: 'Lanud Soewondo',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_16',
          nama: 'RSAU Soemitro Lanud Surabaya',
          lokasi: 'Surabaya',
          alamat: 'Lanud Juanda, Surabaya, Jawa Timur',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 180,
          status: 'aktif',
          lanud: 'Lanud Juanda',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jantung']
        },
        {
          id: 'rsau_17',
          nama: 'RS TNI AU Sjamsudin Noor',
          lokasi: 'Banjarmasin',
          alamat: 'Lanud Sjamsudin Noor, Banjarmasin, Kalimantan Selatan',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 110,
          status: 'aktif',
          lanud: 'Lanud Sjamsudin Noor',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan']
        },
        {
          id: 'rsau_18',
          nama: 'RSAU dr. Charles P. J. Suoth Lanud Sam Ratulangi',
          lokasi: 'Manado',
          alamat: 'Lanud Sam Ratulangi, Manado, Sulawesi Utara',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 120,
          status: 'aktif',
          lanud: 'Lanud Sam Ratulangi',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        },
        {
          id: 'rsau_19',
          nama: 'RSAU dr. Norman T. Lubis Lanud Sulaiman',
          lokasi: 'Bandung',
          alamat: 'Lanud Sulaiman, Bandung, Jawa Barat',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 140,
          status: 'aktif',
          lanud: 'Lanud Sulaiman',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata']
        },
        {
          id: 'rsau_20',
          nama: 'Rumkit Lanud Dhomber',
          lokasi: 'Papua',
          alamat: 'Lanud Dhomber, Timika, Papua',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 60,
          status: 'aktif',
          lanud: 'Lanud Dhomber',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak']
        },
        {
          id: 'rsau_21',
          nama: 'Rumkit Lanud Silas Papare',
          lokasi: 'Jayapura',
          alamat: 'Lanud Silas Papare, Jayapura, Papua',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 70,
          status: 'aktif',
          lanud: 'Lanud Silas Papare',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak']
        },
        {
          id: 'rsau_22',
          nama: 'RSAU. dr. Kresno Lanud Manuhua, Biak',
          lokasi: 'Biak',
          alamat: 'Lanud Manuhua, Biak, Papua',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 75,
          status: 'aktif',
          lanud: 'Lanud Manuhua',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak']
        },
        {
          id: 'rsau_23',
          nama: 'RSAU.Lanud Eltari',
          lokasi: 'Kupang',
          alamat: 'Lanud Eltari, Kupang, Nusa Tenggara Timur',
          tipe: 'rsau',
          tingkat: 'C',
          kapasitas: 85,
          status: 'aktif',
          lanud: 'Lanud Eltari',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan']
        }
      ];

      // Faskes TNI AU - FKTP (Fasilitas Kesehatan Tingkat Pertama / Klinik)
      const fktpData = [
        {
          id: 'fktp_1',
          nama: 'Klinik Kesehatan Lanud Halim Perdanakusuma',
          lokasi: 'Jakarta Timur',
          alamat: 'Lanud Halim Perdanakusuma, Jakarta Timur',
          tipe: 'fktp',
          kapasitas: 50,
          status: 'aktif',
          lanud: 'Lanud Halim Perdanakusuma',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_2',
          nama: 'Klinik Kesehatan Lanud Sulaiman',
          lokasi: 'Bandung',
          alamat: 'Lanud Sulaiman, Margahayu, Bandung',
          tipe: 'fktp',
          kapasitas: 40,
          status: 'aktif',
          lanud: 'Lanud Sulaiman',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_3',
          nama: 'Klinik Kesehatan Lanud Abdulrachman Saleh',
          lokasi: 'Malang',
          alamat: 'Lanud Abdulrachman Saleh, Malang',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Abdulrachman Saleh',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_4',
          nama: 'Klinik Kesehatan Lanud Iswahjudi',
          lokasi: 'Madiun',
          alamat: 'Lanud Iswahjudi, Madiun, Jawa Timur',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Iswahjudi',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_5',
          nama: 'Klinik Kesehatan Lanud Adisutjipto',
          lokasi: 'Yogyakarta',
          alamat: 'Lanud Adisutjipto, Yogyakarta',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Adisutjipto',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_6',
          nama: 'Klinik Kesehatan Lanud Ngurah Rai',
          lokasi: 'Bali',
          alamat: 'Lanud Ngurah Rai, Tuban, Bali',
          tipe: 'fktp',
          kapasitas: 40,
          status: 'aktif',
          lanud: 'Lanud Ngurah Rai',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_7',
          nama: 'Klinik Kesehatan Lanud Sultan Hasanuddin',
          lokasi: 'Makassar',
          alamat: 'Lanud Sultan Hasanuddin, Makassar',
          tipe: 'fktp',
          kapasitas: 45,
          status: 'aktif',
          lanud: 'Lanud Sultan Hasanuddin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_8',
          nama: 'Klinik Kesehatan Lanud Sam Ratulangi',
          lokasi: 'Manado',
          alamat: 'Lanud Sam Ratulangi, Manado',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Sam Ratulangi',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_9',
          nama: 'Klinik Kesehatan Lanud Roesmin Nurjadin',
          lokasi: 'Pekanbaru',
          alamat: 'Lanud Roesmin Nurjadin, Pekanbaru',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Roesmin Nurjadin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_10',
          nama: 'Klinik Kesehatan Lanud Sultan Mahmud Badaruddin II',
          lokasi: 'Palembang',
          alamat: 'Lanud SMB II, Palembang',
          tipe: 'fktp',
          kapasitas: 40,
          status: 'aktif',
          lanud: 'Lanud Sultan Mahmud Badaruddin II',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_11',
          nama: 'Klinik Kesehatan Lanud Soewondo',
          lokasi: 'Medan',
          alamat: 'Lanud Soewondo, Medan',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Soewondo',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_12',
          nama: 'Klinik Kesehatan Lanud Sjamsudin Noor',
          lokasi: 'Banjarmasin',
          alamat: 'Lanud Sjamsudin Noor, Banjarmasin',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Sjamsudin Noor',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_13',
          nama: 'Klinik Kesehatan Lanud Supadio',
          lokasi: 'Pontianak',
          alamat: 'Lanud Supadio, Pontianak',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Supadio',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_14',
          nama: 'Klinik Kesehatan Lanud Pattimura',
          lokasi: 'Ambon',
          alamat: 'Lanud Pattimura, Ambon',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Pattimura',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_15',
          nama: 'Klinik Kesehatan Lanud Manuhua',
          lokasi: 'Biak',
          alamat: 'Lanud Manuhua, Biak, Papua',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Manuhua',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_16',
          nama: 'Klinik Kesehatan Lanud Adi Soemarmo',
          lokasi: 'Solo',
          alamat: 'Lanud Adi Soemarmo, Solo',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Adi Soemarmo',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_17',
          nama: 'Klinik Kesehatan Lanud Atang Sendjaja',
          lokasi: 'Bogor',
          alamat: 'Lanud Atang Sendjaja, Bogor',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Atang Sendjaja',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_18',
          nama: 'Klinik Kesehatan Lanud Suryadarma',
          lokasi: 'Karawang',
          alamat: 'Lanud Suryadarma, Karawang',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Suryadarma',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_19',
          nama: 'Klinik Kesehatan Lanud Raden Sadjad',
          lokasi: 'Natuna',
          alamat: 'Lanud Raden Sadjad, Natuna',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Raden Sadjad',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_20',
          nama: 'Klinik Kesehatan Lanud Dhomber',
          lokasi: 'Timika',
          alamat: 'Lanud Dhomber, Timika',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Dhomber',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_21',
          nama: 'Klinik Kesehatan Lanud Silas Papare',
          lokasi: 'Jayapura',
          alamat: 'Lanud Silas Papare, Jayapura',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Silas Papare',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_22',
          nama: 'Klinik Kesehatan Lanud Eltari',
          lokasi: 'Kupang',
          alamat: 'Lanud Eltari, Kupang',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Eltari',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_23',
          nama: 'Klinik Kesehatan Lanud Juanda',
          lokasi: 'Surabaya',
          alamat: 'Lanud Juanda, Surabaya',
          tipe: 'fktp',
          kapasitas: 40,
          status: 'aktif',
          lanud: 'Lanud Juanda',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_24',
          nama: 'Klinik Kesehatan Lanud Raja Haji Fisabilillah',
          lokasi: 'Tanjungpinang',
          alamat: 'Lanud Raja Haji Fisabilillah, Tanjungpinang',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Raja Haji Fisabilillah',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_25',
          nama: 'Klinik Kesehatan Lanud Hang Nadim',
          lokasi: 'Batam',
          alamat: 'Lanud Hang Nadim, Batam',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Hang Nadim',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_26',
          nama: 'Klinik Kesehatan Lanud El Tari',
          lokasi: 'Kupang',
          alamat: 'Lanud El Tari, Kupang',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud El Tari',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_27',
          nama: 'Klinik Kesehatan Lanud H.A.S. Hanandjoeddin',
          lokasi: 'Belitung',
          alamat: 'Lanud H.A.S. Hanandjoeddin, Belitung',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud H.A.S. Hanandjoeddin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_28',
          nama: 'Klinik Kesehatan Lanud Pangeran M. Bun Yamin',
          lokasi: 'Lampung',
          alamat: 'Lanud Pangeran M. Bun Yamin, Lampung',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Pangeran M. Bun Yamin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_29',
          nama: 'Klinik Kesehatan Lanud Sultan Thaha',
          lokasi: 'Jambi',
          alamat: 'Lanud Sultan Thaha, Jambi',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Sultan Thaha',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_30',
          nama: 'Klinik Kesehatan Lanud Batu Licin',
          lokasi: 'Banjarbaru',
          alamat: 'Lanud Batu Licin, Banjarbaru',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Batu Licin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_31',
          nama: 'Klinik Kesehatan Lanud Muljono',
          lokasi: 'Surabaya',
          alamat: 'Lanud Muljono, Surabaya',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Muljono',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_32',
          nama: 'Klinik Kesehatan Lanud Wiriadinata',
          lokasi: 'Tasikmalaya',
          alamat: 'Lanud Wiriadinata, Tasikmalaya',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Wiriadinata',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_33',
          nama: 'Klinik Kesehatan Lanud Anang Busra',
          lokasi: 'Tarakan',
          alamat: 'Lanud Anang Busra, Tarakan',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Anang Busra',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_34',
          nama: 'Klinik Kesehatan Lanud Leo Wattimena',
          lokasi: 'Morotai',
          alamat: 'Lanud Leo Wattimena, Morotai',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Leo Wattimena',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_35',
          nama: 'Klinik Kesehatan Lanud Frans Kaisiepo',
          lokasi: 'Biak',
          alamat: 'Lanud Frans Kaisiepo, Biak',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Frans Kaisiepo',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_36',
          nama: 'Klinik Kesehatan Lanud Jalaluddin',
          lokasi: 'Gorontalo',
          alamat: 'Lanud Jalaluddin, Gorontalo',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Jalaluddin',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_37',
          nama: 'Klinik Kesehatan Lanud Haluoleo',
          lokasi: 'Kendari',
          alamat: 'Lanud Haluoleo, Kendari',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Haluoleo',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_38',
          nama: 'Klinik Kesehatan Lanud Pattimura',
          lokasi: 'Ambon',
          alamat: 'Lanud Pattimura, Ambon',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Pattimura',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_39',
          nama: 'Klinik Kesehatan Lanud Dumatubun',
          lokasi: 'Langgur',
          alamat: 'Lanud Dumatubun, Langgur',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Dumatubun',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_40',
          nama: 'Klinik Kesehatan Lanud Mopah',
          lokasi: 'Merauke',
          alamat: 'Lanud Mopah, Merauke',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Mopah',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_41',
          nama: 'Klinik Kesehatan Lanud Sentani',
          lokasi: 'Sentani',
          alamat: 'Lanud Sentani, Sentani',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Sentani',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_42',
          nama: 'Klinik Kesehatan Lanud Timika',
          lokasi: 'Timika',
          alamat: 'Lanud Timika, Timika',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Timika',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_43',
          nama: 'Klinik Kesehatan Lanud Pondok Cabe',
          lokasi: 'Tangerang Selatan',
          alamat: 'Lanud Pondok Cabe, Tangerang Selatan',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Pondok Cabe',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_44',
          nama: 'Klinik Kesehatan Lanud Husein Sastranegara',
          lokasi: 'Bandung',
          alamat: 'Lanud Husein Sastranegara, Bandung',
          tipe: 'fktp',
          kapasitas: 40,
          status: 'aktif',
          lanud: 'Lanud Husein Sastranegara',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_45',
          nama: 'Klinik Kesehatan Lanud Sutan Sjahrir',
          lokasi: 'Padang',
          alamat: 'Lanud Sutan Sjahrir, Padang',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Sutan Sjahrir',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_46',
          nama: 'Klinik Kesehatan Lanud Padang',
          lokasi: 'Padang',
          alamat: 'Lanud Padang, Padang',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Padang',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_47',
          nama: 'Klinik Kesehatan Lanud Ranai',
          lokasi: 'Ranai',
          alamat: 'Lanud Ranai, Natuna',
          tipe: 'fktp',
          kapasitas: 20,
          status: 'aktif',
          lanud: 'Lanud Ranai',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_48',
          nama: 'Klinik Kesehatan Lanud Supadio',
          lokasi: 'Pontianak',
          alamat: 'Lanud Supadio, Pontianak',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Supadio',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_49',
          nama: 'Klinik Kesehatan Lanud Sugiri Sukani',
          lokasi: 'Balikpapan',
          alamat: 'Lanud Sugiri Sukani, Balikpapan',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Sugiri Sukani',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_50',
          nama: 'Klinik Kesehatan Lanud Sepinggan',
          lokasi: 'Balikpapan',
          alamat: 'Lanud Sepinggan, Balikpapan',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Sepinggan',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_51',
          nama: 'Klinik Kesehatan Lanud Palembang',
          lokasi: 'Palembang',
          alamat: 'Lanud Palembang, Palembang',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Palembang',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_52',
          nama: 'Klinik Kesehatan Lanud Radin Inten II',
          lokasi: 'Lampung',
          alamat: 'Lanud Radin Inten II, Lampung',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Radin Inten II',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_53',
          nama: 'Klinik Kesehatan Lanud Selajangar',
          lokasi: 'Serang',
          alamat: 'Lanud Selajangar, Serang',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Selajangar',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_54',
          nama: 'Klinik Kesehatan Lanud Iswahyudi',
          lokasi: 'Madiun',
          alamat: 'Lanud Iswahyudi, Madiun',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Iswahyudi',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_55',
          nama: 'Klinik Kesehatan Lanud Ahmad Yani',
          lokasi: 'Semarang',
          alamat: 'Lanud Ahmad Yani, Semarang',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Ahmad Yani',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_56',
          nama: 'Klinik Kesehatan Lanud Abdulrahman Saleh',
          lokasi: 'Malang',
          alamat: 'Lanud Abdulrahman Saleh, Malang',
          tipe: 'fktp',
          kapasitas: 35,
          status: 'aktif',
          lanud: 'Lanud Abdulrahman Saleh',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'fktp_57',
          nama: 'Klinik Kesehatan Lanud Yogyakarta',
          lokasi: 'Yogyakarta',
          alamat: 'Lanud Yogyakarta, Yogyakarta',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Yogyakarta',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_58',
          nama: 'Klinik Kesehatan Lanud Andir',
          lokasi: 'Bandung',
          alamat: 'Lanud Andir, Bandung',
          tipe: 'fktp',
          kapasitas: 30,
          status: 'aktif',
          lanud: 'Lanud Andir',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'fktp_59',
          nama: 'Klinik Kesehatan Lanud Cakrabhuwana',
          lokasi: 'Cirebon',
          alamat: 'Lanud Cakrabhuwana, Cirebon',
          tipe: 'fktp',
          kapasitas: 25,
          status: 'aktif',
          lanud: 'Lanud Cakrabhuwana',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        }
      ];

      // Faskes TNI AD - RSAD (Rumah Sakit Angkatan Darat)
      const rsadData = [
        {
          id: 'rsad_1',
          nama: 'RSPAD Gatot Soebroto',
          lokasi: 'Jakarta Pusat',
          alamat: 'Jl. Abdul Rahman Saleh No. 24, Jakarta Pusat 10410',
          tipe: 'rsad',
          tingkat: 'A',
          kapasitas: 500,
          status: 'aktif',
          kesatuan: 'Pusat Kesehatan TNI AD',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Lapangan'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru', 'Saraf', 'Bedah Ortopedi', 'Kedokteran Taktis'],
          fiturKhusus: ['Combat Casualty Care', 'Field Medical Training', 'Tactical Medicine', 'Military Trauma Center']
        },
        {
          id: 'rsad_2',
          nama: 'RSAD Udayana',
          lokasi: 'Denpasar',
          alamat: 'Jl. Pulau Moyo No. 1, Denpasar, Bali',
          tipe: 'rsad',
          tingkat: 'B',
          kapasitas: 200,
          status: 'aktif',
          kesatuan: 'Kodam IX/Udayana',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Lapangan'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Bedah Ortopedi'],
          fiturKhusus: ['Field Medicine', 'Tactical Evacuation Training']
        },
        {
          id: 'rsad_3',
          nama: 'RSAD Tk. II Putri Hijau',
          lokasi: 'Medan',
          alamat: 'Jl. Putri Hijau No. 1, Medan, Sumatera Utara',
          tipe: 'rsad',
          tingkat: 'B',
          kapasitas: 180,
          status: 'aktif',
          kesatuan: 'Kodam I/Bukit Barisan',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Bedah Ortopedi'],
          fiturKhusus: ['Field Medicine', 'Combat Medical Support']
        },
        {
          id: 'rsad_4',
          nama: 'RSAD Tk. II dr. Soepraoen',
          lokasi: 'Malang',
          alamat: 'Jl. Sudanco Supriyadi No. 22, Malang, Jawa Timur',
          tipe: 'rsad',
          tingkat: 'B',
          kapasitas: 190,
          status: 'aktif',
          kesatuan: 'Kodam V/Brawijaya',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Lapangan'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Bedah Ortopedi', 'Jantung'],
          fiturKhusus: ['Field Medicine', 'Tactical Medical Training']
        },
        {
          id: 'rsad_5',
          nama: 'RSAD Tk. II dr. Slamet Riyadi',
          lokasi: 'Surakarta',
          alamat: 'Jl. Jend. Ahmad Yani No. 254, Surakarta, Jawa Tengah',
          tipe: 'rsad',
          tingkat: 'C',
          kapasitas: 150,
          status: 'aktif',
          kesatuan: 'Kodam IV/Diponegoro',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT'],
          fiturKhusus: ['Field Medicine']
        },
        {
          id: 'rsad_6',
          nama: 'RSAD Tk. II Pelamonia',
          lokasi: 'Makassar',
          alamat: 'Jl. Jend. Urip Sumoharjo, Makassar, Sulawesi Selatan',
          tipe: 'rsad',
          tingkat: 'B',
          kapasitas: 175,
          status: 'aktif',
          kesatuan: 'Kodam XIV/Hasanuddin',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata'],
          fiturKhusus: ['Field Medicine', 'Combat Medical Support']
        },
        {
          id: 'rsad_7',
          nama: 'RSAD Tk. II Robert Wolter Mongisidi',
          lokasi: 'Manado',
          alamat: 'Jl. 17 Agustus, Manado, Sulawesi Utara',
          tipe: 'rsad',
          tingkat: 'C',
          kapasitas: 140,
          status: 'aktif',
          kesatuan: 'Kodam XIII/Merdeka',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT'],
          fiturKhusus: ['Field Medicine']
        },
        {
          id: 'rsad_8',
          nama: 'RSAD Tk. II Dustira',
          lokasi: 'Cimahi',
          alamat: 'Jl. Dustira No. 1, Cimahi, Jawa Barat',
          tipe: 'rsad',
          tingkat: 'A',
          kapasitas: 300,
          status: 'aktif',
          kesatuan: 'Kodam III/Siliwangi',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Lapangan'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jantung', 'Paru', 'Bedah Ortopedi'],
          fiturKhusus: ['Combat Casualty Care', 'Field Medical Training', 'Tactical Medicine']
        },
        {
          id: 'rsad_9',
          nama: 'RSAD Tk. II Kartika Husada',
          lokasi: 'Kubu Raya',
          alamat: 'Jl. Ahmad Yani, Kubu Raya, Kalimantan Barat',
          tipe: 'rsad',
          tingkat: 'C',
          kapasitas: 120,
          status: 'aktif',
          kesatuan: 'Kodam XII/Tanjungpura',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan'],
          fiturKhusus: ['Field Medicine']
        },
        {
          id: 'rsad_10',
          nama: 'RSAD Tk. II dr. Soedono',
          lokasi: 'Magelang',
          alamat: 'Jl. A. Yani No. 161, Magelang, Jawa Tengah',
          tipe: 'rsad',
          tingkat: 'C',
          kapasitas: 160,
          status: 'aktif',
          kesatuan: 'Kodam IV/Diponegoro',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT'],
          fiturKhusus: ['Field Medicine', 'Combat Medical Training']
        }
      ];

      // Faskes TNI AD - Klinik AD
      const klinikADData = [
        {
          id: 'klinik_ad_1',
          nama: 'Klinik Kesehatan Kodam Jaya',
          lokasi: 'Jakarta',
          alamat: 'Kodam Jaya, Jakarta',
          tipe: 'klinik_ad',
          kapasitas: 50,
          status: 'aktif',
          kesatuan: 'Kodam Jaya',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana', 'Medical Fitness']
        },
        {
          id: 'klinik_ad_2',
          nama: 'Klinik Kesehatan Kodam I/Bukit Barisan',
          lokasi: 'Medan',
          alamat: 'Kodam I/Bukit Barisan, Medan',
          tipe: 'klinik_ad',
          kapasitas: 40,
          status: 'aktif',
          kesatuan: 'Kodam I/Bukit Barisan',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'klinik_ad_3',
          nama: 'Klinik Kesehatan Kodam II/Sriwijaya',
          lokasi: 'Palembang',
          alamat: 'Kodam II/Sriwijaya, Palembang',
          tipe: 'klinik_ad',
          kapasitas: 35,
          status: 'aktif',
          kesatuan: 'Kodam II/Sriwijaya',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'klinik_ad_4',
          nama: 'Klinik Kesehatan Kodam III/Siliwangi',
          lokasi: 'Bandung',
          alamat: 'Kodam III/Siliwangi, Bandung',
          tipe: 'klinik_ad',
          kapasitas: 45,
          status: 'aktif',
          kesatuan: 'Kodam III/Siliwangi',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'klinik_ad_5',
          nama: 'Klinik Kesehatan Kodam IV/Diponegoro',
          lokasi: 'Semarang',
          alamat: 'Kodam IV/Diponegoro, Semarang',
          tipe: 'klinik_ad',
          kapasitas: 40,
          status: 'aktif',
          kesatuan: 'Kodam IV/Diponegoro',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'klinik_ad_6',
          nama: 'Klinik Kesehatan Kodam V/Brawijaya',
          lokasi: 'Surabaya',
          alamat: 'Kodam V/Brawijaya, Surabaya',
          tipe: 'klinik_ad',
          kapasitas: 45,
          status: 'aktif',
          kesatuan: 'Kodam V/Brawijaya',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        },
        {
          id: 'klinik_ad_7',
          nama: 'Klinik Kesehatan Kodam VI/Mulawarman',
          lokasi: 'Balikpapan',
          alamat: 'Kodam VI/Mulawarman, Balikpapan',
          tipe: 'klinik_ad',
          kapasitas: 30,
          status: 'aktif',
          kesatuan: 'Kodam VI/Mulawarman',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'klinik_ad_8',
          nama: 'Klinik Kesehatan Kodam IX/Udayana',
          lokasi: 'Denpasar',
          alamat: 'Kodam IX/Udayana, Denpasar',
          tipe: 'klinik_ad',
          kapasitas: 35,
          status: 'aktif',
          kesatuan: 'Kodam IX/Udayana',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana']
        }
      ];

      // Faskes TNI AL - RSAL (Rumah Sakit Angkatan Laut)
      const rsalData = [
        {
          id: 'rsal_1',
          nama: 'RSAL dr. Mintohardjo',
          lokasi: 'Jakarta Pusat',
          alamat: 'Jl. Bendungan Hilir No. 17, Jakarta Pusat 10210',
          tipe: 'rsal',
          tingkat: 'A',
          kapasitas: 450,
          status: 'aktif',
          kesatuan: 'Pusat Kesehatan TNI AL',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Selam', 'Hyperbaric Chamber'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru', 'Saraf', 'Kedokteran Kelautan'],
          fiturKhusus: ['Diving Medicine', 'Submarine Medical Fitness', 'Hyperbaric Medicine', 'Maritime Health', 'Naval Trauma Center']
        },
        {
          id: 'rsal_2',
          nama: 'RSAL dr. Ramelan',
          lokasi: 'Surabaya',
          alamat: 'Jl. Gadung No. 1, Surabaya, Jawa Timur 60111',
          tipe: 'rsal',
          tingkat: 'A',
          kapasitas: 400,
          status: 'aktif',
          kesatuan: 'Lantamal V',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'ICCU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Selam', 'Hyperbaric Chamber'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jantung', 'Paru', 'Kedokteran Kelautan'],
          fiturKhusus: ['Diving Medicine', 'Submarine Medical Fitness', 'Hyperbaric Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_3',
          nama: 'RSAL Tk. II dr. Midiyato S. Tanjungpinang',
          lokasi: 'Tanjungpinang',
          alamat: 'Jl. Yos Sudarso, Tanjungpinang, Kepulauan Riau',
          tipe: 'rsal',
          tingkat: 'B',
          kapasitas: 150,
          status: 'aktif',
          kesatuan: 'Lantamal IV',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi', 'Kedokteran Selam'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_4',
          nama: 'RSAL Tk. III dr. Wahyu Tri Atmojo',
          lokasi: 'Ambon',
          alamat: 'Jl. Pantai Ambon, Ambon, Maluku',
          tipe: 'rsal',
          tingkat: 'C',
          kapasitas: 120,
          status: 'aktif',
          kesatuan: 'Lantamal IX',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_5',
          nama: 'RSAL Tk. II Biak',
          lokasi: 'Biak',
          alamat: 'Jl. Selat Madura, Biak, Papua',
          tipe: 'rsal',
          tingkat: 'C',
          kapasitas: 100,
          status: 'aktif',
          kesatuan: 'Lantamal XII',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_6',
          nama: 'RSAL Tk. III dr. FX Suhardjo',
          lokasi: 'Manokwari',
          alamat: 'Jl. Pasar Sanggeng, Manokwari, Papua Barat',
          tipe: 'rsal',
          tingkat: 'C',
          kapasitas: 90,
          status: 'aktif',
          kesatuan: 'Lantamal XIII',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_7',
          nama: 'RSAL Tk. IV dr. Sindhu Ananda',
          lokasi: 'Sorong',
          alamat: 'Jl. Yos Sudarso, Sorong, Papua Barat',
          tipe: 'rsal',
          tingkat: 'C',
          kapasitas: 80,
          status: 'aktif',
          kesatuan: 'Lantamal XII',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'Laboratorium'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        },
        {
          id: 'rsal_8',
          nama: 'RSAL Tk. II dr. Riyacudu',
          lokasi: 'Lampung',
          alamat: 'Jl. Yos Sudarso, Bandar Lampung',
          tipe: 'rsal',
          tingkat: 'B',
          kapasitas: 140,
          status: 'aktif',
          kesatuan: 'Lantamal II',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT'],
          fiturKhusus: ['Diving Medicine', 'Maritime Health']
        }
      ];

      // Faskes TNI AL - Klinik AL
      const klinikALData = [
        {
          id: 'klinik_al_1',
          nama: 'Klinik Kesehatan Lantamal I',
          lokasi: 'Belawan',
          alamat: 'Lantamal I, Belawan, Medan',
          tipe: 'klinik_al',
          kapasitas: 40,
          status: 'aktif',
          kesatuan: 'Lantamal I',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_2',
          nama: 'Klinik Kesehatan Lantamal II',
          lokasi: 'Padang',
          alamat: 'Lantamal II, Padang, Sumatera Barat',
          tipe: 'klinik_al',
          kapasitas: 35,
          status: 'aktif',
          kesatuan: 'Lantamal II',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_3',
          nama: 'Klinik Kesehatan Lantamal III',
          lokasi: 'Jakarta',
          alamat: 'Lantamal III, Jakarta',
          tipe: 'klinik_al',
          kapasitas: 50,
          status: 'aktif',
          kesatuan: 'Lantamal III',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_4',
          nama: 'Klinik Kesehatan Lantamal IV',
          lokasi: 'Tanjungpinang',
          alamat: 'Lantamal IV, Tanjungpinang',
          tipe: 'klinik_al',
          kapasitas: 30,
          status: 'aktif',
          kesatuan: 'Lantamal IV',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_5',
          nama: 'Klinik Kesehatan Lantamal V',
          lokasi: 'Surabaya',
          alamat: 'Lantamal V, Surabaya',
          tipe: 'klinik_al',
          kapasitas: 45,
          status: 'aktif',
          kesatuan: 'Lantamal V',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium Sederhana', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_6',
          nama: 'Klinik Kesehatan Lantamal VI',
          lokasi: 'Makassar',
          alamat: 'Lantamal VI, Makassar',
          tipe: 'klinik_al',
          kapasitas: 35,
          status: 'aktif',
          kesatuan: 'Lantamal VI',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_7',
          nama: 'Klinik Kesehatan Lantamal VII',
          lokasi: 'Kupang',
          alamat: 'Lantamal VII, Kupang',
          tipe: 'klinik_al',
          kapasitas: 30,
          status: 'aktif',
          kesatuan: 'Lantamal VII',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        },
        {
          id: 'klinik_al_8',
          nama: 'Klinik Kesehatan Lantamal VIII',
          lokasi: 'Manado',
          alamat: 'Lantamal VIII, Manado',
          tipe: 'klinik_al',
          kapasitas: 30,
          status: 'aktif',
          kesatuan: 'Lantamal VIII',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_9',
          nama: 'Klinik Kesehatan Lantamal IX',
          lokasi: 'Ambon',
          alamat: 'Lantamal IX, Ambon',
          tipe: 'klinik_al',
          kapasitas: 30,
          status: 'aktif',
          kesatuan: 'Lantamal IX',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Diving Medical Check']
        },
        {
          id: 'klinik_al_10',
          nama: 'Klinik Kesehatan Lantamal X',
          lokasi: 'Jayapura',
          alamat: 'Lantamal X, Jayapura',
          tipe: 'klinik_al',
          kapasitas: 25,
          status: 'aktif',
          kesatuan: 'Lantamal X',
          fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek']
        }
      ];

      // Gabungkan semua faskes
      const allFaskes = [...rsauData, ...fktpData, ...rsadData, ...klinikADData, ...rsalData, ...klinikALData];
      this.saveCollection('faskes', allFaskes);

      // Sample Patients
      this.saveCollection('patients', [
        {
          id: 'p1',
          nik: '3201012345678901',
          nama: 'Mayor Budi Santoso',
          tanggalLahir: '1980-05-15',
          jenisKelamin: 'L',
          alamat: 'Jl. Merdeka No. 123, Jakarta',
          telepon: '081234567890',
          createdAt: new Date().toISOString()
        },
        {
          id: 'p2',
          nik: '3201012345678902',
          nama: 'Kapten Andi Wijaya',
          tanggalLahir: '1985-08-20',
          jenisKelamin: 'L',
          alamat: 'Jl. Sudirman No. 456, Bandung',
          telepon: '081234567891',
          createdAt: new Date().toISOString()
        },
        {
          id: 'p3',
          nik: '3201012345678903',
          nama: 'Lettu Sari Dewi',
          tanggalLahir: '1990-03-10',
          jenisKelamin: 'P',
          alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
          telepon: '081234567892',
          createdAt: new Date().toISOString()
        }
      ]);

      // Initialize empty collections
      this.saveCollection('registrations', []);
      this.saveCollection('medical_records', []);
      this.saveCollection('igd_patients', []);
      this.saveCollection('beds', this.generateBeds());
      this.saveCollection('inpatients', []);
      this.saveCollection('operating_rooms', this.generateOperatingRooms());
      this.saveCollection('surgeries', []);
      this.saveCollection('cssd_instruments', []);
      this.saveCollection('sterilization_cycles', []);
      this.saveCollection('blood_inventory', []);
      this.saveCollection('blood_requests', []);
      this.saveCollection('blood_donations', []);
      this.saveCollection('drugs', []);
      this.saveCollection('prescriptions', []);
      this.saveCollection('lab_orders', []);
      this.saveCollection('radiology_orders', []);
      this.saveCollection('employees', []);
      this.saveCollection('schedules', []);
      this.saveCollection('assets', []);
      this.saveCollection('calibrations', []);
      this.saveCollection('supplies', []);
      this.saveCollection('supply_orders', []);
      this.saveCollection('logistics', []);
      this.saveCollection('incidents', []);
      this.saveCollection('bridging_logs', []);
      this.saveCollection('broadcasts', []);

      localStorage.setItem(this.prefix + 'initialized', 'true');
      localStorage.setItem(this.prefix + 'version', this.dataVersion);
    }
  }

  generateBeds() {
    const beds = [];
    const roomTypes = ['VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU'];
    let bedId = 1;

    roomTypes.forEach(roomType => {
      const bedCount = roomType === 'VIP' ? 5 : roomType === 'ICU' ? 4 : 10;
      for (let i = 1; i <= bedCount; i++) {
        beds.push({
          id: `bed_${bedId}`,
          roomType: roomType,
          roomNumber: `${roomType}-${Math.ceil(i / 2)}`,
          bedNumber: `Bed-${i}`,
          status: 'kosong',
          occupiedBy: null,
          faskesId: 'RSAU Dr. Esnawan Antariksa'
        });
        bedId++;
      }
    });

    return beds;
  }

  generateOperatingRooms() {
    return [
      { id: 'or_1', name: 'Ruang Operasi 1', status: 'available', faskesId: 'RSAU Dr. Esnawan Antariksa' },
      { id: 'or_2', name: 'Ruang Operasi 2', status: 'available', faskesId: 'RSAU Dr. Esnawan Antariksa' },
      { id: 'or_3', name: 'Ruang Operasi 3', status: 'available', faskesId: 'RSAU Dr. Esnawan Antariksa' }
    ];
  }

  getCollection(collectionName) {
    const data = localStorage.getItem(this.prefix + collectionName);
    return data ? JSON.parse(data) : [];
  }

  saveCollection(collectionName, data) {
    localStorage.setItem(this.prefix + collectionName, JSON.stringify(data));
    this.notifyListeners(collectionName);
  }

  addDoc(collectionName, data) {
    const collection = this.getCollection(collectionName);
    const newDoc = {
      id: this.generateId(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };
    collection.push(newDoc);
    this.saveCollection(collectionName, collection);
    return Promise.resolve(newDoc);
  }

  updateDoc(collectionName, docId, data) {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(doc => doc.id === docId);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...data, updatedAt: new Date().toISOString() };
      this.saveCollection(collectionName, collection);
    }
    return Promise.resolve();
  }

  deleteDoc(collectionName, docId) {
    const collection = this.getCollection(collectionName);
    const filtered = collection.filter(doc => doc.id !== docId);
    this.saveCollection(collectionName, filtered);
    return Promise.resolve();
  }

  getDoc(collectionName, docId) {
    const collection = this.getCollection(collectionName);
    const doc = collection.find(d => d.id === docId);
    return Promise.resolve(doc || null);
  }

  query(collectionName, filters = []) {
    let collection = this.getCollection(collectionName);
    
    filters.forEach(filter => {
      const [field, operator, value] = filter;
      collection = collection.filter(doc => {
        switch (operator) {
          case '==':
            return doc[field] === value;
          case '!=':
            return doc[field] !== value;
          case '>':
            return doc[field] > value;
          case '>=':
            return doc[field] >= value;
          case '<':
            return doc[field] < value;
          case '<=':
            return doc[field] <= value;
          default:
            return true;
        }
      });
    });
    
    return collection;
  }

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Listener system for real-time updates
  listeners = {};

  onSnapshot(collectionName, callback) {
    if (!this.listeners[collectionName]) {
      this.listeners[collectionName] = [];
    }
    this.listeners[collectionName].push(callback);
    
    // Immediately call with current data
    callback(this.getCollection(collectionName));
    
    // Return unsubscribe function
    return () => {
      this.listeners[collectionName] = this.listeners[collectionName].filter(cb => cb !== callback);
    };
  }

  notifyListeners(collectionName) {
    if (this.listeners[collectionName]) {
      const data = this.getCollection(collectionName);
      this.listeners[collectionName].forEach(callback => callback(data));
    }
  }
}

export const mockDb = new MockDB();

// Mock Firebase Firestore API
export const collection = (db, collectionName) => ({ _collectionName: collectionName });

export const getDocs = (queryOrCollection) => {
  const collectionName = queryOrCollection._collectionName;
  const filters = queryOrCollection._filters || [];
  const orderByClause = queryOrCollection._orderBy;
  
  let data = mockDb.query(collectionName, filters);
  
  // Apply orderBy if present
  if (orderByClause) {
    data = [...data].sort((a, b) => {
      const aVal = a[orderByClause.field];
      const bVal = b[orderByClause.field];
      
      if (aVal < bVal) return orderByClause.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return orderByClause.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return Promise.resolve({
    size: data.length,
    docs: data.map(doc => ({
      id: doc.id,
      data: () => doc
    })),
    forEach: (callback) => {
      data.forEach((doc) => callback({ id: doc.id, data: () => doc }));
    }
  });
};

export const addDoc = (collectionRef, data) => {
  return mockDb.addDoc(collectionRef._collectionName, data);
};

export const updateDoc = (docRef, data) => {
  return mockDb.updateDoc(docRef._collectionName, docRef._docId, data);
};

export const deleteDoc = (docRef) => {
  return mockDb.deleteDoc(docRef._collectionName, docRef._docId);
};

export const doc = (db, collectionName, docId) => ({
  _collectionName: collectionName,
  _docId: docId
});

export const query = (collectionRef, ...constraints) => {
  const filters = constraints.filter(c => c._filter).map(f => f._filter);
  const orderByClause = constraints.find(c => c._orderBy)?._orderBy;
  
  return {
    _collectionName: collectionRef._collectionName,
    _filters: filters,
    _orderBy: orderByClause
  };
};

export const where = (field, operator, value) => ({
  _filter: [field, operator, value]
});

export const onSnapshot = (queryOrCollection, callback) => {
  const collectionName = queryOrCollection._collectionName;
  const filters = queryOrCollection._filters || [];
  
  return mockDb.onSnapshot(collectionName, (data) => {
    let filteredData = [...data];
    
    filters.forEach(filter => {
      if (filter) {
        const [field, operator, value] = filter;
        filteredData = filteredData.filter(doc => {
          if (operator === '==') return doc[field] === value;
          if (operator === '!=') return doc[field] !== value;
          if (operator === '>') return doc[field] > value;
          if (operator === '>=') return doc[field] >= value;
          if (operator === '<') return doc[field] < value;
          if (operator === '<=') return doc[field] <= value;
          return true;
        });
      }
    });
    
    callback({
      size: filteredData.length,
      docs: filteredData.map(doc => ({
        id: doc.id,
        data: () => doc
      })),
      forEach: (cb) => {
        filteredData.forEach((doc) => cb({ id: doc.id, data: () => doc }));
      }
    });
  });
};

export const orderBy = (field, direction = 'asc') => ({
  _orderBy: { field, direction }
});

export const getDoc = async (docRef) => {
  const result = await mockDb.getDoc(docRef._collectionName, docRef._docId);
  if (result) {
    return {
      exists: () => true,
      id: docRef._docId,
      data: () => result
    };
  }
  return {
    exists: () => false,
    id: docRef._docId,
    data: () => null
  };
};

// Mock db export
export const db = { _isMockDb: true };
