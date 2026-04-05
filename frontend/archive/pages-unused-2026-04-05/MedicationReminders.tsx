import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Smartphone, 
  Watch, 
  Volume2, 
  VolumeX, 
  Repeat, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Heart, 
  Activity, 
  Zap, 
  Shield, 
  Camera, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Info, 
  X, 
  Users, 
  User, 
  Stethoscope, 
  AlertTriangle
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface MedicationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  reminderTimes: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  adherenceRate: number;
  missedDoses: number;
  takenDoses: number;
  totalDoses: number;
  nextDose: string;
  prescribedBy: string;
  color: string;
  icon: string;
  notes?: string;
  sideEffects?: string[];
  interactions?: string[];
  refillReminder: boolean;
  refillDate?: string;
}

interface AdherenceData {
  date: string;
  taken: boolean;
  time?: string;
  notes?: string;
}

interface MedicationHistory {
  medicationId: string;
  medicationName: string;
  startDate: string;
  endDate?: string;
  adherenceRate: number;
  totalDays: number;
  takenDays: number;
  notes: string[];
}

interface SmartDevice {
  id: string;
  name: string;
  type: 'watch' | 'phone' | 'tablet' | 'smart_dispenser';
  isConnected: boolean;
  lastSync: string;
  notifications: boolean;
  vibration: boolean;
  sound: boolean;
}

