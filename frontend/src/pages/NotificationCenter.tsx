import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Trash2, 
  Filter, 
  Settings, 
  Calendar, 
  Activity,
  User,
  ArrowRight
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'alert' | 'update' | 'security';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationCenter() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  
  const [notifications] = useState<Notification[]>([
    { id: '1', type: 'appointment', title: 'Upcoming Consultation', message: 'You have a video call with Dr. Sarah Jenkins in 15 minutes. Please join the room.', date: 'Just now', read: false, priority: 'high' },
    { id: '2', type: 'alert', title: 'Medication Reminder', message: 'Time to take your Amoxicillin (500mg) dose.', date: '2 hours ago', read: false, priority: 'medium' },
    { id: '3', type: 'update', title: 'Lab Results Ready', message: 'Your Lipid Profile results from March 10 are now available for viewing.', date: 'Yesterday', read: true, priority: 'low' },
    { id: '4', type: 'security', title: 'Security Alert', message: 'New login detected from a Safari browser on Mac OS.', date: '3 days ago', read: true, priority: 'medium' }
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Bell className="text-indigo-600 animate-swing" /> Notification Center
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Stay updated with your latest health events and alerts.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={20} />
           </button>
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
              <Settings size={20} />
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-8 self-start w-fit">
         <button 
           onClick={() => setActiveFilter('all')}
           className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeFilter === 'all' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
            All Notifications
         </button>
         <button 
           onClick={() => setActiveFilter('unread')}
           className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeFilter === 'unread' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
            Unread <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-black">2</span>
         </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
         {notifications.map(note => (
            <div key={note.id} className={`premium-glass p-6 group hover:border-indigo-100 transition-all cursor-pointer relative flex gap-6 items-start ${!note.read ? 'bg-indigo-50/30' : ''}`}>
               {!note.read && <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>}
               
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                 note.type === 'appointment' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                 note.type === 'alert' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                 note.type === 'security' ? 'bg-slate-900 text-white border-slate-800' :
                 'bg-emerald-50 text-emerald-600 border-emerald-100'
               }`}>
                  {note.type === 'appointment' && <Calendar size={28} />}
                  {note.type === 'alert' && <AlertCircle size={28} />}
                  {note.type === 'update' && <Activity size={28} />}
                  {note.type === 'security' && <ShieldCheck size={28} />}
               </div>

               <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                     <h3 className={`text-xl font-black tracking-tight ${!note.read ? 'text-slate-900' : 'text-slate-600'}`}>{note.title}</h3>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed mb-4">{note.message}</p>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {note.date}</span>
                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                        <span className={`flex items-center gap-1.5 ${note.priority === 'high' ? 'text-red-500' : 'text-slate-400'}`}>Priority: {note.priority}</span>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all">Mark Read</button>
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Footer Info */}
      <div className="mt-16 flex flex-col items-center justify-center text-center py-12 border-t border-slate-100">
         <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
         </div>
         <h4 className="text-lg font-black text-slate-900 mb-2">Smart Alert Optimization</h4>
         <p className="text-slate-500 font-medium max-w-sm">We only notify you of high-priority health events to reduce digital fatigue.</p>
         <button className="mt-6 text-indigo-600 font-black flex items-center gap-2 hover:underline">
            Manage Alert Preferences <ArrowRight size={18} />
         </button>
      </div>
    </div>
  );
}
