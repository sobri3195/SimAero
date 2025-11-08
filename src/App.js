import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import RegistrationPage from './pages/RegistrationPage';
import QueueMonitorPage from './pages/QueueMonitorPage';
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
import DailyExaminationPage from './pages/DailyExaminationPage';
import PersonnelRikkesPage from './pages/PersonnelRikkesPage';
import FieldMedicinePage from './pages/FieldMedicinePage';
import CombatCarePage from './pages/CombatCarePage';
import DivingMedicinePage from './pages/DivingMedicinePage';
import HyperbaricPage from './pages/HyperbaricPage';
import MedicalFitnessPage from './pages/MedicalFitnessPage';
import DivingMedicalPage from './pages/DivingMedicalPage';
import QueueSystemPage from './pages/QueueSystemPage';
import OutpatientPage from './pages/OutpatientPage';
import CashierPage from './pages/CashierPage';
import PharmacyWarehousePage from './pages/PharmacyWarehousePage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import InventoryPage from './pages/InventoryPage';
import AdminSystemPage from './pages/AdminSystemPage';
import InsurancePage from './pages/InsurancePage';
import GeneralWarehousePage from './pages/GeneralWarehousePage';
import ProcurementPage from './pages/ProcurementPage';
import AccountingPage from './pages/AccountingPage';
import FinancePage from './pages/FinancePage';
import AmbulancePage from './pages/AmbulancePage';
import MortuaryPage from './pages/MortuaryPage';
import MaternityPage from './pages/MaternityPage';
import NutritionPage from './pages/NutritionPage';
import ExecutiveInfoPage from './pages/ExecutiveInfoPage';
import NursingCarePage from './pages/NursingCarePage';
import SterilizationPage from './pages/SterilizationPage';
import IntensiveCarePage from './pages/IntensiveCarePage';
import BloodBankServicePage from './pages/BloodBankServicePage';
import RehabilitationPage from './pages/RehabilitationPage';
import AnesthesiaPage from './pages/AnesthesiaPage';
import InformationServicesPage from './pages/InformationServicesPage';
import SMSGatewayPage from './pages/SMSGatewayPage';
import MobilePatientsPage from './pages/MobilePatientsPage';
import MobileDoctorPage from './pages/MobileDoctorPage';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/queue-monitor/:poliName" element={<QueueMonitorPage />} />
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
              <Route path="/daily-examination" element={<DailyExaminationPage />} />
              <Route path="/personnel-rikkes" element={<PersonnelRikkesPage />} />
              <Route path="/field-medicine" element={<FieldMedicinePage />} />
              <Route path="/combat-care" element={<CombatCarePage />} />
              <Route path="/diving-medicine" element={<DivingMedicinePage />} />
              <Route path="/hyperbaric" element={<HyperbaricPage />} />
              <Route path="/medical-fitness" element={<MedicalFitnessPage />} />
              <Route path="/diving-medical" element={<DivingMedicalPage />} />
              <Route path="/queue-system" element={<QueueSystemPage />} />
              <Route path="/outpatient" element={<OutpatientPage />} />
              <Route path="/cashier" element={<CashierPage />} />
              <Route path="/pharmacy-warehouse" element={<PharmacyWarehousePage />} />
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/admin-system" element={<AdminSystemPage />} />
              <Route path="/insurance" element={<InsurancePage />} />
              <Route path="/general-warehouse" element={<GeneralWarehousePage />} />
              <Route path="/procurement" element={<ProcurementPage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/ambulance" element={<AmbulancePage />} />
              <Route path="/mortuary" element={<MortuaryPage />} />
              <Route path="/maternity" element={<MaternityPage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/executive-info" element={<ExecutiveInfoPage />} />
              <Route path="/nursing-care" element={<NursingCarePage />} />
              <Route path="/sterilization" element={<SterilizationPage />} />
              <Route path="/intensive-care" element={<IntensiveCarePage />} />
              <Route path="/blood-bank-service" element={<BloodBankServicePage />} />
              <Route path="/rehabilitation" element={<RehabilitationPage />} />
              <Route path="/anesthesia" element={<AnesthesiaPage />} />
              <Route path="/information-services" element={<InformationServicesPage />} />
              <Route path="/sms-gateway" element={<SMSGatewayPage />} />
              <Route path="/mobile-patients" element={<MobilePatientsPage />} />
              <Route path="/mobile-doctor" element={<MobileDoctorPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
