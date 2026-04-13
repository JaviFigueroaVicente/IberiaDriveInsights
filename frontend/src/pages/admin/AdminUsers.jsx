import { useState } from "react";
import AdminSideBar from "../../components/AdminSideBar";
import Search from "../../assets/icons/search.svg";
import SettingsSlowMotion from "../../assets/icons/settings_slow_motion.svg";
import Lock from "../../assets/icons/lock.svg";
import ChevronRight from "../../assets/icons/chevron_right.svg";
import ChevronLeft from "../../assets/icons/chevron_left.svg";
import GroupsBlue from "../../assets/icons/groups_blue.svg";
import Sensors from "../../assets/icons/sensors.svg";
import HourglassEmpty from "../../assets/icons/hourglass_empty.svg";
import PersonAdd from "../../assets/icons/person_add.svg";

export default function UserRegistry({ currentUser, handleLogout }) {
  // Datos con metadatos de estilo industrial
  const users = [
    { id: "USR-4421", name: "Marcus Vance", email: "m.vance@engine.io", role: "LEAD ANALYST", status: "ACTIVE", lastActivity: "2023.10.24 — 14:22:01", color: "text-(--secondary)", dot: "bg-(--secondary)", shadow: "shadow-[0_0_10px_var(--secondary)]" },
    { id: "USR-0912", name: "Sarah Kincaid", email: "s.kincaid@engine.io", role: "SYSTEM OPERATOR", status: "PENDING", lastActivity: "2023.10.23 — 09:12:44", color: "text-(--primary-container)", dot: "bg-(--primary-container)", shadow: "shadow-[0_0_10px_var(--primary-container)]" },
    { id: "USR-8831", name: "Jameson Void", email: "j.void@engine.io", role: "LEAD ANALYST", status: "SUSPENDED", lastActivity: "2023.10.20 — 18:55:12", color: "text-red-400", dot: "bg-red-500", shadow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
    { id: "USR-1102", name: "Elena Rossi", email: "e.rossi@engine.io", role: "NETWORK ADMIN", status: "ACTIVE", lastActivity: "2023.10.24 — 16:01:45", color: "text-(--secondary)", dot: "bg-(--secondary)", shadow: "shadow-[0_0_10px_var(--secondary)]" },
  ];

  return (
    <div className="min-h-screen bg-(--surface) flex flex-col md:flex-row">
      <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />

      <main className="flex-1 bg-(--surface) p-4 md:p-8 overflow-y-auto scrollbar-hide blueprint-grid-dots">
        
        {/* HEADER DE SECCIÓN - Estilo Blueprint */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-(--on-surface)">User Registry</h2>
            </div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-(--secondary) font-bold opacity-80">
              Identity Management // Auth Protocol: MAD_SEC_04
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none btn-primary-engine py-2.5! px-6! text-[10px]! rounded-sm! gap-2 flex items-center justify-center">
              <img src={PersonAdd} alt="Person Add" />
              <span className="leading-none">Create Identity</span>
            </button>
          </div>
        </div>

        {/* BENTO STATS GRID */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          <StatCard title="Total Users" value="14,208" trend="+12.4%" color="var(--primary-container)" progress="78%" icon={GroupsBlue} isMain />
          <StatCard title="Active Nodes" value="9,412" trend="LIVE" color="var(--secondary)" progress="62%" icon={Sensors} />
          <StatCard title="Pending" value="43" trend="URGENT" color="var(--primary-container)" progress="15%" icon={HourglassEmpty} />
          <StatCard title="Suspended" value="112" trend="LOCKED" color="#f87171" progress="5%" icon={Lock} />
        </div>

        {/* CONTAINER DE REGISTRO ESTILO TERMINAL */}
        <div className="bg-(--surface-low) rounded-sm border border-white/5 overflow-hidden shadow-2xl">
          
          {/* BARRA DE FILTROS TÉCNICOS */}
          <div className="px-8 py-5 border-b border-white/5 bg-white/2 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-(--on-surface-variant) uppercase tracking-widest opacity-40">Query_Filter:</span>
                <select className="bg-black/40 border border-white/10 text-[10px] text-white rounded-xs px-4 py-1.5 font-headline tracking-widest focus:ring-1 focus:ring-(--secondary) outline-hidden">
                  <option>ALL_ACCESS_TIERS</option>
                </select>
              </div>
              <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
              <div className="hidden lg:flex items-center gap-4">
                <button className="text-(--secondary) text-[9px] font-black uppercase tracking-tighter hover:bg-(--secondary)/10 px-2 py-1 rounded-xs transition-all">Mass_Activate</button>
                <button className="text-red-400 text-[9px] font-black uppercase tracking-tighter hover:bg-red-400/10 px-2 py-1 rounded-xs transition-all">Decommission</button>
              </div>
            </div>
            
            <div className="relative w-full sm:w-72">
              <img src={Search} alt="Search Icon" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="SEARCH BY UUID OR IDENTITY..." className="w-full bg-black/40 border border-white/10 text-[10px] pl-10 pr-4 py-2 rounded-xs font-mono text-white placeholder:text-white/20 focus:border-(--secondary)/50 focus:ring-0 transition-all uppercase" />
            </div>
          </div>

          {/* TABLA DE IDENTIDADES */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-(--surface-lowest) text-(--on-surface-variant) font-bold text-[10px] uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5 w-10"><input type="checkbox" className="rounded-xs bg-black/40 border-white/20 text-(--secondary) focus:ring-0 cursor-pointer" /></th>
                  <th className="px-8 py-5">Identity_UID</th>
                  <th className="px-8 py-5">Tier_Role</th>
                  <th className="px-8 py-5">Status_Check</th>
                  <th className="px-8 py-5">Last_Telemetry_Sync</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-8 py-6"><input type="checkbox" className="rounded-xs bg-black/40 border-white/20 text-(--secondary) focus:ring-0 cursor-pointer" /></td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 font-body">
                        <div className="w-10 h-10 bg-(--surface-highest) rounded-xs border border-white/10 flex items-center justify-center text-(--secondary) font-headline font-black text-xs shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{user.name}</p>
                          <p className="text-[10px] text-(--on-surface-variant) opacity-40 font-mono tracking-tighter">{user.id} // {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="data-chip">{user.role}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.dot} ${user.shadow} animate-pulse`}></span>
                        <span className={`${user.color} text-[9px] font-black uppercase tracking-widest`}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-(--on-surface-variant) opacity-60">
                      {user.lastActivity}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-white/40 hover:text-(--secondary) hover:border-(--secondary)/40 transition-all hover:scale-110">
                        <img src={SettingsSlowMotion} alt="Settings Slow Motion" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN ESTILO HARDWARE */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-(--surface-low) px-8 py-5 rounded-sm border border-white/5 gap-4">
          <p className="text-[9px] font-black text-(--on-surface-variant) uppercase tracking-[0.3em] opacity-40 font-mono">
            Log_Range: 001-010 // Total_Entities: 14,208
          </p>
          <div className="flex gap-2">
            <PaginationBtn icon={ChevronLeft} />
            <PaginationBtn text="1" active />
            <PaginationBtn text="2" />
            <PaginationBtn text="3" />
            <PaginationBtn icon={ChevronRight} />
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-componentes refinados para el Sistema de Diseño "After Dark"
function StatCard({ title, value, trend, color, progress, icon, isMain }) {
  return (
    <div className={`col-span-12 md:col-span-6 lg:col-span-3 bg-(--surface-low) p-8 rounded-sm border border-white/5 relative group transition-all duration-500 ${isMain ? 'border-l-4 border-l-(--secondary) shadow-[inset_20px_0_30px_-20px_rgba(93,230,255,0.1)]' : ''}`}>
      <div className="flex justify-between items-start mb-8">
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-black opacity-50">{title}</span>
        <img src={icon} alt={title} className={`${isMain ? 'text-(--secondary) glow-icon' : 'text-white/20'}`}/>
      </div>    
      <div className="flex items-baseline gap-3">
        <h3 className="font-headline text-5xl font-black text-white tracking-tighter leading-none">{value}</h3>
        <span className="text-[10px] font-black font-mono tracking-widest" style={{ color }}>{trend}</span>
      </div>
      <div className="mt-6 h-1 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div className="h-full transition-all duration-1000" style={{ backgroundColor: color, width: progress, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
    </div>
  );
}

function PaginationBtn({ text, icon, active }) {
  return (
    <button className={`h-9 w-9 flex items-center justify-center rounded-xs text-[10px] font-black transition-all border ${
      active 
      ? 'bg-(--secondary) text-black border-(--secondary) shadow-[0_0_15px_var(--secondary)]' 
      : 'bg-white/5 text-white/40 border-white/5 hover:border-(--secondary)/40 hover:text-(--secondary)'
    }`}>
      {icon ? <img src={icon} alt="Pagination Button" className="w-4 h-4" /> : text}
    </button>
  );
}