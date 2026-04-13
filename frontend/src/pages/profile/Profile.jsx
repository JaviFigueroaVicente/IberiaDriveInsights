import SideBar from '../../components/SideBar';
import Person from '../../assets/icons/person.svg'
import Camera from '../../assets/icons/camera.svg'
import Verified from '../../assets/icons/verified_check.svg'
import SubHeaderProfile from '../../components/SubHeaderProfile';

export default function Profile({ currentUser, handleLogout }) {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setcurrentUser(prev => ({ ...prev, [name]: value })); 
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-(--surface) text-(--on-surface) selection:bg-(--primary-container) selection:text-white">
            <SideBar currentUser={currentUser} onLogout={handleLogout}/>
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col w-full overflow-x-hidden">
                
                {/* Sub-header de sección */}
                <SubHeaderProfile />

                {/* Padding dinámico: p-6 en móvil, p-12 en desktop */}
                <div className="p-6 md:p-12 max-w-6xl mx-auto w-full space-y-8 md:space-y-12">
                
                    {/* Hero Profile */}
                    <section className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 items-center lg:items-end">
                        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-6 md:gap-10 text-center sm:text-left">
                            <div className="relative">
                                {/* Avatar más pequeño en móvil (w-32) y grande en desktop (w-40) */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-sm overflow-hidden ring-4 ring-white/5 relative group bg-(--surface-container-high)">
                                    <img src={Person} alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
                                    <div className="absolute inset-0 bg-(--primary-container)/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <img src={Camera} alt="Camera" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-(--secondary) text-black px-2 py-1 rounded-xs text-[9px] font-black uppercase tracking-tighter shadow-xl">
                                    {currentUser.role == 1 ? 'ADMIN_ROOT' : 'SENIOR_ANALYST'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-[9px] md:text-[10px] text-(--on-surface-variant) uppercase tracking-[0.3em] font-bold">Identidad Registrada</span>
                                    {/* Texto fluido: text-3xl en móvil, text-5xl en desktop */}
                                    <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter text-white uppercase leading-tight md:leading-none">
                                        {currentUser.name} <span className="text-(--primary-container)">{currentUser.surname}</span>
                                    </h1>
                                    <p className="text-(--secondary) font-mono text-[10px] md:text-xs mt-2 flex items-center justify-center sm:justify-start gap-2 uppercase tracking-widest break-all">
                                        <span className="hidden sm:block w-2 h-2 rounded-full bg-(--secondary) animate-pulse shrink-0"></span> {currentUser.email}
                                    </p>
                                </div>
                                <div className="flex justify-center sm:justify-start gap-4">
                                    <div className="bg-black/20 px-4 py-2 border-l-2 border-(--primary-container)">
                                        <span className="block text-[8px] text-(--on-surface-variant) uppercase tracking-widest font-bold">Miembro desde</span>
                                        <span className="text-white text-[10px] font-bold uppercase">{new Date(currentUser.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Widget de Plan / Status */}
                        <div className="lg:col-span-4 w-full">
                            <div className="bg-(--surface-container-low) p-6 rounded-sm border-b-2 border-(--primary-container) space-y-4 shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Acceso a Inferencia</span>
                                        <h3 className="text-xl md:text-2xl font-headline font-bold text-white tracking-tighter uppercase">Enterprise Tier</h3>
                                    </div>
                                    <img src={Verified} alt="Verified User" className="w-6 h-6 md:w-auto" />
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-(--secondary) h-full w-full"></div>
                                </div>
                                <button className="w-full py-2 text-[10px] font-bold text-(--secondary) border border-(--secondary)/30 hover:bg-(--secondary)/10 transition-all uppercase tracking-widest cursor-pointer">
                                    Ver documentación API
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Estadísticas */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            { label: 'Vehículos en BD', val: currentUser?.cars?.length || '0', sub: 'CARS' },
                            { label: 'Predicciones', val: currentUser?.cars?.filter(c => c.is_prediction).length || '0', sub: 'AI_MODE', color: 'text-(--secondary)' },
                            { label: 'Valor Promedio', val: '---', sub: 'EUR' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black/20 p-6 md:p-8 rounded-sm relative overflow-hidden group border border-white/5 shadow-xl">
                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-bold">{stat.label}</span>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">{stat.val}</span>
                                    <span className={`${stat.color || 'text-(--primary-container)'} text-[10px] font-bold tracking-widest uppercase`}>{stat.sub}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Formulario de Información */}
                    <section className="bg-(--surface-container-low) p-6 md:p-10 rounded-sm border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <span className="h-px w-8 bg-(--secondary) shadow-[0_0_8px_rgba(93,230,255,0.5)]"></span>
                            <h2 className="text-lg md:text-xl font-headline font-bold text-white uppercase tracking-tight">Parámetros de Identidad</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Nombre</label>
                                <input
                                    type="text" name="name" value={currentUser.name} onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-xs text-white focus:border-(--secondary) outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Apellidos</label>
                                <input
                                    type="text" name="surname" value={currentUser.surname} onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-xs text-white focus:border-(--secondary) outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Email Institucional</label>
                                <input
                                    type="email" name="email" value={currentUser.email} disabled
                                    className="w-full bg-white/5 border border-white/5 px-4 py-3 rounded-xs text-xs text-white/40 cursor-not-allowed font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Rol de Acceso</label>
                                <div className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-[10px] text-(--secondary) font-bold uppercase tracking-widest">
                                    {currentUser.role == 1 ? 'Administrator_Level_01' : 'Standard_User_Level_02'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Zona Horaria</label>
                                <select className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-xs text-white focus:border-(--secondary) outline-none transition-all appearance-none font-mono">
                                    <option>Europe/Madrid (GMT+2)</option>
                                    <option>UTC (Global)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-8 md:mt-10 flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-6 pt-6 border-t border-white/5">
                            <button className="py-2 text-[10px] font-bold text-(--on-surface-variant) hover:text-white uppercase tracking-widest transition-colors cursor-pointer">Descartar</button>
                            <button className="bg-(--primary-container) px-8 py-4 md:py-3 rounded-sm text-[10px] font-bold text-white shadow-[0_0_15px_rgba(137,206,255,0.4)] hover:brightness-110 transition-all uppercase tracking-[0.2em] cursor-pointer">
                                Guardar Cambios
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}