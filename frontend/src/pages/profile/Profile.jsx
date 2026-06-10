import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SideBar from '../../components/SideBar';
import Person from '../../assets/icons/person.svg';
import Camera from '../../assets/icons/camera.svg';
import Verified from '../../assets/icons/verified_check.svg';
import SubHeaderProfile from '../../components/SubHeaderProfile';

import { updateProfile } from '../../composables/auth'; 

export default function Profile({ currentUser, handleLogout, setCurrentUser }) {
    // Estado local para controlar los campos editables del formulario
    const [formData, setFormData] = useState({
        name: '',
        surname: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Sincroniza el estado local cuando el usuario actual se carga o cambia
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                surname: currentUser.surname || ''
            });
        }
    }, [currentUser]);

    // Detecta si hay cambios pendientes comparando el estado local con las props
    const hasChanges = () => {
        return (
            formData.name !== (currentUser?.name || '') ||
            formData.surname !== (currentUser?.surname || '')
        );
    };

    // Manejador de cambios en los inputs permitidos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        })); 
    };

    // Estilo común para integrar Swal con la estética oscura de la app
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
            denyButton: 'text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-sm',
            cancelButton: 'text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-sm'
        }
    };

    // Configuración específica para Toast de notificación rápida
    const toastConfig = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'var(--surface-container-low, #1e1e1e)',
        color: '#ffffff',
        customClass: {
            popup: 'border border-white/10 rounded-sm font-mono text-xs',
            title: 'text-xs uppercase tracking-wider text-white font-bold'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // Función para restaurar los valores originales del formulario con confirmación de Swal
    const handleDiscard = async () => {
        if (!currentUser) return;

        // Si hay cambios modificados, pide confirmación antes de revertir
        if (hasChanges()) {
            const result = await Swal.fire({
                ...swalConfig,
                title: '¿Descartar modificaciones?',
                text: 'Se perderán todos los cambios que no hayas guardado.',
                icon: 'warning',
                iconColor: '#ffd700',
                showCancelButton: true,
                confirmButtonText: 'Sí, descartar',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#3a3a3a'
            });

            if (!result.isConfirmed) return;
        }

        setFormData({
            name: currentUser.name || '',
            surname: currentUser.surname || ''
        });
    };

    // Envío del formulario al backend con validaciones y alertas de Swal
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        // Si el usuario da clic en guardar pero no ha tocado nada
        if (!hasChanges()) {
            Swal.fire({
                ...swalConfig,
                title: 'Sin cambios',
                text: 'No se han detectado modificaciones en los datos de usuario.',
                icon: 'info',
                iconColor: 'var(--secondary, #5de6ff)'
            });
            return;
        }

        // Solicita confirmación explícita para guardar los cambios
        const result = await Swal.fire({
            ...swalConfig,
            title: '¿Actualizar datos?',
            text: '¿Confirmas la actualización de tus datos en el sistema?',
            icon: 'question',
            iconColor: 'var(--secondary, #5de6ff)',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#3a3a3a'
        });

        if (!result.isConfirmed) return;

        setIsSaving(true);
        try {
            // 1. Envía la actualización al backend
            const updatedUser = await updateProfile({
                name: formData.name,
                surname: formData.surname
            });

            // 2. Actualiza el estado de la aplicación (como salvaguarda reactiva)
            if (updatedUser && setCurrentUser) {
                setCurrentUser(updatedUser);
            }

            // 3. Muestra el SweetAlert modal (esperando la interacción del usuario)
            await Swal.fire({
                ...swalConfig,
                title: 'Perfil actualizado',
                text: 'Los cambios se han guardado correctamente en el sistema.',
                icon: 'success',
                iconColor: '#00e676',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                confirmButtonText: null
            });

            // 4. La página se recarga exactamente cuando el usuario pulsa "Aceptar"
            window.location.reload();

        } catch (error) {
            console.error("Error updating identity parameters:", error);
            Swal.fire({
                ...swalConfig,
                title: 'Error',
                text: 'Hubo un fallo al guardar las modificaciones en el servidor.',
                icon: 'error',
                iconColor: '#ff5252'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Cálculo del valor promedio de los vehículos guardados
    const calculateAverageValue = () => {
        if (!currentUser?.cars || currentUser.cars.length === 0) return '---';
        const total = currentUser.cars.reduce((acc, car) => acc + Number(car.price || 0), 0);
        return Math.round(total / currentUser.cars.length).toLocaleString();
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
                                {/* Avatar */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-sm overflow-hidden ring-4 ring-white/5 relative group bg-(--surface-container-high)">
                                    <img src={Person} alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
                                    <div className="absolute inset-0 bg-(--primary-container)/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <img src={Camera} alt="Camera" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-[9px] md:text-[10px] text-(--on-surface-variant) uppercase tracking-[0.3em] font-bold">Usuario Registrado</span>
                                    <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter text-white uppercase leading-tight md:leading-none">
                                        {currentUser?.name} <span className="text-(--primary-container)">{currentUser?.surname}</span>
                                    </h1>
                                    <p className="text-(--secondary) font-mono text-[10px] md:text-xs mt-2 flex items-center justify-center sm:justify-start gap-2 uppercase tracking-widest break-all">
                                        <span className="hidden sm:block w-2 h-2 rounded-full bg-(--secondary) animate-pulse shrink-0"></span> {currentUser?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Widget de Plan / Status */}
                        <div className="lg:col-span-4 w-full">
                            <div className="bg-(--surface-container-low) p-6 rounded-sm border-b-2 border-(--primary-container) space-y-4 shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Tipo de Cuenta</span>
                                        <h3 className="text-xl md:text-2xl font-headline font-bold text-white tracking-tighter uppercase">{currentUser?.role === 1 ? 'Admin' : 'Básico'}</h3>
                                    </div>
                                    <img src={Verified} alt="Verified User" className="w-6 h-6 md:w-auto" />
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-(--secondary) h-full w-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Estadísticas */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            { label: 'Vehículos en BD', val: currentUser?.cars?.length || '0', sub: 'CARS' },
                            { label: 'Predicciones', val: currentUser?.cars?.filter(c => c.is_prediction).length || '0', color: 'text-(--secondary)' },
                            { label: 'Valor Promedio', val: calculateAverageValue(), sub: 'EUR' }
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
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                <span className="h-px w-8 bg-(--secondary) shadow-[0_0_8px_rgba(93,230,255,0.5)]"></span>
                                <h2 className="text-lg md:text-xl font-headline font-bold text-white uppercase tracking-tight">Datos de Usuario</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Nombre</label>
                                    <input
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-xs text-white focus:border-(--secondary) outline-none transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Apellidos</label>
                                    <input
                                        type="text" 
                                        name="surname" 
                                        value={formData.surname} 
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-xs text-white focus:border-(--secondary) outline-none transition-all font-mono"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Email Institucional</label>
                                    <input
                                        type="email" 
                                        name="email" 
                                        value={currentUser?.email || ''} 
                                        disabled
                                        className="w-full bg-white/5 border border-white/5 px-4 py-3 rounded-xs text-xs text-white/40 cursor-not-allowed font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Rol de Acceso</label>
                                    <div className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xs text-[10px] text-(--secondary) font-bold uppercase tracking-widest">
                                        {currentUser?.role === 1 ? 'Administrator' : 'Usuario Básico'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 md:mt-10 flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-6 pt-6 border-t border-white/5">
                                <button 
                                    type="button"
                                    onClick={handleDiscard}
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-widest bg-white/5 text-(--on-surface-variant) border border-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-sm cursor-pointer disabled:opacity-50"
                                >
                                    Descartar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary-engine px-8 py-4 md:py-3 rounded-sm text-[10px] font-bold transition-all uppercase tracking-[0.2em] cursor-pointer disabled:opacity-50 active:scale-[0.98] flex items-center justify-center min-w-40"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}