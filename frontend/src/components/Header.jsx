import Logo from '../assets/icons/logo.png'
import { NavLink, Link } from 'react-router-dom'
import Perfil from '../assets/icons/perfil.svg'
import { useState } from 'react'
import Person from '../assets/icons/person.svg'
import Logout from '../assets/icons/logout.svg'
import Menu from '../assets/icons/menu.svg'
import PrecisionManufacturing from '../assets/icons/precision_manufacturing.svg'

export default function Header({ isAuthenticated, currentUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkStyles = ({ isActive }) => 
        isActive 
            ? "text-(--primary-container) transition-colors" 
            : "hover:text-(--primary-container) transition-colors";

    const mobileNavLinkStyles = ({ isActive }) =>
        isActive
            ? "block py-2 border-b border-white/5 text-(--primary-container) pl-2 border-l-2 border-l-(--primary-container)"
            : "block py-2 border-b border-white/5 hover:text-(--primary-container) transition-all";

    return (
        <header className="sticky top-0 z-100 w-full border-b border-white/10 bg-(--surface)/80 backdrop-blur-md">
            
            <div className="flex items-center justify-between py-4 px-4 md:px-10 h-20 relative z-120">
                
                {/* 01. Logo */}
                <div className='flex items-center'>
                    <Link to='/' className='flex items-center gap-3 group' onClick={() => setIsMenuOpen(false)}>
                        <div className="h-9 w-9 p-1 bg-(--primary-container)/20 border border-(--primary-container)/40 rounded-sm">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tighter text-white uppercase hidden sm:block">
                            Iberia Drive <span className="text-(--primary-container)">Insights</span>
                        </h1>
                    </Link>
                </div>

                {/* 02. Navegación Central (Desktop) - USANDO NAVLINK */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-8 font-bold text-[11px] tracking-[0.2em] uppercase text-[#BEC8D2]">
                        <li><NavLink className={navLinkStyles} to='/predict'>Predecir</NavLink></li>
                        <li><NavLink className={navLinkStyles} to='/analysis'>Análisis</NavLink></li>
                        <li><NavLink className={navLinkStyles} to='/models'>Modelos</NavLink></li>
                        {isAuthenticated && (
                            <li><NavLink className={navLinkStyles} to='/profile/my-predictions'>Mis Predicciones</NavLink></li>
                        )}
                    </ul>
                </nav>

                {/* 03. Sección Usuario / Hamburguesa */}
                <div className='flex items-center gap-4'>
                    <div className="hidden md:block relative">
                        {isAuthenticated && currentUser ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsOpen(!isOpen)} 
                                    className="flex items-center gap-3 focus:outline-none group cursor-pointer relative z-130"
                                >
                                    <div className="text-right hidden lg:block">
                                        <p className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider">{currentUser.name}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full border-2 border-white/10 p-0.5 group-hover:border-(--primary-container) transition-all overflow-hidden bg-black/20">
                                        <img src={Perfil} alt="Perfil" className="h-full w-full object-cover"/>
                                    </div>
                                </button>

                                {isOpen && (
                                    <>
                                        <div className="fixed inset-0 z-125" onClick={() => setIsOpen(false)}></div>
                                        <ul className="absolute right-0 mt-4 w-52 bg-[#0d0d12] border border-white/10 shadow-2xl z-130 py-3 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-(--primary-container)/40"></div>
                                            <li className="px-5 py-3 border-b border-white/5 mb-2">
                                                <p className="text-[9px] text-[#606070] font-bold tracking-widest uppercase">ID de Sistema</p>
                                                <p className="text-xs text-white font-mono truncate">{currentUser.email || 'USR-404'}</p>
                                            </li>
                                            <li>
                                                <NavLink 
                                                    to="/profile" 
                                                    onClick={() => setIsOpen(false)} 
                                                    className={({isActive}) => `flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold ${isActive ? 'text-white bg-white/5' : 'text-[#BEC8D2]'} hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider`}
                                                >
                                                    <img src={Person} alt="Person" /> Mi Perfil
                                                </NavLink>
                                            </li>
                                            {isAuthenticated && currentUser.role == 1 && (
                                                <li>
                                                    <NavLink 
                                                        to="/admin" 
                                                        onClick={() => setIsOpen(false)}
                                                        className={({isActive}) => `flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold ${isActive ? 'text-white bg-white/5' : 'text-[#BEC8D2]'} hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider`}
                                                    >
                                                        <img src={PrecisionManufacturing} alt="admin" /> Admin
                                                    </NavLink>
                                                </li>
                                            )}
                                            <li className="mt-2 pt-2 border-t border-white/5 px-2">
                                                <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded transition-all uppercase tracking-wider cursor-pointer">
                                                    <img src={Logout} alt="Logout" /> Cerrar Sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-linear-to-br from-(--primary-container) to-(--primary) text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">EMPEZAR</Link>
                        )}
                    </div>

                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-[#BEC8D2] hover:text-white transition-colors z-130 p-1 focus:outline-none cursor-pointer"
                    >
                        <img 
                            src={Menu} 
                            alt="Menu Icon" 
                            className={`w-8 h-8 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} 
                        />
                    </button>
                </div>
            </div>

            {/* MENÚ DESPLEGABLE MÓVIL - USANDO NAVLINK */}
            <div className={`
                md:hidden absolute top-20 left-0 w-full bg-[#0d0d12]/98 backdrop-blur-xl border-b border-white/10
                transition-all duration-300 ease-in-out origin-top z-110 shadow-2xl
                ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}
            `}>
                <ul className="flex flex-col p-8 gap-6 font-bold text-[12px] tracking-[0.2em] uppercase">
                    <li><NavLink className={mobileNavLinkStyles} to='/predict' onClick={() => setIsMenuOpen(false)}>Predecir</NavLink></li>
                    <li><NavLink className={mobileNavLinkStyles} to='/analysis' onClick={() => setIsMenuOpen(false)}>Análisis</NavLink></li>
                    <li><NavLink className={mobileNavLinkStyles} to='/models' onClick={() => setIsMenuOpen(false)}>Modelos</NavLink></li>
                    
                    {isAuthenticated ? (
                        <>
                            <li><NavLink className={mobileNavLinkStyles} to='/profile/my-predictions' onClick={() => setIsMenuOpen(false)}>Mis Predicciones</NavLink></li>
                            <li><NavLink className={({isActive}) => `block py-2 ${isActive ? 'text-(--primary-container)' : 'text-(--secondary)'}`} to='/profile' onClick={() => setIsMenuOpen(false)}>Mi Perfil</NavLink></li>
                            <li><button onClick={onLogout} className="text-red-400 font-bold uppercase tracking-widest text-left cursor-pointer">Cerrar Sesión</button></li>
                        </>
                    ) : (
                        <li><Link to="/login" className="block bg-(--primary-container) text-white text-center py-4 rounded-sm cursor-pointer" onClick={() => setIsMenuOpen(false)}>LOGIN / REGISTRO</Link></li>
                    )}
                </ul>
            </div>

            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-105 md:hidden backdrop-blur-sm" 
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    )
}