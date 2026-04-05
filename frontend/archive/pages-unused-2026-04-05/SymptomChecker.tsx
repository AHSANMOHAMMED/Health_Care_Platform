import { useState } from 'react';
import { Sparkles, Activity, AlertCircle } from 'lucide-react';
import { api } from '../api/axios';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/ai/symptom-checker', { symptoms });
      setResult(res.data.analysis || res.data);
    } catch(err) {
      console.error('AI Service Error:', err);
      setResult("AI service is currently unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <Sparkles className="absolute -right-4 -top-4 h-32 w-32 opacity-10" />
        <h2 className="text-3xl font-bold mb-2">AI Symptom Analyzer</h2>
        <p className="text-blue-100 max-w-xl">Powered by Google Gemini 2.0 Flash. Describe your symptoms below for a preliminary AI analysis. This is NOT a substitute for professional medical advice.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-bold text-slate-700 mb-2">Describe what you are feeling</label>
        <textarea 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
          rows={5}
          placeholder="e.g. I have had a headache for 2 days, accompanied by a slight fever and a dry cough..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        
        <button 
          onClick={handleCheck}
          disabled={!symptoms.trim() || loading}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium w-full flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
        >
          {loading ? <Activity className="animate-spin" /> : <Sparkles size={18}/>}
          {loading ? 'Analyzing with Gemini...' : 'Analyze Symptoms'}
        </button>
      </div>

      {result && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-in slide-in-from-bottom-4">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
            <Activity className="text-blue-500" /> AI Preliminary Output
          </h3>
          <p className="text-blue-800 leading-relaxed font-medium">{result}</p>
          
          <div className="mt-4 p-4 bg-white/50 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-700">
            <AlertCircle className="shrink-0" size={18}/>
            <p>Remember to book an appointment with a real doctor to confirm your diagnosis.</p>
          </div>
        </div>
      )}
    </div>
  );
}
