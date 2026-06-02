import React, { useState } from 'react';
import { CalendarClock, Building2, User, FileText, Calendar, HelpCircle, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';
import { createScheduleRule } from '../services/apiEndpoints';

export default function PaymentScheduler({ onScheduleCreated, darkMode }) {
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientBankCode, setRecipientBankCode] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [scheduledDate, setScheduledDate] = useState(''); // New State Layer for Picker Input
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const NIGERIAN_BANKS = [
    { code: '011', name: 'First Bank of Nigeria' },
    { code: '058', name: 'GTBank' },
    { code: '033', name: 'United Bank for Africa (UBA)' },
    { code: '044', name: 'Access Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '999992', name: 'OPay Digital Services' }
  ];

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Formats calendar date input directly to your backend's exact ISO Timestamp expectation
    const isoDateTimeString = scheduledDate 
      ? new Date(scheduledDate).toISOString() 
      : new Date().toISOString();

    const schedulePayload = {
      amount: parseFloat(amount),
      recipient_name: recipientName,
      recipient_account: recipientAccount,
      recipient_bank_code: recipientBankCode,
      scheduled_date: isoDateTimeString, 
      frequency: frequency,
      description: description
    };

    try {
      await createScheduleRule(schedulePayload);
      setSuccess(true);
      
      // Clear all controls completely
      setAmount('');
      setRecipientName('');
      setRecipientAccount('');
      setRecipientBankCode('');
      setFrequency('once');
      setScheduledDate('');
      setDescription('');
      
      if (onScheduleCreated) onScheduleCreated();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync with backend schedule deployment framework.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputThemeClass = `w-full h-10 pl-9 pr-3 text-xs rounded-xl focus:outline-none transition-all duration-150 border font-medium ${
    darkMode 
      ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 text-white placeholder-zinc-600 colored-scheme-dark' 
      : 'bg-zinc-50 border-zinc-200/80 focus:border-zinc-900 focus:bg-white text-zinc-800 placeholder-zinc-400'
  }`;

  return (
    <div className={`w-full max-w-xl border rounded-2xl p-6 shadow-sm transition-all duration-300 ${
      darkMode ? 'bg-zinc-950 border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' : 'bg-white border-zinc-200/80'
    }`}>
      
      <div className="space-y-1 mb-6">
        <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
          <CalendarClock className={`w-4 h-4 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
          Set Up Automatic Payment
        </h2>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Create a new payment that will happen automatically on the date you choose.
        </p>
      </div>

      {success && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-semibold animate-in zoom-in-95">
          <span>Your automatic payment has been scheduled!</span>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-semibold animate-in zoom-in-95">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleScheduleSubmit} className="space-y-4">
        
        {/* Recipient Details Block */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">Who are you sending to?</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={inputThemeClass}
              placeholder="Full Name (e.g. John Doe)"
            />
          </div>
        </div>

        {/* Banking Route Configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">Bank Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <select
                required
                value={recipientBankCode}
                onChange={(e) => setRecipientBankCode(e.target.value)}
                className={`${inputThemeClass} appearance-none pr-8 cursor-pointer`}
              >
                <option value="" className={darkMode ? 'bg-zinc-950 text-zinc-500' : 'bg-white text-zinc-400'}>Select Bank</option>
                {NIGERIAN_BANKS.map(bank => (
                  <option key={bank.code} value={bank.code} className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}>
                    {bank.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">Account Number</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                required
                maxLength={10}
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g, ''))}
                className={`${inputThemeClass} font-mono tracking-wide`}
                placeholder="10-digit number"
              />
            </div>
          </div>
        </div>

        {/* Quantities & Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">How much? (₦)</label>
            <div className="relative">
              <span className="absolute left-3 top-[11px] text-xs font-bold text-zinc-500 font-mono">₦</span>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full h-10 pl-7 pr-3 text-xs rounded-xl focus:outline-none transition-all duration-150 border font-bold font-mono ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white placeholder-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200/80 focus:border-zinc-900 focus:bg-white text-zinc-900 placeholder-zinc-300'
                }`}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight flex items-center gap-1.5">
              How often?
            </label>
            <div className="relative">
              <CalendarClock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className={`${inputThemeClass} appearance-none pr-8 cursor-pointer`}
              >
                <option value="once" className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}>Just Once</option>
                <option value="daily" className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}>Every Day</option>
                <option value="weekly" className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}>Every Week</option>
                <option value="monthly" className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-800'}>Every Month</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- NEW ELEMENT ADDED: DYNAMIC TARGET TIMELINE CHRONOMETER --- */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className={`${inputThemeClass} font-mono tracking-wide cursor-pointer`}
            />
          </div>
        </div>

        {/* Narrative Context Description Link */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight">What is this for?</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputThemeClass}
              placeholder="e.g. Rent, Salary, Savings"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-3 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center tracking-wide shadow-sm"
        >
          {loading ? "Scheduling..." : "Confirm Schedule"}
        </button>
      </form>
    </div>
  );
}