export default function MedicationReminders() {
  const [activeTab, setActiveTab] = useState<'reminders' | 'adherence' | 'history' | 'devices'>('reminders');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [expandedReminders, setExpandedReminders] = useState<Record<string, boolean>>({});

  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [adherenceData, setAdherenceData] = useState<Record<string, AdherenceData[]>>({});
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([]);
  const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([]);

  const [newReminder, setNewReminder] = useState<Partial<MedicationReminder>>({
    reminderTimes: ['09:00', '21:00'],
    isActive: true,
    adherenceRate: 0,
    missedDoses: 0,
    takenDoses: 0,
    totalDoses: 0,
    color: '#3B82F6',
    icon: 'pill',
    refillReminder: true
  });

  useEffect(() => {
    fetchMedicationData();
  }, []);

  const fetchMedicationData = async () => {
    try {
      setLoading(true);
      const [remindersRes, adherenceRes, historyRes, devicesRes] = await Promise.all([
        api.get('/medication/reminders'),
        api.get('/medication/adherence'),
        api.get('/medication/history'),
        api.get('/medication/devices')
      ]);

      setReminders(remindersRes.data);
      setAdherenceData(adherenceRes.data);
      setMedicationHistory(historyRes.data);
      setSmartDevices(devicesRes.data);
    } catch (error) {
      console.error('Failed to fetch medication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedicationReminder = async () => {
    try {
      const response = await api.post('/medication/reminders', newReminder);
      setReminders([...reminders, response.data]);
      setShowAddReminder(false);
      setNewReminder({
        reminderTimes: ['09:00', '21:00'],
        isActive: true,
        adherenceRate: 0,
        missedDoses: 0,
        takenDoses: 0,
        totalDoses: 0,
        color: '#3B82F6',
        icon: 'pill',
        refillReminder: true
      });
    } catch (error) {
      console.error('Failed to add medication reminder:', error);
    }
  };

  const markDoseTaken = async (reminderId: string, time: string) => {
    try {
      await api.post(`/medication/reminders/${reminderId}/take`, { time });
      
      setReminders(prev => prev.map(reminder => 
        reminder.id === reminderId 
          ? { 
              ...reminder, 
              takenDoses: reminder.takenDoses + 1,
              adherenceRate: ((reminder.takenDoses + 1) / (reminder.takenDoses + reminder.missedDoses + 1)) * 100
            }
          : reminder
      ));

      setAdherenceData(prev => ({
        ...prev,
        [reminderId]: [
          ...(prev[reminderId] || []),
          {
            date: new Date().toISOString().split('T')[0],
            taken: true,
            time: new Date().toLocaleTimeString()
          }
        ]
      }));
    } catch (error) {
      console.error('Failed to mark dose as taken:', error);
    }
  };

  const markDoseMissed = async (reminderId: string, time: string) => {
    try {
      await api.post(`/medication/reminders/${reminderId}/miss`, { time });
      
      setReminders(prev => prev.map(reminder => 
        reminder.id === reminderId 
          ? { 
              ...reminder, 
              missedDoses: reminder.missedDoses + 1,
              adherenceRate: (reminder.takenDoses / (reminder.takenDoses + reminder.missedDoses + 1)) * 100
            }
          : reminder
      ));

      setAdherenceData(prev => ({
        ...prev,
        [reminderId]: [
          ...(prev[reminderId] || []),
          {
            date: new Date().toISOString().split('T')[0],
            taken: false,
            time: new Date().toLocaleTimeString()
          }
        ]
      }));
    } catch (error) {
      console.error('Failed to mark dose as missed:', error);
    }
  };

  const toggleReminder = async (reminderId: string) => {
    try {
      await api.patch(`/medication/reminders/${reminderId}/toggle`);
      setReminders(prev => prev.map(reminder => 
        reminder.id === reminderId ? { ...reminder, isActive: !reminder.isActive } : reminder
      ));
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      await api.delete(`/medication/reminders/${reminderId}`);
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const syncDevice = async (deviceId: string) => {
    try {
      await api.post(`/medication/devices/${deviceId}/sync`);
      setSmartDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date().toISOString() }
          : device
      ));
    } catch (error) {
      console.error('Failed to sync device:', error);
    }
  };

  const toggleReminderExpansion = (id: string) => {
    setExpandedReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getNextDoseTime = (times: string[]) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    for (const time of times) {
      if (time > currentTime) {
        return time;
      }
    }
    return times[0]; // First dose tomorrow
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && reminder.isActive) ||
                         (filterStatus === 'inactive' && !reminder.isActive);
    return matchesSearch && matchesStatus;
  });

  const getOverallAdherence = () => {
    if (reminders.length === 0) return 0;
    const totalTaken = reminders.reduce((sum, r) => sum + r.takenDoses, 0);
    const totalDoses = reminders.reduce((sum, r) => sum + r.takenDoses + r.missedDoses, 0);
    return totalDoses > 0 ? (totalTaken / totalDoses) * 100 : 0;
  };

  const getTodayDoses = () => {
    const today = new Date().toISOString().split('T')[0];
    let totalDoses = 0;
    let takenDoses = 0;

    reminders.forEach(reminder => {
      if (reminder.isActive) {
        totalDoses += reminder.reminderTimes.length;
        const todayData = adherenceData[reminder.id]?.filter(d => d.date === today) || [];
        takenDoses += todayData.filter(d => d.taken).length;
      }
    });

    return { totalDoses, takenDoses };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading medication reminders..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Medication Reminders</h1>
            <p className="text-slate-600 mt-1">Never miss a dose with smart reminders and tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-600">Overall Adherence</p>
              <p className="text-2xl font-bold text-slate-900">{getOverallAdherence().toFixed(1)}%</p>
            </div>
            <button
              onClick={() => setShowAddReminder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Active Reminders</p>
              <p className="text-2xl font-bold text-slate-900">
                {reminders.filter(r => r.isActive).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {getTodayDoses().takenDoses}/{getTodayDoses().totalDoses} taken today
              </p>
            </div>
            <Bell className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Next Dose</p>
              <p className="text-2xl font-bold text-slate-900">
                {reminders.filter(r => r.isActive).length > 0 
                  ? getNextDoseTime(reminders.filter(r => r.isActive)[0].reminderTimes)
                  : 'N/A'
                }
              </p>
              <p className="text-xs text-slate-500 mt-1">Upcoming medication</p>
            </div>
            <Clock className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Missed Doses</p>
              <p className="text-2xl font-bold text-slate-900">
                {reminders.reduce((sum, r) => sum + r.missedDoses, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">This week</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Connected Devices</p>
              <p className="text-2xl font-bold text-slate-900">
                {smartDevices.filter(d => d.isConnected).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Synced devices</p>
            </div>
            <Smartphone className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'reminders', name: 'Reminders', icon: Bell },
              { id: 'adherence', name: 'Adherence', icon: Target },
              { id: 'history', name: 'History', icon: Clock },
              { id: 'devices', name: 'Devices', icon: Smartphone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredReminders.map((reminder) => (
                  <div key={reminder.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleReminderExpansion(reminder.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {expandedReminders[reminder.id] ? 
                            <ChevronDown className="text-slate-400 mt-1" size={20} /> : 
                            <ChevronRight className="text-slate-400 mt-1" size={20} />
                          }
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: reminder.color + '20' }}>
                            <Pill size={24} style={{ color: reminder.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-900">{reminder.medicationName}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                reminder.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                              }`}>
                                {reminder.isActive ? 'Active' : 'Inactive'}
                              </span>
                              {reminder.nextDose && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  Next: {reminder.nextDose}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{reminder.dosage} • {reminder.frequency}</p>
                            <p className="text-sm text-slate-600">{reminder.instructions}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdherenceColor(reminder.adherenceRate)}`}>
                                {reminder.adherenceRate.toFixed(1)}% adherence
                              </span>
                              <span className="text-slate-600">
                                {reminder.takenDoses} taken, {reminder.missedDoses} missed
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Prescribed by Dr. {reminder.prescribedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReminder(reminder.id);
                            }}
                            className={`p-2 rounded-lg ${
                              reminder.isActive ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {reminder.isActive ? <Bell size={16} /> : <Bell size={16} />}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit reminder
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteReminder(reminder.id);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedReminders[reminder.id] && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Today's Doses</h5>
                            <div className="space-y-2">
                              {reminder.reminderTimes.map((time) => {
                                const today = new Date().toISOString().split('T')[0];
                                const todayData = adherenceData[reminder.id]?.find(d => d.date === today && d.time?.startsWith(time.slice(0, 2)));
                                const isPast = time < new Date().toTimeString().slice(0, 5);
                                
                                return (
                                  <div key={time} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                      <Clock size={16} className="text-slate-400" />
                                      <span className="font-medium text-slate-900">{time}</span>
                                      {todayData && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                          todayData.taken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {todayData.taken ? 'Taken' : 'Missed'}
                                        </span>
                                      )}
                                    </div>
                                    {!todayData && isPast && (
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => markDoseTaken(reminder.id, time)}
                                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                          Take Now
                                        </button>
                                        <button
                                          onClick={() => markDoseMissed(reminder.id, time)}
                                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                          Skip
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {reminder.notes && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Notes</h5>
                              <p className="text-sm text-slate-600">{reminder.notes}</p>
                            </div>
                          )}

                          {reminder.sideEffects && reminder.sideEffects.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Side Effects</h5>
                              <div className="space-y-1">
                                {reminder.sideEffects.map((effect, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <AlertTriangle className="text-yellow-500" size={14} />
                                    <span className="text-sm text-slate-600">{effect}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {reminder.interactions && reminder.interactions.length > 0 && (
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Drug Interactions</h5>
                              <div className="space-y-1">
                                {reminder.interactions.map((interaction, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <AlertCircle className="text-orange-500" size={14} />
                                    <span className="text-sm text-slate-600">{interaction}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adherence Tab */}
          {activeTab === 'adherence' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Adherence Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Weekly Adherence</h4>
                  <div className="h-48 flex items-center justify-center">
                    <BarChart3 className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Adherence Chart</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Medication Performance</h4>
                  <div className="space-y-3">
                    {reminders.slice(0, 5).map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: reminder.color + '20' }}>
                            <Pill size={16} style={{ color: reminder.color }} />
                          </div>
                          <span className="text-sm font-medium text-slate-900">{reminder.medicationName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${reminder.adherenceRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600">{reminder.adherenceRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Adherence Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="text-green-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Improving Trend</p>
                      <p className="text-sm text-slate-600">Your adherence has improved by 15% this month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="text-blue-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Best Performance</p>
                      <p className="text-sm text-slate-600">Morning doses have 95% adherence rate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Needs Attention</p>
                      <p className="text-sm text-slate-600">Evening doses frequently missed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Medication History</h3>
              
              <div className="space-y-3">
                {medicationHistory.map((history) => (
                  <div key={history.medicationId} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Pill size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{history.medicationName}</h4>
                          <p className="text-sm text-slate-600">
                            {new Date(history.startDate).toLocaleDateString()} - 
                            {history.endDate ? new Date(history.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-slate-600">
                              {history.takenDays}/{history.totalDays} days taken
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdherenceColor(history.adherenceRate)}`}>
                              {history.adherenceRate.toFixed(1)}% adherence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Connected Devices</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Device
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartDevices.map((device) => (
                  <div key={device.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          device.isConnected ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          {device.type === 'watch' && <Watch size={24} className={device.isConnected ? 'text-green-600' : 'text-slate-600'} />}
                          {device.type === 'phone' && <Smartphone size={24} className={device.isConnected ? 'text-green-600' : 'text-slate-600'} />}
                          {device.type === 'tablet' && <Smartphone size={24} className={device.isConnected ? 'text-green-600' : 'text-slate-600'} />}
                          {device.type === 'smart_dispenser' && <Pill size={24} className={device.isConnected ? 'text-green-600' : 'text-slate-600'} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{device.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              device.isConnected ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {device.isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 capitalize">
                            {device.type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Last sync: {device.lastSync ? new Date(device.lastSync).toLocaleString() : 'Never'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className={`flex items-center gap-1 ${
                              device.notifications ? 'text-green-600' : 'text-slate-400'
                            }`}>
                              <Bell size={14} />
                              Notifications
                            </span>
                            <span className={`flex items-center gap-1 ${
                              device.vibration ? 'text-green-600' : 'text-slate-400'
                            }`}>
                              <Activity size={14} />
                              Vibration
                            </span>
                            <span className={`flex items-center gap-1 ${
                              device.sound ? 'text-green-600' : 'text-slate-400'
                            }`}>
                              <Volume2 size={14} />
                              Sound
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => syncDevice(device.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add Medication Reminder</h2>
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Medication Name</label>
                  <input
                    type="text"
                    value={newReminder.medicationName || ''}
                    onChange={(e) => setNewReminder({...newReminder, medicationName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Aspirin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={newReminder.dosage || ''}
                    onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 100mg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                <input
                  type="text"
                  value={newReminder.frequency || ''}
                  onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Twice daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
                <textarea
                  value={newReminder.instructions || ''}
                  onChange={(e) => setNewReminder({...newReminder, instructions: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Take with food"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reminder Times</label>
                <div className="space-y-2">
                  {newReminder.reminderTimes?.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const times = [...(newReminder.reminderTimes || [])];
                          times[index] = e.target.value;
                          setNewReminder({...newReminder, reminderTimes: times});
                        }}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => {
                          const times = newReminder.reminderTimes?.filter((_, i) => i !== index) || [];
                          setNewReminder({...newReminder, reminderTimes: times});
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setNewReminder({
                        ...newReminder,
                        reminderTimes: [...(newReminder.reminderTimes || []), '12:00']
                      });
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    <Plus size={16} />
                    Add Time
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newReminder.isActive}
                  onChange={(e) => setNewReminder({...newReminder, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-700">Activate reminder immediately</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addMedicationReminder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
