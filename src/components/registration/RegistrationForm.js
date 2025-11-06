import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Search, Camera, Save } from 'lucide-react';
import Card from '../common/Card';

const RegistrationForm = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    identitasType: 'nik',
    nik: '',
    nrp: '',
    nama: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    telepon: '',
    statusPasien: 'prajurit',
    namaKeluarga: '',
    hubunganKeluarga: '',
    poliTujuan: '',
    jenisKunjungan: 'umum',
    nomorBPJS: '',
    keluhanUtama: '',
    isRujukan: false,
    asalRujukan: '',
    nomorRujukan: '',
    diagnosisRujukan: ''
  });

  const [existingPatient, setExistingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nationalDbFound, setNationalDbFound] = useState(false);

  const poliOptions = [
    'Poli Umum',
    'Poli Gigi',
    'Poli Jantung',
    'Poli Paru',
    'Poli Bedah',
    'Poli Saraf',
    'Poli Mata',
    'Poli THT',
    'Poli Kulit & Kelamin',
    'Poli Gigi & Mulut',
    'KIA (Kesehatan Ibu & Anak)',
    'MTBS (Manajemen Terpadu Balita Sakit)',
    'Penapisan PTM (Penyakit Tidak Menular)'
  ];

  const hubunganKeluargaOptions = [
    'Suami/Istri',
    'Anak Kandung',
    'Orang Tua',
    'Saudara Kandung',
    'Lainnya'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const searchByIdentity = async () => {
    const searchValue = formData.identitasType === 'nik' ? formData.nik : formData.nrp;
    if (!searchValue) {
      addNotification({ type: 'warning', message: `Masukkan ${formData.identitasType.toUpperCase()} terlebih dahulu` });
      return;
    }

    setLoading(true);
    setNationalDbFound(false);
    
    try {
      // Step 1: Search in local database first
      const q = query(
        collection(db, 'patients'), 
        where(formData.identitasType, '==', searchValue)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const patientData = querySnapshot.docs[0].data();
        setExistingPatient(patientData);
        setFormData(prev => ({
          ...prev,
          ...patientData
        }));
        addNotification({ type: 'success', message: '✓ Data pasien ditemukan di database lokal!' });
        return;
      }

      // Step 2: Simulate search in National Database (SATUSEHAT/Dukcapil)
      addNotification({ type: 'info', message: '🔍 Mencari di database nasional...' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate national database lookup (mock data based on NIK pattern)
      const nationalData = simulateNationalDbLookup(searchValue, formData.identitasType);
      
      if (nationalData) {
        setNationalDbFound(true);
        setExistingPatient(null); // Not in local DB
        setFormData(prev => ({
          ...prev,
          ...nationalData,
          poliTujuan: '', // Keep empty for user to select
          keluhanUtama: ''
        }));
        addNotification({ 
          type: 'success', 
          message: '✓ Data ditemukan di database nasional! Data telah diisi otomatis.' 
        });
      } else {
        addNotification({ type: 'info', message: 'Pasien baru, silakan lengkapi data' });
        setExistingPatient(null);
        setNationalDbFound(false);
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      addNotification({ type: 'error', message: 'Gagal mencari data pasien' });
    } finally {
      setLoading(false);
    }
  };

  const simulateNationalDbLookup = (searchValue, type) => {
    // Simulate national database with mock data
    // In production, this would call SATUSEHAT/Dukcapil API
    
    if (type === 'nik' && searchValue.length === 16) {
      // Extract info from NIK (simplified)
      const genderCode = parseInt(searchValue.substring(6, 8));
      
      // Mock names based on last 4 digits
      const namePool = [
        'Ahmad Wijaya', 'Budi Santoso', 'Citra Dewi', 'Dian Permata',
        'Eko Prasetyo', 'Fitri Handayani', 'Gunawan', 'Hendra Saputra',
        'Indah Sari', 'Joko Widodo', 'Kartika Putri', 'Lestari',
        'Maya Sari', 'Nur Hidayah', 'Oki Rahman', 'Putri Ayu'
      ];
      
      const lastDigits = parseInt(searchValue.substring(12));
      const nameIndex = lastDigits % namePool.length;
      
      const jenisKelamin = genderCode > 40 ? 'P' : 'L';
      const day = genderCode > 40 ? genderCode - 40 : genderCode;
      const month = searchValue.substring(8, 10);
      const year = '19' + searchValue.substring(10, 12);
      
      return {
        [type]: searchValue,
        nama: namePool[nameIndex],
        tanggalLahir: `${year}-${month}-${day.toString().padStart(2, '0')}`,
        jenisKelamin: jenisKelamin,
        alamat: `Jl. Contoh No. ${lastDigits % 100}, Jakarta`,
        telepon: `08${lastDigits.toString().padStart(10, '0')}`,
        statusPasien: 'umum'
      };
    }
    
    if (type === 'nrp' && searchValue.length >= 8) {
      // Mock NRP lookup
      const namePool = [
        'Letda Agus Setiawan', 'Kapten Bambang Priyono', 'Mayor Candra Wijaya',
        'Letda Dwi Hartono', 'Kapten Eko Yulianto', 'Mayor Fajar Hidayat'
      ];
      
      const lastDigits = parseInt(searchValue.substring(searchValue.length - 4));
      const nameIndex = lastDigits % namePool.length;
      
      return {
        [type]: searchValue,
        nama: namePool[nameIndex],
        tanggalLahir: '1985-01-15',
        jenisKelamin: 'L',
        alamat: 'Asrama TNI AU, Jakarta',
        telepon: `0812${lastDigits.toString().padStart(8, '0')}`,
        statusPasien: 'prajurit'
      };
    }
    
    return null;
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
          identitasType: formData.identitasType,
          nik: formData.nik,
          nrp: formData.nrp,
          nama: formData.nama,
          tanggalLahir: formData.tanggalLahir,
          jenisKelamin: formData.jenisKelamin,
          alamat: formData.alamat,
          telepon: formData.telepon,
          statusPasien: formData.statusPasien,
          namaKeluarga: formData.namaKeluarga,
          hubunganKeluarga: formData.hubunganKeluarga,
          nomorBPJS: formData.nomorBPJS,
          faskesId: selectedFaskes || 'default',
          createdAt: new Date()
        });
      }

      addNotification({ 
        type: 'success', 
        message: `Pasien berhasil didaftarkan! Nomor antrean: ${registrationData.nomorAntrean}` 
      });

      setFormData({
        identitasType: 'nik',
        nik: '',
        nrp: '',
        nama: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alamat: '',
        telepon: '',
        statusPasien: 'prajurit',
        namaKeluarga: '',
        hubunganKeluarga: '',
        poliTujuan: '',
        jenisKunjungan: 'umum',
        nomorBPJS: '',
        keluhanUtama: '',
        isRujukan: false,
        asalRujukan: '',
        nomorRujukan: '',
        diagnosisRujukan: ''
      });
      setExistingPatient(null);
      setNationalDbFound(false);
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
        {/* Identity Type & Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipe Identitas</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="identitasType"
                value="nik"
                checked={formData.identitasType === 'nik'}
                onChange={handleChange}
              />
              NIK (Nomor Induk Kependudukan)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="identitasType"
                value="nrp"
                checked={formData.identitasType === 'nrp'}
                onChange={handleChange}
              />
              NRP (Nomor Registrasi Prajurit)
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              name={formData.identitasType}
              value={formData.identitasType === 'nik' ? formData.nik : formData.nrp}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              placeholder={formData.identitasType === 'nik' ? 'Nomor Induk Kependudukan' : 'Nomor Registrasi Prajurit'}
              required
            />
            <button
              type="button"
              onClick={searchByIdentity}
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
            <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
              ✓ Data pasien ditemukan di database lokal
            </p>
          )}
          {nationalDbFound && !existingPatient && (
            <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              🌐 Data ditemukan di database nasional (SATUSEHAT/Dukcapil)
            </p>
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
            <label className="block text-sm font-medium mb-2">Status Pasien</label>
            <select
              name="statusPasien"
              value={formData.statusPasien}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="prajurit">Prajurit TNI AU</option>
              <option value="pns">PNS TNI AU</option>
              <option value="keluarga">Keluarga/Ahli Waris</option>
              <option value="umum">Umum</option>
            </select>
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

        {/* Family Member Fields */}
        {formData.statusPasien === 'keluarga' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm mb-2">Data Keluarga/Ahli Waris</h4>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Prajurit/PNS</label>
              <input
                type="text"
                name="namaKeluarga"
                value={formData.namaKeluarga}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nama kepala keluarga (Prajurit/PNS)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hubungan Keluarga</label>
              <select
                name="hubunganKeluarga"
                value={formData.hubunganKeluarga}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih...</option>
                {hubunganKeluargaOptions.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        )}

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

        {/* Referral Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={formData.isRujukan}
              onChange={(e) => setFormData(prev => ({ ...prev, isRujukan: e.target.checked }))}
            />
            <span className="font-medium">Pasien Rujukan</span>
          </label>
          
          {formData.isRujukan && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Asal Rujukan</label>
                <input
                  type="text"
                  name="asalRujukan"
                  value={formData.asalRujukan}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Nama faskes asal rujukan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nomor Rujukan</label>
                <input
                  type="text"
                  name="nomorRujukan"
                  value={formData.nomorRujukan}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Nomor surat rujukan"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Diagnosis Rujukan</label>
                <textarea
                  name="diagnosisRujukan"
                  value={formData.diagnosisRujukan}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Diagnosis dari faskes perujuk"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setFormData({
                identitasType: 'nik',
                nik: '',
                nrp: '',
                nama: '',
                tanggalLahir: '',
                jenisKelamin: '',
                alamat: '',
                telepon: '',
                statusPasien: 'prajurit',
                namaKeluarga: '',
                hubunganKeluarga: '',
                poliTujuan: '',
                jenisKunjungan: 'umum',
                nomorBPJS: '',
                keluhanUtama: '',
                isRujukan: false,
                asalRujukan: '',
                nomorRujukan: '',
                diagnosisRujukan: ''
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
