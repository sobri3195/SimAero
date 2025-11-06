import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';

const RikkesConclusionSection = ({ data, examination, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    healthStatus: 'BAIK',
    abnormalities: [],
    recommendations: '',
    limitations: '',
    conclusion: '',
    reviewerName: '',
    reviewerRank: '',
    reviewDate: new Date().toISOString().split('T')[0],
    ...data
  });

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAbnormalityToggle = (abnormality) => {
    const current = formData.abnormalities || [];
    if (current.includes(abnormality)) {
      handleChange('abnormalities', current.filter(a => a !== abnormality));
    } else {
      handleChange('abnormalities', [...current, abnormality]);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    if (!formData.healthStatus || !formData.conclusion) {
      alert('Mohon lengkapi status kesehatan dan kesimpulan');
      return;
    }
    onSubmit(formData);
  };

  const commonAbnormalities = [
    'Hipertensi', 'Obesitas', 'Underweight', 'Gangguan Penglihatan',
    'Gangguan Pendengaran', 'Karies Gigi', 'Gingivitis', 'Anemia',
    'Kolesterol Tinggi', 'Gula Darah Tinggi', 'Asam Urat Tinggi',
    'Kelainan Thorax', 'Kelainan Jantung', 'Kelainan Paru'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          Kesimpulan Akhir
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Kesimpulan dan rekomendasi hasil pemeriksaan kesehatan
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6">
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Status Kesehatan Akhir <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleChange('healthStatus', 'BAIK')}
              disabled={readOnly}
              className={`p-4 rounded-lg border-2 font-bold transition-all ${
                formData.healthStatus === 'BAIK'
                  ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
              }`}
            >
              ✓ BAIK
            </button>
            <button
              type="button"
              onClick={() => handleChange('healthStatus', 'BAIK DENGAN CATATAN')}
              disabled={readOnly}
              className={`p-4 rounded-lg border-2 font-bold transition-all ${
                formData.healthStatus === 'BAIK DENGAN CATATAN'
                  ? 'bg-yellow-500 border-yellow-600 text-white shadow-lg scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-400'
              }`}
            >
              ⚠ BAIK DENGAN CATATAN
            </button>
            <button
              type="button"
              onClick={() => handleChange('healthStatus', 'TIDAK BAIK')}
              disabled={readOnly}
              className={`p-4 rounded-lg border-2 font-bold transition-all ${
                formData.healthStatus === 'TIDAK BAIK'
                  ? 'bg-red-500 border-red-600 text-white shadow-lg scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
              }`}
            >
              ✗ TIDAK BAIK
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Temuan Abnormal / Kelainan
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonAbnormalities.map((abnormality) => (
              <button
                key={abnormality}
                type="button"
                onClick={() => handleAbnormalityToggle(abnormality)}
                disabled={readOnly}
                className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                  formData.abnormalities?.includes(abnormality)
                    ? 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-red-300'
                }`}
              >
                {formData.abnormalities?.includes(abnormality) ? '✓ ' : ''}
                {abnormality}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rekomendasi / Saran Tindak Lanjut
          </label>
          <textarea
            value={formData.recommendations}
            onChange={(e) => handleChange('recommendations', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Rekomendasi perawatan, rujukan spesialis, pemeriksaan lanjutan, dll..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pembatasan / Limitasi (jika ada)
          </label>
          <textarea
            value={formData.limitations}
            onChange={(e) => handleChange('limitations', e.target.value)}
            disabled={readOnly}
            rows={3}
            placeholder="Pembatasan tugas, aktivitas yang harus dihindari, dll..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kesimpulan Akhir <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.conclusion}
            onChange={(e) => handleChange('conclusion', e.target.value)}
            disabled={readOnly}
            rows={5}
            placeholder="Kesimpulan lengkap hasil pemeriksaan kesehatan..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Pemeriksa / Reviewer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => handleChange('reviewerName', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pangkat
              </label>
              <input
                type="text"
                value={formData.reviewerRank}
                onChange={(e) => handleChange('reviewerRank', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Review
              </label>
              <input
                type="date"
                value={formData.reviewDate}
                onChange={(e) => handleChange('reviewDate', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            <Save size={18} />
            Simpan Draft
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Send size={18} />
            Submit Bagian Ini
          </button>
        </div>
      )}

      {readOnly && (
        <div className="mt-6 pt-6 border-t bg-blue-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <p className="text-sm text-blue-800 font-semibold">
            ✓ Bagian ini telah di-submit dan terkunci
          </p>
        </div>
      )}
    </div>
  );
};

export default RikkesConclusionSection;
