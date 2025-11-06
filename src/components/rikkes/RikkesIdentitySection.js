import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Save, Send } from 'lucide-react';

const RikkesIdentitySection = ({ data, examination, onSave, onSubmit, readOnly }) => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({
    nrp: examination?.nrp || '',
    name: examination?.patientName || '',
    rank: examination?.rank || '',
    unit: examination?.unit || '',
    birthDate: '',
    birthPlace: '',
    age: '',
    gender: 'L',
    address: '',
    phone: '',
    bloodType: '',
    examDate: examination?.examDate || new Date().toISOString().split('T')[0],
    purpose: examination?.purpose || '',
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

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.nrp || !formData.rank) {
      alert('Mohon lengkapi data wajib (Nama, NRP, Pangkat)');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
          Identitas Pasien
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Lengkapi data identitas pasien dengan teliti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            NRP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nrp}
            onChange={(e) => handleChange('nrp', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pangkat <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.rank}
            onChange={(e) => handleChange('rank', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Pilih Pangkat</option>
            <option value="Jenderal TNI">Jenderal TNI</option>
            <option value="Letjen TNI">Letjen TNI</option>
            <option value="Mayjen TNI">Mayjen TNI</option>
            <option value="Brigjen TNI">Brigjen TNI</option>
            <option value="Kolonel">Kolonel</option>
            <option value="Letnan Kolonel">Letnan Kolonel</option>
            <option value="Mayor">Mayor</option>
            <option value="Kapten">Kapten</option>
            <option value="Letnan Satu">Letnan Satu</option>
            <option value="Letnan Dua">Letnan Dua</option>
            <option value="Sersan Mayor">Sersan Mayor</option>
            <option value="Sersan Kepala">Sersan Kepala</option>
            <option value="Sersan Satu">Sersan Satu</option>
            <option value="Sersan Dua">Sersan Dua</option>
            <option value="Kopral Kepala">Kopral Kepala</option>
            <option value="Kopral Satu">Kopral Satu</option>
            <option value="Kopral Dua">Kopral Dua</option>
            <option value="Prajurit Kepala">Prajurit Kepala</option>
            <option value="Prajurit Satu">Prajurit Satu</option>
            <option value="Prajurit Dua">Prajurit Dua</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Satuan
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tempat Lahir
          </label>
          <input
            type="text"
            value={formData.birthPlace}
            onChange={(e) => handleChange('birthPlace', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tanggal Lahir
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Usia
          </label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            disabled={readOnly}
            placeholder="contoh: 30 tahun"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Kelamin
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Golongan Darah
          </label>
          <select
            value={formData.bloodType}
            onChange={(e) => handleChange('bloodType', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Pilih Golongan Darah</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            No. Telepon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={readOnly}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tanggal Pemeriksaan
          </label>
          <input
            type="date"
            value={formData.examDate}
            onChange={(e) => handleChange('examDate', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tujuan Pemeriksaan
          </label>
          <select
            value={formData.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            disabled={readOnly}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Pilih Tujuan</option>
            <option value="Masuk Dinas">Masuk Dinas</option>
            <option value="Kenaikan Pangkat">Kenaikan Pangkat</option>
            <option value="Pensiun">Pensiun</option>
            <option value="Tugas Khusus">Tugas Khusus</option>
            <option value="Berkala">Berkala</option>
            <option value="Lainnya">Lainnya</option>
          </select>
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

export default RikkesIdentitySection;
