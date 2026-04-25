import React, { useState } from 'react';
import { 
  Activity, 
  FlaskConical, 
  ChevronRight, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Search,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

interface LabReport {
  id: string;
  testName: string;
  category: string;
  date: string;
  doctor: string;
  status: 'Critical' | 'Normal' | 'Developing';
  metrics: { name: string; value: string; unit: string; range: string; status: 'normal' | 'high' | 'low' }[];
}

export default function LabResultsManagement() {
  const [selectedReport, setSelectedReport] = useState<string | null>('LAB-1024');

  const reports: LabReport[] = [
    { 
      id: 'LAB-1024', testName: 'Comprehensive Metabolic Panel', category: 'Biochemistry', date: 'March 14, 2024', doctor: 'Dr. Sarah Jenkins', status: 'Normal',
      metrics: [
         { name: 'Glucose', value: '92', unit: 'mg/dL', range: '70-99', status: 'normal' },
         { name: 'Calcium', value: '9.4', unit: 'mg/dL', range: '8.5-10.2', status: 'normal' },
         { name: 'Sodium', value: '140', unit: 'mmol/L', range: '136-144', status: 'normal' },
         { name: 'Creatinine', value: '1.1', unit: 'mg/dL', range: '0.7-1.3', status: 'normal' }
      ]
    },
    { 
      id: 'LAB-1025', testName: 'Lipid Profile', category: 'Cardiology', date: 'March 05, 2024', doctor: 'Dr. Michael Chen', status: 'Developing',
      metrics: [
         { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high' },
         { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
         { name: 'LDL Cholesterol', value: '135', unit: 'mg/dL', range: '<100', status: 'high' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <FlaskConical className="text-indigo-600" /> Lab & Diagnostics
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Official diagnostic reports from Sri Lanka Health laboratories.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all">
              <Download size={20} /> Bulk Archive
           </button>
           <button className="h-14 px-8 btn-primary font-black shadow-slate-900/10 text-lg flex items-center gap-2">
              Request Test <ArrowRight size={18} />
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Report List */}
        <div className="lg:col-span-1 space-y-6">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" placeholder="Search by test or date..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-indigo-100 outline-none" />
           </div>

           <div className="space-y-4">
              {reports.map(report => (
                 <div 
                   key={report.id}
                   onClick={() => setSelectedReport(report.id)}
                   className={`premium-glass p-6 cursor-pointer transition-all ${selectedReport === report.id ? 'border-2 border-indigo-500 bg-white ring-4 ring-indigo-50' : 'hover:border-indigo-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${report.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {report.status}
                       </span>
                       <p className="text-xs font-black text-slate-600 uppercase">{report.id}</p>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{report.testName}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">{report.date}</p>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-600">
                       <span className="flex items-center gap-1"><FlaskConical size={12}/> {report.category}</span>
                       <ChevronRight size={16} />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Content: Report Details */}
        <div className="lg:col-span-2 space-y-8">
           {selectedReport ? (
             <div className="premium-glass p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 pb-12">
                   <div className="flex gap-6">
                      <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-900 shadow-2xl">
                         <FileText size={40} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-slate-900 tracking-tight">{reports.find(r => r.id === selectedReport)?.testName}</h2>
                         <p className="text-lg text-slate-500 font-medium">Recorded by {reports.find(r => r.id === selectedReport)?.doctor}</p>
                         <div className="flex gap-3 mt-3">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full"><Calendar size={14}/> {reports.find(r => r.id === selectedReport)?.date}</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle2 size={14}/> Verified</span>
                         </div>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100">
                      Print Report <Download size={18} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600">
                      <span className="col-span-2">Metric</span>
                      <span className="text-right">Result</span>
                      <span className="text-right">Normal Range</span>
                   </div>
                   <div className="space-y-3">
                      {reports.find(r => r.id === selectedReport)?.metrics.map(metric => (
                        <div key={metric.name} className="grid grid-cols-4 px-6 py-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-indigo-100 hover:shadow-soft transition-all">
                           <div className="col-span-2">
                              <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{metric.name}</h4>
                              <p className="text-xs font-bold text-slate-600">Biological Reference Interval</p>
                           </div>
                           <div className="text-right">
                              <p className={`text-2xl font-black ${metric.status === 'normal' ? 'text-slate-900' : 'text-red-500'}`}>{metric.value} <span className="text-sm font-medium text-slate-600 uppercase">{metric.unit}</span></p>
                              <div className="flex items-center gap-1 justify-end mt-1">
                                 {metric.status === 'normal' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-red-500" />}
                                 <span className={`text-[10px] font-black uppercase tracking-tighter ${metric.status === 'normal' ? 'text-emerald-600' : 'text-red-600'}`}>{metric.status}</span>
                              </div>
                           </div>
                           <div className="text-right flex flex-col justify-center">
                              <p className="text-sm font-black text-slate-500">{metric.range}</p>
                              <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">{metric.unit}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-slate-900 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                   <h3 className="text-xl font-black mb-4 flex items-center gap-2 relative z-10"><TrendingUp size={24} className="text-indigo-400" /> Bio-Marker Insights</h3>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xl relative z-10">All markers in this CMP panel are within optimal ranges. Your kidney filtration rate (Creatinine) is excellent. Continue current hydration level.</p>
                   <div className="mt-6 flex gap-3 relative z-10">
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2">
                         <Activity size={14} className="text-indigo-400" /> Vital History Normal
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2">
                         <Clock size={14} className="text-indigo-400" /> Next CMP: Aug 2024
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                <FlaskConical size={64} className="mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">Select a Report</h3>
                <p className="text-slate-500 font-medium">Choose a diagnostic record from the left history pane.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
