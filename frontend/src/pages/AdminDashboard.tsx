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
