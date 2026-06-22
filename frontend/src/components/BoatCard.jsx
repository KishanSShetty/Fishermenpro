import { Navigation, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const BoatCard = ({ boat }) => {
  const [timeAgo, setTimeAgo] = useState('');
  const isEmergency = boat.status === 1;

  useEffect(() => {
    const updateTime = () => {
      if (!boat.updated_at) return;
      
      const updatedTime = new Date(boat.updated_at);
      const now = new Date();
      const diffSeconds = Math.floor((now - updatedTime) / 1000);
      
      if (diffSeconds < 60) setTimeAgo(`${diffSeconds}s ago`);
      else if (diffSeconds < 3600) setTimeAgo(`${Math.floor(diffSeconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(diffSeconds / 3600)}h ago`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [boat.updated_at]);

  // Check if signal is stale (> 60s)
  const isStale = boat.updated_at && (new Date() - new Date(boat.updated_at)) > 60000;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-1 group ${
      isEmergency 
        ? 'bg-white border border-red-200 shadow-[0_8px_30px_rgba(220,38,38,0.15)]' 
        : 'bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
    }`}>
      {/* Background decoration */}
      <div className={`absolute -right-6 -top-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 ${isEmergency ? 'text-red-600' : 'text-blue-600'}`}>
        <Navigation size={140} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Vessel ID</span>
            <h3 className={`text-3xl font-black font-sans tracking-tight flex items-center gap-1 ${isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
              <span className="text-slate-300 font-normal">#</span>{boat.boat_no}
            </h3>
          </div>
          
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
            isEmergency 
              ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' 
              : 'bg-green-50 text-green-600 border-green-200 shadow-sm'
          }`}>
            {isEmergency ? <AlertTriangle size={14} className={isEmergency ? 'animate-pulse' : ''} /> : <CheckCircle size={14} />}
            <span className="tracking-wide">{isEmergency ? 'EMERGENCY' : 'SAFE'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className={`rounded-xl p-3 border ${isEmergency ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isEmergency ? 'text-red-400' : 'text-slate-500'}`}>Latitude</span>
            <span className={`font-mono font-medium text-sm ${isEmergency ? 'text-red-900' : 'text-slate-700'}`}>{boat.latitude.toFixed(6)}°</span>
          </div>
          <div className={`rounded-xl p-3 border ${isEmergency ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isEmergency ? 'text-red-400' : 'text-slate-500'}`}>Longitude</span>
            <span className={`font-mono font-medium text-sm ${isEmergency ? 'text-red-900' : 'text-slate-700'}`}>{boat.longitude.toFixed(6)}°</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${
            isStale ? 'text-orange-500' : isEmergency ? 'text-red-500' : 'text-slate-400'
          }`}>
            <Clock size={12} />
            {isStale ? 'Signal Lost' : `Updated ${timeAgo}`}
          </div>
          
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${boat.latitude},${boat.longitude}`}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all duration-300 text-white ${
              isEmergency
                ? 'bg-red-600 hover:bg-red-500 shadow-[0_4px_10px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.4)]'
                : 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_10px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_15px_rgba(37,99,235,0.3)]'
            }`}
          >
            <Navigation size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Navigate
          </a>
        </div>
      </div>
    </div>
  );
};

export default BoatCard;
