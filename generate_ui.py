import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# App.tsx Routes update
write_file("frontend/src/App.tsx", """
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingFlow from './pages/BookingFlow';
import VideoConsultation from './pages/VideoConsultation';
import AiChecker from './pages/AiChecker';
import { Activity, Calendar, LayoutDashboard, Shield, Stethoscope, Video, Sparkles } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="bg-white border-b sticky top-0 z-50">
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
              <button className="bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition shadow-sm">
                Sign In
              </button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<HomeOverview />} />
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
        <div className="bg-brand-light/30 p-4 rounded-full mb-6">
            <Activity className="h-16 w-16 text-brand" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart Healthcare, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">Simplified.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10">
            Book appointments, consult via high-quality video, and check your symptoms using Google AI—all in one seamless platform.
        </p>
        <div className="flex gap-4">
            <Link to="/book" className="bg-brand text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-brand-dark transition shadow-lg shadow-brand/30">
                Book Appointment
            </Link>
            <Link to="/ai" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full text-lg font-medium hover:border-brand hover:text-brand transition shadow-sm">
                Try AI Symptom Checker
            </Link>
        </div>
    </div>
);

export default App;
""")

# Patient Dashboard
write_file("frontend/src/pages/PatientDashboard.tsx", """
import React from 'react';
import { Calendar, Clock, FileText, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">My Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-brand-light rounded-full flex items-center justify-center text-brand font-bold text-2xl">
                    JD
                </div>
                <div>
                    <h3 className="text-xl font-bold">John Doe</h3>
                    <p className="text-slate-500">O+ Blood Type</p>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <p className="flex justify-between"><span className="text-slate-500">DOB</span> <span className="font-medium">15 May 1990</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Phone</span> <span className="font-medium">+94 77 123 4567</span></p>
                <button className="w-full mt-4 bg-slate-50 text-brand py-2 rounded-lg font-medium hover:bg-brand-light transition">Edit Profile</button>
            </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-brand"/> Upcoming Appointments</h3>
                <Link to="/book" className="text-sm text-brand font-medium hover:underline">Book New</Link>
            </div>
            
            <div className="space-y-4">
                <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-brand-light/20 hover:bg-brand-light/40 transition">
                    <div className="flex gap-4 items-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center min-w-[60px]">
                            <p className="text-xs text-slate-500 font-bold uppercase">Oct</p>
                            <p className="text-xl font-bold text-brand">24</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Dr. Sarah Jenkins</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1"><Clock size={14}/> 10:00 AM - Cardiologist</p>
                        </div>
                    </div>
                    <Link to="/video" className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-dark transition shadow-sm">
                        <Video size={16}/> Join Video
                    </Link>
                </div>
                
                <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center opacity-70">
                    <div className="flex gap-4 items-center">
                        <div className="bg-slate-50 p-3 rounded-lg text-center min-w-[60px]">
                            <p className="text-xs text-slate-400 font-bold uppercase">Nov</p>
                            <p className="text-xl font-bold text-slate-600">02</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-600">Dr. Amal Perera</h4>
                            <p className="text-sm text-slate-400 flex items-center gap-1"><Clock size={14}/> 02:30 PM - General</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">PENDING</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
""")

