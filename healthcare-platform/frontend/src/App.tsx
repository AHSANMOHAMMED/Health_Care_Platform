import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import api from './api';
import { AgoraVideoRoom } from './components/AgoraVideoRoom';
import { DoctorProfile } from './components/DoctorProfile';
import { DoctorSearch } from './components/DoctorSearch';
import { PublicDoctorProfile } from './components/PublicDoctorProfile';

type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export default function App() {
  const [role, setRole] = useState<Role | null>(() => (localStorage.getItem('role') as Role) || null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold text-indigo-600">
            Healthcare
          </Link>
          <nav className="flex gap-3 text-sm">
            {!role && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {role === 'PATIENT' && <Link to="/patient">Patient</Link>}
            {role === 'DOCTOR' && <Link to="/doctor">Doctor</Link>}
            {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
            {role && (
              <button type="button" className="text-slate-500" onClick={logout}>
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Home role={role} />} />
          <Route path="/login" element={<Login onAuth={setRole} />} />
          <Route path="/register" element={<Register onAuth={setRole} />} />
          <Route path="/patient" element={role === 'PATIENT' ? <Patient /> : <Navigate to="/login" />} />
          <Route path="/doctor" element={role === 'DOCTOR' ? <Doctor /> : <Navigate to="/login" />} />
          <Route path="/admin" element={role === 'ADMIN' ? <Admin /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

function Home({ role }: { role: Role | null }) {
  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-slate-700">
        Stack: Spring Boot 3.3 / Java 21, Spring Cloud 2023 (Eureka + Gateway), PostgreSQL per service, React 18 +
        Vite + Tailwind.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Admin seed: <code className="rounded bg-slate-100 px-1">admin@healthcare.local</code> /{' '}
        <code className="rounded bg-slate-100 px-1">Admin#12345</code>
      </p>
    </div>
  );
}

function Login({ onAuth }: { onAuth: (r: Role) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken ?? data.access_token);
    onAuth(data.user.role);
    localStorage.setItem('role', data.user.role);
  };
  return (
    <form onSubmit={submit} className="max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Login</h2>
      <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <input className="w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button type="submit" className="w-full rounded bg-indigo-600 py-2 text-white">
        Sign in
      </button>
    </form>
  );
}

function Register({ onAuth }: { onAuth: (r: Role) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [r, setR] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/api/auth/register', { email, password, role: r });
    localStorage.setItem('token', data.accessToken ?? data.access_token);
    onAuth(data.user.role);
    localStorage.setItem('role', data.user.role);
  };
  return (
    <form onSubmit={submit} className="max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Register</h2>
      <select className="w-full rounded border px-3 py-2" value={r} onChange={(e) => setR(e.target.value as 'PATIENT' | 'DOCTOR')}>
        <option value="PATIENT">Patient</option>
        <option value="DOCTOR">Doctor</option>
      </select>
      <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <input className="w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required />
      <button type="submit" className="w-full rounded bg-indigo-600 py-2 text-white">
        Create account
      </button>
    </form>
  );
}

function Patient() {
  const [channel, setChannel] = useState('demo-channel');
  const [token, setToken] = useState('mock-token');
  const [appId, setAppId] = useState(import.meta.env.VITE_AGORA_APP_ID || 'demo-app-id');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  if (selectedDoctor) {
    return (
      <PublicDoctorProfile 
        doctorId={selectedDoctor.userId} 
        onBack={() => setSelectedDoctor(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Patient dashboard</h2>
        <p className="text-sm text-slate-600">Book via API: POST /api/appointments (requires profile).</p>
      </div>
      <DoctorSearch onSelectDoctor={setSelectedDoctor} />
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Telemedicine Settings</h3>
        <label className="block text-sm font-medium">Agora channel</label>
        <input className="mt-1 w-full rounded border px-2 py-1" value={channel} onChange={(e) => setChannel(e.target.value)} />
        <label className="mt-2 block text-sm font-medium">Token</label>
        <input className="mt-1 w-full rounded border px-2 py-1" value={token} onChange={(e) => setToken(e.target.value)} />
        <label className="mt-2 block text-sm font-medium">App ID</label>
        <input className="mt-1 w-full rounded border px-2 py-1" value={appId} onChange={(e) => setAppId(e.target.value)} />
      </div>
      <AgoraVideoRoom appId={appId} channel={channel} token={token} uid={1001} />
    </div>
  );
}

function Doctor() {
  return <DoctorProfile />;
}

function Admin() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="font-semibold">Admin</h2>
      <p className="text-sm text-slate-600">GET /api/users, verify doctors PATCH /api/doctors/admin/&#123;id&#125;/verification</p>
    </div>
  );
}
