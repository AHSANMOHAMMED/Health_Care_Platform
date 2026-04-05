import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Video, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Settings, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  User, 
  Stethoscope, 
  Heart, 
  Activity, 
  FileText, 
  CreditCard, 
  Zap, 
  Shield, 
  Smartphone, 
  Watch, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Archive,
  Trash2,
  MarkAsRead,
  MoreVertical
} from 'lucide-react';
import { api } from '../api/axios';

interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'lab_result' | 'payment' | 'emergency' | 'system' | 'message' | 'video_call';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'medical' | 'administrative' | 'system' | 'social';
  sender?: {
    name: string;
    avatar?: string;
    role: string;
  };
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    appointmentId?: string;
    prescriptionId?: string;
    labResultId?: string;
    paymentId?: string;
    userId?: string;
  };
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  expiresAt?: string;
}

interface NotificationSettings {
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  categories: {
    appointments: boolean;
    prescriptions: boolean;
    labResults: boolean;
    payments: boolean;
    emergencies: boolean;
    system: boolean;
    messages: boolean;
    videoCalls: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  frequency: {
    immediate: boolean;
    digest: boolean;
    digestTime: string;
  };
}

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/notifications/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const response = await api.put('/notifications/settings', newSettings);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar size={20} className="text-blue-500" />;
      case 'prescription': return <Pill size={20} className="text-purple-500" />;
      case 'lab_result': return <FileText size={20} className="text-green-500" />;
      case 'payment': return <CreditCard size={20} className="text-orange-500" />;
      case 'emergency': return <AlertTriangle size={20} className="text-red-500" />;
      case 'system': return <Info size={20} className="text-slate-500" />;
      case 'message': return <MessageSquare size={20} className="text-indigo-500" />;
      case 'video_call': return <Video size={20} className="text-blue-500" />;
      default: return <Bell size={20} className="text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-slate-200 bg-slate-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'inApp': return <Bell size={16} />;
      case 'email': return <Mail size={16} />;
      case 'sms': return <MessageSquare size={16} />;
      case 'push': return <Smartphone size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || notification.type === filterCategory;
    const matchesRead = filterRead === 'all' || 
      (filterRead === 'read' && notification.read) ||
      (filterRead === 'unread' && !notification.read);
    
    return matchesSearch && matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notification Center</h1>
              <p className="text-slate-600 mt-1">Manage your notifications and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <MarkAsRead size={16} />
                Mark All Read
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'notifications', name: 'Notifications', icon: Bell, count: unreadCount },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
                {tab.count && tab.count > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="appointment">Appointments</option>
                  <option value="prescription">Prescriptions</option>
                  <option value="lab_result">Lab Results</option>
                  <option value="payment">Payments</option>
                  <option value="emergency">Emergency</option>
                  <option value="system">System</option>
                  <option value="message">Messages</option>
                  <option value="video_call">Video Calls</option>
                </select>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              {/* Notifications List */}
              <div className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="mx-auto text-slate-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
                    <p className="text-slate-600">You're all caught up!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg transition-all ${
                        !notification.read ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium text-slate-900 ${
                                    !notification.read ? 'font-semibold' : ''
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                                
                                {notification.sender && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                                      <User size={12} className="text-slate-600" />
                                    </div>
                                    <span className="text-xs text-slate-600">
                                      {notification.sender.name} • {notification.sender.role}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                  <div className="flex items-center gap-1">
                                    {Object.entries(notification.channels).map(([channel, enabled]) => (
                                      enabled && <span key={channel}>{getChannelIcon(channel)}</span>
                                    ))}
                                  </div>
                                </div>

                                {notification.actionUrl && (
                                  <div className="mt-3">
                                    <a
                                      href={notification.actionUrl}
                                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                    >
                                      {notification.actionText || 'View Details'}
                                      <ChevronRight size={14} />
                                    </a>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 hover:text-slate-600"
                                    title="Mark as read"
                                  >
                                    <Eye size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-slate-400 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Channels</h3>
                <div className="space-y-3">
                  {Object.entries(settings.channels).map(([channel, enabled]) => (
                    <div key={channel} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getChannelIcon(channel)}
                        <div>
                          <p className="font-medium text-slate-900 capitalize">
                            {channel.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-slate-600">
                            {channel === 'inApp' && 'Show notifications within the app'}
                            {channel === 'email' && 'Receive notifications via email'}
                            {channel === 'sms' && 'Receive SMS notifications'}
                            {channel === 'push' && 'Receive push notifications on mobile'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSettings({
                          channels: { ...settings.channels, [channel]: !enabled }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(category.replace('s', ''))}
                        <span className="font-medium text-slate-900 capitalize">
                          {category.replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSettings({
                          categories: { ...settings.categories, [category]: !enabled }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quiet Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Enable Quiet Hours</p>
                      <p className="text-sm text-slate-600">
                        Limit notifications during specific hours
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings({
                        quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.quietHours.enabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={settings.quietHours.startTime}
                          onChange={(e) => updateSettings({
                            quietHours: { ...settings.quietHours, startTime: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={settings.quietHours.endTime}
                          onChange={(e) => updateSettings({
                            quietHours: { ...settings.quietHours, endTime: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Frequency Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Immediate Notifications</p>
                      <p className="text-sm text-slate-600">
                        Receive notifications as soon as they're sent
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings({
                        frequency: { ...settings.frequency, immediate: !settings.frequency.immediate }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.frequency.immediate ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.frequency.immediate ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Daily Digest</p>
                      <p className="text-sm text-slate-600">
                        Receive a daily summary of notifications
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings({
                        frequency: { ...settings.frequency, digest: !settings.frequency.digest }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.frequency.digest ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.frequency.digest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.frequency.digest && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Digest Time
                      </label>
                      <input
                        type="time"
                        value={settings.frequency.digestTime}
                        onChange={(e) => updateSettings({
                          frequency: { ...settings.frequency, digestTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
