import AdminSideBar from "../../components/AdminSideBar";
import Refresh from "../../assets/icons/refresh.svg";
import ArrrowUpward from "../../assets/icons/arrow_upward.svg";
import SensorsBlue from "../../assets/icons/sensors_blue.svg";

export default function AdminDashboard({ currentUser, handleLogout }) {
  return (
    <div className="min-h-screen bg-(--surface) flex flex-col md:flex-row">
      <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />
      
      <main className="flex-1 bg-(--surface) p-4 md:p-8 overflow-y-auto scrollbar-hide">
        {/* HEADER DE SECCIÓN - Blueprint Style */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-(--on-surface)">System Health</h2>
            </div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-(--secondary) font-bold opacity-80">
              Real-time Telemetry Stream // Node: Madrid_ES_01
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-(--surface-high) hover:bg-(--surface-highest) text-(--on-surface) px-6 py-2.5 font-bold text-[10px] flex items-center justify-center gap-2 rounded-sm transition-all border border-white/10 uppercase tracking-widest cursor-pointer group">
              <img src={Refresh} className="group-hover:rotate-180 transition-transform duration-500"/> Recalibrate
            </button>
          </div>
        </div>

        {/* DASHBOARD GRID - Bento Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* CARD: ACTIVE SESSIONS (Glow effect from image) */}
          <div className="col-span-12 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border-l-4 border-(--secondary) shadow-[inset_20px_0_30px_-20px_rgba(93,230,255,0.1)] relative group">
            <div className="flex justify-between items-start mb-10">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-black">Active User Sessions</span>
              <img src={SensorsBlue}/>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-headline text-7xl font-bold text-white tracking-tighter transition-all group-hover:tracking-normal">14,802</span>
              <div className="flex flex-col">
                <span className="text-(--secondary) text-xs font-bold flex items-center">
                  <img src={ArrrowUpward} alt="ArrowUpward" /> 12%
                </span>
                <span className="text-[9px] text-(--on-surface-variant) opacity-50 font-mono">VS LAST HR</span>
              </div>
            </div>
            <div className="mt-8 h-1 w-full bg-(--surface-highest) rounded-full overflow-hidden">
              <div className="h-full bg-(--secondary) w-3/4 shadow-[0_0_15px_var(--secondary)]"></div>
            </div>
          </div>

          {/* CARD: CPU LOAD (Bar Graph style) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border border-white/5 flex flex-col justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-(--on-surface-variant) mb-1 font-bold">Inference Engine Load</p>
              <h3 className="font-headline text-3xl font-bold text-white tracking-tight">42.8% <span className="text-xs text-(--on-surface-variant) font-normal tracking-normal uppercase">Capacity</span></h3>
            </div>
            <div className="flex items-end gap-2 h-20 mt-6">
              {[30, 50, 40, 70, 90, 45, 60, 42].map((height, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-xs transition-all duration-1000 ease-out ${i === 7 ? 'bg-(--secondary) shadow-[0_0_10px_var(--secondary)]' : 'bg-(--surface-highest)'}`} 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* CARD: RAM (Gradient bar style) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border border-white/5">
            <p className="font-label text-[10px] uppercase tracking-widest text-(--on-surface-variant) mb-1 font-bold">VRAM Utilization</p>
            <h3 className="font-headline text-3xl font-bold text-white">12.4 <span className="text-sm opacity-50 uppercase">GB</span></h3>
            <div className="relative h-3 bg-(--surface-highest) rounded-sm mt-10 overflow-hidden border border-white/5">
              <div className="absolute inset-0 h-full w-[65%] bg-linear-to-r from-(--primary-container) to-(--secondary) shadow-[0_0_20px_rgba(14,165,233,0.4)]"></div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[9px] text-(--on-surface-variant) font-mono uppercase">Cluster_A_Node_Active</span>
              <span className="text-[9px] text-white font-mono">65%</span>
            </div>
          </div>

          {/* AUDIT LOG TABLE (Industrial Terminal style) */}
          <div className="col-span-12 bg-(--surface-low) rounded-sm border border-white/5 overflow-hidden shadow-2xl">
            <div className="px-8 py-5 flex justify-between items-center border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-4">
                <h4 className="font-headline text-xs font-bold text-white uppercase tracking-[0.2em]">Audit Logs & System Events</h4>
                <span className="data-chip">Security_Level_3</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">Live_Stream</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-(--surface-lowest) text-(--on-surface-variant) font-bold text-[10px] uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5">Event Source</th>
                    <th className="px-8 py-5">Diagnostic Status</th>
                    <th className="px-8 py-5 text-right">Response Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {[
                    { time: '14:22:01.042', src: 'Model_SLA_Aggregator', event: 'Task_Success', status: 'SUCCESS', lat: '42ms', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { time: '14:21:58.910', src: 'Internal_Router_01', event: 'Handshake_Init', status: 'SUCCESS', lat: '12ms', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { time: '14:21:44.991', src: 'Compute_Worker_X2', event: 'Timeout_Warning', status: 'WARNING', lat: '2400ms', color: 'text-red-400', bg: 'bg-red-400/10' },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors group">
                      <td className="px-8 py-4 text-(--on-surface-variant) text-[11px] opacity-70 group-hover:opacity-100">{log.time}</td>
                      <td className="px-8 py-4 text-white text-[11px] font-bold tracking-tight">{log.src} <span className="text-[9px] font-normal opacity-30 ml-2">// {log.event}</span></td>
                      <td className="px-8 py-4">
                        <span className={`${log.color} ${log.bg} border border-current/20 px-3 py-1 rounded-xs text-[9px] font-black tracking-tighter`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-(--secondary) text-[11px] text-right font-bold tracking-widest">{log.lat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}