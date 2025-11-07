import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import PageHeader from '../components/common/PageHeader';
import RSAUListCard from '../components/hospitals/RSAUListCard';
import { Building2, Download, Printer } from 'lucide-react';

const RSAUDirectoryPage = () => {
  const handleExport = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/docs/DAFTAR_RSAU_TNI_AU.md';
    link.download = 'Daftar_RSAU_TNI_AU.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <PageHeader
        title="Direktori RSAU TNI Angkatan Udara"
        subtitle="Daftar lengkap 23 Rumah Sakit Angkatan Udara di seluruh Indonesia"
        actionLabel="Cetak"
        actionIcon={<Printer size={18} />}
        onActionClick={handleExport}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} />
          Cetak Daftar
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={18} />
          Download Dokumentasi
        </button>
      </div>

      {/* Main Content */}
      <RSAUListCard />

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 print:hidden">
        <div className="flex items-start gap-4">
          <Building2 className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Tentang RSAU TNI Angkatan Udara</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                Rumah Sakit Angkatan Udara (RSAU) merupakan fasilitas kesehatan yang dikelola oleh TNI Angkatan Udara 
                untuk memberikan pelayanan kesehatan kepada anggota TNI AU, PNS, pensiunan, dan keluarganya.
              </p>
              <p>
                <strong>Klasifikasi RSAU:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Tingkat A:</strong> Rumah sakit rujukan tertier dengan pelayanan spesialistik dan subspesialistik lengkap</li>
                <li><strong>Tingkat B:</strong> Rumah sakit rujukan sekunder dengan pelayanan spesialistik dasar</li>
                <li><strong>Tingkat C:</strong> Rumah sakit dengan pelayanan medis dasar dan spesialis terbatas</li>
              </ul>
              <p className="mt-3">
                <strong>Keunggulan RSAU:</strong> Selain pelayanan medis umum, RSAU memiliki keahlian khusus dalam 
                <em> Aerospace Medicine</em> (Kedokteran Penerbangan) untuk mendukung operasional personel TNI AU, 
                termasuk Rikkes Terbang (Flight Fitness Assessment) untuk pilot dan awak pesawat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="text-blue-600" size={20} />
            Distribusi Regional
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Pulau Jawa</span>
              <span className="font-semibold text-gray-800">11 RSAU</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Sumatera</span>
              <span className="font-semibold text-gray-800">3 RSAU</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Kalimantan</span>
              <span className="font-semibold text-gray-800">2 RSAU</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Sulawesi</span>
              <span className="font-semibold text-gray-800">2 RSAU</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Papua & Maluku</span>
              <span className="font-semibold text-gray-800">3 RSAU</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Nusa Tenggara & Kepulauan</span>
              <span className="font-semibold text-gray-800">2 RSAU</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="text-green-600" size={20} />
            Kapasitas Total
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">RSAU Tingkat A</span>
              <span className="font-semibold text-gray-800">870 TT</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">RSAU Tingkat B</span>
              <span className="font-semibold text-gray-800">1,595 TT</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">RSAU Tingkat C</span>
              <span className="font-semibold text-gray-800">470 TT</span>
            </div>
            <div className="flex justify-between py-3 bg-blue-50 px-3 rounded mt-2">
              <span className="text-gray-800 font-semibold">Total Kapasitas</span>
              <span className="font-bold text-blue-600 text-lg">2,935 TT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSAUDirectoryPage;
