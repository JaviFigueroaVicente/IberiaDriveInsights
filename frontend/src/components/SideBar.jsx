import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountCircle from "../assets/icons/account_circle.svg";
import AccountCircleSelected from "../assets/icons/account_circle_selected.svg";
import History from "../assets/icons/history.svg";
import HistorySelected from "../assets/icons/history_selected.svg";
import Bolt from "../assets/icons/bolt_white.svg";
import Logout from "../assets/icons/logout_white.svg";
import LogoutRed from "../assets/icons/logout.svg";
import ArrowForward from "../assets/icons/arrow_forward.svg";
import ArrowBack from "../assets/icons/arrow_back.svg";

export default function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const isPathActive = (path) => {
        if (path === "/profile") {
            return location.pathname === "/profile" || location.pathname === "/profile/change-password";
        }
        return location.pathname === path;
    };

    const getActiveClasses = (path) => {
        const active = isPathActive(path);
        return active
            ? "flex items-center gap-3 px-6 py-3 bg-(--primary-container)/10 text-(--secondary) border-l-4 border-(--primary-container) text-sm font-bold uppercase tracking-widest transition-all"
            : "flex items-center gap-3 px-6 py-3 text-(--on-surface-variant) hover:bg-white/5 hover:text-white transition-all text-sm font-medium group";
    };

    return (
        <>
            {/* 01. CAPA DE OPACIDAD (Overlay Móvil) */}
            <div 
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* 02. FLECHA DE APERTURA (Posición sincronizada con Header py-4) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden fixed top-1/2 -translate-y-1/2 z-60 bg-(--surface) border border-l-0 border-white/10 text-(--on-surface-variant) p-2 rounded-r-sm transition-all duration-300 shadow-[4px_0_15px_rgba(0,0,0,0.5)] cursor-pointer ${
                    isOpen ? 'left-64' : 'left-0'
                }`}
            >
                {isOpen ? (
                    <img 
                        src={ArrowBack} 
                        alt="Cerrar" 
                        className="w-5 h-5 object-contain"
                    />
                ) : (
                    <img 
                        src={ArrowForward}
                        alt="Abrir" 
                        className="w-5 h-5 object-contain"
                    />
                )}
            </button>

            {/* 03. SIDEBAR PRINCIPAL */}
            {/* 03. SIDEBAR PRINCIPAL */}
<aside className={`
    fixed md:sticky left-0 top-0 md:top-20 bottom-0 w-64 
    bg-(--surface)/95 backdrop-blur-md flex flex-col py-8 z-50 
    border-r border-white/5 transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    
    /* CAMBIOS AQUÍ: */
    h-screen md:h-[calc(100vh-5rem)] 
    overflow-y-auto scrollbar-hide
`}>
    
    {/* Cabecera interna SideBar */}
    <div className="px-6 mb-10 flex justify-between items-center shrink-0">
        <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-bold">Módulo de Usuario</p>
            <div className="h-px w-8 bg-(--primary-container)/40 mt-1"></div>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-(--on-surface-variant) hover:text-white">
            <span className="material-symbols-outlined">close</span>
        </button>
    </div>

    {/* Navegación - grow permite que empuje las acciones al fondo */}
    <nav className="grow space-y-1">
        <Link to="/profile" className={getActiveClasses("/profile")} onClick={() => setIsOpen(false)}>
            <img src={isPathActive("/profile") ? AccountCircleSelected : AccountCircle} alt="Account" className="w-5 h-5" /> 
            Perfil
        </Link>

        <Link to="/profile/my-predictions" className={getActiveClasses("/profile/my-predictions")} onClick={() => setIsOpen(false)}>
            <img src={isPathActive("/profile/my-predictions") ? HistorySelected : History} alt="History" className="w-5 h-5" /> 
            Mis Predicciones
        </Link>
    </nav>

    {/* Acciones Inferiores - Se añade shrink-0 para que no se colapsen */}
    <div className="px-6 mt-auto pt-10 space-y-4 shrink-0 pb-10 md:pb-4">
        {/* Status Box */}
        <div className="bg-black/40 p-4 border border-white/5 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-(--secondary)/20"></div>
            <p className="text-[9px] text-[#606070] uppercase mb-1 font-bold tracking-tighter">System Link</p>
            <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-(--secondary) animate-pulse shadow-[0_0_8px_var(--secondary)]"></div>
                <p className="text-[10px] text-white font-mono uppercase tracking-widest">Active_Session</p>
            </div>
        </div>
        
        {/* Botón Predict */}
        <Link to='/predict' onClick={() => setIsOpen(false)} className="block">
            <button className="w-full bg-linear-to-br from-(--primary-container) to-(--primary) text-white font-headline font-bold text-[10px] py-3.5 rounded-sm shadow-[0_4px_15px_-3px_var(--primary)/30] hover:shadow-[0_6px_20px_-4px_var(--primary)/40] hover:brightness-105 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer group">
                PREDECIR <img src={Bolt} alt="Bolt" className="w-3.5 group-hover:rotate-12 transition-transform duration-300"/>
            </button>
        </Link>

        {/* Botón Logout */}
        <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer group bg-white/5 text-(--on-surface-variant) border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all rounded-sm"
        >
            <img
                src={location.pathname === "/login" ? Logout : LogoutRed}
                alt="Logout"
                className="w-3.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            />
            Cerrar Sesión
        </button>
    </div>
</aside>
        </>
    );
}