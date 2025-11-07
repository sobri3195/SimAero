import React from 'react';
import Layout from '../components/common/Layout';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const HyperbaricPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Activity className="text-cyan-600" size={36} />
            Hyperbaric Medicine
          </h1>
          <p className="text-gray-600 mt-2">
            Pengobatan Hiperbarik & Oksigen Bertekanan Tinggi - TNI AL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Chambers</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
              <Activity className="text-cyan-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Treatments Today</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <Clock className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-gray-800">96%</p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Emergency Cases</p>
                <p className="text-2xl font-bold text-gray-800">4</p>
              </div>
              <AlertCircle className="text-yellow-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Indikasi Terapi Hiperbarik</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-cyan-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Decompression Illness</h3>
              <p className="text-sm text-gray-600">Penyakit dekompresi pada penyelam</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Gas Embolism</h3>
              <p className="text-sm text-gray-600">Emboli gas arterial</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Carbon Monoxide Poisoning</h3>
              <p className="text-sm text-gray-600">Keracunan karbon monoksida</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Wound Healing</h3>
              <p className="text-sm text-gray-600">Penyembuhan luka yang sulit</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Crush Injuries</h3>
              <p className="text-sm text-gray-600">Cedera kompresi/crush injury</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4 py-3">
              <h3 className="font-semibold text-gray-800">Radiation Injury</h3>
              <p className="text-sm text-gray-600">Cedera akibat radiasi</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
          <p className="text-cyan-800">
            <strong>Info:</strong> Fasilitas Hyperbaric Chamber merupakan keunggulan TNI AL untuk menangani kondisi medis yang memerlukan oksigen bertekanan tinggi.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default HyperbaricPage;
