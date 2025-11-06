// Mock Database menggunakan localStorage
class MockDB {
  constructor() {
    this.prefix = 'mockdb_';
    this.version = 'v2.0'; // Update version untuk force refresh data FKTP
    this.initializeData();
  }

  initializeData() {
    const currentVersion = localStorage.getItem(this.prefix + 'version');
    if (!localStorage.getItem(this.prefix + 'initialized') || currentVersion !== this.version) {
      // Clear old data if version mismatch
      if (currentVersion !== this.version) {
        this.clearAllData();
      }
      // Faskes TNI AU - RSAU (Rumah Sakit Angkatan Udara)
      const rsauData = [
        {
          id: 'rsau_1',
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
          id: 'rsau_2',
          nama: 'RSAU dr. M. Salamun',
          lokasi: 'Bandung',
          alamat: 'Jl. Dr. Cipto No. 3, Bandung 40171',
          tipe: 'rsau',
          tingkat: 'A',
          kapasitas: 200,
          status: 'aktif',
          lanud: 'Lanud Sulaiman',
          fasilitasUtama: ['IGD 24 Jam', 'Rawat Inap', 'ICU', 'Operasi', 'Hemodialisa', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT', 'Mata', 'Kulit', 'Jiwa']
        },
        {
          id: 'rsau_3',
          nama: 'RSAU dr. Siswondo Parman',
          lokasi: 'Malang',
          alamat: 'Lanud Abdulrachman Saleh, Malang',
          tipe: 'rsau',
          tingkat: 'B',
          kapasitas: 120,
          status: 'aktif',
          lanud: 'Lanud Abdulrachman Saleh',
          fasilitasUtama: ['IGD', 'Rawat Inap', 'Operasi', 'CSSD', 'Laboratorium', 'Radiologi'],
          spesialisasi: ['Penyakit Dalam', 'Bedah', 'Anak', 'Kebidanan', 'THT']
        }
      ];

      // Faskes TNI AU - FKTP (Fasilitas Kesehatan Tingkat Pertama / Klinik) - 58 FKTP
      const fktpData = [
        { id: 'fktp_1', nama: 'FKTP DIRGANTARA LAKESGILUT drg R. POERWANTO', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 50, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_2', nama: 'FKTP RAJAWALI LAKESPRA dr. SARYANTO', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 45, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_3', nama: 'FKTP DAKOTA LAKESPRA dr SARYANTO', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_4', nama: 'FKTP SATKES DENMABESAU', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_5', nama: 'FKTP DADALI LAFIAU', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_6', nama: 'FKTP CENDRAWASIH LANUD ADISUTJIPTO', lokasi: 'Yogyakarta', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_7', nama: 'FKTP DENMA KODIKLATAU', lokasi: 'Surabaya', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_8', nama: 'FKTP PRATAMA COLIBRI LANUD ADI SOEMARMO', lokasi: 'Solo', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_9', nama: 'FKTP SETUKPA LANUD ADI SOEMARMO', lokasi: 'Solo', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_10', nama: 'FKTP LANUD SULAIMAN', lokasi: 'Bandung', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_11', nama: 'FKTPK KLINIK WING 800 KOPASGAT', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_12', nama: 'FKTP SATKES DENMA KOOPSUDNAS', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_13', nama: 'FKTP KLINIK PRATAMA LANUD ATANG SANDJAJA', lokasi: 'Bogor', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_14', nama: 'FKTP ANGKASA LANUD SURYADARMA', lokasi: 'Karawang', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_15', nama: 'FKTP PRATAMA TERPADU HUSEIN SASTRANEGARA', lokasi: 'Bandung', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_16', nama: 'FKTP LANUD SULTAN ISKANDAR MUDA', lokasi: 'Aceh', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_17', nama: 'FKTP LANUD ROESMIN NURJADIN', lokasi: 'Pekanbaru', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_18', nama: 'FKTP LANUD MAIMUN SALEH', lokasi: 'Sabang', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_19', nama: 'FKTP SATKES DENMA KOOPSUD I', lokasi: 'Medan', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_20', nama: 'FKTP LANUD SRI MULYONO HERLAMBANG', lokasi: 'Kupang', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_21', nama: 'FKTP SATKES DENMA KOSEK I MEDAN', lokasi: 'Medan', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_22', nama: 'FKTP FLAMINGGO LANUD SOEWONDO', lokasi: 'Medan', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_23', nama: 'FKTP AMBARA ASASTA LANUD SUPADIO', lokasi: 'Pontianak', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_24', nama: 'FKTP LANUD HARRY HADISOEMANTRI', lokasi: 'Palembang', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_25', nama: 'FKTP LANUD SUTAN SJAHRIR', lokasi: 'Padang', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_26', nama: 'FKTP LANUD H A SANUSI HANANDJOEDDIN', lokasi: 'Bangka Belitung', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_27', nama: 'FKTP PRATAMA LANUD R SADJAD', lokasi: 'Natuna', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_28', nama: 'FKTP LANUD RAJA HAJI FISABILLILAH', lokasi: 'Tanjung Pinang', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_29', nama: 'FKTP KLINIK GARUDA LANUD ABD SALEH MALANG', lokasi: 'Malang', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_30', nama: 'FKTP PATARAJA LANUD HASANUDDIN', lokasi: 'Makassar', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_31', nama: 'FKTP PRINGGODANI LANUD ISWAHJUDI', lokasi: 'Madiun', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_32', nama: 'FKTP LANUD I GUSTI NGURAH RAI', lokasi: 'Bali', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_33', nama: 'FKTP PRATAMA LANUD ZAINUDIN ABDUL MADJID', lokasi: 'Lombok', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_34', nama: 'FKTP SOEMITRO LANUD MULJONO', lokasi: 'Surabaya', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_35', nama: 'FKTP MULAWARMAN LANUD DHOMBER', lokasi: 'Jayapura', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_36', nama: 'FKTP PRATAMA LANUD JENDERAL BESAR SOEDIRMAN', lokasi: 'Purbalingga', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_37', nama: 'FKTP LANUD HALUOLEO', lokasi: 'Kendari', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_38', nama: 'FKTP PRATAMA KOSEK II MAKASSAR', lokasi: 'Makassar', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_39', nama: 'FKTP LANUD SJAMSUDDIN NOOR', lokasi: 'Banjarmasin', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_40', nama: 'FKTP DENMA KOOPSUD II', lokasi: 'Makassar', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_41', nama: 'FKTP LANUD EL TARI KUPANG', lokasi: 'Kupang', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_42', nama: 'FKTP BHUWANA LANUD ANANG BUSRA TARAKAN', lokasi: 'Tarakan', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_43', nama: 'FKTP LANUD SAM RATULANGI', lokasi: 'Manado', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_44', nama: 'FKTP LANUD PATIMURA', lokasi: 'Ambon', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_45', nama: 'FKTP LANUD SILAS PAPARE', lokasi: 'Jayapura', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_46', nama: 'FKTP LANUD MANUHUA', lokasi: 'Biak', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_47', nama: 'FKTP BUANA LANUD YOHANIS KAPIYAU', lokasi: 'Timika', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_48', nama: 'FKTP LANUD JOHANNES ABRAHAM DIMARA', lokasi: 'Merauke', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_49', nama: 'FKTP LANUD LEO WATTIMENA', lokasi: 'Morotai', tipe: 'fktp', kapasitas: 20, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_50', nama: 'FKTP LANUD DOMINICUS DUMATUBUN', lokasi: 'Langgur', tipe: 'fktp', kapasitas: 20, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_51', nama: 'SATKES MAKO KOPASGAT', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_52', nama: 'FKTP AKADEMI ANGKATAN UDARA', lokasi: 'Yogyakarta', tipe: 'fktp', kapasitas: 40, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek', 'Lab'] },
        { id: 'fktp_53', nama: 'FKTP CATYA HUSADA SATBRAVO 90 KOPASGAT', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_54', nama: 'FKTP LANUD WIRIADINATA', lokasi: 'Tasikmalaya', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_55', nama: 'FKTP LANUD SUGIRI SUKANI', lokasi: 'Cilacap', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_56', nama: 'FKTP SATKES PUSDIKLAT KOOPSUDNAS / WINGDIK 700', lokasi: 'Jakarta', tipe: 'fktp', kapasitas: 30, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_57', nama: 'FKTP PRATAMA SESKOAU', lokasi: 'Lembang', tipe: 'fktp', kapasitas: 35, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Poli Gigi', 'Apotek'] },
        { id: 'fktp_58', nama: 'FKTP HADI SUMANTRI LANUD ISKANDAR', lokasi: 'Pangkalan Bun', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] },
        { id: 'fktp_59', nama: 'FKTP LANUD PANGERAN M BUN YAMIN', lokasi: 'Bangka', tipe: 'fktp', kapasitas: 25, status: 'aktif', fasilitasUtama: ['Poli Umum', 'Apotek'] }
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
      this.saveCollection('igd_patients', this.generateSampleIGDPatients());
      this.saveCollection('beds', this.generateBeds());
      this.saveCollection('inpatients', this.generateSampleInpatients());
      this.saveCollection('operating_rooms', this.generateOperatingRooms());
      this.saveCollection('surgeries', []);
      this.saveCollection('cssd_instruments', []);
      this.saveCollection('sterilization_cycles', []);
      this.saveCollection('blood_inventory', []);
      this.saveCollection('blood_requests', []);
      this.saveCollection('blood_donations', []);
      this.saveCollection('drugs', []);
      this.saveCollection('prescriptions', this.generateSamplePrescriptions());
      this.saveCollection('pharmacy_transactions', this.generateSampleTransactions());
      this.saveCollection('lab_orders', []);
      this.saveCollection('radiology_orders', []);
      this.saveCollection('employees', []);
      this.saveCollection('schedules', []);
      this.saveCollection('assets', []);
      this.saveCollection('calibrations', []);
      this.saveCollection('rikkes_examinations', []);
      this.saveCollection('supplies', []);
      this.saveCollection('supply_orders', []);
      this.saveCollection('logistics', []);
      this.saveCollection('incidents', []);
      this.saveCollection('bridging_logs', []);
      this.saveCollection('broadcasts', []);
      this.saveCollection('daily_examinations', []);
      this.saveCollection('drug_transactions', []);
      this.saveCollection('personnel_rikkes', []);

      localStorage.setItem(this.prefix + 'initialized', 'true');
      localStorage.setItem(this.prefix + 'version', this.version);
    }
  }

  clearAllData() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  generateBeds() {
    const beds = [];
    const facilities = [
      'RSAU dr. Esnawan Antariksa',
      'RSAU dr. M. Salamun',
      'RSAU dr. Siswondo Parman'
    ];
    const roomTypes = ['VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU'];
    let bedId = 1;

    facilities.forEach(faskesId => {
      roomTypes.forEach(roomType => {
        const bedCount = roomType === 'VIP' ? 5 : roomType === 'ICU' ? 6 : 10;
        const roomCount = roomType === 'VIP' ? 3 : roomType === 'ICU' ? 2 : 5;
        
        for (let room = 1; room <= roomCount; room++) {
          const bedsPerRoom = Math.ceil(bedCount / roomCount);
          for (let bed = 1; bed <= bedsPerRoom; bed++) {
            const randomStatus = Math.random();
            let status = 'kosong';
            
            // Simulate some occupied beds for demo
            if (randomStatus > 0.7) {
              status = 'terisi';
            } else if (randomStatus > 0.6) {
              status = 'dibersihkan';
            } else if (randomStatus > 0.55) {
              status = 'maintenance';
            }
            
            beds.push({
              id: `bed_${bedId}`,
              roomType: roomType,
              roomNumber: `${roomType} ${room}0${room}`,
              bedNumber: `TT-${bed}`,
              status: status,
              occupiedBy: status === 'terisi' ? `Pasien ${bedId}` : null,
              faskesId: faskesId
            });
            bedId++;
          }
        }
      });
    });

    return beds;
  }

  generateSampleIGDPatients() {
    const facilities = ['RSAU dr. Esnawan Antariksa', 'RSAU dr. M. Salamun'];
    const patients = [];
    const triaseCategories = ['RESUSITASI', 'DARURAT', 'MENDESAK', 'TIDAK_MENDESAK'];
    const samplePatients = [
      { nama: 'Sersan Andi Wijaya', keluhan: 'Nyeri dada', tekananDarah: '160/100', nadi: '120', respirasi: '24', suhu: '37.5' },
      { nama: 'Kopral Budi Santoso', keluhan: 'Sesak nafas', tekananDarah: '140/90', nadi: '100', respirasi: '28', suhu: '38.2' },
      { nama: 'Pratu Siti Rahma', keluhan: 'Trauma kepala', tekananDarah: '110/70', nadi: '95', respirasi: '20', suhu: '36.8' },
      { nama: 'Letda Ahmad Saputra', keluhan: 'Luka bakar', tekananDarah: '120/80', nadi: '88', respirasi: '18', suhu: '37.0' }
    ];
    
    facilities.forEach((faskesId, idx) => {
      samplePatients.forEach((patient, pIdx) => {
        if (idx === 0 || pIdx < 2) {
          patients.push({
            id: `igd_${idx}_${pIdx}`,
            ...patient,
            faskesId: faskesId,
            triase: triaseCategories[pIdx % 4],
            status: 'aktif',
            waktuMasuk: new Date(Date.now() - (pIdx * 30 * 60 * 1000)),
            createdAt: new Date().toISOString()
          });
        }
      });
    });
    
    return patients;
  }

  generateSampleInpatients() {
    const facilities = ['RSAU dr. Esnawan Antariksa', 'RSAU dr. M. Salamun'];
    const inpatients = [];
    const samplePatients = [
      { patientName: 'Mayor Hendra Kusuma', diagnosis: 'Pneumonia', doctor: 'dr. Agus Salim, Sp.P' },
      { patientName: 'Kapten Linda Wijaya', diagnosis: 'Post Operasi Apendisitis', doctor: 'dr. Rina Sari, Sp.B' },
      { patientName: 'Sersan Dedi Prasetyo', diagnosis: 'Diabetes Mellitus', doctor: 'dr. Bambang, Sp.PD' }
    ];
    
    let inpatientId = 1;
    facilities.forEach((faskesId) => {
      // Get some occupied beds for this facility
      const allBeds = this.generateBeds();
      const facilityBeds = allBeds.filter(b => b.faskesId === faskesId && b.status === 'terisi');
      
      facilityBeds.slice(0, 3).forEach((bed, idx) => {
        if (idx < samplePatients.length) {
          const patient = samplePatients[idx];
          const admitDate = new Date(Date.now() - ((idx + 1) * 2 * 24 * 60 * 60 * 1000));
          
          inpatients.push({
            id: `inp_${inpatientId}`,
            ...patient,
            faskesId: faskesId,
            bedId: bed.id,
            roomNumber: bed.roomNumber,
            bedNumber: bed.bedNumber,
            roomType: bed.roomType,
            admitDate: admitDate.toISOString(),
            status: 'aktif',
            nurseNotes: [
              {
                timestamp: new Date(Date.now() - (12 * 60 * 60 * 1000)).toISOString(),
                note: 'Pasien stabil, vital signs normal',
                vitals: { bp: '120/80', pulse: '78', temp: '36.5', resp: '18' },
                nurse: 'Perawat Jaga'
              }
            ],
            createdAt: admitDate.toISOString()
          });
          inpatientId++;
        }
      });
    });
    
    return inpatients;
  }

  generateSamplePrescriptions() {
    const facilities = ['RSAU dr. Esnawan Antariksa', 'RSAU dr. M. Salamun', 'RSAU dr. Siswondo Parman'];
    const prescriptions = [];
    const samplePrescriptions = [
      {
        patientName: 'Lettu Rudi Hartono',
        patientId: 'RM-001234',
        doctorName: 'Susanto',
        poli: 'Poli Umum',
        items: [
          { drugName: 'Amoksisilin 500mg', quantity: 15, unit: 'tablet', dosage: '3x1', instructions: 'Setelah makan', price: 5000 },
          { drugName: 'Paracetamol 500mg', quantity: 10, unit: 'tablet', dosage: '3x1', instructions: 'Bila demam', price: 2000 }
        ],
        notes: 'Kontrol kembali 3 hari'
      },
      {
        patientName: 'Serka Dewi Lestari',
        patientId: 'RM-001235',
        doctorName: 'Ratna Sari',
        poli: 'Poli Gigi',
        items: [
          { drugName: 'Asam Mefenamat 500mg', quantity: 10, unit: 'tablet', dosage: '3x1', instructions: 'Setelah makan', price: 3000 },
          { drugName: 'Chlorhexidine 0.2%', quantity: 1, unit: 'botol', dosage: '2x sehari', instructions: 'Kumur setelah sikat gigi', price: 15000 }
        ],
        notes: 'Jaga kebersihan mulut'
      },
      {
        patientName: 'Mayor Andi Wijaya',
        patientId: 'RM-001236',
        doctorName: 'Bambang Susilo',
        poli: 'Poli Jantung',
        items: [
          { drugName: 'Bisoprolol 5mg', quantity: 30, unit: 'tablet', dosage: '1x1', instructions: 'Pagi hari setelah sarapan', price: 8000 },
          { drugName: 'Simvastatin 20mg', quantity: 30, unit: 'tablet', dosage: '1x1', instructions: 'Malam sebelum tidur', price: 6000 }
        ],
        notes: 'Kontrol rutin setiap bulan'
      }
    ];

    const statuses = ['menunggu', 'disiapkan', 'selesai'];
    
    facilities.forEach((faskesId, fIdx) => {
      samplePrescriptions.forEach((presc, pIdx) => {
        const createdTime = new Date(Date.now() - ((fIdx * 3 + pIdx) * 30 * 60 * 1000));
        const status = statuses[pIdx % 3];
        
        const prescription = {
          id: `presc_${fIdx}_${pIdx}`,
          ...presc,
          faskesId: faskesId,
          status: status,
          isPaid: status === 'selesai' ? (Math.random() > 0.5) : false,
          createdAt: createdTime.toISOString()
        };

        if (status === 'disiapkan') {
          prescription.preparedAt = new Date(createdTime.getTime() + 15 * 60 * 1000).toISOString();
        } else if (status === 'selesai') {
          prescription.preparedAt = new Date(createdTime.getTime() + 15 * 60 * 1000).toISOString();
          prescription.completedAt = new Date(createdTime.getTime() + 30 * 60 * 1000).toISOString();
        }

        prescriptions.push(prescription);
      });
    });

    return prescriptions;
  }

  generateSampleTransactions() {
    const facilities = ['RSAU dr. Esnawan Antariksa', 'RSAU dr. M. Salamun'];
    const transactions = [];
    const sampleTransactions = [
      {
        patientName: 'Kapten Budi Santoso',
        patientId: 'RM-001240',
        doctorName: 'Agus Salim',
        items: [
          { drugName: 'Amoksisilin 500mg', quantity: 20, unit: 'tablet', dosage: '3x1', instructions: 'Setelah makan', price: 5000 },
          { drugName: 'Paracetamol 500mg', quantity: 15, unit: 'tablet', dosage: '3x1', instructions: 'Bila demam', price: 2000 }
        ],
        totalAmount: 130000,
        amountPaid: 150000,
        change: 20000,
        paymentMethod: 'tunai'
      },
      {
        patientName: 'Serda Siti Nurhaliza',
        patientId: 'RM-001241',
        doctorName: 'Ratna Dewi',
        items: [
          { drugName: 'Vitamin B Complex', quantity: 30, unit: 'tablet', dosage: '1x1', instructions: 'Setelah makan pagi', price: 3000 },
          { drugName: 'Vitamin C 500mg', quantity: 30, unit: 'tablet', dosage: '1x1', instructions: 'Pagi hari', price: 2500 }
        ],
        totalAmount: 165000,
        amountPaid: 165000,
        change: 0,
        paymentMethod: 'debit'
      }
    ];

    facilities.forEach((faskesId, fIdx) => {
      sampleTransactions.forEach((trans, tIdx) => {
        const today = new Date();
        today.setHours(8 + (fIdx * 2 + tIdx), 30, 0, 0);
        
        transactions.push({
          id: `tx_${fIdx}_${tIdx}`,
          prescriptionId: `presc_${fIdx}_${tIdx}_paid`,
          ...trans,
          faskesId: faskesId,
          transactionDate: today.toISOString(),
          cashierName: 'Kasir 1'
        });
      });
    });

    return transactions;
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

export const getDocs = (collectionRef) => {
  let data = mockDb.getCollection(collectionRef._collectionName);
  
  if (collectionRef._filters) {
    collectionRef._filters.forEach(filter => {
      if (filter) {
        const [field, operator, value] = filter;
        data = data.filter(doc => {
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
  }
  
  if (collectionRef._orderBy) {
    const { field, direction } = collectionRef._orderBy;
    data = [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal === bVal) return 0;
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      if (aVal < bVal) return direction === 'desc' ? 1 : -1;
      if (aVal > bVal) return direction === 'desc' ? -1 : 1;
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

export const getDoc = async (docRef) => {
  const data = mockDb.getCollection(docRef._collectionName);
  const docData = data.find(item => item.id === docRef._docId);
  return {
    id: docRef._docId,
    exists: () => !!docData,
    data: () => docData
  };
};

export const query = (collectionRef, ...filters) => ({
  _collectionName: collectionRef._collectionName,
  _filters: filters.filter(f => f._filter).map(f => f._filter),
  _orderBy: filters.find(f => f._orderBy)?._orderBy
});

export const where = (field, operator, value) => ({
  _filter: [field, operator, value]
});

export const orderBy = (field, direction = 'asc') => ({
  _orderBy: { field, direction }
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

// Mock db export
export const db = { _isMockDb: true };
