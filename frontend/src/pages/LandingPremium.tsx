import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  ArrowRight, Zap, Sparkles, Play, ShieldCheck, Video,
  Microscope, PhoneCall, ChevronLeft, ChevronRight,
  Heart, Brain, Star, Menu, X, MapPin,
  Activity, Users, Award, Globe, Stethoscope,
  AlertTriangle, CheckCircle, MessageSquare, Smartphone
} from 'lucide-react';
import logo from '../assets/logo.png';
import hero1 from '../assets/hero-1.png';
import hero2 from '../assets/hero-2.png';
import hero3 from '../assets/hero-3.png';

const TESTIMONIALS = [
  { name: 'Nethmi Rajapaksa', role: 'Patient, Colombo', text: 'The AI symptom checker detected my hypertension risk before I even visited a clinic. MediConnect literally saved my life.', rating: 5, avatar: 'N' },
  { name: 'Dr. Pradeep Wijesinghe', role: 'Cardiologist, Kandy', text: 'The platform seamlessly integrates with our hospital systems. Patient records are instantly accessible, saving critical time.', rating: 5, avatar: 'P' },
  { name: 'Kasun Fernando', role: 'Patient, Galle', text: 'Booked an appointment in under 2 minutes. The video consultation felt like a real clinic visit. Incredible technology.', rating: 5, avatar: 'K' },
  { name: 'Amali Perera', role: 'Patient, Negombo', text: 'When my father had a cardiac episode, the 1990 integration dispatched an ambulance in under 4 minutes. Unbelievable service.', rating: 5, avatar: 'A' },
];

