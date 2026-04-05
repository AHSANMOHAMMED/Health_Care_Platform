import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="bg-indigo-50 p-4 rounded-full mb-6 relative shadow-inner">
        <Activity className="h-16 w-16 text-indigo-600" />
        <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight drop-shadow-sm">
        Smart Healthcare, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Simplified.</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Book appointments, consult via high-quality video, and check your symptoms using AI—all in one seamless platform securely linked end-to-end.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
          Get Started Now
        </Link>
        <Link to="/ai" className="px-8 py-4 bg-white border border-indigo-100 text-indigo-600 font-bold rounded-full shadow-sm hover:bg-slate-50 transition-all hover:border-indigo-400">
          Try AI Symptom Checker
        </Link>
      </div>
    </div>
  );
}
