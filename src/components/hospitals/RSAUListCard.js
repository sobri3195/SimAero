import React from 'react';
import { Building2, MapPin, Bed, Activity } from 'lucide-react';

const RSAUListCard = () => {
  const rsauList = [
    { no: 1, name: 'RSPAU dr. Suhardi Hardjolukito', location: 'Yogyakarta', lanud: 'Lanud Adisutjipto', tingkat: 'A', kapasitas: 300 },
    { no: 2, name: 'RSAU dr. Esnawan Antariksa', location: 'Jakarta Timur', lanud: 'Lanud Halim Perdanakusuma', tingkat: 'A', kapasitas: 250 },
    { no: 3, name: 'RSAU dr. Moch. Salamun', location: 'Bandung', lanud: 'Lanud Sulaiman', tingkat: 'A', kapasitas: 220 },
    { no: 4, name: 'RSGM drg.R.Poerwanto', location: 'Jakarta', lanud: 'Lanud Halim Perdanakusuma', tingkat: 'A', kapasitas: 100 },
    { no: 5, name: 'RSAU dr. Hasan Toto Lanud Atang Sendjaja', location: 'Bogor', lanud: 'Lanud Atang Sendjaja', tingkat: 'B', kapasitas: 150 },
    { no: 6, name: 'RSAU dr. Efram Harsana Lanud Iswahjudi', location: 'Madiun', lanud: 'Lanud Iswahjudi', tingkat: 'B', kapasitas: 140 },
    { no: 7, name: 'RSAU dr. Dody Sardjoto Lanud Hasanuddin', location: 'Makassar', lanud: 'Lanud Hasanuddin', tingkat: 'B', kapasitas: 160 },
    { no: 8, name: 'RSAU dr. Siswanto Lanud Adi Soemarmo', location: 'Solo', lanud: 'Lanud Adi Soemarmo', tingkat: 'B', kapasitas: 130 },
    { no: 9, name: 'RSAU dr. M. Munir Lanud Abdulrachman Saleh', location: 'Malang', lanud: 'Lanud Abdulrachman Saleh', tingkat: 'B', kapasitas: 135 },
    { no: 10, name: 'RSAU dr. Mohammad Moenir Lanud Abd (Baru)', location: 'Medan', lanud: 'Lanud Soewondo', tingkat: 'B', kapasitas: 140 },
    { no: 11, name: 'RSAU dr. Sukirman Lanud Roesmin Nurjadin', location: 'Pekanbaru', lanud: 'Lanud Roesmin Nurjadin', tingkat: 'B', kapasitas: 120 },
    { no: 12, name: 'RSAU dr. Mohammad Sutomo Lanud Supadio', location: 'Pontianak', lanud: 'Lanud Supadio', tingkat: 'B', kapasitas: 125 },
    { no: 13, name: 'RSAU. dr. Yuniati Wisma Karyani Lanud R.Sadjad', location: 'Natuna', lanud: 'Lanud Raden Sadjad', tingkat: 'C', kapasitas: 80 },
    { no: 14, name: 'RSAU dr. Hoediono Lanud Suryadarma', location: 'Karawang', lanud: 'Lanud Suryadarma', tingkat: 'C', kapasitas: 100 },
    { no: 15, name: 'RSAU dr. Abdul Malik Lanud Soewondo', location: 'Medan', lanud: 'Lanud Soewondo', tingkat: 'B', kapasitas: 130 },
    { no: 16, name: 'RSAU Soemitro Lanud Surabaya', location: 'Surabaya', lanud: 'Lanud Juanda', tingkat: 'B', kapasitas: 180 },
    { no: 17, name: 'RS TNI AU Sjamsudin Noor', location: 'Banjarmasin', lanud: 'Lanud Sjamsudin Noor', tingkat: 'B', kapasitas: 110 },
    { no: 18, name: 'RSAU dr. Charles P. J. Suoth Lanud Sam Ratulangi', location: 'Manado', lanud: 'Lanud Sam Ratulangi', tingkat: 'B', kapasitas: 120 },
    { no: 19, name: 'RSAU dr. Norman T. Lubis Lanud Sulaiman', location: 'Bandung', lanud: 'Lanud Sulaiman', tingkat: 'B', kapasitas: 140 },
    { no: 20, name: 'Rumkit Lanud Dhomber', location: 'Papua (Timika)', lanud: 'Lanud Dhomber', tingkat: 'C', kapasitas: 60 },
    { no: 21, name: 'Rumkit Lanud Silas Papare', location: 'Jayapura', lanud: 'Lanud Silas Papare', tingkat: 'C', kapasitas: 70 },
    { no: 22, name: 'RSAU. dr. Kresno Lanud Manuhua, Biak', location: 'Biak', lanud: 'Lanud Manuhua', tingkat: 'C', kapasitas: 75 },
    { no: 23, name: 'RSAU Lanud Eltari', location: 'Kupang', lanud: 'Lanud Eltari', tingkat: 'C', kapasitas: 85 }
  ];

  const tingkatA = rsauList.filter(rs => rs.tingkat === 'A');
  const tingkatB = rsauList.filter(rs => rs.tingkat === 'B');
  const tingkatC = rsauList.filter(rs => rs.tingkat === 'C');

  const totalKapasitas = rsauList.reduce((sum, rs) => sum + rs.kapasitas, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Building2 className="text-blue-600" size={28} />
          Daftar 23 Rumah Sakit Angkatan Udara (RSAU) TNI AU
        </h2>
        <p className="text-gray-600">
          Seluruh RSAU di bawah pengawasan PUSKESAU (Pusat Kesehatan TNI Angkatan Udara)
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-center">
            <Building2 className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-blue-600">{rsauList.length}</p>
            <p className="text-sm text-gray-600">Total RSAU</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-center">
            <Activity className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-green-600">{tingkatA.length}</p>
            <p className="text-sm text-gray-600">Tingkat A</p>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-center">
            <Activity className="text-yellow-600 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-yellow-600">{tingkatB.length}</p>
            <p className="text-sm text-gray-600">Tingkat B</p>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-center">
            <Bed className="text-orange-600 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-orange-600">{totalKapasitas}</p>
            <p className="text-sm text-gray-600">Total TT</p>
          </div>
        </div>
      </div>

      {/* RSAU List */}
      <div className="space-y-4">
        {/* Tingkat A */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded">
            <Activity className="text-blue-600" size={20} />
            Tingkat A - Rumah Sakit Tipe A ({tingkatA.length})
          </h3>
          <div className="space-y-2 ml-4">
            {tingkatA.map((rs) => (
              <div key={rs.no} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-blue-50 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {rs.no}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{rs.name}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {rs.location}
                    </span>
                    <span>• {rs.lanud}</span>
                    <span className="flex items-center gap-1">
                      <Bed size={12} />
                      {rs.kapasitas} TT
                    </span>
                  </div>
                </div>
                <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                  Tingkat A
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tingkat B */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 bg-green-50 px-3 py-2 rounded">
            <Activity className="text-green-600" size={20} />
            Tingkat B - Rumah Sakit Tipe B ({tingkatB.length})
          </h3>
          <div className="space-y-2 ml-4">
            {tingkatB.map((rs) => (
              <div key={rs.no} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-green-50 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {rs.no}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{rs.name}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {rs.location}
                    </span>
                    <span>• {rs.lanud}</span>
                    <span className="flex items-center gap-1">
                      <Bed size={12} />
                      {rs.kapasitas} TT
                    </span>
                  </div>
                </div>
                <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                  Tingkat B
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tingkat C */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded">
            <Activity className="text-yellow-600" size={20} />
            Tingkat C - Rumah Sakit Tipe C & Rumkit ({tingkatC.length})
          </h3>
          <div className="space-y-2 ml-4">
            {tingkatC.map((rs) => (
              <div key={rs.no} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-yellow-50 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {rs.no}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{rs.name}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {rs.location}
                    </span>
                    <span>• {rs.lanud}</span>
                    <span className="flex items-center gap-1">
                      <Bed size={12} />
                      {rs.kapasitas} TT
                    </span>
                  </div>
                </div>
                <span className="flex-shrink-0 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                  Tingkat C
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Catatan:</strong> Semua 23 RSAU tersebut aktif beroperasi dan terintegrasi dalam 
          Sistem Informasi Manajemen Rumah Sakit (SIMRS) TNI Angkatan Udara. 
          Pengawasan terpusat dilakukan oleh PUSKESAU dengan total kapasitas {totalKapasitas.toLocaleString('id-ID')} tempat tidur.
        </p>
      </div>
    </div>
  );
};

export default RSAUListCard;
