import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingFlow from './pages/BookingFlow';
import VideoConsultation from './pages/VideoConsultation';
import AiChecker from './pages/AiChecker';
import Login from './pages/Login';
import { Activity, Calendar, LayoutDashboard, Shield, Stethoscope, Video, Sparkles, LogOut } from 'lucide-react';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, logout } = useAuthStore();
  
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-brand-dark font-bold text-xl">
              <Activity className="h-6 w-6 text-brand" />
              MediConnect Lanka
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/patient" className="hover:text-brand transition flex items-center gap-1"><LayoutDashboard size={16}/> Patient</Link>
              <Link to="/doctor" className="hover:text-brand transition flex items-center gap-1"><Stethoscope size={16}/> Doctor</Link>
              <Link to="/admin" className="hover:text-brand transition flex items-center gap-1"><Shield size={16}/> Admin</Link>
              <Link to="/book" className="hover:text-brand transition flex items-center gap-1"><Calendar size={16}/> Book</Link>
              <Link to="/ai" className="hover:text-brand transition flex items-center gap-1"><Sparkles size={16}/> AI Check</Link>
              
              {user ? (
                <button onClick={logout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
                  <LogOut size={16}/> Logout ({user.email})
                </button>
              ) : (
                <Link to="/login" className="bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition shadow-sm">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<HomeOverview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/book" element={<BookingFlow />} />
            <Route path="/video" element={<VideoConsultation />} />
            <Route path="/ai" element={<AiChecker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const HomeOverview = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-brand-light/30 p-4 rounded-full mb-6 relative">
            <Activity className="h-16 w-16 text-brand" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Smart Healthcare, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">Simplified.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10">
            Book appointments, consult via high-quality video, and check your symptoms using Google AI—all in one seamless platform securely linked end-to-end.
        </p>
        <div className="flex gap-4">
            <Link to="/book" className="bg-brand text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-brand-dark transition shadow-xl shadow-brand/30">
                Book Appointment
            </Link>
            <Link to="/ai" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full text-lg font-medium hover:border-brand hover:text-brand transition shadow-sm">
                Try AI Symptom Checker
            </Link>
        </div>
    </div>
);

export default App;
