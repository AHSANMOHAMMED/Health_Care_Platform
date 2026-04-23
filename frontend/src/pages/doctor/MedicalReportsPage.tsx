import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, PlusCircle, Calendar,
  Eye, AlertTriangle, CheckCircle, Clock, Activity, Heart,
  Brain, Stethoscope, Pill, Camera, TestTube, ChevronRight, Video
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface MedicalReport {
  id: number;
  patientName: string;
  reportType: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  doctorName: string;
  description: string;
  fileUrl: string;
  category: 'lab' | 'imaging' | 'cardiology' | 'neurology' | 'general';
}

export default function MedicalReportsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Enhanced navigation states
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline' | 'critical'>('grid');
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCriticalAlerts, setShowCriticalAlerts] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    patientName: '',
    reportType: '',
    category: 'lab',
    description: '',
    urgency: 'normal'
  });

  const reports: MedicalReport[] = [
    {
      id: 1,
      patientName: 'Aruni Wijesinghe',
      reportType: 'Complete Blood Count',
      date: '2024-04-20',
      status: 'normal',
      doctorName: 'Dr. Silva',
      description: 'All parameters within normal range. Patient shows good overall health.',
      fileUrl: '/reports/cbc_aruni_2024.pdf',
      category: 'lab'
    },
    {
      id: 2,
      patientName: 'Kasun Perera',
      reportType: 'ECG - Electrocardiogram',
      date: '2024-04-19',
      status: 'abnormal',
      doctorName: 'Dr. Kumar',
      description: 'Mild arrhythmia detected. Recommend further cardiac evaluation.',
      fileUrl: '/reports/ecg_kasun_2024.pdf',
      category: 'cardiology'
    },
    {
      id: 3,
      patientName: 'Imara Jaffar',
      reportType: 'Chest X-Ray',
      date: '2024-04-18',
      status: 'normal',
      doctorName: 'Dr. Fernando',
      description: 'Clear lung fields. No acute cardiopulmonary abnormalities.',
      fileUrl: '/reports/xray_imara_2024.pdf',
      category: 'imaging'
    },
    {
      id: 4,
      patientName: 'Nimal Fernando',
      reportType: 'MRI - Brain',
      date: '2024-04-17',
      status: 'critical',
      doctorName: 'Dr. Perera',
      description: 'Abnormal mass detected in left frontal lobe. Immediate neurology referral required.',
      fileUrl: '/reports/mri_nimal_2024.pdf',
      category: 'neurology'
    },
    {
      id: 5,
      patientName: 'Sarah Johnson',
      reportType: 'Lipid Panel',
      date: '2024-04-16',
      status: 'abnormal',
      doctorName: 'Dr. Silva',
      description: 'Elevated LDL cholesterol. Recommend dietary changes and medication.',
      fileUrl: '/reports/lipid_sarah_2024.pdf',
      category: 'lab'
    },
    {
      id: 6,
      patientName: 'Michael Chen',
      reportType: 'Ultrasound - Abdomen',
      date: '2024-04-15',
      status: 'normal',
      doctorName: 'Dr. Kumar',
      description: 'Normal liver, gallbladder, kidneys. No abnormalities detected.',
      fileUrl: '/reports/ultrasound_michael_2024.pdf',
      category: 'imaging'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Innovative navigation handlers
  const handleReportClick = (report: MedicalReport) => {
    setSelectedReport(report);
    setShowReportPreview(true);
  };

  const handleDownloadReport = (report: MedicalReport) => {
    const content = [
      `MEDICAL REPORT`,
      `===============================`,
      `Patient: ${report.patientName}`,
      `Report Type: ${report.reportType}`,
      `Date: ${report.date}`,
      `Doctor: ${report.doctorName}`,
      `Category: ${report.category}`,
      `Status: ${report.status.toUpperCase()}`,
      ``,
      `Description:`,
      report.description,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.patientName.replace(/\s+/g, '_')}_${report.reportType.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadReport = () => {
    setShowUploadModal(true);
  };

  const handleSaveUpload = () => {
    if (!uploadForm.patientName || !uploadForm.reportType) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Uploading report:', uploadForm);
    alert('Report uploaded successfully!');
    setShowUploadModal(false);
    setUploadForm({
      patientName: '',
      reportType: '',
      category: 'lab',
      description: '',
      urgency: 'normal'
    });
  };

  const getCriticalReports = () => {
    return reports.filter(report => report.status === 'critical');
  };

  const getReportsByDateRange = () => {
    const today = new Date();
    const filtered = reports.filter(report => {
      const reportDate = new Date(report.date);
      switch (dateRange) {
        case 'today':
          return reportDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reportDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return reportDate >= monthAgo;
        default:
          return true;
      }
    });
    return filtered;
  };

  const getTimelineData = () => {
    const timelineData = {};
    reports.forEach(report => {
      const date = report.date;
      if (!timelineData[date]) {
        timelineData[date] = [];
      }
      timelineData[date].push(report);
    });
    return timelineData;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-700 border-green-200';
      case 'abnormal': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lab': return TestTube;
      case 'imaging': return Camera;
      case 'cardiology': return Heart;
      case 'neurology': return Brain;
      default: return Stethoscope;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lab': return 'text-purple-600 bg-purple-100';
      case 'imaging': return 'text-blue-600 bg-blue-100';
      case 'cardiology': return 'text-red-600 bg-red-100';
      case 'neurology': return 'text-pink-600 bg-pink-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

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
              { name: 'Patient Overview', icon: ChevronRight, path: '/doctor' },
              { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
              { name: 'Telemedicine Sessions', icon: Video, path: '/doctor/telemedicine' },
              { name: 'Digital Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
              { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
              { name: 'Consultations', icon: Activity, path: '/doctor/chats' },
              { name: 'Analytics', icon: ChevronRight, path: '/doctor/analytics' },
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
            <h1 className="text-4xl font-black text-slate-950 mb-2">Medical Reports</h1>
            <p className="text-lg text-slate-600 font-bold">Access and manage patient medical reports and test results</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <FileText className="text-[#8D153A]" size={24} />
                <span className="text-2xl font-black text-slate-950">156</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Reports</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-green-600" size={24} />
                <span className="text-2xl font-black text-slate-950">98</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Normal</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-orange-600" size={24} />
                <span className="text-2xl font-black text-slate-950">45</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Abnormal</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-red-600" size={24} />
                <span className="text-2xl font-black text-slate-950">13</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Critical</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reports by patient name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                >
                  <option value="all">All Categories</option>
                  <option value="lab">Lab Tests</option>
                  <option value="imaging">Imaging</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="general">General</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                >
                  <option value="all">All Status</option>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="critical">Critical</option>
                  <option value="pending">Pending</option>
                </select>
                <button className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2">
                  <PlusCircle size={20} />
                  New Report
                </button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const CategoryIcon = getCategoryIcon(report.category);
              return (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getCategoryColor(report.category)}`}>
                        <CategoryIcon size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-black text-slate-950 text-lg">{report.patientName}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-black ${getCategoryColor(report.category)}`}>
                            {report.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600 font-bold mb-3">
                          <span className="flex items-center gap-1">
                            <FileText size={14} />
                            {report.reportType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {report.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope size={14} />
                            Dr. {report.doctorName}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 font-medium mb-4">
                          {report.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <button onClick={() => handleReportClick(report)} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
                            <Eye size={16} />
                            View Report
                          </button>
                          <button onClick={() => handleDownloadReport(report)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center gap-2">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {report.status === 'critical' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle size={16} />
                          <span className="text-xs font-black uppercase">Urgent</span>
                        </div>
                      )}
                      <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="More Options">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Report Preview Modal */}
      {showReportPreview && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-950 mb-1">{selectedReport.reportType}</h3>
                <p className="text-slate-500 font-bold">{selectedReport.patientName}</p>
              </div>
              <button
                onClick={() => setShowReportPreview(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <span className="text-xl font-black">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-black text-slate-950">{selectedReport.date}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                  <p className="font-black text-slate-950">{selectedReport.doctorName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                  <p className="font-black text-slate-950 capitalize">{selectedReport.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                <p className="text-slate-700 font-medium leading-relaxed">{selectedReport.description}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { handleDownloadReport(selectedReport); }}
                className="flex-1 py-3 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Report
              </button>
              <button
                onClick={() => setShowReportPreview(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
