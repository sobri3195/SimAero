import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { FileText, Download, Printer } from 'lucide-react';

const ExaminationSummaryPrint = ({ examinations, startDate, endDate, faskesName }) => {
  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('LAPORAN PEMERIKSAAN HARIAN PASIEN FKTP', doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(faskesName || 'FKTP TNI AU', doc.internal.pageSize.width / 2, 22, { align: 'center' });
    
    doc.setFontSize(10);
    const periodText = startDate === endDate 
      ? `Tanggal: ${format(new Date(startDate), 'dd MMMM yyyy', { locale: localeID })}`
      : `Periode: ${format(new Date(startDate), 'dd MMM yyyy', { locale: localeID })} - ${format(new Date(endDate), 'dd MMM yyyy', { locale: localeID })}`;
    doc.text(periodText, doc.internal.pageSize.width / 2, 28, { align: 'center' });
    
    // Prepare table data
    const tableData = examinations.map((exam, index) => [
      index + 1,
      format(new Date(exam.tanggalPemeriksaan), 'dd/MM/yyyy'),
      exam.waktuPemeriksaan || '-',
      exam.patientName || '-',
      exam.poli || '-',
      exam.keluhan || '-',
      `TD: ${exam.pemeriksaanFisik?.tekananDarah || '-'}\nN: ${exam.pemeriksaanFisik?.nadi || '-'}\nS: ${exam.pemeriksaanFisik?.suhu || '-'}`,
      exam.diagnosis || '-',
      exam.tindakanMedis?.length > 0 
        ? exam.tindakanMedis.map(t => t.nama).join(', ')
        : '-',
      exam.resepObat?.length > 0
        ? exam.resepObat.map(o => `${o.nama} ${o.dosis}`).join(', ')
        : '-',
      exam.rujukan?.isRujukan ? `Ya\n(${exam.rujukan.tujuan})` : 'Tidak',
      exam.dokter || '-'
    ]);
    
    // Table
    doc.autoTable({
      startY: 35,
      head: [['No', 'Tanggal', 'Jam', 'Nama Pasien', 'Poli', 'Keluhan', 'Vital Signs', 'Diagnosis', 'Tindakan', 'Obat', 'Rujukan', 'Dokter']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 22 },
        2: { cellWidth: 18 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 35 },
        6: { cellWidth: 30 },
        7: { cellWidth: 35 },
        8: { cellWidth: 30 },
        9: { cellWidth: 35 },
        10: { cellWidth: 20 },
        11: { cellWidth: 25 }
      },
      margin: { left: 10, right: 10 }
    });
    
    // Summary statistics
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('RINGKASAN:', 10, finalY);
    
    doc.setFont(undefined, 'normal');
    const totalPasien = examinations.length;
    const totalRujukan = examinations.filter(e => e.rujukan?.isRujukan).length;
    const poliStats = {};
    examinations.forEach(e => {
      poliStats[e.poli] = (poliStats[e.poli] || 0) + 1;
    });
    
    let summaryY = finalY + 7;
    doc.text(`• Total Pemeriksaan: ${totalPasien} pasien`, 10, summaryY);
    summaryY += 5;
    doc.text(`• Total Rujukan: ${totalRujukan} pasien`, 10, summaryY);
    summaryY += 5;
    doc.text(`• Distribusi per Poli:`, 10, summaryY);
    summaryY += 5;
    Object.entries(poliStats).forEach(([poli, count]) => {
      doc.text(`  - ${poli}: ${count} pasien`, 15, summaryY);
      summaryY += 5;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: localeID })}`,
        10,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    return doc;
  };
  
  const handleDownload = () => {
    const doc = generatePDF();
    const fileName = `Laporan_Pemeriksaan_FKTP_${format(new Date(startDate), 'yyyyMMdd')}.pdf`;
    doc.save(fileName);
  };
  
  const handlePrint = () => {
    const doc = generatePDF();
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <FileText className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Cetak Ringkasan Kunjungan untuk Laporan Bulanan
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Format standar FKTP untuk laporan ke Dinas Kesehatan TNI AU. 
              Dokumen ini berisi data lengkap pemeriksaan pasien termasuk keluhan, diagnosis, 
              tindakan medis, dan rujukan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div>
                <span className="font-medium">Total Pemeriksaan:</span> {examinations.length} pasien
              </div>
              <div>
                <span className="font-medium">Periode:</span>{' '}
                {startDate === endDate 
                  ? format(new Date(startDate), 'dd MMMM yyyy', { locale: localeID })
                  : `${format(new Date(startDate), 'dd MMM', { locale: localeID })} - ${format(new Date(endDate), 'dd MMM yyyy', { locale: localeID })}`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Printer className="w-5 h-5" />
          <span>Print Langsung</span>
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Konten Laporan:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Identitas pasien dan waktu pemeriksaan</li>
          <li>Keluhan utama dan riwayat penyakit</li>
          <li>Pemeriksaan fisik dan vital signs lengkap</li>
          <li>Diagnosis dengan kode ICD-10</li>
          <li>Tindakan medis yang dilakukan</li>
          <li>Resep obat yang diberikan</li>
          <li>Rujukan (jika ada)</li>
          <li>Statistik dan ringkasan per poli</li>
        </ul>
      </div>
    </div>
  );
};

export default ExaminationSummaryPrint;
