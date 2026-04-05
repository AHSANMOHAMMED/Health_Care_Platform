import { useState } from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Activity,
  Pill,
  FileText,
  Camera,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Download,
  Shield,
  Clock
} from 'lucide-react';

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    address: '123 Main St, New York, NY 10001',
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS123456789'
  });

  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  });

  const appointments: Appointment[] = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-15',
      time: '2:30 PM',
      type: 'video',
      status: 'upcoming'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Neurology',
      date: '2024-01-10',
      time: '10:00 AM',
      type: 'in-person',
      status: 'completed'
    }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'medical', label: 'Medical Info', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const addAllergy = (allergy: string) => {
    if (allergy.trim()) {
      setMedicalInfo(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy.trim()]
      }));
    }
  };

  const removeAllergy = (index: number) => {
    setMedicalInfo(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full healthcare-gradient flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          <div>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="healthcare-input disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Insurance Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
            <input
              type="text"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="healthcare-input disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ID</label>
            <input
              type="text"
              name="insuranceId"
              value={formData.insuranceId}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="healthcare-input disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="feature-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Blood Type</h4>
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{medicalInfo.bloodType}</p>
        </div>

        <div className="feature-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Emergency Contact</h4>
            <Phone className="h-5 w-5 text-blue-500" />
          </div>
          <p className="font-medium text-gray-900">{medicalInfo.emergencyContact.name}</p>
          <p className="text-sm text-gray-600">{medicalInfo.emergencyContact.relationship}</p>
          <p className="text-sm text-gray-600">{medicalInfo.emergencyContact.phone}</p>
        </div>
      </div>

      <div className="feature-card">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          Allergies
        </h4>
        <div className="space-y-2">
          {medicalInfo.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">{allergy}</span>
              <button
                onClick={() => removeAllergy(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add new allergy..."
              className="flex-1 healthcare-input text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addAllergy((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add new allergy..."]') as HTMLInputElement;
                addAllergy(input.value);
                input.value = '';
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="feature-card">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Pill className="h-5 w-5 text-blue-500 mr-2" />
          Current Medications
        </h4>
        <div className="space-y-2">
          {medicalInfo.medications.map((medication, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">{medication}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="feature-card">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-green-500 mr-2" />
          Medical Conditions
        </h4>
        <div className="space-y-2">
          {medicalInfo.conditions.map((condition, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">{condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Appointment History</h3>
        <button className="healthcare-button">
          Book New Appointment
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="feature-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{appointment.date}</span>
                    <span>{appointment.time}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      appointment.type === 'video' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {appointment.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  appointment.status === 'upcoming' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : appointment.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Medical Documents</h3>
        <button className="flex items-center space-x-2 healthcare-button">
          <Plus className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Blood Test Results', date: '2024-01-10', type: 'PDF' },
          { name: 'X-Ray Report', date: '2024-01-05', type: 'PDF' },
          { name: 'Prescription', date: '2023-12-20', type: 'PDF' }
        ].map((doc, index) => (
          <div key={index} className="feature-card">
            <div className="flex items-start justify-between mb-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <button className="text-gray-400 hover:text-gray-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{doc.date}</p>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
      
      <div className="feature-card">
        <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input type="password" className="healthcare-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input type="password" className="healthcare-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input type="password" className="healthcare-input" />
          </div>
          <button className="healthcare-button">Update Password</button>
        </div>
      </div>

      <div className="feature-card">
        <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900">Add an extra layer of security to your account</p>
            <p className="text-sm text-gray-600">Use your phone to verify your identity</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal and medical information</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'medical' && renderMedicalInfo()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'security' && renderSecurity()}
        </div>
      </div>
    </div>
  );
}
