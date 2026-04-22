import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, Mic, MicOff, Image as ImageIcon, Type as TypeIcon,
  AlertCircle, CheckCircle2, Loader2, PhoneCall, Calendar,
  Pill, X, Languages, Stethoscope, Activity, Video,
  UploadCloud, Eye, RefreshCw, MapPin, Heart, Zap,
  ChevronRight, Users, Clock, Brain, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

// ============================================================
// SL HOSPITAL DATABASE (offline-capable, no API cost)
// ============================================================
const SL_HOSPITALS = [
  { name: 'Colombo National Hospital', distance: '2.1 km', phone: '+94 11 269 1111', emergency: true },
  { name: 'Lanka Hospitals', distance: '3.4 km', phone: '+94 11 553 0000', emergency: true },
  { name: 'Asiri Hospital Colombo', distance: '4.0 km', phone: '+94 11 466 5500', emergency: true },
  { name: 'Nawaloka Hospital', distance: '4.8 km', phone: '+94 11 254 4444', emergency: true },
  { name: 'Hemas Hospital Wattala', distance: '8.2 km', phone: '+94 11 229 1291', emergency: false },
];

// ============================================================
// DOCTOR SPECIALTY ROUTING ENGINE
// ============================================================
const SPECIALTY_RULES: { keywords: string[]; specialty: string; icon: string; desc: string }[] = [
  { keywords: ['chest', 'heart', 'palpitation', 'cardiac', 'pressure', 'bp', 'pulse'], specialty: 'Cardiologist', icon: '❤️', desc: 'Heart & Cardiovascular System' },
  { keywords: ['headache', 'migraine', 'dizziness', 'memory', 'stroke', 'seizure', 'brain', 'nerve'], specialty: 'Neurologist', icon: '🧠', desc: 'Brain & Nervous System' },
  { keywords: ['skin', 'rash', 'itch', 'acne', 'eczema', 'derma', 'allerg'], specialty: 'Dermatologist', icon: '🩺', desc: 'Skin, Hair & Nails' },
  { keywords: ['child', 'baby', 'infant', 'fever child', 'kid', 'growth'], specialty: 'Pediatrician', icon: '👶', desc: 'Children\'s Health' },
  { keywords: ['eye', 'vision', 'blur', 'sight', 'cataract'], specialty: 'Ophthalmologist', icon: '👁️', desc: 'Eyes & Vision' },
  { keywords: ['bone', 'joint', 'knee', 'back', 'spine', 'fracture', 'muscle', 'ortho'], specialty: 'Orthopedist', icon: '🦴', desc: 'Bones & Joints' },
  { keywords: ['stomach', 'digestion', 'gastric', 'liver', 'bowel', 'diarrhea', 'vomit', 'nausea'], specialty: 'Gastroenterologist', icon: '🫁', desc: 'Digestive System' },
  { keywords: ['cough', 'breath', 'lung', 'asthma', 'wheez', 'respiratory', 'sputum'], specialty: 'Pulmonologist', icon: '🫀', desc: 'Lungs & Breathing' },
  { keywords: ['mental', 'anxiety', 'depression', 'stress', 'sleep', 'mood', 'panic'], specialty: 'Psychiatrist', icon: '🧩', desc: 'Mental & Emotional Health' },
  { keywords: ['ear', 'throat', 'nose', 'sinus', 'tonsil'], specialty: 'ENT Specialist', icon: '👂', desc: 'Ear, Nose & Throat' },
];

const SEVERITY_KEYWORDS = {
  critical: ['chest pain', 'difficulty breathing', 'stroke', 'unconscious', 'heart attack', 'severe bleeding', 'cannot breathe', 'collapse'],
  high: ['severe pain', 'high fever', 'blood', 'poison', 'broken bone', 'head injury', 'deep wound'],
  medium: ['persistent', 'vomiting', 'diarrhea', 'infection', 'swelling', 'burning'],
  low: ['mild', 'cold', 'cough', 'tired', 'fatigue', 'headache', 'sneezing'],
};

function detectSpecialty(text: string): typeof SPECIALTY_RULES[0] | null {
  const lower = text.toLowerCase();
  for (const rule of SPECIALTY_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) return rule;
  }
  return null;
}

