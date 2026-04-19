import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Activity, FileText, Video, Bell, ChevronRight, VideoIcon } from 'lucide-react';

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointmentLink, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/patients/me')
      .then(res => {
         setProfile(res.data);
         setLoading(false);
      })
      .catch((err) => {
         console.error('Failed to fetch patient profile:', err);
         setLoading(false);
         // No mock fallback
      });
  }, []);

  const handleBook = () => {
    setLink("");
    api.post('/appointments/book', { doctorId: 1, appointmentTime: new Date().toISOString() })
      .then(res => {
         setLink(res.data.meetingLink || "demo-link");
      }).catch(err => {
         // mock response
         setLink("demo-link-123");
      });
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-10 animate-slide-up px-4 md:px-0">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Patient Overview</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Here's what's happening with your health today.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
          <Bell size={18} /> <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span> Notifications
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8 animate-slide-up delay-100">
          
          {/* Hero Action Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl shadow-indigo-900/20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-3">Need a Consultation?</h2>
                <p className="text-indigo-100 max-w-md text-lg">Connect with a verified specialist instantly from the comfort of your home.</p>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <button onClick={handleBook} className="w-full px-6 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <CalendarIcon size={20} /> Book Express
                </button>
                {appointmentLink && (
                  <button onClick={() => navigate('/video?link='+appointmentLink)} className="w-full px-6 py-4 bg-teal-500 text-white font-bold rounded-2xl shadow-lg hover:bg-teal-400 transition-all duration-300 flex items-center justify-center gap-2 border border-teal-400">
                    <VideoIcon size={20} /> Join Session
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Health Vitals / Quick Stats grid */}
          <div className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] md:w-auto md:static md:mx-0">
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-6 md:pb-0 md:grid md:grid-cols-4 gap-4">
              {[
                { icon: Activity, label: 'Heart Rate', value: '72 bpm', color: 'text-rose-500', bg: 'bg-rose-50', pulse: true },
                { icon: Clock, label: 'Sleep', value: '7h 20m', color: 'text-indigo-500', bg: 'bg-indigo-50', pulse: false },
                { icon: FileText, label: 'Reports', value: '2 New', color: 'text-blue-500', bg: 'bg-blue-50', pulse: false },
                { icon: Activity, label: 'Blood Pres.', value: '120/80', color: 'text-emerald-500', bg: 'bg-emerald-50', pulse: false },
              ].map((stat, i) => (
                <div key={i} className="premium-glass p-5 md:p-6 text-center hover-trigger cursor-pointer shrink-0 w-[140px] md:w-auto snap-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${stat.bg} flex items-center justify-center mb-3 transform transition-transform group-hover:scale-110 ${stat.pulse ? 'animate-heartbeat-medical' : ''}`}>
                    <stat.icon className={`${stat.color} w-6 h-6`} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                  <p className="text-xs md:text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="premium-glass p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">Upcoming Schedules</h3>
              <button className="text-indigo-600 font-medium text-sm flex items-center hover:text-indigo-800 transition">View All <ChevronRight size={16} /></button>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase text-slate-400 group-hover:text-indigo-200">Apr</span>
                  <span className="text-xl font-bold text-slate-800 group-hover:text-white">12</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Dr. Sarah Jenkins</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><Video size={14}/> General Checkup</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">10:00 AM</div>
                <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-1 inline-block">Confirmed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Profile Sidebar) */}
        <div className="space-y-8 animate-slide-up delay-200">
          <div className="premium-glass p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-100 to-emerald-50"></div>
            <div className="relative z-10 flex flex-col items-center mt-6">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
                {loading ? <span className="animate-pulse">...</span> : (profile?.firstName?.[0] || 'A')}
              </div>
              
              {loading ? (
                 <div className="w-full flex flex-col items-center space-y-3">
                   <div className="h-6 bg-slate-200 rounded-lg w-1/2 animate-pulse"></div>
                   <div className="h-4 bg-slate-200 rounded-lg w-1/3 animate-pulse"></div>
                 </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900">{profile?.firstName || 'Not Set'} {profile?.lastName}</h3>
                  <p className="text-slate-500 mb-6 text-sm bg-slate-100 px-3 py-1 rounded-full mt-2">Verified Patient</p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm font-medium">Blood Group</span>
                      <span className="text-slate-800 font-bold">{profile?.bloodGroup || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm font-medium">Weight</span>
                      <span className="text-slate-800 font-bold">72 kg</span>
                    </div>
                    <div className="flex flex-col py-3">
                      <span className="text-slate-500 text-sm font-medium mb-1">Medical History</span>
                      <p className="text-slate-800 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">{profile?.medicalHistory || 'No remarks.'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="premium-glass p-8 bg-gradient-to-br from-indigo-50/50 to-white">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-indigo-600"/> Health Goal</h3>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-slate-600">You're 75% towards your weekly step goal. Keep it up!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
