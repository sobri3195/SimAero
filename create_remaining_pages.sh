#!/bin/bash

# This script creates all remaining Back Office and Service pages

cd /home/engine/project/src/pages

echo "Creating remaining Back Office and Service pages..."

# List of pages to create with their details
# Format: filename|title|subtitle|tabs

pages=(
  "AccountingPage|Akuntansi|Manajemen Akuntansi dan Laporan Keuangan|Invoice,Tagihan,Kartu Piutang,Aging Piutang,Kartu Hutang,Aging Hutang,Jurnal,Buku Besar,Rugi Laba,Neraca,Laporan Lainnya"
  "FinancePage|Keuangan|Manajemen Keuangan dan Kas|Kas,Bank,Transfer"
  "AmbulancePage|Ambulans|Layanan Ambulans dan Transportasi Medis|Mobil,Tarif,BMHP,Laporan"
  "MortuaryPage|Pemulasaran Jenazah|Layanan Pemulasaran dan Manajemen Jenazah|Mobil,Pendaftaran,Tindakan,Surat Meninggal"
  "MaternityPage|Persalinan|Layanan Persalinan dan Perawatan Bayi|Abortus,Persalinan,Pemeriksaan,Perawatan Bayi"
  "NutritionPage|Gizi|Layanan Gizi dan Diet|Makanan,Menu Diet,Konsultasi"
  "ExecutiveInfoPage|Sistem Informasi Eksekutif|Dashboard dan Laporan Eksekutif|Data Pasien,Pertambahan,Jenis Kasus,Peta,Kelahiran & Kematian,Arus Kas,Neraca"
  "NursingCarePage|Asuhan Keperawatan|Dokumentasi Asuhan Keperawatan|Implementasi,Rencana,Evaluasi,Discharge Planning,Riwayat Obat,NIC"
  "SterilizationPage|Sterilisasi|Layanan Sterilisasi Alat Medis|Penerimaan,Pencucian,Penyimpanan,Pengemasan"
  "IntensiveCarePage|Perawatan Intensif|ICU dan Perawatan Intensif|Info Pasien,Visit Doctor,Pindah Kamar,Menu Diet,Pemeriksaan,BMHP"
  "BloodBankServicePage|Bank Darah|Layanan Bank Darah dan Donor|Donor,Distribusi,Penyimpanan,Stok,BMHP"
  "RehabilitationPage|Rehabilitasi Medik|Layanan Rehabilitasi dan Fisioterapi|Info Pasien,Pendaftaran,Tindakan,BMHP"
  "AnesthesiaPage|Anestesi|Layanan Anestesi dan Operasi|Pra Anestesi,Intra Anestesi,Post Anestesi,Info Pasien"
  "InformationServicesPage|Informasi|Layanan Informasi Rumah Sakit|Poliklinik,Rawat Jalan,Rawat Inap,IGD,Tarif,Kamar,Lab,Radiologi,Bedah"
  "SMSGatewayPage|SMS Gateway & Email|Komunikasi dan Notifikasi|Pesan Keluar,Pesan Terkirim,Pesan Masuk"
  "MobilePatientsPage|Mobile Patients|Aplikasi Mobile untuk Pasien|Profil,Riwayat,Tagihan,Jadwal Dokter,Pendaftaran,Pemesanan Kamar,Ambulans,Profile RS"
  "MobileDoctorPage|Mobile Doctor|Aplikasi Mobile untuk Dokter|Profil,Jadwal,List Pendaftaran,List Pasien"
)

for page_info in "${pages[@]}"; do
  IFS='|' read -r filename title subtitle tabs <<< "$page_info"
  
  echo "Creating ${filename}.js..."
  
  # Create the page file
  cat > "${filename}.js" << EOF
import React, { useState } from 'react';
import { FileText, Users, Calendar, Package } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const ${filename%.js} = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
EOF

  # Generate tabs dynamically
  IFS=',' read -ra TAB_ARRAY <<< "$tabs"
  for i in "${!TAB_ARRAY[@]}"; do
    tab_name="${TAB_ARRAY[$i]}"
    tab_id="tab$((i+1))"
    
    cat >> "${filename}.js" << EOF
    { id: '${tab_id}', label: '${tab_name}', icon: FileText },
EOF
  done

  cat >> "${filename}.js" << 'EOF'
  ];

  const mockData = [
    {
      id: '001',
      name: 'Sample Data 1',
      date: '2024-01-15',
      status: 'Active'
    },
    {
      id: '002',
      name: 'Sample Data 2',
      date: '2024-01-16',
      status: 'Pending'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nama' },
    { key: 'date', label: 'Tanggal' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${getStatusColor(row.status)}\`}>
          {row.status}
        </span>
      )
    },
    { key: 'actions', label: 'Aksi', actions: true }
  ];

  const renderTabContent = () => {
    return (
      <DataTable
        columns={columns}
        data={mockData}
        title="Data"
        searchable
        exportable
        onView={(row) => { setSelectedItem(row); setModalType('view'); setIsModalOpen(true); }}
        onEdit={(row) => { setSelectedItem(row); setModalType('edit'); setIsModalOpen(true); }}
      />
    );
  };

  const breadcrumbItems = [
    { label: 'Modul', path: '#' },
EOF

  cat >> "${filename}.js" << EOF
    { label: '${title}', path: '/${filename%.js}' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="${title}"
        subtitle="${subtitle}"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={\`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors \${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }\`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'view' ? 'Detail' : 'Edit'}
        size="large"
      >
        {selectedItem && (
          <div className="space-y-4">
            <pre className="text-sm">{JSON.stringify(selectedItem, null, 2)}</pre>
          </div>
        )}
      </CRUDModal>
    </div>
  );
};

export default ${filename%.js};
EOF

done

echo "All pages created successfully!"
ls -la *.js | wc -l
