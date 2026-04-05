import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Calendar as CalendarIcon, CreditCard, Activity } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  consultationFee: number;
  rating?: number;
  location?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingFlow() {
  const navigate = useNavigate();
  const { user, userId } = useAuthStore();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');

  // Mock time slots data
  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: true },
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctor-service/doctors');
      if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.warn('Failed to fetch doctors, using fallback data', error);
      // Fallback demo data
      setDoctors([
        { 
          id: 2, 
          firstName: "Sarah", 
          lastName: "Jenkins", 
          specialization: "Cardiologist", 
          consultationFee: 3500,
          rating: 4.8,
          location: "Colombo"
        },
        { 
          id: 3, 
          firstName: "Amal", 
          lastName: "Perera", 
          specialization: "General Physician", 
          consultationFee: 2000,
          rating: 4.6,
          location: "Kandy"
        },
        { 
          id: 4, 
          firstName: "Nisha", 
          lastName: "Patel", 
          specialization: "Pediatrician", 
          consultationFee: 2500,
          rating: 4.9,
          location: "Galle"
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    setError('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
    setError('');
  };

  const handleConfirmBooking = async () => {
    if (!user || !userId) {
      setError('You must be signed in to confirm an appointment.');
      return;
    }

    if (!selectedDoctor || !selectedTime) {
      setError('Please select a doctor and time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      const appointmentData = {
        patientId: userId,
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate || new Date().toISOString().split('T')[0],
        appointmentTime: selectedTime.replace(' AM', ':00').replace(' PM', ':00'),
        status: 'PENDING',
        symptoms: 'Routine Checkup',
        consultationFee: selectedDoctor.consultationFee
      };

      await api.post('/appointment-service/appointments', appointmentData);
      
      // Success - redirect to patient dashboard
      alert('Appointment successfully booked!');
      navigate('/patient');
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedDoctor) return 0;
    return selectedDoctor.consultationFee + 200; // Adding platform fee
  };

    return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(s => (
          <div 
            key={s} 
            className={`h-10 w-10 flex items-center justify-center rounded-full font-bold text-sm ${
              step >= s ? 'bg-blue-600 text-white border-4 border-white shadow-sm' : 'bg-slate-200 text-slate-500 border-4 border-white'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Doctor Selection */}
      {step === 1 && (
        <div className="animate-in fade-in">
          <h2 className="text-2xl font-bold mb-6">Select a Specialist</h2>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Activity className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id} 
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:border-blue-600 transition group cursor-pointer" 
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctor.firstName}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-slate-500 text-sm">{doctor.specialization}</p>
                      {doctor.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                          <MapPin size={12} />
                          {doctor.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {doctor.rating && (
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    )}
                    <p className="text-blue-600 font-bold text-xl">LKR {doctor.consultationFee}</p>
                    <button className="mt-2 bg-slate-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Time Slot Selection */}
      {step === 2 && selectedDoctor && (
        <div className="animate-in slide-in-from-right-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex gap-4 items-center mb-8 pb-8 border-b border-slate-100">
            <button 
              onClick={() => setStep(1)} 
              className="text-slate-400 hover:text-slate-800 font-bold"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold flex-1 text-center">Select Time Slot</h2>
          </div>
          
          {/* Selected Doctor Info */}
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedDoctor.firstName}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h3>
                <p className="text-slate-600 text-sm">{selectedDoctor.specialization}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="text-blue-600"/>
              Available Time Slots
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map(slot => (
                <button 
                  key={slot.time} 
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 text-sm font-medium border rounded-xl transition ${
                    slot.available 
                      ? 'border-slate-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation & Payment */}
      {step === 3 && selectedDoctor && selectedTime && (
        <div className="animate-in slide-in-from-right-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex gap-4 items-center mb-8 pb-8 border-b border-slate-100">
            <button 
              onClick={() => setStep(2)} 
              className="text-slate-400 hover:text-slate-800 font-bold"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold flex-1 text-center">Confirm & Pay</h2>
          </div>

          {/* Appointment Summary */}
          <div className="bg-slate-50 p-6 rounded-xl mb-6">
            <h3 className="font-bold mb-4">Appointment Details</h3>
            
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedDoctor.firstName}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                <p className="text-slate-600 text-sm">{selectedDoctor.specialization}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{selectedDate || 'Today'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-50 p-6 rounded-xl mb-6">
            <h3 className="font-bold mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="font-bold">LKR {selectedDoctor.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Fee</span>
                <span className="font-bold">LKR 200</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-blue-600">LKR {calculateTotal()}</span>
              </div>
            </div>
          </div>

          {!user && (
            <div className="mb-4 text-center text-sm text-red-600 font-bold bg-red-50 p-3 rounded-lg">
              You must be signed in to confirm an appointment.
            </div>
          )}
          
          <button 
            onClick={handleConfirmBooking} 
            disabled={bookingLoading || !user}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 flex justify-center items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingLoading ? (
              <>
                <Activity className="animate-spin" /> 
                Processing Booking...
              </>
            ) : (
              <>
                <CreditCard /> 
                Confirm & Pay Securely
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
