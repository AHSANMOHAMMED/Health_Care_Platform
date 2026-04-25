/**
 * MediConnect Lanka — Centralized API Services
 * Maps every frontend feature to the correct microservice endpoint via API Gateway.
 * Uses the existing apiRequest client (auth token injection, retry, error handling).
 */

import { apiRequest } from './axios';

// ============================================================
// SHARED TYPES
// ============================================================

export interface Patient {
  id: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  lastVisit?: string;
  nextAppointment?: string;
  condition?: string;
  status?: 'active' | 'inactive' | 'critical';
  allergies?: string[];
  medications?: string[];
  contact?: { phone?: string; email?: string; address?: string };
  totalVisits?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  email?: string;
  phone?: string;
  address?: string;
  doctorId?: number | string;
}

export interface Appointment {
  id: number | string;
  patientId?: number | string;
  doctorId?: number | string;
  patientName?: string;
  doctorName?: string;
  date?: string;
  time?: string;
  type?: string;
  status?: 'waiting' | 'confirmed' | 'completed' | 'cancelled' | 'pending';
  reason?: string;
  duration?: string;
  priority?: 'normal' | 'high' | 'urgent';
  notes?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  consultationType?: string;
  amount?: number;
}

export interface Prescription {
  id: number | string;
  patientId?: number | string;
  doctorId?: number | string;
  patientName?: string;
  medicineName?: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
  status?: 'active' | 'completed' | 'cancelled';
  createdAt?: string;
  diagnosis?: string;
  medications?: string;
}

export interface AdminUser {
  id: number | string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status?: 'active' | 'suspended' | 'pending';
  createdAt?: string;
  lastLogin?: string;
  phone?: string;
}

export interface DoctorStats {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenueLKR: number;
  avgRating: number;
  thisMonthAppointments: number;
  thisMonthRevenueLKR: number;
}

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  activeUsers: number;
  revenue: number;
}

// ============================================================
// SEED DATA (graceful fallback when API is unavailable)
// ============================================================

const SEED_PATIENTS: Patient[] = [
  { id: 1, name: 'Aruni Wijesinghe', age: 34, gender: 'Female', bloodType: 'O+', lastVisit: '2024-04-18', nextAppointment: '2024-04-28', condition: 'Hypertension', status: 'active', allergies: ['Penicillin'], medications: ['Lisinopril', 'Metformin'], contact: { phone: '+94 77 123 4567', email: 'aruni@gmail.com', address: 'Colombo 05' }, totalVisits: 12, riskLevel: 'medium' },
  { id: 2, name: 'Kasun Perera', age: 45, gender: 'Male', bloodType: 'A+', lastVisit: '2024-04-15', nextAppointment: '2024-04-25', condition: 'Post-Surgery Recovery', status: 'active', allergies: ['None'], medications: ['Aspirin', 'Beta-blockers'], contact: { phone: '+94 71 234 5678', email: 'kasun@gmail.com', address: 'Kandy, Sri Lanka' }, totalVisits: 8, riskLevel: 'high' },
  { id: 3, name: 'Imara Jaffar', age: 28, gender: 'Female', bloodType: 'B+', lastVisit: '2024-04-10', nextAppointment: '2024-05-01', condition: 'Diabetes Type 2', status: 'active', allergies: ['Shellfish'], medications: ['Insulin', 'Metformin'], contact: { phone: '+94 76 345 6789', email: 'imara@gmail.com', address: 'Galle, Sri Lanka' }, totalVisits: 6, riskLevel: 'medium' },
  { id: 4, name: 'Roshan Bandara', age: 52, gender: 'Male', bloodType: 'AB+', lastVisit: '2024-04-05', nextAppointment: '2024-05-05', condition: 'Cardiac Monitoring', status: 'critical', allergies: ['Aspirin'], medications: ['Warfarin', 'Atorvastatin'], contact: { phone: '+94 77 456 7890', email: 'roshan@gmail.com', address: 'Negombo, Sri Lanka' }, totalVisits: 24, riskLevel: 'high' },
];

const SEED_APPOINTMENTS: Appointment[] = [
  { id: 1, patientName: 'Aruni Wijesinghe', date: new Date().toISOString().split('T')[0], time: '10:30 AM', type: 'Video Consult', status: 'confirmed', reason: 'Annual Checkup', duration: '30 mins', priority: 'normal', notes: 'Regular follow-up for hypertension', amount: 2500 },
  { id: 2, patientName: 'Kasun Perera', date: new Date().toISOString().split('T')[0], time: '11:15 AM', type: 'Physical Follow-up', status: 'waiting', reason: 'Post-Surgery Review', duration: '45 mins', priority: 'high', notes: 'Cardiac surgery follow-up', amount: 3500 },
  { id: 3, patientName: 'Imara Jaffar', date: new Date().toISOString().split('T')[0], time: '02:00 PM', type: 'New Patient', status: 'confirmed', reason: 'Initial Consultation', duration: '60 mins', priority: 'normal', notes: 'First-time visit', amount: 3500 },
  { id: 4, patientName: 'Roshan Bandara', date: new Date().toISOString().split('T')[0], time: '03:30 PM', type: 'In-Person', status: 'completed', reason: 'ECG Review', duration: '30 mins', priority: 'high', notes: 'Review ECG results', amount: 3500 },
];

