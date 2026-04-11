import { useState, useEffect } from 'react';
import Exclamation from '../../assets/icons/exclamation.svg';
import ShieldLock from '../../assets/icons/shield_lock.svg';
import Sync from '../../assets/icons/sync.svg';
import SideBar from '../../components/SideBar';
import SubHeaderProfile from '../../components/SubHeaderProfile';

export default function ChangePassword({ currentUser }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSyncing, setIsSyncing] = useState(true);
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsSyncing(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, newPassword: value }));
        setStrength(Math.min(value.length * 10, 100));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Protocol Error: Passwords do not match");
            return;
        }
        console.log("Iniciando actualización de credenciales...");
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-(--surface) text-(--on-surface) selection:bg-(--primary-container) selection:text-white">
            <SideBar />
            
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
                                                Actualizar <br className="sm:hidden" /> Credenciales
                                            </h1>
                                        </div>
                                        <p className="text-(--on-surface-variant) text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
                                            Modifica los tokens de acceso para <span className="text-white">{currentUser?.email || 'ANONYMOUS_USER'}</span>.
                                        </p>
                                    </header>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Current Password */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Contraseña Actual</label>
                                            <input 
                                                type="password" 
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-(--secondary) outline-none transition-all font-mono rounded-xs placeholder:opacity-20"
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
                                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white focus:border-(--secondary) outline-none transition-all font-mono rounded-xs"
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
                                                    className={`w-full bg-black/40 border px-4 py-3 text-sm text-white outline-none transition-all font-mono rounded-xs ${
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
                                            className="w-full bg-(--primary-container) py-4 mt-4 font-headline font-bold text-white uppercase tracking-[0.2em] text-[10px] md:text-xs hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-(--primary-container)/20 cursor-pointer"
                                        >
                                            Actualizar Credenciales
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* 03. Technical Context */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-4 md:space-y-6 order-2">
                            <section className="bg-(--surface-container-low) p-6 rounded-sm border border-white/5 font-mono">
                                <div className="text-[10px] text-(--secondary) uppercase mb-6 border-b border-white/10 pb-2 flex justify-between font-bold tracking-tighter">
                                    <span>Security Protocol</span>
                                    <img src={Sync} alt="Sync" className={`w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="space-y-4 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-(--on-surface-variant)">ENCRYPTION</span>
                                        <span className="text-white">AES-256-GCM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-(--on-surface-variant)">HASH_TYPE</span>
                                        <span className="text-white">ARGON2ID</span>
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