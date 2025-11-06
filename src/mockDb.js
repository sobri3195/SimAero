// Mock Database menggunakan localStorage
class MockDB {
  constructor() {
    this.prefix = 'mockdb_';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.prefix + 'initialized')) {
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
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung', 'Paru']
        },
        {
          id: 'rsau_3',
          nama: 'RSAU dr. Moch. Salamun',
          lokasi: 'Bandung',
          alamat: 'Jl. Dr. Cipto No. 3, Bandung 40171',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 220,
          status: 'aktif',
          lanud: 'Lanud Sulaiman',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa', 'Jantung']
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
          kapasitas: 135,
          status: 'aktif',
          lanud: 'Lanud Abdulrachman Saleh',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'ICU', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata']
        },
        {
          id: 'rsau_10',
          nama: 'RSAU dr. Mohammad Moenir Lanud Abd',
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
        }
      ];

      // Gabungkan semua faskes
      const allFaskes = [...rsauData, ...fktpData];
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