const SEED_PRESCRIPTIONS: Prescription[] = [
  { id: 1, patientName: 'Aruni Wijesinghe', medicineName: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '30 days', instructions: 'Take in the morning with water', status: 'active', createdAt: '2024-04-18', diagnosis: 'Hypertension' },
  { id: 2, patientName: 'Kasun Perera', medicineName: 'Aspirin 75mg', dosage: '1 tablet daily', duration: '90 days', instructions: 'After meals', status: 'active', createdAt: '2024-04-15', diagnosis: 'Cardiac Care' },
  { id: 3, patientName: 'Imara Jaffar', medicineName: 'Metformin 500mg', dosage: '2 tablets daily', duration: '60 days', instructions: 'With meals', status: 'active', createdAt: '2024-04-10', diagnosis: 'Diabetes Type 2' },
];

const SEED_ADMIN_USERS: AdminUser[] = [
  { id: 1, firstName: 'Ahsan', lastName: 'Admin', email: 'admin@mediconnect.lk', role: 'ADMIN', status: 'active', createdAt: '2024-01-01', lastLogin: new Date().toISOString() },
  { id: 2, firstName: 'Dr. Saman', lastName: 'Perera', email: 'doctor@mediconnect.lk', role: 'DOCTOR', status: 'active', createdAt: '2024-01-15', lastLogin: new Date().toISOString() },
  { id: 3, firstName: 'Aruni', lastName: 'Wijesinghe', email: 'patient@mediconnect.lk', role: 'PATIENT', status: 'active', createdAt: '2024-02-01', lastLogin: new Date().toISOString() },
  { id: 4, firstName: 'Nalini', lastName: 'Fernando', email: 'nalini@gmail.com', role: 'PATIENT', status: 'active', createdAt: '2024-02-15', lastLogin: new Date().toISOString() },
  { id: 5, firstName: 'Dr. Priya', lastName: 'Jayasuriya', email: 'drpriya@mediconnect.lk', role: 'DOCTOR', status: 'active', createdAt: '2024-03-01', lastLogin: new Date().toISOString() },
];

// ============================================================
// HELPER
// ============================================================

async function safeCall<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<{ data: T; isLive: boolean }> {
  try {
    const result = await fn();
    return { data: result, isLive: true };
  } catch (e) {
    console.warn(`[MediConnect] ${label} — API unavailable, using seed data.`, e);
    return { data: fallback, isLive: false };
  }
}

// ============================================================
// PATIENT SERVICE  →  /api/patients
// ============================================================

export const patientService = {
  async getAll(doctorId?: number | string) {
    const params = doctorId ? `?doctorId=${doctorId}` : '';
    return safeCall(
      async () => {
        const res = await apiRequest.get<Patient[]>(`/patients${params}`);
        return res.data as Patient[];
      },
      SEED_PATIENTS,
      'patientService.getAll'
    );
  },

  async getById(id: number | string) {
    return safeCall(
      async () => {
        const res = await apiRequest.get<Patient>(`/patients/${id}`);
        return res.data as Patient;
      },
      SEED_PATIENTS[0],
      `patientService.getById(${id})`
    );
  },

  async create(data: Partial<Patient>) {
    const res = await apiRequest.post<Patient>('/patients', {
      firstName: data.name?.split(' ')[0] || data.firstName,
      lastName: data.name?.split(' ').slice(1).join(' ') || data.lastName,
      age: data.age,
      gender: data.gender,
      bloodType: data.bloodType,
      condition: data.condition,
      allergies: data.allergies,
      medications: data.medications,
      email: data.contact?.email || data.email,
      phone: data.contact?.phone || data.phone,
      address: data.contact?.address || data.address,
      doctorId: data.doctorId,
    });
    return res.data as Patient;
  },

  async update(id: number | string, data: Partial<Patient>) {
    const res = await apiRequest.put<Patient>(`/patients/${id}`, data);
    return res.data as Patient;
  },

  async delete(id: number | string) {
    await apiRequest.delete(`/patients/${id}`);
  },
};

// ============================================================
// APPOINTMENT SERVICE  →  /api/appointments
// ============================================================

