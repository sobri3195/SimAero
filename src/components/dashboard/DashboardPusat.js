import React, { useState, useEffect } from 'react';
import { Users, Activity, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where } from '../../mockDb';
import { db } from '../../mockDb';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const DashboardPusat = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeHospitals: 0,
    logisticsOrders: 0,
    avgBOR: 0
  });

  const [hospitalStatus] = useState([
    { name: 'RSAU Dr. Esnawan Antariksa', location: 'Jakarta', bor: 78, igd: 'Normal', or: 3, ambulance: 5, status: 'Siaga' },
    { name: 'RSAU Dr. M. Salamun', location: 'Bandung', bor: 65, igd: 'Sibuk', or: 2, ambulance: 3, status: 'Siaga' },
    { name: 'RSAU Dr. Hardjolukito', location: 'Yogyakarta', bor: 82, igd: 'Normal', or: 4, ambulance: 4, status: 'Siaga' },
    { name: 'RSAU Dr. Siswanto', location: 'Madiun', bor: 71, igd: 'Normal', or: 2, ambulance: 2, status: 'Siaga' }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'urgent', faskes: 'RSAU Jakarta', message: 'Kebutuhan darah O- segera', time: '5 menit lalu' },
    { id: 2, type: 'warning', faskes: 'RSAU Bandung', message: 'Kapasitas ICU 90%', time: '15 menit lalu' },
    { id: 3, type: 'info', faskes: 'RSAU Yogyakarta', message: 'Stok obat antibiotik menipis', time: '30 menit lalu' }
  ]);

  const sdmData = [
    { category: 'Dokter Umum', count: 145 },
    { category: 'Dokter Spesialis', count: 89 },
    { category: 'Perawat', count: 421 },
    { category: 'Bidan', count: 67 },
    { category: 'Farmasi', count: 54 },
    { category: 'Laboratorium', count: 38 }
  ];

  const logisticsTrend = [
    { month: 'Jan', medis: 450, umum: 320 },
    { month: 'Feb', medis: 480, umum: 340 },
    { month: 'Mar', medis: 520, umum: 380 },
    { month: 'Apr', medis: 490, umum: 360 },
    { month: 'May', medis: 550, umum: 400 },
    { month: 'Jun', medis: 580, umum: 420 }
  ];

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const patientsSnap = await getDocs(collection(db, 'patients'));
      const faskesSnap = await getDocs(collection(db, 'faskes'));
      const ordersSnap = await getDocs(query(collection(db, 'logistics'), where('status', '==', 'active')));

      const avgBOR = hospitalStatus.reduce((acc, h) => acc + h.bor, 0) / hospitalStatus.length;

      setStats({
        totalPatients: patientsSnap.size,
        activeHospitals: faskesSnap.size,
        logisticsOrders: ordersSnap.size,
        avgBOR: Math.round(avgBOR)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 border-red-500 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Komando Terintegrasi</h1>
        <p className="text-gray-600">Pemantauan Real-time Seluruh Faskes TNI AU</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Users}
          title="Total Pasien Aktif"
          value={stats.totalPatients}
          trend={5.2}
          color="blue"
        />
        <StatCard
          icon={Activity}
          title="Rata-rata BOR"
          value={`${stats.avgBOR}%`}
          trend={-2.1}
          color="green"
        />
        <StatCard
          icon={Package}
          title="Distribusi Logistik"
          value={stats.logisticsOrders}
          trend={8.5}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          title="Faskes Aktif"
          value={stats.activeHospitals}
          color="indigo"
        />
      </div>

      {/* Hospital Status Table */}
      <Card title="Status Kesiapan Rumah Sakit" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nama RSAU</th>
                <th className="text-left py-3 px-4">Lokasi</th>
                <th className="text-center py-3 px-4">BOR (%)</th>
                <th className="text-center py-3 px-4">Status IGD</th>
                <th className="text-center py-3 px-4">Ruang Operasi</th>
                <th className="text-center py-3 px-4">Ambulans</th>
                <th className="text-center py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {hospitalStatus.map((hospital, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{hospital.name}</td>
                  <td className="py-3 px-4">{hospital.location}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded ${hospital.bor > 80 ? 'bg-red-100 text-red-800' : hospital.bor > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {hospital.bor}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{hospital.igd}</td>
                  <td className="py-3 px-4 text-center">{hospital.or} Tersedia</td>
                  <td className="py-3 px-4 text-center">{hospital.ambulance} Unit</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {hospital.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* SDM Analytics */}
        <Card title="Komposisi SDM Kesehatan">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sdmData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Logistics Trend */}
        <Card title="Tren Ketersediaan Logistik (6 Bulan)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={logisticsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="medis" stroke="#1e40af" name="Logistik Medis" />
              <Line type="monotone" dataKey="umum" stroke="#0ea5e9" name="Logistik Umum" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alerts */}
      <Card title="Notifikasi & Peringatan Penting">
        <div className="space-y-3">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 border-l-4 rounded ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-medium">{alert.faskes}</p>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs mt-1 opacity-75">{alert.time}</p>
                  </div>
                </div>
                <button className="text-sm underline">Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPusat;
