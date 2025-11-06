import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { UserPlus, FileText, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DataTable from '../common/DataTable';
import PageHeader from '../common/PageHeader';
import CRUDModal from '../common/CRUDModal';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const PersonnelRikkes = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  
  const [formData, setFormData] = useState({
    // Identity
    nrp: '',
    nama: '',
    pangkat: '',
    kesatuan: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    
    // Pemeriksaan Umum
    tanggalRikkes: format(new Date(), 'yyyy-MM-dd'),
    tinggiBadan: '',
    beratBadan: '',
    tekananDarah: '',
    nadi: '',
    respirasi: '',
    suhu: '',
    imt: '',
    
    // Pemeriksaan Fisik
    mata: 'Normal',
    mataKeterangan: '',
    tht: 'Normal',
    thtKeterangan: '',
    gigi: 'Normal',
    gigiKeterangan: '',
    jantung: 'Normal',
    jantungKeterangan: '',
    paru: 'Normal',
    paruKeterangan: '',
    abdomen: 'Normal',
    abdomenKeterangan: '',
    ekstremitas: 'Normal',
    ekstremitasKeterangan: '',
    
    // Laboratorium
    hb: '',
    leukosit: '',
    trombosit: '',
    eritrosit: '',
    hematokrit: '',
    gulaDarahPuasa: '',
    gulaDarah2Jam: '',
    hbA1c: '',
    kolesterolTotal: '',
    ldl: '',
    hdl: '',
    trigliserida: '',
    sgot: '',
    sgpt: '',
    ureum: '',
    kreatinin: '',
    asamUrat: '',
    
    // Radiologi
    thorax: 'Normal',
    thoraxKeterangan: '',
    ekg: 'Normal',
    ekgKeterangan: '',
    
    // Kesimpulan
    diagnosis: '',
    rekomendasi: '',
    statusKesehatan: 'Layak',
    catatanTambahan: '',
    
    // Pemeriksa
    dokterPemeriksa: '',
    nomorSurat: ''
  });

  useEffect(() => {
    loadExaminations();
  }, [selectedFaskes]);

  const loadExaminations = async () => {
    try {
      setLoading(true);
      const examQuery = query(
        collection(db, 'personnel_rikkes'),
        where('faskesId', '==', selectedFaskes || 'default')
      );
      const snapshot = await getDocs(examQuery);
      const examList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExaminations(examList);
    } catch (error) {
      console.error('Error loading examinations:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data rikkes' });
    } finally {
      setLoading(false);
    }
  };

  const calculateIMT = () => {
    const height = parseFloat(formData.tinggiBadan) / 100; // convert to meters
    const weight = parseFloat(formData.beratBadan);
    if (height > 0 && weight > 0) {
      const imt = (weight / (height * height)).toFixed(1);
      setFormData({ ...formData, imt });
    }
  };

  const handleAdd = () => {
    setSelectedExam(null);
    setFormData({
      nrp: '',
      nama: '',
      pangkat: '',
      kesatuan: '',
      tanggalLahir: '',
      jenisKelamin: 'L',
      tanggalRikkes: format(new Date(), 'yyyy-MM-dd'),
      tinggiBadan: '',
      beratBadan: '',
      tekananDarah: '',
      nadi: '',
      respirasi: '',
      suhu: '',
      imt: '',
      mata: 'Normal',
      mataKeterangan: '',
      tht: 'Normal',
      thtKeterangan: '',
      gigi: 'Normal',
      gigiKeterangan: '',
      jantung: 'Normal',
      jantungKeterangan: '',
      paru: 'Normal',
      paruKeterangan: '',
      abdomen: 'Normal',
      abdomenKeterangan: '',
      ekstremitas: 'Normal',
      ekstremitasKeterangan: '',
      hb: '',
      leukosit: '',
      trombosit: '',
      eritrosit: '',
      hematokrit: '',
      gulaDarahPuasa: '',
      gulaDarah2Jam: '',
      hbA1c: '',
      kolesterolTotal: '',
      ldl: '',
      hdl: '',
      trigliserida: '',
      sgot: '',
      sgpt: '',
      ureum: '',
      kreatinin: '',
      asamUrat: '',
      thorax: 'Normal',
      thoraxKeterangan: '',
      ekg: 'Normal',
      ekgKeterangan: '',
      diagnosis: '',
      rekomendasi: '',
      statusKesehatan: 'Layak',
      catatanTambahan: '',
      dokterPemeriksa: '',
      nomorSurat: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setFormData({ ...exam });
    setModalOpen(true);
  };

  const handleView = (exam) => {
    setSelectedExam(exam);
    setViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.nrp || !formData.nama || !formData.tanggalRikkes) {
      addNotification({ type: 'error', message: 'NRP, nama, dan tanggal rikkes wajib diisi' });
      return;
    }

    try {
      const examData = {
        ...formData,
        faskesId: selectedFaskes || 'default',
        updatedAt: new Date().toISOString()
      };

      if (selectedExam) {
        await updateDoc(doc(db, 'personnel_rikkes', selectedExam.id), examData);
        addNotification({ type: 'success', message: 'Data rikkes berhasil diperbarui' });
      } else {
        await addDoc(collection(db, 'personnel_rikkes'), {
          ...examData,
          createdAt: new Date().toISOString()
        });
        addNotification({ type: 'success', message: 'Data rikkes berhasil ditambahkan' });
      }

      setModalOpen(false);
      loadExaminations();
    } catch (error) {
      console.error('Error saving examination:', error);
      addNotification({ type: 'error', message: 'Gagal menyimpan data rikkes' });
    }
  };

  const exportToExcel = () => {
    const data = examinations.map(exam => ({
      'NRP': exam.nrp,
      'Nama': exam.nama,
      'Pangkat': exam.pangkat || '-',
      'Kesatuan': exam.kesatuan || '-',
      'Tanggal Lahir': exam.tanggalLahir ? new Date(exam.tanggalLahir).toLocaleDateString('id-ID') : '-',
      'Tanggal Rikkes': exam.tanggalRikkes ? new Date(exam.tanggalRikkes).toLocaleDateString('id-ID') : '-',
      'Tinggi (cm)': exam.tinggiBadan || '-',
      'Berat (kg)': exam.beratBadan || '-',
      'IMT': exam.imt || '-',
      'Tekanan Darah': exam.tekananDarah || '-',
      'Diagnosis': exam.diagnosis || '-',
      'Status Kesehatan': exam.statusKesehatan,
      'Dokter Pemeriksa': exam.dokterPemeriksa || '-',
      'No. Surat': exam.nomorSurat || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rikkes Personel');
    XLSX.writeFile(wb, `Rikkes_Personel_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    addNotification({ type: 'success', message: 'Data berhasil diekspor ke Excel' });
  };

  const exportCompiledReport = () => {
    // Group by kesatuan
    const byKesatuan = examinations.reduce((acc, exam) => {
      const kesatuan = exam.kesatuan || 'Tidak Tercatat';
      if (!acc[kesatuan]) {
        acc[kesatuan] = [];
      }
      acc[kesatuan].push(exam);
      return acc;
    }, {});

    const summaryData = Object.entries(byKesatuan).map(([kesatuan, exams]) => ({
      'Kesatuan': kesatuan,
      'Total Personel': exams.length,
      'Layak': exams.filter(e => e.statusKesehatan === 'Layak').length,
      'Layak Dengan Catatan': exams.filter(e => e.statusKesehatan === 'Layak Dengan Catatan').length,
      'Tidak Layak': exams.filter(e => e.statusKesehatan === 'Tidak Layak').length,
      '% Layak': ((exams.filter(e => e.statusKesehatan === 'Layak').length / exams.length) * 100).toFixed(1) + '%'
    }));

    const ws = XLSX.utils.json_to_sheet(summaryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Rikkes');
    XLSX.writeFile(wb, `Rekap_Rikkes_${selectedFaskes}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    addNotification({ type: 'success', message: 'Laporan rekap berhasil diekspor' });
  };

  const columns = [
    { key: 'nrp', label: 'NRP' },
    { key: 'nama', label: 'Nama' },
    { key: 'pangkat', label: 'Pangkat', render: (row) => row.pangkat || '-' },
    { key: 'kesatuan', label: 'Kesatuan', render: (row) => row.kesatuan || '-' },
    { 
      key: 'tanggalRikkes', 
      label: 'Tanggal Rikkes',
      render: (row) => row.tanggalRikkes ? new Date(row.tanggalRikkes).toLocaleDateString('id-ID') : '-'
    },
    { 
      key: 'statusKesehatan', 
      label: 'Status',
      render: (row) => {
        const status = row.statusKesehatan;
        const colors = {
          'Layak': 'bg-green-100 text-green-800',
          'Layak Dengan Catatan': 'bg-yellow-100 text-yellow-800',
          'Tidak Layak': 'bg-red-100 text-red-800'
        };
        const icons = {
          'Layak': CheckCircle,
          'Layak Dengan Catatan': AlertCircle,
          'Tidak Layak': XCircle
        };
        const Icon = icons[status];
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 ${colors[status]}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {status}
          </span>
        );
      }
    },
    { key: 'dokterPemeriksa', label: 'Dokter', render: (row) => row.dokterPemeriksa || '-' },
    { key: 'actions', label: 'Aksi', actions: true, className: 'text-center' }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Rikkes Personel', path: '/personnel-rikkes' }
  ];

  const layakCount = examinations.filter(e => e.statusKesehatan === 'Layak').length;
  const layakDenganCatatanCount = examinations.filter(e => e.statusKesehatan === 'Layak Dengan Catatan').length;
  const tidakLayakCount = examinations.filter(e => e.statusKesehatan === 'Tidak Layak').length;

  if (loading) {
    return (
      <div>
        <PageHeader 
          title="Rikkes Personel TNI AU"
          subtitle="Pemeriksaan kesehatan rutin personel TNI AU"
          breadcrumbItems={breadcrumbItems}
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rikkes Personel TNI AU"
        subtitle="Pemeriksaan kesehatan rutin personel TNI AU"
        breadcrumbItems={breadcrumbItems}
        actionLabel="Tambah Rikkes"
        actionIcon={UserPlus}
        onActionClick={handleAdd}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Rikkes</p>
              <p className="text-2xl font-bold text-blue-900">{examinations.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Layak</p>
              <p className="text-2xl font-bold text-green-900">{layakCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Layak Dengan Catatan</p>
              <p className="text-2xl font-bold text-yellow-900">{layakDenganCatatanCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Tidak Layak</p>
              <p className="text-2xl font-bold text-red-900">{tidakLayakCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Detail
        </button>
        <button
          onClick={exportCompiledReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Rekap per Kesatuan
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={examinations}
        title="Data Rikkes Personel"
        searchable={true}
        exportable={false}
        pagination={true}
        itemsPerPage={10}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Form Modal */}
      <CRUDModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedExam ? 'Edit Data Rikkes' : 'Tambah Rikkes Baru'}
        onSubmit={handleSubmit}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identitas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Data Identitas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NRP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nrp}
                  onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pangkat
                </label>
                <select
                  value={formData.pangkat}
                  onChange={(e) => setFormData({ ...formData, pangkat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Pangkat</option>
                  <option value="Marsekal">Marsekal</option>
                  <option value="Marsekal Muda">Marsekal Muda</option>
                  <option value="Marsekal Pertama">Marsekal Pertama</option>
                  <option value="Kolonel">Kolonel</option>
                  <option value="Letnan Kolonel">Letnan Kolonel</option>
                  <option value="Mayor">Mayor</option>
                  <option value="Kapten">Kapten</option>
                  <option value="Lettu">Lettu</option>
                  <option value="Letda">Letda</option>
                  <option value="Peltu">Peltu</option>
                  <option value="Pelda">Pelda</option>
                  <option value="Serka">Serka</option>
                  <option value="Serda">Serda</option>
                  <option value="Sertu">Sertu</option>
                  <option value="Kopka">Kopka</option>
                  <option value="Kopda">Kopda</option>
                  <option value="Koptu">Koptu</option>
                  <option value="Praka">Praka</option>
                  <option value="Prada">Prada</option>
                  <option value="Pratu">Pratu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kesatuan
                </label>
                <input
                  type="text"
                  value={formData.kesatuan}
                  onChange={(e) => setFormData({ ...formData, kesatuan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Lanud Halim Perdanakusuma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Rikkes <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.tanggalRikkes}
                  onChange={(e) => setFormData({ ...formData, tanggalRikkes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pemeriksaan Fisik & Vital Signs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Pemeriksaan Fisik & Vital Signs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={formData.tinggiBadan}
                  onChange={(e) => {
                    setFormData({ ...formData, tinggiBadan: e.target.value });
                  }}
                  onBlur={calculateIMT}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={formData.beratBadan}
                  onChange={(e) => {
                    setFormData({ ...formData, beratBadan: e.target.value });
                  }}
                  onBlur={calculateIMT}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IMT
                </label>
                <input
                  type="text"
                  value={formData.imt}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tekanan Darah
                </label>
                <input
                  type="text"
                  value={formData.tekananDarah}
                  onChange={(e) => setFormData({ ...formData, tekananDarah: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nadi (x/menit)
                </label>
                <input
                  type="number"
                  value={formData.nadi}
                  onChange={(e) => setFormData({ ...formData, nadi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respirasi (x/menit)
                </label>
                <input
                  type="number"
                  value={formData.respirasi}
                  onChange={(e) => setFormData({ ...formData, respirasi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suhu (°C)
                </label>
                <input
                  type="number"
                  value={formData.suhu}
                  onChange={(e) => setFormData({ ...formData, suhu: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Pemeriksaan Spesialis */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Pemeriksaan Spesialis
            </h3>
            <div className="space-y-3">
              {[
                { key: 'mata', label: 'Mata' },
                { key: 'tht', label: 'THT' },
                { key: 'gigi', label: 'Gigi & Mulut' },
                { key: 'jantung', label: 'Jantung' },
                { key: 'paru', label: 'Paru' },
                { key: 'abdomen', label: 'Abdomen' },
                { key: 'ekstremitas', label: 'Ekstremitas' }
              ].map((item) => (
                <div key={item.key} className="grid grid-cols-4 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    {item.label}
                  </label>
                  <select
                    value={formData[item.key]}
                    onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                  </select>
                  <input
                    type="text"
                    value={formData[`${item.key}Keterangan`]}
                    onChange={(e) => setFormData({ ...formData, [`${item.key}Keterangan`]: e.target.value })}
                    className="col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Keterangan (jika abnormal)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Laboratorium (simplified) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Hasil Laboratorium (Opsional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hb (g/dL)
                </label>
                <input
                  type="number"
                  value={formData.hb}
                  onChange={(e) => setFormData({ ...formData, hb: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GD Puasa (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.gulaDarahPuasa}
                  onChange={(e) => setFormData({ ...formData, gulaDarahPuasa: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kolesterol (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.kolesterolTotal}
                  onChange={(e) => setFormData({ ...formData, kolesterolTotal: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asam Urat (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.asamUrat}
                  onChange={(e) => setFormData({ ...formData, asamUrat: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Radiologi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Hasil Radiologi
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 pt-2">
                  Thorax
                </label>
                <select
                  value={formData.thorax}
                  onChange={(e) => setFormData({ ...formData, thorax: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
                <input
                  type="text"
                  value={formData.thoraxKeterangan}
                  onChange={(e) => setFormData({ ...formData, thoraxKeterangan: e.target.value })}
                  className="col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Keterangan"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 pt-2">
                  EKG
                </label>
                <select
                  value={formData.ekg}
                  onChange={(e) => setFormData({ ...formData, ekg: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
                <input
                  type="text"
                  value={formData.ekgKeterangan}
                  onChange={(e) => setFormData({ ...formData, ekgKeterangan: e.target.value })}
                  className="col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Keterangan"
                />
              </div>
            </div>
          </div>

          {/* Kesimpulan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Kesimpulan & Rekomendasi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis / Kelainan yang Ditemukan
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tuliskan diagnosis atau kelainan yang ditemukan..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rekomendasi
                </label>
                <textarea
                  value={formData.rekomendasi}
                  onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tuliskan rekomendasi medis..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Kesehatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.statusKesehatan}
                    onChange={(e) => setFormData({ ...formData, statusKesehatan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Layak">Layak</option>
                    <option value="Layak Dengan Catatan">Layak Dengan Catatan</option>
                    <option value="Tidak Layak">Tidak Layak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dokter Pemeriksa
                  </label>
                  <input
                    type="text"
                    value={formData.dokterPemeriksa}
                    onChange={(e) => setFormData({ ...formData, dokterPemeriksa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  value={formData.catatanTambahan}
                  onChange={(e) => setFormData({ ...formData, catatanTambahan: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Catatan tambahan jika diperlukan..."
                />
              </div>
            </div>
          </div>
        </form>
      </CRUDModal>

      {/* View Modal */}
      <CRUDModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detail Rikkes Personel"
        size="xl"
        submitLabel={null}
      >
        {selectedExam && (
          <div className="space-y-6">
            {/* Identity Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Data Identitas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">NRP</p>
                  <p className="font-medium">{selectedExam.nrp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{selectedExam.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pangkat</p>
                  <p className="font-medium">{selectedExam.pangkat || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kesatuan</p>
                  <p className="font-medium">{selectedExam.kesatuan || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
                  <p className="font-medium">
                    {selectedExam.tanggalLahir 
                      ? new Date(selectedExam.tanggalLahir).toLocaleDateString('id-ID') 
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Rikkes</p>
                  <p className="font-medium">
                    {selectedExam.tanggalRikkes 
                      ? new Date(selectedExam.tanggalRikkes).toLocaleDateString('id-ID') 
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Vital Signs</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tinggi</p>
                  <p className="font-medium">{selectedExam.tinggiBadan ? `${selectedExam.tinggiBadan} cm` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Berat</p>
                  <p className="font-medium">{selectedExam.beratBadan ? `${selectedExam.beratBadan} kg` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IMT</p>
                  <p className="font-medium">{selectedExam.imt || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tekanan Darah</p>
                  <p className="font-medium">{selectedExam.tekananDarah || '-'}</p>
                </div>
              </div>
            </div>

            {/* Status & Conclusion */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Kesimpulan</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status Kesehatan</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded mt-1 ${
                    selectedExam.statusKesehatan === 'Layak' ? 'bg-green-100 text-green-800' :
                    selectedExam.statusKesehatan === 'Layak Dengan Catatan' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedExam.statusKesehatan}
                  </span>
                </div>
                {selectedExam.diagnosis && (
                  <div>
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="font-medium">{selectedExam.diagnosis}</p>
                  </div>
                )}
                {selectedExam.rekomendasi && (
                  <div>
                    <p className="text-sm text-gray-500">Rekomendasi</p>
                    <p className="font-medium">{selectedExam.rekomendasi}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dokter Pemeriksa</p>
                    <p className="font-medium">{selectedExam.dokterPemeriksa || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Surat</p>
                    <p className="font-medium">{selectedExam.nomorSurat || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default PersonnelRikkes;
