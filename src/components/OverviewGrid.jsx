import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  Loader2
} from 'lucide-react';

export default function OverviewGrid({ user, stats, schedules = [], loading, error, onActionClick, darkMode }) {
  
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0);
  };

  if (loading && !stats) {
    return (
      <div className={`p-16 text-center flex flex-col items-center justify-center space-y-4 border rounded-2xl ${
        darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'
      }`}>
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-xs font-semibold tracking-wide uppercase font-mono">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {error && (
        <div className="p-4 flex items-center gap-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[11px] font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Something went wrong while updating your data.</span>
        </div>
      )}

      {/* --- SECTION 1: MAIN CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Balance */}
        <div className={`md:col-span-2 border rounded-2xl p-6 flex flex-col justify-between min-h-[180px] transition-all ${
          darkMode 
            ? 'bg-zinc-950 border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${darkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-zinc-400 tracking-tight">Available Balance</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              ● Connected
            </span>
          </div>

          <div className="my-3">
            <h2 className={`text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
              {formatNaira(stats?.balance || user?.balance)}
            </h2>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => onActionClick('fund')} 
              className="h-9 px-4 inline-flex items-center gap-2 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Add Money
            </button>
            <button 
              onClick={() => onActionClick('payout')} 
              className={`h-9 px-4 inline-flex items-center gap-2 border text-xs font-medium rounded-xl active:scale-[0.98] transition-all cursor-pointer ${
                darkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              Send Money
            </button>
          </div>
        </div>

        {/* Total Sent */}
        <div className={`border rounded-2xl p-6 flex flex-col justify-between min-h-[180px] transition-all ${
          darkMode ? 'bg-zinc-950 border-zinc-800/80 shadow-sm' : 'bg-white border-zinc-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 tracking-tight">Total Money Sent</span>
            <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">All time</span>
          </div>
          
          <div>
            <h3 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {formatNaira(stats?.totalOutgoing)}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-500 font-semibold italic">Up to date</span>
            </p>
          </div>

          <div className="text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            System is working perfectly
          </div>
        </div>
      </div>

      {/* --- SECTION 2: COUNTERS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Waiting Payments */}
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${
          darkMode ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-zinc-200/60 shadow-sm'
        }`}>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Waiting to be Paid</p>
            <p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{formatNaira(stats?.totalPending)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Success Counter */}
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${
          darkMode ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-zinc-200/60 shadow-sm'
        }`}>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Completed Payments</p>
            <p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {stats?.successfulPayouts || 0}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Failure Counter */}
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-all ${
          darkMode ? 'bg-zinc-950 border-zinc-800/60' : 'bg-white border-zinc-200/60 shadow-sm'
        }`}>
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Failed Payments</p>
            <p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {stats?.failedPayouts || 0}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* --- SECTION 3: PLANNED PAYMENTS --- */}
      <div className={`border rounded-2xl overflow-hidden transition-all ${
        darkMode ? 'bg-zinc-950 border-zinc-800/80 shadow-md' : 'bg-white border-zinc-200/80 shadow-sm'
      }`}>
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Upcoming Automatic Payments</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">These are payments you've scheduled to happen automatically.</p>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {(() => {
            const filteredSchedules = (schedules || []).filter(s => {
              const status = (s.status || '').toLowerCase();
              // Only show if status is NOT failed, success, or completed
              return status !== 'failed' && status !== 'success' && status !== 'successful' && status !== 'completed';
            });

            if (filteredSchedules.length === 0) {
              return (
                <div className="p-8 text-center text-zinc-400 text-[11px]">
                  {schedules.length === 0 ? "You don't have any automatic payments set up yet." : "No active or processing automations found."}
                </div>
              );
            }

            return filteredSchedules.map((schedule) => (
              <div key={schedule.id || schedule._id || Math.random()} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    darkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}>
                    PAYMENT #{ (schedule.id || schedule._id || '0').toString() }
                  </div>
                  <div>
                    <h4 className={`font-semibold tracking-tight ${darkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>{schedule.recipient_name || schedule.destination || 'Unnamed Recipient'}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Sent to: <span className={darkMode ? 'text-zinc-300' : 'text-zinc-600'}>{schedule.recipient_account || schedule.account || '302194****'}</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8">
                  <div className="text-left sm:text-right">
                    <p className={`font-bold tracking-tight text-sm ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{formatNaira(schedule.amount)}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 capitalize">Repeats {schedule.frequency || schedule.interval || 'once'}</p>
                  </div>
                  <div className="text-right hidden sm:block border-l border-zinc-100 dark:border-zinc-900 pl-6">
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Next Payment Date</p>
                    <p className="text-xs font-semibold text-amber-500 mt-0.5">
                      {schedule.scheduled_date ? new Date(schedule.scheduled_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (schedule.next_run || 'TBD')}
                    </p>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

    </div>
  );
}
