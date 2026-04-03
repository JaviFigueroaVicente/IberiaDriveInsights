import Logo from '../assets/icons/logo.png'
import { Link } from 'react-router-dom'
import '../styles/header.css'
import Perfil from '../assets/icons/perfil.svg'
import { useState } from 'react'

export default function Header({isAuthenticated, currentUser, onLogout}){
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <header className="flex justify-between border-b border-white/20 py-4 px-3 md:px-6">
            <div className='flex items-center pl-3'>
                <Link to='/' className='flex justify-center items-center '>
                    <img src={Logo} alt="" className="logo w-10 h-10 rounded"/>
                    <h1 className="pl-2 text-l bold">IBERIA DRIVE <span className="text-[#0EA5E9]">INSIGHTS</span></h1>
                </Link>
            </div>
            <nav className="relative flex items-center">
                <div className="md:hidden flex justify-end p-4">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#BEC8D2] focus:outline-none"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
                <ul className={`
                    md:flex md:flex-row md:items-center md:gap-8 md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none
                    ${isMenuOpen ? 'flex' : 'hidden'} 
                    flex-col absolute top-full left-0 w-100 bg-[#111116] p-6 gap-6 z-50
                    font-bold text-space tracking-widest navegador
                `}>
                    <li><Link className='link block' to='/predict' onClick={() => setIsMenuOpen(false)}>Predecir</Link></li>
                    <li><Link className='link block' to='/' onClick={() => setIsMenuOpen(false)}>Análisis</Link></li>
                    <li><Link className='link block' to='/' onClick={() => setIsMenuOpen(false)}>Modelo</Link></li>
                    
                    {isAuthenticated && currentUser && (
                        <li><Link className='link block' to='/' onClick={() => setIsMenuOpen(false)}>Mis Predicciones</Link></li>
                    )}
                </ul>
            </nav>
            <ul className='flex items-center gap-2 pr-3'>
                <li className='mr-4 font-bold activo flex items-center'><span className='pr-2'>•</span> SERVICIO ACTIVO</li>
                <li className="relative list-none">
                    {isAuthenticated && currentUser ? (
                        <>
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center focus:outline-none active:scale-95 foto-perfil"
                            >
                                <img src={Perfil} alt="Perfil" className="h-10 w-10 "/>
                            </button>
                            {isOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>                                    
                                    <ul className="absolute right-0 mt-3 w-48 bg-[#111116] border border-white/10 rounded shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2">
                                        <li className="px-4 py-2 border-b border-white/5 mb-2">
                                            <p className="text-[10px] text-[#606070] font-bold">USUARIO</p>
                                            <p className="text-sm text-white truncate">{currentUser.name}</p>
                                        </li>
                                        
                                        <li>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-[#BEC8D2] hover:bg-white/5 hover:text-white transition-colors">
                                                Mi Perfil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" className="block px-4 py-2 text-sm text-[#BEC8D2] hover:bg-white/5 hover:text-white transition-colors">
                                                Configuración
                                            </Link>
                                        </li>
                                        <li>
                                        </li>
                                        {currentUser.role == '1' && (
                                            <li>
                                                <Link to="/admin" className="block px-4 py-2 text-sm text-[#BEC8D2] hover:bg-white/5 hover:text-white transition-colors">
                                                    Admin Panel
                                                </Link>
                                            </li>
                                        )}
                                        <li className="mt-2 pt-2 border-t border-white/5">
                                            <button 
                                                onClick={onLogout}
                                                className="w-full text-left px-4 py-2 text-sm logout"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="px-6 py-2 font-bold">
                                EMPEZAR
                            </button>
                        </Link>
                    )}
                </li>
            </ul>
        </header>
    )
}