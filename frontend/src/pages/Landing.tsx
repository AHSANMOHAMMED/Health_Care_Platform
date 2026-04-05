import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
      <div className="bg-indigo-50 p-6 rounded-full inline-block mb-4 shadow-inner">
        <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
        Next-Gen Healthcare at your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Fingertips</span>
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
        Experience Sri Lanka's leading AI-powered Telemedicine platform. Connect with elite doctors, manage appointments, and receive intelligent symptom analysis instantly.
      </p>
      <div className="flex gap-4 pt-4">
        <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          Get Started Now
        </Link>
        <Link to="/ai" className="px-8 py-4 bg-white border border-indigo-100 text-indigo-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all">
          Try AI Symptom Checker
        </Link>
      </div>
    </div>
  );
}