export const appointmentService = {
  async getAll(filters?: { doctorId?: number | string; patientId?: number | string; date?: string; upcoming?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.doctorId) params.set('doctorId', String(filters.doctorId));
    if (filters?.patientId) params.set('patientId', String(filters.patientId));
    if (filters?.date) params.set('date', filters.date);
    if (filters?.upcoming) params.set('upcoming', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';

    return safeCall(
      async () => {
        const res = await apiRequest.get<Appointment[]>(`/appointments${query}`);
        return res.data as Appointment[];
      },
      SEED_APPOINTMENTS,
      'appointmentService.getAll'
    );
  },

  async create(data: Partial<Appointment>) {
    const res = await apiRequest.post<Appointment>('/appointments', {
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentDate: data.date,
      appointmentTime: data.time,
      consultationType: data.type,
      reason: data.reason,
      duration: data.duration,
      notes: data.notes,
    });
    return res.data as Appointment;
  },

  async updateStatus(id: number | string, status: Appointment['status']) {
    const res = await apiRequest.patch<Appointment>(`/appointments/${id}/status`, { status });
    return res.data as Appointment;
  },

  async update(id: number | string, data: Partial<Appointment>) {
    const res = await apiRequest.put<Appointment>(`/appointments/${id}`, {
      doctorId: data.doctorId,
      appointmentTime: data.date + 'T' + (data.time || '10:00:00'),
    });
    return res.data as Appointment;
  },

  async delete(id: number | string) {
    await apiRequest.delete(`/appointments/${id}`);
  },

  async getStats(doctorId: number | string) {
    return safeCall(
      async () => {
        const res = await apiRequest.get<DoctorStats>(`/appointments/stats?doctorId=${doctorId}`);
        return res.data as DoctorStats;
      },
      {
        totalPatients: 248,
        totalAppointments: 1240,
        completedAppointments: 1180,
        cancelledAppointments: 60,
        totalRevenueLKR: 1250000,
        avgRating: 4.9,
        thisMonthAppointments: 86,
        thisMonthRevenueLKR: 215000,
      } as DoctorStats,
      `appointmentService.getStats(${doctorId})`
    );
  },
};

// ============================================================
// PRESCRIPTION SERVICE  →  /api/prescriptions
// ============================================================

export const prescriptionService = {
  async getAll(filters?: { doctorId?: number | string; patientId?: number | string }) {
    const params = new URLSearchParams();
    if (filters?.doctorId) params.set('doctorId', String(filters.doctorId));
    if (filters?.patientId) params.set('patientId', String(filters.patientId));
    const query = params.toString() ? `?${params.toString()}` : '';

    return safeCall(
      async () => {
        const res = await apiRequest.get<Prescription[]>(`/prescriptions${query}`);
        return res.data as Prescription[];
      },
      SEED_PRESCRIPTIONS,
      'prescriptionService.getAll'
    );
  },

  async create(data: Partial<Prescription>) {
    const res = await apiRequest.post<Prescription>('/prescriptions', data);
    return res.data as Prescription;
  },

  async update(id: number | string, data: Partial<Prescription>) {
    const res = await apiRequest.put<Prescription>(`/prescriptions/${id}`, data);
    return res.data as Prescription;
  },

  async delete(id: number | string) {
    await apiRequest.delete(`/prescriptions/${id}`);
  },
};

// ============================================================
// ADMIN SERVICE  →  /api/admin
// ============================================================

export const adminService = {
  async getUsers(filters?: { role?: string; search?: string; page?: number }) {
    const params = new URLSearchParams();
    if (filters?.role && filters.role !== 'all') params.set('role', filters.role);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    const query = params.toString() ? `?${params.toString()}` : '';

    return safeCall(
      async () => {
        const res = await apiRequest.get<AdminUser[]>(`/admin/users${query}`);
        return res.data as AdminUser[];
      },
      SEED_ADMIN_USERS,
      'adminService.getUsers'
    );
  },

  async getStats() {
    return safeCall(
      async () => {
        const res = await apiRequest.get<SystemStats>('/admin/stats');
        return res.data as SystemStats;
      },
      {
        totalUsers: 1842,
        totalDoctors: 48,
        totalPatients: 1789,
        totalAppointments: 9640,
        activeUsers: 412,
        revenue: 4820000,
      } as SystemStats,
      'adminService.getStats'
    );
  },

  async updateUser(id: number | string, data: Partial<AdminUser>) {
    const res = await apiRequest.put<AdminUser>(`/admin/users/${id}`, data);
    return res.data as AdminUser;
  },

  async deleteUser(id: number | string) {
    await apiRequest.delete(`/admin/users/${id}`);
  },

  async createUser(data: Partial<AdminUser> & { password?: string }) {
    const res = await apiRequest.post<AdminUser>('/auth/register', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password || 'TempPass@123',
      role: data.role,
    });
    return res.data as AdminUser;
  },
};

// ============================================================
// DOCTOR SERVICE  →  /api/doctors
// ============================================================

export const doctorService = {
  async getProfile(doctorId: number | string) {
    return safeCall(
      async () => {
        const res = await apiRequest.get(`/doctors/${doctorId}`);
        return res.data;
      },
      { id: doctorId, name: 'Dr. Saman Perera', specialty: 'General Medicine', rating: 4.9 },
      `doctorService.getProfile(${doctorId})`
    );
  },
};
