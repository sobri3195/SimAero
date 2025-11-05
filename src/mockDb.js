// Mock Database menggunakan localStorage
class MockDB {
  constructor() {
    this.prefix = 'mockdb_';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.prefix + 'initialized')) {
      // Sample Faskes
      this.saveCollection('faskes', [
        {
          id: '1',
          nama: 'RSAU Dr. Esnawan Antariksa',
          lokasi: 'Jakarta',
          tipe: 'rumah_sakit',
          kapasitas: 200,
          status: 'aktif'
        },
        {
          id: '2',
          nama: 'RSAU Dr. M. Salamun',
          lokasi: 'Bandung',
          tipe: 'rumah_sakit',
          kapasitas: 150,
          status: 'aktif'
        },
        {
          id: '3',
          nama: 'Klinik Kesehatan Lanud Halim',
          lokasi: 'Jakarta',
          tipe: 'klinik',
          kapasitas: 50,
          status: 'aktif'
        }
      ]);

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
