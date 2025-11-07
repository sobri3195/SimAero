import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Activity, Bed } from 'lucide-react';
import { collection, getDocs } from '../mockDb';
import { db } from '../mockDb';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';

const RSAUListPage = () => {
  const [rsauList, setRsauList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTingkat, setFilterTingkat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRSAUData();
  }, []);

  const loadRSAUData = async () => {
    try {
      const faskesSnapshot = await getDocs(collection(db, 'faskes'));
      const allFaskes = [];
      faskesSnapshot.forEach((doc) => {
        allFaskes.push(doc.data());
      });

      const rsau = allFaskes.filter(f => f.tipe === 'rsau');
      setRsauList(rsau);
      setLoading(false);
    } catch (error) {
      console.error('Error loading RSAU data:', error);
      setLoading(false);
    }
  };

  const filteredRSAU = rsauList.filter(rsau => {
    const matchesTingkat = filterTingkat === 'all' || rsau.tingkat === filterTingkat;
    const matchesSearch = rsau.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rsau.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rsau.lanud.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTingkat && matchesSearch;
  });

  const stats = {
    total: rsauList.length,
    tingkatA: rsauList.filter(r => r.tingkat === 'A').length,
    tingkatB: rsauList.filter(r => r.tingkat === 'B').length,
    tingkatC: rsauList.filter(r => r.tingkat === 'C').length,
    totalKapasitas: rsauList.reduce((sum, r) => sum + (r.kapasitas || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Dashboard', path: '/' },
        { label: 'Daftar RSAU' }
      ]} />

      <PageHeader
        title="Daftar Rumah Sakit Angkatan Udara (RSAU)"
        subtitle={`Total ${rsauList.length} Rumah Sakit TNI AU di seluruh Indonesia`}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total RSAU</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Building2 className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tingkat A</p>
              <p className="text-2xl font-bold text-gray-800">{stats.tingkatA}</p>
            </div>
            <Activity className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tingkat B</p>
              <p className="text-2xl font-bold text-gray-800">{stats.tingkatB}</p>
            </div>
            <Activity className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tingkat C</p>
              <p className="text-2xl font-bold text-gray-800">{stats.tingkatC}</p>
            </div>
            <Activity className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kapasitas Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalKapasitas}</p>
            </div>
            <Bed className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Tingkat
            </label>
            <select
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Tingkat</option>
              <option value="A">Tingkat A</option>
              <option value="B">Tingkat B</option>
              <option value="C">Tingkat C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari RSAU
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama, lokasi, atau lanud..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* RSAU Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Daftar RSAU ({filteredRSAU.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRSAU.map((rsau, index) => (
            <div key={rsau.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm leading-tight">
                      {rsau.nama}
                    </h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin size={12} />
                      {rsau.lokasi}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
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
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Status:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    {rsau.status.charAt(0).toUpperCase() + rsau.status.slice(1)}
                  </span>
                </p>
              </div>

              <div className="border-t pt-2">
                <p className="text-xs font-semibold text-gray-700 mb-1">Fasilitas Utama:</p>
                <div className="flex flex-wrap gap-1">
                  {rsau.fasilitasUtama?.slice(0, 3).map((fasilitas, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {fasilitas}
                    </span>
                  ))}
                  {rsau.fasilitasUtama?.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      +{rsau.fasilitasUtama.length - 3} lainnya
                    </span>
                  )}
                </div>
              </div>

              {rsau.spesialisasi && rsau.spesialisasi.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Spesialisasi:</p>
                  <div className="flex flex-wrap gap-1">
                    {rsau.spesialisasi.slice(0, 3).map((spesialis, idx) => (
                      <span key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        {spesialis}
                      </span>
                    ))}
                    {rsau.spesialisasi.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{rsau.spesialisasi.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRSAU.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500">Tidak ada RSAU yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Summary by Tingkat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">Tingkat A</span>
            ({stats.tingkatA} RSAU)
          </h3>
          <ul className="space-y-2">
            {rsauList.filter(r => r.tingkat === 'A').map((rsau) => (
              <li key={rsau.id} className="text-sm text-gray-700">
                <span className="font-semibold">{rsau.nama}</span>
                <span className="text-gray-500"> - {rsau.lokasi}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Tingkat B</span>
            ({stats.tingkatB} RSAU)
          </h3>
          <ul className="space-y-2">
            {rsauList.filter(r => r.tingkat === 'B').map((rsau) => (
              <li key={rsau.id} className="text-sm text-gray-700">
                <span className="font-semibold">{rsau.nama}</span>
                <span className="text-gray-500"> - {rsau.lokasi}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">Tingkat C</span>
            ({stats.tingkatC} RSAU)
          </h3>
          <ul className="space-y-2">
            {rsauList.filter(r => r.tingkat === 'C').map((rsau) => (
              <li key={rsau.id} className="text-sm text-gray-700">
                <span className="font-semibold">{rsau.nama}</span>
                <span className="text-gray-500"> - {rsau.lokasi}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RSAUListPage;
