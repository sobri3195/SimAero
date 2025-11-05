import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from '../../mockDb';
import { db } from '../../mockDb';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

const IncidentManagement = () => {
  const { selectedFaskes } = useAuth();
  const { addNotification } = useApp();
  
  const [incidents, setIncidents] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);

  const [reportForm, setReportForm] = useState({
    type: 'Patient Safety',
    severity: 'Low',
    title: '',
    description: '',
    location: '',
    reporter: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!selectedFaskes) return;

    const incidentsQuery = query(
      collection(db, 'incidents'),
      where('faskesId', '==', selectedFaskes)
    );

    const unsubIncidents = onSnapshot(incidentsQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setIncidents(data);
    });

    return () => unsubIncidents();
  }, [selectedFaskes]);

  const submitReport = async () => {
    if (!reportForm.title || !reportForm.description) {
      addNotification({ type: 'warning', message: 'Judul dan deskripsi harus diisi' });
      return;
    }

    try {
      await addDoc(collection(db, 'incidents'), {
        ...reportForm,
        faskesId: selectedFaskes,
        status: 'open',
        createdAt: new Date().toISOString()
      });
      setReportForm({ type: 'Patient Safety', severity: 'Low', title: '', description: '', location: '', reporter: '', date: new Date().toISOString().split('T')[0] });
      setShowReportForm(false);
      addNotification({ type: 'success', message: 'Laporan insiden berhasil dibuat' });
    } catch (error) {
      console.error('Error submitting incident:', error);
    }
  };

  const closeIncident = async (incidentId) => {
    try {
      await updateDoc(doc(db, 'incidents', incidentId), {
        status: 'closed',
        closedDate: new Date().toISOString()
      });
      addNotification({ type: 'success', message: 'Insiden ditutup' });
    } catch (error) {
      console.error('Error closing incident:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="Manajemen Laporan Insiden"
        actions={
          <button onClick={() => setShowReportForm(!showReportForm)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <AlertTriangle size={16} />
            Laporkan Insiden
          </button>
        }
      >
        {showReportForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Form Laporan Insiden</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select value={reportForm.type} onChange={(e) => setReportForm(prev => ({ ...prev, type: e.target.value }))} className="p-2 border rounded">
                <option value="Patient Safety">Patient Safety</option>
                <option value="Medication Error">Medication Error</option>
                <option value="Fall">Fall</option>
                <option value="Equipment Failure">Equipment Failure</option>
                <option value="Infection Control">Infection Control</option>
                <option value="Other">Other</option>
              </select>
              <select value={reportForm.severity} onChange={(e) => setReportForm(prev => ({ ...prev, severity: e.target.value }))} className="p-2 border rounded">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <input type="text" placeholder="Judul Insiden" value={reportForm.title} onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))} className="p-2 border rounded col-span-2" />
              <textarea placeholder="Deskripsi detail insiden..." value={reportForm.description} onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))} className="p-2 border rounded col-span-2" rows="4" />
              <input type="text" placeholder="Lokasi Kejadian" value={reportForm.location} onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))} className="p-2 border rounded" />
              <input type="text" placeholder="Nama Pelapor" value={reportForm.reporter} onChange={(e) => setReportForm(prev => ({ ...prev, reporter: e.target.value }))} className="p-2 border rounded" />
              <input type="date" value={reportForm.date} onChange={(e) => setReportForm(prev => ({ ...prev, date: e.target.value }))} className="p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <button onClick={submitReport} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Submit Laporan</button>
              <button onClick={() => setShowReportForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {incidents.map(incident => (
            <div key={incident.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{incident.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      incident.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{incident.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>Tipe: {incident.type}</div>
                    <div>Lokasi: {incident.location}</div>
                    <div>Pelapor: {incident.reporter}</div>
                    <div>Tanggal: {new Date(incident.date).toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
                {incident.status === 'open' && (
                  <button onClick={() => closeIncident(incident.id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Tutup
                  </button>
                )}
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="text-center py-8 text-gray-500">Belum ada laporan insiden</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default IncidentManagement;
