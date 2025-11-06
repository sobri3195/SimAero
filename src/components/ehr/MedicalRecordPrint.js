import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MedicalRecordPrint = ({ patientId, patientName }) => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, selectedFaskes]);

  const loadData = async () => {
    try {
      const patientDoc = await getDoc(doc(db, 'patients', patientId));
      if (patientDoc.exists()) {
        setPatient({ id: patientDoc.id, ...patientDoc.data() });
      }

      const recordsQuery = query(
        collection(db, 'medical_records'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes),
        orderBy('createdAt', 'desc')
      );
      const recordsSnap = await getDocs(recordsQuery);
      setRecords(recordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const diseasesQuery = query(
        collection(db, 'patient_chronic_diseases'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const diseasesSnap = await getDocs(diseasesQuery);
      setDiseases(diseasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const allergiesQuery = query(
        collection(db, 'patient_allergies'),
        where('patientId', '==', patientId),
        where('faskesId', '==', selectedFaskes)
      );
      const allergiesSnap = await getDocs(allergiesQuery);
      setAllergies(allergiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification({ type: 'error', message: 'Gagal memuat data' });
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterRecordsByDate = () => {
    if (!dateRange.start && !dateRange.end) return records;
    
    return records.filter(record => {
      const recordDate = record.createdAt.toDate ? record.createdAt.toDate() : new Date(record.createdAt);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      
      if (start && recordDate < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (recordDate > endOfDay) return false;
      }
      return true;
    });
  };

  const generatePDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const filteredRecords = filterRecordsByDate();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('RINGKASAN REKAM MEDIS', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(selectedFaskes || 'TNI Angkatan Udara', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;
      doc.setDrawColor(0, 0, 0);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('DATA PASIEN', 15, yPos);
      yPos += 7;
      
      doc.setFont(undefined, 'normal');
      const patientData = [
        ['Nama', `: ${patient?.nama || patientName || '-'}`],
        ['NIK/NRP', `: ${patient?.nik || patient?.nrp || '-'}`],
        ['Tanggal Lahir', `: ${patient?.tanggalLahir ? formatDate(patient.tanggalLahir) : '-'}`],
        ['Jenis Kelamin', `: ${patient?.jenisKelamin || '-'}`],
        ['Golongan Darah', `: ${patient?.golonganDarah || '-'}`],
        ['Alamat', `: ${patient?.alamat || '-'}`],
        ['Telepon', `: ${patient?.telepon || '-'}`]
      ];

      patientData.forEach(([label, value]) => {
        doc.text(label, 15, yPos);
        doc.text(value, 50, yPos);
        yPos += 6;
      });

      yPos += 5;

      if (allergies.length > 0) {
        doc.setFillColor(255, 200, 200);
        doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
        doc.setFont(undefined, 'bold');
        doc.setTextColor(139, 0, 0);
        doc.text('⚠ ALERGI', 18, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        yPos += 6;
        
        allergies.forEach(allergy => {
          doc.text(`• ${allergy.allergen} (${allergy.type}) - ${allergy.reaction}`, 18, yPos);
          yPos += 6;
        });
        yPos += 3;
      }

      if (diseases.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text('RIWAYAT PENYAKIT KRONIS', 15, yPos);
        yPos += 6;
        doc.setFont(undefined, 'normal');
        
        diseases.forEach(disease => {
          const status = disease.status === 'active' ? 'Aktif' : disease.status === 'controlled' ? 'Terkontrol' : 'Sembuh';
          doc.text(`• ${disease.disease}${disease.icdCode ? ' (' + disease.icdCode + ')' : ''} - ${status}`, 18, yPos);
          yPos += 6;
        });
        yPos += 3;
      }

      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont(undefined, 'bold');
      doc.text('RIWAYAT KUNJUNGAN', 15, yPos);
      yPos += 2;
      
      if (dateRange.start || dateRange.end) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        const rangeText = `Periode: ${dateRange.start ? formatDate(dateRange.start) : 'Awal'} - ${dateRange.end ? formatDate(dateRange.end) : 'Sekarang'}`;
        doc.text(rangeText, 15, yPos);
        yPos += 7;
      } else {
        yPos += 7;
      }

      if (filteredRecords.length === 0) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Tidak ada riwayat kunjungan pada periode yang dipilih.', 15, yPos);
      } else {
        filteredRecords.forEach((record, index) => {
          if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text(`Kunjungan ${index + 1} - ${formatDateTime(record.createdAt)}`, 15, yPos);
          yPos += 6;
          
          doc.setFont(undefined, 'normal');
          doc.text(`Keluhan: ${record.chiefComplaint || '-'}`, 15, yPos);
          yPos += 5;
          doc.text(`Dokter: ${record.createdBy || '-'}`, 15, yPos);
          yPos += 7;

          const soapData = [
            ['S', record.subjective || '-'],
            ['O', record.objective || '-'],
            ['A', record.assessment || '-'],
            ['P', record.plan || '-']
          ];

          soapData.forEach(([label, text]) => {
            if (yPos > pageHeight - 30) {
              doc.addPage();
              yPos = 20;
            }
            
            doc.setFont(undefined, 'bold');
            doc.text(`${label}:`, 18, yPos);
            doc.setFont(undefined, 'normal');
            
            const splitText = doc.splitTextToSize(text, pageWidth - 35);
            doc.text(splitText, 25, yPos);
            yPos += splitText.length * 5 + 2;
          });

          if (record.prescription) {
            if (yPos > pageHeight - 30) {
              doc.addPage();
              yPos = 20;
            }
            doc.setFont(undefined, 'bold');
            doc.text('Resep:', 18, yPos);
            yPos += 5;
            doc.setFont(undefined, 'normal');
            const prescLines = record.prescription.split('\n');
            prescLines.forEach(line => {
              if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
              }
              doc.text(`• ${line}`, 22, yPos);
              yPos += 5;
            });
          }

          yPos += 5;
          doc.setDrawColor(200, 200, 200);
          doc.line(15, yPos, pageWidth - 15, yPos);
          yPos += 8;
        });
      }

      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      yPos = pageHeight - 35;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 15, yPos);
      yPos += 15;
      doc.text('_________________________', pageWidth - 70, yPos);
      yPos += 5;
      doc.text('Dokter Pemeriksa', pageWidth - 70, yPos);

      const fileName = `Ringkasan_Medis_${patientName?.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
      addNotification({ type: 'success', message: 'PDF berhasil diunduh!' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      addNotification({ type: 'error', message: 'Gagal membuat PDF' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRecords = filterRecordsByDate();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">Cetak Ringkasan Rekam Medis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Akhir</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <div className="text-sm text-blue-800">
            <strong>Data yang akan dicetak:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Identitas pasien lengkap</li>
              <li>• Alergi: {allergies.length} item</li>
              <li>• Penyakit kronis: {diseases.length} item</li>
              <li>• Riwayat kunjungan: {filteredRecords.length} kunjungan (dari total {records.length})</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generatePDF}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={16} />
            {loading ? 'Membuat PDF...' : 'Download PDF'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="print-only bg-white p-8" style={{ display: 'none' }}>
        <style>{`
          @media print {
            .print-only { display: block !important; }
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">RINGKASAN REKAM MEDIS</h1>
          <p className="text-lg">{selectedFaskes || 'TNI Angkatan Udara'}</p>
          <hr className="my-4 border-black" />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">DATA PASIEN</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1 w-32">Nama</td><td>: {patient?.nama || patientName || '-'}</td></tr>
              <tr><td className="py-1">NIK/NRP</td><td>: {patient?.nik || patient?.nrp || '-'}</td></tr>
              <tr><td className="py-1">Tanggal Lahir</td><td>: {patient?.tanggalLahir ? formatDate(patient.tanggalLahir) : '-'}</td></tr>
              <tr><td className="py-1">Jenis Kelamin</td><td>: {patient?.jenisKelamin || '-'}</td></tr>
              <tr><td className="py-1">Golongan Darah</td><td>: {patient?.golonganDarah || '-'}</td></tr>
              <tr><td className="py-1">Alamat</td><td>: {patient?.alamat || '-'}</td></tr>
            </tbody>
          </table>
        </div>

        {allergies.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-400 p-4 rounded">
            <h2 className="text-lg font-bold mb-2 text-red-800">⚠ ALERGI</h2>
            <ul className="text-sm">
              {allergies.map(allergy => (
                <li key={allergy.id} className="py-1">
                  • {allergy.allergen} ({allergy.type}) - {allergy.reaction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {diseases.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">RIWAYAT PENYAKIT KRONIS</h2>
            <ul className="text-sm">
              {diseases.map(disease => (
                <li key={disease.id} className="py-1">
                  • {disease.disease}{disease.icdCode ? ` (${disease.icdCode})` : ''} - 
                  {disease.status === 'active' ? 'Aktif' : disease.status === 'controlled' ? 'Terkontrol' : 'Sembuh'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">RIWAYAT KUNJUNGAN</h2>
          {dateRange.start || dateRange.end ? (
            <p className="text-xs italic mb-3">
              Periode: {dateRange.start ? formatDate(dateRange.start) : 'Awal'} - {dateRange.end ? formatDate(dateRange.end) : 'Sekarang'}
            </p>
          ) : null}
          
          {filteredRecords.map((record, index) => (
            <div key={record.id} className="mb-6 border-b pb-4">
              <h3 className="font-bold text-sm mb-2">
                Kunjungan {index + 1} - {formatDateTime(record.createdAt)}
              </h3>
              <p className="text-sm mb-1">Keluhan: {record.chiefComplaint || '-'}</p>
              <p className="text-sm mb-2">Dokter: {record.createdBy || '-'}</p>
              <div className="text-sm space-y-2">
                <div><strong>S:</strong> {record.subjective || '-'}</div>
                <div><strong>O:</strong> {record.objective || '-'}</div>
                <div><strong>A:</strong> {record.assessment || '-'}</div>
                <div><strong>P:</strong> {record.plan || '-'}</div>
                {record.prescription && (
                  <div><strong>Resep:</strong><br/>{record.prescription}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-right">
          <p className="text-sm mb-12">
            Dicetak: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <div className="inline-block text-center">
            <p className="mb-16">_________________________</p>
            <p className="text-sm">Dokter Pemeriksa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordPrint;
