import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';
import RikkesOdontogram from './RikkesOdontogram';

const RikkesDentalSection = ({ data, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    dentalData: {
      teeth: {},
      dmft: { decayed: 0, missing: 0, filled: 0, total: 0 }
    },
    oralHygiene: 'Baik',
    gingivalStatus: 'Normal',
    occlusion: 'Normal',
    tmj: 'Normal',
    oralLesions: '',
    dentalNotes: '',
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

  const handleDentalDataChange = (dentalData) => {
    setFormData(prev => ({ ...prev, dentalData }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getDMFTCategory = (total) => {
    if (total === 0) return { label: 'Sangat Baik', color: 'text-green-600' };
    if (total <= 3) return { label: 'Baik', color: 'text-blue-600' };
    if (total <= 6) return { label: 'Sedang', color: 'text-yellow-600' };
    return { label: 'Buruk', color: 'text-red-600' };
  };

  const dmftCategory = getDMFTCategory(formData.dentalData.dmft.total);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          Pemeriksaan Gigi & Mulut
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Pemeriksaan kesehatan gigi menggunakan odontogram interaktif
        </p>
      </div>

      <div className="space-y-6">
        <RikkesOdontogram
          dentalData={formData.dentalData}
          onChange={handleDentalDataChange}
          readOnly={readOnly}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kebersihan Mulut (Oral Hygiene)
            </label>
            <select
              value={formData.oralHygiene}
              onChange={(e) => handleChange('oralHygiene', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Baik">Baik</option>
              <option value="Sedang">Sedang</option>
              <option value="Buruk">Buruk</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Gingiva (Gusi)
            </label>
            <select
              value={formData.gingivalStatus}
              onChange={(e) => handleChange('gingivalStatus', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Normal">Normal</option>
              <option value="Gingivitis">Gingivitis</option>
              <option value="Periodontitis">Periodontitis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Oklusi (Gigitan)
            </label>
            <select
              value={formData.occlusion}
              onChange={(e) => handleChange('occlusion', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Normal">Normal</option>
              <option value="Maloklusi Kelas I">Maloklusi Kelas I</option>
              <option value="Maloklusi Kelas II">Maloklusi Kelas II</option>
              <option value="Maloklusi Kelas III">Maloklusi Kelas III</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TMJ (Temporomandibular Joint)
            </label>
            <select
              value={formData.tmj}
              onChange={(e) => handleChange('tmj', e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="Normal">Normal</option>
              <option value="Clicking">Clicking</option>
              <option value="Nyeri">Nyeri</option>
              <option value="Terbatas">Terbatas</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lesi Oral / Kelainan Mukosa
          </label>
          <textarea
            value={formData.oralLesions}
            onChange={(e) => handleChange('oralLesions', e.target.value)}
            disabled={readOnly}
            rows={3}
            placeholder="Jelaskan jika ada lesi, ulcer, atau kelainan lainnya..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Dokter Gigi
          </label>
          <textarea
            value={formData.dentalNotes}
            onChange={(e) => handleChange('dentalNotes', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Catatan tambahan, rekomendasi perawatan, dll..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-3">Ringkasan Kesehatan Gigi</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formData.dentalData.dmft.decayed}
              </div>
              <div className="text-xs text-gray-600">Karies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {formData.dentalData.dmft.missing}
              </div>
              <div className="text-xs text-gray-600">Hilang</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.dentalData.dmft.filled}
              </div>
              <div className="text-xs text-gray-600">Tambalan</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${dmftCategory.color}`}>
                {formData.dentalData.dmft.total}
              </div>
              <div className="text-xs text-gray-600">Total DMF-T</div>
              <div className={`text-xs font-semibold mt-1 ${dmftCategory.color}`}>
                {dmftCategory.label}
              </div>
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

export default RikkesDentalSection;
