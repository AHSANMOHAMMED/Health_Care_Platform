import React, { useState } from 'react';
import { 
  TrendingUp, Users, Calendar, DollarSign, Activity, Heart,
  Clock, CheckCircle, AlertTriangle, Star, ChevronDown, Filter,
  Download, BarChart3, PieChart, LineChart, Target, Zap, MessageSquare, Video, Pill
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function AnalyticsPage() {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  // Enhanced analytics navigation states
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState(true);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const dataByRange = {
    week: {
      chartData: [
        { label: 'Mon', patients: 8,  revenue: 40000,  consultations: 11 },
        { label: 'Tue', patients: 12, revenue: 62000,  consultations: 16 },
        { label: 'Wed', patients: 10, revenue: 51000,  consultations: 14 },
        { label: 'Thu', patients: 15, revenue: 78000,  consultations: 20 },
        { label: 'Fri', patients: 11, revenue: 57000,  consultations: 15 },
        { label: 'Sat', patients: 6,  revenue: 31000,  consultations: 8  },
        { label: 'Sun', patients: 3,  revenue: 15000,  consultations: 4  },
      ],
      maxRevenue: 90000,
      stats: { totalPatients: 65, newPatients: 8, totalRevenue: 334000, averageRating: 4.7, totalConsultations: 88, completionRate: 91 },
      performance: { patientSatisfaction: 89, responseTime: 2.1, noShowRate: 6, referralRate: 74 }
    },
    month: {
      chartData: [
        { label: 'Week 1', patients: 45, revenue: 225000, consultations: 62 },
        { label: 'Week 2', patients: 52, revenue: 267500, consultations: 71 },
        { label: 'Week 3', patients: 48, revenue: 245000, consultations: 65 },
        { label: 'Week 4', patients: 61, revenue: 315000, consultations: 84 },
      ],
      maxRevenue: 350000,
      stats: { totalPatients: 248, newPatients: 32, totalRevenue: 1250000, averageRating: 4.8, totalConsultations: 156, completionRate: 94 },
      performance: { patientSatisfaction: 92, responseTime: 2.4, noShowRate: 8, referralRate: 78 }
    },
    quarter: {
      chartData: [
        { label: 'Jan', patients: 180, revenue: 920000,  consultations: 245 },
        { label: 'Feb', patients: 210, revenue: 1080000, consultations: 287 },
        { label: 'Mar', patients: 195, revenue: 995000,  consultations: 261 },
      ],
      maxRevenue: 1200000,
      stats: { totalPatients: 585, newPatients: 94, totalRevenue: 2995000, averageRating: 4.8, totalConsultations: 793, completionRate: 93 },
      performance: { patientSatisfaction: 91, responseTime: 2.6, noShowRate: 9, referralRate: 76 }
    },
    year: {
      chartData: [
        { label: 'Q1', patients: 585, revenue: 2995000, consultations: 793 },
        { label: 'Q2', patients: 620, revenue: 3180000, consultations: 841 },
        { label: 'Q3', patients: 598, revenue: 3060000, consultations: 812 },
        { label: 'Q4', patients: 645, revenue: 3310000, consultations: 876 },
      ],
      maxRevenue: 3500000,
      stats: { totalPatients: 2448, newPatients: 312, totalRevenue: 12545000, averageRating: 4.9, totalConsultations: 3322, completionRate: 95 },
      performance: { patientSatisfaction: 94, responseTime: 2.2, noShowRate: 7, referralRate: 81 }
    }
  };

  const current = dataByRange[timeRange];

  const patientConditions = [
    { condition: 'Hypertension', count: 45, percentage: 18 },
    { condition: 'Diabetes', count: 38, percentage: 15 },
    { condition: 'Respiratory', count: 32, percentage: 13 },
    { condition: 'Cardiac', count: 28, percentage: 11 },
    { condition: 'Other', count: 105, percentage: 43 }
  ];

  const recentActivity = [
    { type: 'consultation', patient: 'Aruni Wijesinghe', time: '2 hours ago', status: 'completed' },
    { type: 'appointment', patient: 'Kasun Perera', time: '3 hours ago', status: 'scheduled' },
    { type: 'review', patient: 'Imara Jaffar', time: '5 hours ago', status: '5-star' },
    { type: 'consultation', patient: 'Nimal Fernando', time: '1 day ago', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-16 px-2">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div className="leading-none">
              <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
              <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Patient Overview', icon: Users, path: '/doctor' },
              { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
              { name: 'Telemedicine Sessions', icon: Video, path: '/doctor/telemedicine' },
              { name: 'Digital Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
              { name: 'Medical Reports', icon: Activity, path: '/doctor/reports' },
              { name: 'Consultations', icon: MessageSquare, path: '/doctor/chats' },
              { name: 'Analytics', icon: TrendingUp, path: '/doctor/analytics' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/20'
                    : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'
                }`}
              >
                <item.icon size={22} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-950 mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-slate-600 font-bold">Track your practice performance and insights</p>
          </div>

          {/* Time Range Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-4 py-2 rounded-xl font-black text-sm capitalize transition-all ${
                      timeRange === range
                        ? 'bg-[#8D153A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  const lines = [
                    `ANALYTICS REPORT - ${timeRange.toUpperCase()}`,
                    `Generated: ${new Date().toLocaleString()}`,
                    `===============================`,
                    ``,
                    `KEY METRICS`,
                    `Total Patients    : ${current.stats.totalPatients}`,
                    `New Patients      : ${current.stats.newPatients}`,
                    `Total Revenue     : LKR ${current.stats.totalRevenue.toLocaleString()}`,
                    `Consultations     : ${current.stats.totalConsultations}`,
                    `Average Rating    : ${current.stats.averageRating}`,
                    `Completion Rate   : ${current.stats.completionRate}%`,
                    ``,
                    `PERFORMANCE`,
                    `Patient Satisfaction : ${current.performance.patientSatisfaction}%`,
                    `Response Time        : ${current.performance.responseTime}h`,
                    `No-Show Rate         : ${current.performance.noShowRate}%`,
                    `Referral Rate        : ${current.performance.referralRate}%`,
                    ``,
                    `CHART DATA`,
                    ...current.chartData.map(d => `${d.label.padEnd(10)} | Patients: ${String(d.patients).padEnd(6)} | Revenue: LKR ${d.revenue.toLocaleString().padEnd(12)} | Consultations: ${d.consultations}`)
                  ].join('\n');
                  const blob = new Blob([lines], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics_${timeRange}_${new Date().toISOString().slice(0,10)}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-[#8D153A]" size={24} />
                <span className="text-xs font-black text-emerald-600 uppercase">+12%</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{current.stats.totalPatients}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-green-600" size={24} />
                <span className="text-xs font-black text-emerald-600 uppercase">+18%</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">LKR {current.stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-blue-600" size={24} />
                <span className="text-xs font-black text-emerald-600 uppercase">+8%</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{current.stats.totalConsultations}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Consultations</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Star className="text-yellow-500" size={24} />
                <span className="text-xs font-black text-slate-400 uppercase">Stable</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{current.stats.averageRating}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Average Rating</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-950">Revenue Trend</h3>
                <BarChart3 className="text-slate-400" size={20} />
              </div>
              <div className="space-y-4">
                {current.chartData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-600 w-14">{data.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8D153A] to-[#E5AB22] rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(data.revenue / current.maxRevenue) * 100}%` }}
                      >
                        <span className="text-xs font-black text-white">LKR {(data.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Conditions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-950">Patient Conditions</h3>
                <PieChart className="text-slate-400" size={20} />
              </div>
              <div className="space-y-4">
                {patientConditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        idx === 0 ? 'bg-red-500' :
                        idx === 1 ? 'bg-blue-500' :
                        idx === 2 ? 'bg-green-500' :
                        idx === 3 ? 'bg-yellow-500' :
                        'bg-slate-400'
                      }`} />
                      <span className="text-sm font-black text-slate-700">{condition.condition}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-600">{condition.count}</span>
                      <span className="text-xs font-black text-slate-400">{condition.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-black text-slate-950 mb-6">Performance Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-700">Patient Satisfaction</span>
                    <span className="text-sm font-black text-slate-900">{current.performance.patientSatisfaction}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#8D153A] to-[#E5AB22] h-3 rounded-full"
                      style={{ width: `${current.performance.patientSatisfaction}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-700">Completion Rate</span>
                    <span className="text-sm font-black text-slate-900">{current.stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                      style={{ width: `${current.stats.completionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-700">Referral Rate</span>
                    <span className="text-sm font-black text-slate-900">{current.performance.referralRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${current.performance.referralRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-black text-slate-950 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'consultation' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'appointment' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {activity.type === 'consultation' ? <Activity size={16} /> :
                       activity.type === 'appointment' ? <Calendar size={16} /> :
                       <Star size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900">{activity.patient}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#8D153A] to-[#C9204A] p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-white/80" size={24} />
                <Zap className="text-yellow-300" size={20} />
              </div>
              <p className="text-2xl font-black mb-2">{current.stats.completionRate}%</p>
              <p className="text-sm font-black uppercase tracking-widest text-white/80">Goal Achievement</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-orange-600" size={24} />
                <span className="text-xs font-black text-slate-400">Avg</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{current.performance.responseTime}h</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Response Time</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-emerald-600" size={24} />
                <span className="text-xs font-black text-slate-400">Low</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{current.performance.noShowRate}%</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No-Show Rate</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-purple-600" size={24} />
                <span className="text-xs font-black text-emerald-600">+{current.stats.newPatients}</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">New</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">This Month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
