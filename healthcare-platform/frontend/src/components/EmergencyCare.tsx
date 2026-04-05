import { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Heart,
  Activity,
  Thermometer,
  Headphones,
  MessageCircle,
  Video,
  Users,
  Hospital,
  Ambulance,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Shield,
  Zap,
  Radio,
  Stethoscope
} from 'lucide-react';

interface EmergencyService {
  id: string;
  type: 'emergency' | 'urgent-care' | 'telehealth' | 'hotline';
  title: string;
  description: string;
  waitTime: string;
  available: boolean;
  phone?: string;
  address?: string;
  features: string[];
  icon: any;
}

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  category: 'general' | 'cardiac' | 'respiratory' | 'neurological' | 'injury';
}

const emergencyServices: EmergencyService[] = [
  {
    id: '1',
    type: 'emergency',
    title: 'Emergency Room',
    description: 'For life-threatening conditions and severe injuries',
    waitTime: '15-30 min',
    available: true,
    address: '123 Medical Center Dr, New York, NY',
    features: ['24/7 Available', 'Board Certified Physicians', 'Advanced Equipment', 'Trauma Center'],
    icon: Hospital
  },
  {
    id: '2',
    type: 'urgent-care',
    title: 'Urgent Care Center',
    description: 'For non-life-threatening conditions requiring immediate attention',
    waitTime: '30-60 min',
    available: true,
    address: '456 Healthcare Ave, New York, NY',
    features: ['Extended Hours', 'Walk-ins Welcome', 'X-ray & Lab Services', 'Lower Cost'],
    icon: Activity
  },
  {
    id: '3',
    type: 'telehealth',
    title: 'Emergency Telehealth',
    description: 'Virtual consultation for urgent medical advice',
    waitTime: '5-10 min',
    available: true,
    features: ['Available 24/7', 'Video Consultation', 'Prescription Service', 'No Travel Required'],
    icon: Video
  },
  {
    id: '4',
    type: 'hotline',
    title: 'Nurse Hotline',
    description: 'Free medical advice from registered nurses',
    waitTime: '2-5 min',
    available: true,
    phone: '1-800-MEDICAL',
    features: ['24/7 Available', 'Free Service', 'Triage Assessment', 'Care Guidance'],
    icon: Headphones
  }
];

const symptoms: Symptom[] = [
  { id: '1', name: 'Chest Pain', severity: 'severe', category: 'cardiac' },
  { id: '2', name: 'Difficulty Breathing', severity: 'severe', category: 'respiratory' },
  { id: '3', name: 'Severe Bleeding', severity: 'severe', category: 'injury' },
  { id: '4', name: 'Loss of Consciousness', severity: 'severe', category: 'neurological' },
  { id: '5', name: 'High Fever', severity: 'moderate', category: 'general' },
  { id: '6', name: 'Broken Bone', severity: 'moderate', category: 'injury' },
  { id: '7', name: 'Migraine', severity: 'moderate', category: 'neurological' },
  { id: '8', name: 'Sprain/Strain', severity: 'mild', category: 'injury' },
  { id: '9', name: 'Cold/Flu', severity: 'mild', category: 'general' }
];

