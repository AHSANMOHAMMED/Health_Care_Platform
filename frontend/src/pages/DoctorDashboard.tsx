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
