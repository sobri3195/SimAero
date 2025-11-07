import React from 'react';
import Layout from '../components/common/Layout';
import { AlertTriangle, Heart, Shield, Activity } from 'lucide-react';

const CombatCarePage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={36} />
            Combat Casualty Care
          </h1>
          <p className="text-gray-600 mt-2">
            Perawatan Korban Tempur & Trauma Militer - TNI AD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Combat Casualties</p>
                <p className="text-2xl font-bold text-gray-800">32</p>
              </div>
              <AlertTriangle className="text-red-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Trauma Cases</p>
                <p className="text-2xl font-bold text-gray-800">78</p>
              </div>
              <Heart className="text-orange-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Training Completed</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
              <Shield className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Lives Saved</p>
                <p className="text-2xl font-bold text-gray-800">94</p>
              </div>
              <Activity className="text-green-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Combat Casualty Care Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-red-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">TCCC (Tactical Combat Casualty Care)</h3>
              <p className="text-sm text-gray-600">Protokol standar perawatan korban dalam pertempuran</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Trauma Life Support</h3>
              <p className="text-sm text-gray-600">Dukungan hidup untuk trauma berat</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Hemorrhage Control</h3>
              <p className="text-sm text-gray-600">Kontrol perdarahan dan stabilisasi</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Field Triage</h3>
              <p className="text-sm text-gray-600">Sistem triase di medan pertempuran</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">
            <strong>Penting:</strong> Combat Casualty Care adalah komponen kritis dalam operasi militer TNI AD untuk menyelamatkan nyawa di medan pertempuran.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CombatCarePage;
