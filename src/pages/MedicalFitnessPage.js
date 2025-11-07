import React from 'react';
import Layout from '../components/common/Layout';
import { Shield, Activity, Heart, CheckCircle } from 'lucide-react';

const MedicalFitnessPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Shield className="text-green-600" size={36} />
            Medical Fitness
          </h1>
          <p className="text-gray-600 mt-2">
            Pemeriksaan Kebugaran Medis Personel - TNI AD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Personnel Checked</p>
                <p className="text-2xl font-bold text-gray-800">342</p>
              </div>
              <Shield className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fitness Tests</p>
                <p className="text-2xl font-bold text-gray-800">278</p>
              </div>
              <Activity className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Health Screenings</p>
                <p className="text-2xl font-bold text-gray-800">445</p>
              </div>
              <Heart className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fit for Duty</p>
                <p className="text-2xl font-bold text-gray-800">89%</p>
              </div>
              <CheckCircle className="text-purple-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Komponen Medical Fitness</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Physical Fitness Test</h3>
              <p className="text-sm text-gray-600">Tes kebugaran fisik dan kardiovaskular</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Medical Screening</h3>
              <p className="text-sm text-gray-600">Pemeriksaan kesehatan menyeluruh</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Psychological Assessment</h3>
              <p className="text-sm text-gray-600">Evaluasi kesehatan mental</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Operational Readiness</h3>
              <p className="text-sm text-gray-600">Kesiapan operasional personel</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">
            <strong>Info:</strong> Medical Fitness memastikan setiap personel TNI AD dalam kondisi fisik dan mental yang optimal untuk tugas operasional.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalFitnessPage;