const STATS = [
  { value: 1842, label: 'Patients Served Today', suffix: '+', color: 'text-[#FFBE29]' },
  { value: 248, label: 'Specialist Doctors', suffix: '+', color: 'text-white' },
  { value: 25, label: 'Districts Connected', suffix: '', color: 'text-[#FFBE29]' },
  { value: 4, label: 'Avg Emergency Response', suffix: 'min', color: 'text-white' },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ value, label, suffix, color, start }: { value: number; label: string; suffix: string; color: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center px-8 py-6">
      <p className={`text-4xl md:text-5xl font-black tracking-tighter ${color}`}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function LandingPremium() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const role = useAuthStore(state => state.role);

  const heroSlides = [
    {
      image: hero1,
      badge: 'Clinical Excellence',
      title: "Sri Lanka's Most Advanced Medical Hub",
      subtitle: 'Connect with 248+ specialist doctors from Colombo to Jaffna. Real appointments, real results.',
      accent: '#FFBE29',
    },
    {
      image: hero2,
      badge: 'Life-Saving Response',
      title: 'Instant 1990 Emergency Integration',
      subtitle: 'When every second counts — your health ID dispatches Suwa Seriya with your medical history pre-loaded.',
      accent: '#FF6B6B',
    },
    {
      image: hero3,
      badge: 'AI-Powered Diagnosis',
      title: 'Describe Symptoms. Get Expert Analysis.',
      subtitle: 'Our AI doctor understands English, Sinhala, and Tamil — text, voice, or photo. 24/7, no appointment needed.',
      accent: '#4ECDC4',
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(p => (p + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Doctors', to: '/booking' },
    { label: 'Emergency', to: '/emergency' },
    { label: 'AI Diagnosis', to: '/ai-checker' },
    { label: 'Services', to: '/services' },
  ];

  const features = [
    { icon: Video, title: 'Video Consultations', desc: 'HD face-to-face with top Sri Lankan specialists — from home, office, or anywhere.', color: 'from-blue-500 to-indigo-600', link: '/booking' },
    { icon: Brain, title: 'AI Symptom Doctor', desc: 'Describe symptoms in English, Sinhala, or Tamil. Upload photos. Get expert-level diagnosis instantly.', color: 'from-purple-500 to-pink-600', link: '/ai-checker' },
    { icon: PhoneCall, title: '1990 Suwa Seriya', desc: 'Emergency dispatch in under 4 minutes. Your medical history pre-shared with paramedics automatically.', color: 'from-red-500 to-rose-600', link: '/emergency' },
    { icon: Microscope, title: 'Lab & Report Sync', desc: 'Instant digital access to results from Lanka Hospitals, Asiri, Nawaloka, and 40+ labs.', color: 'from-emerald-500 to-teal-600', link: '/records' },
    { icon: Stethoscope, title: 'Specialist Booking', desc: 'Browse 248 verified doctors by specialty, location, rating, and availability. Book in 60 seconds.', color: 'from-amber-500 to-orange-600', link: '/booking' },
    { icon: Smartphone, title: 'Wearable Health Sync', desc: 'Sync your smartwatch data for continuous heart rate, oxygen, and sleep monitoring.', color: 'from-cyan-500 to-sky-600', link: '/patient' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden selection:bg-[#8D153A]/20">

      {/* ============================================================
          NAVBAR — Glass morphism, fixed, responsive
      ============================================================ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrollY > 60 ? 'bg-[#0A0A0F]/90 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img src={logo} alt="MediConnect Lanka" className="h-10 w-auto brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500 drop-shadow-lg" />
            <div className="hidden sm:block leading-none">
              <p className="text-lg font-black tracking-tighter text-white leading-none">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">National Health Network</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 uppercase tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Sign In
            </Link>
            <Link to="/register" className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#8D153A] hover:bg-[#71112D] text-white transition-all shadow-lg shadow-[#8D153A]/30 flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all">
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0A0A0F]/98 backdrop-blur-2xl border-b border-white/5 px-6 pb-8 pt-4">
            <div className="space-y-1 mb-6">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-bold">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 rounded-xl text-center text-sm font-bold border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="py-3 rounded-xl text-center text-sm font-black bg-[#8D153A] text-white hover:bg-[#71112D] transition-all">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================
          HERO CAROUSEL — Full viewport, cinematic
      ============================================================ */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover scale-105 animate-slow-zoom" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 via-transparent to-[#0A0A0F]/30" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full pt-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-black uppercase tracking-[0.25em] mb-6 animate-slide-up">
                <Sparkles size={12} style={{ color: heroSlides[currentSlide].accent }} />
                <span style={{ color: heroSlides[currentSlide].accent }}>{heroSlides[currentSlide].badge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.0] mb-6 animate-slide-up text-white drop-shadow-2xl">
                {heroSlides[currentSlide].title.split(' ').map((word, i, arr) =>
                  i >= arr.length - 2
                    ? <span key={i} style={{ color: heroSlides[currentSlide].accent }}>{word} </span>
                    : <span key={i}>{word} </span>
                )}
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-medium animate-slide-up">
                {heroSlides[currentSlide].subtitle}
              </p>

              <div className="flex flex-wrap gap-4 animate-slide-up">
                <Link to="/register" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black text-base transition-all shadow-2xl shadow-[#8D153A]/40 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95">
                  Create Health ID <ArrowRight size={20} />
                </Link>
                <Link to="/ai-checker" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base transition-all hover:bg-white/20 hover:-translate-y-0.5">
                  <Play size={18} fill="white" /> Try AI Doctor
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10 animate-slide-up">
                {['SLMC Certified', '256-bit Secure', '24/7 Available'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CheckCircle size={14} className="text-emerald-400" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-6 lg:left-12 z-20 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${idx === currentSlide ? 'w-12 bg-[#FFBE29]' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>

        {/* Carousel nav */}
        <div className="absolute bottom-8 right-6 lg:right-12 z-20 flex gap-3">
          <button onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md">
            <ChevronLeft size={22} />
          </button>
          <button onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
            className="w-12 h-12 rounded-full bg-[#8D153A] flex items-center justify-center text-white hover:bg-[#71112D] transition-all shadow-lg">
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:flex flex-col items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Scroll</p>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================================
          LIVE STATS COUNTER
      ============================================================ */}
      <section ref={statsRef} className="bg-slate-950 border-y border-white/5 py-2">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {STATS.map((s, i) => (
              <StatCounter key={i} {...s} start={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          EMERGENCY CTA STRIP
      ============================================================ */}
      <section className="relative bg-gradient-to-r from-red-900/80 via-[#8D153A] to-red-900/80 border-y border-red-500/20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-red-300 animate-pulse" />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-none">Medical Emergency?</p>
              <p className="text-red-200 font-bold text-sm">Suwa Seriya dispatched in under 4 minutes with your medical history</p>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:1990" className="flex items-center gap-3 px-8 py-3 bg-white text-red-700 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/50 animate-pulse-border">
              <PhoneCall size={22} /> Call 1990
            </a>
            <Link to="/emergency" className="flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
              Find Hospitals <MapPin size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          TRUST / CERTIFICATIONS BAR
      ============================================================ */}
      <section className="bg-[#0D0D14] border-b border-white/5 py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-wrap justify-center md:justify-between items-center gap-8">
          {[
            { icon: ShieldCheck, label: 'SLMC Certified', sub: 'Ministry of Health', color: 'text-emerald-400' },
            { icon: Globe, label: '25 Districts', sub: 'Island-wide Coverage', color: 'text-blue-400' },
            { icon: Zap, label: '1990 Ready', sub: 'Instant Dispatch', color: 'text-[#FFBE29]' },
            { icon: Award, label: 'ISO 27001', sub: 'Data Security', color: 'text-purple-400' },
            { icon: Activity, label: '99.9% Uptime', sub: 'Azure Powered', color: 'text-cyan-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <item.icon size={24} className={item.color} />
              </div>
              <div>
                <p className="font-black text-white text-sm">{item.label}</p>
                <p className="text-xs font-bold text-slate-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          FEATURES — BENTO GRID
      ============================================================ */}
      <section className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full border border-[#8D153A]/30 bg-[#8D153A]/10 text-[#FF6B8A] text-xs font-black uppercase tracking-[0.3em] mb-6">
            Innovative Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
            Modern Healthcare,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D153A] to-[#FFBE29]">Built for Lanka.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Every feature designed around Sri Lankan patients — our languages, our hospitals, our emergency numbers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Link key={i} to={f.link}
              className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.05] transition-all duration-500 rounded-3xl`} />
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <f.icon size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm mb-6">{f.desc}</p>
              <div className="flex items-center gap-2 text-sm font-black text-slate-500 group-hover:text-white transition-colors">
                Explore <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
      ============================================================ */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="inline-block px-4 py-2 rounded-full border border-[#FFBE29]/20 bg-[#FFBE29]/5 text-[#FFBE29] text-xs font-black uppercase tracking-[0.3em] mb-6">
              Patient Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] mb-6">
              Trusted by<br /><span className="text-[#FFBE29]">Thousands</span><br />Across Lanka
            </h2>
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === testimonialIndex ? 'w-10 bg-[#8D153A]' : 'w-4 bg-white/10 hover:bg-white/20'}`} />
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-all duration-500 ${i === testimonialIndex ? 'bg-[#8D153A]/10 border-[#8D153A]/30 scale-100' : 'bg-white/[0.02] border-white/5 scale-95 opacity-60'}`}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#FFBE29" className="text-[#FFBE29]" />)}
                </div>
                <p className="text-slate-300 font-medium leading-relaxed text-sm mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8D153A] to-[#FFBE29] flex items-center justify-center text-white font-black">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Start in <span className="text-[#FFBE29]">3 Steps</span>
          </h2>
          <p className="text-slate-400 font-medium">No paperwork. No waiting rooms.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#8D153A] to-[#FFBE29]" />
          {[
            { step: '01', title: 'Create Health ID', desc: 'Sign up with your details in under 2 minutes. Your secure health profile is instantly created.', icon: Users },
            { step: '02', title: 'Describe or Upload', desc: 'Tell our AI your symptoms by typing, speaking, or uploading a photo. Any language.', icon: MessageSquare },
            { step: '03', title: 'Get Instant Care', desc: 'Receive diagnosis, book a doctor, or dispatch emergency services — all from one screen.', icon: Heart },
          ].map((s, i) => (
            <div key={i} className="relative text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8D153A] to-[#FFBE29] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#8D153A]/30">
                <s.icon size={32} className="text-white" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8D153A] mb-3">{s.step}</div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{s.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
      ============================================================ */}
      <section className="py-16 px-6 lg:px-12 max-w-[1400px] mx-auto w-full mb-8">
        <div className="relative rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A] via-[#5A0D24] to-[#1a0510]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,190,41,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[#FFBE29] text-xs font-black uppercase tracking-[0.25em] mb-8">
                <Sparkles size={12} /> Join 1,842+ patients served today
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tighter">
                Your Health ID<br />Awaits You.
              </h2>
              <p className="text-xl text-white/70 font-medium leading-relaxed">
                The most advanced healthcare platform in South Asia. Built for every Sri Lankan — from Jaffna to Galle.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              <Link to="/register" className="flex items-center justify-center gap-4 h-16 px-12 bg-white text-[#8D153A] text-lg rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all min-w-[240px]">
                Create Free Account <ArrowRight size={22} />
              </Link>
              <Link to="/ai-checker" className="flex items-center justify-center gap-3 h-14 px-10 bg-white/10 border border-white/20 text-white text-base rounded-2xl font-bold hover:bg-white/20 transition-all">
                <Brain size={20} /> Try AI First, No Sign-Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="bg-[#050508] border-t border-white/5 pt-20 pb-10 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src={logo} alt="MediConnect" className="h-10 w-auto brightness-0 invert opacity-70" />
              </Link>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                National Health Network of Sri Lanka. Powered by Azure. Protected by SLMC.
              </p>
              <div className="flex gap-3">
                <a href="tel:1990" className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-700/30 flex items-center justify-center text-red-400 hover:bg-red-900/60 transition-all">
                  <PhoneCall size={18} />
                </a>
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Services', links: ['AI Symptom Checker', 'Video Consultations', 'Emergency 1990', 'Lab Results', 'Prescriptions'] },
              { title: 'Specialists', links: ['Cardiologists', 'Neurologists', 'Pediatricians', 'Dermatologists', 'Ophthalmologists'] },
              { title: 'Platform', links: ['How It Works', 'Pricing', 'Security', 'SLMC Certification', 'Privacy Policy'] },
              { title: 'Emergency', links: ['Call 1990', 'Nearest Hospitals', 'Blood Bank', 'Mental Health: 1926', 'Poison Control'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-black text-white text-sm uppercase tracking-widest mb-5">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link to="/" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm font-medium">© 2026 MediConnect Lanka. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
              <span>Cloud: Azure Southeast Asia</span>
              <span>•</span>
              <span>Uptime: 99.9%</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
        }
        .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
        }
      `}</style>
    </div>
  );
}
