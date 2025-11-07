import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import CRUDModal from '../components/common/CRUDModal';

const IntensiveCarePage = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'tab1', label: 'Info Pasien', icon: FileText },
    { id: 'tab2', label: 'Visit Doctor', icon: FileText },
    { id: 'tab3', label: 'Pindah Kamar', icon: FileText },
    { id: 'tab4', label: 'Menu Diet', icon: FileText },
    { id: 'tab5', label: 'Pemeriksaan', icon: FileText },
    { id: 'tab6', label: 'BMHP', icon: FileText },
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
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
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
    { label: 'Perawatan Intensif', path: '/IntensiveCarePage' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Perawatan Intensif"
        subtitle="ICU dan Perawatan Intensif"
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
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
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

export default IntensiveCarePage;
