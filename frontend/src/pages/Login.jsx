import { useState } from 'react'
import { loginUser } from '../composables/auth'
import { Link } from 'react-router-dom'
import Logo from '../assets/icons/logo.png'
import Lock from '../assets/icons/lock.svg'
import Email from '../assets/icons/alternate_email.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'
import '../styles/login.css'


export default function Login({onLoginSuccess}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await loginUser(email, password);
            // console.log(response);
            await onLoginSuccess(response.access_token)
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="blueprint-grid"></div>
            <div className="kinetic-radial"></div>
            <section className="flex flex-col items-center justify-center align-middle relative min-h-screen">
                <div className="flex flex-col items-start">
                    <div className="mb-4 pl-2">
                        <Link to='/' className='flex justify-center items-center '>
                            <img src={Logo} alt="" className="logo w-14 h-14 rounded"/>
                            <h1 className="pl-4 text-l bold">IBERIA DRIVE <span className="text-[#0EA5E9]">INSIGHTS</span></h1>
                        </Link>
                    </div>
                    <div className="login-card">
                        <div className="flex flex-col p-10 md:p-12 align-middle">
                            <h2 className="text-3xl mb-8">INICIO DE SESIÓN</h2>
                            <form onSubmit={handleLogin} className="flex flex-col space-y-6">
                                <div className="space-y-2">
                                    <label className="block font-label text-[10px] font-semibold" htmlFor="email">DIRECCIÓN E-MAIL</label>
                                    <div className="form-input relative">
                                        <img src={Email} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"/>
                                        <input id="email" type="email" placeholder="Email" className="w-full border-none pl-11 pr-4 py-4 transition-all border-b-2 border-transparent" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <div className="flex justify-between">
                                        <label className="block font-label text-[10px] font-semibold" htmlFor="password">CONTRASEÑA</label>
                                        <label className='contra-olvidada block font-label text-[10px] font-semibold'><Link to=''>¿OLVIDASTE TU CONTRASEÑA?</Link></label>
                                    </div>
                                    <div className="form-input relative">
                                        <img src={Lock} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"/>
                                        <input id="password" type="password" placeholder="•••••••" className="w-full border-none pl-11 pr-4 py-4 border-b-2 border-transparent" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                    </div>
                                </div>
                                <button type="submit" className="flex text-center items-center justify-center font-bold py-3 mt-2">
                                    <span>ENTRAR</span> 
                                    <img src={ArrowRight} alt="" className="w-7 h-7 pl-1"/>
                                </button>
                            </form>
                            <p className="flex justify-center text-[11px] mt-7">¿No tienes una cuenta?<Link to={'/register'} className='link pl-2'>Regístrate aquí</Link></p>
                        </div>
                        <div className="login-card-bottom flex flex-col mt p-6 md:p-7 align-middle">
                            <p className="flex justify-end text-[11px] mr-3"><span className='pr-1 activo'>•</span>  SERVICIO ACTIVO</p>
                        </div>
                    </div>
                </div>
                <div className="derechos flex justify-center text-[9px] mt-7">
                    <p>© 2026 IBERIA DRIVE INSIGHTS. TODOS LOS DERECHOS RESERVADOS</p>
                </div>
            </section>
        </div>
    )
}