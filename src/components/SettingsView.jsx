import React, { useState } from 'react';
import { User, Moon, Sun, ShieldCheck, CheckCircle2, Bell, Lock, Trash2, Mail } from 'lucide-react';

export default function SettingsView({ user, onUpdateName, darkMode, onToggleDarkMode }) {
  const [profileName, setProfileName] = useState(user?.name || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateName(profileName);
    setSuccessMsg('Your profile has been updated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Settings</h1>
        <p className="text-xs text-zinc-400">Manage your profile, security, and how the app looks.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-semibold max-w-xl">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        
        {/* Profile Section */}
        <form onSubmit={handleProfileSubmit} className={`p-6 border rounded-2xl space-y-4 shadow-sm ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-2 border-b pb-3 border-zinc-100 dark:border-zinc-800">
            <User className="w-4 h-4 text-zinc-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Your Profile</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Display Name</label>
            <input 
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={`w-full h-10 px-3 text-xs rounded-xl focus:outline-none transition-all border ${
                darkMode 
                  ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-white' 
                  : 'bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-800'
              }`}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Email Address</label>
            <input 
              type="email"
              disabled
              value={user?.email || 'user@example.com'}
              className={`w-full h-10 px-3 text-xs rounded-xl border cursor-not-allowed opacity-60 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
              }`}
            />
            <p className="text-[10px] text-zinc-500 italic">Email cannot be changed for security reasons.</p>
          </div>

          <button 
            type="submit"
            className="h-10 px-6 inline-flex items-center justify-center bg-zinc-50 text-zinc-950 text-xs font-bold rounded-xl hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            Update Profile
          </button>
        </form>

        {/* Appearance Section */}
        <div className={`p-6 border rounded-2xl flex flex-col justify-between shadow-sm ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-zinc-100 dark:border-zinc-800">
              {darkMode ? <Moon className="w-4 h-4 text-zinc-500" /> : <Sun className="w-4 h-4 text-zinc-500" />}
              <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Appearance</h3>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Choose between Dark or Light mode for your dashboard. Dark mode is easier on the eyes.
            </p>
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`w-full h-10 mt-6 inline-flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition-all border cursor-pointer active:scale-[0.98] ${
              darkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800' 
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                Switch to Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Notifications Section */}
        <div className={`p-6 border rounded-2xl space-y-4 shadow-sm ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-2 border-b pb-3 border-zinc-100 dark:border-zinc-800">
            <Bell className="w-4 h-4 text-zinc-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Notifications</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Payment Alerts</p>
              <p className="text-[11px] text-zinc-400">Receive an email after every automated payment.</p>
            </div>
            <button 
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${
                emailNotifications ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${
                emailNotifications ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Weekly Reports</p>
              <p className="text-[11px] text-zinc-400">Get a summary of your activity every Monday.</p>
            </div>
            <button className="w-10 h-5 bg-zinc-700 rounded-full relative cursor-not-allowed opacity-50">
              <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className={`p-6 border rounded-2xl space-y-4 shadow-sm ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-2 border-b pb-3 border-zinc-100 dark:border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Security</h3>
          </div>

          <div className="space-y-3">
            <button className={`w-full h-10 px-4 inline-flex items-center gap-3 border rounded-xl text-xs font-semibold transition-all hover:bg-zinc-900/50 ${
              darkMode ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-700'
            }`}>
              <Lock className="w-3.5 h-3.5" />
              Change Password
            </button>
            <button className={`w-full h-10 px-4 inline-flex items-center gap-3 border rounded-xl text-xs font-semibold transition-all hover:bg-zinc-900/50 ${
              darkMode ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-700'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Enable Two-Factor Auth
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`p-6 border border-rose-500/20 rounded-2xl space-y-4 shadow-sm md:col-span-1 lg:col-span-2 ${darkMode ? 'bg-rose-500/5' : 'bg-rose-50'}`}>
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider">Danger Zone</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-rose-500/80 leading-relaxed">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            <button className="h-10 px-6 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
