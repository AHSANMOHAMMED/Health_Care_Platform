import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Calendar, 
  User, 
  Heart, 
  Activity,
  Pill,
  TestTube,
  Eye,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Camera,
  Share2,
  Printer,
  FileDown,
  Shield,
  Users,
  ChevronDown,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

interface MedicalRecord {
  id: string;
  type: 'visit' | 'lab' | 'prescription' | 'imaging' | 'vaccination' | 'allergy' | 'condition';
  date: string;
  doctor: string;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  status: 'active' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface VitalSigns {
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  oxygenSaturation: number;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  active: boolean;
  refillsRemaining: number;
}

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  type: 'food' | 'medication' | 'environmental' | 'other';
}

interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  lab: string;
  notes?: string;
}

export default function ElectronicHealthRecords() {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'vitals' | 'medications' | 'allergies' | 'labs'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const [profileRes, recordsRes, vitalsRes, medsRes, allergiesRes, labsRes] = await Promise.all([
        api.get('/patient/profile'),
        api.get('/patient/medical-records'),
        api.get('/patient/vital-signs'),
        api.get('/patient/medications'),
        api.get('/patient/allergies'),
        api.get('/patient/lab-results')
      ]);

      setPatientProfile(profileRes.data);
      setMedicalRecords(recordsRes.data);
      setVitalSigns(vitalsRes.data);
      setMedications(medsRes.data);
      setAllergies(allergiesRes.data);
      setLabResults(labsRes.data);
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Stethoscope className="text-blue-500" size={20} />;
      case 'lab': return <TestTube className="text-purple-500" size={20} />;
      case 'prescription': return <Pill className="text-green-500" size={20} />;
      case 'imaging': return <Eye className="text-orange-500" size={20} />;
      case 'vaccination': return <Shield className="text-cyan-500" size={20} />;
      case 'allergy': return <AlertCircle className="text-red-500" size={20} />;
      case 'condition': return <Heart className="text-pink-500" size={20} />;
      default: return <FileText className="text-slate-500" size={20} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="text-blue-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'pending': return <AlertCircle className="text-yellow-500" size={16} />;
      default: return null;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const exportMedicalRecords = async () => {
    try {
      const response = await api.get('/patient/export-records', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical-records-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export records:', error);
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading medical records..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Electronic Health Records</h1>
            <p className="text-slate-600 mt-1">Comprehensive medical history and health information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportMedicalRecords}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={16} />
              Export Records
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Patient Overview Card */}
      {patientProfile && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {patientProfile.firstName} {patientProfile.lastName}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span>Age: {calculateAge(patientProfile.dateOfBirth)} years</span>
                  <span>•</span>
                  <span>{patientProfile.gender}</span>
                  <span>•</span>
                  <span>Blood Type: {patientProfile.bloodType || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    {patientProfile.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    {patientProfile.email}
                  </div>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Edit size={20} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <MapPin className="text-slate-500" size={20} />
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm font-medium text-slate-700">{patientProfile.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Users className="text-slate-500" size={20} />
              <div>
                <p className="text-xs text-slate-500">Emergency Contact</p>
                <p className="text-sm font-medium text-slate-700">
                  {patientProfile.emergencyContact.name} ({patientProfile.emergencyContact.relation})
                </p>
                <p className="text-xs text-slate-600">{patientProfile.emergencyContact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Shield className="text-slate-500" size={20} />
              <div>
                <p className="text-xs text-slate-500">Insurance</p>
                <p className="text-sm font-medium text-slate-700">{patientProfile.insurance.provider}</p>
                <p className="text-xs text-slate-600">Policy: {patientProfile.insurance.policyNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'records', name: 'Medical Records', icon: FileText },
              { id: 'vitals', name: 'Vital Signs', icon: Activity },
              { id: 'medications', name: 'Medications', icon: Pill },
              { id: 'allergies', name: 'Allergies', icon: AlertCircle },
              { id: 'labs', name: 'Lab Results', icon: TestTube }
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Records</p>
                      <p className="text-2xl font-bold text-blue-900">{medicalRecords.length}</p>
                    </div>
                    <FileText className="text-blue-500" size={24} />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Active Medications</p>
                      <p className="text-2xl font-bold text-green-900">
                        {medications.filter(m => m.active).length}
                      </p>
                    </div>
                    <Pill className="text-green-500" size={24} />
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Allergies</p>
                      <p className="text-2xl font-bold text-red-900">{allergies.length}</p>
                    </div>
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Recent Lab Results</p>
                      <p className="text-2xl font-bold text-purple-900">{labResults.length}</p>
                    </div>
                    <TestTube className="text-purple-500" size={24} />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Medical Activity</h3>
                <div className="space-y-3">
                  {medicalRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      {getRecordIcon(record.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{record.title}</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(record.priority)}`}>
                            {record.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{record.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {record.doctor} • {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusIcon(record.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="visit">Visits</option>
                    <option value="lab">Lab Results</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="imaging">Imaging</option>
                    <option value="vaccination">Vaccinations</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Record
                </button>
              </div>

              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {getRecordIcon(record.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">{record.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{record.description}</p>
                            {record.diagnosis && (
                              <p className="text-sm text-slate-700 mt-2">
                                <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                              </p>
                            )}
                            {record.treatment && (
                              <p className="text-sm text-slate-700 mt-1">
                                <span className="font-medium">Treatment:</span> {record.treatment}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(record.priority)}`}>
                              {record.priority}
                            </span>
                            {getStatusIcon(record.status)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-slate-500">
                            {record.doctor} • {new Date(record.date).toLocaleDateString()}
                          </p>
                          {record.attachments && record.attachments.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                {record.attachments.length} attachment(s)
                              </span>
                              <button className="text-blue-600 hover:text-blue-700">
                                <Eye size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vital Signs Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Vital Signs History</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Vitals
                </button>
              </div>

              {vitalSigns.length > 0 ? (
                <div className="space-y-4">
                  {vitalSigns.map((vital, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">
                          {new Date(vital.date).toLocaleDateString()}
                        </h4>
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Blood Pressure</p>
                          <p className="text-lg font-semibold text-slate-900">
                            {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                          </p>
                          <p className="text-xs text-slate-500">mmHg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Heart Rate</p>
                          <p className="text-lg font-semibold text-slate-900">{vital.heartRate}</p>
                          <p className="text-xs text-slate-500">bpm</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Temperature</p>
                          <p className="text-lg font-semibold text-slate-900">{vital.temperature}°F</p>
                          <p className="text-xs text-slate-500">Fahrenheit</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Weight</p>
                          <p className="text-lg font-semibold text-slate-900">{vital.weight}</p>
                          <p className="text-xs text-slate-500">lbs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Height</p>
                          <p className="text-lg font-semibold text-slate-900">{vital.height}</p>
                          <p className="text-xs text-slate-500">inches</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">O₂ Saturation</p>
                          <p className="text-lg font-semibold text-slate-900">{vital.oxygenSaturation}%</p>
                          <p className="text-xs text-slate-500">SpO2</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto text-slate-400 mb-4" size={48} />
                  <p className="text-slate-600">No vital signs recorded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Current Medications</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Medication
                </button>
              </div>

              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{medication.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            medication.active 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {medication.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{medication.dosage} • {medication.frequency}</p>
                        <p className="text-sm text-slate-600">{medication.instructions}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Prescribed by: {medication.prescribedBy}</span>
                          <span>•</span>
                          <span>Started: {new Date(medication.startDate).toLocaleDateString()}</span>
                          {medication.endDate && (
                            <>
                              <span>•</span>
                              <span>Ends: {new Date(medication.endDate).toLocaleDateString()}</span>
                            </>
                          )}
                          {medication.active && (
                            <>
                              <span>•</span>
                              <span>Refills: {medication.refillsRemaining}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergies Tab */}
          {activeTab === 'allergies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Known Allergies</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Allergy
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergies.map((allergy) => (
                  <div key={allergy.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{allergy.allergen}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            allergy.severity === 'severe' ? 'bg-red-100 text-red-800 border-red-200' :
                            allergy.severity === 'moderate' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {allergy.severity}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 border-slate-200">
                            {allergy.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">Reaction: {allergy.reaction}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === 'labs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Lab Results</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Results
                </button>
              </div>

              <div className="space-y-4">
                {labResults.map((result) => (
                  <div key={result.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{result.testName}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            result.status === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                            result.status === 'abnormal' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-medium text-slate-900">{result.value} {result.unit}</span>
                          <span className="text-slate-600">Reference: {result.referenceRange}</span>
                        </div>
                        {result.notes && (
                          <p className="text-sm text-slate-600 mt-2">{result.notes}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>{result.lab}</span>
                          <span>•</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
