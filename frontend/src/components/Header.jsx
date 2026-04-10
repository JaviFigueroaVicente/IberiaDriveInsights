import Logo from '../assets/icons/logo.png'
import { Link } from 'react-router-dom'
import Perfil from '../assets/icons/perfil.svg'
import { useState } from 'react'
import Person from '../assets/icons/person.svg'
import Logout from '../assets/icons/logout.svg'
import Terminal from '../assets/icons/terminal.svg'
import Settings from '../assets/icons/settings.svg'

export default function Header({ isAuthenticated, currentUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-(--surface)/80 backdrop-blur-md py-4 px-4 md:px-10">
            {/* Sección Logo */}
            <div className='flex items-center'>
                <Link to='/' className='flex items-center gap-3 group'>
                    <div className="h-9 w-9 p-1 bg-(--primary-container)/20 border border-(--primary-container)/40 rounded-sm transition-transform group-hover:scale-105">
                        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="hidden sm:block text-lg font-bold tracking-tighter text-white uppercase">
                        Iberia Drive <span className="text-(--primary-container)">Insights</span>
                    </h1>
                </Link>
            </div>

            {/* Navegación Central */}
            <nav className="flex items-center">
                {/* Botón Hamburguesa Móvil */}
                <div className="md:hidden flex justify-end">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#BEC8D2] hover:text-white transition-colors focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Lista de Enlaces */}
                <ul className={`
                    md:flex md:flex-row md:items-center md:gap-8 md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none
                    ${isMenuOpen ? 'flex' : 'hidden'} 
                    flex-col absolute top-full left-0 w-full p-8 gap-6 z-50
                    font-bold text-[11px] tracking-[0.2em] uppercase
                `}>
                    <li><Link className='hover:text-(--primary-container) transition-colors' to='/predict' onClick={() => setIsMenuOpen(false)}>Predecir</Link></li>
                    <li><Link className='hover:text-(--primary-container) transition-colors' to='/analysis' onClick={() => setIsMenuOpen(false)}>Análisis</Link></li>
                    <li><Link className='hover:text-(--primary-container) transition-colors' to='/models' onClick={() => setIsMenuOpen(false)}>Modelos</Link></li>
                    
                    {isAuthenticated && currentUser && (
                        <li><Link className='hover:text-(--primary-container) transition-colors' to='/profile/my-predictions' onClick={() => setIsMenuOpen(false)}>Mis Predicciones</Link></li>
                    )}
                </ul>
            </nav>

            {/* Sección Usuario / Status */}
            <div className='flex items-center gap-6'>
                {/* Status Indicator (Oculto en móvil pequeño) */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-black/20 border border-white/5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--secondary) animate-pulse"></span>
                    <span className="text-[9px] font-bold tracking-widest text-[#bec8d2] uppercase">Servicio Activo</span>
                </div>

                <div className="relative">
                    {isAuthenticated && currentUser ? (
                        <>
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-3 focus:outline-none group"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider">{currentUser.name}</p>
                                    <p className="text-[8px] text-(--primary-container) font-mono uppercase">Operator</p>
                                </div>
                                <div className="h-10 w-10 rounded-full border-2 border-white/10 p-0.5 group-hover:border-(--primary-container) transition-all">
                                    <img src={Perfil} alt="Perfil" className="h-full w-full rounded-full bg-surface-low"/>
                                </div>
                            </button>

                            {/* Dropdown del Perfil */}
                            {isOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>                                    
                                    <ul className="absolute right-0 mt-4 w-52 bg-[#0d0d12] border border-white/10 shadow-2xl z-20 py-3 animate-in fade-in zoom-in-95 duration-200">
                                        {/* Esquinas decorativas en el dropdown */}
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-(--primary-container)/40"></div>
                                        
                                        <li className="px-5 py-3 border-b border-white/5 mb-2">
                                            <p className="text-[9px] text-[#606070] font-bold tracking-widest uppercase">ID de Sistema</p>
                                            <p className="text-xs text-white font-mono truncate">{currentUser.email || 'USR-404'}</p>
                                        </li>
                                        
                                        <li>
                                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-[#BEC8D2] hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider">
                                                <img src={Person} alt="Person" /> Mi Perfil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-[#BEC8D2] hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider">
                                                <img src={Settings} alt="Settings" /> Configuración
                                            </Link>
                                        </li>
                                        
                                        {currentUser.role == '1' && (
                                            <li>
                                                <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-(--secondary) hover:bg-(--secondary)/10 transition-colors uppercase tracking-wider">
                                                    <img src={Terminal} alt="Terminal" /> Admin Panel
                                                </Link>
                                            </li>
                                        )}
                                        
                                        <li className="mt-2 pt-2 border-t border-white/5 px-2">
                                            <button 
                                                onClick={() => { onLogout(); setIsOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded transition-all uppercase tracking-wider"
                                            >
                                                <img src={Logout} alt="Logout" /> Cerrar Sesión
                                            </button>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="btn-primary-engine h-10 px-6 text-[11px] font-bold tracking-[0.2em] uppercase">
                                EMPEZAR
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}