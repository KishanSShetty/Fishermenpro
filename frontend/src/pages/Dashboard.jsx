import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, RefreshCw, Anchor } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import BoatCard from '../components/BoatCard';

const API_URL = 'http://192.168.2.107:8000';

const Dashboard = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchBoats = async () => {
    try {
      const response = await axios.get(`${API_URL}/boats`);
      setBoats(response.data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching boats:", err);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoats();
    const interval = setInterval(fetchBoats, 5000);
    return () => clearInterval(interval);
  }, []);

  const hasEmergency = boats.some(b => b.status === 1);
  const activeBoats = boats.length;

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-120px)] flex flex-col">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className={`absolute bottom-10 right-10 w-96 h-96 ${hasEmergency ? 'bg-red-400/30' : 'bg-cyan-400/20'} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`} />

      {/* Emergency Banner */}
      {hasEmergency && (
        <div className="max-w-[1600px] mx-auto w-full px-6 z-10">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-3.5 text-center font-bold text-lg uppercase tracking-widest animate-pulse shadow-[0_8px_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 rounded-2xl mb-4 border border-red-400">
            <Activity size={24} />
            Emergency Detected - Immediate Rescue Required
            <Activity size={24} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6 flex-1 w-full flex flex-col xl:flex-row gap-6 z-10 relative">
        
        {/* Sidebar / Boat List */}
        <div className="w-full xl:w-[420px] flex flex-col h-[600px] xl:h-full bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
          
          <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Anchor size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Active Fleet</h2>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-full text-sm shadow-sm">
                {activeBoats}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Monitored</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar relative">
            {/* Inner fade effect for scrolling */}
            <div className="sticky top-0 h-4 bg-gradient-to-b from-white/80 to-transparent z-10 -mt-4 pointer-events-none" />

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl mb-4 shadow-sm">
                <p className="font-bold flex items-center gap-2"><Activity size={18}/> Connection Error</p>
                <p className="text-sm mt-1 opacity-80 font-medium">Unable to reach the FastAPI backend server.</p>
              </div>
            )}

            {loading && boats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <RefreshCw size={32} className="animate-spin mb-4 text-blue-300" />
                <p className="font-bold text-slate-500">Establishing connection...</p>
              </div>
            ) : boats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 m-2 bg-white/50">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Shield size={32} className="text-slate-300" />
                </div>
                <p className="font-black text-xl text-slate-700">No signals detected</p>
                <p className="text-sm mt-2 text-center font-medium text-slate-500">Waiting for ESP32 telemetry data via backend...</p>
              </div>
            ) : (
              boats.map(boat => <BoatCard key={boat.boat_no} boat={boat} />)
            )}
            
            <div className="sticky bottom-0 h-4 bg-gradient-to-t from-white/80 to-transparent z-10 -mb-4 pointer-events-none" />
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full xl:flex-1 h-[600px] xl:h-auto bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-2 z-20 pointer-events-none rounded-[1.5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" />
          <MapComponent boats={boats} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
