import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Heart, 
  MessageSquare, 
  Video, 
  Phone, 
  Calendar, 
  Users, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Shield, 
  Zap, 
  Target, 
  Award, 
  Lightbulb, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  Wind,
  Headphones,
  Music,
  Coffee,
  TreePine,
  Waves,
  Sparkles,
  FileText
} from 'lucide-react';
import { api } from '../api/axios';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  credentials: string[];
  experience: number;
  rating: number;
  reviews: number;
  avatar?: string;
  bio: string;
  approaches: string[];
  languages: string[];
  consultationTypes: ('video' | 'phone' | 'in-person')[];
  availability: {
    nextAvailable: string;
    timeSlots: string[];
  };
  price: {
    individual: number;
    couples: number;
    family: number;
  };
  verified: boolean;
}

interface TherapySession {
  id: string;
  therapistId: string;
  therapistName: string;
  type: 'individual' | 'couples' | 'family' | 'group';
  modality: 'video' | 'phone' | 'in-person';
  date: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
}

interface MoodEntry {
  id: string;
  mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
  score: number;
  activities: string[];
  triggers?: string[];
  notes?: string;
  timestamp: string;
  factors: {
    sleep: number;
    stress: number;
    exercise: number;
    social: number;
  };
}

interface WellnessResource {
  id: string;
  type: 'article' | 'video' | 'podcast' | 'exercise' | 'meditation' | 'worksheet';
  title: string;
  description: string;
  category: string;
  duration?: number;
  url?: string;
  thumbnail?: string;
  tags: string[];
  rating: number;
  views: number;
  featured: boolean;
}

interface CrisisSupport {
  id: string;
  name: string;
  type: 'hotline' | 'chat' | 'text' | 'email';
  availability: string;
  number?: string;
  website?: string;
  languages: string[];
  specialization: string[];
}

