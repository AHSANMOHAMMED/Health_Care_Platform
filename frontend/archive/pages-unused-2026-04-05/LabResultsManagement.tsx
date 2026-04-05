import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Download, 
  Upload, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  Heart, 
  Droplet, 
  Eye, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Printer, 
  Bell, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  X, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
  Zap, 
  Shield, 
  Clock, 
  User, 
  Stethoscope, 
  MessageSquare, 
  Star,
  RefreshCw,
  Filter as FilterIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testType: string;
  testName: string;
  testCode: string;
  category: 'blood' | 'urine' | 'imaging' | 'genetic' | 'pathology' | 'cardiac' | 'other';
  collectionDate: string;
  resultDate: string;
  status: 'pending' | 'completed' | 'reviewed' | 'abnormal' | 'critical';
  results: TestResult[];
  interpretation?: string;
  doctorNotes?: string;
  recommendations?: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  labName: string;
  labAddress: string;
  technicianName: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  normalRanges: Record<string, { min: number; max: number; unit: string }>;
  previousResults?: Array<{
    date: string;
    value: number;
    unit: string;
  }>;
}

interface TestResult {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'abnormal';
  flag?: string;
  trend?: 'improving' | 'worsening' | 'stable';
  changePercentage?: number;
  notes?: string;
}

interface LabTrend {
  testName: string;
  data: Array<{
    date: string;
    value: number;
    status: string;
  }>;
  normalRange: { min: number; max: number };
  unit: string;
  trend: 'improving' | 'worsening' | 'stable';
}

interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  category: string;
}