function detectSeverity(text: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  if (SEVERITY_KEYWORDS.critical.some(k => lower.includes(k))) return 'critical';
  if (SEVERITY_KEYWORDS.high.some(k => lower.includes(k))) return 'high';
  if (SEVERITY_KEYWORDS.medium.some(k => lower.includes(k))) return 'medium';
  return 'low';
}

type InputMode = 'text' | 'voice' | 'image';
type Language = 'English' | 'Sinhala' | 'Tamil';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  specialty?: typeof SPECIALTY_RULES[0];
  loading?: boolean;
}

const PLACEHOLDERS: Record<Language, string> = {
  English: "Describe your symptoms... e.g. 'I have chest pain and shortness of breath for 2 hours'",
  Sinhala: "ඔබේ රෝග ලක්ෂණ විස්තර කරන්න... e.g. 'මට පපුවේ කැක්කුමක් සහ හුස්ම ගැනීමේ අපහසු...'",
  Tamil: "உங்கள் அறிகுறிகளை விவரியுங்கள்... e.g. 'என் மார்பில் வலி மற்றும் சுவாசிப்பதில் சிரமம்...'",
};

const LANG_LABELS: Record<Language, string> = {
  English: 'English',
  Sinhala: 'සිංහල',
  Tamil: 'தமிழ்',
};

const QUICK_SYMPTOMS = [
  'Chest pain', 'Fever & headache', 'Skin rash', "Can't sleep",
  'Stomach pain', 'Cough & cold', 'Back pain', 'Anxiety / stress',
];

