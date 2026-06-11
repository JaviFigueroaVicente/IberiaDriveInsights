import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "../assets/icons/menu.svg";

export default function SubHeaderProfile() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems = [
        { label: 'Personal', path: '/profile' },
        { label: 'Seguridad', path: '/profile/change-password' }
    ];

    return (
        <div className="relative border-b border-white/5 bg-black/5 backdrop-blur-sm top-0 z-30">
            {/* Contenedor Principal */}
            <div className="h-16 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-8">
                    <h2 className="font-headline font-bold text-sm md:text-xl text-(--primary-container) tracking-tighter uppercase">
                        Configuración <span className="hidden sm:inline">de Cuenta</span>
                    </h2>
                    
                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex gap-6">
                        {navItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path}
                                    to={item.path} 
                                    className={`text-[10px] font-bold tracking-widest uppercase transition-all pb-1 border-b-2 ${
                                        active 
                                        ? "text-(--primary-container) border-(--primary-container)" 
                                        : "text-(--on-surface-variant) border-transparent hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Botón Móvil (Solo visible en < md) */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex items-center gap-2 text-[#BEC8D2] hover:text-white transition-colors p-2 cursor-pointer"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sección</span>
                    <img 
                        src={Menu} 
                        alt="Expand" 
                        className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} 
                    />
                </button>
            </div>

            {/* Menú Desplegable Móvil (Pestaña hacia abajo) */}
            <nav className={`
                md:hidden absolute top-16 left-0 w-full bg-[#0d0d12]/95 backdrop-blur-xl border-b border-white/10
                transition-all duration-300 ease-in-out origin-top z-20
                ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}
            `}>
                <ul className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link 
                                    to={item.path} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all ${
                                        active 
                                        ? "bg-(--primary-container)/10 text-(--primary-container)" 
                                        : "text-(--on-surface-variant) hover:bg-white/5"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}