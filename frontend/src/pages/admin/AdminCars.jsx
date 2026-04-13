import { useState } from "react";
import AdminSideBar from "../../components/AdminSideBar";
import SettingsInputComponent from "../../assets/icons/settings_input_component.svg";
import BoltWhite from "../../assets/icons/bolt_white.svg";
import DirectionsCarBlue from "../../assets/icons/directions_car_blue.svg"; 
import Search from "../../assets/icons/search.svg";
import Add from "../../assets/icons/add.svg";

export default function AdminCars({ currentUser, handleLogout }) {
    // Datos de ejemplo: Inventario de Vehículos IA
    const fleet = [
        { id: "VEH-082", model: "Tesla Model 3", plateau: "MAD-9921", battery: 88, status: "ON MISSION", color: "text-(--secondary)", dot: "bg-(--secondary)", shadow: "shadow-[0_0_10px_var(--secondary)]" },
        { id: "VEH-045", model: "BMW i4", plateau: "BCN-4402", battery: 94, status: "CHARGING", color: "text-(--primary-container)", dot: "bg-(--primary-container)", shadow: "shadow-[0_0_10px_var(--primary-container)]" },
        { id: "VEH-012", model: "Audi Q4 e-tron", plateau: "VAL-1123", battery: 12, status: "LOW POWER", color: "text-red-400", dot: "bg-red-500", shadow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
        { id: "VEH-099", model: "Polestar 2", plateau: "SVQ-8831", battery: 100, status: "READY", color: "text-(--secondary)", dot: "bg-(--secondary)", shadow: "shadow-[0_0_10px_var(--secondary)]" },
    ];

    return (
        <div className="min-h-screen bg-(--surface) flex flex-col md:flex-row">
            <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />

            <main className="flex-1 bg-(--surface) p-4 md:p-8 overflow-y-auto scrollbar-hide blueprint-grid-dots">
                
                {/* HEADER DE SECCIÓN - Blueprint Style coherente con Dashboard */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
                            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-(--on-surface)">Fleet Inventory</h2>
                        </div>
                        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-(--secondary) font-bold opacity-80">
                            Asset Management // Protocol: Autonomous_Unit_Tracking
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none btn-primary-engine py-2.5! px-6! text-[10px]! rounded-sm! gap-2 flex items-center justify-center">
                            <img src={Add} alt="Add"/>
                            <span className="leading-none">Register Unit</span>
                        </button>
                    </div>
                </div>

                {/* METRICS GRID - Bento Layout coherente */}
                <div className="grid grid-cols-12 gap-6 mb-10">
                    
                    {/* Active Units Card */}
                    <div className="col-span-12 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border-l-4 border-(--secondary) shadow-[inset_20px_0_30px_-20px_rgba(93,230,255,0.1)] relative group">
                        <div className="flex justify-between items-start mb-8">
                            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-black">Active Units</span>
                            <img src={DirectionsCarBlue}  className="material-symbols-outlined text-(--secondary) glow-icon"/>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="font-headline text-6xl font-bold text-white tracking-tighter transition-all group-hover:tracking-normal">42</span>
                            <span className="text-(--secondary) text-[10px] font-black font-mono tracking-widest">92% CAP_LOAD</span>
                        </div>
                    </div>

                    {/* Avg Battery Card */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border border-white/5 flex flex-col justify-between group">
                        <div className="flex justify-between">
                            <p className="font-label text-[10px] uppercase tracking-widest text-(--on-surface-variant) mb-1 font-bold">Avg. Energy Level</p>
                            <img src={BoltWhite} className="material-symbols-outlined text-sm text-(--on-surface-variant) opacity-30"/>
                        </div>
                        <h3 className="font-headline text-4xl font-bold text-white tracking-tight mt-4">76.4%</h3>
                        <div className="mt-6 h-1 w-full bg-(--surface-highest) rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-(--primary-container) to-(--secondary) w-[76%] shadow-[0_0_10px_var(--secondary)]"></div>
                        </div>
                    </div>

                    {/* Maintenance Card */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-(--surface-low) p-8 rounded-sm border border-white/5 group">
                        <p className="font-label text-[10px] uppercase tracking-widest text-(--on-surface-variant) mb-1 font-bold">Maintenance Req.</p>
                        <div className="flex items-center gap-4 mt-4">
                            <h3 className="font-headline text-4xl font-bold text-red-400">03</h3>
                            <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-tighter">Urgent Attention</div>
                        </div>
                        <p className="text-[9px] text-(--on-surface-variant) mt-6 font-mono opacity-40 uppercase">Next system audit in 14h 22m</p>
                    </div>
                </div>

                {/* VEHICLE TABLE - Industrial Terminal style */}
                <div className="bg-(--surface-low) rounded-sm border border-white/5 overflow-hidden shadow-2xl">
                    <div className="px-8 py-5 flex flex-col sm:flex-row justify-between items-center border-b border-white/5 bg-white/2 gap-4">
                        <div className="flex items-center gap-4">
                            <h4 className="font-headline text-xs font-bold text-white uppercase tracking-[0.2em]">Live_Telemetry_Stream</h4>
                            <span className="data-chip">Protocol_802.11p</span>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <img src={Search} className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/20"/>
                            <input type="text" placeholder="FILTER BY UNIT ID..." className="w-full bg-black/40 border border-white/10 text-[10px] pl-10 pr-4 py-2 rounded-xs font-mono text-white placeholder:text-white/20 focus:border-(--secondary)/50 focus:ring-0 transition-all" />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-(--surface-lowest) text-(--on-surface-variant) font-bold text-[10px] uppercase tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-5">Vehicle ID</th>
                                    <th className="px-8 py-5">Model / Node</th>
                                    <th className="px-8 py-5">Deployment Status</th>
                                    <th className="px-8 py-5 text-right">Energy</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                                {fleet.map((car) => (
                                    <tr key={car.id} className="hover:bg-white/3 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-[11px] font-bold tracking-tight">{car.id}</span>
                                                <span className="text-[9px] text-(--secondary) opacity-60 font-black tracking-widest">{car.plateau}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="data-chip">{car.model}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-1.5 h-1.5 rounded-full ${car.dot} ${car.shadow} animate-pulse`}></span>
                                                <span className={`${car.color} text-[9px] font-black uppercase tracking-widest`}>{car.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-[11px] font-bold text-white tracking-widest">{car.battery}%</span>
                                                <div className="w-16 h-1 bg-(--surface-highest) rounded-full overflow-hidden hidden sm:block">
                                                    <div className={`h-full ${car.dot}`} style={{ width: `${car.battery}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-xs bg-white/5 border border-white/10 text-white/40 hover:text-(--secondary) hover:border-(--secondary)/40 transition-all group-hover:scale-110">
                                                <img src={SettingsInputComponent} alt="SettingsInputComponent" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}