import React from 'react';
import Layout from '../components/common/Layout';
import { Shield, AlertTriangle, Map, Users } from 'lucide-react';

const FieldMedicinePage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Shield className="text-green-600" size={36} />
            Kedokteran Lapangan
          </h1>
          <p className="text-gray-600 mt-2">
            Field Medicine & Tactical Medical Operations - TNI AD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Field Medics</p>
                <p className="text-2xl font-bold text-gray-800">125</p>
              </div>
              <Shield className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Field Operations</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <Map className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Training Sessions</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
              <Users className="text-yellow-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Combat Drills</p>
                <p className="text-2xl font-bold text-gray-800">16</p>
              </div>
              <AlertTriangle className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Fitur Kedokteran Lapangan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Field Medical Training</h3>
              <p className="text-sm text-gray-600">Pelatihan medis lapangan untuk personel TNI AD</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Tactical Medicine</h3>
              <p className="text-sm text-gray-600">Tindakan medis dalam situasi taktis dan tempur</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Tactical Evacuation</h3>
              <p className="text-sm text-gray-600">Prosedur evakuasi medis di medan operasi</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Field Hospital Setup</h3>
              <p className="text-sm text-gray-600">Pendirian dan manajemen rumah sakit lapangan</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            <strong>Info:</strong> Modul Kedokteran Lapangan menyediakan fitur khusus untuk TNI AD dalam operasi lapangan dan dukungan medis tempur.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FieldMedicinePage;
