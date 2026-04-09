import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FotoRegister from '../assets/register/chip-register.png'
import Logo from '../assets/icons/logo.png'
import Analytics from '../assets/icons/analytics.svg'
import VerifiedUser from '../assets/icons/verified_user.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'
import { registerUser } from '../composables/auth'

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            navigate('/login')
        } catch (error) {
            console.error("Error en el despliegue del registro:", error);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-(--surface) font-['Inter'] text-[#dae2fd] overflow-hidden p-4 md:p-8">
            {/* Elementos de fondo */}
            <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"></div>
            <div className="kinetic-radial pointer-events-none absolute inset-0 opacity-20"></div>

            <main className="z-10 w-full max-w-275 grid grid-cols-1 lg:grid-cols-2 shadow-2xl bg-(--surface-low) border border-white/5 relative overflow-hidden">
                
                {/* ESQUINAS DECORATIVAS DEL CONTENEDOR PRINCIPAL */}
                <div className="absolute -top-1 -left-1 h-12 w-12 border-t-2 border-l-2 border-(--primary-container)/40 z-30"></div>
                <div className="absolute -bottom-1 -right-1 h-12 w-12 border-b-2 border-r-2 border-(--secondary)/40 z-30"></div>

                {/* --- Lado Visual (Branding) --- */}
                <div className="hidden lg:flex flex-col justify-between p-12 relative border-r border-white/5 overflow-hidden">
                    {/* Imagen de fondo del panel izquierdo */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <img src={FotoRegister} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                    
                    <div className="relative z-20">
                        <Link to="/" className="flex items-center gap-4 mb-16 group">
                            <div className="h-10 w-10 p-1 bg-(--primary-container)/20 border border-(--primary-container)/40 rounded-sm group-hover:scale-105 transition-transform">
                                <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tighter text-white uppercase">
                                Iberia Drive <span className="text-(--primary-container)">Insights</span>
                            </h1>
                        </Link>

                        <div className="space-y-6 mt-12">
                            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-white uppercase">
                                Precisión <br />
                                <span className="text-(--primary-container)">Automoción</span> <br />
                                IA Predictiva.
                            </h2>
                            <p className="max-w-sm font-light leading-relaxed text-[#bec8d2] opacity-80">
                                Acceso en tiempo real a modelos ML entrenados con datos reales del mercado automotriz ibérico.
                            </p>
                        </div>
                    </div>

                    {/* Indicadores técnicos */}
                    <div className="relative z-20 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-sm border border-white/10 shadow-inner">
                                <img src={Analytics} className="w-5 h-5 opacity-80" alt="" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]">Motor de Datos</p>
                                <p className="text-sm text-white">V1.0 Modelos de ML</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-sm border border-white/10 shadow-inner">
                                <img src={VerifiedUser} className="w-5 h-5 opacity-80" alt="" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]">Cifrado Neural</p>
                                <p className="text-sm text-white">Protección HS-256</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Lado del Formulario --- */}
                <div className="bg-(--surface-container) p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">Crear Cuenta</h3>
                        <p className="text-sm text-[#bec8d2]/70">Despliegue su terminal de diagnóstico personalizado.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Nombre</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="Iberia" 
                                    type="text" 
                                    name='name' 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Apellidos</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="Drive Insights" 
                                    type="text" 
                                    name='surname' 
                                    value={formData.surname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Email Address</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="iberia@drive.com" 
                                    type="email" 
                                    name='email' 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Confirmar Email</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="iberia@drive.com" 
                                    type="email" 
                                    name='confirmEmail' 
                                    value={formData.confirmEmail} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Contraseña</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="••••••••" 
                                    type="password" 
                                    name='password' 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Confirmar Contraseña</label>
                                <input 
                                    className="input-data-entry w-full" 
                                    placeholder="••••••••" 
                                    type="password" 
                                    name='confirmPassword' 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input 
                                className="mt-1 w-4 h-4 rounded-sm bg-black/40 border-white/10 text-(--primary-container) focus:ring-0 cursor-pointer" 
                                id="terms" 
                                type="checkbox" 
                                required 
                            />
                            <label className="text-xs text-[#bec8d2]/80 leading-normal" htmlFor="terms">
                                Acepto los <Link to="/" className="text-(--secondary) hover:text-(--primary-container) font-bold transition-colors">Términos y Condiciones</Link> de procesamiento de datos del motor predictivo.
                            </label>
                        </div>

                        <div className="pt-2">
                            <button className="btn-primary-engine w-full py-4 flex items-center justify-center gap-3 group" type="submit">
                                <span className="font-bold tracking-[0.2em] text-xs">REGISTRAR CUENTA</span>
                                <img src={ArrowRight} alt="" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t border-white/5">
                            <p className="text-xs text-[#bec8d2]">
                                ¿YA TIENES UNA CUENTA? 
                                <Link className="font-bold ml-2 text-(--secondary) hover:text-white transition-colors uppercase tracking-widest" to="/login">Inicia Sesión</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}