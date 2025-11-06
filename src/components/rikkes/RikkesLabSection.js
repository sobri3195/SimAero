import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';

const RikkesLabSection = ({ data, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    hematology: {
      hemoglobin: '',
      hematocrit: '',
      leukocytes: '',
      platelets: '',
      erythrocytes: ''
    },
    bloodChemistry: {
      glucose: '',
      cholesterol: '',
      triglycerides: '',
      uricAcid: '',
      creatinine: '',
      sgot: '',
      sgpt: ''
    },
    urinalysis: {
      color: 'Kuning',
      clarity: 'Jernih',
      protein: 'Negatif',
      glucose: 'Negatif',
      blood: 'Negatif',
      ph: ''
    },
    labNotes: '',
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
          Pemeriksaan Laboratorium
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Hasil pemeriksaan laboratorium klinis
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Hematologi</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hemoglobin (g/dL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hematology.hemoglobin}
                onChange={(e) => handleNestedChange('hematology', 'hemoglobin', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 13-17"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hematokrit (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hematology.hematocrit}
                onChange={(e) => handleNestedChange('hematology', 'hematocrit', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 40-50"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Leukosit (/µL)
              </label>
              <input
                type="number"
                value={formData.hematology.leukocytes}
                onChange={(e) => handleNestedChange('hematology', 'leukocytes', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 4000-10000"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trombosit (/µL)
              </label>
              <input
                type="number"
                value={formData.hematology.platelets}
                onChange={(e) => handleNestedChange('hematology', 'platelets', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 150000-400000"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Eritrosit (juta/µL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hematology.erythrocytes}
                onChange={(e) => handleNestedChange('hematology', 'erythrocytes', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 4.5-5.5"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Kimia Darah</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Glukosa (mg/dL)
              </label>
              <input
                type="number"
                value={formData.bloodChemistry.glucose}
                onChange={(e) => handleNestedChange('bloodChemistry', 'glucose', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 70-100"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kolesterol (mg/dL)
              </label>
              <input
                type="number"
                value={formData.bloodChemistry.cholesterol}
                onChange={(e) => handleNestedChange('bloodChemistry', 'cholesterol', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: <200"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trigliserida (mg/dL)
              </label>
              <input
                type="number"
                value={formData.bloodChemistry.triglycerides}
                onChange={(e) => handleNestedChange('bloodChemistry', 'triglycerides', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: <150"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asam Urat (mg/dL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bloodChemistry.uricAcid}
                onChange={(e) => handleNestedChange('bloodChemistry', 'uricAcid', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 3-7"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kreatinin (mg/dL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bloodChemistry.creatinine}
                onChange={(e) => handleNestedChange('bloodChemistry', 'creatinine', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 0.6-1.2"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SGOT (U/L)
              </label>
              <input
                type="number"
                value={formData.bloodChemistry.sgot}
                onChange={(e) => handleNestedChange('bloodChemistry', 'sgot', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: <40"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SGPT (U/L)
              </label>
              <input
                type="number"
                value={formData.bloodChemistry.sgpt}
                onChange={(e) => handleNestedChange('bloodChemistry', 'sgpt', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: <40"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Urinalisis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warna
              </label>
              <select
                value={formData.urinalysis.color}
                onChange={(e) => handleNestedChange('urinalysis', 'color', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Kuning">Kuning</option>
                <option value="Kuning Muda">Kuning Muda</option>
                <option value="Kuning Tua">Kuning Tua</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kejernihan
              </label>
              <select
                value={formData.urinalysis.clarity}
                onChange={(e) => handleNestedChange('urinalysis', 'clarity', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Jernih">Jernih</option>
                <option value="Agak Keruh">Agak Keruh</option>
                <option value="Keruh">Keruh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                pH
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.urinalysis.ph}
                onChange={(e) => handleNestedChange('urinalysis', 'ph', e.target.value)}
                disabled={readOnly}
                placeholder="Normal: 4.5-8.0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Protein
              </label>
              <select
                value={formData.urinalysis.protein}
                onChange={(e) => handleNestedChange('urinalysis', 'protein', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Negatif">Negatif</option>
                <option value="+">+</option>
                <option value="++">++</option>
                <option value="+++">+++</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Glukosa
              </label>
              <select
                value={formData.urinalysis.glucose}
                onChange={(e) => handleNestedChange('urinalysis', 'glucose', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Negatif">Negatif</option>
                <option value="+">+</option>
                <option value="++">++</option>
                <option value="+++">+++</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Darah
              </label>
              <select
                value={formData.urinalysis.blood}
                onChange={(e) => handleNestedChange('urinalysis', 'blood', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Negatif">Negatif</option>
                <option value="+">+</option>
                <option value="++">++</option>
                <option value="+++">+++</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Laboratorium
          </label>
          <textarea
            value={formData.labNotes}
            onChange={(e) => handleChange('labNotes', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Catatan tambahan, interpretasi hasil, dll..."
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

export default RikkesLabSection;
