import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import '../styles/register.css'
import FotoRegister from '../assets/register/chip-register.png'
import Logo from '../assets/icons/logo.png'
import Analytics from '../assets/icons/analytics.svg'
import VerifiedUser from '../assets/icons/verified_user.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'
import { registerUser } from '../composables/auth'

export default function Register(){
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
        try{
            const response = await registerUser(formData);
            // console.log(response);
            navigate('/login')
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className='min-h-screen flex items-center'>
            <div className="kinetic-radial"></div>
            <div className="blueprint-grid"></div>
            <section className='register relative p-6 md:p12 w-full '>
                <div className='register-card flex align-middle items-center flex-col md:flex-row w-full md:w-8/10'>
                    <div className='card-left flex-col justify-between p-8 relative border-white/5 w-full md:w-1/2'>
                        <div className="relative z-20">
                            <div className='flex items-center'>
                                <img src={Logo} alt="" className="w-12 h-12 rounded"/>
                                <h1 className="pl-4 text-l bold">IBERIA DRIVE <span>INSIGHTS</span></h1>
                            </div>
                        </div>
                        <div className="space-y-8 relative mt-12 z-20">
                            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight">Precisión<br/>
                                <span className="text-primary">Automoción</span> <br/>Inteligencia Artificial
                            </h2>
                            <p className="max-w-sm font-light leading-relaxed">
                                Acceso en tiempo real a un modelo de valoración ML entrenado con datos reales del mercado del sector automotriz.
                            </p>
                        </div>
                        <div className="relative z-20 flex flex-col gap-6 mt-12">
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-sm border border-white/5">
                                    <img src={Analytics}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-label font-bold tracking-widest">MOTOR DE DATOS</p>
                                    <p className="text-sm">Monitorización en Vivo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/5">
                                    <img src={VerifiedUser} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-label font-bold tracking-widest">PROTOCOLO DE SEGURIDAD</p>
                                    <p className="text-sm">Protección de Datos HS-256</p>
                                </div>
                            </div>       
                        </div>
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                            <img className="w-full h-full object-cover" data-alt="" src={FotoRegister}/>
                        </div>
                    </div>
                    <div className='card-right w-full md:w-1/2'>
                        <div className="bg-surface-container p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold mb-2 tracking-tight">Crear Cuenta</h3>
                            </div>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="name">NOMBRE</label>
                                        <input className="w-full text-sm p-4" id="name" placeholder="Iberia" type="text" name='name' value={formData.name} onChange={handleChange}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="surname">APELLIDOS</label>
                                        <input className="w-full text-sm p-4" id="surname" placeholder="Drive Insights" type="text" name='surname' value={formData.surname} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="email">DIRECCIÓN E-MAIIL</label>
                                        <input className="w-full text-sm p-4" id="email" placeholder="iberia@drive.com" type="email" name='email' value={formData.email} onChange={handleChange}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="confirm_email">CONFIRMAR DIRECCIÓN E-MAIL</label>
                                        <input className="w-full text-sm p-4" id="confirm_email" placeholder="iberia@drive.com" type="email" name='confirmEmail' value={formData.confirmEmail} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="password">CONTRASEÑA</label>
                                        <input className="w-full text-sm p-4" id="password" placeholder="••••••••" type="password" name='password' value={formData.password} onChange={handleChange}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold" htmlFor="confirm_password">CONFIRMAR CONTRASEÑA</label>
                                        <input className="w-full text-sm p-4" id="confirm_password" placeholder="••••••••" type="password" name='confirmPassword' value={formData.confirmPassword} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 py-2">
                                    <div className="flex items-center h-5">
                                        <input className="w-4 h-4 rounded-sm cursor-pointer" id="terms" type="checkbox"/>
                                    </div>
                                    <label className="text-xs" htmlFor="terms">
                                        Tengo conocimiento del protocolo de procesamiento de datos y <Link to="/">Acepto los Términos y Condiciones</Link> del servicio de Motor de Datos.
                                    </label>
                                </div>
                                <div className="pt-2">
                                    <button className="w-full font-bold py-3 rounded-sm active:scale-[0.98] tracking-widest text-xs flex items-center justify-center gap-3 group" type="submit">
                                        CREAR CUENTA
                                        <img src={ArrowRight} alt="" />
                                    </button>
                                </div>
                                <div className="text-center pt-6 border-t pb-4 border-white/5">
                                    <p className="text-xs text-on-surface-variant">
                                        ¿Ya tienes una cuenta? 
                                        <Link className="font-bold ml-1 tracking-wider" to="/login">Inicia Sesión</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}