export default function EmergencyCare() {
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('services');
  const [userLocation, setUserLocation] = useState('New York, NY');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'mild': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'from-red-500 to-red-600';
      case 'urgent-care': return 'from-orange-500 to-orange-600';
      case 'telehealth': return 'from-blue-500 to-blue-600';
      case 'hotline': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendedService = () => {
    const severeSymptoms = symptoms.filter(s => 
      selectedSymptoms.includes(s.id) && s.severity === 'severe'
    );
    
    if (severeSymptoms.length > 0) {
      return emergencyServices.find(s => s.type === 'emergency');
    }
    
    const moderateSymptoms = symptoms.filter(s => 
      selectedSymptoms.includes(s.id) && s.severity === 'moderate'
    );
    
    if (moderateSymptoms.length > 0) {
      return emergencyServices.find(s => s.type === 'urgent-care');
    }
    
    return emergencyServices.find(s => s.type === 'telehealth');
  };

  const recommendedService = getRecommendedService();

  const EmergencyButton = ({ service }: { service: EmergencyService }) => {
    const Icon = service.icon;
    
    return (
      <button
        onClick={() => {
          if (service.type === 'emergency') {
            window.location.href = 'tel:911';
          } else {
            setSelectedService(service);
          }
        }}
        className={`w-full p-6 rounded-2xl text-white transition-all duration-300 transform hover:scale-105 ${
          service.type === 'emergency' 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
            : `bg-gradient-to-r ${getServiceColor(service.type)} hover:opacity-90`
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p className="text-sm opacity-90">{service.waitTime} wait time</p>
            </div>
          </div>
          {service.type === 'emergency' && (
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold">911</span>
            </div>
          )}
        </div>
        <p className="text-sm opacity-90 text-left">{service.description}</p>
      </button>
    );
  };

  const SymptomChecker = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Symptom Checker</h3>
        <p className="text-gray-600">Select your symptoms to get recommended care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {symptoms.map(symptom => (
          <button
            key={symptom.id}
            onClick={() => {
              setSelectedSymptoms(prev => 
                prev.includes(symptom.id) 
                  ? prev.filter(id => id !== symptom.id)
                  : [...prev, symptom.id]
              );
            }}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedSymptoms.includes(symptom.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{symptom.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                {symptom.severity}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedSymptoms.length > 0 && recommendedService && (
        <div className="feature-card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Care</h4>
          <EmergencyButton service={recommendedService} />
        </div>
      )}
    </div>
  );

  const ServiceDetailModal = ({ service }: { service: EmergencyService }) => {
    const Icon = service.icon;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="healthcare-card max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${getServiceColor(service.type)} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="feature-card">
                  <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Wait Time: {service.waitTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">
                        {service.available ? 'Available Now' : 'Currently Unavailable'}
                      </span>
                    </div>
                    {service.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{service.address}</span>
                      </div>
                    )}
                    {service.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{service.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="feature-card">
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="feature-card">
                  <h4 className="font-semibold text-gray-900 mb-3">When to Use</h4>
                  <p className="text-gray-600 mb-3">
                    This service is appropriate for:
                  </p>
                  <ul className="space-y-2">
                    {service.type === 'emergency' && (
                      <>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Chest pain or pressure</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Difficulty breathing</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Severe bleeding</span>
                        </li>
                      </>
                    )}
                    {service.type === 'urgent-care' && (
                      <>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <Activity className="h-4 w-4 text-orange-500" />
                          <span>Moderate injuries</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <Activity className="h-4 w-4 text-orange-500" />
                          <span>Fever over 102°F</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600">
                          <Activity className="h-4 w-4 text-orange-500" />
                          <span>Sprains and strains</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (service.type === 'emergency') {
                      window.location.href = 'tel:911';
                    } else if (service.phone) {
                      window.location.href = `tel:${service.phone}`;
                    }
                  }}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
                    service.type === 'emergency'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : `bg-gradient-to-r ${getServiceColor(service.type)} hover:opacity-90`
                  }`}
                >
                  {service.type === 'emergency' ? 'Call 911 Now' : `Contact ${service.title}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'services', label: 'Emergency Services', icon: Hospital },
    { id: 'symptoms', label: 'Symptom Checker', icon: Stethoscope },
    { id: 'locations', label: 'Nearby Locations', icon: MapPin },
    { id: 'resources', label: 'Emergency Resources', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency & Urgent Care</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get immediate medical attention when you need it most. Available 24/7 for your healthcare emergencies.
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-1">Life-Threatening Emergency?</h3>
              <p className="text-red-700">Call 911 immediately or go to the nearest emergency room.</p>
            </div>
            <button
              onClick={() => window.location.href = 'tel:911'}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call 911</span>
            </button>
          </div>
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
                      ? 'border-red-500 text-red-600'
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
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyServices.map(service => (
                <EmergencyButton key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'symptoms' && (
          <SymptomChecker />
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nearby Emergency Services</h3>
              <p className="text-gray-600">Based on your location: {userLocation}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyServices.filter(s => s.address).map(service => (
                <div key={service.id} className="feature-card">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getServiceColor(service.type)} flex items-center justify-center`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{service.waitTime} away</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Get Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Emergency Hotlines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Emergency: 911</li>
                <li>Poison Control: 1-800-222-1222</li>
                <li>Crisis Hotline: 988</li>
                <li>Nurse Line: 1-800-MEDICAL</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">First Aid Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Stay calm and assess the situation</li>
                <li>• Call for help if needed</li>
                <li>• Apply pressure to bleeding wounds</li>
                <li>• Keep the person comfortable</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preparedness</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Keep emergency contacts handy</li>
                <li>• Maintain a first aid kit</li>
                <li>• Know your medical history</li>
                <li>• Have insurance information ready</li>
              </ul>
            </div>
          </div>
        )}

        {/* Service Detail Modal */}
        {selectedService && <ServiceDetailModal service={selectedService} />}
      </div>
    </div>
  );
}
