import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, User, FileText, AlertCircle, CheckCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const DailyExaminationList = ({ onSelectPatient }) => {
  const { selectedFaskes } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, waiting, completed

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes]);

  const loadData = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      // Load registrations for today
      const regQuery = query(
        collection(db, 'registrations'),
        where('faskesId', '==', selectedFaskes || 'default'),
        where('tanggalDaftar', '==', today)
      );
      const regSnapshot = await getDocs(regQuery);
      const regData = regSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Load examinations for today
      const examQuery = query(
        collection(db, 'daily_examinations'),
        where('faskesId', '==', selectedFaskes || 'default'),
        where('tanggalPemeriksaan', '==', today)
      );
      const examSnapshot = await getDocs(examQuery);
      const examData = examSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setRegistrations(regData);
      setExaminations(examData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExaminationStatus = (registration) => {
    const exam = examinations.find(e => e.registrationId === registration.id);
    if (!exam) return { status: 'waiting', label: 'Belum Diperiksa', color: 'yellow' };
    if (exam.status === 'completed') return { status: 'completed', label: 'Selesai', color: 'green' };
    return { status: 'ongoing', label: 'Sedang Diperiksa', color: 'blue' };
  };

  const filteredRegistrations = registrations.filter(reg => {
    const status = getExaminationStatus(reg);
    if (filterStatus === 'all') return true;
    if (filterStatus === 'waiting') return status.status === 'waiting';
    if (filterStatus === 'completed') return status.status === 'completed';
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ongoing':
        return <Edit className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Pasien</p>
              <p className="text-2xl font-bold text-blue-900">{registrations.length}</p>
            </div>
            <User className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Belum Diperiksa</p>
              <p className="text-2xl font-bold text-yellow-900">
                {registrations.filter(r => getExaminationStatus(r).status === 'waiting').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Selesai</p>
              <p className="text-2xl font-bold text-green-900">
                {registrations.filter(r => getExaminationStatus(r).status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterStatus === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Semua ({registrations.length})
        </button>
        <button
          onClick={() => setFilterStatus('waiting')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterStatus === 'waiting'
              ? 'text-yellow-600 border-b-2 border-yellow-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Belum Diperiksa ({registrations.filter(r => getExaminationStatus(r).status === 'waiting').length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterStatus === 'completed'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Selesai ({registrations.filter(r => getExaminationStatus(r).status === 'completed').length})
        </button>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Tidak ada pasien untuk ditampilkan</p>
            <p className="text-sm text-gray-500 mt-2">
              {filterStatus === 'waiting' && 'Semua pasien sudah diperiksa'}
              {filterStatus === 'completed' && 'Belum ada pasien yang selesai diperiksa'}
              {filterStatus === 'all' && 'Belum ada pendaftaran hari ini'}
            </p>
          </div>
        ) : (
          filteredRegistrations.map((registration) => {
            const status = getExaminationStatus(registration);
            const exam = examinations.find(e => e.registrationId === registration.id);

            return (
              <div
                key={registration.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectPatient(registration, exam)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-md text-lg">
                        {registration.nomorAntrean}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{registration.namaPasien}</h3>
                        <p className="text-sm text-gray-600">
                          {registration.nrp ? `NRP: ${registration.nrp}` : `NIK: ${registration.nik}`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{registration.jenisKelamin} • {registration.umur} tahun</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{registration.poli}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {registration.waktuDaftar ? 
                            format(new Date(`2000-01-01T${registration.waktuDaftar}`), 'HH:mm', { locale: localeID }) 
                            : '-'}
                        </span>
                      </div>
                      {exam && exam.dokter && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Dokter: {exam.dokter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                        status.color === 'green'
                          ? 'bg-green-100 text-green-800'
                          : status.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span>{status.label}</span>
                    </span>
                    {status.status !== 'completed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(registration, exam);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {status.status === 'ongoing' ? 'Lanjutkan' : 'Periksa'}
                      </button>
                    )}
                    {status.status === 'completed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(registration, exam);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Lihat Detail
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DailyExaminationList;
