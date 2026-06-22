import { ShieldAlert, Phone, Info, AlertTriangle, LifeBuoy } from 'lucide-react';

const EmergencyProcedures = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-[calc(100vh-120px)] relative z-10">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-red-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-14 text-center max-w-2xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-[2rem] inline-block mb-6 shadow-[0_8px_30px_rgba(239,68,68,0.3)] transform -rotate-3">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Emergency Procedures</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">Standard operating protocols and critical maritime helplines to follow immediately in the event of a man-overboard incident.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
        {/* Helpline Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgba(239,68,68,0.1)] transition-all duration-500">
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] text-red-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <Phone size={240} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-8">
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl">
                <Phone size={28} />
              </div>
              National Helplines
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-500 p-6 rounded-3xl border border-red-400 shadow-lg shadow-red-500/20 text-white transform hover:-translate-y-1 transition-transform">
                <span className="text-xs font-bold uppercase tracking-widest text-red-100 block mb-1">Indian Coast Guard (Toll Free)</span>
                <span className="text-5xl font-black font-sans tracking-tight">1554</span>
              </div>
              <div className="bg-white/60 p-6 rounded-3xl border border-slate-100 hover:bg-white transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">National Emergency Number</span>
                <span className="text-4xl font-black text-slate-800 font-sans tracking-tight">112</span>
              </div>
              <div className="bg-white/60 p-6 rounded-3xl border border-slate-100 hover:bg-white transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Rescue Coordination (MRCC Mumbai)</span>
                <span className="text-2xl font-bold text-slate-700 font-sans tracking-tight">+91 22 2431 6558</span>
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Action Steps */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-8">
            <div className="bg-orange-50 text-orange-500 p-2.5 rounded-xl">
              <AlertTriangle size={28} />
            </div>
            Immediate Actions
          </h2>
          
          <ul className="space-y-8">
            <li className="flex items-start gap-5 group">
              <div className="bg-blue-600 text-white font-black h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">1</div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">Verify Dashboard Alert</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Click the <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-sm">Navigate</span> button on the dashboard to acquire the precise live GPS coordinates of the overboard fisherman.</p>
              </div>
            </li>
            <li className="flex items-start gap-5 group">
              <div className="bg-blue-600 text-white font-black h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">2</div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">Contact Coast Guard</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Call <strong className="text-slate-800">1554</strong> immediately. Relay the exact Latitude and Longitude provided by the Dashboard, along with the Vessel ID.</p>
              </div>
            </li>
            <li className="flex items-start gap-5 group">
              <div className="bg-blue-600 text-white font-black h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">3</div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">Deploy Flotation</h3>
                <p className="text-slate-500 font-medium leading-relaxed">If on a nearby vessel, approach the coordinates carefully and throw a lifebuoy before attempting a physical water rescue.</p>
              </div>
            </li>
            <li className="flex items-start gap-5 group">
              <div className="bg-blue-600 text-white font-black h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">4</div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">Maintain Tracking</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Keep the dashboard open. The ESP32 transmits every 5 seconds during an emergency, providing live drift tracking.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[2rem] p-8 flex gap-5 items-start shadow-sm relative z-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 shrink-0">
          <Info size={28} />
        </div>
        <div>
          <h4 className="text-xl font-black text-slate-900 mb-2">System Limitation Notice</h4>
          <p className="text-slate-600 font-medium leading-relaxed max-w-4xl">The current iteration of the Fisherman Safety System relies on shore-range Wi-Fi or local mobile hotspots. Ensure the ESP32 is actively connected to the internet; otherwise, the alert will be queued until a connection is restored. A stale signal (over 60 seconds) will be indicated in orange on the dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyProcedures;
