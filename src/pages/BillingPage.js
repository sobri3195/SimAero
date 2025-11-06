import React from 'react';
import { DollarSign, FileText, CreditCard, TrendingUp } from 'lucide-react';

const BillingPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Billing & Pembayaran</h1>
        <p className="text-gray-600">Kelola tagihan, pembayaran, dan laporan keuangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">Rp 0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Pendapatan Hari Ini</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-green-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Tagihan Lunas</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="text-yellow-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Tagihan Pending</h3>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-purple-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">Rp 0</span>
          </div>
          <h3 className="text-gray-600 text-sm">Pendapatan Bulan Ini</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Tagihan</h3>
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 mb-4">Belum ada data tagihan</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Buat Tagihan Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
