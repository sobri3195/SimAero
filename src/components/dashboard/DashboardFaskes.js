import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertTriangle, Activity, FileText, Pill, TestTube, Calendar, BedDouble, Droplet } from 'lucide-react';
import { collection, getDocs, query, where } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

const DashboardFaskes = () => {
  const { selectedFaskes, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    todayPatients: 0,
    avgWaitTime: 0,
    criticalStock: 0,
    pendingTasks: 0
  });

  const [tasks] = useState([
    { id: 1, type: 'pharmacy', title: 'Resep menunggu disiapkan', count: 5, priority: 'high' },
    { id: 2, type: 'lab', title: 'Hasil lab menunggu validasi', count: 3, priority: 'medium' },
    { id: 3, type: 'registration', title: 'Pasien menunggu > 30 menit', count: 2, priority: 'high' },
    { id: 4, type: 'inpatient', title: 'Pasien siap pulang', count: 4, priority: 'low' }
  ]);

  const rsauQuickAccess = [
    { icon: FileText, label: 'Pendaftaran', path: '/registration', color: 'bg-blue-500' },
    { icon: Activity, label: 'IGD', path: '/igd', color: 'bg-red-500' },
    { icon: BedDouble, label: 'Rawat Inap', path: '/inpatient', color: 'bg-green-500' },
    { icon: Calendar, label: 'Jadwal Operasi', path: '/surgery', color: 'bg-indigo-500' },
    { icon: Droplet, label: 'Bank Darah', path: '/bloodbank', color: 'bg-rose-500' },
    { icon: Pill, label: 'Farmasi', path: '/pharmacy', color: 'bg-purple-500' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab', color: 'bg-yellow-500' },
    { icon: Activity, label: 'CSSD', path: '/cssd', color: 'bg-teal-500' }
  ];

  const fktpQuickAccess = [
    { icon: FileText, label: 'Pendaftaran', path: '/registration', color: 'bg-blue-500' },
    { icon: Users, label: 'Database Pasien', path: '/patients', color: 'bg-green-500' },
    { icon: Pill, label: 'Farmasi', path: '/pharmacy', color: 'bg-purple-500' },
    { icon: TestTube, label: 'Laboratorium', path: '/lab', color: 'bg-yellow-500' }
  ];

  const quickAccess = userRole === 'RSAU' ? rsauQuickAccess : fktpQuickAccess;

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes]);

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const patientsQuery = query(
        collection(db, 'registrations'),
        where('date', '>=', today),
        where('faskesId', '==', selectedFaskes || 'default')
      );

      const patientsSnap = await getDocs(patientsQuery);
      
      setStats({
        todayPatients: patientsSnap.size,
        avgWaitTime: 15,
        criticalStock: 7,
        pendingTasks: tasks.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Dashboard {userRole === 'RSAU' ? 'SIMRS' : 'SIM Klinik'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 truncate">{selectedFaskes || 'Pilih Faskes dari header'}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        <StatCard
          icon={Users}
          title="Pasien Hari Ini"
          value={stats.todayPatients}
          trend={3.5}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Rata-rata Waktu Tunggu"
          value={`${stats.avgWaitTime} min`}
          trend={-5.2}
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          title="Item Stok Kritis"
          value={stats.criticalStock}
          color="red"
        />
        <StatCard
          icon={Activity}
          title="Tugas Pending"
          value={stats.pendingTasks}
          color="yellow"
        />
      </div>

      {/* Quick Access */}
      <Card title="Akses Cepat Modul" className="mb-4 sm:mb-6">
        <div className={`grid grid-cols-2 md:grid-cols-3 ${userRole === 'RSAU' ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-3 sm:gap-4`}>
          {quickAccess.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`${item.color} p-2 sm:p-3 md:p-4 rounded-lg`}>
                <item.icon className="text-white" size={20} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Pending Tasks */}
      <Card title="Tugas & Notifikasi Penting">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`p-3 sm:p-4 border-l-4 rounded ${getPriorityColor(task.priority)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm sm:text-base truncate flex-1 mr-2">{task.title}</h4>
                <span className="text-xl sm:text-2xl font-bold flex-shrink-0">{task.count}</span>
              </div>
              <button className="text-xs sm:text-sm text-blue-600 hover:underline">
                Lihat Detail →
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardFaskes;
