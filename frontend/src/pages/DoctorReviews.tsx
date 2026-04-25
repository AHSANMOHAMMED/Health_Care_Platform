import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Star, ThumbsUp, MessageSquare, User, Calendar, Filter, Search } from 'lucide-react';
import { api } from '../api/axios';

interface Review {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  doctorReply?: string;
}

export default function DoctorReviews() {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/doctor-service/doctors/${doctorId}/reviews`);
      setReviews(response.data || []);
    } catch (error) {
      // Demo data
      setReviews([
        { id: 1, patientName: 'John D.', rating: 5, comment: 'Excellent doctor, very thorough and caring. Highly recommend!', date: '2026-04-15', helpful: 12, verified: true },
        { id: 2, patientName: 'Sarah M.', rating: 4, comment: 'Great experience, minimal wait time. Very professional.', date: '2026-04-10', helpful: 8, verified: true },
        { id: 3, patientName: 'Michael R.', rating: 5, comment: 'Best cardiologist I have visited. Explained everything clearly.', date: '2026-03-28', helpful: 15, verified: true, doctorReply: 'Thank you for your kind words, Michael!' },
        { id: 4, patientName: 'Emma L.', rating: 3, comment: 'Good consultation but had to wait a bit longer than expected.', date: '2026-03-20', helpful: 5, verified: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r =>
    filterRating === 'all' || r.rating === filterRating
  ).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return b.rating - a.rating;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-300/30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/doctor-search" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ChevronLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Doctor Reviews</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Rating Summary */}
          <div className="bg-white border border-slate-300/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-[#0284C7]xl font-bold text-slate-900">{averageRating}</div>
                <div className="flex items-center gap-1 justify-center mt-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={20}
                      className={s <= Math.round(Number(averageRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-1">{reviews.length} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 w-full space-y-2">
                {ratingCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-8">{stars} ★</span>
                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-10">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-white border border-slate-300/50 rounded-lg px-3 py-2 text-sm text-slate-900"
            >
              <option value="all">All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300/50 rounded-lg px-3 py-2 text-sm text-slate-900"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white border border-slate-300/50 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center">
                      <User className="text-[#0EA5E9]" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{review.patientName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="text-xs text-emerald-400">Verified Patient</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{review.date}</span>
                </div>

                <p className="text-slate-700 mb-3">{review.comment}</p>

                {review.doctorReply && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-3">
                    <p className="text-xs text-[#0EA5E9] font-medium mb-1">Doctor's Response</p>
                    <p className="text-sm text-slate-600">{review.doctorReply}</p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
                    <ThumbsUp size={14} />
                    Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
