import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const initializeSampleData = async () => {
  try {
    // Sample Faskes
    const faskes = [
      {
        nama: 'RSAU Dr. Esnawan Antariksa',
        lokasi: 'Jakarta',
        tipe: 'rumah_sakit',
        kapasitas: 200,
        status: 'aktif'
      },
      {
        nama: 'RSAU Dr. M. Salamun',
        lokasi: 'Bandung',
        tipe: 'rumah_sakit',
        kapasitas: 150,
        status: 'aktif'
      },
      {
        nama: 'Klinik Kesehatan Lanud Halim',
        lokasi: 'Jakarta',
        tipe: 'klinik',
        kapasitas: 50,
        status: 'aktif'
      }
    ];

    for (const f of faskes) {
      await addDoc(collection(db, 'faskes'), f);
    }

    // Sample Patients
    const patients = [
      {
        nik: '3201012345678901',
        nama: 'Mayor Budi Santoso',
        tanggalLahir: '1980-05-15',
        jenisKelamin: 'L',
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        telepon: '081234567890',
        createdAt: new Date()
      },
      {
        nik: '3201012345678902',
        nama: 'Kapten Andi Wijaya',
        tanggalLahir: '1985-08-20',
        jenisKelamin: 'L',
        alamat: 'Jl. Sudirman No. 456, Bandung',
        telepon: '081234567891',
        createdAt: new Date()
      },
      {
        nik: '3201012345678903',
        nama: 'Lettu Sari Dewi',
        tanggalLahir: '1990-03-10',
        jenisKelamin: 'P',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
        telepon: '081234567892',
        createdAt: new Date()
      }
    ];

    for (const p of patients) {
      await addDoc(collection(db, 'patients'), p);
    }

    // Sample Blood Bank
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    for (const type of bloodTypes) {
      await addDoc(collection(db, 'blood_inventory'), {
        bloodType: type,
        quantity: Math.floor(Math.random() * 50) + 10,
        faskesId: 'RSAU Jakarta',
        lastUpdated: new Date()
      });
    }

    console.log('Sample data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return false;
  }
};
