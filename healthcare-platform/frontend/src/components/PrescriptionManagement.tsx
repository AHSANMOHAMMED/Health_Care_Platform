import { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Bell,
  Download,
  Share2,
  Printer,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';
import { prescriptionAPI } from '../services/api';

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'expired' | 'refill-needed';
  refillsRemaining: number;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  nextDose?: string;
  takenToday?: boolean;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '30 days',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2024-01-01',
    startDate: '2024-01-02',
    endDate: '2024-02-01',
    status: 'active',
    refillsRemaining: 2,
    instructions: 'Take with water in the morning. Avoid potassium supplements.',
    sideEffects: ['Dry cough', 'Dizziness', 'Headache'],
    interactions: ['NSAIDs', 'Potassium supplements'],
    nextDose: '8:00 AM',
    takenToday: true
  },
  {
    id: '2',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '90 days',
    prescribedBy: 'Dr. Emily Rodriguez',
    prescribedDate: '2023-12-15',
    startDate: '2023-12-16',
    endDate: '2024-03-15',
    status: 'active',
    refillsRemaining: 1,
    instructions: 'Take with meals to reduce stomach upset.',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    interactions: ['Alcohol', 'Iodinated contrast'],
    nextDose: '6:00 PM',
    takenToday: false
  },
  {
    id: '3',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    duration: '90 days',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2023-11-01',
    startDate: '2023-11-02',
    endDate: '2024-02-02',
    status: 'refill-needed',
    refillsRemaining: 0,
    instructions: 'Take in the evening. Avoid grapefruit juice.',
    sideEffects: ['Muscle pain', 'Liver enzyme changes'],
    interactions: ['Grapefruit juice', 'Certain antibiotics'],
    nextDose: '9:00 PM',
    takenToday: false
  },
  {
    id: '4',
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    prescribedBy: 'Dr. Michael Chen',
    prescribedDate: '2023-10-15',
    startDate: '2023-10-16',
    endDate: '2023-10-23',
    status: 'completed',
    refillsRemaining: 0,
    instructions: 'Complete full course even if feeling better.',
    sideEffects: ['Nausea', 'Yeast infections', 'Diarrhea'],
    interactions: ['Birth control pills', 'Blood thinners']
  }
];

