import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, Activity, Users, AlertCircle, TrendingUp, MapPin, List } from 'lucide-react';
import { collection, getDocs } from '../../mockDb';
import { db } from '../../mockDb';

const DashboardPuskesau = () => {
  const navigate = useNavigate();
  const { switchToRSAU, switchToFKTP } = useAuth();
  const [rsauList, setRsauList] = useState([]);
  const [fktpList, setFktpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRSAU: 0,
    totalFKTP: 0,
    totalPatients: 0,
    totalCapacity: 0
  });

  useEffect(() => {
    loadFaskesData();
  }, []);

  const loadFaskesData = async () => {
    try {
      const faskesSnapshot = await getDocs(collection(db, 'faskes'));
      const allFaskes = [];
      faskesSnapshot.forEach((doc) => {
        allFaskes.push(doc.data());
      });

      const rsau = allFaskes.filter(f => f.tipe === 'rsau');
      const fktp = allFaskes.filter(f => f.tipe === 'fktp');

      setRsauList(rsau);
      setFktpList(fktp);

      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      const totalCapacity = allFaskes.reduce((sum, f) => sum + (f.kapasitas || 0), 0);

      setStats({
        totalRSAU: rsau.length,
        totalFKTP: fktp.length,
        totalPatients: patientsSnapshot.size,
        totalCapacity: totalCapacity
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading faskes data:', error);
      setLoading(false);
    }
  };

  const handleAccessRSAU = (rsau) => {
    switchToRSAU(rsau.nama);
  };

  const handleAccessFKTP = (fktp) => {
    switchToFKTP(fktp.nama);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Puskesau</h1>
        <p className="text-gray-600 mt-2">Pengawasan & Monitoring Fasilitas Kesehatan TNI AU</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total RSAU</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalRSAU}</p>
            </div>
            <Building2 className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total FKTP</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalFKTP}</p>
            </div>
            <Activity className="text-green-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pasien</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalPatients}</p>
            </div>
            <Users className="text-purple-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kapasitas Total</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCapacity}</p>
            </div>
            <TrendingUp className="text-orange-600" size={40} />
          </div>
        </div>
      </div>

      {/* RSAU Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" />
            Rumah Sakit Angkatan Udara (RSAU)
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{rsauList.length} Rumah Sakit</span>
            <button
              onClick={() => navigate('/rsau-list')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <List size={16} />
              Lihat Semua RSAU
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rsauList.map((rsau) => (
            <div key={rsau.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">{rsau.nama}</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin size={12} />
                    {rsau.lokasi}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  rsau.tingkat === 'A' ? 'bg-blue-100 text-blue-800' : 
                  rsau.tingkat === 'B' ? 'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Tingkat {rsau.tingkat}
                </span>
              </div>
              
              <div className="space-y-1 mb-3">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Lanud:</span> {rsau.lanud}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Kapasitas:</span> {rsau.kapasitas} TT
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {rsau.fasilitasUtama?.slice(0, 2).map((fasilitas, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {fasilitas}
                    </span>
                  ))}
                  {rsau.fasilitasUtama?.length > 2 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      +{rsau.fasilitasUtama.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleAccessRSAU(rsau)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Akses SIMRS
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FKTP Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-green-600" />
            Fasilitas Kesehatan Tingkat Pertama (FKTP)
          </h2>
          <span className="text-sm text-gray-600">{fktpList.length} Klinik</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fktpList.map((fktp) => (
            <div key={fktp.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="mb-3">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{fktp.nama}</h3>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin size={12} />
                  {fktp.lokasi}
                </p>
              </div>
              
              <div className="space-y-1 mb-3">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Lanud:</span> {fktp.lanud}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Kapasitas:</span> {fktp.kapasitas}
                </p>
              </div>
              
              <button
                onClick={() => handleAccessFKTP(fktp)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Akses SIM Klinik
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Informasi Pengawasan</h3>
            <p className="text-sm text-blue-800">
              Sebagai Puskesau (Pusat Kesehatan Angkatan Udara), Anda dapat mengakses dan mengawasi 
              seluruh sistem SIMRS di RSAU dan SIM Klinik di FKTP. Klik tombol "Akses" pada fasilitas 
              yang ingin Anda awasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPuskesau;