# Ai Checker
write_file("frontend/src/pages/AiChecker.tsx", """
import React, { useState } from 'react';
import { Sparkles, Activity, AlertCircle } from 'lucide-react';

export default function AiChecker() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = () => {
        setLoading(true);
        setTimeout(() => {
            setResult("Based on your symptoms ('" + symptoms + "'), it appears you might be experiencing a mild viral infection. It is highly advised to rest, stay hydrated, and consult a General Physician. If you experience shortness of breath, please seek emergency care immediately.");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-brand to-brand-dark rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                <Sparkles className="absolute -right-4 -top-4 h-32 w-32 opacity-10" />
                <h2 className="text-3xl font-bold mb-2">AI Symptom Checker</h2>
                <p className="text-brand-light max-w-xl">Powered by Google Gemini. Describe your symptoms below for a preliminary AI analysis. This is NOT a substitute for professional medical advice.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2">Describe what you are feeling</label>
                <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                    rows={5}
                    placeholder="e.g. I have had a headache for 2 days, accompanied by a slight fever and a dry cough..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                ></textarea>
                
                <button 
                    onClick={handleAnalyze}
                    disabled={!symptoms || loading}
                    className="mt-4 bg-brand text-white px-6 py-3 rounded-xl font-medium w-full flex justify-center items-center gap-2 hover:bg-brand-dark disabled:opacity-50 transition"
                >
                    {loading ? <Activity className="animate-spin" /> : <Sparkles size={18}/>}
                    {loading ? 'Analyzing with Gemini...' : 'Analyze Symptoms'}
                </button>
            </div>

            {result && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                        <Activity className="text-blue-500" /> AI Preliminary Output
                    </h3>
                    <p className="text-blue-800 leading-relaxed">{result}</p>
                    
                    <div className="mt-4 p-4 bg-white/50 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-700">
                        <AlertCircle className="shrink-0" size={18}/>
                        <p>Remember to book an appointment with a real doctor to confirm your diagnosis.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
""")

# Booking Flow
write_file("frontend/src/pages/BookingFlow.tsx", """
import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar as CalendarIcon, CreditCard } from 'lucide-react';

const DOCTORS = [
    { id: 1, name: "Dr. Sarah Jenkins", spec: "Cardiologist", rating: 4.9, fee: 3500 },
    { id: 2, name: "Dr. Amal Perera", spec: "General Physician", rating: 4.7, fee: 2000 },
    { id: 3, name: "Dr. Nimali Silva", spec: "Dermatologist", rating: 4.8, fee: 3000 },
];

export default function BookingFlow() {
    const [step, setStep] = useState(1);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
                {[1,2,3].map(s => (
                    <div key={s} className={`h-10 w-10 flex items-center justify-center rounded-full font-bold text-sm ${step >= s ? 'bg-brand text-white border-4 border-white shadow-sm' : 'bg-slate-200 text-slate-500 border-4 border-white'}`}>
                        {s}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="animate-in fade-in">
                    <h2 className="text-2xl font-bold mb-6">Select a Specialist</h2>
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                        <input type="text" placeholder="Search by name or specialization..." className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    
                    <div className="grid gap-4">
                        {DOCTORS.map(doc => (
                            <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:border-brand transition group cursor-pointer" onClick={() => { setSelectedDoc(doc); setStep(2); }}>
                                <div className="flex gap-4 items-center">
                                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doc.name}`} alt="avatar" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand transition">{doc.name}</h3>
                                        <p className="text-slate-500 text-sm">{doc.spec}</p>
                                        <div className="flex gap-4 mt-2 text-xs font-medium">
                                            <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> {doc.rating}</span>
                                            <span className="flex items-center gap-1 text-slate-400"><MapPin size={14}/> Apollo Hospital</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-brand font-bold text-xl">LKR {doc.fee}</p>
                                    <button className="mt-2 bg-slate-50 text-brand px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-brand group-hover:text-white transition">Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && selectedDoc && (
                <div className="animate-in slide-in-from-right-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex gap-4 items-center mb-8 pb-8 border-b border-slate-100">
                        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-800">← Back</button>
                        <h2 className="text-2xl font-bold flex-1 text-center">Select Time Slot</h2>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><CalendarIcon className="text-brand"/> Next Available on Oct 24</h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM'].map(time => (
                                <button key={time} onClick={() => setStep(3)} className="py-3 text-sm font-medium border border-slate-200 rounded-xl hover:border-brand hover:bg-brand-light/30 hover:text-brand transition focus:bg-brand focus:text-white focus:border-brand focus:ring-2 focus:ring-brand-light focus:outline-none">
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && selectedDoc && (
                <div className="animate-in slide-in-from-right-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6 text-center">Confirm & Pay</h2>
                    <div className="bg-slate-50 p-6 rounded-xl mb-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-slate-500">Consultation Fee</span>
                            <span className="font-bold">LKR {selectedDoc.fee}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-slate-500">Platform Fee</span>
                            <span className="font-bold">LKR 200</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-slate-200">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg text-brand">LKR {selectedDoc.fee + 200}</span>
                        </div>
                    </div>
                    <button onClick={() => alert("Redirecting to PayHere Sandbox...")} className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-dark flex justify-center items-center gap-2 transition">
                        <CreditCard /> Pay Securely via PayHere
                    </button>
                </div>
            )}
        </div>
    );
}
""")

