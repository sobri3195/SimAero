import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Users, Activity } from 'lucide-react';
import Card from '../common/Card';

const ReportsAnalytics = () => {
  const { selectedFaskes } = useAuth();
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRegistrations: 0,
    totalInpatients: 0,
    totalLabOrders: 0,
    totalRadiologyOrders: 0,
    totalIncidents: 0
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!selectedFaskes) return;

    const fetchStats = () => {
      const queries = [
        query(collection(db, 'patients'), where('faskesId', '==', selectedFaskes)),
        query(collection(db, 'registrations'), where('faskesId', '==', selectedFaskes)),
        query(collection(db, 'inpatients'), where('faskesId', '==', selectedFaskes), where('status', '==', 'aktif')),
        query(collection(db, 'lab_orders'), where('faskesId', '==', selectedFaskes)),
        query(collection(db, 'radiology_orders'), where('faskesId', '==', selectedFaskes)),
        query(collection(db, 'incidents'), where('faskesId', '==', selectedFaskes))
      ];

      const unsubscribers = [];

      unsubscribers.push(
        onSnapshot(queries[0], (snapshot) => {
          setStats(prev => ({ ...prev, totalPatients: snapshot.size }));
        })
      );

      unsubscribers.push(
        onSnapshot(queries[1], (snapshot) => {
          setStats(prev => ({ ...prev, totalRegistrations: snapshot.size }));
        })
      );

      unsubscribers.push(
        onSnapshot(queries[2], (snapshot) => {
          setStats(prev => ({ ...prev, totalInpatients: snapshot.size }));
        })
      );

      unsubscribers.push(
        onSnapshot(queries[3], (snapshot) => {
          setStats(prev => ({ ...prev, totalLabOrders: snapshot.size }));
        })
      );

      unsubscribers.push(
        onSnapshot(queries[4], (snapshot) => {
          setStats(prev => ({ ...prev, totalRadiologyOrders: snapshot.size }));
        })
      );

      unsubscribers.push(
        onSnapshot(queries[5], (snapshot) => {
          setStats(prev => ({ ...prev, totalIncidents: snapshot.size }));
        })
      );

      return () => unsubscribers.forEach(unsub => unsub());
    };

    return fetchStats();
  }, [selectedFaskes]);

  const monthlyData = [
    { month: 'Jan', registrations: 120, inpatients: 45, labOrders: 80 },
    { month: 'Feb', registrations: 135, inpatients: 52, labOrders: 95 },
    { month: 'Mar', registrations: 148, inpatients: 48, labOrders: 110 },
    { month: 'Apr', registrations: 162, inpatients: 55, labOrders: 125 },
    { month: 'Mei', registrations: 178, inpatients: 60, labOrders: 140 },
    { month: 'Jun', registrations: 190, inpatients: 58, labOrders: 155 }
  ];

  const serviceData = [
    { name: 'Rawat Jalan', value: 450 },
    { name: 'Rawat Inap', value: 280 },
    { name: 'IGD', value: 320 },
    { name: 'Laboratorium', value: 560 },
    { name: 'Radiologi', value: 240 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <Card title="Laporan & Analitik">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pasien</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <Users size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registrasi</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalRegistrations}</p>
              </div>
              <FileText size={32} className="text-green-500" />
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rawat Inap Aktif</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalInpatients}</p>
              </div>
              <Activity size={32} className="text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="mb-4 flex gap-2 border-b">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab('trends')} className={`px-4 py-2 ${activeTab === 'trends' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Tren
          </button>
          <button onClick={() => setActiveTab('services')} className={`px-4 py-2 ${activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>
            Layanan
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded">
                <p className="text-xs text-gray-600">Lab Orders</p>
                <p className="text-xl font-bold">{stats.totalLabOrders}</p>
              </div>
              <div className="p-3 border rounded">
                <p className="text-xs text-gray-600">Radiologi Orders</p>
                <p className="text-xl font-bold">{stats.totalRadiologyOrders}</p>
              </div>
              <div className="p-3 border rounded">
                <p className="text-xs text-gray-600">Insiden</p>
                <p className="text-xl font-bold">{stats.totalIncidents}</p>
              </div>
              <div className="p-3 border rounded">
                <p className="text-xs text-gray-600">Bed Occupancy</p>
                <p className="text-xl font-bold">75%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            <h4 className="font-medium mb-3">Tren Bulanan</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="registrations" stroke="#3B82F6" name="Registrasi" />
                <Line type="monotone" dataKey="inpatients" stroke="#10B981" name="Rawat Inap" />
                <Line type="monotone" dataKey="labOrders" stroke="#F59E0B" name="Lab Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Distribusi Layanan</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-medium mb-3">Volume Layanan</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <Download size={16} />
            Export Laporan
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
