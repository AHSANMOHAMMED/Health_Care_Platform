import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalLoading from './components/GlobalLoading';
import Landing from './pages/Landing';
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
import Navbar from './components/Navbar';

function AppRoutes() {
  const role = useAuthStore(state => state.role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!role ? <Login /> : <Navigate to={`/${role.toLowerCase()}`} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/patient" element={role === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />} />
          <Route path="/patient-onboarding" element={role === 'PATIENT' ? <PatientOnboarding /> : <Navigate to="/login" />} />
          <Route path="/doctor" element={role === 'DOCTOR' ? <DoctorDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/booking" element={role === 'PATIENT' ? <BookingFlow /> : <Navigate to="/login" />} />
          
          {/* AI Route (canonical) + legacy redirects */}
          <Route path="/ai-checker" element={<AiChecker />} />
          <Route path="/symptom-checker" element={<Navigate to="/ai-checker" replace />} />
          <Route path="/ai" element={<Navigate to="/ai-checker" replace />} />
          
          {/* Telemedicine Routes + legacy redirect */}
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/video" element={<Navigate to="/telemedicine" replace />} />
          <Route path="/video-consultation" element={<VideoConsultation />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
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
