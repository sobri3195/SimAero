// Mock Database menggunakan localStorage
class MockDB {
  constructor() {
    this.prefix = 'mockdb_';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.prefix + 'initialized')) {
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
  const data = mockDb.getCollection(collectionRef._collectionName);
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

export const query = (collectionRef, ...filters) => ({
  _collectionName: collectionRef._collectionName,
  _filters: filters.map(f => f._filter)
});

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

// Mock db export
export const db = { _isMockDb: true };
