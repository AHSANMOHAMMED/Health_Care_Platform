import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  Search, 
  Filter,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building,
  Smartphone,
  Mail,
  Phone,
  User,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { billingAPI } from '../services/api';

interface Bill {
  id: string;
  type: 'consultation' | 'procedure' | 'medication' | 'lab-test' | 'emergency';
  title: string;
  doctor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'processing';
  description: string;
  insuranceCoverage: number;
  patientResponsibility: number;
  paymentMethod?: string;
  transactionId?: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'debit-card' | 'insurance' | 'bank-transfer';
  last4: string;
  brand: string;
  expiryDate: string;
  isDefault: boolean;
}

const mockBills: Bill[] = [
  {
    id: '1',
    type: 'consultation',
    title: 'Cardiology Consultation',
    doctor: 'Dr. Sarah Johnson',
    date: '2024-01-10',
    dueDate: '2024-01-24',
    amount: 150.00,
    status: 'pending',
    description: 'Video consultation for follow-up cardiac care',
    insuranceCoverage: 120.00,
    patientResponsibility: 30.00
  },
  {
    id: '2',
    type: 'lab-test',
    title: 'Complete Blood Count',
    doctor: 'Dr. Sarah Johnson',
    date: '2024-01-08',
    dueDate: '2024-01-22',
    amount: 85.00,
    status: 'paid',
    description: 'Routine blood work including cholesterol panel',
    insuranceCoverage: 68.00,
    patientResponsibility: 17.00,
    paymentMethod: 'Credit Card ending in 4242',
    transactionId: 'TXN-2024-001234'
  },
  {
    id: '3',
    type: 'procedure',
    title: 'Echocardiogram',
    doctor: 'Dr. Sarah Johnson',
    date: '2024-01-05',
    dueDate: '2024-01-19',
    amount: 450.00,
    status: 'overdue',
    description: 'Cardiac ultrasound to assess heart function',
    insuranceCoverage: 360.00,
    patientResponsibility: 90.00
  },
  {
    id: '4',
    type: 'medication',
    title: 'Prescription Refill',
    doctor: 'Dr. Emily Rodriguez',
    date: '2024-01-03',
    dueDate: '2024-01-17',
    amount: 45.00,
    status: 'processing',
    description: 'Monthly prescription for blood pressure medication',
    insuranceCoverage: 36.00,
    patientResponsibility: 9.00
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit-card',
    last4: '4242',
    brand: 'Visa',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: '2',
    type: 'insurance',
    last4: '6789',
    brand: 'Blue Cross Blue Shield',
    expiryDate: '12/24',
    isDefault: false
  }
];

