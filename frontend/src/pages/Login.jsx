import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Inyección para orquestación de movimiento
import { loginUser } from '../composables/auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Logo from '../assets/icons/logo.png'
import Lock from '../assets/icons/lock.svg'
import Email from '../assets/icons/alternate_email.svg'
import ArrowRight from '../assets/icons/arrow_right.svg'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variantes para animaciones secuenciales
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  const swalConfig = {
    background: 'var(--surface-container-low, #1e1e1e)',
    color: '#ffffff',
    confirmButtonColor: 'var(--primary-container, #004a77)',
    denyButtonColor: '#2a2a2a',
    customClass: {
      popup: 'border border-white/10 rounded-sm font-mono text-xs',
      title: 'text-base font-headline uppercase tracking-tight text-white font-bold',
      htmlContainer: 'text-xs text-(--on-surface-variant)',
      confirmButton: 'text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-sm',
      cancelButton: 'text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-sm'
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser(email, password);
      
      await Swal.fire({
        ...swalConfig,
        title: 'Acceso Correcto',
        text: 'Sincronizando entorno de usuario...',
        icon: 'success',
        iconColor: '#00e676',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        confirmButtonText: null
      });

      await onLoginSuccess(response.access_token);

    } catch (error) {
      console.log(error);
      
      Swal.fire({
        ...swalConfig,
        title: 'Fallo de Autenticación',
        text: error.response?.data?.detail || 'Los datos introducidos no coinciden con ningún registro del sistema.',
        icon: 'error',
        iconColor: '#ff5252'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center py-4 bg-(--surface) text-[#dae2fd] overflow-hidden">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40"></div>
      <div className="kinetic-radial pointer-events-none absolute inset-0 opacity-20"></div>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-120 px-6 py-2"
      >
        
        <motion.div variants={itemVariants} className="mb-4 flex flex-col items-start gap-3">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-(--primary-container)/20 p-1 border border-(--primary-container)/40 transition-transform group-hover:scale-105">
              <img src={Logo} alt="Logo" className="w-full h-full object-contain rounded" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase">
              Iberia Drive <span className="text-(--primary-container)">Insights</span>
            </span>
          </Link>
          <div className="h-0.5 w-12 bg-(--primary-container)"></div>
        </motion.div>

        <motion.div variants={itemVariants} className="login-card relative bg-(--surface-low) shadow-2xl border border-white/5">
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
                    disabled={isSubmitting}
                    placeholder="iberia@drive.com" 
                    className="w-full bg-black/20 border-b border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:border-(--primary-container) transition-all outline-none disabled:opacity-50" 
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
                    disabled={isSubmitting}
                    placeholder="••••••••••••" 
                    className="w-full bg-black/20 border-b border-white/10 pl-11 pr-4 py-3 text-sm text-white focus:border-(--primary-container) transition-all outline-none disabled:opacity-50" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary-engine w-full flex items-center justify-center gap-2 py-3.5 font-bold tracking-widest uppercase transition-all text-sm disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Procesando...' : 'Entrar'}</span>
                  {!isSubmitting && <img src={ArrowRight} alt="" className="w-4 h-4" />}
                </motion.button>
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
        </motion.div>
      </motion.main>
    </div>
  )
}