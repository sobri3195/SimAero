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
import InpatientPage from './pages/InpatientPage';
import SurgeryPage from './pages/SurgeryPage';
import CssdPage from './pages/CssdPage';
import BloodBankPage from './pages/BloodBankPage';
import RikkesPage from './pages/RikkesPage';
import PharmacyPage from './pages/PharmacyPage';
import LabPage from './pages/LabPage';
import RadiologyPage from './pages/RadiologyPage';
import HRPage from './pages/HRPage';
import AssetsPage from './pages/AssetsPage';
import LogisticsPage from './pages/LogisticsPage';
import IncidentsPage from './pages/IncidentsPage';
import ReportsPage from './pages/ReportsPage';
import BridgingPage from './pages/BridgingPage';
import BroadcastPage from './pages/BroadcastPage';
import SettingsPage from './pages/SettingsPage';
import PoliPage from './pages/PoliPage';
import BillingPage from './pages/BillingPage';

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
              <Route path="/inpatient" element={<InpatientPage />} />
              <Route path="/surgery" element={<SurgeryPage />} />
              <Route path="/cssd" element={<CssdPage />} />
              <Route path="/bloodbank" element={<BloodBankPage />} />
              <Route path="/rikkes/*" element={<RikkesPage />} />
              <Route path="/pharmacy" element={<PharmacyPage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/radiology" element={<RadiologyPage />} />
              <Route path="/hr" element={<HRPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/bridging" element={<BridgingPage />} />
              <Route path="/broadcast" element={<BroadcastPage />} />
              <Route path="/poli" element={<PoliPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
