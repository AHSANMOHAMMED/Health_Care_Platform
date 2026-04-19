import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  Heart, Calendar, Shield, Video, ArrowRight, Stethoscope,
  Activity, Zap, Globe, Award, CheckCircle2, Play,
  Smartphone, Sparkles, Search, Pill, CreditCard, Bell,
  Microscope, Users, FileText, PhoneCall, Star, ChevronRight, ChevronLeft, MapPin
} from 'lucide-react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const role = useAuthStore(state => state.role);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=2000&q=80",
      title: "Sri Lanka's Premier Digital Healthcare",
      subtitle: "Connecting island-wide top specialists directly to your home. Book instant consultations with Colombo's leading consultants.",
      accent: "text-blue-400"
    },
    {
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80",
      title: "Find Your Doctor in Seconds",
      subtitle: "From Nawaloka to Asiri Health, access the schedules of top medical professionals across the country without the wait.",
      accent: "text-emerald-400"
    },
    {
      image: "https://images.unsplash.com/photo-1582750433449-648ed127d09b?auto=format&fit=crop&w=2000&q=80",
      title: "Integrated 1990 Suwa Seriya",
      subtitle: "Built-in emergency APIs and native language AI triage ensuring you and your loved ones get help the moment it's needed.",
      accent: "text-amber-400"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Carousel timer
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Redirect logged-in users to their dashboards
  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden font-sans selection:bg-blue-200">

      {/* --- HERO CAROUSEL SECTION --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center text-center ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <div className="absolute inset-0 bg-black/60 z-10" /> {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent z-10 opacity-90" />
            <img
              src={slide.image}
              alt="Medical background"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
            />

            {/* Hero Content per slide to enable proper transitions */}
            <div className={`relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center max-w-5xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
               <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6 hover:bg-white/20 transition-all">
                 <span className="flex h-2 w-2 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 <span className="text-xs md:text-sm font-bold text-white tracking-widest uppercase">Live in Colombo & Kandy</span>
               </div>

               <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.15]">
                 {slide.title.split(' ').map((word, i, arr) => (
                    i === arr.length - 1 || i === arr.length - 2 ? <span key={i} className={slide.accent}>{word} </span> : <span key={i}>{word} </span>
                 ))}
               </h1>

               <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl leading-relaxed font-medium">
                 {slide.subtitle}
               </p>

               <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="h-14 px-8 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                    Join MediConnect <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/booking" className="h-14 px-8 rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1">
                     <Calendar className="w-5 h-5" /> Channel a Doctor
                  </Link>
               </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-6">
           <button onClick={prevSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"><ChevronLeft className="w-5 h-5 md:w-6 md:h-6"/></button>
           <div className="flex gap-2.5">
             {heroSlides.map((_, idx) => (
               <button
                 key={idx}
                 onClick={() => setCurrentSlide(idx)}
                 className={`transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
               />
             ))}
           </div>
           <button onClick={nextSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"><ChevronRight className="w-5 h-5 md:w-6 md:h-6"/></button>
        </div>

      </section>

      {/* --- TRUST BADGES (Sri Lankan Context) --- */}
      <section className="py-12 border-b border-gray-200 bg-white w-full relative z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Integrated with Sri Lanka's Finest</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-2xl font-black text-blue-900 flex items-center gap-2"><Heart className="w-8 h-8 text-blue-600"/> Asiri Health</div>
             <div className="text-2xl font-black text-rose-900 flex items-center gap-2"><Activity className="w-8 h-8 text-rose-600"/> Nawaloka</div>
             <div className="text-2xl font-black text-emerald-900 flex items-center gap-2"><Shield className="w-8 h-8 text-emerald-600"/> Lanka Hospitals</div>
             <div className="text-2xl font-black text-indigo-900 flex items-center gap-2"><Zap className="w-8 h-8 text-indigo-600"/> Hemas Hospitals</div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: SRI LANKAN FEATURES --- */}
      <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Designed for the Sri Lankan Patient.</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">Whether you're in Colombo or Jaffna, our platform brings world-class digital medicine directly to your fingertips.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[500px]">

          {/* Card 1: Large Telemedicine Feature */}
          <div className="md:col-span-8 rounded-3xl bg-white border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-100 transition-colors"></div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
                Island-wide Access
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">Channel Specialists Online</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-6">Connect with top consultants from leading Colombo hospitals via secure 4K video. Share your past medical reports instantly, get e-prescriptions sent directly to nearby pharmacies.</p>
              <Link to="/telemedicine" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">Start Virtual Visit <ArrowRight className="w-5 h-5"/></Link>
            </div>
            <div className="w-full md:w-64 h-56 rounded-2xl overflow-hidden shadow-2xl relative shrink-0 border border-gray-100 transform group-hover:rotate-2 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" alt="Doctor Consultation" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold text-sm">Dr. Ruwan Fernando</p>
                    <p className="text-xs text-blue-200">Asiri Surgical Hospital</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Card 2: Emergency Service */}
          <div className="md:col-span-4 rounded-3xl bg-[#b91c1c] p-8 overflow-hidden relative group text-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/50 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                <PhoneCall className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-3">1990 Suwa Seriya</h3>
              <p className="text-red-100 font-medium leading-relaxed mb-8">Integrated emergency dispatch natively linked to your medical profile for hyper-fast ambulance routing.</p>
              <button className="w-full py-4 bg-white text-red-700 font-black rounded-xl shadow-lg hover:bg-gray-50 flex justify-center items-center gap-2">
                Emergency Alert <Zap className="w-5 h-5"/>
              </button>
            </div>
          </div>

          {/* Card 3: AI Assistant */}
          <div className="md:col-span-5 rounded-3xl bg-gray-900 p-8 overflow-hidden relative group text-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl"></div>
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              <div>
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
                   <Sparkles className="w-6 h-6 text-indigo-300" />
                 </div>
                 <h3 className="text-2xl font-bold tracking-tight mb-3">Native AI Triage (සිංහල / தமிழ்)</h3>
                 <p className="text-gray-400 font-medium leading-relaxed mb-6">Describe your symptoms in your native language. Our advanced AI instantly analyzes your condition and recommends the right specialist to channel.</p>
              </div>
              <Link to="/ai-checker" className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors">Launch AI Triage <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Card 4: Digital Records */}
          <div className="md:col-span-7 rounded-3xl border border-emerald-100 bg-[#f0fdf4] p-8 overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6">
             <div className="flex-1 flex flex-col justify-center">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 shadow-sm">
                   <FileText className="w-6 h-6 text-emerald-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-emerald-900 tracking-tight mb-3">Cloud Medical Records</h3>
                 <p className="text-emerald-700 font-medium leading-relaxed">No more carrying physical files. Store your lab reports, prescriptions, and imaging seamlessly in our secure cloud, easily accessible by your doctors.</p>
             </div>
             <div className="w-full md:w-56 bg-white rounded-2xl p-4 shadow-lg border border-emerald-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Activity className="w-4 h-4 text-blue-600"/></div>
                   <div className="text-sm font-bold text-gray-800">CBC Blood Report</div>
                </div>
                <div className="space-y-2">
                   <div className="h-2 bg-gray-100 rounded w-full"></div>
                   <div className="h-2 bg-gray-100 rounded w-4/5"></div>
                   <div className="h-2 bg-emerald-100 rounded w-full mt-4"></div>
                   <div className="h-2 bg-emerald-100 rounded w-3/5"></div>
                </div>
                <div className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified by Lab</div>
             </div>
          </div>

        </div>
      </section>

      {/* --- TOP DOCTORS SECTION (Sri Lankan Context) --- */}
      <section className="py-24 bg-white relative z-10 border-y border-gray-100">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-2xl">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4">
                     Elite Network
                   </div>
                   <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">Consult Sri Lanka's <br/>Most Respected Doctors.</h2>
                   <p className="text-lg text-gray-600 font-medium">Skip the queues and traffic in Colombo. Video consult or book physical visits instantly with leading medical professionals.</p>
                </div>
                <Link to="/booking" className="h-14 px-8 bg-gray-900 text-white rounded-full font-bold hover:bg-blue-600 hover:shadow-lg transition-all flex items-center justify-center shrink-0 gap-2">View Directory <Search className="w-4 h-4"/></Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { name: 'Dr. Aruna Perera', specialty: 'Senior Cardiologist', location: 'Nawaloka Hospital', tag: 'Available Today', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80' },
                 { name: 'Dr. Shalini Fernando', specialty: 'Consultant Pediatrician', location: 'Asiri Surgical', tag: 'Telemedicine', img: 'https://images.unsplash.com/photo-1594824436951-7f12bc41553a?w=600&q=80' },
                 { name: 'Dr. Nuwan Silva', specialty: 'Neurologist', location: 'Lanka Hospitals', tag: 'High Rating', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80' }
               ].map((doc, i) => (
                 <div key={i} className="group cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-sm p-4 hover:shadow-2xl transition-all duration-300">
                    <div className="aspect-[4/4] w-full rounded-2xl bg-gray-100 mb-6 overflow-hidden relative">
                       <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {doc.tag}
                       </div>
                    </div>
                    <div className="px-2">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                      <p className="text-blue-600 font-bold mb-3">{doc.specialty}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                         <MapPin className="w-4 h-4 text-gray-400" /> {doc.location}
                      </div>
                      <button className="w-full py-3.5 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-colors border border-gray-200">Book Appointment</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- RICH CTA SECTION --- */}
      <section className="py-24 md:py-32 relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10">
         <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 text-white p-10 md:p-24 shadow-2xl group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2600')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
               <div className="max-w-2xl text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-[1.1]">
                   Transform the way you <br/><span className="text-amber-400">manage your health.</span>
                 </h2>
                 <p className="text-lg md:text-xl text-blue-100 font-medium mb-10 leading-relaxed">
                   Join thousands of Sri Lankans taking control of their wellness. Fast, secure, and built locally for our people.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link to="/register" className="h-16 px-10 bg-amber-400 text-gray-900 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all text-lg flex items-center justify-center gap-2 hover:bg-amber-300">
                      Create Free Account
                    </Link>
                    <Link to="/booking" className="h-16 px-10 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all text-lg flex items-center justify-center gap-2">
                      Channel a Doctor <ChevronRight className="w-5 h-5"/>
                    </Link>
                 </div>
               </div>

               <div className="hidden lg:flex flex-col items-center gap-6">
                  <div className="w-56 h-56 rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-center relative shadow-[0_0_80px_rgba(59,130,246,0.3)]">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" className="w-48 h-48 rounded-full object-cover shadow-inner" alt="Happy Patient" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-900">
                       <CheckCircle2 className="w-8 h-8 text-white"/>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-gray-200 bg-white text-center">
         <p className="text-gray-500 text-sm font-medium">© 2026 MediConnect Sri Lanka. Built with care for our nation.</p>
      </footer>
    </div>
  );
}
