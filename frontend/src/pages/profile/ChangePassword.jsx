import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Exclamation from '../../assets/icons/exclamation.svg';
import ShieldLock from '../../assets/icons/shield_lock.svg';
import Sync from '../../assets/icons/sync.svg';
import SideBar from '../../components/SideBar';
import SubHeaderProfile from '../../components/SubHeaderProfile';

// Importa el servicio correspondiente para la actualización de contraseñas
import { changePassword } from '../../composables/auth';

export default function ChangePassword({ currentUser, handleLogout }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSyncing, setIsSyncing] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsSyncing(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Configuración visual común para los modales de Swal (estética oscura e industrial)
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

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, newPassword: value }));
        setStrength(Math.min(value.length * 10, 100));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) return;

        // Validación de coincidencia de contraseñas mediante SweetAlert2
        if (formData.newPassword !== formData.confirmPassword) {
            Swal.fire({
                ...swalConfig,
                title: 'Error de Protocolo',
                text: 'La confirmación no coincide con la nueva contraseña introducida.',
                icon: 'error',
                iconColor: '#ff5252'
            });
            return;
        }

        // Validación de longitud mínima o reglas de seguridad adicionales si se requiere
        if (formData.newPassword.length < 8) {
            Swal.fire({
                ...swalConfig,
                title: 'Seguridad Insuficiente',
                text: 'La nueva contraseña debe contener un mínimo de 8 caracteres.',
                icon: 'warning',
                iconColor: '#ffd700'
            });
            return;
        }

        // Confirmación explícita previa a la alteración de credenciales
        const result = await Swal.fire({
            ...swalConfig,
            title: '¿Modificar Contraseña?',
            text: 'Esta acción cambiará tu contraseña.',
            icon: 'question',
            iconColor: 'var(--secondary, #5de6ff)',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#3a3a3a'
        });

        if (!result.isConfirmed) return;

        setIsUpdating(true);
        try {
            // Envío de las credenciales estructuradas al servicio del backend
            await changePassword({
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            });

            // Muestra el modal auto-cerrable sobreescribiendo el config global
            await Swal.fire({
                ...swalConfig,
                title: 'Contraseña Actualizada',
                text: 'La contraseña ha sido actualizada con exito.',
                icon: 'success',
                iconColor: '#00e676',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                confirmButtonText: null
            });

            // Limpieza del formulario tras la expiración del temporizador del Swal
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setStrength(0);
            
            // Redirección segura a la raíz del sitio
            window.location.href = '/profile';

        } catch (error) {
            console.error("Error al actualizar contraseñas:", error);
            Swal.fire({
                ...swalConfig,
                title: 'Fallo de Autenticación',
                text: error.response?.data?.detail || 'La contraseña actual no es válida o el servidor rechazó los parámetros.',
                icon: 'error',
                iconColor: '#ff5252'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-(--surface) text-(--on-surface) selection:bg-(--primary-container) selection:text-white">
            <SideBar currentUser={currentUser} onLogout={handleLogout}/>
            
            <main className="flex-1 flex flex-col w-full overflow-x-hidden">
                <SubHeaderProfile />

                {/* Padding dinámico: p-6 en móvil, p-12 en desktop */}
                <div className="p-6 md:p-12 max-w-6xl mx-auto w-full space-y-8 md:space-y-12 relative">
                    
                    {/* Efecto de luz de fondo: oculto o reducido en móvil para rendimiento */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-150 h-64 md:h-150 bg-(--secondary) opacity-[0.03] blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
                        
                        {/* 02. Security Card Container */}
                        <div className="lg:col-span-7 xl:col-span-8 order-1">
                            <div className="bg-(--surface-low) relative rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                                <div className="absolute top-0 left-0 w-1 h-full bg-(--secondary)" />
                                
                                <div className="p-6 md:p-12 space-y-6 md:space-y-8">
                                    <header className="border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 bg-(--surface-highest) rounded flex items-center justify-center border border-white/10 shrink-0">
                                                <img src={ShieldLock} alt="Shield" className="w-5 h-5" />
                                            </div>
                                            <h1 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-white uppercase leading-tight">
                                                Actualizar <br className="sm:hidden" /> Contraseña
                                            </h1>
                                        </div>
                                        <p className="text-(--on-surface-variant) text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
                                            Modifica la contraseña para <span className="text-white">{currentUser?.email || 'ANONYMOUS_USER'}</span>.
                                        </p>
                                    </header>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Current Password */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Contraseña Actual</label>
                                            <input 
                                                type="password" 
                                                required
                                                disabled={isUpdating}
                                                placeholder="••••••••"
                                                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-(--secondary) outline-none transition-all font-mono rounded-xs placeholder:opacity-20 disabled:opacity-50"
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* New Password */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Nueva Contraseña</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    disabled={isUpdating}
                                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-(--secondary) outline-none transition-all font-mono rounded-xs disabled:opacity-50"
                                                    value={formData.newPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                                <div className="h-1 w-full bg-white/5 mt-1 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-(--secondary) transition-all duration-500 shadow-[0_0_8px_var(--secondary)]" 
                                                        style={{ width: `${strength}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Confirmar Nueva</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    disabled={isUpdating}
                                                    className={`w-full bg-black/40 border px-4 py-3 text-sm text-white outline-none transition-all font-mono rounded-xs disabled:opacity-50 ${
                                                        formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                                                        ? 'border-red-500/50' 
                                                        : 'border-white/10 focus:border-(--secondary)'
                                                    }`}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full btn-primary-engine py-4 mt-4 font-headline font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all active:scale-[0.98] rounded-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isUpdating ? 'Procesando Sincronización...' : 'Actualizar Contraseña'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* 03. Technical Context */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-4 md:space-y-6 order-2">
                            <section className="bg-(--surface-container-low) p-6 rounded-sm border border-white/5 font-mono">
                                <div className="text-[10px] text-(--secondary) uppercase mb-6 border-b border-white/10 pb-2 flex justify-between font-bold tracking-tighter">
                                    <span>Protocólo de Seguridad</span>
                                    <img src={Sync} alt="Sync" className={`w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="space-y-4 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-(--on-surface-variant)">ENCRIPTACIÓN</span>
                                        <span className="text-white">AES-256</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-(--on-surface-variant) leading-relaxed italic">
                                            * Al cambiar la contraseña, se cerrarán todas las sesiones activas excepto esta.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-amber-500/5 p-5 md:p-6 rounded-sm border border-amber-500/10">
                                <div className="flex gap-3">
                                    <img src={Exclamation} alt="Exclamation" className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                                    <div>
                                        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Aviso de Seguridad</h4>
                                        <p className="text-[9px] text-amber-500/70 leading-normal">
                                            Evite usar contraseñas utilizadas en otros servicios externos para mantener la integridad del nodo.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}