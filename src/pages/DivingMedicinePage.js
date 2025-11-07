import React from 'react';
import Layout from '../components/common/Layout';
import { Activity, Waves, Heart, Shield } from 'lucide-react';

const DivingMedicinePage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Waves className="text-blue-600" size={36} />
            Kedokteran Selam
          </h1>
          <p className="text-gray-600 mt-2">
            Diving Medicine & Submarine Health - TNI AL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Diving Medicals</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
              <Waves className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hyperbaric Treatments</p>
                <p className="text-2xl font-bold text-gray-800">45</p>
              </div>
              <Activity className="text-cyan-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Submarine Crew Checks</p>
                <p className="text-2xl font-bold text-gray-800">89</p>
              </div>
              <Shield className="text-teal-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Decompression Cases</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <Heart className="text-green-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Layanan Kedokteran Selam</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Diving Medical Examination</h3>
              <p className="text-sm text-gray-600">Pemeriksaan kesehatan khusus untuk penyelam</p>
            </div>
            <div className="border-l-4 border-cyan-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Submarine Medical Fitness</h3>
              <p className="text-sm text-gray-600">Evaluasi kesehatan awak kapal selam</p>
            </div>
            <div className="border-l-4 border-teal-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Decompression Sickness Treatment</h3>
              <p className="text-sm text-gray-600">Perawatan penyakit dekompresi</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Maritime Health Operations</h3>
              <p className="text-sm text-gray-600">Operasi kesehatan maritim dan laut</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            <strong>Info:</strong> Kedokteran Selam adalah spesialisasi khusus TNI AL untuk mendukung operasi bawah air dan kelautan.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DivingMedicinePage;