export default function BillingPayment() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [activeTab, setActiveTab] = useState('bills');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch bills and payment methods on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [billsData, paymentMethodsData] = await Promise.all([
          billingAPI.getBills(),
          billingAPI.getPaymentMethods()
        ]);
        setBills(billsData.bills || mockBills);
        setPaymentMethods(paymentMethodsData.paymentMethods || mockPaymentMethods);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle bill payment
  const handlePayment = async (billId: string, paymentMethodId: string) => {
    setPaymentLoading(true);
    try {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        await billingAPI.payBill(billId, {
          paymentMethodId,
          amount: bill.patientResponsibility
        });
        
        // Update bill status locally
        setBills(prev => prev.map(b => 
          b.id === billId 
            ? { ...b, status: 'processing', paymentMethod: paymentMethods.find(pm => pm.id === paymentMethodId)?.brand }
            : b
        ));
        
        setShowPaymentModal(false);
        alert('Payment processed successfully!');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle adding payment method
  const handleAddPaymentMethod = async (paymentData: any) => {
    try {
      await billingAPI.addPaymentMethod(paymentData);
      // Refresh payment methods
      const data = await billingAPI.getPaymentMethods();
      setPaymentMethods(data.paymentMethods || mockPaymentMethods);
      setShowAddPaymentMethod(false);
      alert('Payment method added successfully!');
    } catch (error: any) {
      console.error('Failed to add payment method:', error);
      alert(error.response?.data?.message || 'Failed to add payment method. Please try again.');
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      case 'processing': return Clock;
      default: return FileText;
    }
  };

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'consultation': return User;
      case 'procedure': return FileText;
      case 'medication': return Shield;
      case 'lab-test': return FileText;
      case 'emergency': return AlertCircle;
      default: return FileText;
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.patientResponsibility, 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.patientResponsibility, 0);
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.patientResponsibility, 0);
  const overdueAmount = bills.filter(b => b.status === 'overdue').reduce((sum, bill) => sum + bill.patientResponsibility, 0);

  const BillCard = ({ bill }: { bill: Bill }) => {
    const StatusIcon = getStatusIcon(bill.status);
    const BillIcon = getBillIcon(bill.type);
    
    return (
      <div className="feature-card hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              bill.type === 'consultation' ? 'bg-blue-100' :
              bill.type === 'procedure' ? 'bg-purple-100' :
              bill.type === 'medication' ? 'bg-green-100' :
              bill.type === 'lab-test' ? 'bg-orange-100' :
              'bg-red-100'
            }`}>
              <BillIcon className={`h-5 w-5 ${
                bill.type === 'consultation' ? 'text-blue-600' :
                bill.type === 'procedure' ? 'text-purple-600' :
                bill.type === 'medication' ? 'text-green-600' :
                bill.type === 'lab-test' ? 'text-orange-600' :
                'text-red-600'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{bill.title}</h3>
              <p className="text-sm text-gray-600">{bill.doctor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(bill.status)}`}>
              <StatusIcon className="h-3 w-3" />
              <span>{bill.status}</span>
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{bill.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium text-gray-900">${bill.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Insurance Coverage:</span>
            <span className="font-medium text-green-600">-${bill.insuranceCoverage.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t">
            <span className="text-gray-900">Your Responsibility:</span>
            <span className="text-gray-900">${bill.patientResponsibility.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Due: {bill.dueDate}</span>
          {bill.transactionId && <span>TXN: {bill.transactionId}</span>}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBill(bill)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details
          </button>
          {bill.status === 'pending' || bill.status === 'overdue' ? (
            <button
              onClick={() => {
                setSelectedBill(bill);
                setShowPaymentModal(true);
              }}
              className="healthcare-button text-sm px-4 py-2"
            >
              Pay Now
            </button>
          ) : (
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="h-4 w-4" />
              <span>Receipt</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const BillDetailModal = ({ bill }: { bill: Bill }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="healthcare-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{bill.title}</h2>
                <p className="text-gray-600">{bill.doctor} • {bill.date}</p>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Bill Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Date:</span>
                      <span className="font-medium text-gray-900">{bill.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium text-gray-900">{bill.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </div>
                    {bill.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-gray-900">{bill.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Charges:</span>
                      <span className="font-medium text-gray-900">${bill.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Coverage:</span>
                      <span className="font-medium text-green-600">-${bill.insuranceCoverage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t font-semibold">
                      <span className="text-gray-900">Patient Responsibility:</span>
                      <span className="text-gray-900">${bill.patientResponsibility.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Service Description</h3>
                  <p className="text-gray-600">{bill.description}</p>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 healthcare-button">
                      <Download className="h-4 w-4" />
                      <span>Download Invoice</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Mail className="h-4 w-4" />
                      <span>Email Invoice</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Phone className="h-4 w-4" />
                      <span>Contact Billing Support</span>
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

  const PaymentModal = () => {
    if (!selectedBill) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="healthcare-card max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Pay Bill</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedBill.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedBill.doctor}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Due:</span>
                  <span className="text-xl font-bold text-gray-900">${selectedBill.patientResponsibility.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment-method" className="mr-3" defaultChecked={method.isDefault} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {method.type === 'credit-card' && <CreditCard className="h-4 w-4 text-gray-600" />}
                        {method.type === 'insurance' && <Shield className="h-4 w-4 text-gray-600" />}
                        <span className="font-medium text-gray-900">{method.brand}</span>
                        {method.isDefault && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Ending in {method.last4}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                + Add New Payment Method
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full healthcare-button">
                Pay ${selectedBill.patientResponsibility.toFixed(2)}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'bills', label: 'Bills & Payments', icon: FileText },
    { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'history', label: 'Payment History', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-600">Manage your medical bills and payment methods</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="feature-card text-center">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
            <p className="text-gray-600">Total Billed</p>
          </div>
          <div className="feature-card text-center">
            <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${paidAmount.toFixed(2)}</p>
            <p className="text-gray-600">Paid</p>
          </div>
          <div className="feature-card text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="feature-card text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${overdueAmount.toFixed(2)}</p>
            <p className="text-gray-600">Overdue</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
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
        {activeTab === 'bills' && (
          <div>
            {/* Search and Filters */}
            <div className="healthcare-card p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bills..."
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="processing">Processing</option>
                </select>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>

            {/* Bills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBills.map(bill => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="healthcare-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map(method => (
                <div key={method.id} className="feature-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {method.type === 'credit-card' && <CreditCard className="h-6 w-6 text-blue-600" />}
                      {method.type === 'insurance' && <Shield className="h-6 w-6 text-green-600" />}
                      <div>
                        <h4 className="font-semibold text-gray-900">{method.brand}</h4>
                        <p className="text-sm text-gray-600">Ending in {method.last4}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Default</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insurance' && (
          <div className="feature-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Primary Insurance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium text-gray-900">Blue Cross Blue Shield</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="font-medium text-gray-900">BCBS123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Number:</span>
                    <span className="font-medium text-gray-900">GRP-789012</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Coverage Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductible:</span>
                    <span className="font-medium text-gray-900">$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Copay:</span>
                    <span className="font-medium text-gray-900">$20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coinsurance:</span>
                    <span className="font-medium text-gray-900">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="feature-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.filter(b => b.status === 'paid').map(bill => (
                    <tr key={bill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${bill.patientResponsibility.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedBill && <BillDetailModal bill={selectedBill} />}
        {showPaymentModal && <PaymentModal />}
      </div>
    </div>
  );
}
