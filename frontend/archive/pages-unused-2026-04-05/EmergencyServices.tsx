import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Ambulance, 
  Shield, 
  Clock, 
  Users, 
  Heart, 
  Activity, 
  Zap, 
  Navigation, 
  MessageSquare, 
  Video, 
  FileText, 
  Bell, 
  ChevronRight, 
  X, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Radio, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal, 
  Thermometer, 
  Droplet, 
  Stethoscope, 
  Pill, 
  User, 
  Calendar, 
  Star, 
  TrendingUp, 
  BarChart3,
  Eye,
  Ear,
  Brain,
  Bone,
  Baby
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  priority: number;
}

interface EmergencyService {
  id: string;
  name: string;
  type: 'ambulance' | 'hospital' | 'clinic' | 'pharmacy' | 'fire' | 'police';
  distance: number;
  address: string;
  phone: string;
  rating: number;
  available247: boolean;
  estimatedTime: number;
  specialties: string[];
  coordinates: { lat: number; lng: number };
}

interface MedicalAlert {
  id: string;
  type: 'allergy' | 'condition' | 'medication' | 'implant' | 'emergency';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: string;
  visibleToEmergency: boolean;
  createdAt: string;
}

interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    step: number;
    action: string;
    details: string;
    timeCritical: boolean;
  }>;
  conditions: string[];
  emergencyServices: string[];
}

interface SOSRequest {
  id: string;
  timestamp: string;
  type: 'medical' | 'accident' | 'fall' | 'chest_pain' | 'breathing' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number; address: string };
  symptoms: string[];
  status: 'pending' | 'dispatched' | 'en_route' | 'arrived' | 'completed';
  assignedService?: EmergencyService;
  eta?: number;
  notes?: string;
}

