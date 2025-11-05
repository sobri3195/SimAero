import React, { useState } from 'react';
import { collection, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useApp } from '../../contexts/AppContext';
import { aiService } from '../../services/aiService';
import { Sparkles, Save } from 'lucide-react';
import Card from '../common/Card';

const SOAPForm = ({ patientId, patientName }) => {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    chiefComplaint: '',
    prescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        prescription: ''
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

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setFormData({
              subjective: '',
              objective: '',
              assessment: '',
              plan: '',
              chiefComplaint: '',
              prescription: ''
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