# Video Consultation
write_file("frontend/src/pages/VideoConsultation.tsx", """
import React, { useEffect } from 'react';
import { VideoOff, MicOff, PhoneOff } from 'lucide-react';

export default function VideoConsultation() {
    
    // Simulate Jitsi Iframe loading
    useEffect(() => {
        // Normally inject Jitsi script here
    }, []);

    return (
        <div className="h-[80vh] bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl">
            {/* Header */}
            <div className="bg-slate-800/50 absolute top-0 w-full p-4 flex justify-between items-center z-10 backdrop-blur-md">
                <div>
                    <h3 className="text-white font-bold">Consultation with Dr. Sarah Jenkins</h3>
                    <p className="text-emerald-400 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Secure Connection
                    </p>
                </div>
                <div className="bg-slate-900/80 px-3 py-1 rounded-full text-white text-sm font-mono tracking-wider">
                    14:52
                </div>
            </div>

            {/* Video Area (Simulated) */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Doctor Video placeholder */}
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" alt="Doctor" className="w-full h-full object-cover opacity-80" />
                
                {/* PIP Patient Video placeholder */}
                <div className="absolute bottom-24 right-8 w-48 h-64 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Patient" className="w-full h-full object-cover" />
                </div>
                
                {/* Overlay text if iframe not loaded yet */}
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-slate-900/60 backdrop-blur-sm z-0">
                    <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg font-medium">Connecting to Jitsi Meet infrastructure...</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-950 p-6 flex justify-center gap-6 items-center z-10 w-full absolute bottom-0">
                <button className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow-lg">
                    <MicOff size={24} />
                </button>
                <button className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow-lg">
                    <VideoOff size={24} />
                </button>
                <button className="h-14 w-32 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg gap-2 font-bold px-6">
                    <PhoneOff size={20} /> End Walk
                </button>
            </div>
        </div>
    );
}
""")

# Placeholders for Admin and Doctor just to complete the routing map visually
write_file("frontend/src/pages/AdminDashboard.tsx", """
import React from 'react';
import { Users, ShieldCheck, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Platform Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl"><Users size={24}/></div>
            <div><p className="text-slate-500">Total Patients</p><p className="text-2xl font-bold">1,204</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-xl"><ShieldCheck size={24}/></div>
            <div><p className="text-slate-500">Verified Doctors</p><p className="text-2xl font-bold">85</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 p-4 rounded-xl"><Activity size={24}/></div>
            <div><p className="text-slate-500">Sessions Today</p><p className="text-2xl font-bold">42</p></div>
        </div>
      </div>
    </div>
  );
}
""")

write_file("frontend/src/pages/DoctorDashboard.tsx", """
import React from 'react';
import { Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Doctor Portal</h2>
        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm">Status: ONLINE</span>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-xl mb-4">Today's Schedule</h3>
        <div className="p-4 border-l-4 border-brand bg-slate-50 flex justify-between items-center rounded-r-xl">
            <div>
                <p className="font-bold text-lg">10:00 AM - John Doe</p>
                <p className="text-slate-500 text-sm">Follow-up checkup. Symptoms: Mild headache.</p>
            </div>
            <Link to="/video" className="bg-brand text-white px-4 py-2 rounded-lg font-medium flex gap-2 hover:bg-brand-dark transition">
                <Video size={20} /> Start Session
            </Link>
        </div>
      </div>
    </div>
  );
}
""")

print("React UI implementation completed.")
