import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Info,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  Filter,
  RefreshCw,
  Printer,
  Share2,
  Bell,
  Settings,
  HelpCircle,
  CreditCard as CardIcon,
  Banknote,
  Smartphone,
  Wallet,
  Receipt,
  PieChart,
  BarChart3,
  Activity,
  Users,
  Star,
  MessageSquare,
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'insurance' | 'digital_wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  isDefault: boolean;
  isVerified: boolean;
  addedAt: string;
}

interface InsurancePlan {
  id: string;
  providerName: string;
  planName: string;
  memberNumber: string;
  groupNumber: string;
  coverageType: 'HMO' | 'PPO' | 'EPO' | 'POS';
  copay: number;
  deductible: number;
  outOfPocketMax: number;
  coveragePercentage: number;
  isActive: boolean;
  verifiedAt?: string;
  benefits: {
    primaryCare: number;
    specialist: number;
    emergency: number;
    prescription: number;
    labTests: number;
    imaging: number;
  };
}

interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  serviceDate: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'paid' | 'overdue' | 'cancelled' | 'disputed';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  items: BillingItem[];
  insuranceCoverage: number;
  patientResponsibility: number;
  paymentMethod?: string;
  paymentDate?: string;
  transactionId?: string;
  notes?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface BillingItem {
  id: string;
  description: string;
  code: string; // CPT/HCPCS code
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'consultation' | 'procedure' | 'test' | 'medication' | 'other';
  covered: boolean;
  insuranceCoverage: number;
  patientResponsibility: number;
}

interface PaymentTransaction {
  id: string;
  billId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedAt: string;
  paymentMethodId: string;
  failureReason?: string;
  refundAmount?: number;
  refundDate?: string;
}

interface PaymentPlan {
  id: string;
  billId: string;
  totalAmount: number;
  installmentAmount: number;
  numberOfInstallments: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextPaymentDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'overdue';
  paidInstallments: number;
  remainingInstallments: number;
}

