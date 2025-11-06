import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';

const RikkesRadiologySection = ({ data, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    chestXray: {
      performed: 'Ya',
      result: 'Normal',
      findings: ''
    },
    otherRadiology: '',
    radiologyNotes: '',
    ...data
  });

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          Pemeriksaan Radiologi
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Hasil pemeriksaan radiologi dan pencitraan
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Foto Rontgen Thorax</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dilakukan?
              </label>
              <select
                value={formData.chestXray.performed}
                onChange={(e) => handleNestedChange('chestXray', 'performed', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hasil
              </label>
              <select
                value={formData.chestXray.result}
                onChange={(e) => handleNestedChange('chestXray', 'result', e.target.value)}
                disabled={readOnly || formData.chestXray.performed === 'Tidak'}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Temuan (jika abnormal)
              </label>
              <textarea
                value={formData.chestXray.findings}
                onChange={(e) => handleNestedChange('chestXray', 'findings', e.target.value)}
                disabled={readOnly || formData.chestXray.performed === 'Tidak'}
                rows={3}
                placeholder="Jelaskan temuan abnormal..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pemeriksaan Radiologi Lain (jika ada)
          </label>
          <textarea
            value={formData.otherRadiology}
            onChange={(e) => handleChange('otherRadiology', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="USG, CT Scan, MRI, dll..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Radiologi
          </label>
          <textarea
            value={formData.radiologyNotes}
            onChange={(e) => handleChange('radiologyNotes', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Catatan tambahan, interpretasi radiologis..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
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

export default RikkesRadiologySection;
