import React, { useState } from 'react';
import { 
  TrendingUp, Users, Calendar, DollarSign, Activity, Heart,
  Clock, CheckCircle, AlertTriangle, Star, ChevronDown, Filter,
  Download, BarChart3, PieChart, LineChart, Target, Zap, MessageSquare
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

  const stats = {
    overview: {
      totalPatients: 248,
      newPatients: 32,
      totalRevenue: 1250000, // LKR 1,250,000
      averageRating: 4.8,
      totalConsultations: 156,
      completionRate: 94
    },
    performance: {
      patientSatisfaction: 92,
      responseTime: 2.4,
      noShowRate: 8,
      referralRate: 78
    }
  };

  const monthlyData = [
    { month: 'Jan', patients: 45, revenue: 225000, consultations: 62 }, // LKR 225,000
    { month: 'Feb', patients: 52, revenue: 267500, consultations: 71 }, // LKR 267,500
    { month: 'Mar', patients: 48, revenue: 245000, consultations: 65 }, // LKR 245,000
    { month: 'Apr', patients: 61, revenue: 315000, consultations: 84 }, // LKR 315,000
  ];

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
              { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
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
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2">
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
              <p className="text-2xl font-black text-slate-950 mb-2">{stats.overview.totalPatients}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-green-600" size={24} />
                <span className="text-xs font-black text-emerald-600 uppercase">+18%</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">LKR {stats.overview.totalRevenue.toLocaleString()}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-blue-600" size={24} />
                <span className="text-xs font-black text-emerald-600 uppercase">+8%</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{stats.overview.totalConsultations}</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Consultations</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Star className="text-yellow-500" size={24} />
                <span className="text-xs font-black text-slate-400 uppercase">Stable</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{stats.overview.averageRating}</p>
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
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-600 w-12">{data.month}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8D153A] to-[#E5AB22] rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(data.revenue / 350000) * 100}%` }}
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
                    <span className="text-sm font-black text-slate-900">{stats.performance.patientSatisfaction}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#8D153A] to-[#E5AB22] h-3 rounded-full"
                      style={{ width: `${stats.performance.patientSatisfaction}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-700">Completion Rate</span>
                    <span className="text-sm font-black text-slate-900">{stats.overview.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                      style={{ width: `${stats.overview.completionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-700">Referral Rate</span>
                    <span className="text-sm font-black text-slate-900">{stats.performance.referralRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${stats.performance.referralRate}%` }}
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
              <p className="text-2xl font-black mb-2">94%</p>
              <p className="text-sm font-black uppercase tracking-widest text-white/80">Goal Achievement</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-orange-600" size={24} />
                <span className="text-xs font-black text-slate-400">Avg</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{stats.performance.responseTime}h</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Response Time</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-emerald-600" size={24} />
                <span className="text-xs font-black text-slate-400">Low</span>
              </div>
              <p className="text-2xl font-black text-slate-950 mb-2">{stats.performance.noShowRate}%</p>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No-Show Rate</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-purple-600" size={24} />
                <span className="text-xs font-black text-emerald-600">+{stats.overview.newPatients}</span>
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
