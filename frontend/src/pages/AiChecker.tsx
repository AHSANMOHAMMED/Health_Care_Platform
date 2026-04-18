import React, { useState } from 'react';
import { Sparkles, Activity, AlertCircle, Bot, Send, Stethoscope } from 'lucide-react';
import { api } from '../api/axios';

export default function AiChecker() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!symptoms.trim()) return;
        
        setLoading(true);
        try {
            const response = await api.post('/ai/symptom-checker', { symptoms });
            setResult(response.data.analysis || response.data);
        } catch (error) {
            console.error('AI Service Error:', error);
            setTimeout(() => {
              setResult("We couldn't reach the AI service right now. Please try again later, or contact support if the issue persists. Our fallback mock suggests modifying your diet and scheduling an immediate check-up based on your description.");
              setLoading(false);
            }, 1500);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up">
            {/* Ambient Background Glow behind the card */}
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full animate-pulse"></div>
               
               <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl overflow-hidden relative mb-10">
                   <div className="absolute -right-10 -top-10 h-64 w-64 bg-indigo-500/30 blur-3xl rounded-full"></div>
                   <div className="absolute -left-10 -bottom-10 h-64 w-64 bg-purple-500/30 blur-3xl rounded-full"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                       <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                           <Bot className="text-purple-300" size={32} />
                       </div>
                       <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                           AI Symptom <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Analyzer</span>
                       </h2>
                       <p className="text-slate-300 max-w-2xl text-lg font-medium">
                           Powered by advanced Language Models. Describe what you're feeling in plain English, and our AI will provide a preliminary medical analysis.
                       </p>
                       <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                          <AlertCircle size={14} /> Not a substitute for professional medical advice
                       </div>
                   </div>
               </div>
            </div>

            <div className="premium-glass p-2 md:p-4 rounded-[2rem] shadow-xl">
                <div className="bg-white rounded-[1.5rem] p-6 md:p-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                       <Stethoscope className="text-indigo-500" size={18} /> How are you feeling today?
                    </label>
                    <div className="relative">
                       <textarea 
                           className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-lg text-slate-800 placeholder:text-slate-400"
                           rows={5}
                           placeholder="Example: I've had a headache for 2 days, accompanied by a slight fever and a dry cough, mostly worse at night..."
                           value={symptoms}
                           onChange={(e) => setSymptoms(e.target.value)}
                       ></textarea>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                       <button 
                           onClick={handleAnalyze}
                           disabled={!symptoms.trim() || loading}
                           className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${
                              !symptoms.trim() || loading 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : 'btn-gradient text-white shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1'
                           }`}
                       >
                           {loading ? (
                              <>
                                <Activity className="animate-spin" size={24} /> Analyzing... 
                              </>
                           ) : (
                              <>
                                Generate Insights <Send size={20} />
                              </>
                           )}
                       </button>
                    </div>
                </div>
            </div>

            {/* Artificial Intelligence Result Pane */}
            {loading && !result && (
                <div className="mt-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse">
                   <div className="h-6 w-1/3 bg-slate-200 rounded-lg mb-6"></div>
                   <div className="space-y-4">
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                      <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                      <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                   </div>
                </div>
            )}

            {result && !loading && (
                <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-8 rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3 mb-6 pb-4 border-b border-indigo-200/50">
                        <Sparkles className="text-purple-600" size={24} /> Analysis Complete
                    </h3>
                    
                    <div className="prose prose-indigo max-w-none text-slate-700 text-lg leading-relaxed font-medium">
                        {/* If result naturally has line breaks, we maintain them */}
                        {result.split('\n').map((paragraph, idx) => (
                           <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white flex sm:flex-row flex-col items-center sm:items-start gap-4 text-indigo-800 shadow-sm">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
                           <AlertCircle size={24}/>
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Schedule a Physical Checkup</h4>
                           <p className="text-sm">While AI provides strong preliminary insights, exclusively rely on a licensed medical professional for formal diagnoses and treatments.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
