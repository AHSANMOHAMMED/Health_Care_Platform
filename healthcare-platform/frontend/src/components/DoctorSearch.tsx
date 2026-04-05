import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Phone, 
  Video, 
  Calendar,
  Heart,
  Stethoscope,
  User,
  Clock,
  DollarSign,
  CheckCircle,
  Award,
  Languages,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { doctorAPI } from '../services/api';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  consultationFee: number;
  languages: string[];
  education: string;
  about: string;
  availableToday: boolean;
  nextAvailable: string;
  avatar: string;
  verified: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviews: 234,
    experience: '10 years',
    location: 'New York, NY',
    consultationFee: 150,
    languages: ['English', 'Spanish', 'French'],
    education: 'Harvard Medical School',
    about: 'Dr. Johnson is a board-certified cardiologist with expertise in preventive cardiology and heart disease management.',
    availableToday: true,
    nextAvailable: 'Today, 2:00 PM',
    avatar: 'SJ',
    verified: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    rating: 4.8,
    reviews: 189,
    experience: '8 years',
    location: 'Los Angeles, CA',
    consultationFee: 175,
    languages: ['English', 'Mandarin', 'Cantonese'],
    education: 'Johns Hopkins University',
    about: 'Specializing in neurodegenerative disorders and stroke rehabilitation with a patient-centered approach.',
    availableToday: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
    avatar: 'MC',
    verified: true
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviews: 312,
    experience: '12 years',
    location: 'Chicago, IL',
    consultationFee: 125,
    languages: ['English', 'Spanish'],
    education: 'Stanford University School of Medicine',
    about: 'Dedicated pediatrician focused on child development and preventive care from infancy through adolescence.',
    availableToday: true,
    nextAvailable: 'Today, 4:30 PM',
    avatar: 'ER',
    verified: true
  }
];

const specialties = [
  'All Specialties', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
  'Dermatology', 'Psychiatry', 'Gynecology', 'Oncology', 'Endocrinology'
];

export default function DoctorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [loading, setLoading] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await doctorAPI.searchDoctors({
          specialty: selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
          page: 1,
          limit: 50
        });
        setDoctors(data.doctors || mockDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    const matchesPrice = doctor.consultationFee >= priceRange[0] && doctor.consultationFee <= priceRange[1];
    
    return matchesSearch && matchesSpecialty && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.consultationFee - b.consultationFee;
      case 'price-high':
        return b.consultationFee - a.consultationFee;
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      default:
        return 0;
    }
  });

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div className="feature-card hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full healthcare-gradient flex items-center justify-center">
            <span className="text-white font-bold text-xl">{doctor.avatar}</span>
          </div>
          {doctor.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {doctor.name}
                {doctor.verified && (
                  <Award className="h-4 w-4 text-blue-500 ml-2" />
                )}
              </h3>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</p>
              <p className="text-sm text-gray-500">per consultation</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{doctor.rating}</span>
              <span className="text-gray-500 ml-1">({doctor.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{doctor.experience}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{doctor.location}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doctor.about}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-xs text-gray-500">
                <Languages className="h-3 w-3 mr-1" />
                <span>{doctor.languages.slice(0, 2).join(', ')}</span>
              </div>
              {doctor.availableToday && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Available Today
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Profile
              </button>
              <button className="healthcare-button text-sm px-4 py-2">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DoctorProfileModal = ({ doctor }: { doctor: Doctor }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="healthcare-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full healthcare-gradient flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{doctor.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  {doctor.name}
                  {doctor.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500 ml-2" />
                  )}
                </h2>
                <p className="text-lg text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-gray-500 ml-1">({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{doctor.experience}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600">{doctor.about}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Education & Training</h3>
                <div className="flex items-center space-x-3 text-gray-600">
                  <GraduationCap className="h-5 w-5" />
                  <span>{doctor.education}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Next Available:</span>
                    <span className="font-medium text-green-600">{doctor.nextAvailable}</span>
                  </div>
                  {doctor.availableToday && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Available for consultation today</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="feature-card">
                <h3 className="font-semibold text-gray-900 mb-4">Consultation Options</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 text-left flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span>Video Consultation</span>
                    </div>
                    <span className="font-semibold">${doctor.consultationFee}</span>
                  </button>
                  <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 text-left flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>In-Person Visit</span>
                    </div>
                    <span className="font-semibold">${doctor.consultationFee + 25}</span>
                  </button>
                </div>
              </div>

              <div className="feature-card">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>
              </div>

              <button className="w-full healthcare-button">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-600">Connect with certified healthcare professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="healthcare-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name, specialty, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="healthcare-input pl-10"
                />
              </div>
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="healthcare-input"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="healthcare-input"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>
            <p className="text-sm text-gray-600">
              {filteredDoctors.length} doctors found
            </p>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select className="healthcare-input">
                    <option>Any time</option>
                    <option>Available today</option>
                    <option>This week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select className="healthcare-input">
                    <option>No preference</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* Doctor Profile Modal */}
        {selectedDoctor && (
          <DoctorProfileModal doctor={selectedDoctor} />
        )}
      </div>
    </div>
  );
}
