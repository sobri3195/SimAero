import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import DailyExaminationList from '../components/fktp/DailyExaminationList';
import DailyExaminationForm from '../components/fktp/DailyExaminationForm';
import ExaminationHistory from '../components/fktp/ExaminationHistory';
import ExaminationSummaryPrint from '../components/fktp/ExaminationSummaryPrint';
import { FileText, History, Printer, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { collection, query, where, getDocs } from '../mockDb';
import { db } from '../mockDb';

const DailyExaminationPage = () => {
  const { userRole, selectedFaskes } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('examination');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedExamination, setSelectedExamination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [printData, setPrintData] = useState({ examinations: [], startDate: '', endDate: '' });
  const [loadingPrint, setLoadingPrint] = useState(false);

  // Redirect if not FKTP
  React.useEffect(() => {
    if (userRole !== 'FKTP') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const handleSelectPatient = (registration, examination) => {
    setSelectedPatient(registration);
    setSelectedExamination(examination || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPatient(null);
    setSelectedExamination(null);
  };

  const handleSaveExamination = () => {
    handleCloseForm();
    // Reload the list by switching tabs or force refresh
    setActiveTab('examination');
    window.location.reload();
  };

  const loadPrintData = async (startDate, endDate) => {
    try {
      setLoadingPrint(true);
      const examQuery = query(
        collection(db, 'daily_examinations'),
        where('faskesId', '==', selectedFaskes || 'default')
      );
      const snapshot = await getDocs(examQuery);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter by date range
      data = data.filter(e => 
        e.tanggalPemeriksaan >= startDate && 
        e.tanggalPemeriksaan <= endDate
      );

      setPrintData({ examinations: data, startDate, endDate });
    } catch (error) {
      console.error('Error loading print data:', error);
    } finally {
      setLoadingPrint(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Pemeriksaan Harian', path: '/daily-examination' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Pemeriksaan Harian Pasien"
        subtitle="Kelola pemeriksaan pasien dari pendaftaran hingga penyelesaian pelayanan"
        breadcrumbItems={breadcrumbItems}
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-1 border-b border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('examination')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'examination'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Daftar Pemeriksaan Hari Ini</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            <span>Riwayat Pemeriksaan</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('print');
              const today = format(new Date(), 'yyyy-MM-dd');
              loadPrintData(today, today);
            }}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'print'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Printer className="w-5 h-5" />
            <span>Cetak Ringkasan</span>
          </button>
        </div>

        <div className="p-6">
          {/* Examination List Tab */}
          {activeTab === 'examination' && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Pemeriksaan Pasien Hari Ini</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Daftar pasien yang telah mendaftar hari ini. Klik "Periksa" untuk mulai pemeriksaan.
                      Semua data pemeriksaan akan tersimpan dalam rekam medis elektronik.
                    </p>
                  </div>
                </div>
              </div>
              <DailyExaminationList onSelectPatient={handleSelectPatient} />
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <History className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900">Riwayat Pemeriksaan</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      Lihat riwayat pemeriksaan pasien yang sudah dilakukan. 
                      Data dapat dicari berdasarkan nama pasien, diagnosis, atau periode tanggal.
                    </p>
                  </div>
                </div>
              </div>
              <ExaminationHistory />
            </div>
          )}

          {/* Print Summary Tab */}
          {activeTab === 'print' && (
            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pilih Periode Laporan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={printData.startDate}
                      onChange={(e) => setPrintData({ ...printData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      value={printData.endDate}
                      onChange={(e) => setPrintData({ ...printData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => loadPrintData(printData.startDate, printData.endDate)}
                      disabled={!printData.startDate || !printData.endDate || loadingPrint}
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPrint ? 'Memuat...' : 'Muat Data'}
                    </button>
                  </div>
                </div>
              </div>

              {printData.examinations.length > 0 ? (
                <ExaminationSummaryPrint
                  examinations={printData.examinations}
                  startDate={printData.startDate}
                  endDate={printData.endDate}
                  faskesName={selectedFaskes}
                />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Printer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Tidak ada data untuk dicetak</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Pilih periode tanggal dan klik "Muat Data" untuk menampilkan laporan
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Examination Form Modal */}
      {showForm && selectedPatient && (
        <DailyExaminationForm
          registration={selectedPatient}
          examination={selectedExamination}
          onClose={handleCloseForm}
          onSave={handleSaveExamination}
        />
      )}
    </div>
  );
};

export default DailyExaminationPage;