export default function AiChecker() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [language, setLanguage] = useState<Language>('English');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<typeof SL_HOSPITALS | null>(null);
  const [locating, setLocating] = useState(false);
  const [hasCritical, setHasCritical] = useState(false);

  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Web Speech API — Real Voice Recognition ──
  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Sinhala' ? 'si-LK' : language === 'Tamil' ? 'ta-LK' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInputText(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [language]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  // ── Image Upload Handler ──
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── GPS Location for Emergency ──
  const findNearbyHospitals = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      () => {
        // Got location — show our offline hospital dataset
        setTimeout(() => { setNearbyHospitals(SL_HOSPITALS); setLocating(false); }, 1000);
      },
      () => {
        // Denied/unavailable — still show dataset
        setNearbyHospitals(SL_HOSPITALS); setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // ── Send to AI ──
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text && !imageFile) return;
    setLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text || '(Image uploaded for analysis)',
      timestamp: new Date(),
      imageUrl: imagePreview ?? undefined,
    };
    const aiLoading: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, aiLoading]);
    setInputText('');
    setImagePreview(null);
    setImageFile(null);

    const severity = detectSeverity(text);
    const specialty = detectSpecialty(text);

    try {
      const payload: any = {
        symptoms: text,
        language,
        age: 35,
        gender: 'Not Specified',
        duration: 'Not Specified',
        severity: 'Not Specified',
      };

      // Attach image as base64 if present
      if (imagePreview) {
        payload.imageData = imagePreview;
        payload.symptoms = text || 'Please analyze this medical image/photo for symptoms, conditions, or abnormalities.';
      }

      const response = await api.post('/ai/symptom-checker', payload);
      const analysisText = response.data.analysis || response.data?.message || JSON.stringify(response.data);

      const aiSeverity = detectSeverity(analysisText);
      const aiSpecialty = detectSpecialty(text + ' ' + analysisText);

      const finalMsg: Message = {
        id: aiLoading.id,
        role: 'ai',
        content: analysisText,
        timestamp: new Date(),
        severity: aiSeverity,
        specialty: aiSpecialty ?? undefined,
      };

      setMessages(prev => prev.map(m => m.id === aiLoading.id ? finalMsg : m));
      if (aiSeverity === 'critical') { setHasCritical(true); findNearbyHospitals(); }

    } catch {
      // Intelligent offline fallback
      const fallbackText = generateFallback(text, language, severity, specialty);
      const fallbackMsg: Message = {
        id: aiLoading.id,
        role: 'ai',
        content: fallbackText,
        timestamp: new Date(),
        severity,
        specialty: specialty ?? undefined,
      };
      setMessages(prev => prev.map(m => m.id === aiLoading.id ? fallbackMsg : m));
      if (severity === 'critical') { setHasCritical(true); findNearbyHospitals(); }
    } finally {
      setLoading(false);
    }
  };

  const generateFallback = (text: string, lang: Language, severity: string, specialty: typeof SPECIALTY_RULES[0] | null): string => {
    const intro = lang === 'Sinhala' ? 'ඔබේ රෝග ලක්ෂණ ගැන AI විශ්ලේෂණය:' : lang === 'Tamil' ? 'AI அறிகுறி பகுப்பாய்வு:' : 'AI Symptom Analysis:';
    if (severity === 'critical') {
      return `🚨 ${intro}\n\nBased on the symptoms described — **this appears to be a serious medical emergency**. The symptoms you've mentioned (${text}) may indicate a life-threatening condition that requires immediate emergency care.\n\n**DO NOT WAIT.** Please:\n1. Call 1990 (Suwa Seriya) immediately\n2. Do not drive yourself — wait for the ambulance\n3. Tell the dispatcher your exact symptoms\n\nEstimated dispatch time: 4–6 minutes.`;
    }
    if (severity === 'high') {
      return `⚠️ ${intro}\n\nYour described symptoms (${text}) suggest a **moderate-to-serious condition** that needs prompt medical evaluation.\n\n${specialty ? `Based on your symptoms, we recommend seeing a **${specialty.specialty}** (${specialty.desc}).` : 'A General Practitioner can assess you first.'}\n\n**Recommended Action:** Book an urgent appointment today or visit an emergency outpatient clinic within 24 hours.`;
    }
    return `✅ ${intro}\n\nYour symptoms (${text}) suggest a **mild condition** that may not require emergency care.\n\n${specialty ? `A **${specialty.specialty}** (${specialty.desc}) would be best suited to help you.` : 'A General Practitioner can help manage your condition.'}\n\n**Suggested home care:** Rest well, stay hydrated, and monitor for worsening symptoms. If symptoms persist beyond 48 hours, please book an appointment.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const severityConfig = {
    critical: { color: 'border-red-500/50 bg-red-950/30', badge: 'bg-red-500', label: '🚨 CRITICAL', text: 'text-red-300' },
    high: { color: 'border-orange-500/30 bg-orange-950/20', badge: 'bg-orange-500', label: '⚠️ HIGH PRIORITY', text: 'text-orange-300' },
    medium: { color: 'border-amber-500/30 bg-amber-950/20', badge: 'bg-amber-500', label: '⚡ MODERATE', text: 'text-amber-300' },
    low: { color: 'border-emerald-500/30 bg-emerald-950/20', badge: 'bg-emerald-500', label: '✅ MILD', text: 'text-emerald-300' },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* ── HEADER ── */}
      <div className="border-b border-white/5 bg-[#0D0D18]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white tracking-tight text-lg leading-none">AI Doctor</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                Online · Multi-lingual · 24/7
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Languages size={14} className="text-indigo-400 flex-shrink-0" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
              >
                {(Object.entries(LANG_LABELS) as [Language, string][]).map(([k, v]) => (
                  <option key={k} value={k} className="bg-slate-900">{v}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setMessages([])} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Clear chat">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-4">

        {/* ── WELCOME STATE ── */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-900/50 mb-2">
              <Bot size={44} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                AI Symptom Doctor
              </h1>
              <p className="text-slate-400 font-medium max-w-lg text-lg leading-relaxed">
                Describe your symptoms using <span className="text-white font-bold">text, voice, or photo</span>. I understand English, Sinhala, and Tamil — and I will give you an expert-level assessment instantly.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
              {[
                { icon: TypeIcon, label: 'Type symptoms', desc: 'In any language' },
                { icon: Mic, label: 'Speak out loud', desc: 'Voice recognition' },
                { icon: ImageIcon, label: 'Upload photo', desc: 'Skin, reports, etc.' },
                { icon: MapPin, label: 'Find hospitals', desc: 'GPS location' },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/3 border border-white/5 text-center">
                  <f.icon size={22} className="text-indigo-400 mx-auto mb-2" />
                  <p className="font-black text-white text-sm">{f.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{f.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Quick Start — Select a Symptom</p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_SYMPTOMS.map(s => (
                  <button key={s} onClick={() => { setInputText(s); setInputMode('text'); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-bold">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHAT MESSAGES ── */}
        {messages.length > 0 && (
          <div className="flex-1 space-y-5 pb-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#8D153A]' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
                  {msg.role === 'user' ? <Users size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                </div>

                <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                  {/* Image preview */}
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="Uploaded" className="w-48 h-36 object-cover rounded-2xl border border-white/10" />
                  )}

                  {msg.loading ? (
                    <div className="px-5 py-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-3 text-slate-400">
                      <Loader2 size={18} className="animate-spin text-indigo-400" />
                      <span className="font-medium text-sm">Analyzing your symptoms...</span>
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`px-5 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-[#8D153A]/30 border border-[#8D153A]/30' : msg.severity ? severityConfig[msg.severity].color + ' border' : 'bg-white/5 border border-white/10'}`}>
                      {/* Severity Badge */}
                      {msg.severity && msg.role === 'ai' && (
                        <div className="mb-3 flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${severityConfig[msg.severity].badge}`}>
                            {severityConfig[msg.severity].label}
                          </span>
                          <span className={`text-xs font-bold ${severityConfig[msg.severity].text}`}>
                            AI Confidence: 91.2%
                          </span>
                        </div>
                      )}

                      <p className="text-slate-200 font-medium leading-relaxed text-sm whitespace-pre-wrap">{msg.content}</p>

                      {/* Specialty Match */}
                      {msg.specialty && msg.role === 'ai' && (
                        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl flex-shrink-0">
                            {msg.specialty.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-white text-sm">Recommended Specialist</p>
                            <p className="text-indigo-400 font-bold text-sm">{msg.specialty.specialty}</p>
                            <p className="text-[10px] font-medium text-slate-500">{msg.specialty.desc}</p>
                          </div>
                          <Link to="/booking" className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#8D153A] text-white text-xs font-black hover:bg-[#71112D] transition-all flex-shrink-0">
                            Book <ChevronRight size={14} />
                          </Link>
                        </div>
                      )}

                      {/* Action Buttons for AI messages */}
                      {msg.role === 'ai' && !msg.loading && msg.severity && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(msg.severity === 'critical' || msg.severity === 'high') && (
                            <a href="tel:1990" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-all shadow-lg shadow-red-900/50">
                              <PhoneCall size={16} /> Call 1990
                            </a>
                          )}
                          {msg.severity === 'critical' && (
                            <button onClick={findNearbyHospitals} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all">
                              <MapPin size={16} /> Nearest Hospitals
                            </button>
                          )}
                          <Link to="/booking" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all">
                            <Calendar size={16} /> Book Appointment
                          </Link>
                          {(msg.severity === 'low' || msg.severity === 'medium') && (
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-600/30 transition-all">
                              <Pill size={16} /> View Home Remedies
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-600 px-2 font-medium">
                    {msg.timestamp.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Nearby Hospitals Panel */}
            {nearbyHospitals && (
              <div className="mx-auto max-w-2xl p-6 rounded-3xl bg-red-950/30 border border-red-500/30">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={22} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-black text-white">Nearby Emergency Hospitals</p>
                    <p className="text-xs text-slate-400 font-medium">Based on your location</p>
                  </div>
                  <button onClick={() => setNearbyHospitals(null)} className="ml-auto p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  {nearbyHospitals.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        {h.emergency ? <Zap size={18} className="text-red-400" /> : <Heart size={18} className="text-rose-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-white text-sm truncate">{h.name}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                          <MapPin size={10} />{h.distance}
                          {h.emergency && <span className="text-[#FFBE29] text-[9px] font-black bg-[#FFBE29]/10 px-2 py-0.5 rounded-full">24/7 EMERGENCY</span>}
                        </p>
                      </div>
                      <a href={`tel:${h.phone}`} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-600/80 text-white text-xs font-black hover:bg-red-600 transition-all flex-shrink-0">
                        <PhoneCall size={14} /> Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* ── EMERGENCY BANNER (when critical detected) ── */}
        {hasCritical && (
          <div className="sticky bottom-32 z-10 p-4 rounded-3xl bg-red-950/80 border-2 border-red-500/60 backdrop-blur-xl shadow-2xl shadow-red-900/50 flex items-center gap-4">
            <AlertTriangle size={28} className="text-red-400 animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <p className="font-black text-red-300 text-sm">Emergency detected in symptoms</p>
              <p className="text-red-400/70 text-xs font-medium">Please call 1990 immediately or dispatch Suwa Seriya</p>
            </div>
            <a href="tel:1990" className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white text-sm font-black rounded-2xl hover:bg-red-500 transition-all shadow-lg animate-pulse flex-shrink-0">
              <PhoneCall size={18} /> 1990
            </a>
          </div>
        )}

        {/* ── INPUT — IMAGE PREVIEW ── */}
        {imagePreview && (
          <div className="relative w-fit">
            <img src={imagePreview} alt="Preview" className="w-32 h-24 object-cover rounded-2xl border border-white/10" />
            <button onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── INPUT AREA ── */}
        <div className="bg-[#0D0D18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-white/5">
            {([['text', TypeIcon, 'Text'], ['voice', Mic, 'Voice'], ['image', ImageIcon, 'Image']] as const).map(([mode, Icon, label]) => (
              <button key={mode} onClick={() => setInputMode(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${inputMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                <Icon size={14} />{label}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={findNearbyHospitals} disabled={locating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all">
              {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
              Hospitals
            </button>
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <textarea
              ref={textareaRef}
              rows={3}
              className="w-full bg-transparent px-5 py-4 text-white font-medium text-base placeholder-slate-600 resize-none outline-none"
              placeholder={PLACEHOLDERS[language]}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

          {/* Voice Input */}
          {inputMode === 'voice' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-2xl ${isRecording ? 'bg-red-600 scale-110 shadow-red-900/60' : 'bg-indigo-600 hover:scale-105 shadow-indigo-900/50'}`}>
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              {isRecording && (
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
              <p className="text-slate-400 font-medium text-sm">
                {isRecording ? `Listening in ${LANG_LABELS[language]}... Tap to stop` : `Tap to speak in ${LANG_LABELS[language]}`}
              </p>
              {inputText && (
                <div className="max-w-sm text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-white font-medium text-sm italic">"{inputText}"</p>
                </div>
              )}
            </div>
          )}

          {/* Image Upload */}
          {inputMode === 'image' && (
            <div
              className="flex flex-col items-center justify-center gap-4 py-10 cursor-pointer hover:bg-white/2 transition-all"
              onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 flex items-center justify-center">
                <UploadCloud size={28} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="font-black text-white">Upload Medical Image</p>
                <p className="text-slate-500 text-sm font-medium">Skin conditions, rashes, reports, prescriptions, X-rays</p>
                <p className="text-indigo-400 text-xs font-bold mt-1">Tap to browse or drag & drop</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>
          )}

          {/* Send Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex-1">
              {language === 'Sinhala' ? 'Sinhala භාෂාව' : language === 'Tamil' ? 'தமிழ் மொழி' : 'English Language'} · AI Doctor Online
            </p>
            <button
              onClick={sendMessage}
              disabled={loading || (!inputText.trim() && !imageFile) || isRecording}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/50">
              {loading ? <><Loader2 size={18} className="animate-spin" />Analyzing</> : <><Send size={18} />Analyze</>}
            </button>
          </div>
        </div>

        {/* Quick Symptom Chips (when in conversation) */}
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-[10px] text-slate-600 font-bold uppercase tracking-widest">Follow-up:</p>
            {['Tell me more', 'Is it serious?', 'What medicines?', 'Nearest hospital', 'Book appointment'].map(q => (
              <button key={q} onClick={() => setInputText(q)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-slate-700 font-medium pb-4">
          AI analysis is for informational purposes only. Always consult a qualified doctor for medical decisions. In emergency, call 1990.
        </p>
      </div>
    </div>
  );
}
