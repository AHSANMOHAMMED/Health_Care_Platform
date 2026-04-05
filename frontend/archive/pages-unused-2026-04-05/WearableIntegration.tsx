import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Brain, 
  Moon, 
  Sun, 
  Footprints, 
  Droplet, 
  Thermometer, 
  Wind, 
  Battery, 
  Wifi, 
  WifiOff, 
  Sync, 
  SyncOff, 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  RefreshCw, 
  Download, 
  Upload, 
  Zap, 
  Shield, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  Bluetooth,
  BluetoothOff,
  Smartphone as PhoneIcon,
  Watch as WatchIcon,
  Activity as ActivityIcon,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Moon as MoonIcon,
  Footprints as FootprintsIcon
} from 'lucide-react';
import { api } from '../api/axios';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smart_ring' | 'smart_scale' | 'blood_pressure_monitor' | 'glucose_monitor' | 'pulse_oximeter' | 'ecg_monitor';
  brand: string;
  model: string;
  isConnected: boolean;
  lastSync: string;
  batteryLevel: number;
  firmwareVersion: string;
  capabilities: string[];
  supportedMetrics: string[];
  autoSync: boolean;
  syncInterval: number;
  dataRetention: number;
}

interface HealthMetric {
  id: string;
  deviceId: string;
  metricType: 'heart_rate' | 'steps' | 'sleep' | 'blood_pressure' | 'glucose' | 'weight' | 'oxygen_saturation' | 'stress' | 'temperature' | 'calories' | 'distance' | 'active_minutes';
  value: number;
  unit: string;
  timestamp: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  abnormal: boolean;
  threshold?: {
    min: number;
    max: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface HealthGoal {
  id: string;
  metricType: string;
  target: number;
  current: number;
  unit: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  progress: number;
}

interface SyncStatus {
  lastSync: string;
  nextSync: string;
  syncedDevices: number;
  totalDevices: number;
  pendingData: number;
  errors: Array<{
    deviceId: string;
    error: string;
    timestamp: string;
  }>;
}

export default function WearableIntegration() {
  const [activeTab, setActiveTab] = useState<'devices' | 'metrics' | 'goals' | 'sync'>('devices');
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('day');

  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'smartwatch' as const,
    brand: '',
    model: ''
  });

  useEffect(() => {
    fetchWearableData();
  }, []);

