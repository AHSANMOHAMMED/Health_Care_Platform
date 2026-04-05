import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Download, 
  Share2, 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  Settings, 
  Info,
  Award,
  BookOpen,
  Stethoscope,
  Pill,
  Thermometer,
  Droplet,
  Weight,
  Activity as ActivityIcon,
  Moon,
  Sun,
  Smartphone,
  Watch,
  Battery,
  Signal,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Video
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  change: number;
  changePeriod: string;
  category: 'vital' | 'lab' | 'lifestyle' | 'medication';
  lastUpdated: string;
  targetValue?: number;
  normalRange: { min: number; max: number };
}

interface HealthPrediction {
  id: string;
  type: 'risk' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  data: any;
}

interface HealthScore {
  overall: number;
  categories: {
    physical: number;
    mental: number;
    lifestyle: number;
    medical: number;
  };
  trends: {
    physical: 'improving' | 'stable' | 'declining';
    mental: 'improving' | 'stable' | 'declining';
    lifestyle: 'improving' | 'stable' | 'declining';
    medical: 'improving' | 'stable' | 'declining';
  };
  factors: Array<{
    name: string;
    impact: number;
    trend: 'positive' | 'negative' | 'neutral';
  }>;
}

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on_track' | 'behind' | 'completed' | 'paused';
  progress: number;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  status: 'upcoming' | 'completed' | 'missed';
  doctor: string;
  purpose: string;
}

interface MedicationAdherence {
  medication: string;
  adherenceRate: number;
  missedDoses: number;
  totalDoses: number;
  trend: 'improving' | 'stable' | 'declining';
}

