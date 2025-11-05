import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Search, Camera, Save } from 'lucide-react';
import Card from '../common/Card';

const RegistrationForm = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    telepon: '',
    poliTujuan: '',
    jenisKunjungan: 'umum',
    nomorBPJS: '',
    keluhanUtama: ''
  });

  const [existingPatient, setExistingPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const poliOptions = [
    'Poli Umum',
    'Poli Gigi',
    'Poli Mata',
    'Poli THT',
    'Poli Kulit',
    'Poli Penyakit Dalam',
    'Poli Bedah',
    'Poli Anak',
    'Poli Jantung',
    'Poli Paru'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const searchByNIK = async () => {
    if (!formData.nik) {
      addNotification({ type: 'warning', message: 'Masukkan NIK terlebih dahulu' });
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'patients'), where('nik', '==', formData.nik));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const patientData = querySnapshot.docs[0].data();
        setExistingPatient(patientData);
        setFormData(prev => ({
          ...prev,
          ...patientData
        }));
        addNotification({ type: 'success', message: 'Data pasien ditemukan!' });
      } else {
        addNotification({ type: 'info', message: 'Pasien baru, silakan lengkapi data' });
        setExistingPatient(null);
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      addNotification({ type: 'error', message: 'Gagal mencari data pasien' });
    } finally {
      setLoading(false);
    }
  };

  const scanKTP = () => {
    addNotification({ type: 'info', message: 'Fitur scan KTP akan segera tersedia' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.poliTujuan) {
      addNotification({ type: 'warning', message: 'Pilih poli tujuan' });
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        faskesId: selectedFaskes || 'default',
        tanggalDaftar: new Date(),
        status: 'menunggu',
        nomorAntrean: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'registrations'), registrationData);

      if (!existingPatient) {
        await addDoc(collection(db, 'patients'), {
          nik: formData.nik,
          nama: formData.nama,
          tanggalLahir: formData.tanggalLahir,
          jenisKelamin: formData.jenisKelamin,
          alamat: formData.alamat,
          telepon: formData.telepon,
          nomorBPJS: formData.nomorBPJS,
          createdAt: new Date()
        });
      }

      addNotification({ 
        type: 'success', 
        message: `Pasien berhasil didaftarkan! Nomor antrean: ${registrationData.nomorAntrean}` 
      });

      setFormData({
        nik: '',
        nama: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alamat: '',
        telepon: '',
        poliTujuan: '',
        jenisKunjungan: 'umum',
        nomorBPJS: '',
        keluhanUtama: ''
      });
      setExistingPatient(null);
    } catch (error) {
      console.error('Error registering patient:', error);
      addNotification({ type: 'error', message: 'Gagal mendaftarkan pasien' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Formulir Pendaftaran Pasien">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NIK Search */}
        <div>
          <label className="block text-sm font-medium mb-2">NIK</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              placeholder="Nomor Induk Kependudukan"
              required
            />
            <button
              type="button"
              onClick={searchByNIK}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Search size={16} />
              Cari
            </button>
            <button
              type="button"
              onClick={scanKTP}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Camera size={16} />
              Scan KTP
            </button>
          </div>
          {existingPatient && (
            <p className="text-sm text-green-600 mt-1">✓ Data pasien ditemukan di database</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih...</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Telepon</label>
            <input
              type="tel"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alamat</label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Poli Tujuan</label>
            <select
              name="poliTujuan"
              value={formData.poliTujuan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Poli...</option>
              {poliOptions.map((poli, idx) => (
                <option key={idx} value={poli}>{poli}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Jenis Kunjungan</label>
            <select
              name="jenisKunjungan"
              value={formData.jenisKunjungan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="umum">Umum</option>
              <option value="bpjs">BPJS</option>
              <option value="asuransi">Asuransi Lain</option>
            </select>
          </div>
        </div>

        {formData.jenisKunjungan === 'bpjs' && (
          <div>
            <label className="block text-sm font-medium mb-2">Nomor BPJS</label>
            <input
              type="text"
              name="nomorBPJS"
              value={formData.nomorBPJS}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Keluhan Utama</label>
          <textarea
            name="keluhanUtama"
            value={formData.keluhanUtama}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Jelaskan keluhan pasien..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setFormData({
                nik: '',
                nama: '',
                tanggalLahir: '',
                jenisKelamin: '',
                alamat: '',
                telepon: '',
                poliTujuan: '',
                jenisKunjungan: 'umum',
                nomorBPJS: '',
                keluhanUtama: ''
              });
              setExistingPatient(null);
            }}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Menyimpan...' : 'Daftarkan Pasien'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default RegistrationForm;
