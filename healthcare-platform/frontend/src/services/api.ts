import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Gateway port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle network errors gracefully
const handleApiError = (error: any, fallbackData?: any) => {
  console.warn('API Error, using fallback data:', error.message);
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
    // Return fallback data for network errors (connection reset, refused, etc.)
    return Promise.resolve({ data: fallbackData });
  }
  return Promise.reject(error);
};

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // For demo purposes, create a mock successful login when backend is not available
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.warn('Backend not available, using demo login');
        return {
          accessToken: 'demo-token-' + Date.now(),
          user: {
            id: 1,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'PATIENT'
          }
        };
      }
      throw error;
    }
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'PATIENT' | 'DOCTOR';
    phone?: string;
  }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      // For demo purposes, create a mock successful registration when backend is not available
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.warn('Backend not available, using demo registration');
        return {
          accessToken: 'demo-token-' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 1000),
            name: userData.name,
            email: userData.email,
            role: userData.role
          }
        };
      }
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error: any) {
      // Handle logout gracefully even if backend is not available
      console.warn('Backend not available, clearing local storage');
      return { success: true };
    }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  },
  
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

// Doctor API
export const doctorAPI = {
  searchDoctors: async (params: {
    specialty?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/api/doctors', { params });
      return response.data;
    } catch (error: any) {
      // Fallback mock data when backend is not available
      const mockDoctors = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialty: params.specialty || 'Cardiology',
          rating: 4.8,
          reviews: 127,
          experience: '15 years',
          location: 'New York, NY',
          consultationFee: 150,
          availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
          about: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
          education: 'Harvard Medical School',
          languages: ['English', 'Spanish'],
          hospital: 'New York General Hospital'
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          specialty: params.specialty || 'Neurology',
          rating: 4.9,
          reviews: 203,
          experience: '12 years',
          location: 'Boston, MA',
          consultationFee: 175,
          availableSlots: ['11:00 AM', '01:00 PM', '04:00 PM'],
          about: 'Specialist in neurological disorders and brain injuries.',
          education: 'Johns Hopkins University',
          languages: ['English', 'Mandarin'],
          hospital: 'Boston Medical Center'
        }
      ];
      
      return handleApiError(error, { doctors: mockDoctors });
    }
  },
  
  getDoctorById: async (id: string) => {
    try {
      const response = await api.get(`/api/doctors/${id}`);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, { 
        doctor: {
          id: parseInt(id),
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          rating: 4.8,
          reviews: 127,
          experience: '15 years',
          location: 'New York, NY',
          consultationFee: 150,
          availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
          about: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
          education: 'Harvard Medical School',
          languages: ['English', 'Spanish'],
          hospital: 'New York General Hospital'
        }
      });
    }
  },
  
  getDoctorProfile: async () => {
    const response = await api.get('/api/doctors/profile');
    return response.data;
  },
  
  updateDoctorProfile: async (profileData: any) => {
    const response = await api.put('/api/doctors/profile', profileData);
    return response.data;
  },
  
  getDoctorAvailability: async (doctorId: string) => {
    const response = await api.get(`/api/doctors/${doctorId}/availability`);
    return response.data;
  },
};

// Appointment API
export const appointmentAPI = {
  createAppointment: async (appointmentData: {
    doctorId: string;
    date: string;
    time: string;
    type: 'video' | 'in-person';
    notes?: string;
  }) => {
    try {
      const response = await api.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error: any) {
      // Create mock appointment when backend is not available
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        console.warn('Backend not available, creating mock appointment');
        return {
          id: Date.now(),
          ...appointmentData,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  getAppointments: async (params?: {
    status?: 'upcoming' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/api/appointments', { params });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, { 
        appointments: [
          {
            id: 1,
            doctorId: '1',
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: '2026-04-10',
            time: '10:00 AM',
            type: 'video',
            status: 'upcoming',
            notes: 'Regular checkup'
          }
        ]
      });
    }
  },
  
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
  },
  
  updateAppointment: async (id: string, updateData: any) => {
    const response = await api.put(`/api/appointments/${id}`, updateData);
    return response.data;
  },
  
  cancelAppointment: async (id: string, reason?: string) => {
    const response = await api.post(`/api/appointments/${id}/cancel`, { reason });
    return response.data;
  },
  
  getDoctorAppointments: async (params?: {
    date?: string;
    status?: string;
  }) => {
    const response = await api.get('/api/appointments/doctor', { params });
    return response.data;
  },
};

