import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Activity, 
  Heart, 
  Thermometer, 
  Head, 
  Eye, 
  Ear, 
  Stethoscope, 
  Pill, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Shield, 
  Zap, 
  User, 
  Users, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Minus, 
  X, 
  RefreshCw, 
  Download, 
  Share2, 
  Printer, 
  Star, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  Lightbulb,
  Microscope,
  Dna,
  Activity as ActivityIcon
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description: string;
  relatedConditions: string[];
}

interface AIAnalysis {
  id: string;
  timestamp: string;
  symptoms: string[];
  riskAssessment: {
    overall: 'low' | 'medium' | 'high' | 'critical';
    urgency: 'routine' | 'urgent' | 'emergency';
    confidence: number;
  };
  possibleConditions: Array<{
    name: string;
    probability: number;
    description: string;
    symptoms: string[];
    riskFactors: string[];
    recommendations: string[];
    whenToSeeDoctor: string;
  }>;
  riskFactors: string[];
  lifestyleFactors: string[];
  preventiveMeasures: string[];
  recommendedActions: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    timeframe: string;
  }>;
  emergencyWarning: boolean;
  disclaimer: string;
  followUpNeeded: boolean;
}

interface BodyRegion {
  id: string;
  name: string;
  symptoms: Symptom[];
  icon: React.ReactNode;
}

interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export default function AISymptomChecker() {
  const [activeTab, setActiveTab] = useState<'checker' | 'history' | 'education'>('checker');
  const [loading, setLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [expandedConditions, setExpandedConditions] = useState<Record<string, boolean>>({});
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [bodyRegions] = useState<BodyRegion[]>([
    {
      id: 'head',
      name: 'Head & Face',
      icon: <Head size={24} />,
      symptoms: [
        { id: 'headache', name: 'Headache', category: 'head', severity: 'moderate', duration: '', description: 'Pain in the head region', relatedConditions: ['Migraine', 'Tension headache', 'Sinusitis'] },
        { id: 'dizziness', name: 'Dizziness', category: 'head', severity: 'moderate', duration: '', description: 'Feeling lightheaded or unsteady', relatedConditions: ['Vertigo', 'Anemia', 'Dehydration'] },
        { id: 'vision_blur', name: 'Blurred Vision', category: 'head', severity: 'moderate', duration: '', description: 'Difficulty focusing or seeing clearly', relatedConditions: ['Refractive errors', 'Diabetes', 'Migraine'] }
      ]
    },
    {
      id: 'chest',
      name: 'Chest & Heart',
      icon: <Heart size={24} />,
      symptoms: [
        { id: 'chest_pain', name: 'Chest Pain', category: 'chest', severity: 'severe', duration: '', description: 'Pain or discomfort in the chest area', relatedConditions: ['Heart attack', 'Angina', 'Pleurisy'] },
        { id: 'palpitations', name: 'Heart Palpitations', category: 'chest', severity: 'moderate', duration: '', description: 'Racing or irregular heartbeat', relatedConditions: ['Anxiety', 'Arrhythmia', 'Hyperthyroidism'] },
        { id: 'shortness_breath', name: 'Shortness of Breath', category: 'chest', severity: 'severe', duration: '', description: 'Difficulty breathing or catching breath', relatedConditions: ['Asthma', 'Heart failure', 'Panic attack'] }
      ]
    },
    {
      id: 'abdomen',
      name: 'Abdomen',
      icon: <Activity size={24} />,
      symptoms: [
        { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'abdomen', severity: 'moderate', duration: '', description: 'Pain or discomfort in the stomach area', relatedConditions: ['Gastritis', 'Appendicitis', 'IBS'] },
        { id: 'nausea', name: 'Nausea', category: 'abdomen', severity: 'mild', duration: '', description: 'Feeling sick to your stomach', relatedConditions: ['Food poisoning', 'Pregnancy', 'Migraine'] },
        { id: 'bloating', name: 'Bloating', category: 'abdomen', severity: 'mild', duration: '', description: 'Feeling of fullness or swelling in the abdomen', relatedConditions: ['IBS', 'Gas', 'Food intolerance'] }
      ]
    },
    {
      id: 'skin',
      name: 'Skin',
      icon: <User size={24} />,
      symptoms: [
        { id: 'rash', name: 'Rash', category: 'skin', severity: 'mild', duration: '', description: 'Red, itchy, or painful skin patches', relatedConditions: ['Allergic reaction', 'Eczema', 'Psoriasis'] },
        { id: 'fever', name: 'Fever', category: 'skin', severity: 'moderate', duration: '', description: 'Elevated body temperature', relatedConditions: ['Infection', 'Inflammation', 'Heat exhaustion'] }
      ]
    }
  ]);

  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysis[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await api.get('/ai/symptom-checker/history');
      setAnalysisHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
    }
  };

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, { ...symptom, duration: '' }]);
    }
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const updateSymptomDuration = (symptomId: string, duration: string) => {
    setSelectedSymptoms(selectedSymptoms.map(s => 
      s.id === symptomId ? { ...s, duration } : s
    ));
  };

  const updateSymptomSeverity = (symptomId: string, severity: 'mild' | 'moderate' | 'severe') => {
    setSelectedSymptoms(selectedSymptoms.map(s => 
      s.id === symptomId ? { ...s, severity } : s
    ));
  };

  const runAIAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    try {
      const response = await api.post('/ai/symptom-checker/analyze', {
        symptoms: selectedSymptoms.map(s => ({
          id: s.id,
          name: s.name,
          severity: s.severity,
          duration: s.duration
        }))
      });

      setAnalysis(response.data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to analyze symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const toggleConditionExpansion = (conditionName: string) => {
    setExpandedConditions(prev => ({
      ...prev,
      [conditionName]: !prev[conditionName]
    }));
  };

  const saveAnalysis = async () => {
    if (!analysis) return;

    try {
      await api.post('/ai/symptom-checker/save', analysis);
      setAnalysisHistory([analysis, ...analysisHistory]);
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  };

  const bookAppointment = (conditionName: string) => {
    // Navigate to appointment booking with pre-filled condition
    window.location.href = `/appointments?condition=${encodeURIComponent(conditionName)}`;
  };

  const emergencyCall = () => {
    // Open emergency call interface
    window.location.href = '/emergency';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Symptom Checker</h1>
              <p className="text-slate-600 mt-1">Get intelligent health insights based on your symptoms</p>
            </div>
          </div>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <Info size={16} />
            Medical Disclaimer
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${
              currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </div>
          </div>
          <div className="text-sm text-slate-600">
            {currentStep === 1 && 'Select Symptoms'}
            {currentStep === 2 && 'Review & Analyze'}
            {currentStep === 3 && 'View Results'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          {/* Step 1: Select Symptoms */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Select Your Symptoms</h2>
                <p className="text-slate-600">Choose the body region affected and select your symptoms</p>
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">Selected Symptoms ({selectedSymptoms.length})</h3>
                  <div className="space-y-2">
                    {selectedSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{symptom.name}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(symptom.severity)}`}>
                              {symptom.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-slate-600">Duration:</label>
                              <select
                                value={symptom.duration}
                                onChange={(e) => updateSymptomDuration(symptom.id, e.target.value)}
                                className="text-sm px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select duration</option>
                                <option value="hours">A few hours</option>
                                <option value="day">1 day</option>
                                <option value="days">2-3 days</option>
                                <option value="week">1 week</option>
                                <option value="weeks">2-3 weeks</option>
                                <option value="month">1 month</option>
                                <option value="months">Several months</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-slate-600">Severity:</label>
                              <select
                                value={symptom.severity}
                                onChange={(e) => updateSymptomSeverity(symptom.id, e.target.value as any)}
                                className="text-sm px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSymptom(symptom.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Body Regions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bodyRegions.map((region) => (
                  <div key={region.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                        {region.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900">{region.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {region.symptoms.map((symptom) => (
                        <button
                          key={symptom.id}
                          onClick={() => addSymptom(symptom)}
                          disabled={selectedSymptoms.find(s => s.id === symptom.id) !== undefined}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedSymptoms.find(s => s.id === symptom.id)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{symptom.name}</p>
                              <p className="text-sm text-slate-600 mt-1">{symptom.description}</p>
                            </div>
                            <Plus size={16} className={selectedSymptoms.find(s => s.id === symptom.id) ? 'text-blue-600' : 'text-slate-400'} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedSymptoms.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Analysis
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review & Analyze */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Review Your Symptoms</h2>
                <p className="text-slate-600">Confirm your symptoms before running AI analysis</p>
              </div>

              <div className="space-y-4">
                {selectedSymptoms.map((symptom) => (
                  <div key={symptom.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{symptom.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{symptom.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(symptom.severity)}`}>
                            {symptom.severity}
                          </span>
                          {symptom.duration && (
                            <span className="text-slate-600">Duration: {symptom.duration}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-amber-900">Important Notice</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      This AI symptom checker is for informational purposes only and should not replace professional medical advice. 
                      If you're experiencing severe symptoms or emergency conditions, please seek immediate medical attention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={runAIAnalysis}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      Run AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && analysis && (
            <div className="space-y-6">
              {/* Risk Assessment */}
              <div className={`border rounded-lg p-6 ${
                analysis.riskAssessment.overall === 'critical' ? 'border-red-200 bg-red-50' :
                analysis.riskAssessment.overall === 'high' ? 'border-orange-200 bg-orange-50' :
                analysis.riskAssessment.overall === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    analysis.riskAssessment.overall === 'critical' ? 'bg-red-600 text-white' :
                    analysis.riskAssessment.overall === 'high' ? 'bg-orange-600 text-white' :
                    analysis.riskAssessment.overall === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {analysis.riskAssessment.overall === 'critical' && <AlertTriangle size={24} />}
                    {analysis.riskAssessment.overall === 'high' && <AlertCircle size={24} />}
                    {analysis.riskAssessment.overall === 'medium' && <AlertCircle size={24} />}
                    {analysis.riskAssessment.overall === 'low' && <CheckCircle size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Overall Risk</p>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getRiskColor(analysis.riskAssessment.overall)}`}>
                          {analysis.riskAssessment.overall.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Urgency Level</p>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(analysis.riskAssessment.urgency)}`}>
                          {analysis.riskAssessment.urgency.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Confidence</p>
                        <p className="text-lg font-semibold">{analysis.riskAssessment.confidence}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Warning */}
              {analysis.emergencyWarning && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">⚠️ Emergency Warning</h4>
                      <p className="text-red-700 text-sm mt-1">
                        Your symptoms may indicate a serious medical condition. Please seek immediate medical attention or call emergency services.
                      </p>
                      <button
                        onClick={emergencyCall}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Call Emergency Services
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Possible Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Possible Conditions</h3>
                <div className="space-y-3">
                  {analysis.possibleConditions.map((condition, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-slate-50"
                        onClick={() => toggleConditionExpansion(condition.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {expandedConditions[condition.name] ? 
                              <ChevronDown className="text-slate-400 mt-1" size={20} /> : 
                              <ChevronRight className="text-slate-400 mt-1" size={20} />
                            }
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-slate-900">{condition.name}</h4>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                  {condition.probability}% probability
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">{condition.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedConditions[condition.name] && (
                        <div className="border-t border-slate-200 p-4 bg-slate-50">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Related Symptoms</h5>
                              <div className="flex flex-wrap gap-2">
                                {condition.symptoms.map((symptom, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Risk Factors</h5>
                              <ul className="text-sm text-slate-600 space-y-1">
                                {condition.riskFactors.map((factor, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Recommendations</h5>
                              <ul className="text-sm text-slate-600 space-y-1">
                                {condition.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={14} />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">When to See a Doctor</h5>
                              <p className="text-sm text-slate-600">{condition.whenToSeeDoctor}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                              <button
                                onClick={() => bookAppointment(condition.name)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <Calendar size={16} />
                                Book Appointment
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                                <MessageSquare size={16} />
                                Ask a Doctor
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Actions</h3>
                <div className="space-y-2">
                  {analysis.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        action.priority === 'high' ? 'bg-red-100 text-red-600' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <Target size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{action.action}</p>
                        <p className="text-sm text-slate-600">Timeframe: {action.timeframe}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        action.priority === 'high' ? 'bg-red-100 text-red-800' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {action.priority} priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors & Prevention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Risk Factors Identified</h3>
                  <ul className="space-y-2">
                    {analysis.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="text-orange-500 mt-0.5" size={16} />
                        <span className="text-sm text-slate-600">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Preventive Measures</h3>
                  <ul className="space-y-2">
                    {analysis.preventiveMeasures.map((measure, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Shield className="text-green-500 mt-0.5" size={16} />
                        <span className="text-sm text-slate-600">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveAnalysis}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Download size={16} />
                    Save Results
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                    <Share2 size={16} />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                    <Printer size={16} />
                    Print
                  </button>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setSelectedSymptoms([]);
                    setAnalysis(null);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Medical Disclaimer</h2>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Important Medical Notice</h3>
                  <p className="text-slate-600 text-sm">
                    This AI symptom checker is designed for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">What This Tool Provides:</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Preliminary assessment based on reported symptoms</li>
                    <li>Possible conditions and their likelihood</li>
                    <li>General health recommendations</li>
                    <li>Guidance on when to seek medical attention</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-1">What This Tool Cannot Do:</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Provide a definitive medical diagnosis</li>
                    <li>Replace a physical examination by a healthcare professional</li>
                    <li>Treat medical emergencies or urgent conditions</li>
                    <li>Prescribe medications or treatments</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-1">When to Seek Immediate Medical Attention:</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Chest pain or pressure</li>
                    <li>Difficulty breathing</li>
                    <li>Severe bleeding</li>
                    <li>Loss of consciousness</li>
                    <li>Sudden severe headache</li>
                    <li>Signs of stroke (facial drooping, arm weakness, speech difficulty)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Always consult with a qualified healthcare professional for medical advice and treatment. 
                  In case of emergency, call your local emergency services immediately.
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