  const fetchWearableData = async () => {
    try {
      setLoading(true);
      const [devicesRes, metricsRes, goalsRes, syncRes] = await Promise.all([
        api.get('/wearable/devices'),
        api.get(`/wearable/metrics?range=${selectedTimeRange}`),
        api.get('/wearable/goals'),
        api.get('/wearable/sync-status')
      ]);

      setDevices(devicesRes.data);
      setMetrics(metricsRes.data);
      setGoals(goalsRes.data);
      setSyncStatus(syncRes.data);
    } catch (error) {
      console.error('Failed to fetch wearable data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectDevice = async (deviceId: string) => {
    try {
      await api.post(`/wearable/devices/${deviceId}/connect`);
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, isConnected: true } : d
      ));
    } catch (error) {
      console.error('Failed to connect device:', error);
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      await api.post(`/wearable/devices/${deviceId}/disconnect`);
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, isConnected: false } : d
      ));
    } catch (error) {
      console.error('Failed to disconnect device:', error);
    }
  };

  const syncDevice = async (deviceId: string) => {
    try {
      await api.post(`/wearable/devices/${deviceId}/sync`);
      fetchWearableData();
    } catch (error) {
      console.error('Failed to sync device:', error);
    }
  };

  const syncAllDevices = async () => {
    try {
      await api.post('/wearable/sync-all');
      fetchWearableData();
    } catch (error) {
      console.error('Failed to sync all devices:', error);
    }
  };

  const addDevice = async () => {
    try {
      const response = await api.post('/wearable/devices', newDevice);
      setDevices([...devices, response.data]);
      setShowAddDevice(false);
      setNewDevice({ name: '', type: 'smartwatch', brand: '', model: '' });
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      await api.delete(`/wearable/devices/${deviceId}`);
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    } catch (error) {
      console.error('Failed to remove device:', error);
    }
  };

  const updateDeviceSettings = async (deviceId: string, settings: Partial<WearableDevice>) => {
    try {
      await api.patch(`/wearable/devices/${deviceId}`, settings);
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, ...settings } : d
      ));
    } catch (error) {
      console.error('Failed to update device settings:', error);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return <WatchIcon size={24} className="text-blue-500" />;
      case 'fitness_tracker': return <ActivityIcon size={24} className="text-green-500" />;
      case 'smart_ring': return <ActivityIcon size={24} className="text-purple-500" />;
      case 'smart_scale': return <ActivityIcon size={24} className="text-orange-500" />;
      case 'blood_pressure_monitor': return <HeartIcon size={24} className="text-red-500" />;
      case 'glucose_monitor': return <ActivityIcon size={24} className="text-yellow-500" />;
      case 'pulse_oximeter': return <ActivityIcon size={24} className="text-cyan-500" />;
      case 'ecg_monitor': return <HeartIcon size={24} className="text-pink-500" />;
      default: return <Smartphone size={24} className="text-slate-500" />;
    }
  };

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case 'heart_rate': return <HeartIcon size={20} className="text-red-500" />;
      case 'steps': return <FootprintsIcon size={20} className="text-blue-500" />;
      case 'sleep': return <MoonIcon size={20} className="text-indigo-500" />;
      case 'blood_pressure': return <ActivityIcon size={20} className="text-red-500" />;
      case 'glucose': return <ActivityIcon size={20} className="text-yellow-500" />;
      case 'weight': return <ActivityIcon size={20} className="text-orange-500" />;
      case 'oxygen_saturation': return <Wind size={20} className="text-cyan-500" />;
      case 'stress': return <BrainIcon size={20} className="text-purple-500" />;
      case 'temperature': return <Thermometer size={20} className="text-orange-500" />;
      case 'calories': return <Zap size={20} className="text-yellow-500" />;
      case 'distance': return <FootprintsIcon size={20} className="text-green-500" />;
      case 'active_minutes': return <ActivityIcon size={20} className="text-green-500" />;
      default: return <ActivityIcon size={20} className="text-slate-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 75) return 'text-green-500';
    if (level > 50) return 'text-yellow-500';
    if (level > 25) return 'text-orange-500';
    return 'text-red-500';
  };

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
              <Watch className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Wearable Device Integration</h1>
              <p className="text-slate-600 mt-1">Connect and sync your health devices for comprehensive monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={syncAllDevices}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <RefreshCw size={16} />
              Sync All
            </button>
            <button
              onClick={() => setShowAddDevice(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Device
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Sync Status</h3>
            <span className="text-sm text-slate-600">
              Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                syncStatus.syncedDevices === syncStatus.totalDevices ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {syncStatus.syncedDevices === syncStatus.totalDevices ? 
                  <CheckCircle className="text-green-600" size={20} /> : 
                  <Sync className="text-yellow-600" size={20} />
                }
              </div>
              <div>
                <p className="text-sm text-slate-600">Connected Devices</p>
                <p className="font-semibold text-slate-900">
                  {syncStatus.syncedDevices}/{syncStatus.totalDevices}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                syncStatus.pendingData === 0 ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Activity className={syncStatus.pendingData === 0 ? 'text-green-600' : 'text-blue-600'} size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending Data</p>
                <p className="font-semibold text-slate-900">{syncStatus.pendingData}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="text-slate-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-600">Next Sync</p>
                <p className="font-semibold text-slate-900">
                  {new Date(syncStatus.nextSync).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                syncStatus.errors.length === 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {syncStatus.errors.length === 0 ? 
                  <CheckCircle className="text-green-600" size={20} /> : 
                  <AlertTriangle className="text-red-600" size={20} />
                }
              </div>
              <div>
                <p className="text-sm text-slate-600">Errors</p>
                <p className="font-semibold text-slate-900">{syncStatus.errors.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'devices', name: 'Devices', icon: Smartphone },
              { id: 'metrics', name: 'Health Metrics', icon: Activity },
              { id: 'goals', name: 'Goals', icon: Target },
              { id: 'sync', name: 'Sync History', icon: Sync }
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
          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <div key={device.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedDevice(expandedDevice === device.id ? null : device.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDeviceIcon(device.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">{device.name}</h4>
                              {device.isConnected && (
                                <Bluetooth className="text-blue-500" size={16} />
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{device.brand} {device.model}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="capitalize">{device.type.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>v{device.firmwareVersion}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight 
                          className={`text-slate-400 transition-transform ${
                            expandedDevice === device.id ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </div>
                    </div>

                    {expandedDevice === device.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Connection Status</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              device.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {device.isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Battery Level</span>
                            <div className="flex items-center gap-2">
                              <Battery className={getBatteryColor(device.batteryLevel)} size={16} />
                              <span className="text-sm font-medium">{device.batteryLevel}%</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Last Sync</span>
                            <span className="text-sm text-slate-600">
                              {new Date(device.lastSync).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Auto Sync</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDeviceSettings(device.id, { autoSync: !device.autoSync });
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                device.autoSync ? 'bg-blue-600' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  device.autoSync ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="pt-3 border-t border-slate-200">
                            <h5 className="text-sm font-medium text-slate-900 mb-2">Capabilities</h5>
                            <div className="flex flex-wrap gap-1">
                              {device.capabilities.map((capability, index) => (
                                <span key={index} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                                  {capability}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3">
                            {device.isConnected ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  syncDevice(device.id);
                                }}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                <Sync size={14} />
                                Sync Now
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  connectDevice(device.id);
                                }}
                                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                <Bluetooth size={14} />
                                Connect
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDevice(device.id);
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Health Metrics</h3>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  metrics.reduce((acc, metric) => {
                    if (!acc[metric.metricType]) {
                      acc[metric.metricType] = [];
                    }
                    acc[metric.metricType].push(metric);
                    return acc;
                  }, {} as Record<string, HealthMetric[]>)
                ).map(([metricType, metricList]) => {
                  const latest = metricList[metricList.length - 1];
                  return (
                    <div key={metricType} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getMetricIcon(metricType)}
                          <h4 className="font-medium text-slate-900 capitalize">
                            {metricType.replace('_', ' ')}
                          </h4>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(latest.quality)}`}>
                          {latest.quality}
                        </span>
                      </div>
                      
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {latest.value} {latest.unit}
                      </div>
                      
                      <div className="text-sm text-slate-600 mb-3">
                        {new Date(latest.timestamp).toLocaleString()}
                      </div>

                      {latest.abnormal && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-red-700 text-sm">
                          <AlertTriangle size={14} />
                          <span>Abnormal reading</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Trends Overview</h4>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <LineChart className="text-slate-400" size={32} />
                  <p className="text-slate-500 ml-2">Trend Chart</p>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Health Goals</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={16} />
                  Add Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(goal.metricType)}
                        <h4 className="font-medium text-slate-900 capitalize">
                          {goal.metricType.replace('_', ' ')}
                        </h4>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        goal.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {goal.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-slate-900">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Timeframe: {goal.timeframe}</span>
                        <span>{goal.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync History Tab */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Sync History</h3>
              
              <div className="space-y-2">
                {syncStatus?.errors.map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-red-500" size={16} />
                      <div>
                        <p className="font-medium text-red-900">
                          {devices.find(d => d.id === error.deviceId)?.name || 'Unknown Device'}
                        </p>
                        <p className="text-sm text-red-700">{error.error}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                {syncStatus?.errors.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-slate-900 mb-2">All Syncs Successful</h4>
                    <p className="text-slate-600">No sync errors to report</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add Wearable Device</h2>
                <button
                  onClick={() => setShowAddDevice(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Device Name</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Apple Watch Series 8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Device Type</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({...newDevice, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="smartwatch">Smartwatch</option>
                  <option value="fitness_tracker">Fitness Tracker</option>
                  <option value="smart_ring">Smart Ring</option>
                  <option value="smart_scale">Smart Scale</option>
                  <option value="blood_pressure_monitor">Blood Pressure Monitor</option>
                  <option value="glucose_monitor">Glucose Monitor</option>
                  <option value="pulse_oximeter">Pulse Oximeter</option>
                  <option value="ecg_monitor">ECG Monitor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={newDevice.brand}
                  onChange={(e) => setNewDevice({...newDevice, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Apple, Samsung, Fitbit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <input
                  type="text"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Series 8, Galaxy Watch 5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddDevice(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addDevice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
