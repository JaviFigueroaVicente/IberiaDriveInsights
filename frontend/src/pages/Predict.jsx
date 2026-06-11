import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import { Background } from '../components/Background'
import { getMakes, getModelsByMake, getVersionsByModel, getFuelTypes, getGearTypes, predictCar, make, model, version, fuel_type, gear_type } from '../composables/cars';
import VerifiedUser from '../assets/icons/verified_user.svg'
import Bolt from '../assets/icons/bolt.svg'

const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
}

const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
}

export default function Predict() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        version: '',
        registration: '',
        power: 0,
        gear_type: '',
        fuel_type: '',
        kms: 0
    });

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [versions, setVersions] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [gearTypes, setGearTypes] = useState([]);

    const [selectedMake, setSelectedMake] = useState(make);
    const [selectedModel, setSelectedModel] = useState(model);
    const [selectedVersion, setSelectedVersion] = useState(version);
    const [selectedFuelType, setSelectedFuelType] = useState(fuel_type);
    const [selectedGearType, setSelectedGearType] = useState(gear_type);

    const [isPredicting, setIsPredicting] = useState(false);

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

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getMakes().then(setMakes).catch(console.error);
            getFuelTypes().then(setFuelTypes).catch(console.error);
            getGearTypes().then(setGearTypes).catch(console.error);
        }
    }, []);

    // Pipeline reactivo: Cambio de Marca
    useEffect(() => {
        if (formData.make) {
            getModelsByMake(formData.make).then(setModels).catch(console.error);
        } else {
            setModels([]);
        }
        setFormData(prev => ({ ...prev, model: '', version: '' }));
        setSelectedModel(model);
        setSelectedVersion(version);
    }, [formData.make]);

    // Pipeline reactivo: Cambio de Modelo
    useEffect(() => {
        if (formData.model) {
            getVersionsByModel(formData.model).then(setVersions).catch(console.error);
        } else {
            setVersions([]);
        }
        setFormData(prev => ({ ...prev, version: '' }));
        setSelectedVersion(version);
    }, [formData.model]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'make') {
            if (!value) {
                setSelectedMake(make);
                return;
            }
            const found = makes.find(m => m.id === parseInt(value));
            setSelectedMake(found ? { make_id: found.id, nombre: found.nombre } : make);
        }
        if (name === 'model') {
            if (!value) {
                setSelectedModel(model);
                return;
            }
            const found = models.find(m => m.id === parseInt(value));
            setSelectedModel(found ? { model_id: found.id, nombre: found.nombre, id_marca: found.id_marca } : model);
        }
        if (name === 'version') {
            if (!value) {
                setSelectedVersion(version);
                return;
            }
            const found = versions.find(v => v.id === parseInt(value));
            setSelectedVersion(found ? { version_id: found.id, nombre: found.nombre, id_modelo: found.id_modelo } : version);
        }
        if (name === 'fuel_type') {
            if (!value) {
                setSelectedFuelType(fuel_type);
                return;
            }
            const found = fuelTypes.find(f => f.id === parseInt(value));
            setSelectedFuelType(found ? { fuel_id: found.id, nombre: found.nombre } : fuel_type);
        }
        if (name === 'gear_type') {
            if (!value) {
                setSelectedGearType(gear_type);
                return;
            }
            const found = gearTypes.find(g => g.id === parseInt(value));
            setSelectedGearType(found ? { gear_id: found.id, nombre: found.nombre } : gear_type);
        }
    }

    const handlePredict = async (e) => {
        e.preventDefault();
        setIsPredicting(true);
        try {
            const result = await predictCar(formData);
            console.log('Predicción completada:', result);
            
            const predictedPrice = result?.price || result?.estimated_price || 0;

            await Swal.fire({
                ...swalConfig,
                title: 'Evaluación Completada',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} btn-primary-engine h-auto py-3 md:py-3`
                },
                html: `
                    <div style="font-family: var(--font-body, 'Inter', sans-serif); text-align: left; margin: 8px 0; padding: 0;">        
                        <div style="background: var(--surface-lowest, #060e20); padding: 24px 20px; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 2px; text-align: center; margin: 16px 0; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, var(--secondary, #5de6ff), transparent);"></div>
                            <div style="position: absolute; top: 6px; left: 8px; font-size: 8px; font-family: var(--font-headline, sans-serif); font-weight: 700; letter-spacing: 0.15em; color: var(--secondary, #5de6ff); opacity: 0.6;">VALOR ESTIMADO</div>
                            
                            <span style="font-family: var(--font-headline, sans-serif); font-size: 36px; font-weight: 700; letter-spacing: -0.03em; color: var(--secondary, #5de6ff); text-shadow: 0 0 20px rgba(93, 230, 255, 0.25); display: inline-block; line-height: 1.1; margin-top: 6px;">
                                ${Number(predictedPrice).toLocaleString('es-ES')} €
                            </span>
                        </div>
                        
                        <div style="background: var(--surface-high, #222a3d); padding: 12px 14px; border-left: 3px solid var(--secondary, #5de6ff); border-radius: 2px; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.02); border-right: 1px solid rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.02);">
                            <p style="font-size: 10px; color: var(--on-surface-variant, #bec8d2); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; line-height: 1.4;">
                                Vehículo analizado: <span style="color: #ffffff; font-weight: 700; font-family: var(--font-body, sans-serif);">${selectedMake.nombre || ''} ${selectedModel.nombre || ''}</span>
                            </p>
                        </div>
                    </div>
                `,
                icon: 'success',
                iconColor: 'var(--secondary, #5de6ff)',
                confirmButtonText: 'CERRAR INFORME',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            navigate('/profile/my-predictions');
        } catch (error) {
            console.error("Error en la predicción", error);
            await Swal.fire({
                ...swalConfig,
                title: 'Fallo de Evaluación',
                customClass: {
                    ...swalConfig.customClass,
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-3 md:py-3`
                },
                text: error.response?.data?.detail || 'Error al procesar el coche en el motor de regresión.',
                icon: 'error',
                iconColor: '#ff5252',
                confirmButtonText: 'REINTENTAR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
            });
        } finally {
            setIsPredicting(false);
        }
    }

    return (
        <div className="bg-(--surface) text-[#dae2fd] p-6 lg:p-12 blueprint-grid relative flex flex-col items-center justify-between min-h-[calc(100vh-5rem)]">
            <Background />
            <main className="z-10 w-full max-w-7xl h-full flex flex-col justify-between gap-6 min-h-[calc(100vh-8rem)]">
                
                {/* --- HEADER (Calibrado Exacto) --- */}
                <motion.header 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full flex-none"
                >
                    <div className="flex flex-row items-end justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-3">
                                <motion.span 
                                    initial={{ width: 0 }}
                                    animate={{ width: 24 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                    className="h-px bg-(--secondary)"
                                ></motion.span>
                                <span className="text-[9px] font-bold tracking-[0.3em] text-(--secondary) uppercase whitespace-nowrap">
                                    Modulo: Evaluación de Mercado
                                </span>
                            </div>
                            
                            <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                                Motor de <span className="text-(--primary-container) inline-block relative">Predicción</span>
                            </h1>
                        </div>

                        <motion.div 
                            layout
                            className="bg-black/20 px-4 py-2.5 border border-white/5 rounded-xs backdrop-blur-xs min-w-48 transition-all hover:border-(--secondary)/20 block shrink-0"
                        >
                            <p className="text-[8px] font-mono text-[#bec8d2]/40 uppercase mb-0.5">Selección Actual</p>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={`${selectedMake.nombre || 'none'}-${selectedModel.nombre || 'none'}`}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-[10px] font-bold text-(--secondary) tracking-widest uppercase truncate max-w-45"
                                >
                                    {selectedMake.nombre || '---'} // {selectedModel.nombre || '---'}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className="mt-3">
                        <p className="max-w-4xl text-[10px] md:text-[11px] text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-75 line-clamp-2 md:line-clamp-none">
                            Evaluación mediante dos modelos independientes: análisis estructural de patrones históricos (<span className="text-white font-bold">Kaggle pre-2018</span>) y corrección por fluctuaciones dinámicas mediante captura en tiempo real (<span className="text-white font-bold">Web Scraping</span>).
                        </p>
                    </div>
                </motion.header>

                {/* --- FORMULARIO ADAPTADO --- */}
                <motion.form 
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handlePredict} 
                    className="grid grid-cols-1 lg:grid-cols-12 shadow-2xl rounded-sm overflow-hidden border border-[#3e4850]/10 grow w-full"
                >
                    {/* Bloque Izquierdo: Inputs de Datos */}
                    <div className="lg:col-span-8 bg-(--surface-low) p-6 md:p-10 border-r border-white/5 space-y-8 flex flex-col justify-center">
                        
                        {/* 01. Especificaciones Base */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">01</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Especificaciones Base</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Fabricante</label>
                                    <select name="make" value={formData.make} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20">
                                        <option value="">Seleccionar Marca...</option>
                                        {makes.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>

                                <div className={`space-y-1 group transition-all duration-300 ${!formData.make ? 'opacity-30 mix-blend-luminosity' : 'opacity-100'}`}>
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Modelo</label>
                                    <select 
                                        name="model" 
                                        value={formData.model} 
                                        onChange={handleChange} 
                                        disabled={!formData.make} 
                                        className={`input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 ${!formData.make ? 'cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Seleccionar Modelo...</option>
                                        {models.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>

                                <div className={`md:col-span-2 space-y-1 group transition-all duration-300 ${(!formData.make || !formData.model) ? 'opacity-30 mix-blend-luminosity' : 'opacity-100'}`}>
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Versión Específica</label>
                                    <select 
                                        name="version" 
                                        value={formData.version} 
                                        onChange={handleChange} 
                                        disabled={!formData.make || !formData.model} 
                                        className={`input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 ${(!formData.make || !formData.model) ? 'cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Seleccionar Versión...</option>
                                        {versions.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* 02. Historial y Uso */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">02</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Historial y Uso</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Fecha Matriculación</label>
                                    <input type="date" name="registration" max={today} value={formData.registration} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20" />
                                </div>
                                <div className="md:col-span-2 space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Kilometraje Total</label>
                                    <div className="relative">
                                        <input type="number" name="kms" min="0" step="1" onKeyDown={(e) => {if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)){e.preventDefault()}}} value={formData.kms || ''} onChange={handleChange} className="input-data-entry w-full pl-4 transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20" placeholder="0" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-(--secondary) tracking-wider font-bold select-none pointer-events-none">KM</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 03. Configuración Técnica */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">03</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Configuración Técnica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Combustible</label>
                                    <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20">
                                        <option value="">Tipo...</option>
                                        {fuelTypes.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Transmisión</label>
                                    <select name="gear_type" value={formData.gear_type} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20">
                                        <option value="">Tipo...</option>
                                        {gearTypes.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Potencia (CV)</label>
                                    <input type="number" name="power" min="0" step="1" onKeyDown={(e) => {if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)){e.preventDefault()}}} value={formData.power || ''} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20" placeholder="0" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bloque Derecho: Panel de Control de Inferencia */}
                    <motion.div 
                        variants={sectionVariants}
                        className="lg:col-span-4 bg-(--surface-container) p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-(--secondary)/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="space-y-6 relative z-10">
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-[10px] font-bold text-(--secondary) uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <span className="h-2 w-2 bg-(--secondary) rounded-full animate-pulse"></span>
                                    Sistema Activo
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-[#bec8d2]/60 uppercase">Estado Entrada</span>
                                        <span className="text-white font-mono tracking-wider text-[10px]">
                                            {formData.make ? 'DATOS RECUPERADOS' : 'ESPERANDO...'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 p-4 rounded-sm border border-white/5 backdrop-blur-xs group hover:border-(--secondary)/20 transition-colors duration-300">
                                <p className="text-[10px] leading-relaxed text-[#bec8d2]/60 uppercase tracking-wider mb-3">
                                    El cálculo se basará en el análisis sobre <span className="text-white font-bold">{selectedVersion.nombre || 'el modelo seleccionado'}</span>.
                                </p>
                                <div className="flex items-center gap-2 text-(--primary-container)">
                                    <img src={VerifiedUser} alt="Verified User" className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Datos Protegidos</span>
                                </div>
                            </div>
                        </div>

                        {/* Botón de Inferencia */}
                        <div className="mt-8 space-y-3 relative z-10">
                            <motion.button 
                                type="submit"
                                disabled={!formData.version || isPredicting}
                                whileHover={(formData.version && !isPredicting) ? { scale: 1.02, boxShadow: '0 0 20px rgba(14,165,233,0.15)' } : {}}
                                whileTap={(formData.version && !isPredicting) ? { scale: 0.98 } : {}}
                                className={`btn-primary-engine w-full flex items-center justify-center gap-3 py-3.5 transition-all duration-300 border ${
                                    (!formData.version || isPredicting)
                                    ? 'opacity-20 grayscale cursor-not-allowed border-transparent' 
                                    : 'cursor-pointer hover:border-(--secondary)/40 active:scale-[0.99]'
                                }`}
                            >
                                {/* Cambio dinámico de texto según el estado */}
                                <span className="tracking-[0.2em] font-bold text-xs">
                                    {isPredicting ? 'EVALUANDO VEHÍCULO...' : 'PREDECIR PRECIO'}
                                </span>
                                
                                {/* Ocultamos el icono del rayo o detenemos la animación si está cargando */}
                                {!isPredicting && (
                                    <motion.img 
                                        src={Bolt} 
                                        alt="Bolt" 
                                        animate={formData.version ? { y: [0, -2, 0] } : {}}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                        className="w-3.5 h-3.5"
                                    />
                                )}
                            </motion.button>
                            <p className="text-[8px] text-center text-[#bec8d2]/30 uppercase tracking-[0.15em]">
                                Margen de precisión estimado: ±2.1%
                            </p>
                        </div>
                    </motion.div>
                </motion.form>
            </main>
        </div>
    );
}