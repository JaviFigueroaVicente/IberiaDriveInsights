import { useState } from 'react'
import { loginUser } from '../composables/auth'
import { Link } from 'react-router-dom'
import Logo from '../assets/icons/logo.png'
import Lock from '../assets/icons/lock.svg'
import Email from '../assets/icons/alternate_email.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      await onLoginSuccess(response.access_token);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center py-4 bg-(--surface) text-[#dae2fd] overflow-hidden">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"></div>
      <div className="kinetic-radial pointer-events-none absolute inset-0 opacity-20"></div>

      <main className="z-10 w-full max-w-120 px-6 py-2">
        
        <div className="mb-4 flex flex-col items-start gap-3">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-(--primary-container)/20 p-1 border border-(--primary-container)/40 transition-transform group-hover:scale-105">
              <img src={Logo} alt="Logo" className="w-full h-full object-contain rounded" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase">
              Iberia Drive <span className="text-(--primary-container)">Insights</span>
            </span>
          </Link>
          <div className="h-0.5 w-12 bg-(--primary-container)"></div>
        </div>

        <div className="login-card relative bg-(--surface-low) shadow-2xl border border-white/5">
          <div className="absolute -top-1 -left-1 h-6 w-6 border-t-2 border-l-2 border-(--primary-container)/40"></div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-(--secondary)/40"></div>

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
                Autenticación
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-semibold tracking-widest text-[#bec8d2] uppercase" htmlFor="email">
                  Dirección E-mail
                </label>
                <div className="form-input relative">
                  <img src={Email} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-60" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="iberia@drive.com" 
                    className="w-full bg-black/20 border-b border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:border-(--primary-container) transition-all outline-none" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-end">
                  <label className="block text-[9px] font-semibold tracking-widest text-[#bec8d2] uppercase" htmlFor="password">
                    Contraseña
                  </label>
                  <Link to='' className="text-[9px] font-bold tracking-wider text-(--secondary) uppercase hover:text-(--primary) transition-colors">
                    ¿Olvidaste?
                  </Link>
                </div>
                <div className="form-input relative">
                  <img src={Lock} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-60" />
                  <input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="w-full bg-black/20 border-b border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:border-(--primary-container) transition-all outline-none" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary-engine w-full flex items-center justify-center gap-2 py-3.5 font-bold tracking-widest uppercase transition-all text-sm">
                  <span>Entrar</span>
                  <img src={ArrowRight} alt="" className="w-4 h-4" />
                </button>
              </div>
            </form>

            <p className="flex justify-center text-[10px] mt-6 text-[#bec8d2]">
              ¿No tienes cuenta?
              <Link to={'/register'} className="pl-2 font-bold text-(--secondary) hover:text-(--primary) transition-colors">
                Regístrate
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-between bg-black/20 px-8 py-3 border-t border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[7px] text-[#bec8d2] uppercase tracking-tighter">Estado</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--secondary) animate-pulse"></span>
                  <span className="text-[8px] font-bold tracking-widest text-(--secondary) uppercase">Activo</span>
                </div>
              </div>
              <div className="flex flex-col border-l border-[#3e4850]/30 pl-6">
                <span className="text-[7px] text-[#bec8d2] uppercase tracking-tighter">Encriptado</span>
                <span className="text-[8px] font-bold text-white uppercase">AES-256</span>
              </div>
            </div>
            <span className="text-[7px] text-[#bec8d2]/30 uppercase tracking-widest">© 2026 IDI</span>
          </div>
        </div>
      </main>
    </div>
  )
}