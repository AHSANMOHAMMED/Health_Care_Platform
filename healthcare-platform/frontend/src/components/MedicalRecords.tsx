import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Heart,
  Activity,
  Pill,
  Stethoscope,
  Eye,
  AlertCircle,
  CheckCircle,
  Plus,
  Upload,
  Share2,
  Printer,
  Clock,
  User,
  Hospital,
  TestTube,
  Brain,
  Bone
} from 'lucide-react';
import { medicalRecordsAPI } from '../services/api';

interface MedicalRecord {
  id: string;
  type: 'lab-result' | 'prescription' | 'imaging' | 'consultation' | 'vaccination';
  title: string;
  doctor: string;
  date: string;
  description: string;
  status: 'normal' | 'attention' | 'critical';
  fileUrl?: string;
  attachments?: number;
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    type: 'lab-result',
    title: 'Complete Blood Count',
    doctor: 'Dr. Sarah Johnson',
    date: '2024-01-10',
    description: 'Routine blood work showing normal levels with slight elevation in cholesterol.',
    status: 'normal',
    fileUrl: '/files/cbc-2024.pdf',
    attachments: 2
  },
  {
    id: '2',
    type: 'imaging',
    title: 'Chest X-Ray',
    doctor: 'Dr. Michael Chen',
    date: '2024-01-05',
    description: 'Clear lung fields with no signs of pneumonia or other abnormalities.',
    status: 'normal',
    fileUrl: '/files/chest-xray-2024.pdf',
    attachments: 3
  },
  {
    id: '3',
    type: 'prescription',
    title: 'Blood Pressure Medication',
    doctor: 'Dr. Emily Rodriguez',
    date: '2023-12-20',
    description: 'Lisinopril 10mg daily for hypertension management.',
    status: 'attention',
    fileUrl: '/files/prescription-2023.pdf',
    attachments: 1
  },
  {
    id: '4',
    type: 'consultation',
    title: 'Cardiology Follow-up',
    doctor: 'Dr. Sarah Johnson',
    date: '2023-12-15',
    description: 'Regular follow-up for ongoing cardiac care. Blood pressure well controlled.',
    status: 'normal',
    fileUrl: '/files/consultation-2023.pdf',
    attachments: 4
  },
  {
    id: '5',
    type: 'vaccination',
    title: 'Annual Flu Vaccine',
    doctor: 'Dr. Emily Rodriguez',
    date: '2023-11-10',
    description: 'Annual influenza vaccination administered.',
    status: 'normal',
    fileUrl: '/files/vaccine-2023.pdf',
    attachments: 1
  }
];

