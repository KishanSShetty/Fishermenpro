import { Radar, ShieldAlert, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="pt-6 pb-2 px-6 sticky top-0 z-50">
      <header className="max-w-[1200px] mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] overflow-hidden border-2 border-white w-16 h-16 flex-shrink-0 bg-slate-100">
            <video 
              src="/logo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              Fisherman Safety <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-black uppercase tracking-widest border border-blue-100">Live</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <NavLink 
            to="/" 
            className={({isActive}) => `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.25)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Radar size={18} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/emergency-procedures" 
            className={({isActive}) => `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive ? 'bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.25)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <ShieldAlert size={18} />
            Emergency
          </NavLink>
          <NavLink 
            to="/methodology" 
            className={({isActive}) => `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.25)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <BookOpen size={18} />
            Methodology
          </NavLink>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
