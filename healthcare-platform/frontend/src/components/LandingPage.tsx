import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Clock, 
  Shield, 
  Users, 
  Video,
  CheckCircle,
  Star,
  ArrowRight,
  Stethoscope,
  Ambulance,
  FileText,
  MessageCircle
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'Connect with doctors remotely through secure video consultations.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with your preferred doctors in just a few clicks.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, anywhere you need them.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Connect with certified healthcare professionals across specialties.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: FileText,
      title: 'Digital Records',
      description: 'Maintain your complete medical history in one secure place.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: Heart, count: 150 },
    { name: 'Neurology', icon: Stethoscope, count: 89 },
    { name: 'Pediatrics', icon: Users, count: 120 },
    { name: 'Emergency', icon: Ambulance, count: 45 },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'The telemedicine feature saved me so much time. I could consult with my doctor from the comfort of my home.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Doctor',
      content: 'This platform has revolutionized how I manage my practice. The scheduling system is incredibly efficient.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient',
      content: 'Finally, a healthcare platform that puts patients first. Easy to use and very reliable.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Patients' },
    { value: '500+', label: 'Expert Doctors' },
    { value: '50,000+', label: 'Consultations' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-blue-600 animate-pulse-slow" />
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-shadow">
              Your Health,
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of healthcare with our comprehensive telemedicine platform. 
              Connect with top doctors, manage appointments, and take control of your health journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="healthcare-button text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with compassionate care to deliver the best healthcare experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card group">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access expert care across all major medical specialties.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => {
              const Icon = specialty.icon;
              return (
                <div key={index} className="healthcare-card p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{specialty.name}</h3>
                  <p className="text-sm text-gray-600">{specialty.count} Doctors</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from patients and doctors who trust MedCare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="feature-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full healthcare-gradient flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="healthcare-card p-12 text-center">
            <Heart className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who are already experiencing better healthcare with MedCare.
            </p>
            <Link
              to="/register"
              className="healthcare-button text-lg px-8 py-4 inline-flex items-center space-x-2 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
