import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  Shield, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Share2, 
  Lock, 
  Unlock, 
  Users, 
  Activity, 
  Heart, 
  Stethoscope, 
  Pill, 
  TestTube, 
  CreditCard, 
  Video, 
  MessageSquare, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  File,
  Folder,
  Database,
  Cloud,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Key,
  Fingerprint,
  AlertTriangle,
  Info,
  HelpCircle,
  Settings
} from 'lucide-react';
import { api } from '../api/axios';

interface ExportRequest {
  id: string;
  type: 'medical_records' | 'lab_results' | 'prescriptions' | 'appointments' | 'billing' | 'all';
  format: 'pdf' | 'json' | 'csv' | 'xml' | 'hl7';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
  size?: string;
  password?: string;
  sharedWith?: Array<{
    email: string;
    access: 'view' | 'download';
    expiresAt: string;
  }>;
}

interface DataCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  lastUpdated: string;
  size: string;
  encrypted: boolean;
}

interface SharedAccess {
  id: string;
  recipientEmail: string;
  recipientName: string;
  accessType: 'view' | 'download' | 'full';
  categories: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  expiresAt: string;
  createdAt: string;
  active: boolean;
  accessCode?: string;
}

interface AuditLog {
  id: string;
  action: 'export' | 'share' | 'access' | 'download' | 'delete';
  resource: string;
  timestamp: string;
  user: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export default function DataExportPortal() {
  const [activeTab, setActiveTab] = useState<'export' | 'shared' | 'audit' | 'settings'>('export');
  const [loading, setLoading] = useState(true);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([]);
  const [sharedAccess, setSharedAccess] = useState<SharedAccess[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const [newExport, setNewExport] = useState({
    type: 'all' as const,
    format: 'pdf' as const,
    dateRange: {
      startDate: '',
      endDate: ''
    },
    password: '',
    encrypt: true
  });

  const [newShare, setNewShare] = useState({
    recipientEmail: '',
    recipientName: '',
    accessType: 'view' as const,
    categories: [] as string[],
    dateRange: {
      startDate: '',
      endDate: ''
    },
    expiresAt: '',
    message: ''
  });

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const [requestsRes, categoriesRes, sharedRes, auditRes] = await Promise.all([
        api.get('/data-export/requests'),
        api.get('/data-export/categories'),
        api.get('/data-export/shared'),
        api.get('/data-export/audit')
      ]);

      setExportRequests(requestsRes.data);
      setDataCategories(categoriesRes.data);
      setSharedAccess(sharedRes.data);
      setAuditLogs(auditRes.data);
    } catch (error) {
      console.error('Failed to fetch portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createExportRequest = async () => {
    try {
      const response = await api.post('/data-export/export', newExport);
      setExportRequests([response.data, ...exportRequests]);
      setShowExportModal(false);
      setNewExport({
        type: 'all',
        format: 'pdf',
        dateRange: { startDate: '', endDate: '' },
        password: '',
        encrypt: true
      });
    } catch (error) {
      console.error('Failed to create export request:', error);
    }
  };

  const downloadExport = async (requestId: string) => {
    try {
      const request = exportRequests.find(r => r.id === requestId);
      if (request?.downloadUrl) {
        window.open(request.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to download export:', error);
    }
  };

  const deleteExport = async (requestId: string) => {
    try {
      await api.delete(`/data-export/requests/${requestId}`);
      setExportRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to delete export:', error);
    }
  };

  const shareData = async () => {
    try {
      const response = await api.post('/data-export/share', newShare);
      setSharedAccess([response.data, ...sharedAccess]);
      setShowShareModal(false);
      setNewShare({
        recipientEmail: '',
        recipientName: '',
        accessType: 'view',
        categories: [],
        dateRange: { startDate: '', endDate: '' },
        expiresAt: '',
        message: ''
      });
    } catch (error) {
      console.error('Failed to share data:', error);
    }
  };

  const revokeAccess = async (accessId: string) => {
    try {
      await api.delete(`/data-export/shared/${accessId}`);
      setSharedAccess(prev => prev.filter(s => s.id !== accessId));
    } catch (error) {
      console.error('Failed to revoke access:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'processing': return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'failed': return <AlertCircle className="text-red-500" size={16} />;
      case 'expired': return <AlertCircle className="text-slate-500" size={16} />;
      default: return <Clock className="text-slate-500" size={16} />;
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Data Export & Patient Portal</h1>
              <p className="text-slate-600 mt-1">Securely export and share your medical data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={16} />
              Export Data
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <Share2 size={16} />
              Share Data
            </button>
          </div>
        </div>
      </div>

      {/* Data Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{category.name}</h4>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
              </div>
              {category.encrypted && (
                <Lock className="text-green-500" size={16} />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">{category.count} items</span>
              <span className="text-slate-600">{category.size}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Updated: {new Date(category.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'export', name: 'Export History', icon: Download },
              { id: 'shared', name: 'Shared Access', icon: Users },
              { id: 'audit', name: 'Audit Log', icon: Shield },
              { id: 'settings', name: 'Settings', icon: Settings }
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
          {/* Export History Tab */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Export History</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <RefreshCw 
                    size={16} 
                    className="cursor-pointer hover:text-slate-800"
                    onClick={fetchPortalData}
                  />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                {exportRequests.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(request.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900 capitalize">
                                {request.type.replace('_', ' ')} Export
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                              {request.password && (
                                <Lock className="text-green-500" size={16} />
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                              <div>
                                <span className="font-medium">Format:</span> {request.format.toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium">Date Range:</span> {new Date(request.dateRange.startDate).toLocaleDateString()} - {new Date(request.dateRange.endDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleString()}
                              </div>
                            </div>

                            {request.size && (
                              <div className="mt-2 text-sm text-slate-600">
                                <span className="font-medium">Size:</span> {formatFileSize(request.size)}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedRequest === request.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedRequest === request.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          {request.expiresAt && (
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                              <AlertTriangle size={16} />
                              <span>Expires on {new Date(request.expiresAt).toLocaleString()}</span>
                            </div>
                          )}

                          {request.sharedWith && request.sharedWith.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Shared With</h5>
                              <div className="space-y-1">
                                {request.sharedWith.map((share, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{share.email}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                        {share.access}
                                      </span>
                                      <span className="text-slate-500">
                                        Expires: {new Date(share.expiresAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            {request.status === 'completed' && request.downloadUrl && (
                              <button
                                onClick={() => downloadExport(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <Download size={16} />
                                Download
                              </button>
                            )}
                            {request.status === 'failed' && (
                              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <RefreshCw size={16} />
                                Retry
                              </button>
                            )}
                            <button
                              onClick={() => deleteExport(request.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                            >
                              <Trash2 size={16} />
                              Delete
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

          {/* Shared Access Tab */}
          {activeTab === 'shared' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Shared Access</h3>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Share Data
                </button>
              </div>

              <div className="space-y-3">
                {sharedAccess.map((access) => (
                  <div key={access.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{access.recipientName}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              access.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {access.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">{access.recipientEmail}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Access Type:</span> {access.accessType}
                            </div>
                            <div>
                              <span className="font-medium">Expires:</span> {new Date(access.expiresAt).toLocaleDateString()}
                            </div>
                          </div>

                          {access.categories.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-slate-700">Categories: </span>
                              <span className="text-sm text-slate-600">
                                {access.categories.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {access.active && (
                          <button
                            onClick={() => revokeAccess(access.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Lock size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Audit Log</h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                    <Download size={16} />
                    Export Log
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.success ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {log.success ? 
                          <CheckCircle size={16} className="text-green-600" /> : 
                          <AlertCircle size={16} className="text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{log.action}</p>
                        <p className="text-sm text-slate-600">{log.resource}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{log.user}</p>
                      <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Export Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="text-slate-600" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Default Encryption</p>
                      <p className="text-sm text-slate-600">Encrypt all exports by default</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="text-slate-600" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Auto-Expire Exports</p>
                      <p className="text-sm text-slate-600">Automatically expire exports after 7 days</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="text-slate-600" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Require 2FA for data exports</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"></span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Export Data</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data Type</label>
                <select
                  value={newExport.type}
                  onChange={(e) => setNewExport({...newExport, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Data</option>
                  <option value="medical_records">Medical Records</option>
                  <option value="lab_results">Lab Results</option>
                  <option value="prescriptions">Prescriptions</option>
                  <option value="appointments">Appointments</option>
                  <option value="billing">Billing Records</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                <select
                  value={newExport.format}
                  onChange={(e) => setNewExport({...newExport, format: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="hl7">HL7</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newExport.dateRange.startDate}
                    onChange={(e) => setNewExport({
                      ...newExport, 
                      dateRange: {...newExport.dateRange, startDate: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newExport.dateRange.endDate}
                    onChange={(e) => setNewExport({
                      ...newExport, 
                      dateRange: {...newExport.dateRange, endDate: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password (Optional)</label>
                <input
                  type="password"
                  value={newExport.password}
                  onChange={(e) => setNewExport({...newExport, password: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Protect your export with a password"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newExport.encrypt}
                  onChange={(e) => setNewExport({...newExport, encrypt: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-700">Encrypt export file</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createExportRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Share Data</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={newShare.recipientEmail}
                  onChange={(e) => setNewShare({...newShare, recipientEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={newShare.recipientName}
                  onChange={(e) => setNewShare({...newShare, recipientName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recipient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Access Type</label>
                <select
                  value={newShare.accessType}
                  onChange={(e) => setNewShare({...newShare, accessType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="view">View Only</option>
                  <option value="download">Download Allowed</option>
                  <option value="full">Full Access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expires On</label>
                <input
                  type="date"
                  value={newShare.expiresAt}
                  onChange={(e) => setNewShare({...newShare, expiresAt: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={shareData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Share Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
