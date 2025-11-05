import React, { useState, useEffect } from 'react';
import { collection, getDocs } from '../mockDb';
import { db } from '../mockDb';
import { Search } from 'lucide-react';
import Card from '../components/common/Card';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const patientList = [];
      querySnapshot.forEach((doc) => {
        patientList.push({ id: doc.id, ...doc.data() });
      });
      setPatients(patientList);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.nik?.includes(searchQuery)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Database Pasien Terpusat</h1>

      <Card>
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari pasien berdasarkan nama atau NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
            />
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Search size={20} />
              Cari
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Memuat data pasien...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">NIK</th>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Tanggal Lahir</th>
                  <th className="text-left py-3 px-4">Jenis Kelamin</th>
                  <th className="text-left py-3 px-4">Telepon</th>
                  <th className="text-center py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-600">
                      {searchQuery ? 'Tidak ada pasien ditemukan' : 'Belum ada data pasien'}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{patient.nik}</td>
                      <td className="py-3 px-4 font-medium">{patient.nama}</td>
                      <td className="py-3 px-4">{patient.tanggalLahir}</td>
                      <td className="py-3 px-4">{patient.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-3 px-4">{patient.telepon}</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:underline">
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;
