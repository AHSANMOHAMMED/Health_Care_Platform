import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, FileText, Search, Filter, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  consultationType: 'IN_PERSON' | 'VIDEO';
  notes?: string;
}

interface DoctorStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
}

export default function DoctorDashboard() {
  const { user, userId } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointment-service/doctor/${userId}/appointments`);
      if (response.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      // Fallback demo data
      setAppointments([
        {
          id: 1,
          patientId: 101,
          patientName: "John Smith",
          patientEmail: "john.smith@email.com",
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: "10:00 AM",
          status: "CONFIRMED",
          symptoms: "Routine checkup and follow-up",
          consultationType: "IN_PERSON",
        },
        {
          id: 2,
          patientId: 102,
          patientName: "Sarah Johnson",
          patientEmail: "sarah.j@email.com",
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentTime: "02:00 PM",
          status: "PENDING",
          symptoms: "Headache and mild fever for 2 days",
          consultationType: "VIDEO",
        },
        {
          id: 3,
          patientId: 103,
          patientName: "Michael Chen",
          patientEmail: "m.chen@email.com",
          appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          appointmentTime: "11:00 AM",
          status: "PENDING",
          symptoms: "Chest pain and shortness of breath",
          consultationType: "IN_PERSON",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/appointment-service/doctor/${userId}/stats`);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Fallback demo stats
      setStats({
        totalAppointments: 45,
        pendingAppointments: 8,
        completedAppointments: 37,
        todayAppointments: 3,
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await api.patch(`/appointment-service/appointments/${appointmentId}`, { status });
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: status as any } : apt
        )
      );
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (selectedFilter) {
      case 'today':
        return apt.appointmentDate === new Date().toISOString().split('T')[0];
      case 'pending':
        return apt.status === 'PENDING';
      case 'completed':
        return apt.status === 'COMPLETED';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle size={16} />;
      case 'PENDING': return <AlertCircle size={16} />;
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Dr. {user?.firstName || 'User'}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Calendar size={18} className="inline mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Appointments</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Today</p>
              <p className="text-2xl font-bold text-purple-600">{stats.todayAppointments}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Appointments</option>
                <option value="today">Today</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Patient Avatar */}
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-slate-600">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Patient Info */}
                      <div>
                        <h3 className="font-semibold text-slate-900">{appointment.patientName}</h3>
                        <p className="text-sm text-slate-600">{appointment.patientEmail}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar size={14} />
                            {appointment.appointmentDate}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock size={14} />
                            {appointment.appointmentTime}
                          </span>
                          {appointment.consultationType === 'VIDEO' && (
                            <span className="text-sm text-blue-600 flex items-center gap-1">
                              <Video size={14} />
                              Video Consultation
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>

                      {/* Action Buttons */}
                      {appointment.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {appointment.status === 'CONFIRMED' && (
                        <div className="flex gap-2">
                          {appointment.consultationType === 'VIDEO' && (
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                              <Video size={14} />
                              Join Call
                            </button>
                          )}
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                          >
                            Complete
                          </button>
                        </div>
                      )}

                      <button className="p-2 text-slate-400 hover:text-slate-600 transition">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