export default function PrescriptionManagement() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await prescriptionAPI.getPrescriptions();
        setPrescriptions(data.prescriptions || mockPrescriptions);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Handle prescription refill request
  const handleRefillRequest = async (prescriptionId: string) => {
    try {
      await prescriptionAPI.requestRefill(prescriptionId);
      alert('Refill request sent to your doctor successfully!');
      // Refresh prescriptions
      const data = await prescriptionAPI.getPrescriptions();
      setPrescriptions(data.prescriptions || mockPrescriptions);
    } catch (error) {
      console.error('Failed to request refill:', error);
      alert('Failed to request refill. Please try again.');
    }
  };

  // Handle marking prescription as taken
  const handleMarkAsTaken = async (prescriptionId: string) => {
    try {
      await prescriptionAPI.markAsTaken(prescriptionId);
      // Update local state
      setPrescriptions(prev => prev.map(prescription =>
        prescription.id === prescriptionId 
          ? { ...prescription, takenToday: true }
          : prescription
      ));
    } catch (error) {
      console.error('Failed to mark as taken:', error);
      alert('Failed to update prescription status. Please try again.');
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'refill-needed': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'expired': return AlertCircle;
      case 'refill-needed': return AlertTriangle;
      default: return Info;
    }
  };

  const markAsTaken = (id: string) => {
    setPrescriptions(prev => prev.map(prescription =>
      prescription.id === id 
        ? { ...prescription, takenToday: true }
        : prescription
    ));
  };

  const requestRefill = (id: string) => {
    // Implement refill request logic
    alert('Refill request sent to your doctor');
  };

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => {
    const StatusIcon = getStatusIcon(prescription.status);
    
    return (
      <div className="feature-card hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{prescription.medicationName}</h3>
              <p className="text-sm text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(prescription.status)}`}>
              <StatusIcon className="h-3 w-3" />
              <span>{prescription.status.replace('-', ' ')}</span>
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Prescribed by:</span>
            <span className="font-medium text-gray-900">{prescription.prescribedBy}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{prescription.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Refills left:</span>
            <span className="font-medium text-gray-900">{prescription.refillsRemaining}</span>
          </div>
        </div>

        {prescription.status === 'active' && (
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Next dose</p>
                <p className="text-sm text-blue-700">{prescription.nextDose}</p>
              </div>
              {prescription.takenToday ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Taken</span>
                </div>
              ) : (
                <button
                  onClick={() => handleMarkAsTaken(prescription.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Square className="h-4 w-4" />
                  <span className="text-sm">Mark as taken</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPrescription(prescription)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details
          </button>
          <div className="flex space-x-2">
            {prescription.status === 'refill-needed' && (
              <button
                onClick={() => handleRefillRequest(prescription.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
              >
                Request Refill
              </button>
            )}
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PrescriptionDetailModal = ({ prescription }: { prescription: Prescription }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="healthcare-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{prescription.medicationName}</h2>
                  <p className="text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Prescription Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prescribed by:</span>
                      <span className="font-medium text-gray-900">{prescription.prescribedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prescribed date:</span>
                      <span className="font-medium text-gray-900">{prescription.prescribedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start date:</span>
                      <span className="font-medium text-gray-900">{prescription.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End date:</span>
                      <span className="font-medium text-gray-900">{prescription.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{prescription.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refills remaining:</span>
                      <span className="font-medium text-gray-900">{prescription.refillsRemaining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Instructions</h3>
                  <p className="text-gray-600">{prescription.instructions}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    Side Effects
                  </h3>
                  <ul className="space-y-2">
                    {prescription.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Drug Interactions
                  </h3>
                  <ul className="space-y-2">
                    {prescription.interactions.map((interaction, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>{interaction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 healthcare-button">
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Share2 className="h-4 w-4" />
                      <span>Share Prescription</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Printer className="h-4 w-4" />
                      <span>Print Prescription</span>
                    </button>
                    {prescription.status === 'active' && (
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        <RefreshCw className="h-4 w-4" />
                        <span>Request Refill</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeCount = prescriptions.filter(p => p.status === 'active').length;
  const refillNeededCount = prescriptions.filter(p => p.status === 'refill-needed').length;
  const takenTodayCount = prescriptions.filter(p => p.takenToday).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Management</h1>
            <p className="text-gray-600">Manage your medications and refills</p>
          </div>
          <button className="flex items-center space-x-2 healthcare-button">
            <Plus className="h-4 w-4" />
            <span>Add Prescription</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="feature-card text-center">
            <Pill className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-gray-600">Active Prescriptions</p>
          </div>
          <div className="feature-card text-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{takenTodayCount}</p>
            <p className="text-gray-600">Medications Taken Today</p>
          </div>
          <div className="feature-card text-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{refillNeededCount}</p>
            <p className="text-gray-600">Refills Needed</p>
          </div>
          <div className="feature-card text-center">
            <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-gray-600">Reminders Set</p>
          </div>
        </div>

        {/* Today's Medications */}
        {activeCount > 0 && (
          <div className="healthcare-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.filter(p => p.status === 'active').map(prescription => (
                <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{prescription.medicationName}</h4>
                    {prescription.takenToday ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{prescription.nextDose}</p>
                  {!prescription.takenToday && (
                    <button
                      onClick={() => handleMarkAsTaken(prescription.id)}
                      className="w-full px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="healthcare-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="healthcare-input pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="healthcare-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="refill-needed">Refill Needed</option>
            </select>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Prescriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map(prescription => (
            <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
        </div>

        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <PrescriptionDetailModal prescription={selectedPrescription} />
        )}
      </div>
    </div>
  );
}
