import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, FileText, Pill, Activity, ChevronDown, ChevronUp } from 'lucide-react';

const MedicalHistory = ({ patientId }) => {
  const { selectedFaskes } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecords, setExpandedRecords] = useState({});

  useEffect(() => {
    loadMedicalHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, selectedFaskes]);

  const loadMedicalHistory = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'medical_records'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    } catch (error) {
      console.error('Error loading medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecord = (recordId) => {
    setExpandedRecords(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat riwayat medis...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">Belum ada riwayat kunjungan tercatat</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="text-blue-600" size={20} />
          <h3 className="font-semibold text-blue-900">Riwayat Kunjungan</h3>
        </div>
        <p className="text-sm text-blue-700">
          Total {records.length} kunjungan tercatat di {selectedFaskes}
        </p>
      </div>

      <div className="space-y-3">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleRecord(record.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {formatDate(record.createdAt)}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {record.visitType || 'Kunjungan Reguler'}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900 mb-1">
                    {record.chiefComplaint || 'Pemeriksaan Umum'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Dokter: {record.createdBy || 'N/A'}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 ml-4">
                  {expandedRecords[record.id] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>

            {expandedRecords[record.id] && (
              <div className="border-t bg-gray-50 p-4 space-y-4">
                {/* SOAP Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs font-semibold text-gray-500 mb-1">SUBJECTIVE</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.subjective || '-'}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs font-semibold text-gray-500 mb-1">OBJECTIVE</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.objective || '-'}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs font-semibold text-gray-500 mb-1">ASSESSMENT</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.assessment || '-'}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs font-semibold text-gray-500 mb-1">PLAN</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.plan || '-'}
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                {record.vitalSigns && (
                  <div className="bg-white rounded p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="text-blue-600" size={16} />
                      <div className="text-sm font-semibold text-gray-700">Tanda Vital</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {record.vitalSigns.bloodPressure && (
                        <div>
                          <span className="text-gray-500">TD:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.bloodPressure} mmHg</span>
                        </div>
                      )}
                      {record.vitalSigns.heartRate && (
                        <div>
                          <span className="text-gray-500">Nadi:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.heartRate} bpm</span>
                        </div>
                      )}
                      {record.vitalSigns.temperature && (
                        <div>
                          <span className="text-gray-500">Suhu:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.temperature} °C</span>
                        </div>
                      )}
                      {record.vitalSigns.respiratoryRate && (
                        <div>
                          <span className="text-gray-500">RR:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.respiratoryRate} x/mnt</span>
                        </div>
                      )}
                      {record.vitalSigns.weight && (
                        <div>
                          <span className="text-gray-500">BB:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.weight} kg</span>
                        </div>
                      )}
                      {record.vitalSigns.height && (
                        <div>
                          <span className="text-gray-500">TB:</span>{' '}
                          <span className="font-medium">{record.vitalSigns.height} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Prescription */}
                {record.prescription && (
                  <div className="bg-white rounded p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="text-green-600" size={16} />
                      <div className="text-sm font-semibold text-gray-700">Resep Obat</div>
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.prescription}
                    </div>
                  </div>
                )}

                {/* Lab Results */}
                {record.labResults && (
                  <div className="bg-white rounded p-3 border">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Hasil Laboratorium</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.labResults}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {record.additionalNotes && (
                  <div className="bg-white rounded p-3 border">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Catatan Tambahan</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {record.additionalNotes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistory;
