import React from 'react';
import { Heart, FileText, Users, TrendingUp } from 'lucide-react';

const RikkesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pemeriksaan Kesehatan (Rikkes)</h1>
        <p className="text-gray-600">Sistem pemeriksaan kesehatan berkala untuk personel dan pasien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Pemeriksaan</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-green-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Selesai Bulan Ini</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-yellow-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Dalam Proses</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-purple-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0%</span>
          </div>
          <h3 className="text-gray-600 text-sm">Completion Rate</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Pemeriksaan Rikkes</h3>
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 mb-4">Belum ada data pemeriksaan rikkes</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Tambah Pemeriksaan Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default RikkesPage;
