import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, CheckCircle, AlertCircle, Activity, ArrowRight, Stethoscope, Thermometer, Heart, Brain, Bone, Eye, Ear } from 'lucide-react';

interface SymptomCategory {
  id: string;
  name: string;
  icon: any;
  symptoms: string[];
}

const symptomCategories: SymptomCategory[] = [
  { id: 'general', name: 'General', icon: Activity, symptoms: ['Fever', 'Fatigue', 'Weakness', 'Weight Loss', 'Chills'] },
  { id: 'respiratory', name: 'Respiratory', icon: Stethoscope, symptoms: ['Cough', 'Shortness of Breath', 'Chest Pain', 'Wheezing', 'Sore Throat'] },
  { id: 'cardiac', name: 'Cardiac', icon: Heart, symptoms: ['Chest Pain', 'Palpitations', 'Dizziness', 'Swelling', 'High BP'] },
  { id: 'neurological', name: 'Neurological', icon: Brain, symptoms: ['Headache', 'Dizziness', 'Numbness', 'Tingling', 'Seizures'] },
  { id: 'musculoskeletal', name: 'Musculoskeletal', icon: Bone, symptoms: ['Joint Pain', 'Muscle Pain', 'Back Pain', 'Stiffness', 'Swelling'] },
  { id: 'ent', name: 'Eye, Ear, Nose', icon: Eye, symptoms: ['Eye Pain', 'Ear Pain', 'Nasal Congestion', 'Hearing Loss', 'Vision Changes'] },
];

export default function SymptomChecker() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = () => {
    setShowResults(true);
  };

  const possibleConditions = [
    { name: 'Common Cold', probability: 65, urgency: 'low', action: 'Rest and hydration recommended' },
    { name: 'Viral Infection', probability: 45, urgency: 'medium', action: 'Monitor symptoms, consult if persists' },
    { name: 'Seasonal Allergies', probability: 30, urgency: 'low', action: 'Antihistamines may help' },
  ];

  return (
    <div className="min-h-screen bg-[#0C1220] text-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1220]/90 backdrop-blur-md border-b border-[#1E3A5F]/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Symptom Checker</h1>
          <Link to="/ai-checker" className="text-sm text-[#0EA5E9] hover:text-[#0284C7]">
            Try AI Version
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <>
              {/* Categories */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Select Body System</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {symptomCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedCategory === cat.id
                          ? 'border-[#0EA5E9] bg-[#0EA5E9]/10'
                          : 'border-[#1E3A5F]/50 hover:border-[#1E3A5F]'
                      }`}
                    >
                      <cat.icon className={`mb-2 ${selectedCategory === cat.id ? 'text-[#0EA5E9]' : 'text-slate-400'}`} size={24} />
                      <p className="font-medium text-white">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              {selectedCategory && (
                <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">
                    Select Your Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {symptomCategories
                      .find(c => c.id === selectedCategory)?.symptoms
                      .map(symptom => (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedSymptoms.includes(symptom)
                              ? 'bg-[#0EA5E9] text-white'
                              : 'bg-[#0C1220] text-slate-400 hover:text-white border border-[#1E3A5F]/50'
                          }`}
                        >
                          {selectedSymptoms.includes(symptom) && <CheckCircle size={14} className="inline mr-1" />}
                          {symptom}
                        </button>
                      ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                      {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                    </p>
                    <button
                      onClick={analyzeSymptoms}
                      disabled={selectedSymptoms.length === 0}
                      className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-all"
                    >
                      Analyze Symptoms <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results */
            <div className="space-y-4">
              <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
                <p className="text-sm text-slate-400 mb-4">Based on: {selectedSymptoms.join(', ')}</p>

                <div className="space-y-3">
                  {possibleConditions.map((condition, idx) => (
                    <div key={idx} className="bg-[#0C1220] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{condition.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          condition.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                          condition.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {condition.probability}% match
                        </span>
                      </div>
                      <div className="h-2 bg-[#1E3A5F]/30 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-[#0EA5E9] rounded-full"
                          style={{ width: `${condition.probability}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-400">{condition.action}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setShowResults(false); setSelectedSymptoms([]); }}
                    className="flex-1 py-3 bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white rounded-xl font-medium transition-all"
                  >
                    Check Again
                  </button>
                  <Link
                    to="/doctor-search"
                    className="flex-1 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-xl font-medium text-center transition-all"
                  >
                    Find Doctor
                  </Link>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-yellow-400/80">
                    This is not a medical diagnosis. Please consult with a healthcare professional for accurate diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
