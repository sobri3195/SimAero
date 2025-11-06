import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { collection, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

const RikkesAnalytics = () => {
  const { selectedFaskes, rikkesRole } = useAuth();
  const { theme } = useApp();
  const [examinations, setExaminations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    avgCompletionTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rikkesRole !== 'Admin' && rikkesRole !== 'Reviewer') {
      return;
    }
    loadAnalytics();
  }, [selectedFaskes, rikkesRole]);

  const loadAnalytics = async () => {
    try {
      const q = query(
        collection(db, 'rikkes_examinations'),
        where('faskesId', '==', selectedFaskes)
      );
      const snapshot = await getDocs(q);
      const exams = [];
      snapshot.forEach((doc) => {
        exams.push({ id: doc.id, ...doc.data() });
      });

      setExaminations(exams);
      calculateStats(exams);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (exams) => {
    const total = exams.length;
    const inProgress = exams.filter(e => e.status === 'in_progress' || e.status === 'pending_review').length;
    const completed = exams.filter(e => e.status === 'finalized').length;

    const completedExams = exams.filter(e => e.finalizedAt && e.createdAt);
    let totalTime = 0;
    completedExams.forEach(exam => {
      const created = new Date(exam.createdAt).getTime();
      const finalized = new Date(exam.finalizedAt).getTime();
      totalTime += (finalized - created) / (1000 * 60 * 60 * 24);
    });
    const avgCompletionTime = completedExams.length > 0 ? (totalTime / completedExams.length).toFixed(1) : 0;

    setStats({ total, inProgress, completed, avgCompletionTime });
  };

  const getHealthStatusData = () => {
    const statusCount = { 'BAIK': 0, 'BAIK DENGAN CATATAN': 0, 'TIDAK BAIK': 0 };
    examinations.forEach(exam => {
      const status = exam.sections?.conclusion?.healthStatus;
      if (status && statusCount[status] !== undefined) {
        statusCount[status]++;
      }
    });

    return [
      { name: 'BAIK', value: statusCount['BAIK'], color: '#10b981' },
      { name: 'BAIK DENGAN CATATAN', value: statusCount['BAIK DENGAN CATATAN'], color: '#f59e0b' },
      { name: 'TIDAK BAIK', value: statusCount['TIDAK BAIK'], color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const getTopAbnormalities = () => {
    const abnormalityCount = {};
    examinations.forEach(exam => {
      const abnormalities = exam.sections?.conclusion?.abnormalities || [];
      abnormalities.forEach(abnormality => {
        abnormalityCount[abnormality] = (abnormalityCount[abnormality] || 0) + 1;
      });
    });

    return Object.entries(abnormalityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const getHealthByUnit = () => {
    const unitData = {};
    examinations.forEach(exam => {
      const unit = exam.unit || 'Lainnya';
      const status = exam.sections?.conclusion?.healthStatus;
      
      if (!unitData[unit]) {
        unitData[unit] = { unit, BAIK: 0, 'BAIK DENGAN CATATAN': 0, 'TIDAK BAIK': 0 };
      }
      
      if (status && unitData[unit][status] !== undefined) {
        unitData[unit][status]++;
      }
    });

    return Object.values(unitData).slice(0, 5);
  };

  if (rikkesRole !== 'Admin' && rikkesRole !== 'Reviewer') {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold">
            ⚠ Halaman ini hanya dapat diakses oleh Admin dan Reviewer
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    );
  }

  const healthStatusData = getHealthStatusData();
  const topAbnormalities = getTopAbnormalities();
  const healthByUnit = getHealthByUnit();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
          Dashboard Analitik Rikkes
        </h1>
        <p className="text-gray-600 mt-1">
          Visualisasi data dan statistik pemeriksaan kesehatan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-semibold">Total Pemeriksaan</div>
              <div className="text-3xl font-bold mt-2" style={{ color: theme.primaryColor }}>
                {stats.total}
              </div>
            </div>
            <Users size={40} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-semibold">Dalam Proses</div>
              <div className="text-3xl font-bold mt-2 text-yellow-600">
                {stats.inProgress}
              </div>
            </div>
            <FileText size={40} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-semibold">Selesai</div>
              <div className="text-3xl font-bold mt-2 text-green-600">
                {stats.completed}
              </div>
            </div>
            <CheckCircle size={40} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-semibold">Rata-rata Waktu</div>
              <div className="text-3xl font-bold mt-2 text-blue-600">
                {stats.avgCompletionTime}
              </div>
              <div className="text-xs text-gray-500 mt-1">hari</div>
            </div>
            <Clock size={40} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Distribusi Status Kesehatan</h2>
          {healthStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={healthStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data kesimpulan
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top 5 Temuan Abnormal</h2>
          {topAbnormalities.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAbnormalities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={theme.primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data temuan abnormal
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Status Kesehatan per Satuan</h2>
        {healthByUnit.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={healthByUnit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unit" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="BAIK" stackId="a" fill="#10b981" />
              <Bar dataKey="BAIK DENGAN CATATAN" stackId="a" fill="#f59e0b" />
              <Bar dataKey="TIDAK BAIK" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Belum ada data untuk ditampilkan
          </div>
        )}
      </div>
    </div>
  );
};

export default RikkesAnalytics;
