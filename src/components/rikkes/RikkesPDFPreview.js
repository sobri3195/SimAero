import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { doc, getDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { ArrowLeft, Download, Printer } from 'lucide-react';

const RikkesPDFPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useApp();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    loadExamination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadExamination = async () => {
    try {
      const examDoc = await getDoc(doc(db, 'rikkes_examinations', id));
      if (examDoc.exists()) {
        setExamination({ id: examDoc.id, ...examDoc.data() });
      }
    } catch (error) {
      console.error('Error loading examination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Fitur download PDF akan diimplementasikan dengan library seperti html2pdf.js atau jsPDF');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    );
  }

  if (!examination) {
    return <div className="p-6">Data tidak ditemukan</div>;
  }

  const identity = examination.sections?.identity || {};
  const clinical = examination.sections?.clinical || {};
  const dental = examination.sections?.dental || {};
  const lab = examination.sections?.lab || {};
  const radiology = examination.sections?.radiology || {};
  const conclusion = examination.sections?.conclusion || {};

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="no-print bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/rikkes/exam/${id}`)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto p-6">
        <div ref={printRef} className="bg-white shadow-lg" style={{ minHeight: '297mm' }}>
          <div className="p-12 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-9xl font-bold text-red-600 rotate-[-45deg]">RAHASIA</div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8 border-b-4 pb-4" style={{ borderColor: theme.primaryColor }}>
                <div className="text-sm font-bold text-gray-600">TNI ANGKATAN UDARA</div>
                <h1 className="text-2xl font-bold mt-2" style={{ color: theme.primaryColor }}>
                  LAPORAN PEMERIKSAAN KESEHATAN
                </h1>
                <div className="text-sm text-gray-600 mt-1">RAHASIA</div>
              </div>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">I. IDENTITAS</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="font-semibold">Nama:</span> {identity.name}</div>
                  <div><span className="font-semibold">NRP:</span> {identity.nrp}</div>
                  <div><span className="font-semibold">Pangkat:</span> {identity.rank}</div>
                  <div><span className="font-semibold">Satuan:</span> {identity.unit}</div>
                  <div><span className="font-semibold">Tempat/Tgl Lahir:</span> {identity.birthPlace}, {identity.birthDate}</div>
                  <div><span className="font-semibold">Usia:</span> {identity.age}</div>
                  <div><span className="font-semibold">Jenis Kelamin:</span> {identity.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                  <div><span className="font-semibold">Gol. Darah:</span> {identity.bloodType}</div>
                  <div className="col-span-2"><span className="font-semibold">Alamat:</span> {identity.address}</div>
                  <div><span className="font-semibold">Tgl Pemeriksaan:</span> {identity.examDate}</div>
                  <div><span className="font-semibold">Tujuan:</span> {identity.purpose}</div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">II. PEMERIKSAAN KLINIS</h2>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-4 gap-4">
                    <div><span className="font-semibold">TB:</span> {clinical.height} cm</div>
                    <div><span className="font-semibold">BB:</span> {clinical.weight} kg</div>
                    <div><span className="font-semibold">BMI:</span> {clinical.bmi}</div>
                    <div><span className="font-semibold">Tensi:</span> {clinical.bloodPressure} mmHg</div>
                  </div>
                  <div><span className="font-semibold">Visus:</span> OD: {clinical.visualAcuity?.right}, OS: {clinical.visualAcuity?.left}</div>
                  <div><span className="font-semibold">Buta Warna:</span> {clinical.colorBlindness}</div>
                  {clinical.abnormalFindings && (
                    <div className="mt-2">
                      <span className="font-semibold">Temuan Abnormal:</span>
                      <p className="mt-1 text-red-600">{clinical.abnormalFindings}</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">III. PEMERIKSAAN GIGI</h2>
                <div className="text-sm">
                  <div className="grid grid-cols-4 gap-4 mb-2">
                    <div><span className="font-semibold">Karies (D):</span> {dental.dentalData?.dmft?.decayed || 0}</div>
                    <div><span className="font-semibold">Hilang (M):</span> {dental.dentalData?.dmft?.missing || 0}</div>
                    <div><span className="font-semibold">Tambalan (F):</span> {dental.dentalData?.dmft?.filled || 0}</div>
                    <div><span className="font-semibold">DMF-T:</span> {dental.dentalData?.dmft?.total || 0}</div>
                  </div>
                  <div><span className="font-semibold">Kebersihan Mulut:</span> {dental.oralHygiene}</div>
                  <div><span className="font-semibold">Status Gingiva:</span> {dental.gingivalStatus}</div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">IV. LABORATORIUM</h2>
                <div className="text-sm grid grid-cols-2 gap-x-8 gap-y-1">
                  <div><span className="font-semibold">Hemoglobin:</span> {lab.hematology?.hemoglobin} g/dL</div>
                  <div><span className="font-semibold">Leukosit:</span> {lab.hematology?.leukocytes} /µL</div>
                  <div><span className="font-semibold">Glukosa:</span> {lab.bloodChemistry?.glucose} mg/dL</div>
                  <div><span className="font-semibold">Kolesterol:</span> {lab.bloodChemistry?.cholesterol} mg/dL</div>
                  <div><span className="font-semibold">Asam Urat:</span> {lab.bloodChemistry?.uricAcid} mg/dL</div>
                  <div><span className="font-semibold">Kreatinin:</span> {lab.bloodChemistry?.creatinine} mg/dL</div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">V. RADIOLOGI</h2>
                <div className="text-sm">
                  <div><span className="font-semibold">Foto Thorax:</span> {radiology.chestXray?.result || 'Normal'}</div>
                  {radiology.chestXray?.findings && (
                    <div className="mt-1 text-red-600">{radiology.chestXray.findings}</div>
                  )}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-3 bg-gray-100 p-2">VI. KESIMPULAN</h2>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status Kesehatan:</span>
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      conclusion.healthStatus === 'BAIK' ? 'bg-green-100 text-green-800' :
                      conclusion.healthStatus === 'BAIK DENGAN CATATAN' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {conclusion.healthStatus}
                    </span>
                  </div>
                  {conclusion.abnormalities?.length > 0 && (
                    <div>
                      <span className="font-semibold">Temuan Abnormal:</span>
                      <ul className="list-disc list-inside mt-1 text-red-600">
                        {conclusion.abnormalities.map((abnormality, idx) => (
                          <li key={idx}>{abnormality}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {conclusion.recommendations && (
                    <div>
                      <span className="font-semibold">Rekomendasi:</span>
                      <p className="mt-1">{conclusion.recommendations}</p>
                    </div>
                  )}
                  {conclusion.conclusion && (
                    <div>
                      <span className="font-semibold">Kesimpulan:</span>
                      <p className="mt-1">{conclusion.conclusion}</p>
                    </div>
                  )}
                </div>
              </section>

              <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-semibold">Kepala Kesehatan</div>
                  <div className="h-20"></div>
                  <div className="font-semibold">_____________________</div>
                  <div>NRP: ______________</div>
                </div>
                <div className="text-center">
                  <div>Pemeriksa,</div>
                  <div className="font-semibold">{conclusion.reviewerRank || 'Dokter Pemeriksa'}</div>
                  <div className="h-20"></div>
                  <div className="font-semibold">{conclusion.reviewerName || '_____________________'}</div>
                  <div>Tanggal: {conclusion.reviewDate}</div>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
                <div>Dokumen ini bersifat RAHASIA dan tidak boleh disebarluaskan tanpa izin</div>
                <div className="mt-1">Dicetak: {new Date().toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RikkesPDFPreview;
