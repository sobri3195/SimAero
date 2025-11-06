import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Users, Activity } from 'lucide-react';
import Card from '../common/Card';

const QueueStats = () => {
  const { selectedFaskes } = useAuth();
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    totalWaiting: 0,
    totalServing: 0,
    totalCompleted: 0,
    avgWaitTime: 0,
    criticalWaiting: 0
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'registrations'),
      where('faskesId', '==', selectedFaskes),
      where('tanggalDaftar', '>=', today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = [];
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        queueData.push(data);
      });

      setQueues(queueData);
      calculateStats(queueData);
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  const calculateStats = (queueData) => {
    const totalToday = queueData.length;
    const totalWaiting = queueData.filter(q => q.status === 'menunggu').length;
    const totalServing = queueData.filter(q => q.status === 'dilayani' || q.status === 'dipanggil').length;
    const totalCompleted = queueData.filter(q => q.status === 'selesai').length;

    const waitingQueues = queueData.filter(q => q.status === 'menunggu');
    const waitTimes = waitingQueues.map(q => {
      const now = new Date();
      const registered = new Date(q.tanggalDaftar);
      return Math.floor((now - registered) / 1000 / 60);
    });
    
    const avgWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;

    const criticalWaiting = waitingQueues.filter(q => {
      const now = new Date();
      const registered = new Date(q.tanggalDaftar);
      const diffMinutes = Math.floor((now - registered) / 1000 / 60);
      return diffMinutes >= 30;
    }).length;

    setStats({
      totalToday,
      totalWaiting,
      totalServing,
      totalCompleted,
      avgWaitTime,
      criticalWaiting
    });
  };

  const getPoliStats = () => {
    const poliCounts = {};
    queues.forEach(q => {
      if (!poliCounts[q.poliTujuan]) {
        poliCounts[q.poliTujuan] = {
          total: 0,
          menunggu: 0,
          dilayani: 0,
          selesai: 0
        };
      }
      poliCounts[q.poliTujuan].total++;
      if (q.status === 'menunggu') poliCounts[q.poliTujuan].menunggu++;
      if (q.status === 'dilayani' || q.status === 'dipanggil') poliCounts[q.poliTujuan].dilayani++;
      if (q.status === 'selesai') poliCounts[q.poliTujuan].selesai++;
    });

    return Object.entries(poliCounts).map(([poli, counts]) => ({
      poli: poli.length > 20 ? poli.substring(0, 20) + '...' : poli,
      fullName: poli,
      ...counts
    }));
  };

  const getStatusData = () => {
    return [
      { name: 'Menunggu', value: stats.totalWaiting, color: '#FCD34D' },
      { name: 'Dilayani', value: stats.totalServing, color: '#34D399' },
      { name: 'Selesai', value: stats.totalCompleted, color: '#9CA3AF' }
    ];
  };

  const getPatientTypeStats = () => {
    const typeCounts = {
      prajurit: 0,
      pns: 0,
      keluarga: 0,
      umum: 0
    };

    queues.forEach(q => {
      if (q.statusPasien) {
        typeCounts[q.statusPasien]++;
      }
    });

    return [
      { name: 'Prajurit', value: typeCounts.prajurit, color: '#3B82F6' },
      { name: 'PNS', value: typeCounts.pns, color: '#8B5CF6' },
      { name: 'Keluarga', value: typeCounts.keluarga, color: '#EC4899' },
      { name: 'Umum', value: typeCounts.umum, color: '#10B981' }
    ];
  };

  const getHourlyStats = () => {
    const hourlyCounts = {};
    
    queues.forEach(q => {
      const hour = new Date(q.tanggalDaftar).getHours();
      if (!hourlyCounts[hour]) {
        hourlyCounts[hour] = 0;
      }
      hourlyCounts[hour]++;
    });

    return Object.entries(hourlyCounts)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        jumlah: count
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  const poliStats = getPoliStats();
  const statusData = getStatusData();
  const patientTypeData = getPatientTypeStats();
  const hourlyStats = getHourlyStats();

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Antrean Hari Ini</p>
              <p className="text-4xl font-bold">{stats.totalToday}</p>
            </div>
            <Users size={48} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Sedang Menunggu</p>
              <p className="text-4xl font-bold">{stats.totalWaiting}</p>
              {stats.criticalWaiting > 0 && (
                <p className="text-xs mt-1 bg-red-500 inline-block px-2 py-1 rounded">
                  {stats.criticalWaiting} Kritis (&gt;30 menit)
                </p>
              )}
            </div>
            <Clock size={48} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Sedang Dilayani</p>
              <p className="text-4xl font-bold">{stats.totalServing}</p>
            </div>
            <Activity size={48} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Rata-rata Waktu Tunggu</p>
              <p className="text-4xl font-bold">{stats.avgWaitTime}</p>
              <p className="text-xs opacity-90">menit</p>
            </div>
            <TrendingUp size={48} className="opacity-80" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution Pie Chart */}
        <Card title="Distribusi Status Antrean">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Patient Type Distribution */}
        <Card title="Distribusi Tipe Pasien">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patientTypeData.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {patientTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Poli Statistics Bar Chart */}
      <Card title="Statistik Antrean per Poli" className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={poliStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="poli" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium mb-2">{data.fullName}</p>
                      <p className="text-sm text-blue-600">Total: {data.total}</p>
                      <p className="text-sm text-yellow-600">Menunggu: {data.menunggu}</p>
                      <p className="text-sm text-green-600">Dilayani: {data.dilayani}</p>
                      <p className="text-sm text-gray-600">Selesai: {data.selesai}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="menunggu" fill="#FCD34D" name="Menunggu" />
            <Bar dataKey="dilayani" fill="#34D399" name="Dilayani" />
            <Bar dataKey="selesai" fill="#9CA3AF" name="Selesai" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Hourly Registration Chart */}
      {hourlyStats.length > 0 && (
        <Card title="Grafik Pendaftaran per Jam">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#3B82F6" name="Jumlah Pendaftaran" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Detailed Poli Table */}
      <Card title="Detail Antrean per Poli" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 text-sm font-medium">Poli</th>
                <th className="text-center p-3 text-sm font-medium">Total</th>
                <th className="text-center p-3 text-sm font-medium">Menunggu</th>
                <th className="text-center p-3 text-sm font-medium">Dilayani</th>
                <th className="text-center p-3 text-sm font-medium">Selesai</th>
                <th className="text-center p-3 text-sm font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {poliStats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    Belum ada data antrean
                  </td>
                </tr>
              ) : (
                poliStats.map((poli, idx) => {
                  const completionRate = poli.total > 0 
                    ? Math.round((poli.selesai / poli.total) * 100)
                    : 0;
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{poli.fullName}</td>
                      <td className="text-center p-3 font-bold text-blue-600">{poli.total}</td>
                      <td className="text-center p-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                          {poli.menunggu}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {poli.dilayani}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {poli.selesai}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default QueueStats;
