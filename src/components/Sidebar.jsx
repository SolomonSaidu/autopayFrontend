import { 
  LayoutDashboard, 
  CalendarClock, 
  Receipt, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, onLogout, user, isOpen, onClose }) {
  // Navigation items mapping to our dashboard views
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'schedules', label: 'Schedules', icon: CalendarClock },
    { id: 'ledger', label: 'Transactions', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between p-4 border-r border-zinc-800 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full flex-shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-7">
          
          {/* App Logo / Brand Trigger */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-zinc-950 font-bold text-sm tracking-tight">
                F
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">AutoPay</h1>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Payments Manager</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-800 text-white font-semibold' 
                      : 'hover:bg-zinc-900/60 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile & Session Sign-Out Footer */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 uppercase">
              {user?.name ? user.name.substring(0, 2) : 'US'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-zinc-200 truncate">{user?.name || 'User Profile'}</p>
              <p className="text-[10px] text-zinc-500 truncate">Account Active</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400/80" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
