import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  Video, 
  Phone, 
  Building, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Heart, 
  Activity, 
  Brain, 
  Eye, 
  Ear, 
  Bone, 
  Baby, 
  Stethoscope, 
  User, 
  Mail, 
  Globe, 
  Award, 
  BookOpen, 
  Languages, 
  Shield, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Target, 
  RefreshCw,
  Plus,
  X,
  Info
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialties: string[];
  experience: number;
  rating: number;
  reviews: number;
  consultationFee: number;
  languages: string[];
  education: string;
  hospital?: string;
  profileImage?: string;
  bio: string;
  consultationTypes: ('video' | 'phone' | 'in-person')[];
  availability: AvailabilitySlot[];
  nextAvailable: string;
  responseTime: number;
  verified: boolean;
  featured: boolean;
  achievements: string[];
  publications: number;
  specialtiesDetailed: Array<{
    name: string;
    years: number;
    certifications: string[];
  }>;
}

interface AvailabilitySlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  consultationType: 'video' | 'phone' | 'in-person';
  available: boolean;
  location?: string;
  price?: number;
}

interface FilterOptions {
  specialty: string;
  consultationType: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  language: string;
  experience: number;
  verified: boolean;
}

interface SearchSuggestion {
  type: 'specialty' | 'condition' | 'doctor' | 'symptom';
  text: string;
  count?: number;
}

