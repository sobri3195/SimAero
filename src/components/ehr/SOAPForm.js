import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { aiService } from '../../services/aiService';
import { Sparkles, Save, AlertTriangle, Activity } from 'lucide-react';
import Card from '../common/Card';

const SOAPForm = ({ patientId, patientName }) => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    chiefComplaint: '',
    prescription: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      weight: '',
      height: ''
    },
    visitType: 'Kunjungan Reguler',
    additionalNotes: ''
  });

  useEffect(() => {
    loadPatientAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, selectedFaskes]);

  const loadPatientAlerts = async () => {
    try {
      const allergiesQuery = query(
        collection(db, 'patient_allergies'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const allergiesSnap = await getDocs(allergiesQuery);
      setAllergies(allergiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const diseasesQuery = query(
        collection(db, 'patient_chronic_diseases'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const diseasesSnap = await getDocs(diseasesQuery);
      setDiseases(diseasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading patient alerts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVitalSignChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [name]: value }
    }));
  };

  const fillWithAI = async (section = 'all') => {
    if (!formData.chiefComplaint) {
      addNotification({ type: 'warning', message: 'Masukkan keluhan utama terlebih dahulu' });
      return;
    }

    setAiLoading(true);
    try {
      const result = await aiService.generateSOAPForm(formData.chiefComplaint);
      
      if (result) {
        if (section === 'all') {
          setFormData(prev => ({
            ...prev,
            subjective: result.subjective,
            objective: result.objective,
            assessment: result.assessment,
            plan: result.plan,
            prescription: result.prescription.join('\n')
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [section]: result[section]
          }));
        }
        addNotification({ type: 'success', message: 'Form berhasil diisi oleh AI!' });
      }
    } catch (error) {
      console.error('AI Error:', error);
      addNotification({ type: 'error', message: 'Gagal menggunakan AI Assistant' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'medical_records'), {
        patientId,
        patientName,
        ...formData,
        faskesId: selectedFaskes,
        createdAt: new Date(),
        createdBy: 'Current User'
      });

      addNotification({ type: 'success', message: 'Rekam medis berhasil disimpan!' });
      
      setFormData({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        chiefComplaint: '',
        prescription: '',
        vitalSigns: {
          bloodPressure: '',
          heartRate: '',
          temperature: '',
          respiratoryRate: '',
          weight: '',
          height: ''
        },
        visitType: 'Kunjungan Reguler',
        additionalNotes: ''
      });
    } catch (error) {
      console.error('Error saving medical record:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan rekam medis' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={`Rekam Medis Elektronik - ${patientName}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Allergy Alert */}
        {allergies.length > 0 && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="font-bold text-red-900 text-lg">PERHATIAN! PASIEN MEMILIKI ALERGI</h3>
            </div>
            <div className="space-y-2">
              {allergies.map(allergy => (
                <div key={allergy.id} className="bg-white rounded p-2 border border-red-300">
                  <div className="font-semibold text-red-900">
                    {allergy.allergen} ({allergy.type})
                  </div>
                  <div className="text-sm text-red-700">
                    Reaksi: {allergy.reaction} | Keparahan: {allergy.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chronic Disease Info */}
        {diseases.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-amber-600" size={20} />
              <h3 className="font-semibold text-amber-900">Riwayat Penyakit Kronis</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {diseases.filter(d => d.status === 'active').map(disease => (
                <span key={disease.id} className="px-3 py-1 bg-white border border-amber-300 rounded-full text-sm text-amber-900">
                  {disease.disease} {disease.icdCode && `(${disease.icdCode})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Visit Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Jenis Kunjungan</label>
          <select
            name="visitType"
            value={formData.visitType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Kunjungan Reguler">Kunjungan Reguler</option>
            <option value="Kunjungan Kontrol">Kunjungan Kontrol</option>
            <option value="Kunjungan Darurat">Kunjungan Darurat</option>
            <option value="Pemeriksaan Berkala">Pemeriksaan Berkala</option>
          </select>
        </div>

        {/* Chief Complaint */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-medium mb-2">Keluhan Utama</label>
          <textarea
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="2"
            placeholder="Masukkan keluhan utama pasien..."
            required
          />
          <button
            type="button"
            onClick={() => fillWithAI('all')}
            disabled={aiLoading}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {aiLoading ? 'Menghasilkan...' : 'Isi Seluruh Form dengan AI'}
          </button>
        </div>

        {/* Vital Signs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Tanda Vital</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Tekanan Darah (mmHg)</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Nadi (bpm)</label>
              <input
                type="number"
                name="heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Suhu (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="36.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Pernafasan (x/menit)</label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.vitalSigns.respiratoryRate}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.vitalSigns.weight}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.vitalSigns.height}
                onChange={handleVitalSignChange}
                className="w-full p-2 border rounded text-sm"
                placeholder="170"
              />
            </div>
          </div>
        </div>

        {/* Subjective */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Subjective (S)</label>
            <button
              type="button"
              onClick={() => fillWithAI('subjective')}
              disabled={aiLoading}
              className="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} />
              Isi dengan AI
            </button>
          </div>
          <textarea
            name="subjective"
            value={formData.subjective}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="4"
            placeholder="Anamnesis, keluhan, riwayat penyakit..."
            required
          />
        </div>

        {/* Objective */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Objective (O)</label>
            <button
              type="button"
              onClick={() => fillWithAI('objective')}
              disabled={aiLoading}
              className="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} />
              Isi dengan AI
            </button>
          </div>
          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="4"
            placeholder="Pemeriksaan fisik, tanda vital, hasil pemeriksaan..."
            required
          />
        </div>

        {/* Assessment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Assessment (A)</label>
            <button
              type="button"
              onClick={() => fillWithAI('assessment')}
              disabled={aiLoading}
              className="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} />
              Isi dengan AI
            </button>
          </div>
          <textarea
            name="assessment"
            value={formData.assessment}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="3"
            placeholder="Diagnosis, kode ICD-10..."
            required
          />
        </div>

        {/* Plan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Plan (P)</label>
            <button
              type="button"
              onClick={() => fillWithAI('plan')}
              disabled={aiLoading}
              className="text-sm text-purple-600 hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} />
              Isi dengan AI
            </button>
          </div>
          <textarea
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="3"
            placeholder="Rencana terapi, tindakan, edukasi..."
            required
          />
        </div>

        {/* Prescription */}
        <div>
          <label className="block text-sm font-medium mb-2">Resep Obat</label>
          <textarea
            name="prescription"
            value={formData.prescription}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="4"
            placeholder="Nama obat, dosis, frekuensi (satu obat per baris)"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Catatan Tambahan</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows="3"
            placeholder="Catatan tambahan atau instruksi khusus..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setFormData({
              subjective: '',
              objective: '',
              assessment: '',
              plan: '',
              chiefComplaint: '',
              prescription: '',
              vitalSigns: {
                bloodPressure: '',
                heartRate: '',
                temperature: '',
                respiratoryRate: '',
                weight: '',
                height: ''
              },
              visitType: 'Kunjungan Reguler',
              additionalNotes: ''
            })}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Menyimpan...' : 'Simpan Rekam Medis'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default SOAPForm;
