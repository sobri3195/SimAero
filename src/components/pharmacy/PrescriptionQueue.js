import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs, orderBy } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Clock, CheckCircle, Package, AlertCircle, User, Calendar } from 'lucide-react';

const PrescriptionQueue = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!selectedFaskes) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'prescriptions'),
      where('faskesId', '==', selectedFaskes),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        const prescData = { id: doc.id, ...doc.data() };
        const createdDate = new Date(prescData.createdAt);
        createdDate.setHours(0, 0, 0, 0);
        if (createdDate.getTime() === today.getTime()) {
          data.push(prescData);
        }
      });
      setPrescriptions(data);
    });

    return () => unsubscribe();
  }, [selectedFaskes]);

  const updateStatus = async (prescriptionId, newStatus) => {
    try {
      const updates = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      if (newStatus === 'disiapkan') {
        updates.preparedAt = new Date().toISOString();
      } else if (newStatus === 'selesai') {
        updates.completedAt = new Date().toISOString();
      }

      await updateDoc(doc(db, 'prescriptions', prescriptionId), updates);
      addNotification({ 
        type: 'success', 
        message: `Status resep diperbarui ke ${newStatus}` 
      });
    } catch (error) {
      console.error('Error updating prescription:', error);
      addNotification({ type: 'error', message: 'Gagal memperbarui status resep' });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      menunggu: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock, label: 'Menunggu' },
      disiapkan: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Package, label: 'Disiapkan' },
      selesai: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle, label: 'Selesai' }
    };
    const badge = badges[status] || badges.menunggu;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const getWaitTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return { text: `${diffMinutes} menit`, class: 'text-gray-600' };
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return { 
        text: `${hours}j ${minutes}m`, 
        class: hours > 2 ? 'text-red-600 font-medium' : 'text-orange-600' 
      };
    }
  };

  const viewDetail = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const filteredPrescriptions = filterStatus === 'all' 
    ? prescriptions 
    : prescriptions.filter(p => p.status === filterStatus);

  const statusCounts = {
    all: prescriptions.length,
    menunggu: prescriptions.filter(p => p.status === 'menunggu').length,
    disiapkan: prescriptions.filter(p => p.status === 'disiapkan').length,
    selesai: prescriptions.filter(p => p.status === 'selesai').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resep</p>
              <p className="text-2xl font-bold text-gray-800">{statusCounts.all}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Package className="text-gray-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.menunggu}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disiapkan</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.disiapkan}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.selesai}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilterStatus('menunggu')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'menunggu'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Menunggu ({statusCounts.menunggu})
          </button>
          <button
            onClick={() => setFilterStatus('disiapkan')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'disiapkan'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disiapkan ({statusCounts.disiapkan})
          </button>
          <button
            onClick={() => setFilterStatus('selesai')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'selesai'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Selesai ({statusCounts.selesai})
          </button>
        </div>
      </div>

      {/* Prescription Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPrescriptions.map((prescription) => {
          const waitTime = getWaitTime(prescription.createdAt);
          return (
            <div key={prescription.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-800">{prescription.patientName}</h3>
                    {getStatusBadge(prescription.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      Dr. {prescription.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      <span className={waitTime.class}>{waitTime.text}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(prescription.createdAt).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>

              {/* Medicine Items */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Obat yang Diresepkan:</p>
                <div className="space-y-1">
                  {prescription.items && prescription.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      <span className="font-medium">{item.drugName}</span>
                      <span className="text-gray-500 text-xs ml-2">
                        {item.quantity} {item.unit} • {item.dosage}
                      </span>
                    </div>
                  ))}
                  {prescription.items && prescription.items.length > 3 && (
                    <p className="text-xs text-blue-600">+{prescription.items.length - 3} obat lainnya</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => viewDetail(prescription)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Lihat Detail
                </button>
                
                {prescription.status === 'menunggu' && (
                  <button
                    onClick={() => updateStatus(prescription.id, 'disiapkan')}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                  >
                    Mulai Siapkan
                  </button>
                )}
                
                {prescription.status === 'disiapkan' && (
                  <button
                    onClick={() => updateStatus(prescription.id, 'selesai')}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                  >
                    Selesai
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredPrescriptions.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">Tidak ada resep {filterStatus !== 'all' ? filterStatus : ''}</p>
            <p className="text-sm">Resep dari dokter akan muncul di sini</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Detail Resep</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Nama Pasien</p>
                  <p className="font-semibold">{selectedPrescription.patientName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Nomor RM</p>
                  <p className="font-semibold">{selectedPrescription.patientId || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Dokter</p>
                  <p className="font-semibold">Dr. {selectedPrescription.doctorName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <div>{getStatusBadge(selectedPrescription.status)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Waktu Resep</p>
                  <p className="font-semibold">
                    {new Date(selectedPrescription.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Poli</p>
                  <p className="font-semibold">{selectedPrescription.poli || '-'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Daftar Obat</h4>
                <div className="space-y-3">
                  {selectedPrescription.items && selectedPrescription.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800">{item.drugName}</h5>
                        <span className="text-sm font-medium text-blue-600">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Dosis:</span> {item.dosage}</p>
                        {item.instructions && (
                          <p><span className="font-medium">Instruksi:</span> {item.instructions}</p>
                        )}
                        {item.price && (
                          <p><span className="font-medium">Harga:</span> Rp {parseInt(item.price).toLocaleString('id-ID')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Catatan</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedPrescription.status === 'menunggu' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedPrescription.id, 'disiapkan');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Mulai Siapkan
                  </button>
                )}
                {selectedPrescription.status === 'disiapkan' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedPrescription.id, 'selesai');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionQueue;