export default function DoctorAvailabilityFinder() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState<FilterOptions>({
    specialty: '',
    consultationType: '',
    priceRange: [0, 1000],
    rating: 0,
    availability: '',
    language: '',
    experience: 0,
    verified: false
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price' | 'availability'>('rating');

  const [specialties] = useState([
    { id: 'cardiology', name: 'Cardiology', icon: <Heart size={20} /> },
    { id: 'dermatology', name: 'Dermatology', icon: <User size={20} /> },
    { id: 'pediatrics', name: 'Pediatrics', icon: <Baby size={20} /> },
    { id: 'psychiatry', name: 'Psychiatry', icon: <Brain size={20} /> },
    { id: 'orthopedics', name: 'Orthopedics', icon: <Bone size={20} /> },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: <Eye size={20} /> },
    { id: 'ent', name: 'ENT', icon: <Ear size={20} /> },
    { id: 'neurology', name: 'Neurology', icon: <Brain size={20} /> },
    { id: 'general', name: 'General Practice', icon: <Stethoscope size={20} /> }
  ]);

  const [conditions] = useState([
    'Chest Pain', 'Headache', 'Back Pain', 'Fever', 'Cough', 'Diabetes', 'Hypertension',
    'Anxiety', 'Depression', 'Skin Rash', 'Joint Pain', 'Stomach Pain', 'Allergies'
  ]);

  useEffect(() => {
    fetchDoctors();
  }, [filters, sortBy]);

  useEffect(() => {
    if (searchTerm) {
      fetchSearchSuggestions();
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailabilitySlots();
    }
  }, [selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.consultationType) params.append('consultationType', filters.consultationType);
      if (filters.rating) params.append('minRating', filters.rating.toString());
      if (filters.experience) params.append('minExperience', filters.experience.toString());
      if (filters.verified) params.append('verified', 'true');
      if (filters.priceRange[0]) params.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1]) params.append('maxPrice', filters.priceRange[1].toString());
      params.append('sortBy', sortBy);

      const response = await api.get(`/doctors/available?${params}`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailabilitySlots = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/doctors/availability/${dateStr}`);
      setAvailabilitySlots(response.data);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const fetchSearchSuggestions = async () => {
    try {
      const response = await api.get(`/doctors/search-suggestions?q=${searchTerm}`);
      setSearchSuggestions(response.data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const bookAppointment = async (doctorId: string, slotId: string) => {
    try {
      await api.post('/appointments', {
        doctorId,
        slotId,
        type: 'consultation'
      });
      // Refresh availability
      fetchAvailabilitySlots();
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const toggleDoctorExpansion = (doctorId: string) => {
    setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
  };

  const getSpecialtyIcon = (specialty: string) => {
    const found = specialties.find(s => s.id === specialty.toLowerCase());
    return found ? found.icon : <Stethoscope size={20} />;
  };

  const getAvailabilityForDoctor = (doctorId: string) => {
    return availabilitySlots.filter(slot => slot.doctorId === doctorId && slot.available);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchTerm || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.subSpecialties.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'specialty': return <Stethoscope size={16} className="text-blue-500" />;
      case 'condition': return <Activity size={16} className="text-green-500" />;
      case 'doctor': return <User size={16} className="text-purple-500" />;
      case 'symptom': return <AlertCircle size={16} className="text-orange-500" />;
      default: return <Search size={16} className="text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Finding available doctors..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Find Available Doctors</h1>
            <p className="text-slate-600 mt-1">Search and book appointments with verified healthcare professionals</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="price">Lowest Price</option>
              <option value="availability">Available Soonest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-2">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(suggestion.text)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded text-left"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="text-sm text-slate-700">{suggestion.text}</span>
                  {suggestion.count && (
                    <span className="ml-auto text-xs text-slate-500">{suggestion.count} results</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quick Specialty Selection */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Popular Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {specialties.slice(0, 6).map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => {
                    setSelectedSpecialty(specialty.id);
                    setFilters({...filters, specialty: specialty.id});
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedSpecialty === specialty.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {specialty.icon}
                  <span className="text-sm font-medium">{specialty.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Common Conditions */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Common Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {conditions.slice(0, 8).map((condition) => (
                <button
                  key={condition}
                  onClick={() => setSearchTerm(condition)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200"
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Type</label>
              <select
                value={filters.consultationType}
                onChange={(e) => setFilters({...filters, consultationType: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="video">Video Consultation</option>
                <option value="phone">Phone Consultation</option>
                <option value="in-person">In-Person Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1000]})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
                <option value="20">20+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-slate-700">Verified Doctors Only</label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setFilters({
                specialty: '',
                consultationType: '',
                priceRange: [0, 1000],
                rating: 0,
                availability: '',
                language: '',
                experience: 0,
                verified: false
              })}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Date</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const prevDay = new Date(selectedDate);
              prevDay.setDate(prevDay.getDate() - 1);
              setSelectedDate(prevDay);
            }}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          
          <div className="flex-1 text-center">
            <p className="text-lg font-medium text-slate-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-slate-600">
              {availabilitySlots.filter(s => s.available).length} slots available
            </p>
          </div>
          
          <button
            onClick={() => {
              const nextDay = new Date(selectedDate);
              nextDay.setDate(nextDay.getDate() + 1);
              setSelectedDate(nextDay);
            }}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Today
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Available Doctors ({filteredDoctors.length})
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <RefreshCw 
              size={16} 
              className="cursor-pointer hover:text-slate-800"
              onClick={fetchDoctors}
            />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div 
              className="p-6 cursor-pointer hover:bg-slate-50"
              onClick={() => toggleDoctorExpansion(doctor.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                  {doctor.profileImage ? (
                    <img src={doctor.profileImage} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={32} className="text-slate-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-slate-900">{doctor.name}</h4>
                        {doctor.verified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            <Shield size={12} />
                            Verified
                          </div>
                        )}
                        {doctor.featured && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <Star size={12} />
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <div className="flex items-center gap-1">
                          {getSpecialtyIcon(doctor.specialty)}
                          <span>{doctor.specialty}</span>
                        </div>
                        <span>•</span>
                        <span>{doctor.experience} years experience</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                          <span>({doctor.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{doctor.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doctor.subSpecialties.slice(0, 3).map((sub, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {sub}
                          </span>
                        ))}
                        {doctor.subSpecialties.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            +{doctor.subSpecialties.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span className="font-medium">${doctor.consultationFee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Next: {doctor.nextAvailable}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap size={14} />
                          <span>{doctor.responseTime}min response</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ChevronRight 
                        className={`text-slate-400 transition-transform ${
                          expandedDoctor === doctor.id ? 'rotate-90' : ''
                        }`} 
                        size={20} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expandedDoctor === doctor.id && (
              <div className="border-t border-slate-200 p-6 bg-slate-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Detailed Info */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Consultation Types</h5>
                      <div className="flex flex-wrap gap-2">
                        {doctor.consultationTypes.map((type) => (
                          <span key={type} className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded text-sm">
                            {type === 'video' && <Video size={14} />}
                            {type === 'phone' && <Phone size={14} />}
                            {type === 'in-person' && <Building size={14} />}
                            <span className="capitalize">{type}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Languages</h5>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((lang) => (
                          <span key={lang} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Education & Training</h5>
                      <p className="text-sm text-slate-600">{doctor.education}</p>
                    </div>

                    {doctor.hospital && (
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Hospital Affiliation</h5>
                        <p className="text-sm text-slate-600">{doctor.hospital}</p>
                      </div>
                    )}

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Achievements</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {doctor.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Award size={14} className="text-yellow-500" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Available Slots */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">
                        Available Slots for {selectedDate.toLocaleDateString()}
                      </h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {getAvailabilityForDoctor(doctor.id).length > 0 ? (
                          getAvailabilityForDoctor(doctor.id).map((slot) => (
                            <div key={slot.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Clock size={16} className="text-slate-400" />
                                <div>
                                  <p className="font-medium text-slate-900">{slot.startTime}</p>
                                  <p className="text-sm text-slate-600">{slot.consultationType} • {slot.duration}min</p>
                                  {slot.price && (
                                    <p className="text-sm text-slate-600">${slot.price}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => bookAppointment(doctor.id, slot.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Book
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-500 py-4">No available slots for this date</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        View Full Profile
                      </button>
                      <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Search className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No doctors found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setFilters({
                specialty: '',
                consultationType: '',
                priceRange: [0, 1000],
                rating: 0,
                availability: '',
                language: '',
                experience: 0,
                verified: false
              });
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
