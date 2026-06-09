import Logo from '../assets/icons/logo.png'
import { NavLink, Link } from 'react-router-dom'
import Perfil from '../assets/icons/perfil.svg'
import { useState } from 'react'
import Swal from 'sweetalert2' 
import Person from '../assets/icons/person.svg'
import Logout from '../assets/icons/logout.svg'
import Menu from '../assets/icons/menu.svg'
import PrecisionManufacturing from '../assets/icons/precision_manufacturing.svg'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header({ isAuthenticated, currentUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Configuración técnica para integrar Swal con el diseño oscuro
    const swalConfig = {
        background: 'var(--surface-container, #171f33)',
        color: '#dae2fd',
        confirmButtonColor: '#ff5252', 
        cancelButtonColor: 'rgba(255, 255, 255, 0.05)',
        customClass: {
            popup: 'border border-white/10 rounded-sm font-mono text-xs shadow-2xl',
            title: 'text-base font-headline uppercase tracking-tight text-white font-bold border-b border-white/5 pb-2',
            htmlContainer: 'text-xs text-[#bec8d2]',
            confirmButton: 'text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-sm',
            cancelButton: 'text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-sm border border-white/10 text-white hover:bg-white/5 transition-colors'
        }
    };

    const confirmLogout = () => {
        setIsOpen(false); 
        setIsMenuOpen(false); 
        
        Swal.fire({
            ...swalConfig,
            title: 'Confirmar Desconexión',
            html: `
                <div style="font-family: monospace; text-align: left; margin: 8px 0; padding: 8px;">
                    <div style="background: rgba(0, 0, 0, 0.2); padding: 12px; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 4px;">
                        <p style="font-size: 11px; color: #bec8d2; margin: 0; line-height: 1.6;">
                            ¿Está seguro de que desea cerrar la sesión?
                        </p>
                    </div>
                </div>
            `,
            icon: 'warning',
            iconColor: '#ff5252',
            showCancelButton: true,
            confirmButtonText: 'CERRAR SESIÓN',
            cancelButtonText: 'CANCELAR',
            focusCancel: true,
            allowOutsideClick: false,
            allowEscapeKey: true
        }).then((result) => {
            if (result.isConfirmed) {
                onLogout(); 
            }
        });
    };

    // Estilos de navegación manteniendo tus proporciones exactas y el efecto de línea expansiva
    const navLinkStyles = ({ isActive }) => 
        `relative py-1 transition-colors before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:w-full before:h-[2px] before:bg-(--primary-container) before:scale-x-0 before:origin-right before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left ${
            isActive ? "text-(--primary-container) before:scale-x-100" : "hover:text-(--primary-container)"
        }`;

    const mobileNavLinkStyles = ({ isActive }) =>
        isActive
            ? "block py-2 border-b border-white/5 text-(--primary-container) pl-2 border-l-2 border-l-(--primary-container) bg-white/[0.02]"
            : "block py-2 border-b border-white/5 hover:text-(--primary-container) hover:pl-1 transition-all";

    return (
        <header className="sticky top-0 z-100 w-full border-b border-white/10 bg-(--surface)/80 backdrop-blur-md select-none">
            
            <div className="flex items-center justify-between py-4 px-4 md:px-10 h-20 relative z-120">
                
                {/* 01. Logo */}
                <div className='flex items-center'>
                    <Link to='/' className='flex items-center gap-3 group' onClick={() => setIsMenuOpen(false)}>
                        <div className="h-9 w-9 p-1 bg-(--primary-container)/20 border border-(--primary-container)/40 rounded-sm group-hover:border-(--primary-container)/80 transition-colors">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tighter text-white uppercase hidden sm:block">
                            Iberia Drive <span className="text-(--primary-container)">Insights</span>
                        </h1>
                    </Link>
                </div>

                {/* 02. Navegación Central (Desktop) */}
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
                                    className="flex items-center gap-3 focus:outline-none group cursor-pointer relative z-130 py-1 px-2 rounded-sm hover:bg-white/3 transition-colors"
                                >
                                    <div className="text-right hidden lg:block">
                                        <p className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider group-hover:text-white transition-colors">{currentUser.name}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full border-2 border-white/10 p-0.5 group-hover:border-(--primary-container) transition-all overflow-hidden bg-black/20">
                                        <img src={Perfil} alt="Perfil" className="h-full w-full object-cover rounded-full"/>
                                    </div>
                                </button>

                                {/* DESPLEGABLE DESKTOP CON MOTION */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <>
                                            <div className="fixed inset-0 z-125" onClick={() => setIsOpen(false)}></div>
                                            <motion.div 
                                                initial={{ opacity: 0, scaleY: 0.85, y: -5 }}
                                                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                                                exit={{ opacity: 0, scaleY: 0.9, y: -5 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute right-0 mt-4 w-52 bg-(--surface-low)/95 backdrop-blur-xl border border-white/10 shadow-2xl z-130 py-3 rounded-sm origin-top overflow-hidden"
                                            >
                                                {/* Esquinas estéticas cibernéticas */}
                                                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-(--primary-container)"></div>
                                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-(--primary-container)"></div>
                                                
                                                <div className="px-5 py-2 border-b border-white/5 mb-2 bg-black/10">
                                                    <p className="text-[9px] text-[#606070] font-bold tracking-widest uppercase">ID de Sistema</p>
                                                    <p className="text-xs text-white font-mono truncate">{currentUser.email || 'USR-404'}</p>
                                                </div>
                                                <ul className="space-y-0.5 font-bold text-[11px] uppercase tracking-wider">
                                                    <li>
                                                        <NavLink 
                                                            to="/profile" 
                                                            onClick={() => setIsOpen(false)} 
                                                            className={({isActive}) => `flex items-center gap-3 px-5 py-2.5 transition-colors group/item ${isActive ? 'text-white bg-white/5 border-l-2 border-(--primary-container)' : 'text-[#BEC8D2] hover:bg-white/5 hover:text-white'}`}
                                                        >
                                                            <img src={Person} alt="Person" className="w-3.5 h-3.5 opacity-70 group-hover/item:opacity-100 transition-opacity" /> Mi Perfil
                                                        </NavLink>
                                                    </li>
                                                    {isAuthenticated && currentUser.role === 1 && (
                                                        <li>
                                                            <NavLink 
                                                                to="/admin" 
                                                                onClick={() => setIsOpen(false)}
                                                                className={({isActive}) => `flex items-center gap-3 px-5 py-2.5 transition-colors group/item ${isActive ? 'text-white bg-white/5 border-l-2 border-(--primary-container)' : 'text-[#BEC8D2] hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                <img src={PrecisionManufacturing} alt="admin" className="w-3.5 h-3.5 opacity-70 group-hover/item:opacity-100 transition-opacity" /> Admin
                                                            </NavLink>
                                                        </li>
                                                    )}
                                                    <li className="mt-2 pt-2 border-t border-white/5 px-2">
                                                        <button onClick={confirmLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer group/btn">
                                                            <img src={Logout} alt="Logout" className="w-3.5 h-3.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" /> Cerrar Sesión
                                                        </button>
                                                    </li>
                                                </ul>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-linear-to-br from-(--primary-container) to-(--primary) text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]">EMPEZAR</Link>
                        )}
                    </div>

                    {/* Botón Hamburguesa */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-[#BEC8D2] hover:text-white transition-colors z-130 p-1 focus:outline-none cursor-pointer rounded-sm hover:bg-white/5"
                    >
                        <img 
                            src={Menu} 
                            alt="Menu Icon" 
                            className={`w-8 h-8 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-90 text-white' : 'rotate-0'}`} 
                        />
                    </button>
                </div>
            </div>

            {/* MENÚ DESPLEGABLE MÓVIL CON MOTION */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scaleY: 0.95 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="md:hidden absolute top-20 left-0 w-full bg-[#0d0d12]/98 backdrop-blur-xl border-b border-white/10 z-110 shadow-2xl origin-top"
                    >
                        <ul className="flex flex-col p-8 gap-6 font-bold text-[12px] tracking-[0.2em] uppercase">
                            <li><NavLink className={mobileNavLinkStyles} to='/predict' onClick={() => setIsMenuOpen(false)}>Predecir</NavLink></li>
                            <li><NavLink className={mobileNavLinkStyles} to='/analysis' onClick={() => setIsMenuOpen(false)}>Análisis</NavLink></li>
                            <li><NavLink className={mobileNavLinkStyles} to='/models' onClick={() => setIsMenuOpen(false)}>Modelos</NavLink></li>
                            
                            {isAuthenticated ? (
                                <>
                                    <li><NavLink className={mobileNavLinkStyles} to='/profile/my-predictions' onClick={() => setIsMenuOpen(false)}>Mis Predicciones</NavLink></li>
                                    <li><NavLink className={({isActive}) => `block py-2 ${isActive ? 'text-(--primary-container)' : 'text-(--on-surface-variant)'}`} to='/profile' onClick={() => setIsMenuOpen(false)}>Mi Perfil</NavLink></li>
                                    <li><button onClick={confirmLogout} className="text-red-400 font-bold uppercase tracking-widest text-left cursor-pointer w-full py-1 hover:text-red-300 transition-colors">Cerrar Sesión</button></li>
                                </>
                            ) : (
                                <li><Link to="/login" className="block bg-(--primary-container) text-white text-center py-4 rounded-sm cursor-pointer shadow-md hover:bg-(--primary-container)/90 transition-colors" onClick={() => setIsMenuOpen(false)}>LOGIN / REGISTRO</Link></li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Telón de fondo oscuro móvil */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-105 md:hidden backdrop-blur-sm" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </header>
    )
}