import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Calendar, User, Stethoscope, Download, Eye, Folder, Activity, Pill, FilePlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface HealthRecord {
  id: number;
  type: 'DIAGNOSIS' | 'LAB_RESULT' | 'PRESCRIPTION' | 'IMAGING' | 'VISIT_NOTE';
  title: string;
  doctor: string;
  date: string;
  description: string;
  attachments?: number;
}

export default function ElectronicHealthRecords() {
  const user = useAuthStore(state => state.user);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | HealthRecord['type']>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/patient-service/records');
      setRecords(response.data || []);
    } catch (error) {
      // Demo data
      setRecords([
        { id: 1, type: 'DIAGNOSIS', title: 'Hypertension Management', doctor: 'Dr. Sarah Johnson', date: '2026-04-15', description: 'Blood pressure elevated. Started on Lisinopril 10mg daily.', attachments: 2 },
        { id: 2, type: 'LAB_RESULT', title: 'Complete Blood Count', doctor: 'Dr. Michael Chen', date: '2026-04-10', description: 'All values within normal range. Hemoglobin: 14.2 g/dL.', attachments: 1 },
        { id: 3, type: 'PRESCRIPTION', title: 'Monthly Medication', doctor: 'Dr. Sarah Johnson', date: '2026-03-28', description: 'Lisinopril 10mg - 30 days, Vitamin D3 2000 IU - 90 days.', attachments: 0 },
        { id: 4, type: 'IMAGING', title: 'Chest X-Ray', doctor: 'Dr. James Wilson', date: '2026-03-15', description: 'No acute cardiopulmonary findings. Heart size normal.', attachments: 3 },
        { id: 5, type: 'VISIT_NOTE', title: 'Annual Physical', doctor: 'Dr. Michael Chen', date: '2026-02-20', description: 'Patient in good health. Recommended lifestyle modifications.', attachments: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = filter === 'ALL'
    ? records
    : records.filter(r => r.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DIAGNOSIS': return <Stethoscope size={18} />;
      case 'LAB_RESULT': return <Activity size={18} />;
      case 'PRESCRIPTION': return <Pill size={18} />;
      case 'IMAGING': return <Eye size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DIAGNOSIS': return 'text-blue-400 bg-blue-400/10';
      case 'LAB_RESULT': return 'text-emerald-400 bg-emerald-400/10';
      case 'PRESCRIPTION': return 'text-purple-400 bg-purple-400/10';
      case 'IMAGING': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const recordTypes: { value: 'ALL' | HealthRecord['type']; label: string }[] = [
    { value: 'ALL', label: 'All Records' },
    { value: 'DIAGNOSIS', label: 'Diagnoses' },
    { value: 'LAB_RESULT', label: 'Lab Results' },
    { value: 'PRESCRIPTION', label: 'Prescriptions' },
    { value: 'IMAGING', label: 'Imaging' },
    { value: 'VISIT_NOTE', label: 'Visit Notes' },
  ];

  return (
    <div className="min-h-screen bg-[#0C1220] text-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1220]/90 backdrop-blur-md border-b border-[#1E3A5F]/30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} className="flex items-center gap-2 text-slate-400 hover:text-white" onClick={(e) => !user && e.preventDefault()}>
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Health Records</h1>
          <Link to="/data-export" className="flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] text-sm">
            <Download size={16} />
            Export
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Records', value: records.length, icon: Folder },
              { label: 'This Year', value: records.filter(r => r.date.startsWith('2026')).length, icon: Calendar },
              { label: 'Doctors', value: new Set(records.map(r => r.doctor)).size, icon: User },
              { label: 'Attachments', value: records.reduce((sum, r) => sum + (r.attachments || 0), 0), icon: FileText },
            ].map(stat => (
              <div key={stat.label} className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className="text-[#0EA5E9]" />
                  <span className="text-sm text-slate-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recordTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === type.value
                    ? 'bg-[#0EA5E9] text-white'
                    : 'bg-[#111B2E] text-slate-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-xl p-5 cursor-pointer hover:border-[#0EA5E9]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(record.type)}`}>
                    {getTypeIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="font-semibold text-white">{record.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(record.type)}`}>
                          {record.type.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-slate-400">{record.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{record.doctor}</p>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-2">{record.description}</p>
                    {record.attachments && record.attachments > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-[#0EA5E9]">
                        <FileText size={14} />
                        {record.attachments} attachment{record.attachments !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedRecord(null)}>
          <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(selectedRecord.type)}`}>
                {getTypeIcon(selectedRecord.type)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{selectedRecord.title}</h3>
                <p className="text-sm text-slate-400">{selectedRecord.date}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Doctor</p>
                <p className="text-white">{selectedRecord.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Description</p>
                <p className="text-slate-300">{selectedRecord.description}</p>
              </div>
              {selectedRecord.attachments && selectedRecord.attachments > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Attachments</p>
                  <div className="flex gap-2">
                    {Array.from({ length: selectedRecord.attachments }).map((_, i) => (
                      <button key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0C1220] rounded-lg text-sm text-slate-300 hover:text-white">
                        <FileText size={16} />
                        File {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full mt-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
