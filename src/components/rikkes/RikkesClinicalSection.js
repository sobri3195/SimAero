import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';

const RikkesClinicalSection = ({ data, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    respiratory: '',
    visualAcuity: {
      right: '',
      left: ''
    },
    colorBlindness: 'Tidak',
    hearing: {
      right: 'Normal',
      left: 'Normal'
    },
    physicalExam: {
      head: 'Normal',
      eyes: 'Normal',
      ears: 'Normal',
      nose: 'Normal',
      throat: 'Normal',
      neck: 'Normal',
      chest: 'Normal',
      heart: 'Normal',
      lungs: 'Normal',
      abdomen: 'Normal',
      extremities: 'Normal',
      skin: 'Normal',
      neurological: 'Normal'
    },
    abnormalFindings: '',
    clinicalNotes: '',
    ...data
  });

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      if (heightInMeters > 0 && weight > 0) {
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi }));
      }
    }
  }, [formData.height, formData.weight]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    if (!formData.height || !formData.weight || !formData.bloodPressure) {
      alert('Mohon lengkapi data vital minimal (Tinggi, Berat, Tensi)');
      return;
    }
    onSubmit(formData);
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (bmiValue < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmiValue < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          Pemeriksaan Klinis
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Pemeriksaan fisik dan vital signs
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Tanda Vital</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tinggi Badan (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Berat Badan (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                BMI
              </label>
              <input
                type="text"
                value={formData.bmi}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
              {formData.bmi && (
                <p className={`text-xs mt-1 font-semibold ${getBMICategory(formData.bmi).color}`}>
                  {getBMICategory(formData.bmi).label}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tensi (mmHg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => handleChange('bloodPressure', e.target.value)}
                disabled={readOnly}
                placeholder="120/80"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nadi (x/menit)
              </label>
              <input
                type="number"
                value={formData.pulse}
                onChange={(e) => handleChange('pulse', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Suhu (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pernapasan (x/menit)
              </label>
              <input
                type="number"
                value={formData.respiratory}
                onChange={(e) => handleChange('respiratory', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Pemeriksaan Mata & Telinga</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visus Mata Kanan
              </label>
              <input
                type="text"
                value={formData.visualAcuity.right}
                onChange={(e) => handleNestedChange('visualAcuity', 'right', e.target.value)}
                disabled={readOnly}
                placeholder="6/6"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visus Mata Kiri
              </label>
              <input
                type="text"
                value={formData.visualAcuity.left}
                onChange={(e) => handleNestedChange('visualAcuity', 'left', e.target.value)}
                disabled={readOnly}
                placeholder="6/6"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buta Warna
              </label>
              <select
                value={formData.colorBlindness}
                onChange={(e) => handleChange('colorBlindness', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Tidak">Tidak</option>
                <option value="Partial">Partial</option>
                <option value="Total">Total</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pendengaran Kanan
              </label>
              <select
                value={formData.hearing.right}
                onChange={(e) => handleNestedChange('hearing', 'right', e.target.value)}
                disabled={readOnly}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Normal">Normal</option>
                <option value="Terganggu">Terganggu</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-4">Pemeriksaan Fisik Sistematis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.physicalExam).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={value}
                  onChange={(e) => handleNestedChange('physicalExam', key, e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Temuan Abnormal (jika ada)
          </label>
          <textarea
            value={formData.abnormalFindings}
            onChange={(e) => handleChange('abnormalFindings', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Jelaskan temuan abnormal secara detail..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Klinis Tambahan
          </label>
          <textarea
            value={formData.clinicalNotes}
            onChange={(e) => handleChange('clinicalNotes', e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Catatan tambahan dokter..."
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

export default RikkesClinicalSection;
