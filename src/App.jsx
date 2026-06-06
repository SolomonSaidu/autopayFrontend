import { useState, useEffect, useCallback } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Sidebar from './components/Sidebar';
import OverviewGrid from './components/OverviewGrid';
import PaymentScheduler from './components/PaymentScheduler';
import TransactionTable from './components/TransactionTable';
import SettingsView from './components/SettingsView';
import FundWalletModal from './components/FundWalletModal';
import { getProfile, getDashboardStats, fetchActiveSchedules } from './services/apiEndpoints'; 
import { Loader2, Menu } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    schedules: [],
    loading: false,
    error: null
  });

  const [appInitializing, setAppInitializing] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const refreshDashboardData = useCallback(async (showLoading = false) => {
    if (!isAuthenticated) return;
    
    if (showLoading) setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [statsRes, schedulesRes] = await Promise.allSettled([
        getDashboardStats(),
        fetchActiveSchedules()
      ]);

      const newStats = statsRes.status === 'fulfilled' && statsRes.value.success ? statsRes.value.data : dashboardData.stats;
      
      let newSchedules = dashboardData.schedules;
      if (schedulesRes.status === 'fulfilled') {
        const res = schedulesRes.value;
        newSchedules = res.result || res.data || res;
      }

      setDashboardData({
        stats: newStats,
        schedules: Array.isArray(newSchedules) ? newSchedules : [],
        loading: false,
        error: null
      });
    } catch (err) {
      console.error("Global data sync failed:", err);
      if (showLoading) setDashboardData(prev => ({ ...prev, loading: false, error: "Connection error" }));
    }
  }, [isAuthenticated, dashboardData.stats, dashboardData.schedules]);

  useEffect(() => {
    const checkActiveSession = async () => {
      const storedToken = localStorage.getItem('flex_auth_token');
      
      if (!storedToken) {
        setAppInitializing(false);
        return;
      }

      try {
        const response = await getProfile();
        const profileData = response.data || response;
        setUser(profileData); 
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('flex_auth_token');
      } finally {
        setAppInitializing(false);
      }
    };

    checkActiveSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboardData(true);
      const interval = setInterval(() => refreshDashboardData(false), 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshDashboardData]);

  const handleAuthSuccess = (authResponse) => {
    const userData = authResponse.data?.user || authResponse.user || authResponse.data || authResponse;
    const token = authResponse.data?.token || authResponse.token;
    
    if (token) localStorage.setItem('flex_auth_token', token);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('flex_auth_token');
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('overview');
  };

  const handleUpdateName = (newName) => {
    setUser(prev => ({ ...prev, name: newName }));
  };

  if (appInitializing) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mb-2" />
        <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">Securing your account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 font-sans antialiased text-zinc-50">
        {authView === 'login' ? (
          <LoginForm 
            onSuccess={handleAuthSuccess} 
            onSwitchToSignUp={() => setAuthView('signup')} 
          />
        ) : (
          <SignUpForm 
            onSuccess={() => setAuthView('login')} 
            onSwitchToLogin={() => setAuthView('login')} 
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full font-sans antialiased overflow-hidden ${darkMode ? 'dark bg-zinc-950 text-zinc-50' : 'bg-zinc-50 text-zinc-900'}`}>
      
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }} 
        onLogout={handleLogout}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`flex-1 overflow-y-auto transition-colors duration-200 ${darkMode ? 'bg-zinc-900/40' : 'bg-zinc-50/50'}`}>
        
        {/* Mobile Navbar Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-zinc-950 font-bold text-xs tracking-tight">
              F
            </div>
            <span className="text-sm font-bold text-white tracking-tight">AutoPay</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-150">
          
          {activeView === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{getGreeting()}</h1>
                  <p className="text-xs text-zinc-400">Hi {user?.name}, here is what's happening with your money today.</p>
                </div>
              </div>
              
              <OverviewGrid 
                user={user} 
                stats={dashboardData.stats}
                schedules={dashboardData.schedules}
                loading={dashboardData.loading}
                error={dashboardData.error}
                onActionClick={(action) => action === 'fund' ? setIsTopupModalOpen(true) : alert(`Action: ${action.toUpperCase()}`)} 
                darkMode={darkMode} 
              />
            </div>
          )}

          {activeView === 'schedules' && (
            <div className="space-y-6">
              <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Automatic Payments</h1>
              <PaymentScheduler 
                darkMode={darkMode} 
                onScheduleCreated={() => refreshDashboardData(false)}
              />
            </div>
          )}

          {activeView === 'ledger' && (
            <div className="space-y-6">
              <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Payment History</h1>
              <TransactionTable darkMode={darkMode} />
            </div>
          )}

          {activeView === 'settings' && (
            <SettingsView 
              user={user} 
              onUpdateName={handleUpdateName} 
              darkMode={darkMode} 
              onToggleDarkMode={() => setDarkMode(!darkMode)} 
            />
          )}

        </div>
      </main>

      <FundWalletModal 
        isOpen={isTopupModalOpen} 
        onClose={() => setIsTopupModalOpen(false)} 
        user={user} 
        darkMode={darkMode} 
      />
    </div>
  );
}
