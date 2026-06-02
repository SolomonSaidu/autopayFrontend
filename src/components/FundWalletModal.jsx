import React, { useState } from 'react';
import { X, Wallet, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { initializeTopup } from '../services/apiEndpoints';

export default function FundWalletModal({ isOpen, onClose, user, darkMode }) {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email: email,
        amount: parseFloat(amount)
      };

      const response = await initializeTopup(payload);
      
      if (response.success && response.data?.authorization_url) {
        // Redirect to payment provider checkout (Paystack)
        window.location.href = response.data.authorization_url;
      } else if (response.success) {
        // If no URL, maybe it was a direct success or mock
        alert('Topup initialized successfully');
        onClose();
      } else {
        setError(response.message || 'Failed to initialize topup.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error with payment gateway.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-md border rounded-3xl p-8 shadow-2xl transition-all duration-300 animate-in zoom-in-95 ${
        darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-50' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute right-6 top-6 p-2 rounded-full transition-colors ${
            darkMode ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
            darkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-500'
          }`}>
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Fund Ledger Wallet</h2>
          <p className="text-xs text-zinc-400 max-w-[240px]">
            Initialize a secure top-up sequence to increase your available spending power.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-semibold font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Recipient</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 pl-10 pr-4 text-sm rounded-2xl focus:outline-none transition-all duration-150 border font-medium ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200/80 focus:border-zinc-900 focus:bg-white text-zinc-900 placeholder-zinc-300'
                }`}
                placeholder="dave@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Amount Value (₦)</label>
            <div className="relative">
              <span className="absolute left-4 top-[14px] text-sm font-bold text-zinc-500 font-mono">₦</span>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full h-12 pl-9 pr-4 text-sm rounded-2xl focus:outline-none transition-all duration-150 border font-bold font-mono ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200/80 focus:border-zinc-900 focus:bg-white text-zinc-900 placeholder-zinc-300'
                }`}
                placeholder="1,500.00"
              />
            </div>
            <p className="text-[10px] text-zinc-500 ml-1">Minimum top-up value is ₦100.00</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-sm font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 tracking-wide shadow-lg cursor-pointer mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initialize Payment Flow
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 text-zinc-400 grayscale opacity-40">
          <div className="text-[10px] font-bold uppercase tracking-widest">Secured by Engine Matrix</div>
        </div>
      </div>
    </div>
  );
}
