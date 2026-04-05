import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Edit,
  Trash2,
  Download,
  Send,
  Pharmacy,
  User,
  FileText,
  Barcode,
  Printer,
  Share2,
  Bell,
  TrendingUp,
  Activity,
  Heart,
  Shield,
  Info,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Package,
  Truck,
  MapPin,
  Phone,
  Star,
  MessageSquare
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medications: MedicationItem[];
  diagnosis: string;
  instructions: string;
  prescribedDate: string;
  validUntil: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  refills: number;
  refillsUsed: number;
  pharmacy?: PharmacyInfo;
  notes?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface MedicationItem {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
  instructions: string;
  prn: boolean; // as needed
  controlled: boolean;
  ndc?: string; // National Drug Code
}

interface PharmacyInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  hours: string;
  rating: number;
  distance?: string;
  deliveryAvailable: boolean;
  twentyFourHour: boolean;
}

interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  recommendation: string;
}

interface AlternativeMedication {
  name: string;
  genericName: string;
  strength: string;
  form: string;
  price: number;
  insuranceCoverage: number;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
}

export default function PrescriptionManagement() {
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'medications' | 'pharmacy' | 'interactions'>('prescriptions');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState<Record<string, boolean>>({});

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyInfo[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativeMedication[]>([]);

  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medications: [],
    diagnosis: '',
    instructions: '',
    refills: 0,
    validUntil: ''
  });

  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyInfo | null>(null);

  useEffect(() => {
    fetchPrescriptionData();
  }, []);

  const fetchPrescriptionData = async () => {
    try {
      setLoading(true);
      const [prescriptionsRes, medicationsRes, pharmaciesRes] = await Promise.all([
        api.get('/prescriptions'),
        api.get('/medications/catalog'),
        api.get('/pharmacies/nearby')
      ]);

      setPrescriptions(prescriptionsRes.data);
      setMedications(medicationsRes.data);
      setPharmacies(pharmaciesRes.data);
    } catch (error) {
      console.error('Failed to fetch prescription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePrescription = (id: string) => {
    setExpandedPrescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      case 'expired': return <XCircle className="text-red-500" size={16} />;
      case 'cancelled': return <XCircle className="text-slate-500" size={16} />;
      default: return <Clock className="text-slate-500" size={16} />;
    }
  };

  const addMedicationToPrescription = (medication: MedicationItem) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: [...(prev.medications || []), medication]
    }));
  };

  const removeMedicationFromPrescription = (index: number) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications?.filter((_, i) => i !== index) || []
    }));
  };

  const checkDrugInteractions = async (medications: MedicationItem[]) => {
    try {
      const response = await api.post('/prescriptions/check-interactions', {
        medications: medications.map(m => m.name)
      });
      setInteractions(response.data);
    } catch (error) {
      console.error('Failed to check interactions:', error);
    }
  };

  const findAlternatives = async (medicationName: string) => {
    try {
      const response = await api.get(`/medications/alternatives/${medicationName}`);
      setAlternatives(response.data);
    } catch (error) {
      console.error('Failed to find alternatives:', error);
    }
  };

  const sendToPharmacy = async (prescriptionId: string, pharmacyId: string) => {
    try {
      await api.post(`/prescriptions/${prescriptionId}/send`, { pharmacyId });
      // Update prescription status
      setPrescriptions(prev => prev.map(p => 
        p.id === prescriptionId 
          ? { ...p, status: 'active' as const }
          : p
      ));
    } catch (error) {
      console.error('Failed to send prescription:', error);
    }
  };

  const requestRefill = async (prescriptionId: string) => {
    try {
      await api.post(`/prescriptions/${prescriptionId}/refill`);
      // Update prescription
      setPrescriptions(prev => prev.map(p => 
        p.id === prescriptionId 
          ? { ...p, refillsUsed: p.refillsUsed + 1 }
          : p
      ));
    } catch (error) {
      console.error('Failed to request refill:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading prescription data..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prescription Management</h1>
            <p className="text-slate-600 mt-1">E-prescribe and manage medications</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewPrescription(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              New Prescription
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
              { id: 'medications', name: 'Medication Catalog', icon: Pill },
              { id: 'pharmacy', name: 'Pharmacies', icon: Pharmacy },
              { id: 'interactions', name: 'Drug Interactions', icon: Shield }
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
          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search prescriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => togglePrescription(prescription.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {expandedPrescriptions[prescription.id] ? 
                            <ChevronDown className="text-slate-400 mt-1" size={20} /> : 
                            <ChevronRight className="text-slate-400 mt-1" size={20} />
                          }
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-900">
                                Prescription #{prescription.id.slice(-8)}
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(prescription.status)}`}>
                                {prescription.status}
                              </span>
                              {prescription.refills > prescription.refillsUsed && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                  {prescription.refills - prescription.refillsUsed} refills left
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              Patient: {prescription.patientName} • Doctor: {prescription.doctorName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {prescription.medications.length} medication(s) • 
                              Prescribed: {new Date(prescription.prescribedDate).toLocaleDateString()} • 
                              Valid until: {new Date(prescription.validUntil).toLocaleDateString()}
                            </p>
                            {prescription.pharmacy && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                <Pharmacy size={16} />
                                {prescription.pharmacy.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(prescription.status)}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle actions
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedPrescriptions[prescription.id] && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Medications</h5>
                            <div className="space-y-2">
                              {prescription.medications.map((medication, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-slate-200">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-slate-900">{medication.name}</p>
                                      {medication.genericName && (
                                        <p className="text-sm text-slate-600">Generic: {medication.genericName}</p>
                                      )}
                                      <p className="text-sm text-slate-600">
                                        {medication.dosage} • {medication.frequency} • {medication.duration}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        Route: {medication.route} • Quantity: {medication.quantity}
                                      </p>
                                      {medication.instructions && (
                                        <p className="text-sm text-slate-600 mt-1">Instructions: {medication.instructions}</p>
                                      )}
                                      <div className="flex items-center gap-2 mt-2">
                                        {medication.controlled && (
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border-red-200">
                                            Controlled Substance
                                          </span>
                                        )}
                                        {medication.prn && (
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border-yellow-200">
                                            As Needed
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                      <Eye size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Diagnosis & Instructions</h5>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              <span className="font-medium">Instructions:</span> {prescription.instructions}
                            </p>
                            {prescription.notes && (
                              <p className="text-sm text-slate-600 mt-1">
                                <span className="font-medium">Notes:</span> {prescription.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 pt-3">
                            {prescription.status === 'active' && prescription.refills > prescription.refillsUsed && (
                              <button
                                onClick={() => requestRefill(prescription.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <RefreshCw size={16} />
                                Request Refill
                              </button>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              <Download size={16} />
                              Download PDF
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
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medication Catalog Tab */}
          {activeTab === 'medications' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search medications..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <Filter size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{medication.name}</h4>
                        {medication.genericName && (
                          <p className="text-sm text-slate-600">Generic: {medication.genericName}</p>
                        )}
                        <p className="text-sm text-slate-600 mt-1">
                          {medication.dosage} • {medication.route}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {medication.controlled && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border-red-200">
                              Controlled
                            </span>
                          )}
                          {medication.ndc && (
                            <span className="text-xs text-slate-500">NDC: {medication.ndc}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => findAlternatives(medication.name)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {alternatives.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Alternative Medications</h4>
                  <div className="space-y-2">
                    {alternatives.map((alt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{alt.name}</p>
                          <p className="text-sm text-slate-600">{alt.strength} • {alt.form}</p>
                          <p className="text-sm text-slate-600">
                            Price: ${alt.price} • Insurance: {alt.insuranceCoverage}% covered
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alt.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                            alt.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {alt.availability.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pharmacies Tab */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search pharmacies..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <MapPin size={16} />
                  Use My Location
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{pharmacy.name}</h4>
                          {pharmacy.twentyFourHour && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border-green-200">
                              24/7
                            </span>
                          )}
                          {pharmacy.deliveryAvailable && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                              Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{pharmacy.address}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {pharmacy.phone}
                          </div>
                          {pharmacy.distance && (
                            <span>{pharmacy.distance} away</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < Math.floor(pharmacy.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'} 
                              />
                            ))}
                            <span className="text-sm text-slate-600">({pharmacy.rating})</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Hours: {pharmacy.hours}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedPharmacy(pharmacy)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drug Interactions Tab */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-yellow-900">Drug Interaction Checker</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Check for potential interactions between medications before prescribing.
                    </p>
                  </div>
                </div>
              </div>

              {interactions.length > 0 ? (
                <div className="space-y-3">
                  {interactions.map((interaction, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      interaction.severity === 'contraindicated' ? 'border-red-200 bg-red-50' :
                      interaction.severity === 'major' ? 'border-orange-200 bg-orange-50' :
                      interaction.severity === 'moderate' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Shield className={`mt-0.5 ${
                          interaction.severity === 'contraindicated' ? 'text-red-600' :
                          interaction.severity === 'major' ? 'text-orange-600' :
                          interaction.severity === 'moderate' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} size={20} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-slate-900">
                              {interaction.medication1} + {interaction.medication2}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              interaction.severity === 'contraindicated' ? 'bg-red-100 text-red-800 border-red-200' :
                              interaction.severity === 'major' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              interaction.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-blue-100 text-blue-800 border-blue-200'
                            }`}>
                              {interaction.severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{interaction.description}</p>
                          <p className="text-sm font-medium text-slate-900">Recommendation:</p>
                          <p className="text-sm text-slate-600">{interaction.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="mx-auto text-slate-400 mb-4" size={48} />
                  <p className="text-slate-600">No interactions to display</p>
                  <p className="text-sm text-slate-500 mt-1">Add medications to check for interactions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Prescription Modal */}
      {showNewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">New Prescription</h2>
                <button
                  onClick={() => setShowNewPrescription(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis</label>
                  <input
                    type="text"
                    value={newPrescription.diagnosis}
                    onChange={(e) => setNewPrescription({...newPrescription, diagnosis: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={newPrescription.validUntil}
                    onChange={(e) => setNewPrescription({...newPrescription, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
                <textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Medications</label>
                <div className="space-y-2">
                  {newPrescription.medications?.map((medication, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{medication.name}</p>
                        <p className="text-sm text-slate-600">{medication.dosage} • {medication.frequency}</p>
                      </div>
                      <button
                        onClick={() => removeMedicationFromPrescription(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    // Add medication logic
                  }}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Medication
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowNewPrescription(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save prescription logic
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