export default function LabResultsManagement() {
  const [activeTab, setActiveTab] = useState<'results' | 'trends' | 'analytics' | 'compare'>('results');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});

  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labTrends, setLabTrends] = useState<LabTrend[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      setLoading(true);
      const [resultsRes, trendsRes, metricsRes] = await Promise.all([
        api.get('/lab/results'),
        api.get('/lab/trends'),
        api.get('/lab/health-metrics')
      ]);

      setLabResults(resultsRes.data);
      setLabTrends(trendsRes.data);
      setHealthMetrics(metricsRes.data);
    } catch (error) {
      console.error('Failed to fetch lab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="text-green-500" size={16} />;
      case 'abnormal': return <AlertCircle className="text-yellow-500" size={16} />;
      case 'critical': return <AlertTriangle className="text-red-500" size={16} />;
      case 'pending': return <Clock className="text-slate-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      case 'reviewed': return <CheckCircle className="text-purple-500" size={16} />;
      default: return <Clock className="text-slate-500" size={16} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUp className="text-green-500" size={16} />;
      case 'worsening': return <ArrowDown className="text-red-500" size={16} />;
      case 'stable': return <Minus className="text-slate-500" size={16} />;
      default: return <Minus className="text-slate-500" size={16} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blood': return <Droplet className="text-red-500" size={20} />;
      case 'urine': return <Droplet className="text-yellow-500" size={20} />;
      case 'imaging': return <Eye className="text-blue-500" size={20} />;
      case 'genetic': return <Activity className="text-purple-500" size={20} />;
      case 'pathology': return <TestTube className="text-green-500" size={20} />;
      case 'cardiac': return <Heart className="text-red-500" size={20} />;
      default: return <TestTube className="text-slate-500" size={20} />;
    }
  };

  const toggleResultExpansion = (id: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const downloadResult = async (resultId: string) => {
    try {
      const response = await api.get(`/lab/results/${resultId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lab-results-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download result:', error);
    }
  };

  const shareResult = async (resultId: string, email: string) => {
    try {
      await api.post(`/lab/results/${resultId}/share`, { email });
    } catch (error) {
      console.error('Failed to share result:', error);
    }
  };

  const requestFollowUp = async (resultId: string) => {
    try {
      await api.post(`/lab/results/${resultId}/follow-up`);
    } catch (error) {
      console.error('Failed to request follow-up:', error);
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.labName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || result.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCriticalResults = () => {
    return labResults.filter(result => 
      result.status === 'critical' || 
      result.results.some(r => r.status === 'critical')
    );
  };

  const getAbnormalResults = () => {
    return labResults.filter(result => 
      result.status === 'abnormal' || 
      result.results.some(r => r.status === 'abnormal' || r.status === 'high' || r.status === 'low')
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading lab results..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lab Results Management</h1>
            <p className="text-slate-600 mt-1">View, track, and analyze your laboratory test results</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Upload size={16} />
              Upload Results
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={16} />
              Request Test
            </button>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {getCriticalResults().length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Critical Results Detected</h4>
              <p className="text-red-700 text-sm mt-1">
                You have {getCriticalResults().length} critical result(s) requiring immediate attention.
              </p>
            </div>
            <button className="text-red-600 hover:text-red-700">
              View Results
            </button>
          </div>
        </div>
      )}

      {getAbnormalResults().length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">Abnormal Results</h4>
              <p className="text-yellow-700 text-sm mt-1">
                You have {getAbnormalResults().length} abnormal result(s) that may need follow-up.
              </p>
            </div>
            <button className="text-yellow-600 hover:text-yellow-700">
              View Results
            </button>
          </div>
        </div>
      )}

      {/* Health Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {healthMetrics.slice(0, 4).map((metric) => (
          <div key={metric.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">{metric.name}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metric.value} {metric.unit}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.status === 'normal' ? 'text-green-600' :
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                metric.status === 'normal' ? 'bg-green-100' :
                metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {getCategoryIcon(metric.category)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'results', name: 'Lab Results', icon: TestTube },
              { id: 'trends', name: 'Trends', icon: LineChart },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'compare', name: 'Compare', icon: Target }
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
          {/* Lab Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search lab results..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="blood">Blood Tests</option>
                    <option value="urine">Urine Tests</option>
                    <option value="imaging">Imaging</option>
                    <option value="genetic">Genetic</option>
                    <option value="pathology">Pathology</option>
                    <option value="cardiac">Cardiac</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="critical">Critical</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <div key={result.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleResultExpansion(result.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {expandedResults[result.id] ? 
                            <ChevronDown className="text-slate-400 mt-1" size={20} /> : 
                            <ChevronRight className="text-slate-400 mt-1" size={20} />
                          }
                          {getCategoryIcon(result.category)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-900">{result.testName}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(result.status)}`}>
                                {result.status}
                              </span>
                              {result.followUpRequired && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border-orange-200">
                                  Follow-up Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{result.testType}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                              <span>Lab: {result.labName}</span>
                              <span>•</span>
                              <span>Collection: {new Date(result.collectionDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Results: {new Date(result.resultDate).toLocaleDateString()}</span>
                            </div>
                            {result.doctorName && (
                              <p className="text-sm text-slate-600 mt-1">
                                Ordered by: Dr. {result.doctorName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadResult(result.id);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Download size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResult(result);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedResults[result.id] && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-3">Test Results</h5>
                            <div className="space-y-2">
                              {result.results.map((testResult) => (
                                <div key={testResult.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-slate-900">{testResult.name}</p>
                                      {getStatusIcon(testResult.status)}
                                      {testResult.trend && getTrendIcon(testResult.trend)}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm">
                                      <span className="font-semibold text-slate-900">
                                        {testResult.value} {testResult.unit}
                                      </span>
                                      <span className="text-slate-600">
                                        Reference: {testResult.referenceRange}
                                      </span>
                                    </div>
                                    {testResult.notes && (
                                      <p className="text-sm text-slate-600 mt-1">{testResult.notes}</p>
                                    )}
                                  </div>
                                  {testResult.changePercentage && (
                                    <div className="text-right">
                                      <span className={`text-sm font-medium ${
                                        testResult.changePercentage > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {testResult.changePercentage > 0 ? '+' : ''}{testResult.changePercentage}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {result.interpretation && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Interpretation</h5>
                              <p className="text-sm text-slate-600">{result.interpretation}</p>
                            </div>
                          )}

                          {result.doctorNotes && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Doctor's Notes</h5>
                              <p className="text-sm text-slate-600">{result.doctorNotes}</p>
                            </div>
                          )}

                          {result.recommendations && result.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Recommendations</h5>
                              <ul className="text-sm text-slate-600 space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckSquare className="text-blue-500 mt-0.5" size={14} />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.attachments.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Attachments</h5>
                              <div className="space-y-2">
                                {result.attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                                    <div className="flex items-center gap-2">
                                      <FileText size={16} className="text-slate-400" />
                                      <span className="text-sm text-slate-700">{attachment.name}</span>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700">
                                      <Download size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.followUpRequired && (
                            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Bell className="text-orange-600" size={16} />
                                <span className="text-sm text-orange-800">
                                  Follow-up required {result.followUpDate ? `by ${new Date(result.followUpDate).toLocaleDateString()}` : ''}
                                </span>
                              </div>
                              <button
                                onClick={() => requestFollowUp(result.id)}
                                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                              >
                                Schedule Follow-up
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Health Trends</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {labTrends.map((trend) => (
                  <div key={trend.testName} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">{trend.testName}</h4>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm font-medium capitalize">{trend.trend}</span>
                      </div>
                    </div>
                    
                    <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
                      <LineChart className="text-slate-400" size={32} />
                      <p className="text-slate-500 ml-2">Trend Chart</p>
                    </div>
                    
                    <div className="text-sm text-slate-600">
                      <p>Normal Range: {trend.normalRange.min} - {trend.normalRange.max} {trend.unit}</p>
                      <p>Latest: {trend.data[trend.data.length - 1]?.value} {trend.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Health Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Test Categories</h4>
                  <div className="h-48 flex items-center justify-center">
                    <PieChart className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Distribution Chart</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Result Status</h4>
                  <div className="h-48 flex items-center justify-center">
                    <BarChart3 className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Status Chart</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Monthly Tests</h4>
                  <div className="h-48 flex items-center justify-center">
                    <Activity className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Activity Chart</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Key Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Overall Health Improving</p>
                      <p className="text-sm text-slate-600">Your key metrics show positive trends over the past 6 months</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Vitamin D Levels Low</p>
                      <p className="text-sm text-slate-600">Consider supplementation and increased sun exposure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Compare Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Test</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Complete Blood Count</option>
                    <option>Lipid Panel</option>
                    <option>Comprehensive Metabolic Panel</option>
                    <option>Thyroid Panel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Comparison Chart</h4>
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="text-slate-400" size={48} />
                  <p className="text-slate-500 ml-2">Comparison Chart</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
