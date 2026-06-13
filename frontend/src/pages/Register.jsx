import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import FotoRegister from '../assets/register/chip-register.png'
import Logo from '../assets/icons/logo.png'
import Analytics from '../assets/icons/analytics.svg'
import VerifiedUser from '../assets/icons/verified_user.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'
import { registerUser } from '../composables/auth'
import { Background } from '../components/Background'

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
    };

    const swalConfig = {
        background: 'var(--surface-container, #171f33)', 
        color: 'var(--on-surface, #dae2fd)',
        confirmButtonColor: 'transparent', 
        customClass: {
            popup: 'border border-white/5 rounded-sm font-body text-xs shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] blueprint-grid-dots',
            title: 'text-base font-headline uppercase tracking-[0.2em] text-white font-bold pt-6',
            htmlContainer: 'text-xs text-[var(--on-surface-variant,#bec8d2)] font-light px-2',
            confirmButton: 'px-8 py-3 text-[10px] font-bold transition-all uppercase tracking-[0.2em] cursor-pointer active:scale-[0.98] flex items-center justify-center rounded-sm min-w-40 outline-none focus:outline-none focus:ring-0',
        },
        buttonsStyling: false
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (formData.email !== formData.confirmEmail) {
            Swal.fire({
                ...swalConfig,
                title: 'Error de Confirmación',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-3 md:py-3`
                },
                text: 'La confirmación no coincide con el correo electrónico introducido.',
                icon: 'error',
                iconColor: '#ff5252',
                confirmButtonText: 'REINTENTAR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                ...swalConfig,
                title: 'Error de Contraseña',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-3 md:py-3`
                },
                text: 'La confirmación no coincide con la contraseña introducida.',
                icon: 'error',
                iconColor: '#ff5252',
                confirmButtonText: 'REINTENTAR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
            return;
        }

        if (formData.password.length < 8) {
            Swal.fire({
                ...swalConfig,
                title: 'Seguridad Insuficiente',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20 py-3 md:py-3`
                },
                text: 'La longitud de la clave debe ser igual o superior a 8 caracteres.',
                icon: 'warning',
                iconColor: '#ffd700',
                confirmButtonText: 'CORREGIR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await registerUser(formData);

            await Swal.fire({
                ...swalConfig,
                title: 'Registro Completado',
                text: 'Redirigiendo a inicio de sesión...',
                icon: 'success',
                iconColor: 'var(--secondary, #5de6ff)',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            navigate('/login');
        } catch (error) {
            console.error("Error en el despliegue del registro:", error);
            
            Swal.fire({
                ...swalConfig,
                title: 'Fallo de Registro',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-3 md:py-3`
                },
                text: error.response?.data?.detail || 'El servidor rechazó los datos de la cuenta o el email ya está en uso.',
                icon: 'error',
                iconColor: '#ff5252',
                confirmButtonText: 'REINTENTAR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex min-h-screen items-center justify-center bg-(--surface) text-[#dae2fd] overflow-hidden py-4 px-4 md:px-8"
        >
            <Background />
            <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"></div>
            <div className="kinetic-radial pointer-events-none absolute inset-0 opacity-20"></div>

            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 w-full max-w-260 grid grid-cols-1 lg:grid-cols-2 shadow-2xl bg-(--surface-low) border border-white/5 relative overflow-hidden"
            >
                
                <div className="absolute -top-1 -left-1 h-8 w-8 border-t-2 border-l-2 border-(--primary-container)/40 z-30"></div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-2 border-r-2 border-(--secondary)/40 z-30"></div>

                <div className="hidden lg:flex flex-col justify-between p-10 relative border-r border-white/5 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img src={FotoRegister} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                    
                    <div className="relative z-20">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <div className="h-9 w-9 p-1 bg-(--primary-container)/20 border border-(--primary-container)/40 rounded-sm group-hover:scale-105 transition-transform">
                                <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-lg font-bold tracking-tighter text-white uppercase">
                                Iberia Drive <span className="text-(--primary-container)">Insights</span>
                            </h1>
                        </Link>

                        <div className="space-y-4 mt-8">
                            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white uppercase">
                                Precisión <br />
                                <span className="text-(--primary-container)">Automoción</span>
                            </h2>
                            <p className="max-w-xs text-xs font-light leading-relaxed text-[#bec8d2] opacity-70">
                                Modelos ML entrenados con datos del mercado ibérico.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-20 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-sm border border-white/10">
                                <img src={Analytics} className="w-4 h-4 opacity-80" alt="" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]">Motor de Datos</p>
                                <p className="text-xs text-white">V1.0 ML Models</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="bg-(--surface-container) p-6 md:p-10 lg:p-12 flex flex-col justify-center relative">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1 tracking-tight uppercase">Crear Cuenta</h3>
                    </div>

                    {/* Aviso de entorno de pruebas / portfolio */}
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm font-mono text-[10px] text-yellow-200/80 leading-normal uppercase tracking-wider">
                        <span className="font-bold text-yellow-400">[ ENTORNO DE DEMOSTRACIÓN ]</span><br />
                        Esta web es un proyecto de portfolio. Puede utilizar correos ficticios (ej: usuario@test.com). Los datos recopilados no se utilizarán para ningún tipo de estudio, análisis o explotación comercial.
                    </div>
                    {/* Formulario de Registro */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Nombre</label>
                                <input 
                                    className="input-data-entry w-full py-2.5 text-sm disabled:opacity-50" 
                                    placeholder="Iberia" 
                                    type="text" 
                                    name='name' 
                                    disabled={isSubmitting}
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Apellidos</label>
                                <input 
                                    className="input-data-entry w-full py-2.5 text-sm disabled:opacity-50" 
                                    placeholder="Drive Insights" 
                                    type="text" 
                                    name='surname' 
                                    disabled={isSubmitting}
                                    value={formData.surname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Email</label>
                                <input 
                                    className="input-data-entry w-full py-2.5 text-sm disabled:opacity-50" 
                                    placeholder="iberia@drive.com" 
                                    type="email" 
                                    name='email' 
                                    disabled={isSubmitting}
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Confirmar Email</label>
                                <input 
                                    className={`input-data-entry w-full py-2.5 text-sm disabled:opacity-50 ${
                                        formData.confirmEmail && formData.email !== formData.confirmEmail 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : ''
                                    }`} 
                                    placeholder="iberia@drive.com" 
                                    type="email" 
                                    name='confirmEmail' 
                                    disabled={isSubmitting}
                                    value={formData.confirmEmail} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Contraseña</label>
                                <input 
                                    className="input-data-entry w-full py-2.5 text-sm disabled:opacity-50" 
                                    placeholder="••••••••" 
                                    type="password" 
                                    name='password' 
                                    disabled={isSubmitting}
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#bec8d2]/60">Confirmar Contraseña</label>
                                <input 
                                    className={`input-data-entry w-full py-2.5 text-sm disabled:opacity-50 ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                                        ? 'border-red-500/50 focus:border-red-500' 
                                        : ''
                                    }`} 
                                    placeholder="••••••••" 
                                    type="password" 
                                    name='confirmPassword' 
                                    disabled={isSubmitting}
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-1">
                            <input 
                                className="w-3.5 h-3.5 rounded-sm bg-black/40 border-white/10 text-(--primary-container) focus:ring-0 cursor-pointer disabled:opacity-50" 
                                id="terms" 
                                type="checkbox" 
                                disabled={isSubmitting}
                                required 
                            />
                            <label className="text-[10px] text-[#bec8d2]/80 leading-tight" htmlFor="terms">
                                Acepto los <Link to="/" className="text-(--secondary) hover:text-(--primary-container) font-bold transition-colors">Términos y Condiciones</Link> del motor predictivo.
                            </label>
                        </div>

                        <div className="pt-2">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary-engine w-full py-3.5 flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer" 
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span className="font-bold tracking-[0.2em] text-[10px]">
                                    {isSubmitting ? 'PROCESANDO REGISTRO...' : 'REGISTRAR CUENTA'}
                                </span>
                                {!isSubmitting && <img src={ArrowRight} alt="" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </motion.button>
                        </div>

                        <div className="text-center pt-4 border-t border-white/5">
                            <p className="text-[10px] text-[#bec8d2] tracking-wider">
                                ¿Ya tienes cuenta? 
                                <Link className="font-bold ml-2 text-(--secondary) hover:text-white transition-colors" to="/login">Inicia Sesión</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </motion.main>
        </motion.div>
    )
}