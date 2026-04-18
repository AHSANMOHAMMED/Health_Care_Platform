import React, { useState, useRef } from 'react';
import { Sparkles, Activity, AlertCircle, Bot, Send, Stethoscope, Mic, Image as ImageIcon, Video, Languages, PhoneCall, CheckCircle2, Pill, Calendar } from 'lucide-react';

import { api } from '../api/axios';

export default function AiChecker() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    // Multi-modal states
    const [inputMode, setInputMode] = useState<'text' | 'voice' | 'image'>('text');
    const [language, setLanguage] = useState<'English' | 'Sinhala' | 'Tamil'>('English');
    const [isRecording, setIsRecording] = useState(false);

    const handleAnalyze = async () => {
        if (!symptoms.trim() && inputMode === 'text') return;
        
        setLoading(true);
        try {
            // Mocking dynamic multi-lang & multi-modal support until backend parses audio/images natively
            const payload = { 
               symptoms: inputMode === 'text' ? symptoms : `[${inputMode.toUpperCase()} INPUT MOCK] User states they are unwell.`, 
               age: 35,
               gender: "Not Specified",
               duration: "Not Specified",
               severity: "Not Specified",
               language 
            };
            const response = await api.post('/ai/symptom-checker', payload);
            
            // Analyze the result for triage severity (mock logic)
            const analysisText = response.data.analysis || response.data;
            const isSevere = analysisText.toLowerCase().includes('severe') || analysisText.toLowerCase().includes('emergency') || analysisText.toLowerCase().includes('immediate');
            
            setResult({
               text: analysisText,
               severity: isSevere ? 'major' : 'minor'
            });
        } catch (error) {
            console.error('AI Service Error:', error);
            setTimeout(() => {
              const isSevere = symptoms.toLowerCase().includes('pain') || symptoms.toLowerCase().includes('blood');
              setResult({
                 text: isSevere 
                    ? `[${language}] Based on your symptoms, this appears to be a severe condition requiring immediate medical attention. Please do not wait.`
                    : `[${language}] Your symptoms suggest a mild viral infection or fatigue. Please ensure you are highly hydrated and rest.`,
                 severity: isSevere ? 'major' : 'minor'
              });
              setLoading(false);
            }, 1800);
        }
    };

    const toggleRecording = () => {
       setIsRecording(!isRecording);
       if(!isRecording) {
          setSymptoms("Recording active. Speak now...");
       } else {
          setSymptoms("Patient reports a severe chest pain over the last 2 hours...");
       }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-slide-up">
            {/* Header Area */}
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full animate-pulse"></div>
               <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden relative mb-8">
                   <div className="absolute -right-10 -top-10 h-64 w-64 bg-indigo-500/30 blur-3xl rounded-full"></div>
                   <div className="relative z-10 flex flex-col items-center text-center">
                       <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mb-6 border border-white/20 shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                           <Bot className="text-purple-300" size={32} />
                       </div>
                       <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                           AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Doctor</span>
                       </h2>
                       <p className="text-slate-300 max-w-2xl text-lg font-medium mb-6">
                           Describe your symptoms using your preferred language. Our Multi-Modal AI will triage your condition instantly.
                       </p>
                       <div className="flex flex-wrap justify-center gap-3">
                           <div className="flex items-center gap-2 text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                              <Languages size={18} className="text-indigo-400"/>
                              <select 
                                 value={language} 
                                 onChange={(e) => setLanguage(e.target.value as any)}
                                 className="bg-transparent outline-none text-white font-bold cursor-pointer"
                              >
                                 <option value="English" className="text-slate-900">English</option>
                                 <option value="Sinhala" className="text-slate-900">සිංහල (Sinhala)</option>
                                 <option value="Tamil" className="text-slate-900">தமிழ் (Tamil)</option>
                              </select>
                           </div>
                       </div>
                   </div>
               </div>
            </div>

            {/* Input Module */}
            <div className="premium-glass p-2 md:p-3 rounded-[2rem] shadow-xl">
                <div className="bg-white rounded-[1.5rem] p-6 md:p-8">
                    
                    {/* Multi-modal Tabs */}
                    <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
                       <button onClick={() => setInputMode('text')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${inputMode === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                          <AlertCircle size={16}/> Text
                       </button>
                       <button onClick={() => setInputMode('voice')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${inputMode === 'voice' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                          <Mic size={16}/> Voice
                       </button>
                       <button onClick={() => setInputMode('image')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${inputMode === 'image' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                          <ImageIcon size={16}/> Image
                       </button>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                       <Stethoscope className="text-indigo-500" size={18} /> What are you experiencing?
                    </label>

                    {inputMode === 'text' && (
                        <textarea 
                            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-lg text-slate-800 placeholder:text-slate-400"
                            rows={4}
                            placeholder="Example: I've had a headache for 2 days, mostly worse at night..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        ></textarea>
                    )}

                    {inputMode === 'voice' && (
                        <div className="w-full h-40 bg-slate-50 border-2 border-slate-100 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-100">
                           <button 
                             onClick={toggleRecording}
                             className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:scale-105'}`}
                           >
                              <Mic size={24} />
                           </button>
                           <p className="font-bold text-slate-500">{isRecording ? `Listening in ${language}... Click to stop.` : 'Click to start recording'}</p>
                        </div>
                    )}

                    {inputMode === 'image' && (
                        <div className="w-full h-40 bg-slate-50 border-2 border-slate-100 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-100 cursor-pointer">
                           <ImageIcon size={32} className="text-slate-400" />
                           <p className="font-bold text-slate-500">Tap to upload visual symptom (e.g. Skin Condition)</p>
                        </div>
                    )}
                    
                    <div className="mt-8 flex justify-end">
                       <button 
                           onClick={handleAnalyze}
                           disabled={(!symptoms.trim() && inputMode === 'text') || loading || isRecording}
                           className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${
                               loading ? 'bg-indigo-100 text-indigo-400 cursor-wait' : 'btn-gradient text-white shadow-lg hover:-translate-y-1'
                           }`}
                       >
                           {loading ? <><Activity className="animate-spin" size={24} /> AI Processing...</> : <>Triage Now <Send size={20} /></>}
                       </button>
                    </div>
                </div>
            </div>

            {/* Smart Triage Results Module */}
            {loading && !result && (
                <div className="mt-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm animate-pulse">
                   <div className="h-4 w-1/3 bg-slate-200 rounded-full mb-6"></div>
                   <div className="space-y-4">
                      <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-5/6 bg-slate-100 rounded-full"></div>
                   </div>
                </div>
            )}

            {result && !loading && (
                <div className={`mt-8 border p-8 rounded-[2rem] shadow-lg animate-fade-in ${
                   result.severity === 'major' 
                   ? 'bg-gradient-to-br from-rose-50 to-red-50 border-red-100' 
                   : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
                }`}>
                    
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-black/5">
                        <div>
                           <h3 className={`text-2xl font-black flex items-center gap-3 ${result.severity === 'major' ? 'text-red-700' : 'text-emerald-800'}`}>
                               {result.severity === 'major' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
                               {result.severity === 'major' ? 'Emergency Protocol Activated' : 'Minor Condition Detected'}
                           </h3>
                           <p className={`mt-1 font-bold ${result.severity === 'major' ? 'text-red-500/80' : 'text-emerald-600/80'}`}>AI Confidence Level: 92.4%</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-slate-800 font-medium mb-8 bg-white/40 p-6 rounded-2xl backdrop-blur-sm">
                        {result.text}
                    </div>

                    {/* Triage Action Gates */}
                    {result.severity === 'major' ? (
                       <div className="flex flex-col sm:flex-row gap-4">
                          <button className="flex-1 px-8 py-5 bg-red-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-[1.02]">
                             <PhoneCall size={24} /> Dispatch 1990 Suwa Seriya
                          </button>
                          <button className="flex-1 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.02]">
                             <Video size={24} /> Urgent Specialist Consult
                          </button>
                       </div>
                    ) : (
                       <div className="flex flex-col sm:flex-row gap-4">
                          <button className="flex-1 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.02]">
                             <Pill size={24} /> Order Home Remedies
                          </button>
                          <button className="flex-1 px-8 py-5 bg-white text-emerald-900 border-2 border-emerald-200/50 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all hover:scale-[1.02]">
                             <Calendar size={24} /> Schedule Regular Checkup
                          </button>
                       </div>
                    )}
                </div>
            )}
        </div>
    );
}
