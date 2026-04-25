import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Watch, Smartphone, Activity, Heart, Moon, Footprints, Flame, Plus, CheckCircle, Bluetooth, Battery, RefreshCw } from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'phone';
  brand: string;
  connected: boolean;
  battery?: number;
  lastSync?: string;
  metrics: string[];
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
  history: { day: string; value: number }[];
}

export default function WearableIntegration() {
  const [activeTab, setActiveTab] = useState<'devices' | 'metrics'>('devices');
  const [connecting, setConnecting] = useState<string | null>(null);

  const [devices, setDevices] = useState<WearableDevice[]>([
    { id: '1', name: 'Apple Watch Series 9', type: 'smartwatch', brand: 'Apple', connected: true, battery: 78, lastSync: '2 min ago', metrics: ['Heart Rate', 'Steps', 'Sleep', 'Calories'] },
    { id: '2', name: 'Fitbit Charge 6', type: 'fitness_tracker', brand: 'Fitbit', connected: false, metrics: ['Steps', 'Sleep', 'Heart Rate'] },
    { id: '3', name: 'iPhone 15 Pro', type: 'phone', brand: 'Apple', connected: true, battery: 45, lastSync: 'Just now', metrics: ['Steps', 'Activity'] },
  ]);

  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { id: '1', name: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-400', trend: 'stable', history: [{ day: 'Mon', value: 70 }, { day: 'Tue', value: 72 }, { day: 'Wed', value: 71 }, { day: 'Thu', value: 73 }, { day: 'Fri', value: 72 }] },
    { id: '2', name: 'Daily Steps', value: '8,432', unit: 'steps', icon: Footprints, color: 'text-emerald-400', trend: 'up', history: [{ day: 'Mon', value: 7500 }, { day: 'Tue', value: 8200 }, { day: 'Wed', value: 7800 }, { day: 'Thu', value: 9100 }, { day: 'Fri', value: 8432 }] },
    { id: '3', name: 'Sleep Duration', value: '7h 12m', unit: '', icon: Moon, color: 'text-purple-400', trend: 'up', history: [{ day: 'Mon', value: 6.5 }, { day: 'Tue', value: 7.0 }, { day: 'Wed', value: 6.8 }, { day: 'Thu', value: 7.2 }, { day: 'Fri', value: 7.2 }] },
    { id: '4', name: 'Calories Burned', value: '2,156', unit: 'kcal', icon: Flame, color: 'text-orange-400', trend: 'stable', history: [{ day: 'Mon', value: 2100 }, { day: 'Tue', value: 2200 }, { day: 'Wed', value: 2050 }, { day: 'Thu', value: 2300 }, { day: 'Fri', value: 2156 }] },
  ]);

  const handleConnect = async (deviceId: string) => {
    setConnecting(deviceId);
    await new Promise(r => setTimeout(r, 2000));
    setDevices(prev => prev.map(d =>
      d.id === deviceId ? { ...d, connected: !d.connected } : d
    ));
    setConnecting(null);
  };

  const availableDevices = [
    { name: 'Samsung Galaxy Watch 6', type: 'smartwatch', brand: 'Samsung' },
    { name: 'Garmin Venu 3', type: 'smartwatch', brand: 'Garmin' },
    { name: 'Oura Ring Gen 3', type: 'fitness_tracker', brand: 'Oura' },
    { name: 'Whoop 4.0', type: 'fitness_tracker', brand: 'Whoop' },
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return Watch;
      case 'fitness_tracker': return Activity;
      case 'phone': return Smartphone;
      default: return Watch;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-300/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} className="flex items-center gap-2 text-slate-600 hover:text-slate-900" onClick={(e) => !user && e.preventDefault()}>
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Wearable Integration</h1>
          <button
            onClick={() => setActiveTab(activeTab === 'devices' ? 'metrics' : 'devices')}
            className="text-sm text-[#0EA5E9] hover:text-[#0284C7]"
          >
            {activeTab === 'devices' ? 'View Metrics' : 'View Devices'}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'devices' ? (
            <>
              {/* Connected Devices */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Connected Devices</h2>
                <div className="space-y-3">
                  {devices.map(device => {
                    const Icon = getDeviceIcon(device.type);
                    return (
                      <div key={device.id} className="bg-white border border-slate-300/50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                              <Icon className="text-[#0EA5E9]" size={24} />
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900">{device.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>{device.brand}</span>
                                {device.connected && device.battery !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Battery size={14} />
                                    {device.battery}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {device.connected ? (
                              <>
                                <span className="flex items-center gap-1 text-xs text-emerald-400">
                                  <Bluetooth size={14} />
                                  Connected
                                </span>
                                {device.lastSync && (
                                  <span className="text-xs text-slate-500">{device.lastSync}</span>
                                )}
                                <button
                                  onClick={() => handleConnect(device.id)}
                                  disabled={connecting === device.id}
                                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                                >
                                  {connecting === device.id ? '...' : 'Disconnect'}
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleConnect(device.id)}
                                disabled={connecting === device.id}
                                className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-slate-900 rounded-lg text-sm font-medium transition-all"
                              >
                                {connecting === device.id ? 'Connecting...' : 'Connect'}
                              </button>
                            )}
                          </div>
                        </div>

                        {device.connected && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-300/30">
                            {device.metrics.map(metric => (
                              <span key={metric} className="px-2 py-1 bg-slate-50 rounded text-xs text-slate-600">
                                {metric}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Device */}
              <div className="bg-white border border-slate-300/50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus size={18} />
                  Add New Device
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableDevices.map(device => (
                    <button
                      key={device.name}
                      className="p-4 bg-slate-50 border border-slate-300/50 rounded-xl hover:border-[#0EA5E9]/50 transition-all text-left"
                    >
                      <p className="font-medium text-slate-900">{device.name}</p>
                      <p className="text-sm text-slate-600">{device.brand}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Metrics Tab */
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {metrics.map(metric => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.id} className="bg-white border border-slate-300/50 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800`}>
                            <Icon className={metric.color} size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{metric.name}</p>
                            <p className="text-xs text-slate-600">Today</p>
                          </div>
                        </div>
                        <RefreshCw size={16} className="text-slate-500" />
                      </div>

                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-3xl font-bold text-slate-900">{metric.value}</span>
                        <span className="text-sm text-slate-600 mb-1">{metric.unit}</span>
                        <span className={`text-xs ml-auto ${
                          metric.trend === 'up' ? 'text-emerald-400' :
                          metric.trend === 'down' ? 'text-red-400' :
                          'text-slate-600'
                        }`}>
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-16 flex items-end gap-1">
                        {metric.history.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-[#0EA5E9]/30 rounded-t"
                            style={{ height: `${(h.value / Math.max(...metric.history.map(d => d.value))) * 100}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        {metric.history.map((h, i) => (
                          <span key={i}>{h.day}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sync Status */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400" size={20} />
                  <div>
                    <p className="text-emerald-400 font-medium">All devices synced</p>
                    <p className="text-sm text-emerald-400/70">Last sync: 2 minutes ago</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
