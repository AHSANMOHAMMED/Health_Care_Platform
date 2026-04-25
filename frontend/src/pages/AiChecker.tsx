import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Send, Mic, MicOff, Image as ImageIcon, Type as TypeIcon,
  Loader2, PhoneCall, Calendar,
  ChevronRight, Users, Brain, AlertTriangle, RefreshCw, MapPin, UploadCloud, Languages, Pill, X, Zap, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

// ============================================================
// TRANSLATION ENGINE
// ============================================================
const UI_TRANSLATIONS = {
  English: {
    title: 'AI Doctor',
    online: 'Online · Multi-lingual · 24/7',
    inputPlaceholder: 'Describe your symptoms...',
    send: 'Analyze',
    analyzing: 'Analyzing',
    age: 'Age',
    gender: 'Gender',
    duration: 'Duration',
    analysis: 'AI Analysis',
    specialty: 'Specialty',
    urgency: 'Urgency',
    actions: 'Recommended Actions',
    conditions: 'Possible Conditions',
    disclaimer: 'DISCLAIMER: This is an AI assessment, not a medical diagnosis.',
    nearestHospitals: 'Nearest Hospitals',
    bookAppt: 'Book Appointment',
    homeRemedies: 'Home Remedies',
    emergencyDetected: 'Emergency detected in symptoms',
    call1990: 'Please call 1990 immediately or dispatch Suwa Seriya',
  },
  Sinhala: {
    title: 'AI වෛද්‍යවරයා',
    online: 'සජීවී · බහු-භාෂා · 24/7',
    inputPlaceholder: 'ඔබේ රෝග ලක්ෂණ විස්තර කරන්න...',
    send: 'විශ්ලේෂණය',
    analyzing: 'විශ්ලේෂණය කරමින්',
    age: 'වයස',
    gender: 'ස්ත්‍රී/පුරුෂ',
    duration: 'කාලය',
    analysis: 'AI විශ්ලේෂණය',
    specialty: 'විශේෂඥතාව',
    urgency: 'හදිසිභාවය',
    actions: 'නිර්දේශිත ක්‍රියාමාර්ග',
    conditions: 'විය හැකි රෝගී තත්ත්වයන්',
    disclaimer: 'වියාචනය: මෙය AI තක්සේරුවක් පමණි, වෛද්‍ය විනිශ්චයක් නොවේ.',
    nearestHospitals: 'ළඟම ඇති රෝහල්',
    bookAppt: 'වෛද්‍ය හමුවක් වෙන්කරන්න',
    homeRemedies: 'නිවසේදී කළ හැකි දේවල්',
    emergencyDetected: 'රෝග ලක්ෂණ වල හදිසි තත්ත්වයක් ඇත',
    call1990: 'කරුණාකර වහාම 1990 අමතන්න',
  },
  Tamil: {
    title: 'AI மருத்துவர்',
    online: 'ஆன்லைன் · பன்மொழி · 24/7',
    inputPlaceholder: 'உங்கள் அறிகுறிகளை விவரிக்கவும்...',
    send: 'பகுப்பாய்வு',
    analyzing: 'பகுப்பாய்வு செய்கிறது',
    age: 'வயது',
    gender: 'பாலினம்',
    duration: 'காலம்',
    analysis: 'AI பகுப்பாய்வு',
    specialty: 'நிபுணத்துவம்',
    urgency: 'அவசரம்',
    actions: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    conditions: 'சாத்தியமான நிலைமைகள்',
    disclaimer: 'பொறுப்புத் துறப்பு: இது ஒரு AI மதிப்பீடு, மருத்துவ நோய் නිර්ණය அல்ல.',
    nearestHospitals: 'அருகிலுள்ள மருத்துவமனைகள்',
    bookAppt: 'முன்பதிவு செய்யுங்கள்',
    homeRemedies: 'வீட்டு வைத்தியம்',
    emergencyDetected: 'அறிகுறிகளில் அவசரநிலை கண்டறியப்பட்டது',
    call1990: 'தயவுசெய்து உடனடியாக 1990 ஐ அழைக்கவும்',
  }
};

