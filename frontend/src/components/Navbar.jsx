import { Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/format';

const Navbar = ({ onMenu }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search size={17} className="text-slate-400" />
            <span className="text-sm text-slate-500">Search tasks from Tasks page</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            {initials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
