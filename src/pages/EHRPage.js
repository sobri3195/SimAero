import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SOAPForm from '../components/ehr/SOAPForm';
import Card from '../components/common/Card';

const EHRPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mockPatients = [
    { id: '1', nama: 'Mayor Budi Santoso', nik: '3201012345678901' },
    { id: '2', nama: 'Kapten Andi Wijaya', nik: '3201012345678902' },
    { id: '3', nama: 'Lettu Sari Dewi', nik: '3201012345678903' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rekam Medis Elektronik (EHR)</h1>

      {!selectedPatient ? (
        <Card title="Pilih Pasien">
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cari pasien berdasarkan nama atau NIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                <Search size={16} />
                Cari
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {mockPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium">{patient.nama}</div>
                <div className="text-sm text-gray-600">NIK: {patient.nik}</div>
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Kembali ke daftar pasien
          </button>
          <SOAPForm 
            patientId={selectedPatient.id} 
            patientName={selectedPatient.nama} 
          />
        </div>
      )}
    </div>
  );
};

export default EHRPage;
