import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  Navigation, 
  Truck, 
  Package, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  Heart, 
  Pill, 
  FileText, 
  Barcode, 
  QrCode, 
  Camera,
  Smartphone,
  Globe,
  Mail,
  MessageSquare,
  TrendingUp,
  Activity,
  DollarSign,
  Award,
  Clock as ClockIcon
} from 'lucide-react';
import { api } from '../api/axios';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating: number;
  reviews: number;
  isOpen: boolean;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  deliveryAvailable: boolean;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  insuranceAccepted: string[];
  specialties: string[];
  verified: boolean;
  featured: boolean;
  imageUrl?: string;
}

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'ointment' | 'inhaler' | 'patch';
  strength: string;
  description: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
  price: number;
  inStock: boolean;
  prescriptionRequired: boolean;
  manufacturer: string;
  ndc: string;
  imageUrl?: string;
}

interface DeliveryOrder {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: Array<{
    medicineId: string;
    medicineName: string;
    quantity: number;
    price: number;
    prescriptionRequired: boolean;
    prescriptionImage?: string;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  actualDelivery?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    photo?: string;
  };
}

interface Prescription {
  id: string;
  doctorName: string;
  doctorClinic: string;
  patientName: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: string;
    instructions: string;
    refills: number;
  }>;
  issuedDate: string;
  expiresDate: string;
  status: 'active' | 'expired' | 'filled';
  imageUrl?: string;
}

