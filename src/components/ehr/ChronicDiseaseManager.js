import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { AlertTriangle, Plus, Edit2, Trash2, X } from 'lucide-react';

const ChronicDiseaseManager = ({ patientId, patientName }) => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  const [diseases, setDiseases] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [editingAllergy, setEditingAllergy] = useState(null);

  const [diseaseForm, setDiseaseForm] = useState({
    disease: '',
    icdCode: '',
    diagnosedDate: '',
    status: 'active',
    notes: ''
  });

  const [allergyForm, setAllergyForm] = useState({
    allergen: '',
    type: 'obat',
    severity: 'sedang',
    reaction: '',
    notes: ''
  });

  useEffect(() => {
    loadDiseases();
    loadAllergies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, selectedFaskes]);

  const loadDiseases = async () => {
    try {
      const q = query(
        collection(db, 'patient_chronic_diseases'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDiseases(data);
    } catch (error) {
      console.error('Error loading diseases:', error);
    }
  };

  const loadAllergies = async () => {
    try {
      const q = query(
        collection(db, 'patient_allergies'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllergies(data);
    } catch (error) {
      console.error('Error loading allergies:', error);
    }
  };

  const handleAddDisease = () => {
    setEditingDisease(null);
    setDiseaseForm({
      disease: '',
      icdCode: '',
      diagnosedDate: '',
      status: 'active',
      notes: ''
    });
    setShowDiseaseModal(true);
  };

  const handleEditDisease = (disease) => {
    setEditingDisease(disease);
    setDiseaseForm({
      disease: disease.disease,
      icdCode: disease.icdCode,
      diagnosedDate: disease.diagnosedDate,
      status: disease.status,
      notes: disease.notes
    });
    setShowDiseaseModal(true);
  };

  const handleSaveDisease = async (e) => {
    e.preventDefault();
    try {
      if (editingDisease) {
        await updateDoc(doc(db, 'patient_chronic_diseases', editingDisease.id), {
          ...diseaseForm,
          updatedAt: new Date()
        });
        addNotification({ type: 'success', message: 'Penyakit kronis berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'patient_chronic_diseases'), {
          ...diseaseForm,
          patientId,
          patientName,
          faskesId: selectedFaskes,
          createdAt: new Date()
        });
        addNotification({ type: 'success', message: 'Penyakit kronis berhasil ditambahkan' });
      }
      setShowDiseaseModal(false);
      loadDiseases();
    } catch (error) {
      console.error('Error saving disease:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan penyakit kronis' });
    }
  };

  const handleDeleteDisease = async (id) => {
    if (window.confirm('Yakin ingin menghapus penyakit kronis ini?')) {
      try {
        await deleteDoc(doc(db, 'patient_chronic_diseases', id));
        addNotification({ type: 'success', message: 'Penyakit kronis berhasil dihapus' });
        loadDiseases();
      } catch (error) {
        console.error('Error deleting disease:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus penyakit kronis' });
      }
    }
  };

  const handleAddAllergy = () => {
    setEditingAllergy(null);
    setAllergyForm({
      allergen: '',
      type: 'obat',
      severity: 'sedang',
      reaction: '',
      notes: ''
    });
    setShowAllergyModal(true);
  };

  const handleEditAllergy = (allergy) => {
    setEditingAllergy(allergy);
    setAllergyForm({
      allergen: allergy.allergen,
      type: allergy.type,
      severity: allergy.severity,
      reaction: allergy.reaction,
      notes: allergy.notes
    });
    setShowAllergyModal(true);
  };

  const handleSaveAllergy = async (e) => {
    e.preventDefault();
    try {
      if (editingAllergy) {
        await updateDoc(doc(db, 'patient_allergies', editingAllergy.id), {
          ...allergyForm,
          updatedAt: new Date()
        });
        addNotification({ type: 'success', message: 'Alergi berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'patient_allergies'), {
          ...allergyForm,
          patientId,
          patientName,
          faskesId: selectedFaskes,
          createdAt: new Date()
        });
        addNotification({ type: 'success', message: 'Alergi berhasil ditambahkan' });
      }
      setShowAllergyModal(false);
      loadAllergies();
    } catch (error) {
      console.error('Error saving allergy:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan alergi' });
    }
  };

  const handleDeleteAllergy = async (id) => {
    if (window.confirm('Yakin ingin menghapus alergi ini?')) {
      try {
        await deleteDoc(doc(db, 'patient_allergies', id));
        addNotification({ type: 'success', message: 'Alergi berhasil dihapus' });
        loadAllergies();
      } catch (error) {
        console.error('Error deleting allergy:', error);
        addNotification({ type: 'error', message: 'Gagal menghapus alergi' });
      }
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      ringan: 'bg-yellow-100 text-yellow-800',
      sedang: 'bg-orange-100 text-orange-800',
      berat: 'bg-red-100 text-red-800'
    };
    return colors[severity] || colors.sedang;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      controlled: 'bg-green-100 text-green-800',
      resolved: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="space-y-6">
      {/* Allergies Section - Critical Alert */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-900">Alergi Pasien</h3>
          </div>
          <button
            onClick={handleAddAllergy}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
          >
            <Plus size={16} />
            Tambah Alergi
          </button>
        </div>

        {allergies.length === 0 ? (
          <p className="text-red-700 text-sm">Tidak ada riwayat alergi tercatat</p>
        ) : (
          <div className="space-y-2">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-red-900">{allergy.allergen}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(allergy.severity)}`}>
                        {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                        {allergy.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reaksi:</span> {allergy.reaction}
                    </p>
                    {allergy.notes && (
                      <p className="text-sm text-gray-600 mt-1">{allergy.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditAllergy(allergy)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAllergy(allergy.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chronic Diseases Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Riwayat Penyakit Kronis</h3>
          <button
            onClick={handleAddDisease}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
          >
            <Plus size={16} />
            Tambah Penyakit
          </button>
        </div>

        {diseases.length === 0 ? (
          <p className="text-blue-700 text-sm">Tidak ada riwayat penyakit kronis tercatat</p>
        ) : (
          <div className="space-y-2">
            {diseases.map((disease) => (
              <div key={disease.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-blue-900">{disease.disease}</span>
                      {disease.icdCode && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                          ICD-10: {disease.icdCode}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(disease.status)}`}>
                        {disease.status === 'active' ? 'Aktif' : disease.status === 'controlled' ? 'Terkontrol' : 'Sembuh'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Didiagnosis: {new Date(disease.diagnosedDate).toLocaleDateString('id-ID')}
                    </p>
                    {disease.notes && (
                      <p className="text-sm text-gray-600 mt-1">{disease.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditDisease(disease)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDisease(disease.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disease Modal */}
      {showDiseaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingDisease ? 'Edit Penyakit Kronis' : 'Tambah Penyakit Kronis'}
              </h3>
              <button onClick={() => setShowDiseaseModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveDisease} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Penyakit *</label>
                <input
                  type="text"
                  value={diseaseForm.disease}
                  onChange={(e) => setDiseaseForm({ ...diseaseForm, disease: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kode ICD-10</label>
                <input
                  type="text"
                  value={diseaseForm.icdCode}
                  onChange={(e) => setDiseaseForm({ ...diseaseForm, icdCode: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Contoh: E11.9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Diagnosis *</label>
                <input
                  type="date"
                  value={diseaseForm.diagnosedDate}
                  onChange={(e) => setDiseaseForm({ ...diseaseForm, diagnosedDate: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select
                  value={diseaseForm.status}
                  onChange={(e) => setDiseaseForm({ ...diseaseForm, status: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="active">Aktif</option>
                  <option value="controlled">Terkontrol</option>
                  <option value="resolved">Sembuh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <textarea
                  value={diseaseForm.notes}
                  onChange={(e) => setDiseaseForm({ ...diseaseForm, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Catatan tambahan tentang penyakit ini..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDiseaseModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allergy Modal */}
      {showAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingAllergy ? 'Edit Alergi' : 'Tambah Alergi'}
              </h3>
              <button onClick={() => setShowAllergyModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAllergy} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Alergen *</label>
                <input
                  type="text"
                  value={allergyForm.allergen}
                  onChange={(e) => setAllergyForm({ ...allergyForm, allergen: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Contoh: Amoxicillin, Udang, Debu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipe Alergi *</label>
                <select
                  value={allergyForm.type}
                  onChange={(e) => setAllergyForm({ ...allergyForm, type: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="obat">Obat</option>
                  <option value="makanan">Makanan</option>
                  <option value="lingkungan">Lingkungan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tingkat Keparahan *</label>
                <select
                  value={allergyForm.severity}
                  onChange={(e) => setAllergyForm({ ...allergyForm, severity: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="ringan">Ringan</option>
                  <option value="sedang">Sedang</option>
                  <option value="berat">Berat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reaksi yang Timbul *</label>
                <input
                  type="text"
                  value={allergyForm.reaction}
                  onChange={(e) => setAllergyForm({ ...allergyForm, reaction: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Contoh: Gatal-gatal, sesak napas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <textarea
                  value={allergyForm.notes}
                  onChange={(e) => setAllergyForm({ ...allergyForm, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Catatan tambahan tentang alergi ini..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllergyModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronicDiseaseManager;
