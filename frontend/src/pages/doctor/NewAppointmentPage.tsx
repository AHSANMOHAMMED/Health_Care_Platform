import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileUp,
  Phone,
  Stethoscope,
  User,
  Video,
  Wand2,
  X,
} from 'lucide-react';

type AppointmentType = 'Video Consult' | 'Phone Consult' | 'Physical Examination';
type Priority = 'normal' | 'high' | 'urgent';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function isoToday() {
  return new Date().toISOString().split('T')[0];
}

function to12h(time24: string) {
  // expects HH:mm
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  if (!Number.isFinite(h) || !mStr) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
}

export default function NewAppointmentPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string>('');

  const [form, setForm] = useState({
    patientName: '',
    age: '',
    gender: 'Other',
    date: isoToday(),
    time: '09:00',
    type: 'Video Consult' as AppointmentType,
    duration: '30 mins',
    priority: 'normal' as Priority,
    reason: '',
    contact: '',
    notes: '',
    attachReport: false,
    reportFiles: [] as File[],
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.time) e.time = 'Time is required.';
    if (!form.reason.trim()) e.reason = 'Reason is required.';
    if (form.contact && !/^[+0-9()\s-]{7,}$/i.test(form.contact.trim())) {
      e.contact = 'Enter a valid phone number.';
    }
    if (form.age && (Number(form.age) < 0 || Number(form.age) > 130)) {
      e.age = 'Enter a valid age.';
    }
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const summary = useMemo(() => {
    return {
      date: form.date,
      time: to12h(form.time),
      type: form.type,
      duration: form.duration,
      priority: form.priority,
    };
  }, [form.date, form.duration, form.priority, form.time, form.type]);

  const applyTemplate = () => {
    setForm((prev) => ({
      ...prev,
      type: 'Video Consult',
      duration: '30 mins',
      priority: 'normal',
      reason: prev.reason || 'Follow-up consultation',
      notes:
        prev.notes ||
        'Vitals review, medication adherence check, and next steps. Please keep recent lab reports handy.',
    }));
    setToast('Applied a smart template.');
    setTimeout(() => setToast(''), 2500);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setToast('Please fix the highlighted fields.');
      setTimeout(() => setToast(''), 2500);
      return;
    }

    setSubmitting(true);
    try {
      // UI-only: Hook your API here when ready.
      await new Promise((r) => setTimeout(r, 600));
      setToast('Appointment created (UI mock).');
      setTimeout(() => navigate('/doctor/appointments'), 650);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Stethoscope size={14} className="text-[#8D153A]" />
            Doctor
            <span className="mx-1">/</span>
            Appointments
            <span className="mx-1">/</span>
            New
          </div>
          <h1 className="text-4xl font-black text-slate-950 mt-2">Add Appointment</h1>
          <p className="text-slate-600 font-bold mt-2">
            Create a new appointment with an elegant, fast workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={applyTemplate}
            className="px-4 py-3 rounded-2xl bg-white border border-slate-200 font-black text-slate-700 hover:border-[#8D153A]/40 hover:shadow-sm transition-all flex items-center gap-2"
          >
            <Wand2 size={18} className="text-[#8D153A]" />
            Smart template
          </button>
          <Link
            to="/doctor/appointments"
            className="px-4 py-3 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-950">Patient & appointment details</h2>
            {toast && (
              <div className="flex items-center gap-2 text-xs font-black px-3 py-2 rounded-full bg-slate-900 text-white">
                <span>{toast}</span>
                <button
                  type="button"
                  onClick={() => setToast('')}
                  className="opacity-70 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Patient name <span className="text-red-500">*</span>
              </label>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-50 transition-all',
                  errors.patientName ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#8D153A]'
                )}
              >
                <User size={18} className="text-slate-400" />
                <input
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-950 placeholder:text-slate-400"
                  placeholder="e.g., Kasun Perera"
                />
              </div>
              {errors.patientName && <p className="mt-2 text-sm font-bold text-red-600">{errors.patientName}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-2xl border bg-slate-50 font-bold text-slate-950 outline-none transition-all',
                  errors.age ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10'
                )}
                placeholder="e.g., 34"
              />
              {errors.age && <p className="mt-2 text-sm font-bold text-red-600">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-950 outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-50 transition-all',
                  errors.date ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#8D153A]'
                )}
              >
                <Calendar size={18} className="text-slate-400" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-950"
                />
              </div>
              {errors.date && <p className="mt-2 text-sm font-bold text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-50 transition-all',
                  errors.time ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#8D153A]'
                )}
              >
                <Clock size={18} className="text-slate-400" />
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-950"
                />
              </div>
              {errors.time && <p className="mt-2 text-sm font-bold text-red-600">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { label: 'Video', value: 'Video Consult', icon: Video },
                    { label: 'Phone', value: 'Phone Consult', icon: Phone },
                    { label: 'In-person', value: 'Physical Examination', icon: Stethoscope },
                  ] as const
                ).map(({ label, value, icon: Icon }) => {
                  const active = form.type === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, type: value })}
                      className={cn(
                        'px-3 py-3 rounded-2xl border font-black text-sm transition-all flex items-center justify-center gap-2',
                        active
                          ? 'bg-[#8D153A] text-white border-[#8D153A] shadow-lg shadow-[#8D153A]/15'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-[#8D153A]/40'
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-950 outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
              >
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { label: 'Normal', value: 'normal', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { label: 'High', value: 'high', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { label: 'Urgent', value: 'urgent', cls: 'bg-red-50 text-red-700 border-red-200' },
                  ] as const
                ).map((p) => {
                  const active = form.priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p.value })}
                      className={cn(
                        'px-3 py-3 rounded-2xl border font-black text-sm transition-all',
                        active ? p.cls : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      )}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact</label>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-50 transition-all',
                  errors.contact ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-[#8D153A]'
                )}
              >
                <Phone size={18} className="text-slate-400" />
                <input
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-950 placeholder:text-slate-400"
                  placeholder="+94 77 123 4567"
                />
              </div>
              {errors.contact && <p className="mt-2 text-sm font-bold text-red-600">{errors.contact}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-2xl border bg-slate-50 font-bold text-slate-950 outline-none transition-all',
                  errors.reason ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10'
                )}
                placeholder="e.g., Chest pain, annual checkup, follow-up..."
              />
              {errors.reason && <p className="mt-2 text-sm font-bold text-red-600">{errors.reason}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-950 outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                rows={4}
                placeholder="Add any clinical notes or preparation instructions."
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                    <FileUp size={18} />
                  </div>
                  <div>
                    <p className="font-black text-slate-950">Attach patient reports (optional)</p>
                    <p className="text-sm font-bold text-slate-500">Upload PDFs/images for the visit.</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.attachReport}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        attachReport: e.target.checked,
                        reportFiles: e.target.checked ? prev.reportFiles : [],
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#8D153A] focus:ring-[#8D153A]"
                  />
                  <span className="font-black text-slate-700">Enable</span>
                </label>
              </div>

              {form.attachReport && (
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        reportFiles: e.target.files ? Array.from(e.target.files) : [],
                      }))
                    }
                    className="block w-full text-sm font-bold text-slate-700 file:mr-4 file:py-3 file:px-4 file:rounded-2xl file:border-0 file:bg-slate-900 file:text-white file:font-black hover:file:bg-slate-800"
                  />
                  {form.reportFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.reportFiles.slice(0, 6).map((f) => (
                        <span
                          key={`${f.name}-${f.size}`}
                          className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-700"
                        >
                          {f.name}
                        </span>
                      ))}
                      {form.reportFiles.length > 6 && (
                        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-700">
                          +{form.reportFiles.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                'flex-1 py-4 rounded-2xl font-black transition-all',
                canSubmit
                  ? 'bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-white hover:shadow-lg'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              {submitting ? 'Creating…' : 'Create appointment'}
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({
                  patientName: '',
                  age: '',
                  gender: 'Other',
                  date: isoToday(),
                  time: '09:00',
                  type: 'Video Consult',
                  duration: '30 mins',
                  priority: 'normal',
                  reason: '',
                  contact: '',
                  notes: '',
                  attachReport: false,
                  reportFiles: [],
                })
              }
              className="py-4 px-6 rounded-2xl font-black bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Summary */}
        <aside className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#8D153A]/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E5AB22]/25 blur-3xl rounded-full" />

          <h3 className="text-lg font-black">Preview</h3>
          <p className="text-sm text-white/70 font-bold mt-2">
            A clean summary you can verify before creating.
          </p>

          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">Patient</p>
              <p className="mt-1 font-black text-xl">
                {form.patientName.trim() ? form.patientName : '—'}
              </p>
              <p className="mt-1 text-sm font-bold text-white/70">
                {form.age ? `${form.age} yrs` : 'Age —'} • {form.gender}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">When</p>
              <p className="mt-1 font-black text-lg">{summary.date}</p>
              <p className="mt-1 text-sm font-bold text-white/70">{summary.time}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">Visit</p>
              <p className="mt-1 font-black text-lg">{summary.type}</p>
              <p className="mt-1 text-sm font-bold text-white/70">
                {summary.duration} • Priority:{' '}
                <span className="capitalize">{summary.priority}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">Reason</p>
              <p className="mt-1 text-sm font-bold text-white/80 whitespace-pre-wrap">
                {form.reason.trim() ? form.reason : '—'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">
              Next actions
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => navigate('/doctor/chats')}
                className="w-full px-4 py-3 rounded-2xl bg-white text-slate-950 font-black hover:shadow-lg transition-all"
              >
                Start consultation hub
              </button>
              <Link
                to="/doctor/appointments"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 font-black hover:bg-white/15 transition-all text-center"
              >
                View appointments list
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

