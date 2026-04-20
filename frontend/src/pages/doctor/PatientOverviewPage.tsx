import React, { useState } from 'react';
import { 
  Users, Search, Filter, PlusCircle, Calendar, 
  Activity, Heart, AlertTriangle, Pill, Clock,
  FileText, ChevronRight, Phone, Mail, MapPin, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  lastVisit: string;
  nextAppointment: string;
  condition: string;
  status: 'active' | 'inactive' | 'critical';
  allergies: string[];
  medications: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  totalVisits: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function PatientOverviewPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  
  // Search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Form state for add/edit patient
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodType: 'A+',
    condition: '',
    allergies: '',
    medications: '',
    phone: '',
    email: '',
    address: ''
  });

  const patients: Patient[] = [
    {
      id: 1,
      name: 'Aruni Wijesinghe',
      age: 34,
      gender: 'Female',
      bloodType: 'O+',
      lastVisit: '2024-04-18',
      nextAppointment: '2024-04-21',
      condition: 'Hypertension',
      status: 'active',
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Metformin', 'Lisinopril'],
      contact: {
        phone: '+94 77 123 4567',
        email: 'aruni@email.com',
        address: 'Colombo 05, Sri Lanka'
      },
      totalVisits: 12,
      riskLevel: 'medium'
    },
    {
      id: 2,
      name: 'Kasun Perera',
      age: 45,
      gender: 'Male',
      bloodType: 'A+',
      lastVisit: '2024-04-15',
      nextAppointment: '2024-04-21',
      condition: 'Post-Surgery Recovery',
      status: 'active',
      allergies: ['None'],
      medications: ['Aspirin', 'Beta-blockers'],
      contact: {
        phone: '+94 71 234 5678',
        email: 'kasun@email.com',
        address: 'Kandy, Sri Lanka'
      },
      totalVisits: 8,
      riskLevel: 'high'
    },
    {
      id: 3,
      name: 'Imara Jaffar',
      age: 28,
      gender: 'Female',
      bloodType: 'B+',
      lastVisit: '2024-04-10',
      nextAppointment: '2024-04-21',
      condition: 'Diabetes Type 2',
      status: 'active',
      allergies: ['Shellfish'],
      medications: ['Insulin', 'Metformin'],
      contact: {
        phone: '+94 76 345 6789',
        email: 'imara@email.com',
        address: 'Galle, Sri Lanka'
      },
      totalVisits: 6,
      riskLevel: 'medium'
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CRUD Operation Handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
    resetPatientForm();
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      bloodType: patient.bloodType,
      condition: patient.condition,
      allergies: patient.allergies.join(', '),
      medications: patient.medications.join(', '),
      phone: patient.contact.phone,
      email: patient.contact.email,
      address: patient.contact.address
    });
    setShowEditPatientModal(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setDeletingPatient(patient);
    setShowDeleteConfirmModal(true);
  };

  const handleSavePatient = (isEdit: boolean = false) => {
    // Validation
    if (!patientForm.name || !patientForm.age || !patientForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would normally save to backend
    console.log('Saving patient:', patientForm);
    
    if (isEdit) {
      alert('Patient updated successfully!');
    } else {
      alert('Patient added successfully!');
    }
    
    // Close modals and reset form
    setShowAddPatientModal(false);
    setShowEditPatientModal(false);
    resetPatientForm();
  };

  const handleConfirmDelete = () => {
    if (deletingPatient) {
      // Here you would normally delete from backend
      console.log('Deleting patient:', deletingPatient);
      alert(`Patient ${deletingPatient.name} deleted successfully!`);
      setShowDeleteConfirmModal(false);
      setDeletingPatient(null);
    }
  };

  const resetPatientForm = () => {
    setPatientForm({
      name: '',
      age: '',
      gender: 'Male',
      bloodType: 'A+',
      condition: '',
      allergies: '',
      medications: '',
      phone: '',
      email: '',
      address: ''
    });
    setEditingPatient(null);
  };

  const handleViewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  // Search suggestion handlers
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.length >= 2) {
      const filteredSuggestions = patients.filter(patient =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSearchInputFocus = () => {
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchInputBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (patient: Patient) => {
    setSearchQuery(patient.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Optionally auto-select the patient
    handleViewPatientDetails(patient);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-slate-100 text-slate-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-16 px-2">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div className="leading-none">
              <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
              <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Patient Overview', icon: Users, path: '/doctor' },
              { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
              { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
              { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
              { name: 'Consultations', icon: ChevronRight, path: '/doctor/chats' },
              { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/20'
                    : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'
                }`}
              >
                <item.icon size={22} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-950 mb-2">Patient Overview</h1>
            <p className="text-lg text-slate-600 font-bold">Comprehensive view of all your patients</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-[#8D153A]" size={24} />
                <span className="text-2xl font-black text-slate-950">248</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Heart className="text-emerald-600" size={24} />
                <span className="text-2xl font-black text-slate-950">186</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Active</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-orange-600" size={24} />
                <span className="text-2xl font-black text-slate-950">12</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">High Risk</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-blue-600" size={24} />
                <span className="text-2xl font-black text-slate-950">24</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Today</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((patient, index) => (
                        <div
                          key={patient.id}
                          onClick={() => handleSuggestionClick(patient)}
                          className={`px-4 py-3 cursor-pointer transition-all flex items-center gap-3 ${
                            index === selectedSuggestionIndex
                              ? 'bg-[#8D153A]/10 text-[#8D153A]'
                              : 'hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm truncate">{patient.name}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{patient.age}y, {patient.gender}</span>
                              <span>•</span>
                              <span>{patient.bloodType}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-black ${getRiskColor(patient.riskLevel)}`}>
                                {patient.riskLevel}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(patient.status)}`}>
                              {patient.status}
                            </span>
                            <span className="text-xs text-slate-400">{patient.condition}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                      <p className="text-xs text-slate-500 font-medium">
                        {suggestions.length} patient{suggestions.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="critical">Critical</option>
                </select>
                <button 
                  onClick={handleAddPatient}
                  className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add Patient
                </button>
              </div>
            </div>
          </div>

          {/* Patients List */}
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-black text-slate-950 text-lg">{patient.name}</p>
                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                          {patient.age}y, {patient.gender}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-black">
                          {patient.bloodType}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-black ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Condition</p>
                          <p className="font-black text-slate-950">{patient.condition}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Last Visit</p>
                          <p className="font-black text-slate-950">{patient.lastVisit}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Next Appointment</p>
                          <p className="font-black text-slate-950">{patient.nextAppointment}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={12} />
                            <span>{patient.contact.phone}</span>
                            <Mail size={12} className="ml-2" />
                            <span>{patient.contact.email}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={12} />
                            <span>{patient.contact.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-red-500" />
                          <span className="font-black text-slate-700">Allergies:</span>
                          <span className="text-slate-600">{patient.allergies.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pill size={14} className="text-blue-500" />
                          <span className="font-black text-slate-700">Medications:</span>
                          <span className="text-slate-600">{patient.medications.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-green-500" />
                          <span className="font-black text-slate-700">Total Visits:</span>
                          <span className="text-slate-600">{patient.totalVisits}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewPatientDetails(patient)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" 
                        title="View Full Profile"
                      >
                        <FileText size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" 
                        title="Edit Patient"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePatient(patient)}
                        className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" 
                        title="Delete Patient"
                      >
                        <X size={16} />
                      </button>
                      <button className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all" title="Schedule Appointment">
                        <Calendar size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-950">Add New Patient</h3>
              <button 
                onClick={() => setShowAddPatientModal(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name *</label>
                  <input
                    type="text"
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Age *</label>
                  <input
                    type="number"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Blood Type</label>
                  <select
                    value={patientForm.bloodType}
                    onChange={(e) => setPatientForm({...patientForm, bloodType: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medical Condition</label>
                <input
                  type="text"
                  value={patientForm.condition}
                  onChange={(e) => setPatientForm({...patientForm, condition: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter medical condition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phone *</label>
                  <input
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email</label>
                  <input
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Address</label>
                <input
                  type="text"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Allergies</label>
                  <input
                    type="text"
                    value={patientForm.allergies}
                    onChange={(e) => setPatientForm({...patientForm, allergies: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter allergies (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medications</label>
                  <input
                    type="text"
                    value={patientForm.medications}
                    onChange={(e) => setPatientForm({...patientForm, medications: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter medications (comma separated)"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSavePatient(false)}
                  className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#8D153A]/80 transition-all"
                >
                  Add Patient
                </button>
                <button
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditPatientModal && editingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-950">Edit Patient: {editingPatient.name}</h3>
              <button 
                onClick={() => setShowEditPatientModal(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name *</label>
                  <input
                    type="text"
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Age *</label>
                  <input
                    type="number"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Blood Type</label>
                  <select
                    value={patientForm.bloodType}
                    onChange={(e) => setPatientForm({...patientForm, bloodType: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medical Condition</label>
                <input
                  type="text"
                  value={patientForm.condition}
                  onChange={(e) => setPatientForm({...patientForm, condition: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter medical condition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phone *</label>
                  <input
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email</label>
                  <input
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Address</label>
                <input
                  type="text"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Allergies</label>
                  <input
                    type="text"
                    value={patientForm.allergies}
                    onChange={(e) => setPatientForm({...patientForm, allergies: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter allergies (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medications</label>
                  <input
                    type="text"
                    value={patientForm.medications}
                    onChange={(e) => setPatientForm({...patientForm, medications: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Enter medications (comma separated)"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSavePatient(true)}
                  className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#8D153A]/80 transition-all"
                >
                  Update Patient
                </button>
                <button
                  onClick={() => setShowEditPatientModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && deletingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <X className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4">Delete Patient</h3>
              <p className="text-slate-600 font-medium mb-8">
                Are you sure you want to delete <span className="font-black text-slate-950">{deletingPatient.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all"
                >
                  Delete Patient
                </button>
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-950 mb-2">Patient Details</h3>
                <p className="text-slate-600 font-bold">{selectedPatient.name}</p>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Personal Information</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Age:</span>
                    <span className="font-black text-slate-950">{selectedPatient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Gender:</span>
                    <span className="font-black text-slate-950">{selectedPatient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Blood Type:</span>
                    <span className="font-black text-slate-950">{selectedPatient.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span className="font-black text-slate-950">{selectedPatient.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="font-black text-slate-950">{selectedPatient.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="font-black text-slate-950">{selectedPatient.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Medical Information</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-slate-600 font-medium">Condition:</span>
                    <p className="font-black text-slate-950 mt-1">{selectedPatient.condition}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600 font-medium">Allergies:</span>
                    <p className="font-black text-slate-950 mt-1">{selectedPatient.allergies.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600 font-medium">Medications:</span>
                    <p className="font-black text-slate-950 mt-1">{selectedPatient.medications.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Visit History</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Last Visit:</span>
                    <span className="font-black text-slate-950">{selectedPatient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Next Appointment:</span>
                    <span className="font-black text-slate-950">{selectedPatient.nextAppointment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Total Visits:</span>
                    <span className="font-black text-slate-950">{selectedPatient.totalVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Risk Level:</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black ${getRiskColor(selectedPatient.riskLevel)}`}>
                      {selectedPatient.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  handleEditPatient(selectedPatient);
                }}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all"
              >
                Edit Patient
              </button>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  handleDeletePatient(selectedPatient);
                }}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all"
              >
                Delete Patient
              </button>
              <button
                onClick={() => setSelectedPatient(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