export default function MentalHealthSupport() {
  const [activeTab, setActiveTab] = useState<'therapists' | 'sessions' | 'mood' | 'resources' | 'crisis'>('therapists');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('');
  const [filterModality, setFilterModality] = useState<string>('');

  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [resources, setResources] = useState<WellnessResource[]>([]);
  const [crisisSupport, setCrisisSupport] = useState<CrisisSupport[]>([]);

  const [expandedTherapist, setExpandedTherapist] = useState<string | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

  const [newMoodEntry, setNewMoodEntry] = useState({
    mood: 'okay' as const,
    score: 5,
    activities: [] as string[],
    triggers: [] as string[],
    notes: '',
    factors: {
      sleep: 5,
      stress: 5,
      exercise: 5,
      social: 5
    }
  });

  const [newSession, setNewSession] = useState({
    therapistId: '',
    type: 'individual' as const,
    modality: 'video' as const,
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    fetchMentalHealthData();
  }, []);

  const fetchMentalHealthData = async () => {
    try {
      setLoading(true);
      const [therapistsRes, sessionsRes, moodRes, resourcesRes, crisisRes] = await Promise.all([
        api.get('/mental-health/therapists'),
        api.get('/mental-health/sessions'),
        api.get('/mental-health/mood-entries'),
        api.get('/mental-health/resources'),
        api.get('/mental-health/crisis-support')
      ]);

      setTherapists(therapistsRes.data);
      setSessions(sessionsRes.data);
      setMoodEntries(moodRes.data);
      setResources(resourcesRes.data);
      setCrisisSupport(crisisRes.data);
    } catch (error) {
      console.error('Failed to fetch mental health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async () => {
    try {
      const response = await api.post('/mental-health/sessions', newSession);
      setSessions([response.data, ...sessions]);
      setShowBookingModal(false);
      setNewSession({
        therapistId: '',
        type: 'individual',
        modality: 'video',
        date: '',
        time: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to book session:', error);
    }
  };

  const addMoodEntry = async () => {
    try {
      const response = await api.post('/mental-health/mood-entries', newMoodEntry);
      setMoodEntries([response.data, ...moodEntries]);
      setShowMoodModal(false);
      setNewMoodEntry({
        mood: 'okay',
        score: 5,
        activities: [],
        triggers: [],
        notes: '',
        factors: {
          sleep: 5,
          stress: 5,
          exercise: 5,
          social: 5
        }
      });
    } catch (error) {
      console.error('Failed to add mood entry:', error);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excellent': return <Smile className="text-green-500" size={24} />;
      case 'good': return <Smile className="text-blue-500" size={24} />;
      case 'okay': return <Meh className="text-yellow-500" size={24} />;
      case 'bad': return <Frown className="text-orange-500" size={24} />;
      case 'terrible': return <Frown className="text-red-500" size={24} />;
      default: return <Meh className="text-slate-500" size={24} />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'okay': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bad': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'terrible': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen size={20} className="text-blue-500" />;
      case 'video': return <Video size={20} className="text-red-500" />;
      case 'podcast': return <Headphones size={20} className="text-purple-500" />;
      case 'exercise': return <Activity size={20} className="text-green-500" />;
      case 'meditation': return <Brain size={20} className="text-indigo-500" />;
      case 'worksheet': return <FileText size={20} className="text-orange-500" />;
      default: return <BookOpen size={20} className="text-slate-500" />;
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'anxiety': return <AlertCircle size={20} className="text-blue-500" />;
      case 'depression': return <CloudRain size={20} className="text-gray-500" />;
      case 'trauma': return <Shield size={20} className="text-red-500" />;
      case 'relationships': return <Heart size={20} className="text-pink-500" />;
      case 'addiction': return <Zap size={20} className="text-orange-500" />;
      case 'stress': return <Wind size={20} className="teal-500" />;
      default: return <Brain size={20} className="text-purple-500" />;
    }
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = !searchTerm || 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.approaches.some(approach => approach.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = !filterSpecialty || therapist.specialty === filterSpecialty;
    const matchesModality = !filterModality || therapist.consultationTypes.includes(filterModality as any);
    
    return matchesSearch && matchesSpecialty && matchesModality;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mental Health Support</h1>
              <p className="text-slate-600 mt-1">Professional therapy, wellness resources, and mood tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMoodModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <Smile size={16} />
              Log Mood
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Calendar size={16} />
              Book Session
            </button>
          </div>
        </div>
      </div>

      {/* Crisis Support Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-medium text-red-900">Crisis Support Available</h4>
            <p className="text-red-700 text-sm mt-1">
              If you're in immediate crisis, please reach out to one of our 24/7 support lines.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {crisisSupport.slice(0, 3).map((support) => (
                <button
                  key={support.id}
                  className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                >
                  {support.type === 'hotline' && <Phone size={14} />}
                  {support.type === 'chat' && <MessageSquare size={14} />}
                  {support.type === 'text' && <MessageSquare size={14} />}
                  {support.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'therapists', name: 'Therapists', icon: Users },
              { id: 'sessions', name: 'My Sessions', icon: Calendar },
              { id: 'mood', name: 'Mood Tracking', icon: Activity },
              { id: 'resources', name: 'Resources', icon: BookOpen },
              { id: 'crisis', name: 'Crisis Support', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
          {/* Therapists Tab */}
          {activeTab === 'therapists' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search therapists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Specialties</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Depression">Depression</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Relationships">Relationships</option>
                  <option value="Addiction">Addiction</option>
                  <option value="Stress">Stress Management</option>
                </select>
                <select
                  value={filterModality}
                  onChange={(e) => setFilterModality(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Modalities</option>
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTherapists.map((therapist) => (
                  <div key={therapist.id} className="border border-slate-200 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedTherapist(expandedTherapist === therapist.id ? null : therapist.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          {therapist.avatar ? (
                            <img src={therapist.avatar} alt={therapist.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Users size={24} className="text-slate-500" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-900">{therapist.name}</h4>
                                {therapist.verified && (
                                  <CheckCircle className="text-blue-500" size={16} />
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                                <span className="flex items-center gap-1">
                                  {getSpecialtyIcon(therapist.specialty)}
                                  {therapist.specialty}
                                </span>
                                <span>•</span>
                                <span>{therapist.experience} years</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="text-yellow-500 fill-current" size={14} />
                                  <span>{therapist.rating}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-slate-600 line-clamp-2">{therapist.bio}</p>
                            </div>
                            
                            <ChevronRight 
                              className={`text-slate-400 transition-transform ${
                                expandedTherapist === therapist.id ? 'rotate-90' : ''
                              }`} 
                              size={20} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedTherapist === therapist.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Credentials</h5>
                            <div className="flex flex-wrap gap-2">
                              {therapist.credentials.map((cred, index) => (
                                <span key={index} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                  {cred}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Approaches</h5>
                            <div className="flex flex-wrap gap-2">
                              {therapist.approaches.map((approach, index) => (
                                <span key={index} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                  {approach}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Languages</h5>
                            <div className="flex flex-wrap gap-2">
                              {therapist.languages.map((lang, index) => (
                                <span key={index} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Consultation Types</h5>
                            <div className="flex flex-wrap gap-2">
                              {therapist.consultationTypes.map((type) => (
                                <span key={type} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-sm">
                                  {type === 'video' && <Video size={14} />}
                                  {type === 'phone' && <Phone size={14} />}
                                  {type === 'in-person' && <Users size={14} />}
                                  <span className="capitalize">{type}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Pricing</h5>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="text-center p-2 bg-white rounded">
                                <p className="font-medium">Individual</p>
                                <p className="text-purple-600">${therapist.price.individual}</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded">
                                <p className="font-medium">Couples</p>
                                <p className="text-purple-600">${therapist.price.couples}</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded">
                                <p className="font-medium">Family</p>
                                <p className="text-purple-600">${therapist.price.family}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedTherapist(therapist);
                                setNewSession({...newSession, therapistId: therapist.id});
                                setShowBookingModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Calendar size={16} />
                              Book Session
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                              <MessageSquare size={16} />
                              Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Therapy Sessions</h3>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus size={16} />
                  Book Session
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          session.status === 'completed' ? 'bg-green-100' :
                          session.status === 'in_progress' ? 'bg-blue-100' :
                          session.status === 'scheduled' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {session.status === 'completed' && <CheckCircle className="text-green-600" size={20} />}
                          {session.status === 'in_progress' && <Play className="text-blue-600" size={20} />}
                          {session.status === 'scheduled' && <Clock className="text-yellow-600" size={20} />}
                          {session.status === 'cancelled' && <X className="text-red-600" size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{session.therapistName}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {session.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Type:</span> {session.type}
                            </div>
                            <div>
                              <span className="font-medium">Modality:</span> {session.modality}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(session.date).toLocaleString()}
                            </div>
                          </div>

                          {session.notes && (
                            <p className="text-sm text-slate-600 mt-2">{session.notes}</p>
                          )}

                          {session.rating && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={14}
                                    className={star <= session.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}
                                  />
                                ))}
                              </div>
                              {session.feedback && (
                                <span className="text-sm text-slate-600">"{session.feedback}"</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Tracking Tab */}
          {activeTab === 'mood' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Mood Tracking</h3>
                <button
                  onClick={() => setShowMoodModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus size={16} />
                  Log Mood
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Recent Mood Entries</h4>
                  <div className="space-y-3">
                    {moodEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        {getMoodIcon(entry.mood)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900 capitalize">{entry.mood}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getMoodColor(entry.mood)}`}>
                              {entry.score}/10
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{new Date(entry.timestamp).toLocaleString()}</p>
                          {entry.notes && (
                            <p className="text-sm text-slate-600 mt-1">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Mood Trends</h4>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <LineChart className="text-slate-400" size={32} />
                    <p className="text-slate-500 ml-2">Mood Chart</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Wellness Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {resource.thumbnail && (
                      <img src={resource.thumbnail} alt={resource.title} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        {getResourceIcon(resource.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{resource.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{resource.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-500 fill-current" size={14} />
                          <span className="text-sm text-slate-600">{resource.rating}</span>
                        </div>
                        {resource.duration && (
                          <span className="text-sm text-slate-600">{resource.duration} min</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                        {resource.type === 'video' && <Play size={14} />}
                        {resource.type === 'podcast' && <Play size={14} />}
                        {resource.type === 'article' && <BookOpen size={14} />}
                        {resource.type === 'exercise' && <Activity size={14} />}
                        {resource.type === 'meditation' && <Brain size={14} />}
                        {resource.type === 'worksheet' && <Download size={14} />}
                        Access Resource
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crisis Support Tab */}
          {activeTab === 'crisis' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">24/7 Crisis Support</h3>
                <p className="text-red-700">
                  If you're experiencing a mental health emergency, these resources are available 24/7.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crisisSupport.map((support) => (
                  <div key={support.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        {support.type === 'hotline' && <Phone className="text-red-600" size={20} />}
                        {support.type === 'chat' && <MessageSquare className="text-red-600" size={20} />}
                        {support.type === 'text' && <MessageSquare className="text-red-600" size={20} />}
                        {support.type === 'email' && <Mail className="text-red-600" size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{support.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{support.availability}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {support.specialization.map((spec, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {support.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {lang}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {support.number && (
                            <button className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              <Phone size={14} />
                              {support.number}
                            </button>
                          )}
                          {support.website && (
                            <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200">
                              <Globe size={14} />
                              Visit Website
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Entry Modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Log Your Mood</h2>
                <button
                  onClick={() => setShowMoodModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">How are you feeling?</label>
                <div className="grid grid-cols-5 gap-2">
                  {['terrible', 'bad', 'okay', 'good', 'excellent'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setNewMoodEntry({...newMoodEntry, mood: mood as any})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newMoodEntry.mood === mood
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-center">
                        {getMoodIcon(mood)}
                        <p className="text-xs mt-1 capitalize">{mood}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mood Score (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newMoodEntry.score}
                  onChange={(e) => setNewMoodEntry({...newMoodEntry, score: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-600">
                  <span>1</span>
                  <span className="font-medium text-purple-600">{newMoodEntry.score}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contributing Factors</label>
                <div className="space-y-2">
                  {Object.entries(newMoodEntry.factors).map(([factor, value]) => (
                    <div key={factor}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 capitalize">{factor}</span>
                        <span className="text-sm text-slate-600">{value}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={(e) => setNewMoodEntry({
                          ...newMoodEntry,
                          factors: {...newMoodEntry.factors, [factor]: parseInt(e.target.value)}
                        })}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newMoodEntry.notes}
                  onChange={(e) => setNewMoodEntry({...newMoodEntry, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowMoodModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addMoodEntry}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Book Therapy Session</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Therapist</label>
                <select
                  value={newSession.therapistId}
                  onChange={(e) => setNewSession({...newSession, therapistId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a therapist...</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      Dr. {therapist.name} - {therapist.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Type</label>
                <select
                  value={newSession.type}
                  onChange={(e) => setNewSession({...newSession, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="individual">Individual</option>
                  <option value="couples">Couples</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Modality</label>
                <select
                  value={newSession.modality}
                  onChange={(e) => setNewSession({...newSession, modality: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Any specific topics you'd like to discuss?"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={bookSession}
                  disabled={!newSession.therapistId || !newSession.date || !newSession.time}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
