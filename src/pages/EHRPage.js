import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from '../mockDb';
import { db } from '../mockDb';
import { useAuth } from '../contexts/AuthContext';
import { Search, FileText, History, AlertCircle, Printer, Pill } from 'lucide-react';
import SOAPForm from '../components/ehr/SOAPForm';
import ChronicDiseaseManager from '../components/ehr/ChronicDiseaseManager';
import MedicalHistory from '../components/ehr/MedicalHistory';
import MedicalRecordPrint from '../components/ehr/MedicalRecordPrint';
import PrescriptionForm from '../components/ehr/PrescriptionForm';
import PageHeader from '../components/common/PageHeader';

const EHRPage = () => {
  const { selectedFaskes } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('soap');

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaskes]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(patient => 
        patient.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.nik?.includes(searchQuery) ||
        patient.nrp?.includes(searchQuery)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      const q = query(
        collection(db, 'patients'),
        where('faskesId', '==', selectedFaskes)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('soap');
  };

  const tabs = [
    { id: 'soap', label: 'SOAP Note', icon: FileText },
    { id: 'prescription', label: 'Resep Obat', icon: Pill },
    { id: 'chronic', label: 'Riwayat Kronis & Alergi', icon: AlertCircle },
    { id: 'history', label: 'Riwayat Kunjungan', icon: History },
    { id: 'print', label: 'Cetak Ringkasan', icon: Printer }
  ];

  if (!selectedPatient) {
    return (
      <div>
        <PageHeader
          title="Rekam Medis Elektronik (EHR)"
          subtitle="Pencatatan rekam medis dengan format SOAP"
          breadcrumbItems={[
            { label: 'Dashboard', path: '/' },
            { label: 'EHR', path: '/ehr' }
          ]}
        />

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Pilih Pasien</h2>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari pasien berdasarkan nama, NIK, atau NRP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'Tidak ada pasien yang ditemukan' : 'Belum ada data pasien'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 text-left transition-colors"
                >
                  <div className="font-semibold text-gray-900">{patient.nama}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {patient.nik && <div>NIK: {patient.nik}</div>}
                    {patient.nrp && <div>NRP: {patient.nrp}</div>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {patient.jenisKelamin} | {patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString('id-ID') : '-'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`EHR - ${selectedPatient.nama}`}
        subtitle={`${selectedPatient.nik || selectedPatient.nrp || ''} | ${selectedPatient.jenisKelamin || ''}`}
        breadcrumbItems={[
          { label: 'Dashboard', path: '/' },
          { label: 'EHR', path: '/ehr' },
          { label: selectedPatient.nama }
        ]}
      />

      <button
        onClick={() => {
          setSelectedPatient(null);
          setActiveTab('soap');
        }}
        className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
      >
        ← Kembali ke daftar pasien
      </button>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'soap' && (
            <SOAPForm
              patientId={selectedPatient.id}
              patientName={selectedPatient.nama}
            />
          )}
          
          {activeTab === 'prescription' && (
            <PrescriptionForm
              patientId={selectedPatient.id}
              patientName={selectedPatient.nama}
              onSuccess={() => setActiveTab('history')}
            />
          )}
          
          {activeTab === 'chronic' && (
            <ChronicDiseaseManager
              patientId={selectedPatient.id}
              patientName={selectedPatient.nama}
            />
          )}
          
          {activeTab === 'history' && (
            <MedicalHistory
              patientId={selectedPatient.id}
            />
          )}
          
          {activeTab === 'print' && (
            <MedicalRecordPrint
              patientId={selectedPatient.id}
              patientName={selectedPatient.nama}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EHRPage;
