import { useState } from 'react';
import { 
  Calendar, 
  Video, 
  Clock, 
  User, 
  FileText, 
  Heart,
  Activity,
  Pill,
  MessageCircle,
  Search,
  Filter,
  ChevronRight,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

const AgoraVideoRoom = ({ appId, channel, token, uid }: any) => {
  return (
    <div className="healthcare-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Video Consultation</h3>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Ready to connect</span>
        </div>
      </div>
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Video consultation room</p>
          <p className="text-sm text-gray-500">Channel: {channel}</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-3">
        <button className="flex-1 healthcare-button">Join Call</button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Test Audio
        </button>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [channel, setChannel] = useState('demo-channel');
  const [token, setToken] = useState('mock-token');
  const [appId, setAppId] = useState(import.meta.env.VITE_AGORA_APP_ID || 'demo-app-id');

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Today',
      time: '2:30 PM',
      type: 'Video Consultation',
      avatar: 'SJ'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Neurology',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'In-Person Visit',
      avatar: 'MC'
    }
  ];

  const recentDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: '10 years',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      rating: 4.9,
      experience: '8 years',
      avatar: 'MC'
    }
  ];

  const healthStats = [
    {
      label: 'Heart Rate',
      value: '72 bpm',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      status: 'Normal'
    },
    {
      label: 'Blood Pressure',
      value: '120/80',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      status: 'Optimal'
    },
    {
      label: 'Medications',
      value: '3 Active',
      icon: Pill,
      color: 'from-green-500 to-emerald-500',
      status: 'On Track'
    },
    {
      label: 'Next Checkup',
      value: '5 days',
      icon: Calendar,
      color: 'from-purple-500 to-indigo-500',
      status: 'Scheduled'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultation', label: 'Video Consultation', icon: Video },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Patient!
          </h1>
          <p className="text-gray-600">
            Here's your health overview and upcoming appointments.
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
            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="feature-card">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="healthcare-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">{appointment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.date}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.type === 'Video Consultation' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 healthcare-button">
                  Book New Appointment
                </button>
              </div>

              {/* Recent Doctors */}
              <div className="healthcare-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Doctors</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Find More
                  </button>
                </div>
                <div className="space-y-4">
                  {recentDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">{doctor.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-600">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">{doctor.experience}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
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
              </div>
            </div>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found</p>
              <button className="mt-4 healthcare-button">
                Book Your First Appointment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'consultation' && (
          <div className="space-y-6">
            <div className="healthcare-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Video Consultation Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="healthcare-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="healthcare-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="healthcare-input"
                  />
                </div>
              </div>
            </div>
            <AgoraVideoRoom appId={appId} channel={channel} token={token} uid={1001} />
          </div>
        )}

        {activeTab === 'records' && (
          <div className="healthcare-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Records</h2>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No medical records available</p>
              <button className="mt-4 healthcare-button">
                Upload Medical Records
              </button>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="healthcare-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <button className="mt-4 healthcare-button">
                Start a Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
