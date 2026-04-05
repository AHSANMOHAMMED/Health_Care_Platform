import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  Heart,
  Activity,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Video,
  Star,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const todayAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      time: '9:00 AM',
      type: 'Video Consultation',
      status: 'Confirmed',
      reason: 'Follow-up consultation',
      avatar: 'JS'
    },
    {
      id: 2,
      patient: 'Emily Davis',
      time: '10:30 AM',
      type: 'In-Person',
      status: 'Confirmed',
      reason: 'Initial consultation',
      avatar: 'ED'
    },
    {
      id: 3,
      patient: 'Robert Wilson',
      time: '2:00 PM',
      type: 'Video Consultation',
      status: 'Pending',
      reason: 'Routine checkup',
      avatar: 'RW'
    }
  ];

  const recentPatients = [
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      lastVisit: '2 days ago',
      condition: 'Hypertension',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Emily Davis',
      age: 32,
      lastVisit: '1 week ago',
      condition: 'Anxiety',
      avatar: 'ED'
    }
  ];

  const stats = [
    {
      label: 'Today\'s Appointments',
      value: '8',
      change: '+2 from yesterday',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      label: 'Total Patients',
      value: '247',
      change: '+12 this month',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    {
      label: 'Avg. Rating',
      value: '4.9',
      change: 'Excellent',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      trend: 'stable'
    },
    {
      label: 'Monthly Earnings',
      value: '$8,450',
      change: '+15% from last month',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'earnings', label: 'Earnings', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your appointments, patients, and schedule.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="feature-card">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      <span className="text-xs text-green-600">{stat.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Today's Schedule & Recent Patients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Today's Appointments */}
              <div className="healthcare-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">{appointment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            appointment.type === 'Video Consultation' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {appointment.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                        <div className="mt-2 flex space-x-1">
                          {appointment.type === 'Video Consultation' && (
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Video className="h-4 w-4" />
                            </button>
                          )}
                          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Patients */}
              <div className="healthcare-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">{patient.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.condition} • Age {patient.age}</p>
                        <p className="text-xs text-gray-500 mt-1">Last visit: {patient.lastVisit}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 healthcare-button">
                  View All Patients
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="healthcare-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Appointments</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                <button className="healthcare-button">
                  Add Appointment
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{appointment.avatar}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                            <div className="text-sm text-gray-500">{appointment.reason}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Today, {appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.type === 'Video Consultation' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {appointment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.type === 'Video Consultation' && (
                            <button className="text-blue-600 hover:text-blue-900">
                              <Video className="h-4 w-4" />
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-900">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="healthcare-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Patient Management</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="healthcare-button">
                  Add Patient
                </button>
              </div>
            </div>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Patient management features coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="healthcare-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Management</h2>
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Schedule management features coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="healthcare-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">$8,450</p>
                <p className="text-sm text-green-600">This Month</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">+15%</p>
                <p className="text-sm text-blue-600">Growth Rate</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">$125</p>
                <p className="text-sm text-purple-600">Avg per Consultation</p>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">Detailed earnings analytics coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
