import { Cpu, Server, LayoutDashboard, Radio } from 'lucide-react';

const Methodology = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-[calc(100vh-120px)] relative z-10">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-14 text-center max-w-3xl mx-auto relative z-10">
        <div className="rounded-[2rem] inline-block mb-6 shadow-[0_8px_30px_rgba(79,70,229,0.3)] transform rotate-3 overflow-hidden border-2 border-white w-[88px] h-[88px] bg-slate-100 flex-shrink-0">
          <video 
            src="/logo.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-[1.1]"
          />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">System Methodology</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">A complete technical breakdown of the Fisherman Safety System's end-to-end architecture and hardware implementation.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-10 relative z-10">
        <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
            <Radio size={28} />
          </div>
          End-to-End Architecture
        </h2>
        
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-[4.5rem] left-0 w-full h-1.5 bg-slate-100 rounded-full hidden md:block z-0">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 opacity-20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-500">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
                <Cpu size={36} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-3">1. Edge Device</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-6 bg-blue-50 py-1.5 rounded-lg">ESP32 + GPS + Sensor</p>
              <ul className="text-left text-sm font-medium text-slate-500 space-y-3">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Reads GPS coordinates continuously</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Monitors float sensor state</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Broadcasts JSON via Wi-Fi</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-500">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(79,70,229,0.3)]">
                <Server size={36} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-3">2. Backend Server</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-6 bg-indigo-50 py-1.5 rounded-lg">FastAPI + SQLite</p>
              <ul className="text-left text-sm font-medium text-slate-500 space-y-3">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Ingests payloads via REST API</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Updates local SQLite database</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Exposes high-speed endpoints</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-500">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(6,182,212,0.3)]">
                <LayoutDashboard size={36} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-3">3. React Dashboard</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-cyan-500 mb-6 bg-cyan-50 py-1.5 rounded-lg">Vite + React-Leaflet</p>
              <ul className="text-left text-sm font-medium text-slate-500 space-y-3">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Polls backend every 5 seconds</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Renders boats on interactive map</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>Triggers visual emergency alarms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h2 className="text-2xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-100">Key Features</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
              <div>
                <strong className="text-slate-900 font-bold text-lg block mb-1">Adaptive Polling Logic</strong>
                <span className="text-slate-500 font-medium leading-relaxed">To preserve battery, the ESP32 transmits data every 30 seconds when safe. Upon water detection, it accelerates transmission to every 5 seconds.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
              <div>
                <strong className="text-slate-900 font-bold text-lg block mb-1">No Third-Party IoT Cloud</strong>
                <span className="text-slate-500 font-medium leading-relaxed">By utilizing a local FastAPI server, the system entirely avoids the expensive subscription costs associated with commercial IoT platforms.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              <div>
                <strong className="text-slate-900 font-bold text-lg block mb-1">Stale Signal Detection</strong>
                <span className="text-slate-500 font-medium leading-relaxed">The dashboard automatically flags any vessel that hasn't transmitted data in over 60 seconds as a potential connection loss.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl relative overflow-hidden">
          {/* Dark card background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" />
          
          <h2 className="text-2xl font-black text-white mb-8 pb-4 border-b border-slate-800 relative z-10">Hardware Component Costing</h2>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <span className="font-bold text-slate-200">ESP32 Dev Board</span>
              <span className="font-mono text-slate-400 font-medium tracking-wide">₹400 - ₹600</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <span className="font-bold text-slate-200">NEO-6M GPS Module</span>
              <span className="font-mono text-slate-400 font-medium tracking-wide">₹350 - ₹500</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <span className="font-bold text-slate-200">Float Sensor / Switch</span>
              <span className="font-mono text-slate-400 font-medium tracking-wide">₹100 - ₹200</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <span className="font-bold text-slate-200">Power Bank (5000mAh)</span>
              <span className="font-mono text-slate-400 font-medium tracking-wide">₹500 - ₹800</span>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
              <span className="font-black text-white text-xl">Total Estimated Cost</span>
              <div className="bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-xl">
                <span className="font-black text-blue-400 text-2xl font-mono tracking-wider">&lt; ₹2000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
