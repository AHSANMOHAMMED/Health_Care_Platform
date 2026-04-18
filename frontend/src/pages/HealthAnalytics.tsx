import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  Scale,
  Zap,
  Moon,
  Footprints
} from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'normal' | 'abnormal' | 'caution';
  icon: typeof Activity;
  color: string;
}

export default function HealthAnalytics() {
  const [activeMetric, setActiveMetric] = useState('heart-rate');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const metrics: Metric[] = [
    { id: 'heart-rate', name: 'Heart Rate', value: '72', unit: 'BPM', trend: 'stable', change: '0%', status: 'normal', icon: Heart, color: 'text-red-500' },
    { id: 'blood-pressure', name: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'down', change: '-2%', status: 'normal', icon: Activity, color: 'text-indigo-500' },
    { id: 'body-weight', name: 'Body Weight', value: '74.2', unit: 'kg', trend: 'down', change: '-0.8kg', status: 'caution', icon: Scale, color: 'text-emerald-500' },
    { id: 'blood-oxygen', name: 'Blood Oxygen', value: '98', unit: '%', trend: 'stable', change: '0%', status: 'normal', icon: Wind, color: 'text-blue-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <TrendingUp className="text-indigo-600" /> Health Analytics
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Deep insights into your physiological trends and laboratory data.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all">
              <Download size={20} /> Export
           </button>
           <button className="h-14 px-6 btn-gradient text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              <Share2 size={20} /> Share Report
           </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         {metrics.map(metric => (
           <div 
             key={metric.id} 
             onClick={() => setActiveMetric(metric.id)}
             className={`premium-glass p-8 cursor-pointer transition-all duration-500 relative group ${activeMetric === metric.id ? 'border-2 border-indigo-500 bg-white ring-4 ring-indigo-50' : 'hover:border-indigo-200'}`}>
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${metric.color} group-hover:scale-110 transition-transform`}>
                    <metric.icon size={28} />
                 </div>
                 <div className="text-right">
                    <div className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg border uppercase tracking-tighter ${
                      metric.trend === 'up' ? 'bg-red-50 text-red-600 border-red-100' : 
                      metric.trend === 'down' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                       {metric.trend === 'up' && <TrendingUp size={12}/>}
                       {metric.trend === 'down' && <TrendingDown size={12}/>}
                       {metric.change}
                    </div>
                 </div>
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{metric.name}</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{metric.value}</span>
                    <span className="text-sm font-black text-slate-400 uppercase">{metric.unit}</span>
                 </div>
              </div>
              
              {/* Caution Indicator */}
              {metric.status === 'caution' && (
                 <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <AlertCircle size={10} /> Needs Attention
                 </div>
              )}
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Main Chart Area (Mock Visualizations) */}
         <div className="lg:col-span-2 space-y-8">
            <div className="premium-glass p-8 bg-white overflow-hidden relative min-h-[500px]">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                     {metrics.find(m => m.id === activeMetric)?.name} Trend
                  </h3>
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                     {(['7d', '30d', '90d'] as const).map(range => (
                        <button 
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                           {range.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Mock Chart Visualization with pure CSS/SVG */}
               <div className="relative h-64 w-full mt-20 group">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                     <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 0.2}} />
                           <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 0}} />
                        </linearGradient>
                     </defs>
                     <path d="M0,100 C150,80 250,150 400,90 S600,40 800,120 S1000,60 1000,60 L1000,200 L0,200 Z" fill="url(#grad)" className="animate-fade-in" />
                     <path d="M0,100 C150,80 250,150 400,90 S600,40 800,120 S1000,60 1000,60" fill="none" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" className="animate-draw" style={{strokeDasharray: '1200', strokeDashoffset: '1200', animation: 'draw 2s forwards'}} />
                     
                     {[...Array(6)].map((_, i) => (
                        <g key={i}>
                           <circle cx={i * 200} cy={100 + (Math.sin(i) * 50)} r="6" fill="#fff" stroke="#6366f1" strokeWidth="3" className="hover:scale-150 transition-transform cursor-pointer" />
                           <text x={i * 200} y="190" className="text-[14px] font-black fill-slate-300 uppercase tracking-widest text-center" textAnchor="middle">Day {i + 1}</text>
                        </g>
                     ))}
                  </svg>
                  
                  {/* Floating Value Indicator */}
                  <div className="absolute top-10 left-[40%] bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl animate-bounce delay-1000 flex items-center gap-2 border border-slate-700">
                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                     <span className="font-black text-lg">74 BPM</span>
                  </div>
               </div>

               <div className="mt-16 pt-8 border-t border-slate-100 grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Highest</p>
                     <p className="text-2xl font-black text-slate-900">88 <span className="text-sm font-medium text-slate-400 uppercase">BPM</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Average</p>
                     <p className="text-2xl font-black text-slate-900">72 <span className="text-sm font-medium text-slate-400 uppercase">BPM</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Lowest</p>
                     <p className="text-2xl font-black text-slate-900">58 <span className="text-sm font-medium text-slate-400 uppercase">BPM</span></p>
                  </div>
               </div>
            </div>

            {/* Smart Activity Rings Grid */}
            <div className="grid md:grid-cols-3 gap-6">
               {[ 
                 { name: 'Sleep', value: '7h 42m', icon: Moon, color: 'text-indigo-400', sub: '92% Quality', pct: 92 },
                 { name: 'Steps', value: '8,432', icon: Footprints, color: 'text-emerald-400', sub: 'Goal: 10k', pct: 84 },
                 { name: 'Energy', value: '2,450', icon: Zap, color: 'text-amber-400', sub: 'kcal burned', pct: 75 }
               ].map((ring, i) => (
                 <div key={i} className="premium-glass p-6 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                       <svg className="w-24 h-24 -rotate-90">
                          <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                          <circle className={ring.color} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * ring.pct) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <ring.icon size={24} className={ring.color} />
                       </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">{ring.name}</h4>
                    <p className="text-2xl font-black text-slate-900 my-1">{ring.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ring.sub}</p>
                 </div>
               ))}
            </div>
         </div>

         {/* Insights Sidebar */}
         <div className="space-y-8">
            <div className="premium-glass p-8 bg-slate-900 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <Zap size={24} />
                     </div>
                     <h3 className="text-xl font-black tracking-tight">AI Insights</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                           <CheckCircle2 size={16} /> Positive Trend
                        </p>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Your resting heart rate has decreased by 4 BPM over the last 30 days, indicating improved cardiovascular health.</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                           <Clock size={16} /> Schedule Alert
                        </p>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Your sleep pattern is irregular during weekends. Consistency will improve your daytime energy levels.</p>
                     </div>
                  </div>
                  <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl text-lg">
                     View AI Log
                  </button>
               </div>
            </div>

            <div className="premium-glass p-8">
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="text-indigo-600" /> Upcoming Screenings
               </h3>
               <div className="space-y-4">
                  {[ 
                    { title: 'Annual Lab Test', desc: 'Blood Panel • Lipids', date: 'April 14', color: 'bg-indigo-50 text-indigo-600' },
                    { title: 'Cardiac Follow-up', desc: 'Dr. Michael Chen', date: 'May 02', color: 'bg-emerald-50 text-emerald-600' }
                  ].map((scan, i) => (
                    <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${scan.color} group-hover:scale-110 transition-transform`}>
                          <Clock size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{scan.title}</p>
                          <p className="text-xs font-medium text-slate-500 mb-1">{scan.desc}</p>
                          <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{scan.date}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