const LANG_DISPLAY_LABELS: Record<string, string> = {
  English: 'English',
  Sinhala: 'සිංහල',
  Tamil: 'தமிழ்',
};

// ============================================================
// SL HOSPITAL DATABASE (offline-capable)
// ============================================================
const SL_HOSPITALS = [
  { name: 'Colombo National Hospital', distance: '2.1 km', phone: '+94 11 269 1111', emergency: true },
  { name: 'Lanka Hospitals', distance: '3.4 km', phone: '+94 11 553 0000', emergency: true },
  { name: 'Asiri Hospital Colombo', distance: '4.0 km', phone: '+94 11 466 5500', emergency: true },
  { name: 'Nawaloka Hospital', distance: '4.8 km', phone: '+94 11 254 4444', emergency: true },
  { name: 'Hemas Hospital Wattala', distance: '8.2 km', phone: '+94 11 229 1291', emergency: false },
];

const SPECIALTY_RULES = [
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

function detectSpecialty(text: string) {
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
  
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<string>('Male');
  const [duration, setDuration] = useState<string>('Few hours');

  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const labels = UI_TRANSLATIONS[language];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported. Use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Sinhala' ? 'si-LK' : language === 'Tamil' ? 'ta-LK' : 'en-US';
    recognition.onresult = (event: any) => setInputText(Array.from(event.results).map((r: any) => r[0].transcript).join(''));
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [language]);

  const stopRecording = () => { recognitionRef.current?.stop(); setIsRecording(false); };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const findNearbyHospitals = () => {
    setLocating(true);
    setTimeout(() => { setNearbyHospitals(SL_HOSPITALS); setLocating(false); }, 1000);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text && !imageFile) return;
    setLoading(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text || '(Image uploaded)', timestamp: new Date(), imageUrl: imagePreview ?? undefined };
    const aiLoading: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: '', timestamp: new Date(), loading: true };

    setMessages(prev => [...prev, userMsg, aiLoading]);
    setInputText(''); setImagePreview(null); setImageFile(null);

    try {
      const response = await api.post('/ai/symptom-checker', {
        symptoms: text || 'Analyze medical image',
        language,
        age: parseInt(age),
        gender,
        duration,
        imageData: imagePreview,
        severity: detectSeverity(text).toUpperCase()
      });
      const analysisText = response.data.analysis || 'Analysis received';
      const aiSeverity = detectSeverity(analysisText);
      const finalMsg: Message = { id: aiLoading.id, role: 'ai', content: analysisText, timestamp: new Date(), severity: aiSeverity, specialty: detectSpecialty(text + analysisText) ?? undefined };
      setMessages(prev => prev.map(m => m.id === aiLoading.id ? finalMsg : m));
      if (aiSeverity === 'critical') { setHasCritical(true); findNearbyHospitals(); }
    } catch {
      const sev = detectSeverity(text);
      const fallbackMsg: Message = { id: aiLoading.id, role: 'ai', content: `Offline Assessment: ${text}. Urgency: ${sev}`, timestamp: new Date(), severity: sev };
      setMessages(prev => prev.map(m => m.id === aiLoading.id ? fallbackMsg : m));
    } finally { setLoading(false); }
  };

  const severityConfig = {
    critical: { color: 'border-red-500/50 bg-red-950/30', badge: 'bg-red-500', label: '🚨 CRITICAL', text: 'text-red-300' },
    high: { color: 'border-orange-500/30 bg-orange-950/20', badge: 'bg-orange-500', label: '⚠️ HIGH', text: 'text-orange-300' },
    medium: { color: 'border-amber-500/30 bg-amber-950/20', badge: 'bg-amber-500', label: '⚡ MEDIUM', text: 'text-amber-300' },
    low: { color: 'border-emerald-500/30 bg-emerald-950/20', badge: 'bg-emerald-500', label: '✅ MILD', text: 'text-emerald-300' },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col font-sans">
      <header className="border-b border-white/5 bg-[#0D0D18]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
              <Brain size={24} className="text-slate-900" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg leading-none">{labels.title}</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{labels.online}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-indigo-400" />
            <select value={language} onChange={e => setLanguage(e.target.value as Language)} className="bg-transparent text-slate-900 text-xs font-bold outline-none cursor-pointer">
              {Object.entries(LANG_DISPLAY_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-slate-900">{v}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-10">
            <div className="w-24 h-24 rounded-3xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 shadow-2xl">
              <Bot size={44} className="text-indigo-400" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{labels.title}</h1>
            <p className="text-slate-600 max-w-lg">{labels.disclaimer}</p>
          </div>
        )}

        <div className="flex-1 space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-900' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <Users size={18} className="text-slate-900" /> : <Bot size={18} className="text-slate-900" />}
              </div>
              <div className={`max-w-[85%] px-5 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-white/5 border border-white/10' : msg.severity ? severityConfig[msg.severity].color : 'bg-white/5'}`}>
                {msg.imageUrl && <img src={msg.imageUrl} className="w-48 rounded-xl mb-3" alt="clinical" />}
                {msg.loading ? <Loader2 className="animate-spin text-indigo-400" /> : <p className="text-slate-800 text-sm whitespace-pre-wrap">{msg.content}</p>}
                {msg.specialty && <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <span className="text-2xl">{msg.specialty.icon}</span>
                  <div><p className="text-[10px] text-slate-500 font-bold uppercase">{labels.specialty}</p><p className="text-slate-900 font-bold">{msg.specialty.specialty}</p></div>
                </div>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {hasCritical && (
          <div className="p-4 bg-red-950 border border-red-500/50 rounded-2xl flex items-center gap-4">
            <AlertTriangle className="text-red-500 animate-pulse" />
            <div className="flex-1"><p className="text-slate-900 font-bold">{labels.emergencyDetected}</p><p className="text-xs text-red-300">{labels.call1990}</p></div>
            <a href="tel:1990" className="px-4 py-2 bg-red-600 text-slate-900 rounded-xl font-bold">Call 1990</a>
          </div>
        )}

        <div className="bg-[#0D0D18] border border-white/10 rounded-3xl p-4 shadow-2xl">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {(['text', 'voice', 'image'] as const).map((m) => {
              const modeConfig = { text: [TypeIcon, 'Text'], voice: [Mic, 'Voice'], image: [ImageIcon, 'Image'] } as const;
              const [I, l] = modeConfig[m] as [React.ElementType, string];
              return (
              <button key={m} onClick={() => setInputMode(m as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${inputMode === m ? 'bg-indigo-600 text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}>
                <I size={14} />{l}
              </button>
              );
            })}
          </div>

          {inputMode === 'text' && <textarea rows={2} className="w-full bg-transparent text-slate-900 outline-none placeholder-slate-600" placeholder={labels.inputPlaceholder} value={inputText} onChange={e => setInputText(e.target.value)} />}
          
          {inputMode === 'voice' && (
            <div className="flex flex-col items-center py-6 gap-3">
              <button onClick={isRecording ? stopRecording : startRecording} className={`w-16 h-16 rounded-full flex items-center justify-center text-slate-900 ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-indigo-600'}`}>
                {isRecording ? <MicOff /> : <Mic />}
              </button>
              <p className="text-xs text-slate-500">{isRecording ? 'Listening...' : 'Tap to speak'}</p>
            </div>
          )}

          {inputMode === 'image' && (
            <div className="py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="text-slate-500" />
              <p className="text-xs text-slate-500">Upload medical photo</p>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageSelect} />
            </div>
          )}

          <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
            <div className="flex gap-2">
              <input type="number" className="bg-white/5 text-slate-900 text-xs p-2 rounded-lg w-12" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
              <select className="bg-white/5 text-slate-900 text-xs p-2 rounded-lg" value={gender} onChange={e => setGender(e.target.value)}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <button onClick={sendMessage} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-indigo-900/40">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {labels.send}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