export default function PaymentBilling() {
  const [activeTab, setActiveTab] = useState<'bills' | 'payment_methods' | 'insurance' | 'transactions' | 'analytics'>('bills');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState<string | null>(null);
  const [expandedBills, setExpandedBills] = useState<Record<string, boolean>>({});

  const [bills, setBills] = useState<Bill[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: 'credit_card',
    isDefault: false
  });

  const [newInsurancePlan, setNewInsurancePlan] = useState<Partial<InsurancePlan>>({
    coverageType: 'PPO',
    isActive: true,
    benefits: {
      primaryCare: 80,
      specialist: 70,
      emergency: 90,
      prescription: 70,
      labTests: 80,
      imaging: 80
    }
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [billsRes, paymentMethodsRes, insuranceRes, transactionsRes, plansRes] = await Promise.all([
        api.get('/billing/bills'),
        api.get('/billing/payment-methods'),
        api.get('/billing/insurance'),
        api.get('/billing/transactions'),
        api.get('/billing/payment-plans')
      ]);

      setBills(billsRes.data);
      setPaymentMethods(paymentMethodsRes.data);
      setInsurancePlans(insuranceRes.data);
      setTransactions(transactionsRes.data);
      setPaymentPlans(plansRes.data);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'disputed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="text-green-500" size={16} />;
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'processing': return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'overdue': return <AlertTriangle className="text-red-500" size={16} />;
      case 'cancelled': return <XCircle className="text-slate-500" size={16} />;
      case 'disputed': return <AlertCircle className="text-orange-500" size={16} />;
      default: return <Clock className="text-slate-500" size={16} />;
    }
  };

  const addPaymentMethod = async () => {
    try {
      const response = await api.post('/billing/payment-methods', newPaymentMethod);
      setPaymentMethods([...paymentMethods, response.data]);
      setShowAddPaymentMethod(false);
      setNewPaymentMethod({ type: 'credit_card', isDefault: false });
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const addInsurancePlan = async () => {
    try {
      const response = await api.post('/billing/insurance', newInsurancePlan);
      setInsurancePlans([...insurancePlans, response.data]);
      setShowAddInsurance(false);
      setNewInsurancePlan({
        coverageType: 'PPO',
        isActive: true,
        benefits: {
          primaryCare: 80,
          specialist: 70,
          emergency: 90,
          prescription: 70,
          labTests: 80,
          imaging: 80
        }
      });
    } catch (error) {
      console.error('Failed to add insurance plan:', error);
    }
  };

  const payBill = async (billId: string, paymentMethodId: string, amount: number) => {
    try {
      const response = await api.post(`/billing/bills/${billId}/pay`, {
        paymentMethodId,
        amount
      });
      
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, status: 'processing' as const, paidAmount: bill.paidAmount + amount }
          : bill
      ));
      
      setTransactions(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const createPaymentPlan = async (billId: string, installmentAmount: number, numberOfInstallments: number, frequency: string) => {
    try {
      const response = await api.post('/billing/payment-plans', {
        billId,
        installmentAmount,
        numberOfInstallments,
        frequency
      });
      
      setPaymentPlans(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to create payment plan:', error);
    }
  };

  const disputeBill = async (billId: string, reason: string) => {
    try {
      await api.post(`/billing/bills/${billId}/dispute`, { reason });
      setBills(prev => prev.map(bill => 
        bill.id === billId ? { ...bill, status: 'disputed' as const } : bill
      ));
    } catch (error) {
      console.error('Failed to dispute bill:', error);
    }
  };

  const downloadBill = async (billId: string) => {
    try {
      const response = await api.get(`/billing/bills/${billId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download bill:', error);
    }
  };

  const toggleBillExpansion = (billId: string) => {
    setExpandedBills(prev => ({
      ...prev,
      [billId]: !prev[billId]
    }));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard size={20} />;
      case 'bank_account':
        return <Building size={20} />;
      case 'insurance':
        return <Shield size={20} />;
      case 'digital_wallet':
        return <Smartphone size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateTotalOutstanding = () => {
    return bills.reduce((total, bill) => total + bill.remainingAmount, 0);
  };

  const calculateMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.processedAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.status === 'completed';
      })
      .reduce((total, t) => total + t.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading billing information..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment & Billing</h1>
            <p className="text-slate-600 mt-1">Manage payments, insurance, and billing</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-900">${calculateTotalOutstanding().toFixed(2)}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={16} />
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-900">${calculateTotalOutstanding().toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {bills.filter(b => b.status === 'overdue').length} overdue
              </p>
            </div>
            <DollarSign className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Monthly Spending</p>
              <p className="text-2xl font-bold text-slate-900">${calculateMonthlySpending().toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Active Plans</p>
              <p className="text-2xl font-bold text-slate-900">{paymentPlans.filter(p => p.status === 'active').length}</p>
              <p className="text-xs text-slate-500 mt-1">Payment plans</p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Insurance Coverage</p>
              <p className="text-2xl font-bold text-slate-900">{insurancePlans.filter(i => i.isActive).length}</p>
              <p className="text-xs text-slate-500 mt-1">Active plans</p>
            </div>
            <Shield className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'bills', name: 'Bills', icon: FileText },
              { id: 'payment_methods', name: 'Payment Methods', icon: CreditCard },
              { id: 'insurance', name: 'Insurance', icon: Shield },
              { id: 'transactions', name: 'Transactions', icon: Activity },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
          {/* Bills Tab */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search bills..."
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
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleBillExpansion(bill.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {expandedBills[bill.id] ? 
                            <ChevronDown className="text-slate-400 mt-1" size={20} /> : 
                            <ChevronRight className="text-slate-400 mt-1" size={20} />
                          }
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-900">Bill #{bill.id.slice(-8)}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(bill.status)}`}>
                                {bill.status}
                              </span>
                              {bill.status === 'overdue' && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border-red-200">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {bill.doctorName} • {new Date(bill.serviceDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-slate-600">Total: ${bill.totalAmount.toFixed(2)}</span>
                              <span className="text-slate-600">Paid: ${bill.paidAmount.toFixed(2)}</span>
                              <span className="font-medium text-slate-900">Remaining: ${bill.remainingAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(bill.status)}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadBill(bill.id);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedBills[bill.id] && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Billing Items</h5>
                            <div className="space-y-2">
                              {bill.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <div>
                                    <p className="font-medium text-slate-900">{item.description}</p>
                                    <p className="text-slate-600">Code: {item.code} • Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-slate-900">${item.totalPrice.toFixed(2)}</p>
                                    <p className="text-slate-600">
                                      Insurance: ${item.insuranceCoverage.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">Insurance Coverage</p>
                              <p className="font-medium text-slate-900">${bill.insuranceCoverage.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-slate-600">Patient Responsibility</p>
                              <p className="font-medium text-slate-900">${bill.patientResponsibility.toFixed(2)}</p>
                            </div>
                          </div>

                          {bill.status !== 'paid' && bill.status !== 'cancelled' && (
                            <div className="flex items-center gap-3 pt-3">
                              <button
                                onClick={() => {
                                  // Handle payment
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <CreditCard size={16} />
                                Pay Now
                              </button>
                              <button
                                onClick={() => {
                                  // Handle payment plan
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                              >
                                <Calendar size={16} />
                                Payment Plan
                              </button>
                              <button
                                onClick={() => {
                                  // Handle dispute
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                              >
                                <AlertCircle size={16} />
                                Dispute
                              </button>
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

          {/* Payment Methods Tab */}
          {activeTab === 'payment_methods' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Payment Methods</h3>
                <button
                  onClick={() => setShowAddPaymentMethod(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Payment Method
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getPaymentMethodIcon(method.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">
                              {method.type === 'credit_card' || method.type === 'debit_card' ? 
                                `${method.brand} •••• ${method.last4}` :
                                method.type === 'bank_account' ? 
                                `${method.bankName} •••• ${method.accountNumber?.slice(-4)}` :
                                method.type === 'insurance' ? 
                                method.cardholderName || 'Insurance Plan' :
                                'Digital Wallet'
                              }
                            </h4>
                            {method.isDefault && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border-blue-200">
                                Default
                              </span>
                            )}
                            {method.isVerified && (
                              <CheckCircle className="text-green-500" size={16} />
                            )}
                          </div>
                          {(method.type === 'credit_card' || method.type === 'debit_card') && (
                            <p className="text-sm text-slate-600 mt-1">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            Added {new Date(method.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Tab */}
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Insurance Plans</h3>
                <button
                  onClick={() => setShowAddInsurance(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Insurance
                </button>
              </div>

              <div className="space-y-4">
                {insurancePlans.map((plan) => (
                  <div key={plan.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">{plan.providerName}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            plan.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {plan.verifiedAt && (
                            <CheckCircle className="text-green-500" size={16} />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{plan.planName}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Member Number</p>
                            <p className="font-medium text-slate-900">{plan.memberNumber}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Group Number</p>
                            <p className="font-medium text-slate-900">{plan.groupNumber}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Plan Type</p>
                            <p className="font-medium text-slate-900">{plan.coverageType}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Copay</p>
                            <p className="font-medium text-slate-900">${plan.copay}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Deductible</p>
                            <p className="font-medium text-slate-900">${plan.deductible}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Coverage</p>
                            <p className="font-medium text-slate-900">{plan.coveragePercentage}%</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-medium text-slate-900 mb-2">Coverage Benefits</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Primary Care:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.primaryCare}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Specialist:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.specialist}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Emergency:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.emergency}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Prescription:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.prescription}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Lab Tests:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.labTests}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Imaging:</span>
                              <span className="font-medium text-slate-900">{plan.benefits.imaging}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
              
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium text-slate-900">
                            {transaction.method.charAt(0).toUpperCase() + transaction.method.slice(1)} Payment
                          </p>
                          <p className="text-sm text-slate-600">
                            {new Date(transaction.processedAt).toLocaleDateString()} • 
                            Bill #{transaction.billId.slice(-8)}
                          </p>
                          {transaction.failureReason && (
                            <p className="text-sm text-red-600 mt-1">{transaction.failureReason}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${transaction.amount.toFixed(2)}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        {transaction.refundAmount && (
                          <p className="text-sm text-slate-600 mt-1">
                            Refunded: ${transaction.refundAmount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Billing Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Monthly Spending Trend</h4>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="text-slate-400" size={48} />
                    <p className="text-slate-500 ml-2">Chart placeholder</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">Payment Method Distribution</h4>
                  <div className="h-64 flex items-center justify-center">
                    <PieChart className="text-slate-400" size={48} />
                    <p className="text-slate-500 ml-2">Chart placeholder</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Insurance Utilization</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      ${transactions.reduce((total, t) => total + t.amount, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">Total Processed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${bills.reduce((total, b) => total + b.insuranceCoverage, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">Insurance Covered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      ${bills.reduce((total, b) => total + b.patientResponsibility, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">Patient Responsibility</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Type</label>
                <select
                  value={newPaymentMethod.type}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_account">Bank Account</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>

              {(newPaymentMethod.type === 'credit_card' || newPaymentMethod.type === 'debit_card') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPaymentMethod.isDefault}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, isDefault: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-700">Set as default payment method</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addPaymentMethod}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
