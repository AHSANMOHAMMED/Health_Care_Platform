import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Calendar, Clock, Star, Stethoscope, Filter, Loader2, Video, Phone } from 'lucide-react';
import { api } from '../api/axios';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  available: boolean;
  nextAvailable: string;
  image?: string;
  consultationTypes: ('IN_PERSON' | 'VIDEO' | 'PHONE')[];
  languages: string[];
}

export default function DoctorAvailabilityFinder() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [availability, setAvailability] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctor-service/doctors');
      setDoctors(response.data || []);
    } catch (error) {
      // Demo data
      setDoctors([
        { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.8, reviews: 127, location: 'Colombo', available: true, nextAvailable: 'Today', consultationTypes: ['IN_PERSON', 'VIDEO'], languages: ['English', 'Sinhala'] },
        { id: 2, name: 'Dr. Michael Chen', specialty: 'General Practice', rating: 4.6, reviews: 89, location: 'Kandy', available: true, nextAvailable: 'Tomorrow', consultationTypes: ['IN_PERSON', 'PHONE'], languages: ['English', 'Tamil'] },
        { id: 3, name: 'Dr. Priya Sharma', specialty: 'Pediatrics', rating: 4.9, reviews: 203, location: 'Galle', available: false, nextAvailable: 'Apr 28', consultationTypes: ['IN_PERSON'], languages: ['English', 'Sinhala', 'Tamil'] },
        { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', rating: 4.7, reviews: 156, location: 'Colombo', available: true, nextAvailable: 'Today', consultationTypes: ['IN_PERSON', 'VIDEO'], languages: ['English'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const specialties = ['all', 'General Practice', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Dermatology'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === 'all' || doc.specialty === specialty;
    const matchesAvailability = availability === 'all' ||
                               (availability === 'today' && doc.nextAvailable === 'Today') ||
                               (availability === 'available' && doc.available);
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-[#0C1220] text-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1220]/90 backdrop-blur-md border-b border-[#1E3A5F]/30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/patient" className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Find a Doctor</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Search & Filters */}
          <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-4 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="w-full bg-[#0C1220] border border-[#1E3A5F]/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="bg-[#0C1220] border border-[#1E3A5F]/50 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="all">All Specialties</option>
                {specialties.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="bg-[#0C1220] border border-[#1E3A5F]/50 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="all">Any Availability</option>
                <option value="today">Available Today</option>
                <option value="available">Currently Available</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#0EA5E9]" size={32} />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="mx-auto text-slate-500 mb-4" size={48} />
              <p className="text-slate-400">No doctors found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <div key={doctor.id} className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="text-[#0EA5E9]" size={28} />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{doctor.name}</h3>
                          <p className="text-[#0EA5E9]">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-400 fill-yellow-400" size={16} />
                          <span className="text-white font-medium">{doctor.rating}</span>
                          <span className="text-slate-500">({doctor.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {doctor.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Next: {doctor.nextAvailable}
                        </span>
                        <span className="flex items-center gap-1">
                          {doctor.consultationTypes.includes('VIDEO') && <Video size={14} className="text-[#0EA5E9]" />}
                          {doctor.consultationTypes.includes('PHONE') && <Phone size={14} className="text-emerald-400" />}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {doctor.languages.map(lang => (
                          <span key={lang} className="px-2 py-1 bg-[#0C1220] rounded text-xs text-slate-400">
                            {lang}
                          </span>
                        ))}
                        {doctor.available && (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                            Available Now
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      to={`/booking?doctor=${doctor.id}`}
                      className="flex-shrink-0 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium px-6 py-3 rounded-xl text-center transition-all"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
