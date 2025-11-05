import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';

import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import RegistrationPage from './pages/RegistrationPage';
import EHRPage from './pages/EHRPage';
import IGDPage from './pages/IGDPage';
import PlaceholderPage from './pages/PlaceholderPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/ehr" element={<EHRPage />} />
              <Route path="/igd" element={<IGDPage />} />
              
              <Route 
                path="/inpatient" 
                element={<PlaceholderPage title="Manajemen Rawat Inap" />} 
              />
              <Route 
                path="/surgery" 
                element={<PlaceholderPage title="Jadwal Operasi" />} 
              />
              <Route 
                path="/cssd" 
                element={<PlaceholderPage title="CSSD (Sterilisasi Instrumen)" />} 
              />
              <Route 
                path="/bloodbank" 
                element={<PlaceholderPage title="Bank Darah" />} 
              />
              <Route 
                path="/rikkes" 
                element={<PlaceholderPage title="Pemeriksaan Kesehatan (Rikkes)" />} 
              />
              <Route 
                path="/pharmacy" 
                element={<PlaceholderPage title="Farmasi & Apotek" />} 
              />
              <Route 
                path="/lab" 
                element={<PlaceholderPage title="Laboratorium" />} 
              />
              <Route 
                path="/radiology" 
                element={<PlaceholderPage title="Radiologi" />} 
              />
              <Route 
                path="/hr" 
                element={<PlaceholderPage title="Manajemen SDM & Penjadwalan" />} 
              />
              <Route 
                path="/assets" 
                element={<PlaceholderPage title="Aset & Kalibrasi" />} 
              />
              <Route 
                path="/logistics" 
                element={<PlaceholderPage title="Manajemen Logistik" />} 
              />
              <Route 
                path="/incidents" 
                element={<PlaceholderPage title="Laporan Insiden" />} 
              />
              <Route 
                path="/reports" 
                element={<PlaceholderPage title="Laporan & Analitik" />} 
              />
              <Route 
                path="/bridging" 
                element={<PlaceholderPage title="Bridging & Integrasi" />} 
              />
              <Route 
                path="/broadcast" 
                element={<PlaceholderPage title="Broadcast Pesan" />} 
              />
              <Route 
                path="/settings" 
                element={<PlaceholderPage title="Pengaturan & Kustomisasi" />} 
              />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
