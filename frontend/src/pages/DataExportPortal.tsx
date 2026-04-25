import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, FileJson, FileSpreadsheet, FileText, Calendar, Filter, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function DataExportPortal() {
  const user = useAuthStore(state => state.user);
  const [exportType, setExportType] = useState<'all' | 'appointments' | 'records' | 'prescriptions'>('all');
  const [dateRange, setDateRange] = useState<'30days' | '6months' | '1year' | 'all'>('1year');
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    // Simulate export
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const exportOptions = [
    { id: 'all', label: 'All Health Data', desc: 'Complete medical history including appointments, records, and prescriptions' },
    { id: 'appointments', label: 'Appointments Only', desc: 'Past and upcoming appointment history' },
    { id: 'records', label: 'Medical Records', desc: 'Lab results, diagnoses, and treatment history' },
    { id: 'prescriptions', label: 'Prescriptions', desc: 'Medication history and active prescriptions' },
  ];

  const formatIcons = {
    json: FileJson,
    csv: FileSpreadsheet,
    pdf: FileText
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-300/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} className="flex items-center gap-2 text-slate-600 hover:text-slate-900" onClick={(e) => !user && e.preventDefault()}>
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Data Export Portal</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          <div className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="text-[#0EA5E9] flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-slate-700">
                  Your data is encrypted and securely packaged. Exports include all historical data within your selected timeframe.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Export Type */}
            <div className="bg-white border border-slate-300/50 rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Filter size={18} />
                Select Data Type
              </h2>
              <div className="space-y-3">
                {exportOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setExportType(opt.id as any)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      exportType === opt.id
                        ? 'border-[#0EA5E9] bg-[#0EA5E9]/10'
                        : 'border-slate-300/50 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-medium text-slate-900">{opt.label}</p>
                    <p className="text-xs text-slate-600 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Settings */}
            <div className="bg-white border border-slate-300/50 rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} />
                Export Settings
              </h2>

              {/* Date Range */}
              <div className="mb-6">
                <label className="text-sm text-slate-600 mb-2 block">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300/50 rounded-xl p-3 text-slate-900"
                >
                  <option value="30days">Last 30 Days</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last 1 Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['json', 'csv', 'pdf'] as const).map(fmt => {
                    const Icon = formatIcons[fmt];
                    return (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          format === fmt
                            ? 'border-[#0EA5E9] bg-[#0EA5E9]/10'
                            : 'border-slate-300/50 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={24} className={format === fmt ? 'text-[#0EA5E9]' : 'text-slate-600'} />
                        <span className={`text-xs font-medium uppercase ${format === fmt ? 'text-[#0EA5E9]' : 'text-slate-600'}`}>
                          {fmt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-6 bg-white border border-slate-300/50 rounded-2xl p-6">
            {success ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <CheckCircle className="text-emerald-500" size={24} />
                <span className="text-emerald-400 font-medium">Export completed! Check your downloads.</span>
              </div>
            ) : (
              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-slate-900 font-semibold py-4 rounded-xl transition-all"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Preparing Export...</>
                ) : (
                  <><Download size={20} /> Export {exportType === 'all' ? 'All Data' : exportOptions.find(o => o.id === exportType)?.label}</>
                )}
              </button>
            )}
            <p className="text-xs text-slate-500 text-center mt-4">
              By exporting data, you agree to handle it securely and in compliance with healthcare privacy regulations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
