import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AccountCircle from "../assets/icons/account_circle.svg";
import AccountCircleSelected from "../assets/icons/account_circle_selected.svg";
import History from "../assets/icons/history.svg";
import HistorySelected from "../assets/icons/history_selected.svg";
import Bolt from "../assets/icons/bolt_white.svg";
import LogoutRed from "../assets/icons/logout.svg";
import ArrowForward from "../assets/icons/arrow_forward.svg";
import ArrowBack from "../assets/icons/arrow_back.svg";
import PrecisionManufacturing from "../assets/icons/precision_manufacturing.svg";

export default function SideBar({ currentUser, handleLogout }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const baseLinkClasses = "flex items-center gap-3 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group";
    
    const getNavLinkClass = (isActive, isAdmin = false) => {
        if (isActive) {
            return `${baseLinkClasses} text-white bg-(--primary-container)/10 border-l-4 ${isAdmin ? 'border-amber-500' : 'border-(--primary-container)'} shadow-[inset_15px_0_20px_-15px_rgba(14,165,233,0.3)]`;
        }
        return `${baseLinkClasses} text-(--on-surface-variant) hover:bg-white/5 hover:text-white`;
    };

    return (
        <>
            {/* 01. CAPA DE OPACIDAD */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsOpen(false)} />

            {/* 02. BOTÓN MÓVIL */}
            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden fixed top-1/2 -translate-y-1/2 z-60 bg-(--surface) border border-l-0 border-white/10 text-(--on-surface-variant) p-2 rounded-r-sm transition-all duration-300 ${isOpen ? 'left-64' : 'left-0'}`}>
                <img src={isOpen ? ArrowBack : ArrowForward} alt="Toggle" className="w-5 h-5" />
            </button>

            {/* 03. SIDEBAR */}
            <aside className={`fixed md:sticky left-0 top-0 md:top-20 bottom-0 w-64 bg-(--surface)/95 backdrop-blur-md flex flex-col py-8 z-50 border-r border-white/5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} h-screen md:h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide`}>
                
                <div className="px-6 mb-10 shrink-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-bold">Módulo de Usuario</p>
                    <div className="h-px w-8 bg-(--primary-container)/40 mt-1"></div>
                </div>

                <nav className="grow flex flex-col">
                    <NavLink to="/profile" end onClick={() => setIsOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}>
                        {({ isActive }) => (
                            <>
                                <img src={isActive ? AccountCircleSelected : AccountCircle} alt="Perfil" className="w-5 h-5" />
                                <span>Perfil</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/profile/my-predictions" onClick={() => setIsOpen(false)} className={({ isActive }) => getNavLinkClass(isActive)}>
                        {({ isActive }) => (
                            <>
                                <img src={isActive ? HistorySelected : History} alt="Historial" className="w-5 h-5" />
                                <span>Mis Predicciones</span>
                            </>
                        )}
                    </NavLink>

                    {/* SECCIÓN ADMIN: Validación ultra-segura */}
                    {currentUser && currentUser.role == 1 && (
                        <NavLink 
                            to="/admin" 
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => getNavLinkClass(isActive, true)}
                        >
                            {({ isActive }) => (
                                <>
                                    <img src={PrecisionManufacturing} alt="Admin" className={`w-5 h-5 ${isActive ? 'brightness-125' : 'opacity-60'}`} />
                                    <span className={isActive ? 'text-amber-400' : 'text-amber-400/70 group-hover:text-amber-400'}>Admin</span>
                                    {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                </>
                            )}
                        </NavLink>
                    )}
                </nav>

                <div className="px-6 mt-auto pt-10 space-y-4 shrink-0 pb-10">
                    <div className="bg-black/40 p-4 border border-white/5 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-(--secondary)/20"></div>
                        <p className="text-[9px] text-[#606070] uppercase mb-1 font-bold">System Link</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-(--secondary) animate-pulse"></div>
                            <p className="text-[10px] text-white font-mono uppercase tracking-widest">Activo</p>
                        </div>
                    </div>
                    
                    <NavLink to='/predict' onClick={() => setIsOpen(false)} className="block">
                        <button className="w-full bg-linear-to-br from-(--primary-container) to-(--primary) text-white font-bold text-[10px] py-3.5 rounded-sm shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer">
                            PREDECIR <img src={Bolt} alt="Bolt" className="w-3.5"/>
                        </button>
                    </NavLink>

                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest bg-white/5 text-(--on-surface-variant) border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-sm cursor-pointer">
                        <img src={LogoutRed} alt="Logout" className="w-3.5 opacity-60" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}