import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalLoading from './components/GlobalLoading';
import Landing from './pages/LandingPremium';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingFlow from './pages/BookingFlow';
import PatientOnboarding from './pages/PatientOnboarding';
import AiChecker from './pages/AiChecker';
import Telemedicine from './pages/Telemedicine';
import VideoConsultation from './pages/VideoConsultation';
import EmergencyServices from './pages/EmergencyServices';
import PrescriptionManagement from './pages/PrescriptionManagement';
import MedicationReminders from './pages/MedicationReminders';
import HealthAnalytics from './pages/HealthAnalytics';
import MentalHealthSupport from './pages/MentalHealthSupport';
import PharmacyLocator from './pages/PharmacyLocator';
import LabResultsManagement from './pages/LabResultsManagement';
import NotificationCenter from './pages/NotificationCenter';
import AccessibilitySettings from './pages/AccessibilitySettings';
import PaymentBilling from './pages/PaymentBilling';

import PatientOverviewPage from './pages/doctor/PatientOverviewPage';
import AppointmentsPage from './pages/doctor/AppointmentsPage';
import DailySchedulePage from './pages/doctor/DailySchedulePage';
import MedicalReportsPage from './pages/doctor/MedicalReportsPage';
import ConsultationsPage from './pages/doctor/ConsultationsPage';
import AnalyticsPage from './pages/doctor/AnalyticsPage';

// Dark layout wrapper for sub-pages (no old navbar)
function LegacyLayout() {
  return (
    <div className="min-h-screen bg-[#0C1220] text-slate-300 font-sans selection:bg-[#0EA5E9]/20 selection:text-[#0EA5E9]">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  const role = useAuthStore(state => state.role);

  return (
    <Routes>
      {/* =========================================
          FULL-SCREEN STANDALONE ROUTES
          ========================================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!role ? <Login /> : <Navigate to={`/${role.toLowerCase()}`} />} />
      <Route path="/register" element={!role ? <Register /> : <Navigate to={`/${role.toLowerCase()}`} />} />

      {/* AI Checker — full screen, no navbar, accessible to all */}
      <Route path="/ai-checker" element={<AiChecker />} />
      <Route path="/ai" element={<Navigate to="/ai-checker" replace />} />
      <Route path="/symptom-checker" element={<Navigate to="/ai-checker" replace />} />

      {/* Main Dashboards */}
      <Route path="/patient" element={role === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />} />

      <Route path="/doctor" element={role === 'DOCTOR' ? <DoctorDashboard /> : <Navigate to="/login" />}>
        <Route path="overview" element={<PatientOverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="schedule" element={<DailySchedulePage />} />
        <Route path="reports" element={<MedicalReportsPage />} />
        <Route path="chats" element={<ConsultationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />

      {/* =========================================
          PATIENT SUB-PAGES — dark layout, no legacy nav
          ========================================= */}
      <Route element={<LegacyLayout />}>
        {/* Patient sub-pages (auth required) */}
        <Route path="/booking" element={role === 'PATIENT' ? <BookingFlow /> : <Navigate to="/login" />} />
        <Route path="/appointments" element={role === 'PATIENT' ? <BookingFlow /> : <Navigate to="/login" />} />
        <Route path="/records" element={role === 'PATIENT' ? <LabResultsManagement /> : <Navigate to="/login" />} />
        <Route path="/billing" element={role === 'PATIENT' ? <PaymentBilling /> : <Navigate to="/login" />} />
        <Route path="/payment" element={role === 'PATIENT' ? <PaymentBilling /> : <Navigate to="/login" />} />
        <Route path="/prescriptions" element={<PrescriptionManagement />} />
        <Route path="/patient-onboarding" element={role === 'PATIENT' ? <PatientOnboarding /> : <Navigate to="/login" />} />

        {/* Open access pages */}
        <Route path="/emergency" element={<EmergencyServices />} />
        <Route path="/services" element={<Navigate to="/" replace />} />

        {/* Healthcare features */}
        <Route path="/medications" element={<MedicationReminders />} />
        <Route path="/health-analytics" element={<HealthAnalytics />} />
        <Route path="/mental-health" element={<MentalHealthSupport />} />
        <Route path="/pharmacy" element={<PharmacyLocator />} />
        <Route path="/lab-results" element={<LabResultsManagement />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/settings" element={<AccessibilitySettings />} />
        <Route path="/telemedicine" element={<Telemedicine />} />
        <Route path="/video" element={<Navigate to="/telemedicine" replace />} />
        <Route path="/video-consultation" element={<VideoConsultation />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <GlobalLoading />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
