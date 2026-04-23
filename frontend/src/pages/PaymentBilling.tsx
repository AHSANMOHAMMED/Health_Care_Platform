import React, { useState } from 'react';
import { 
  CreditCard, ShieldCheck, CheckCircle, AlertCircle, 
  ArrowLeft, Loader2, Calendar, User, Clock
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, CardElement, useStripe, useElements 
} from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axios';

// Initialize Stripe with publishable key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ amount, appointmentId, onExcess }: { amount: number; appointmentId: string; onExcess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1. Create Payment Intent on backend
      const { data } = await api.post('/payment/create-intent', {
        amount,
        currency: 'lkr',
        appointmentId,
        paymentMethod: 'STRIPE'
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm payment on frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'MediConnect Patient',
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSucceeded(true);
          setProcessing(false);
          // 3. Inform parent/dashboard
          setTimeout(() => onExcess(), 2000);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error occurred');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': { color: '#64748b' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {succeeded ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-bold">Payment Successful!</p>
          <p className="text-xs text-slate-400">Updating your appointment status...</p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black rounded-2xl hover:from-indigo-500 hover:to-purple-600 transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
          {processing ? 'Processing...' : `Pay LKR ${amount.toLocaleString()}`}
        </button>
      )}
    </form>
  );
};

export default function PaymentBilling() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const appointmentId = queryParams.get('appointmentId') || 'unknown';
  const amount = parseInt(queryParams.get('amount') || '2500');
  const doctorName = queryParams.get('doctor') || 'General Practitioner';
  const date = queryParams.get('date') || 'TBD';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-300 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto border border-indigo-500/30 mb-4 shadow-2xl">
            <CreditCard size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Secure Checkout</h1>
          <p className="text-slate-500 mt-2">MediConnect Lanka Payment Gateway</p>
        </div>

        {/* Summary Card */}
        <div className="clinical-card p-6 bg-[#111B2E]/50 border-white/5 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consultation Fee</p>
              <h2 className="text-3xl font-black text-white mt-1">
                <span className="text-indigo-400 text-sm font-bold mr-1">LKR</span>
                {amount.toLocaleString()}
              </h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
              Secure
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Doctor</p>
                <p className="text-sm font-bold text-white">{doctorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                <Calendar size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Appointment Date</p>
                <p className="text-sm font-bold text-white">{date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                <Clock size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase">Ref ID</p>
                <p className="text-sm font-bold text-white truncate">#{appointmentId}</p>
              </div>
            </div>
          </div>

          {/* Stripe Elements */}
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={amount} 
              appointmentId={appointmentId} 
              onExcess={() => navigate('/dashboard')} 
            />
          </Elements>

          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              AES-256 Bank Grade Encryption
            </div>
            <p className="text-[9px] text-slate-700 text-center">
              By completing the payment, you agree to our Terms of Service and Patient Privacy Policy.
            </p>
          </div>
        </div>

        {/* Footer / Back */}
        <button 
          onClick={() => navigate(-1)}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors py-2"
        >
          <ArrowLeft size={16} /> Go back to dashboard
        </button>
      </div>
    </div>
  );
}
