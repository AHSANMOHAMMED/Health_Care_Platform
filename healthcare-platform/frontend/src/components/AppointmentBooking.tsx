import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Phone, 
  Video, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  Stethoscope,
  CreditCard,
  FileText
} from 'lucide-react';
import { doctorAPI, appointmentAPI } from '../services/api';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  consultationFee: number;
  availableSlots: string[];
  avatar: string;
  nextAvailable: string;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    experience: '10 years',
    location: 'New York, NY',
    consultationFee: 150,
    availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
    avatar: 'SJ',
    nextAvailable: 'Today'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    rating: 4.8,
    experience: '8 years',
    location: 'Los Angeles, CA',
    consultationFee: 175,
    availableSlots: ['11:00 AM', '01:00 PM', '04:00 PM'],
    avatar: 'MC',
    nextAvailable: 'Tomorrow'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    experience: '12 years',
    location: 'Chicago, IL',
    consultationFee: 125,
    availableSlots: ['08:30 AM', '10:00 AM', '02:30 PM'],
    avatar: 'ER',
    nextAvailable: 'Today'
  }
];

export default function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch doctors when specialty is selected
  useEffect(() => {
    if (selectedSpecialty) {
      const fetchDoctors = async () => {
        setLoading(true);
        try {
          const data = await doctorAPI.searchDoctors({
            specialty: selectedSpecialty,
            page: 1,
            limit: 20
          });
          setDoctors(data.doctors || mockDoctors);
        } catch (error) {
          console.error('Failed to fetch doctors:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [selectedSpecialty]);

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setBookingLoading(true);
    try {
      const appointment = await appointmentAPI.createAppointment({
        doctorId: selectedDoctor.id.toString(),
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        notes: `Booked via ${consultationType} consultation`
      });
      
      // Redirect to appointments or show success message
      alert('Appointment booked successfully!');
      // You can redirect to patient dashboard or appointments page
      window.location.href = '/patient';
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const specialties = [
    { name: 'Cardiology', icon: Heart, description: 'Heart and cardiovascular health' },
    { name: 'Neurology', icon: Stethoscope, description: 'Brain and nervous system' },
    { name: 'Pediatrics', icon: User, description: 'Children\'s healthcare' },
    { name: 'Orthopedics', icon: Heart, description: 'Bones and joints' },
    { name: 'Dermatology', icon: Heart, description: 'Skin conditions' },
    { name: 'Psychiatry', icon: Heart, description: 'Mental health' }
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.specialty === selectedSpecialty &&
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= stepNumber 
                ? 'healthcare-gradient text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-full h-1 mx-2 ${
                step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm">
        <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Specialty</span>
        <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Doctor</span>
        <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Schedule</span>
        <span className={step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Confirm</span>
      </div>
    </div>
  );

  const renderSpecialtySelection = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Specialty</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.map((specialty) => {
          const Icon = specialty.icon;
          return (
            <button
              key={specialty.name}
              onClick={() => {
                setSelectedSpecialty(specialty.name);
                setStep(2);
              }}
              className="feature-card text-left hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{specialty.name}</h3>
              <p className="text-sm text-gray-600">{specialty.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select a Doctor</h2>
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Change Specialty</span>
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="healthcare-input pl-10"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="feature-card">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full healthcare-gradient flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{doctor.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600 mb-2">{doctor.specialty} • {doctor.experience} experience</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{doctor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Next: {doctor.nextAvailable}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</p>
                    <p className="text-sm text-gray-500">per consultation</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {doctor.availableSlots.length} slots today
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Available
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setStep(3);
                    }}
                    className="healthcare-button text-sm px-6 py-2"
                  >
                    Select Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduleSelection = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
        <button
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Change Doctor</span>
        </button>
      </div>

      {selectedDoctor && (
        <div className="feature-card mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center">
              <span className="text-white font-semibold">{selectedDoctor.avatar}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
              <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Type</h3>
          <div className="space-y-3">
            <button
              onClick={() => setConsultationType('video')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                consultationType === 'video'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Video className={`h-6 w-6 ${consultationType === 'video' ? 'text-blue-600' : 'text-gray-600'}`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Video Consultation</p>
                  <p className="text-sm text-gray-600">Connect from anywhere</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setConsultationType('in-person')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                consultationType === 'in-person'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <User className={`h-6 w-6 ${consultationType === 'in-person' ? 'text-blue-600' : 'text-gray-600'}`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">In-Person Visit</p>
                  <p className="text-sm text-gray-600">Visit the clinic</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="healthcare-input mb-4"
            min={new Date().toISOString().split('T')[0]}
          />
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                  selectedTime === time
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setStep(4)}
          disabled={!selectedDate || !selectedTime}
          className="healthcare-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Confirmation
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Appointment</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="feature-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Doctor Information
            </h3>
            {selectedDoctor && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center">
                    <span className="text-white font-semibold">{selectedDoctor.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{selectedDoctor.rating}</span>
                  </div>
                  <span>{selectedDoctor.experience} experience</span>
                </div>
              </div>
            )}
          </div>

          <div className="feature-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">{consultationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">30 minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="feature-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-medium text-gray-900">${selectedDoctor?.consultationFee || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium text-gray-900">$10</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-gray-900">
                  ${(selectedDoctor?.consultultationFee || 0) + 10}
                </span>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Please arrive 10 minutes early for in-person visits</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Test your video setup before the consultation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Cancellation allowed up to 2 hours before</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button 
          className="healthcare-button"
          onClick={handleBookAppointment}
          disabled={bookingLoading}
        >
          {bookingLoading ? 'Booking...' : `Confirm & Pay $${(selectedDoctor?.consultationFee || 0) + 10}`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderProgressBar()}
        
        {step === 1 && renderSpecialtySelection()}
        {step === 2 && renderDoctorSelection()}
        {step === 3 && renderScheduleSelection()}
        {step === 4 && renderConfirmation()}
      </div>
    </div>
  );
}

// Add missing imports
import { Calendar as CalendarIcon } from 'lucide-react';
