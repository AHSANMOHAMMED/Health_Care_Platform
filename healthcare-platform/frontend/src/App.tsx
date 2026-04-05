import { lazy, Suspense, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import api from './api';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorSearch from './components/DoctorSearch';
import AppointmentBooking from './components/AppointmentBooking';
import PatientProfile from './components/PatientProfile';
import MedicalRecords from './components/MedicalRecords';
import Messaging from './components/Messaging';
import PrescriptionManagement from './components/PrescriptionManagement';
import BillingPayment from './components/BillingPayment';
import EmergencyCare from './components/EmergencyCare';

const AgoraVideoRoom = lazy(() =>
  import('./components/AgoraVideoRoom').then((module) => ({ default: module.AgoraVideoRoom })),
);

type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export default function App() {
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem('role') as Role) || null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
  };

  return (
    <div className="min-h-screen">
      <Header role={role} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home role={role} />} />
        <Route path="/login" element={<Login onAuth={setRole} />} />
        <Route path="/register" element={<Register onAuth={setRole} />} />
        
        {/* Public routes */}
        <Route path="/doctors" element={<DoctorSearchPage />} />
        <Route path="/appointments" element={<AppointmentBookingPage />} />
        <Route path="/emergency" element={<EmergencyCarePage />} />
        
        {/* Patient routes */}
        <Route path="/patient" element={role === 'PATIENT' ? <Patient /> : <Navigate to="/login" />} />
        <Route path="/patient/profile" element={role === 'PATIENT' ? <PatientProfilePage /> : <Navigate to="/login" />} />
        <Route path="/patient/records" element={role === 'PATIENT' ? <MedicalRecordsPage /> : <Navigate to="/login" />} />
        <Route path="/patient/messages" element={role === 'PATIENT' ? <MessagingPage /> : <Navigate to="/login" />} />
        <Route path="/patient/prescriptions" element={role === 'PATIENT' ? <PrescriptionPage /> : <Navigate to="/login" />} />
        <Route path="/patient/billing" element={role === 'PATIENT' ? <BillingPage /> : <Navigate to="/login" />} />
        
        {/* Doctor routes */}
        <Route path="/doctor" element={role === 'DOCTOR' ? <Doctor /> : <Navigate to="/login" />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={role === 'ADMIN' ? <Admin /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function Home({ role }: { role: Role | null }) {
  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <LandingPage />;
}

function Login({ onAuth }: { onAuth: (r: Role) => void }) {
  return <LoginForm onAuth={onAuth} />;
}

function Register({ onAuth }: { onAuth: (r: Role) => void }) {
  return <RegisterForm onAuth={onAuth} />;
}

function Patient() {
  return <PatientDashboard />;
}

function Doctor() {
  return <DoctorDashboard />;
}

function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="healthcare-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform management and analytics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">89</div>
              <p className="text-gray-600">Verified Doctors</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1,234</div>
              <p className="text-gray-600">Total Appointments</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="healthcare-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm text-blue-600">GET /api/users</code>
                  <p className="text-xs text-gray-600 mt-1">List all users</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm text-blue-600">PATCH /api/doctors/admin/{'{id}'}/verification</code>
                  <p className="text-xs text-gray-600 mt-1">Verify doctor credentials</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm text-blue-600">GET /api/appointments</code>
                  <p className="text-xs text-gray-600 mt-1">View all appointments</p>
                </div>
              </div>
            </div>
            
            <div className="healthcare-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full healthcare-button text-left flex items-center justify-between">
                  <span>Manage Users</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full healthcare-button text-left flex items-center justify-between">
                  <span>Verify Doctors</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full healthcare-button text-left flex items-center justify-between">
                  <span>View Analytics</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Public route components
function DoctorSearchPage() {
  return <DoctorSearch />;
}

function AppointmentBookingPage() {
  return <AppointmentBooking />;
}

function EmergencyCarePage() {
  return <EmergencyCare />;
}

// Patient route components
function PatientProfilePage() {
  return <PatientProfile />;
}

function MedicalRecordsPage() {
  return <MedicalRecords />;
}

function MessagingPage() {
  return <Messaging />;
}

function PrescriptionPage() {
  return <PrescriptionManagement />;
}

function BillingPage() {
  return <BillingPayment />;
}
