import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointmentLink, setLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/patients/me').then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const handleBook = () => {
    // Quick mock booking for assignment
    api.post('/appointments/book', { doctorId: 1, appointmentTime: new Date().toISOString() })
      .then(res => {
         alert("Booked Successfully! Email dispatched via RabbitMQ.");
         setLink(res.data.meetingLink);
      }).catch(console.error);
  }

  return (
    <div className="mt-8 animate-slide-up">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">Patient Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">My Medical Profile</h3>
          {profile ? (
            <div className="space-y-3 text-slate-600">
              <p><strong>Name:</strong> {profile.firstName || 'Not Set'} {profile.lastName}</p>
              <p><strong>Blood Group:</strong> {profile.bloodGroup || 'Not Set'}</p>
              <p><strong>History:</strong> {profile.medicalHistory || 'No remarks.'}</p>
            </div>
          ) : (
             <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold mb-2 text-indigo-800">Need a Consultation?</h3>
            <p className="text-slate-600 mb-6">Connect with a verified specialist instantly.</p>
            <button onClick={handleBook} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition">
              Book Appointment Express
            </button>
            {appointmentLink && (
               <button onClick={() => navigate('/video?link='+appointmentLink)} className="mt-4 px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow hover:bg-teal-600 transition">
                  Join Video Session
               </button>
            )}
        </div>
      </div>
    </div>
  );
}