// Medical Records API
export const medicalRecordsAPI = {
  getRecords: async (params?: {
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/medical-records', { params });
    return response.data;
  },
  
  uploadRecord: async (file: File, metadata: {
    type: string;
    description: string;
    date: string;
  }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    const response = await api.post('/api/medical-records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  downloadRecord: async (id: string) => {
    const response = await api.get(`/api/medical-records/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  shareRecord: async (id: string, recipientEmail: string) => {
    const response = await api.post(`/api/medical-records/${id}/share`, {
      recipientEmail
    });
    return response.data;
  },
};

// Messaging API
export const messagingAPI = {
  getConversations: async () => {
    const response = await api.get('/api/messages/conversations');
    return response.data;
  },
  
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/api/messages/conversations/${conversationId}`);
    return response.data;
  },
  
  sendMessage: async (conversationId: string, content: string, attachments?: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    if (attachments) {
      attachments.forEach(file => formData.append('attachments', file));
    }
    const response = await api.post(`/api/messages/conversations/${conversationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  startConversation: async (doctorId: string, initialMessage: string) => {
    const response = await api.post('/api/messages/conversations', {
      doctorId,
      initialMessage
    });
    return response.data;
  },
  
  markMessagesAsRead: async (conversationId: string) => {
    const response = await api.post(`/api/messages/conversations/${conversationId}/read`);
    return response.data;
  },
};

// Prescription API
export const prescriptionAPI = {
  getPrescriptions: async (params?: {
    status?: 'active' | 'completed' | 'expired';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/prescriptions', { params });
    return response.data;
  },
  
  getPrescriptionById: async (id: string) => {
    const response = await api.get(`/api/prescriptions/${id}`);
    return response.data;
  },
  
  requestRefill: async (prescriptionId: string) => {
    const response = await api.post(`/api/prescriptions/${prescriptionId}/refill`);
    return response.data;
  },
  
  markAsTaken: async (prescriptionId: string) => {
    const response = await api.post(`/api/prescriptions/${prescriptionId}/taken`);
    return response.data;
  },
  
  getMedicationReminders: async () => {
    const response = await api.get('/api/prescriptions/reminders');
    return response.data;
  },
};

// Billing API
export const billingAPI = {
  getBills: async (params?: {
    status?: 'paid' | 'pending' | 'overdue';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/billing/bills', { params });
    return response.data;
  },
  
  getBillById: async (id: string) => {
    const response = await api.get(`/api/billing/bills/${id}`);
    return response.data;
  },
  
  payBill: async (billId: string, paymentData: {
    paymentMethodId: string;
    amount: number;
  }) => {
    const response = await api.post(`/api/billing/bills/${billId}/pay`, paymentData);
    return response.data;
  },
  
  getPaymentMethods: async () => {
    const response = await api.get('/api/billing/payment-methods');
    return response.data;
  },
  
  addPaymentMethod: async (paymentData: {
    type: 'credit-card' | 'debit-card' | 'insurance';
    details: any;
  }) => {
    const response = await api.post('/api/billing/payment-methods', paymentData);
    return response.data;
  },
  
  getInsuranceInfo: async () => {
    const response = await api.get('/api/billing/insurance');
    return response.data;
  },
};

// Emergency API
export const emergencyAPI = {
  getNearbyEmergencyServices: async (location?: {
    latitude: number;
    longitude: number;
  }) => {
    const response = await api.get('/api/emergency/services', { params: location });
    return response.data;
  },
  
  contactEmergencyService: async (serviceType: string, location: string) => {
    const response = await api.post('/api/emergency/contact', {
      serviceType,
      location
    });
    return response.data;
  },
  
  getSymptomChecker: async (symptoms: string[]) => {
    const response = await api.post('/api/emergency/symptom-checker', {
      symptoms
    });
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (params?: {
    type?: string;
    read?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },
  
  markAsRead: async (notificationId: string) => {
    const response = await api.post(`/api/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.post('/api/notifications/read-all');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (params?: {
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },
  
  verifyDoctor: async (doctorId: string) => {
    const response = await api.patch(`/api/admin/doctors/${doctorId}/verify`);
    return response.data;
  },
  
  getAnalytics: async () => {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  },
  
  getAppointments: async (params?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await api.get('/api/admin/appointments', { params });
    return response.data;
  },
};

export default api;
