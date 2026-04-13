import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutRed from "../assets/icons/logout.svg";
import ArrowForward from "../assets/icons/arrow_forward.svg";
import ArrowBack from "../assets/icons/arrow_back.svg";
import ArrowBackWhite from "../assets/icons/arrow_back_white.svg";
import DirectionsCar from "../assets/icons/directions_car.svg";
import Group from "../assets/icons/group.svg";
import Dashboard from "../assets/icons/dashboard.svg";

export default function AdminSideBar({ currentUser, handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    // Clases base con estilo de "Terminal de Administración" (Ámbar)
    const baseLinkClasses = "flex items-center gap-3 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group border-l-4 border-transparent";
    
    const getNavLinkClass = ({ isActive }) => {
        if (isActive) {
            return `${baseLinkClasses} text-white bg-amber-500/10 border-amber-500 shadow-[inset_15px_0_25px_-15px_rgba(245,158,11,0.25)]`;
        }
        return `${baseLinkClasses} text-(--on-surface-variant) hover:bg-white/5 hover:text-amber-400`;
    };

    return (
        <>
            {/* 01. CAPA DE OSCURIDAD MÓVIL (Misma lógica que SideBar) */}
            <div 
                className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* 02. BOTÓN DE APERTURA (Idéntico comportamiento responsive) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden fixed top-1/2 -translate-y-1/2 z-60 bg-(--surface-low) border border-l-0 border-amber-500/30 text-amber-500 p-2 rounded-r-sm transition-all duration-300 shadow-[4px_0_15px_rgba(0,0,0,0.5)] ${
                    isOpen ? 'left-64' : 'left-0'
                }`}
            >
                <img src={isOpen ? ArrowBack : ArrowForward} alt="Toggle" className="w-5 h-5 brightness-125" />
            </button>

            {/* 03. ASIDE PRINCIPAL (Estructura espejo del SideBar de usuario) */}
            <aside className={`
                fixed md:sticky left-0 top-0 md:top-20 bottom-0 w-64 
                bg-(--surface-lowest)/95 backdrop-blur-xl flex flex-col py-8 z-50 
                border-r border-white/5 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                h-screen md:h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide
            `}>
                
                {/* Cabecera Técnica */}
                <div className="px-6 mb-10 shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black font-headline">Admin Terminal</p>
                    </div>
                    <p className="text-[9px] text-(--on-surface-variant) opacity-40 uppercase font-mono tracking-tighter">Access_Level: Root</p>
                    <div className="h-px w-full bg-linear-to-r from-amber-500/30 via-amber-500/10 to-transparent mt-4"></div>
                </div>

                {/* Navegación Principal */}
                <nav className="grow flex flex-col space-y-0.5">
                    <NavLink to="/admin" end onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                        {({ isActive }) => (
                            <>
                                <img src={Dashboard} alt="Dashboard"/>
                                <span className="font-headline">System Health</span>
                                {isActive && <div className="absolute right-0 w-1 h-5 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />}
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/admin/cars" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                        {({ isActive }) => (
                            <>
                                <img src={DirectionsCar} alt="Directions Car" />
                                <span className="font-headline">Cars Inventory</span>
                                {isActive && <div className="absolute right-0 w-1 h-5 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />}
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/admin/users" onClick={() => setIsOpen(false)} className={getNavLinkClass}>
                        {({ isActive }) => (
                            <>
                                <img src={Group} alt="Group" />
                                <span className="font-headline">Gestión Usuarios</span>
                                {isActive && <div className="absolute right-0 w-1 h-5 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />}
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* Footer del Sidebar (Mismo espaciado y estructura) */}
                <div className="px-6 mt-auto pt-10 space-y-4 shrink-0 pb-10">
                    {/* Badge de Operador */}
                    <div className="bg-black/40 border border-white/5 p-4 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
                        <p className="text-[8px] uppercase text-(--on-surface-variant) mb-1 font-mono tracking-widest opacity-50">Active_Operator</p>
                        <p className="text-[10px] text-white font-bold truncate font-mono tracking-tight">
                            {currentUser?.email?.split('@')[0].toUpperCase() || 'SYS_ADMIN'}
                        </p>
                    </div>

                    {/* Botón Volver al App */}
                    <NavLink to="/profile" onClick={() => setIsOpen(false)} className="block">
                        <button className="w-full bg-(--surface-high) hover:bg-white/10 text-(--on-surface) text-[10px] font-bold py-3.5 rounded-sm border border-white/5 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.15em] cursor-pointer group">
                            <img src={ArrowBackWhite} alt="Arrow Back" className="w-3.5 opacity-60 group-hover:opacity-100 transition-all" />
                            User View
                        </button>
                    </NavLink>

                    {/* Botón Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer group bg-red-500/5 text-red-400 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all rounded-sm"
                    >
                        <img src={LogoutRed} alt="Logout" className="w-3.5 opacity-60 group-hover:opacity-100 transition-all" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}