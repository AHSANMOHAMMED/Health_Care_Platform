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
