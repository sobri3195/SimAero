import React from 'react';
import Layout from '../components/common/Layout';
import { Waves, CheckCircle, AlertCircle, Activity } from 'lucide-react';

const DivingMedicalPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Waves className="text-blue-600" size={36} />
            Diving Medical Check
          </h1>
          <p className="text-gray-600 mt-2">
            Pemeriksaan Kesehatan Selam - TNI AL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Divers Checked</p>
                <p className="text-2xl font-bold text-gray-800">89</p>
              </div>
              <Waves className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fit to Dive</p>
                <p className="text-2xl font-bold text-gray-800">76</p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Follow-up Required</p>
                <p className="text-2xl font-bold text-gray-800">13</p>
              </div>
              <AlertCircle className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Divers</p>
                <p className="text-2xl font-bold text-gray-800">245</p>
              </div>
              <Activity className="text-cyan-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Komponen Diving Medical Check</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Cardiopulmonary Assessment</h3>
              <p className="text-sm text-gray-600">Evaluasi jantung dan paru-paru</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">ENT Examination</h3>
              <p className="text-sm text-gray-600">Pemeriksaan telinga, hidung, tenggorokan</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Neurological Check</h3>
              <p className="text-sm text-gray-600">Pemeriksaan neurologis</p>
            </div>
            <div className="border-l-4 border-cyan-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Hyperbaric Fitness</h3>
              <p className="text-sm text-gray-600">Kesesuaian untuk lingkungan hiperbarik</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            <strong>Info:</strong> Diving Medical Check memastikan keselamatan personel penyelam TNI AL dalam operasi bawah air.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DivingMedicalPage;