export default function PharmacyLocator() {
  const [activeTab, setActiveTab] = useState<'locator' | 'delivery' | 'orders' | 'prescriptions'>('locator');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('');
  const [filterDelivery, setFilterDelivery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const [expandedPharmacy, setExpandedPharmacy] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<Array<{medicine: Medicine; quantity: number}>>([]);

  const [newOrder, setNewOrder] = useState({
    pharmacyId: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    paymentMethod: 'credit_card',
    specialInstructions: ''
  });

  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    fetchPharmacyData();
    getUserLocation();
  }, []);

  const fetchPharmacyData = async () => {
    try {
      setLoading(true);
      const [pharmaciesRes, medicinesRes, ordersRes, prescriptionsRes] = await Promise.all([
        api.get('/pharmacy/locator'),
        api.get('/pharmacy/medicines'),
        api.get('/pharmacy/orders'),
        api.get('/pharmacy/prescriptions')
      ]);

      setPharmacies(pharmaciesRes.data);
      setMedicines(medicinesRes.data);
      setOrders(ordersRes.data);
      setPrescriptions(prescriptionsRes.data);
    } catch (error) {
      console.error('Failed to fetch pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        ...newOrder,
        items: selectedMedicines.map(item => ({
          medicineId: item.medicine.id,
          medicineName: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price,
          prescriptionRequired: item.medicine.prescriptionRequired
        }))
      };

      const response = await api.post('/pharmacy/orders', orderData);
      setOrders([response.data, ...orders]);
      setShowOrderModal(false);
      setSelectedMedicines([]);
      setNewOrder({
        pharmacyId: '',
        deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
        paymentMethod: 'credit_card',
        specialInstructions: ''
      });
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const uploadPrescription = async (prescriptionData: FormData) => {
    try {
      const response = await api.post('/pharmacy/prescriptions', prescriptionData);
      setPrescriptions([response.data, ...prescriptions]);
      setShowPrescriptionModal(false);
    } catch (error) {
      console.error('Failed to upload prescription:', error);
    }
  };

  const addToCart = (medicine: Medicine, quantity: number = 1) => {
    const existing = selectedMedicines.find(item => item.medicine.id === medicine.id);
    if (existing) {
      setSelectedMedicines(prev => prev.map(item => 
        item.medicine.id === medicine.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setSelectedMedicines(prev => [...prev, { medicine, quantity }]);
    }
  };

  const removeFromCart = (medicineId: string) => {
    setSelectedMedicines(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else {
      setSelectedMedicines(prev => prev.map(item => 
        item.medicine.id === medicineId ? { ...item, quantity } : item
      ));
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'delivery': return <Truck size={16} className="text-blue-500" />;
      case '24-hour': return <ClockIcon size={16} className="text-green-500" />;
      case 'compounding': return <Activity size={16} className="text-purple-500" />;
      case 'immunizations': return <Shield size={16} className="text-red-500" />;
      case 'health screenings': return <Heart size={16} className="text-pink-500" />;
      case 'medication therapy': return <Pill size={16} className="text-orange-500" />;
      default: return <Package size={16} className="text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      case 'out_for_delivery': return <Truck className="text-blue-500" size={16} />;
      case 'preparing': return <Package className="text-yellow-500" size={16} />;
      case 'confirmed': return <CheckCircle className="text-purple-500" size={16} />;
      case 'pending': return <ClockIcon className="text-slate-500" size={16} />;
      case 'cancelled': return <X className="text-red-500" size={16} />;
      default: return <ClockIcon className="text-slate-500" size={16} />;
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = !searchTerm || 
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = !filterService || pharmacy.services.includes(filterService);
    const matchesDelivery = !filterDelivery || 
      (filterDelivery === 'available' && pharmacy.deliveryAvailable) ||
      (filterDelivery === 'unavailable' && !pharmacy.deliveryAvailable);
    
    return matchesSearch && matchesService && matchesDelivery;
  });

  const sortedPharmacies = [...filteredPharmacies].sort((a, b) => {
    switch (sortBy) {
      case 'distance': return a.distance - b.distance;
      case 'rating': return b.rating - a.rating;
      case 'price': return a.deliveryFee - b.deliveryFee;
      default: return a.distance - b.distance;
    }
  });

  const cartTotal = selectedMedicines.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  const deliveryFee = selectedPharmines.length > 0 && selectedPharmacy ? selectedPharmacy.deliveryFee : 0;
  const orderTotal = cartTotal + deliveryFee;

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
              <Pill className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Pharmacy Locator & Medicine Delivery</h1>
              <p className="text-slate-600 mt-1">Find nearby pharmacies and order medicine delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Package size={16} />
                Cart (${orderTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Nearby Pharmacies</p>
              <p className="text-2xl font-bold text-slate-900">{pharmacies.length}</p>
            </div>
            <MapPin className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Delivery Available</p>
              <p className="text-2xl font-bold text-slate-900">
                {pharmacies.filter(p => p.deliveryAvailable).length}
              </p>
            </div>
            <Truck className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Active Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
              </p>
            </div>
            <Package className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Prescriptions</p>
              <p className="text-2xl font-bold text-slate-900">{prescriptions.length}</p>
            </div>
            <FileText className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'locator', name: 'Pharmacy Locator', icon: MapPin },
              { id: 'delivery', name: 'Medicine Search', icon: Pill },
              { id: 'orders', name: 'My Orders', icon: Package },
              { id: 'prescriptions', name: 'Prescriptions', icon: FileText }
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
          {/* Pharmacy Locator Tab */}
          {activeTab === 'locator' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search pharmacies by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Services</option>
                  <option value="delivery">Delivery</option>
                  <option value="24-hour">24 Hour</option>
                  <option value="compounding">Compounding</option>
                  <option value="immunizations">Immunizations</option>
                  <option value="health screenings">Health Screenings</option>
                </select>
                <select
                  value={filterDelivery}
                  onChange={(e) => setFilterDelivery(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Delivery Options</option>
                  <option value="available">Delivery Available</option>
                  <option value="unavailable">No Delivery</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Delivery Fee</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedPharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Package size={24} className="text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">{pharmacy.name}</h4>
                              {pharmacy.verified && (
                                <CheckCircle className="text-blue-500" size={16} />
                              )}
                              {pharmacy.featured && (
                                <Award className="text-yellow-500" size={16} />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {pharmacy.distance} km
                              </span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Star className="text-yellow-500 fill-current" size={14} />
                                <span>{pharmacy.rating}</span>
                              </div>
                              <span>•</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                pharmacy.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {pharmacy.isOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-600">{pharmacy.address}</p>
                            
                            {pharmacy.deliveryAvailable && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                                <Truck size={14} />
                                <span>Delivery • {pharmacy.deliveryTime}</span>
                                <span>• ${pharmacy.deliveryFee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedPharmacy === pharmacy.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedPharmacy === pharmacy.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Contact Information</h5>
                            <div className="space-y-1 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>{pharmacy.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <span>{pharmacy.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe size={14} />
                                <a href={pharmacy.website} className="text-blue-600 hover:underline">
                                  Visit Website
                                </a>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Hours</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                              <div>Mon: {pharmacy.hours.monday}</div>
                              <div>Tue: {pharmacy.hours.tuesday}</div>
                              <div>Wed: {pharmacy.hours.wednesday}</div>
                              <div>Thu: {pharmacy.hours.thursday}</div>
                              <div>Fri: {pharmacy.hours.friday}</div>
                              <div>Sat: {pharmacy.hours.saturday}</div>
                              <div>Sun: {pharmacy.hours.sunday}</div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Services</h5>
                            <div className="flex flex-wrap gap-2">
                              {pharmacy.services.map((service, index) => (
                                <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                  {getServiceIcon(service)}
                                  <span>{service}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {pharmacy.insuranceAccepted.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Insurance Accepted</h5>
                              <div className="flex flex-wrap gap-1">
                                {pharmacy.insuranceAccepted.map((insurance, index) => (
                                  <span key={index} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                                    {insurance}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedPharmacy(pharmacy);
                                setShowOrderModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Package size={16} />
                              Order Medicine
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              <Navigation size={16} />
                              Get Directions
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              <Phone size={16} />
                              Call
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

          {/* Medicine Search Tab */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search medicines by name or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicines
                  .filter(medicine => !searchTerm || 
                    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((medicine) => (
                  <div key={medicine.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{medicine.name}</h4>
                        <p className="text-sm text-slate-600">{medicine.genericName}</p>
                        <p className="text-sm text-slate-600">{medicine.brand} • {medicine.strength}</p>
                      </div>
                      {medicine.prescriptionRequired && (
                        <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Rx
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-slate-600">{medicine.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          medicine.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="font-semibold text-slate-900">${medicine.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(medicine)}
                        disabled={!medicine.inStock}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
                        <Info size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Delivery Orders</h3>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  New Order
                </button>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(order.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{order.pharmacyName}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                            <div>
                              <span className="font-medium">Order ID:</span> {order.id}
                            </div>
                            <div>
                              <span className="font-medium">Placed:</span> {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Est. Delivery:</span> {new Date(order.estimatedDelivery).toLocaleString()}
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="font-medium text-slate-900 mb-1">Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm text-slate-600">
                                  <span>{item.medicineName} x {item.quantity}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.deliveryPerson && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-blue-900">{order.deliveryPerson.name}</p>
                                <p className="text-sm text-blue-700">{order.deliveryPerson.phone}</p>
                              </div>
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                <Phone size={14} />
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

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">My Prescriptions</h3>
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Upload Prescription
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">Dr. {prescription.doctorName}</h4>
                        <p className="text-sm text-slate-600">{prescription.doctorClinic}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {prescription.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Patient:</span>
                        <span className="font-medium text-slate-900">{prescription.patientName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Issued:</span>
                        <span className="text-slate-900">{new Date(prescription.issuedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Expires:</span>
                        <span className="text-slate-900">{new Date(prescription.expiresDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium text-slate-900 mb-1">Medications:</p>
                      <div className="space-y-1">
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="text-sm text-slate-600">
                            <span className="font-medium">{med.name}</span> • {med.dosage} • {med.quantity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Order Medicines
                      </button>
                      <button className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
                        <Camera size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Place Medicine Order</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedMedicines.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto text-slate-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-600 mb-4">Add medicines to your cart to place an order</p>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setActiveTab('delivery');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Browse Medicines
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Cart Items</h3>
                    <div className="space-y-2">
                      {selectedMedicines.map((item) => (
                        <div key={item.medicine.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.medicine.name}</p>
                            <p className="text-sm text-slate-600">{item.medicine.strength}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                              className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center hover:bg-slate-300"
                            >
                              <X size={12} />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                              className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center hover:bg-slate-300"
                            >
                              <Plus size={12} />
                            </button>
                            <span className="w-20 text-right font-medium">
                              ${(item.medicine.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Pharmacy</label>
                    <select
                      value={newOrder.pharmacyId}
                      onChange={(e) => setNewOrder({...newOrder, pharmacyId: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a pharmacy...</option>
                      {pharmacies.filter(p => p.deliveryAvailable).map((pharmacy) => (
                        <option key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.name} • {pharmacy.distance} km • ${pharmacy.deliveryFee} delivery
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newOrder.deliveryAddress.street}
                        onChange={(e) => setNewOrder({
                          ...newOrder,
                          deliveryAddress: {...newOrder.deliveryAddress, street: e.target.value}
                        })}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newOrder.deliveryAddress.city}
                        onChange={(e) => setNewOrder({
                          ...newOrder,
                          deliveryAddress: {...newOrder.deliveryAddress, city: e.target.value}
                        })}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newOrder.deliveryAddress.state}
                        onChange={(e) => setNewOrder({
                          ...newOrder,
                          deliveryAddress: {...newOrder.deliveryAddress, state: e.target.value}
                        })}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={newOrder.deliveryAddress.zipCode}
                        onChange={(e) => setNewOrder({
                          ...newOrder,
                          deliveryAddress: {...newOrder.deliveryAddress, zipCode: e.target.value}
                        })}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                    <select
                      value={newOrder.paymentMethod}
                      onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Special Instructions (Optional)</label>
                    <textarea
                      value={newOrder.specialInstructions}
                      onChange={(e) => setNewOrder({...newOrder, specialInstructions: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Delivery Fee:</span>
                        <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={!newOrder.pharmacyId || !newOrder.deliveryAddress.street}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