export default function EmergencyServices() {
  const [activeTab, setActiveTab] = useState<'sos' | 'contacts' | 'services' | 'alerts' | 'protocols'>('sos');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosRequest, setSosRequest] = useState<Partial<SOSRequest>>({
    type: 'medical',
    severity: 'medium',
    symptoms: []
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [nearbyServices, setNearbyServices] = useState<EmergencyService[]>([]);
  const [medicalAlerts, setMedicalAlerts] = useState<MedicalAlert[]>([]);
  const [emergencyProtocols, setEmergencyProtocols] = useState<EmergencyProtocol[]>([]);
  const [sosHistory, setSosHistory] = useState<SOSRequest[]>([]);

  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchEmergencyData();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocationEnabled(true);
          fetchNearbyServices(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocationEnabled(false);
        }
      );
    }
  };

  const fetchEmergencyData = async () => {
    try {
      setLoading(true);
      const [contactsRes, alertsRes, protocolsRes, historyRes] = await Promise.all([
        api.get('/emergency/contacts'),
        api.get('/emergency/alerts'),
        api.get('/emergency/protocols'),
        api.get('/emergency/sos-history')
      ]);

      setEmergencyContacts(contactsRes.data);
      setMedicalAlerts(alertsRes.data);
      setEmergencyProtocols(protocolsRes.data);
      setSosHistory(historyRes.data);
    } catch (error) {
      console.error('Failed to fetch emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyServices = async (lat: number, lng: number) => {
    try {
      const response = await api.get('/emergency/nearby-services', {
        params: { lat, lng, radius: 10 }
      });
      setNearbyServices(response.data);
    } catch (error) {
      console.error('Failed to fetch nearby services:', error);
    }
  };

  const triggerSOS = async () => {
    if (!currentLocation) {
      alert('Location services are required for emergency services');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/emergency/sos', {
        ...sosRequest,
        location: {
          ...currentLocation,
          address: 'Current Location'
        },
        timestamp: new Date().toISOString()
      });

      const newRequest: SOSRequest = response.data;
      setSosHistory([newRequest, ...sosHistory]);
      setShowSOSModal(false);
      
      // Auto-call emergency services for critical cases
      if (newRequest.severity === 'critical') {
        window.location.href = `tel:911`;
      }
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
    } finally {
      setLoading(false);
    }
  };

  const callEmergencyService = (service: EmergencyService) => {
    window.location.href = `tel:${service.phone}`;
  };

  const navigateToService = (service: EmergencyService) => {
    const url = `https://maps.google.com/?q=${service.coordinates.lat},${service.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const addEmergencyContact = async (contact: Partial<EmergencyContact>) => {
    try {
      const response = await api.post('/emergency/contacts', contact);
      setEmergencyContacts([...emergencyContacts, response.data]);
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
    }
  };

  const addMedicalAlert = async (alert: Partial<MedicalAlert>) => {
    try {
      const response = await api.post('/emergency/alerts', alert);
      setMedicalAlerts([...medicalAlerts, response.data]);
    } catch (error) {
      console.error('Failed to add medical alert:', error);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Ambulance size={20} className="text-red-500" />;
      case 'hospital': return <Heart size={20} className="text-blue-500" />;
      case 'clinic': return <Stethoscope size={20} className="text-green-500" />;
      case 'pharmacy': return <Pill size={20} className="text-purple-500" />;
      case 'fire': return <AlertTriangle size={20} className="text-orange-500" />;
      case 'police': return <Shield size={20} className="text-slate-500" />;
      default: return <HelpCircle size={20} className="text-slate-500" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dispatched': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_route': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'arrived': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredServices = nearbyServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || service.type === filterType;
    return matchesSearch && matchesType;
  });

  const getQuickActions = () => [
    { id: 'chest_pain', name: 'Chest Pain', icon: <Heart size={24} />, severity: 'critical' },
    { id: 'breathing', name: 'Breathing Difficulty', icon: <Activity size={24} />, severity: 'critical' },
    { id: 'fall', name: 'Fall/Injury', icon: <AlertTriangle size={24} />, severity: 'high' },
    { id: 'bleeding', name: 'Severe Bleeding', icon: <Droplet size={24} />, severity: 'high' },
    { id: 'allergic', name: 'Allergic Reaction', icon: <AlertCircle size={24} />, severity: 'medium' },
    { id: 'other', name: 'Other Emergency', icon: <HelpCircle size={24} />, severity: 'medium' }
  ];

  if (loading && !emergencyContacts.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading emergency services..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Emergency Services</h1>
              <p className="text-slate-600 mt-1">Quick access to emergency help and medical alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isLocationEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isLocationEnabled ? <MapPin size={16} /> : <MapPin size={16} />}
              <span className="text-sm font-medium">
                {isLocationEnabled ? 'Location On' : 'Location Off'}
              </span>
            </div>
            <button
              onClick={getCurrentLocation}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <Navigation size={16} />
              Update Location
            </button>
          </div>
        </div>
      </div>

      {/* Quick SOS Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Emergency Quick Actions</h2>
          <button
            onClick={() => setShowSOSModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <AlertTriangle size={20} />
            Trigger SOS
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {getQuickActions().map((action) => (
            <button
              key={action.id}
              onClick={() => {
                setSosRequest({
                  type: action.id as any,
                  severity: action.severity as any,
                  symptoms: []
                });
                setShowSOSModal(true);
              }}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                action.severity === 'critical' ? 'border-red-200 bg-red-50 hover:border-red-300' :
                action.severity === 'high' ? 'border-orange-200 bg-orange-50 hover:border-orange-300' :
                'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${
                  action.severity === 'critical' ? 'bg-red-100 text-red-600' :
                  action.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-slate-900">{action.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="text-red-600" size={24} />
            <h3 className="font-semibold text-red-900">Emergency</h3>
          </div>
          <button
            onClick={() => window.location.href = 'tel:911'}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg"
          >
            Call 911
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Ambulance className="text-blue-600" size={24} />
            <h3 className="font-semibold text-blue-900">Ambulance</h3>
          </div>
          <button
            onClick={() => window.location.href = 'tel:911'}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
          >
            Request Ambulance
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-green-600" size={24} />
            <h3 className="font-semibold text-green-900">Emergency Hotline</h3>
          </div>
          <button
            onClick={() => window.location.href = 'tel:1-800-222-1222'}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
          >
            Poison Control
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'contacts', name: 'Emergency Contacts', icon: Users },
              { id: 'services', name: 'Nearby Services', icon: MapPin },
              { id: 'alerts', name: 'Medical Alerts', icon: Bell },
              { id: 'protocols', name: 'Emergency Protocols', icon: FileText },
              { id: 'history', name: 'SOS History', icon: Clock }
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
          {/* Emergency Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Emergency Contacts</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Contact
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{contact.name}</h4>
                            {contact.isPrimary && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{contact.relationship}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                              <Phone size={14} />
                              {contact.phone}
                            </a>
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                              <MessageSquare size={14} />
                              Email
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Nearby Emergency Services</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search services..."
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
                    <option value="hospital">Hospitals</option>
                    <option value="clinic">Clinics</option>
                    <option value="pharmacy">Pharmacies</option>
                    <option value="ambulance">Ambulance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredServices.map((service) => (
                  <div key={service.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getServiceIcon(service.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-900">{service.name}</h4>
                              {service.available247 && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border-green-200">
                                  24/7
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{service.address}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {service.distance} km away
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {service.estimatedTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500" />
                                {service.rating}
                              </span>
                            </div>
                            {service.specialties.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.specialties.map((specialty, index) => (
                                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedService === service.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedService === service.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => callEmergencyService(service)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Phone size={16} />
                            Call Now
                          </button>
                          <button
                            onClick={() => navigateToService(service)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                          >
                            <Navigation size={16} />
                            Get Directions
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                            <MessageSquare size={16} />
                            Contact
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Medical Alerts</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Alert
                </button>
              </div>

              <div className="space-y-3">
                {medicalAlerts.map((alert) => (
                  <div key={alert.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'high' ? 'bg-orange-100' :
                          alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {alert.type === 'allergy' && <AlertCircle size={20} className="text-red-600" />}
                          {alert.type === 'condition' && <Heart size={20} className="text-blue-600" />}
                          {alert.type === 'medication' && <Pill size={20} className="text-purple-600" />}
                          {alert.type === 'implant' && <Activity size={20} className="text-green-600" />}
                          {alert.type === 'emergency' && <AlertTriangle size={20} className="text-red-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            {alert.visibleToEmergency && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                Visible to Emergency
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                          <p className="text-sm text-slate-600 mt-2">
                            <span className="font-medium">Action Required:</span> {alert.actionRequired}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Protocols Tab */}
          {activeTab === 'protocols' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Emergency Protocols</h3>
              
              <div className="space-y-3">
                {emergencyProtocols.map((protocol) => (
                  <div key={protocol.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{protocol.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{protocol.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {protocol.conditions.map((condition, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedProtocol === protocol.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedProtocol === protocol.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-3">
                          {protocol.steps.map((step) => (
                            <div key={step.step} className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                step.timeCritical ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{step.action}</p>
                                <p className="text-sm text-slate-600">{step.details}</p>
                                {step.timeCritical && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border-red-200">
                                    Time Critical
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOS History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">SOS Request History</h3>
              
              <div className="space-y-3">
                {sosHistory.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          request.severity === 'critical' ? 'bg-red-100' :
                          request.severity === 'high' ? 'bg-orange-100' :
                          request.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <AlertTriangle 
                            size={20} 
                            className={
                              request.severity === 'critical' ? 'text-red-600' :
                              request.severity === 'high' ? 'text-orange-600' :
                              request.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            } 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 capitalize">
                              {request.type.replace('_', ' ')}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(request.severity)}`}>
                              {request.severity}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                              {request.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {new Date(request.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-600">
                            Location: {request.location.address}
                          </p>
                          {request.assignedService && (
                            <p className="text-sm text-slate-600">
                              Assigned: {request.assignedService.name}
                            </p>
                          )}
                          {request.eta && (
                            <p className="text-sm text-slate-600">
                              ETA: {request.eta} minutes
                            </p>
                          )}
                          {request.symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {request.symptoms.map((symptom, index) => (
                                <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                  {symptom}
                                </span>
                              ))}
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
        </div>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Emergency SOS Request</h2>
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Type</label>
                <select
                  value={sosRequest.type}
                  onChange={(e) => setSosRequest({...sosRequest, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="medical">Medical Emergency</option>
                  <option value="accident">Accident</option>
                  <option value="fall">Fall</option>
                  <option value="chest_pain">Chest Pain</option>
                  <option value="breathing">Breathing Difficulty</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Severity Level</label>
                <select
                  value={sosRequest.severity}
                  onChange={(e) => setSosRequest({...sosRequest, severity: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low - Non-life threatening</option>
                  <option value="medium">Medium - Medical attention needed</option>
                  <option value="high">High - Immediate attention needed</option>
                  <option value="critical">Critical - Life threatening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Information (Optional)</label>
                <textarea
                  value={sosRequest.notes || ''}
                  onChange={(e) => setSosRequest({...sosRequest, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the emergency situation..."
                />
              </div>

              {sosRequest.severity === 'critical' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-red-900">Critical Emergency Detected</h4>
                      <p className="text-red-700 text-sm mt-1">
                        Emergency services will be automatically contacted. Please stay on the line.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerSOS}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    sosRequest.severity === 'critical' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Sending...' : 'Send SOS Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
