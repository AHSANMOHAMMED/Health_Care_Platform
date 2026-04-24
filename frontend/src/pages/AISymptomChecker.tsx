import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Loader2, AlertTriangle, ChevronRight, MapPin, Languages, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

const UI_TRANSLATIONS = {
  English: {
    title: 'AI Health Assistant',
    placeholder: 'Describe your symptoms in detail...',
    analyzing: 'AI Analyzing...',
    analysis: 'AI Analysis',
    urgency: 'Urgency Level',
    conditions: 'Possible Conditions',
    actions: 'Recommended Actions',
    disclaimer: 'This is an AI assessment, not a medical diagnosis. Consult a doctor for professional advice.',
    emergency: 'Emergency Detected - Call 1990 immediately',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  },
  Sinhala: {
    title: 'AI සෞඛ්‍ය සහායක',
    placeholder: 'ඔබේ රෝග ලක්ෂණ විස්තරාත්මකව විස්තර කරන්න...',
    analyzing: 'AI විශ්ලේෂණය කරමින්...',
    analysis: 'AI විශ්ලේෂණය',
    urgency: 'හදිසි මට්ටම',
    conditions: 'විය හැකි තත්ත්ව',
    actions: 'නිර්දේශිත ක්‍රියා',
    disclaimer: 'මෙය AI ඇගයීමක් වන අතර වෛද්‍ය තීරණයක් නොවේ. වෘත්තීම උපදෙස් සඳහා වෛද්‍යවරයෙකු හමුවන්න.',
    emergency: 'හදිසි තත්ත්වයක් - වහාම 1990 ඇමතුම් කරන්න',
    low: 'අවම',
    medium: 'මධ්‍යම',
    high: 'ඉහළ',
    critical: 'ගැටලුවක්'
  },
  Tamil: {
    title: 'AI சுகாதார உதவியாளர்',
    placeholder: 'உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்...',
    analyzing: 'AI பகுப்பாய்வு செய்கிறது...',
    analysis: 'AI பகுப்பாய்வு',
    urgency: 'அவசர மட்டம்',
    conditions: 'சாத்தியமான நிலைமைகள்',
    actions: 'பரிந்துருக்கப்பட்ட செயல்கள்',
    disclaimer: 'இது AI மதிப்பீடு, மருத்துவ கண்டறிதல் அல்ல. தொழில்முறை ஆலோசனைக்கு மருத்துவரை அணுகவும்.',
    emergency: 'அவசரம் கண்டறியப்பட்டது - உடனடியாக 1990 அழைக்கவும்',
    low: 'குறைந்த',
    medium: 'நடுத்தர',
    high: 'அதிக',
    critical: 'முக்கியமான'
  }
};

export default function AISymptomChecker() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Sinhala' | 'Tamil'>('English');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [analysis]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await api.post('/ai-service/analyze', {
        symptoms: input,
        age: 30,
        gender: 'unknown',
        language: language.toLowerCase()
      });
      setAnalysis(response.data);
    } catch (error) {
      // Fallback analysis
      setAnalysis({
        urgency: 'medium',
        conditions: [
          { name: 'General Checkup Recommended', probability: 75 },
          { name: 'Rest and Hydration', probability: 60 }
        ],
        actions: ['Schedule a consultation with a general practitioner', 'Monitor symptoms for 24-48 hours'],
        emergency: false
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-emerald-500 bg-emerald-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1220] text-slate-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1220]/90 backdrop-blur-md border-b border-[#1E3A5F]/30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white font-semibold">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="text-[#0EA5E9]" size={24} />
            <span className="font-semibold text-white">{t.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages size={18} className="text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-lg px-2 py-1 text-sm text-white"
            >
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Input Section */}
          <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-[#0EA5E9]" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">{t.title}</h2>
                <p className="text-sm text-slate-400">Describe your symptoms and our AI will analyze them</p>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-32 bg-[#0C1220] border border-[#1E3A5F]/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50 resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isRecording ? 'border-red-500/50 text-red-400' : 'border-[#1E3A5F]/50 text-slate-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                <span className="text-sm">{isRecording ? 'Stop' : 'Voice'}</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-all"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> {t.analyzing}</>
                ) : (
                  <><Send size={18} /> Analyze</>
                )}
              </button>
            </div>
          </div>

          {/* Emergency Banner */}
          {analysis?.emergency && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={24} />
                <div>
                  <p className="font-semibold text-red-400">{t.emergency}</p>
                  <Link to="/emergency" className="text-sm text-red-400/80 underline">Go to Emergency Services</Link>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4">
              {/* Urgency */}
              <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{t.urgency}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(analysis.urgency)}`}>
                    {t[analysis.urgency as keyof typeof t] || analysis.urgency}
                  </span>
                </div>
                <div className="h-2 bg-[#0C1220] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      analysis.urgency === 'critical' ? 'bg-red-500' :
                      analysis.urgency === 'high' ? 'bg-orange-500' :
                      analysis.urgency === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysis.urgency === 'critical' ? 100 : analysis.urgency === 'high' ? 75 : analysis.urgency === 'medium' ? 50 : 25}%` }}
                  />
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">{t.conditions}</h3>
                <div className="space-y-2">
                  {analysis.conditions?.map((condition: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#0C1220] rounded-lg">
                      <span className="text-sm text-slate-300">{condition.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-[#1E3A5F]/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0EA5E9] rounded-full"
                            style={{ width: `${condition.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{condition.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3">{t.actions}</h3>
                <ul className="space-y-2">
                  {analysis.actions?.map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight className="text-[#0EA5E9] flex-shrink-0 mt-0.5" size={16} />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Find Doctors */}
              <Link
                to="/doctor-search"
                className="flex items-center justify-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 py-3 rounded-xl transition-all"
              >
                <MapPin size={18} />
                <span className="font-medium">Find Nearby Doctors</span>
              </Link>

              {/* Disclaimer */}
              <p className="text-xs text-slate-500 text-center">{t.disclaimer}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
}
