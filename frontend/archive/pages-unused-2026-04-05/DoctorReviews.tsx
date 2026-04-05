import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  Flag, 
  Heart, 
  Activity, 
  Brain, 
  Eye, 
  Ear, 
  Bone, 
  Baby, 
  Award,
  TrendingUp,
  BarChart3,
  Users
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  title: string;
  content: string;
  categories: string[];
  appointmentDate: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  response?: {
    content: string;
    date: string;
    doctorName: string;
  };
  status: 'published' | 'pending' | 'hidden';
  flags: number;
  createdAt: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    rating: number;
    reviews: number;
  }>;
}

export default function DoctorReviews() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'my-reviews' | 'analytics'>('reviews');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [filterSpecialty, setFilterSpecialty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);

  const [newReview, setNewReview] = useState({
    doctorId: '',
    rating: 5,
    title: '',
    content: '',
    categories: [] as string[]
  });

  const categories = [
    'Bedside Manner',
    'Communication',
    'Diagnosis Accuracy',
    'Treatment Effectiveness',
    'Wait Time',
    'Office Environment',
    'Staff Professionalism',
    'Follow-up Care',
    'Value for Money',
    'Technology Usage'
  ];

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, myReviewsRes, doctorsRes, statsRes] = await Promise.all([
        api.get('/reviews'),
        api.get('/reviews/my-reviews'),
        api.get('/reviews/doctors'),
        api.get('/reviews/stats')
      ]);

      setReviews(reviewsRes.data);
      setMyReviews(myReviewsRes.data);
      setDoctors(doctorsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch reviews data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      const response = await api.post('/reviews', newReview);
      setMyReviews([response.data, ...myReviews]);
      setShowWriteReview(false);
      setNewReview({
        doctorId: '',
        rating: 5,
        title: '',
        content: '',
        categories: []
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<Review>) => {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, updates);
      setMyReviews(prev => prev.map(r => r.id === reviewId ? response.data : r));
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setMyReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const markHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`, { helpful });
      setReviews(prev => prev.map(r => 
        r.id === reviewId 
          ? { 
              ...r, 
              helpful: helpful ? r.helpful + 1 : r.helpful,
              notHelpful: !helpful ? r.notHelpful + 1 : r.notHelpful
            }
          : r
      ));
    } catch (error) {
      console.error('Failed to mark review helpful:', error);
    }
  };

  const flagReview = async (reviewId: string) => {
    try {
      await api.post(`/reviews/${reviewId}/flag`);
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, flags: r.flags + 1 } : r
      ));
    } catch (error) {
      console.error('Failed to flag review:', error);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 0 || review.rating === filterRating;
    
    const doctor = doctors.find(d => d.id === review.doctorId);
    const matchesSpecialty = !filterSpecialty || doctor?.specialty === filterSpecialty;
    
    return matchesSearch && matchesRating && matchesSpecialty;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Doctor Reviews & Ratings</h1>
              <p className="text-slate-600 mt-1">Share your experience and help others make informed decisions</p>
            </div>
          </div>
          <button
            onClick={() => setShowWriteReview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Write Review
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</p>
                  {renderStars(Math.round(stats.averageRating))}
                </div>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Verified Reviews</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reviews.filter(r => r.verified).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Response Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round((reviews.filter(r => r.response).length / reviews.length) * 100)}%
                </p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'reviews', name: 'All Reviews', icon: MessageSquare },
              { id: 'my-reviews', name: 'My Reviews', icon: User },
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
          {/* All Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(parseInt(e.target.value))}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {sortedReviews.map((review) => {
                  const doctor = doctors.find(d => d.id === review.doctorId);
                  return (
                    <div key={review.id} className="border border-slate-200 rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-slate-50"
                        onClick={() => toggleReviewExpansion(review.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                            {review.patientAvatar ? (
                              <img src={review.patientAvatar} alt={review.patientName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User size={24} className="text-slate-500" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-slate-900">{review.patientName}</h4>
                                  {review.verified && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      <CheckCircle size={10} />
                                      Verified
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4 mb-2">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-slate-600">
                                    Reviewed Dr. {doctor?.name} • {doctor?.specialty}
                                  </span>
                                </div>
                                
                                <h5 className="font-medium text-slate-900 mb-1">{review.title}</h5>
                                <p className="text-slate-600 line-clamp-2">{review.content}</p>
                                
                                <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                                  <span>{new Date(review.appointmentDate).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>

                                {review.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {review.categories.map((category, index) => (
                                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                        {category}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <ChevronRight 
                                className={`text-slate-400 transition-transform ${
                                  expandedReview === review.id ? 'rotate-90' : ''
                                }`} 
                                size={20} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedReview === review.id && (
                        <div className="border-t border-slate-200 p-4 bg-slate-50">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-slate-900 mb-2">Full Review</h5>
                              <p className="text-slate-600">{review.content}</p>
                            </div>

                            {review.response && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                                    <Stethoscope size={16} className="text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-blue-900">
                                      Response from Dr. {review.response.doctorName}
                                    </p>
                                    <p className="text-blue-700 text-sm mt-1">{review.response.content}</p>
                                    <p className="text-blue-600 text-xs mt-2">
                                      {new Date(review.response.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => markHelpful(review.id, true)}
                                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600"
                                >
                                  <ThumbsUp size={16} />
                                  Helpful ({review.helpful})
                                </button>
                                <button
                                  onClick={() => markHelpful(review.id, false)}
                                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600"
                                >
                                  <ThumbsDown size={16} />
                                  Not Helpful ({review.notHelpful})
                                </button>
                                <button
                                  onClick={() => flagReview(review.id)}
                                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600"
                                >
                                  <Flag size={16} />
                                  Report
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* My Reviews Tab */}
          {activeTab === 'my-reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">My Reviews</h3>
                <button
                  onClick={() => setShowWriteReview(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Write New Review
                </button>
              </div>

              {myReviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto text-slate-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-600 mb-4">Share your experience with healthcare providers</p>
                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Write Your First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((review) => {
                    const doctor = doctors.find(d => d.id === review.doctorId);
                    return (
                      <div key={review.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900">
                                Review for Dr. {doctor?.name}
                              </h4>
                              {renderStars(review.rating)}
                            </div>
                            
                            <h5 className="font-medium text-slate-900 mb-1">{review.title}</h5>
                            <p className="text-slate-600 mb-3">{review.content}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>{new Date(review.appointmentDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{review.helpful} found helpful</span>
                            </div>

                            {review.response && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="font-medium text-blue-900">Doctor's Response</p>
                                <p className="text-blue-700 text-sm mt-1">{review.response.content}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setNewReview({
                                  doctorId: review.doctorId,
                                  rating: review.rating,
                                  title: review.title,
                                  content: review.content,
                                  categories: review.categories
                                });
                                setShowWriteReview(true);
                              }}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && stats && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Review Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Rating Distribution</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star size={14} className="text-yellow-500 fill-current" />
                        </div>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ 
                              width: `${stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">
                          {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Category Performance</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.categoryAverages).map(([category, average]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{category}</span>
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(average), 14)}
                          <span className="text-sm font-medium">{average.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Monthly Trend</h4>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-slate-400" size={32} />
                  <p className="text-slate-500 ml-2">Trend Chart</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Write a Review</h2>
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Doctor</label>
                <select
                  value={newReview.doctorId}
                  onChange={(e) => setNewReview({...newReview, doctorId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="transition-colors"
                    >
                      <Star
                        size={24}
                        className={star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Review Title</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Review Details</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience with this healthcare provider..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newReview.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewReview({
                              ...newReview,
                              categories: [...newReview.categories, category]
                            });
                          } else {
                            setNewReview({
                              ...newReview,
                              categories: newReview.categories.filter(c => c !== category)
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={!newReview.doctorId || !newReview.title || !newReview.content}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
