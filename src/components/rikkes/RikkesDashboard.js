import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { collection, query, where, onSnapshot } from '../../mockDb';
import { db } from '../../mockDb';
import { 
  Search, Filter, Calendar, User, Shield, 
  CheckCircle2, Clock, AlertCircle, XCircle, Plus 
} from 'lucide-react';

const RikkesDashboard = () => {
  const { selectedFaskes, rikkesRole } = useAuth();
  const { theme } = useApp();
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedFaskes) return;

    const q = query(
      collection(db, 'rikkes_examinations'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const exams = [];
      snapshot.forEach((doc) => {
        exams.push({ id: doc.id, ...doc.data() });
      });
      setExaminations(exams);
      setFilteredExams(exams);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  useEffect(() => {
    let filtered = [...examinations];

    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.nrp?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }

    if (dateRange.start) {
      filtered = filtered.filter(exam => new Date(exam.examDate) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      filtered = filtered.filter(exam => new Date(exam.examDate) <= new Date(dateRange.end));
    }

    setFilteredExams(filtered);
  }, [searchTerm, statusFilter, dateRange, examinations]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'in_progress': { icon: Clock, color: 'yellow', label: 'In Progress' },
      'pending_review': { icon: AlertCircle, color: 'blue', label: 'Pending Review' },
      'needs_revision': { icon: XCircle, color: 'red', label: 'Needs Revision' },
      'finalized': { icon: CheckCircle2, color: 'green', label: 'Finalized' }
    };

    const config = statusConfig[status] || statusConfig.in_progress;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-800`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = (exam) => {
    const sections = ['identity', 'clinical', 'dental', 'lab', 'radiology', 'conclusion'];
    const completedSections = sections.filter(section => exam.sections?.[section]?.status === 'completed').length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>
            Dashboard Rikkes
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola pemeriksaan kesehatan personel - Role: {rikkesRole}
          </p>
        </div>

        {(rikkesRole === 'Admin' || rikkesRole === 'Reviewer') && (
          <button
            onClick={() => navigate('/rikkes/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Plus size={20} />
            Pemeriksaan Baru
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama atau NRP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Semua Status</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_review">Pending Review</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="finalized">Finalized</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            onClick={() => navigate(`/rikkes/exam/${exam.id}`)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{exam.patientName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={14} />
                    <span>NRP: {exam.nrp || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User size={14} />
                    <span>{exam.rank} - {exam.unit}</span>
                  </div>
                </div>
                {getStatusBadge(exam.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Tanggal: {new Date(exam.examDate).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Tujuan:</span> {exam.purpose}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress Pengisian</span>
                  <span className="font-semibold" style={{ color: theme.primaryColor }}>
                    {getProgressPercentage(exam)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${getProgressPercentage(exam)}%`,
                      backgroundColor: theme.primaryColor
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t">
              <p className="text-xs text-gray-500">
                Terakhir diperbarui: {new Date(exam.updatedAt).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ada data pemeriksaan
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || dateRange.start || dateRange.end
              ? 'Tidak ditemukan data yang sesuai dengan filter'
              : 'Belum ada data pemeriksaan kesehatan'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RikkesDashboard;
