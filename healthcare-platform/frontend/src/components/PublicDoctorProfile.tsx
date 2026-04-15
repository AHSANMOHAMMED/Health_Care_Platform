import React, { useState, useEffect } from 'react';
import api from '../api';

interface Doctor {
  userId: string;
  fullName: string;
  specialty: string;
  bio?: string;
  verified: boolean;
}

interface AvailabilitySlot {
  id: string;
  startAt: string;
  endAt: string;
}

interface PublicDoctorProfileProps {
  doctorId: string;
  onBack: () => void;
}

export function PublicDoctorProfile({ doctorId, onBack }: PublicDoctorProfileProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctorProfile();
    fetchAvailability();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      // This endpoint would need to be created in the backend
      const response = await api.get(`/api/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      // This endpoint would need to be created in the backend
      const response = await api.get(`/api/doctors/${doctorId}/availability`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const handleBookAppointment = async (slotId: string) => {
    setBookingSlot(slotId);
    try {
      await api.post('/api/appointments', {
        doctorUserId: doctorId,
        availabilitySlotId: slotId,
      });
      // Refresh availability
      fetchAvailability();
      setBookingSlot(null);
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
      setBookingSlot(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor not found</h3>
        <p className="text-gray-500 mb-4">The doctor profile you're looking for doesn't exist.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search
      </button>

      {/* Doctor Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-600">
              {doctor.fullName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{doctor.fullName}</h1>
            <p className="text-xl text-gray-600 mt-1">{doctor.specialty}</p>
            <div className="flex items-center mt-3 space-x-3">
              {doctor.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Doctor
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {doctor.specialty}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-600 leading-relaxed">
            {doctor.bio || 'No bio available for this doctor.'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{availability.length}</p>
          <p className="text-sm text-gray-600">Available Slots</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">95%</p>
          <p className="text-sm text-gray-600">Success Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-gray-600">Patient Rating</p>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Appointments</h2>
        <div className="space-y-3">
          {availability.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No available appointments at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">Please check back later.</p>
            </div>
          ) : (
            availability.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(slot.startAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(slot.startAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(slot.endAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleBookAppointment(slot.id)}
                  disabled={bookingSlot === slot.id}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {bookingSlot === slot.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