export default function HealthAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'predictions' | 'goals' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthPredictions, setHealthPredictions] = useState<HealthPrediction[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoal[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [medicationAdherence, setMedicationAdherence] = useState<MedicationAdherence[]>([]);

  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        metricsRes, 
        predictionsRes, 
        scoreRes, 
        goalsRes, 
        appointmentsRes, 
        adherenceRes
      ] = await Promise.all([
        api.get(`/analytics/metrics?range=${timeRange}`),
        api.get(`/analytics/predictions?range=${timeRange}`),
        api.get('/analytics/health-score'),
        api.get('/analytics/wellness-goals'),
        api.get('/analytics/upcoming-appointments'),
        api.get('/analytics/medication-adherence')
      ]);

      setHealthMetrics(metricsRes.data);
      setHealthPredictions(predictionsRes.data);
      setHealthScore(scoreRes.data);
      setWellnessGoals(goalsRes.data);
      setUpcomingAppointments(appointmentsRes.data);
      setMedicationAdherence(adherenceRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="text-green-500" size={16} />;
      case 'declining': return <TrendingDown className="text-red-500" size={16} />;
      case 'stable': return <Activity className="text-slate-500" size={16} />;
      default: return <Activity className="text-slate-500" size={16} />;
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="text-red-500" size={20} />;
      case 'trend': return <TrendingUp className="text-blue-500" size={20} />;
      case 'recommendation': return <Target className="text-green-500" size={20} />;
      case 'alert': return <Shield className="text-orange-500" size={20} />;
      default: return <Info className="text-slate-500" size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vital': return <Heart size={20} className="text-red-500" />;
      case 'lab': return <Activity size={20} className="text-blue-500" />;
      case 'lifestyle': return <ActivityIcon size={20} className="text-green-500" />;
      case 'medication': return <Pill size={20} className="text-purple-500" />;
      default: return <Activity size={20} className="text-slate-500" />;
    }
  };

  const filteredMetrics = healthMetrics.filter(metric => 
    selectedCategory === 'all' || metric.category === selectedCategory
  );

  const togglePredictionExpansion = (id: string) => {
    setExpandedPrediction(expandedPrediction === id ? null : id);
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const response = await api.get(`/analytics/export?format=${format}&range=${timeRange}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health-analytics-${timeRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading health analytics..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health Analytics</h1>
            <p className="text-slate-600 mt-1">Comprehensive insights and predictive health analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      {healthScore && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Overall Health Score</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Updated: {new Date().toLocaleDateString()}</span>
              <button className="text-slate-400 hover:text-slate-600">
                <Info size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-slate-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (healthScore.overall / 100) * 50}% 0%, ${50 + (healthScore.overall / 100) * 50}% 100%, 50% 100%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{healthScore.overall}</p>
                    <p className="text-xs text-slate-600">Score</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(healthScore.categories).map(([category, score]) => (
                <div key={category} className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      score >= 80 ? 'bg-green-100' :
                      score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        score >= 80 ? 'text-green-800' :
                        score >= 60 ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {score}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 capitalize">{category}</p>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(healthScore.trends[category as keyof typeof healthScore.trends])}
                      <span className="text-xs text-slate-600 capitalize">
                        {healthScore.trends[category as keyof typeof healthScore.trends]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Key Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {healthScore.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      factor.trend === 'positive' ? 'text-green-600' :
                      factor.trend === 'negative' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </span>
                    {factor.trend === 'positive' && <TrendingUp className="text-green-500" size={14} />}
                    {factor.trend === 'negative' && <TrendingDown className="text-red-500" size={14} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'metrics', name: 'Health Metrics', icon: Activity },
              { id: 'predictions', name: 'AI Predictions', icon: Brain },
              { id: 'goals', name: 'Wellness Goals', icon: Target },
              { id: 'reports', name: 'Reports', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Health Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Health Metrics</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="vital">Vital Signs</option>
                    <option value="lab">Lab Results</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="medication">Medication</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMetrics.map((metric) => (
                  <div key={metric.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(metric.category)}
                        <div>
                          <h4 className="font-medium text-slate-900">{metric.name}</h4>
                          <p className="text-sm text-slate-600">
                            {metric.value} {metric.unit}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Normal Range:</span>
                        <span className="text-slate-900">
                          {metric.normalRange.min} - {metric.normalRange.max} {metric.unit}
                        </span>
                      </div>
                      
                      {metric.targetValue && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Target:</span>
                          <span className="text-slate-900">
                            {metric.targetValue} {metric.unit}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Change:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`font-medium ${
                            metric.change > 0 ? 'text-green-600' : 
                            metric.change < 0 ? 'text-red-600' : 'text-slate-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Vital Signs Trend</h4>
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded">
                    <LineChart className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Trend Chart</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Health Metrics Distribution</h4>
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded">
                    <PieChart className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Distribution Chart</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">AI-Powered Health Predictions</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Brain size={16} />
                  <span>Powered by advanced machine learning</span>
                </div>
              </div>

              <div className="space-y-4">
                {healthPredictions.map((prediction) => (
                  <div key={prediction.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => togglePredictionExpansion(prediction.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getPredictionIcon(prediction.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900">{prediction.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(prediction.severity)}`}>
                                {prediction.severity}
                              </span>
                              {prediction.actionable && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                  Actionable
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{prediction.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Target size={14} />
                                <span>Confidence: {prediction.confidence}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Timeframe: {prediction.timeframe}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedPrediction === prediction.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedPrediction === prediction.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          {prediction.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Recommendations</h5>
                              <ul className="space-y-2">
                                {prediction.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                                    <span className="text-sm text-slate-600">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              Take Action
                            </button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              Schedule Consultation
                            </button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wellness Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Wellness Goals</h3>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wellnessGoals.map((goal) => (
                  <div key={goal.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900">{goal.title}</h4>
                        <p className="text-sm text-slate-600">{goal.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'on_track' ? 'bg-blue-100 text-blue-800' :
                        goal.status === 'behind' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progress:</span>
                        <span className="font-medium text-slate-900">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                        <span>{goal.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Appointments */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Upcoming Appointments</h4>
                <div className="space-y-2">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{appointment.type}</p>
                          <p className="text-sm text-slate-600">
                            {appointment.doctor} • {new Date(appointment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication Adherence */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Medication Adherence</h4>
                <div className="space-y-2">
                  {medicationAdherence.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Pill size={16} className="text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{med.medication}</p>
                          <p className="text-sm text-slate-600">
                            {med.missedDoses} missed out of {med.totalDoses} doses
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          med.adherenceRate >= 90 ? 'bg-green-100 text-green-800' :
                          med.adherenceRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {med.adherenceRate}% adherence
                        </span>
                        {getTrendIcon(med.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Health Reports</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportReport('pdf')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Download size={16} />
                    PDF
                  </button>
                  <button
                    onClick={() => exportReport('excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Download size={16} />
                    Excel
                  </button>
                  <button
                    onClick={() => exportReport('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Download size={16} />
                    CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Summary Report</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-sm text-slate-700">Overall Health Score</span>
                      <span className="font-medium text-slate-900">{healthScore?.overall || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-sm text-slate-700">Completed Goals</span>
                      <span className="font-medium text-slate-900">
                        {wellnessGoals.filter(g => g.status === 'completed').length}/{wellnessGoals.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-sm text-slate-700">Average Medication Adherence</span>
                      <span className="font-medium text-slate-900">
                        {medicationAdherence.length > 0 
                          ? Math.round(medicationAdherence.reduce((sum, med) => sum + med.adherenceRate, 0) / medicationAdherence.length)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      <FileText size={16} />
                      <span>Generate Full Health Report</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                      <Share2 size={16} />
                      <span>Share with Healthcare Provider</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                      <Calendar size={16} />
                      <span>Schedule Health Review</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Detailed Analytics</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-3">Health Trends</h5>
                    <div className="h-48 flex items-center justify-center bg-slate-50 rounded">
                      <LineChart className="text-slate-400" size={32} />
                      <p className="text-slate-500 ml-2">Trend Analysis</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-3">Risk Assessment</h5>
                    <div className="h-48 flex items-center justify-center bg-slate-50 rounded">
                      <BarChart3 className="text-slate-400" size={32} />
                      <p className="text-slate-500 ml-2">Risk Analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