const recordTypes = [
  { value: 'all', label: 'All Records', icon: FileText },
  { value: 'lab-result', label: 'Lab Results', icon: TestTube },
  { value: 'imaging', label: 'Imaging', icon: Eye },
  { value: 'prescription', label: 'Prescriptions', icon: Pill },
  { value: 'consultation', label: 'Consultations', icon: Stethoscope },
  { value: 'vaccination', label: 'Vaccinations', icon: Heart }
];

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch medical records on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const data = await medicalRecordsAPI.getRecords();
        setRecords(data.records || mockRecords);
      } catch (error) {
        console.error('Failed to fetch medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File, metadata: any) => {
    try {
      await medicalRecordsAPI.uploadRecord(file, metadata);
      // Refresh records after upload
      const data = await medicalRecordsAPI.getRecords();
      setRecords(data.records || mockRecords);
    } catch (error) {
      console.error('Failed to upload record:', error);
      alert('Failed to upload medical record. Please try again.');
    }
  };

  // Handle record download
  const handleDownload = async (recordId: string) => {
    try {
      const blob = await medicalRecordsAPI.downloadRecord(recordId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-record-${recordId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download record:', error);
      alert('Failed to download medical record. Please try again.');
    }
  };

  // Handle record sharing
  const handleShare = async (recordId: string, recipientEmail: string) => {
    try {
      await medicalRecordsAPI.shareRecord(recordId, recipientEmail);
      alert('Medical record shared successfully!');
    } catch (error) {
      console.error('Failed to share record:', error);
      alert('Failed to share medical record. Please try again.');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesDate = (!dateRange.start || record.date >= dateRange.start) &&
                       (!dateRange.end || record.date <= dateRange.end);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab-result': return TestTube;
      case 'imaging': return Eye;
      case 'prescription': return Pill;
      case 'consultation': return Stethoscope;
      case 'vaccination': return Heart;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'attention': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'attention': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return FileText;
    }
  };

  const RecordCard = ({ record }: { record: MedicalRecord }) => {
    const Icon = getRecordIcon(record.type);
    const StatusIcon = getStatusIcon(record.status);
    
    return (
      <div className="feature-card hover:shadow-xl transition-all duration-300 cursor-pointer"
           onClick={() => setSelectedRecord(record)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              record.type === 'lab-result' ? 'bg-purple-100' :
              record.type === 'imaging' ? 'bg-blue-100' :
              record.type === 'prescription' ? 'bg-green-100' :
              record.type === 'consultation' ? 'bg-orange-100' :
              'bg-pink-100'
            }`}>
              <Icon className={`h-5 w-5 ${
                record.type === 'lab-result' ? 'text-purple-600' :
                record.type === 'imaging' ? 'text-blue-600' :
                record.type === 'prescription' ? 'text-green-600' :
                record.type === 'consultation' ? 'text-orange-600' :
                'text-pink-600'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{record.title}</h3>
              <p className="text-sm text-gray-600">{record.doctor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(record.status)}`}>
              <StatusIcon className="h-3 w-3" />
              <span>{record.status}</span>
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{record.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{record.date}</span>
            </div>
            {record.attachments && (
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{record.attachments} files</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Download logic
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Share logic
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RecordDetailModal = ({ record }: { record: MedicalRecord }) => {
    const Icon = getRecordIcon(record.type);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="healthcare-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  record.type === 'lab-result' ? 'bg-purple-100' :
                  record.type === 'imaging' ? 'bg-blue-100' :
                  record.type === 'prescription' ? 'bg-green-100' :
                  record.type === 'consultation' ? 'bg-orange-100' :
                  'bg-pink-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    record.type === 'lab-result' ? 'text-purple-600' :
                    record.type === 'imaging' ? 'text-blue-600' :
                    record.type === 'prescription' ? 'text-green-600' :
                    record.type === 'consultation' ? 'text-orange-600' :
                    'text-pink-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{record.title}</h2>
                  <p className="text-gray-600">{record.doctor} • {record.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">{record.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Document Preview</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Document preview would appear here</p>
                    <div className="flex space-x-3 justify-center">
                      <button className="healthcare-button">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>

                {record.attachments && record.attachments > 1 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {[...Array(record.attachments)].map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Attachment_{index + 1}.pdf</p>
                              <p className="text-sm text-gray-500">2.3 MB</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Record Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {record.type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{record.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium text-gray-900">{record.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Share2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Share with Doctor</span>
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Download className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Export as PDF</span>
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Printer className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Print Record</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">Access and manage your complete medical history</p>
          </div>
          <button className="flex items-center space-x-2 healthcare-button">
            <Upload className="h-4 w-4" />
            <span>Upload Records</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="feature-card text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-gray-600">Total Records</p>
          </div>
          <div className="feature-card text-center">
            <TestTube className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-gray-600">Lab Results</p>
          </div>
          <div className="feature-card text-center">
            <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-gray-600">Imaging</p>
          </div>
          <div className="feature-card text-center">
            <Pill className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">6</p>
            <p className="text-gray-600">Prescriptions</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="healthcare-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records by title, doctor, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="healthcare-input pl-10"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="healthcare-input"
            >
              {recordTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="healthcare-input text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="healthcare-input text-sm"
              />
            </div>
            <p className="text-sm text-gray-600">
              {filteredRecords.length} records found
            </p>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(record => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <RecordDetailModal record={selectedRecord} />
        )}
      </div>
    </div>
  );
}
