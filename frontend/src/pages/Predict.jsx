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
        kms: 0,
        imgs_b64: []
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
            popup: 'border border-white/5 rounded-sm font-body text-xs shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] blueprint-grid-dots max-w-[90%] md:max-w-lg',
            title: 'text-sm md:text-base font-headline uppercase tracking-[0.2em] text-white font-bold pt-6 px-4 text-center',
            htmlContainer: 'text-xs text-[var(--on-surface-variant,#bec8d2)] font-light px-2 md:px-4',
            confirmButton: 'w-full md:w-auto px-8 py-3 text-[10px] font-bold transition-all uppercase tracking-[0.2em] cursor-pointer active:scale-[0.98] flex items-center justify-center rounded-sm min-w-40 outline-none focus:outline-none focus:ring-0',
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                
                setFormData(prev => ({
                    ...prev,
                    imgs_b64: [...prev.imgs_b64, base64String]
                }));
            };
            reader.readAsDataURL(file);
        });
    };
    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            imgs_b64: prev.imgs_b64.filter((_, index) => index !== indexToRemove)
        }));
    };

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
                    confirmButton: `${swalConfig.customClass.confirmButton} btn-primary-engine h-auto py-3`
                },
                html: `
                    <div style="font-family: var(--font-body, 'Inter', sans-serif); text-align: left; margin: 4px 0; padding: 0; width: 100%;">        
                        <div style="background: var(--surface-lowest, #060e20); padding: 20px 16px; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 2px; text-align: center; margin: 12px 0; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right, transparent, var(--secondary, #5de6ff), transparent);"></div>
                            <div style="position: absolute; top: 6px; left: 8px; font-size: 8px; font-family: var(--font-headline, sans-serif); font-weight: 700; letter-spacing: 0.15em; color: var(--secondary, #5de6ff); opacity: 0.6;">VALOR ESTIMADO</div>
                            
                            <span style="font-family: var(--font-headline, sans-serif); font-size: 28px; md:font-size: 36px; font-weight: 700; letter-spacing: -0.03em; color: var(--secondary, #5de6ff); text-shadow: 0 0 20px rgba(93, 230, 255, 0.25); display: inline-block; line-height: 1.1; margin-top: 8px; max-width: 100%; word-break: break-all;">
                                ${Number(predictedPrice).toLocaleString('es-ES')} €
                            </span>
                        </div>
                        
                        <div style="background: var(--surface-high, #222a3d); padding: 10px 12px; border-left: 3px solid var(--secondary, #5de6ff); border-radius: 2px; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.02); border-right: 1px solid rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.02);">
                            <p style="font-size: 10px; color: var(--on-surface-variant, #bec8d2); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; line-height: 1.4; word-break: break-word;">
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
                    confirmButton: `${swalConfig.customClass.confirmButton} bg-white/5 text-[var(--on-surface-variant,#bec8d2)] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 py-3`
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
        <div className="bg-(--surface) text-[#dae2fd] p-4 sm:p-6 lg:p-12 blueprint-grid-dots relative flex flex-col items-center min-h-screen overflow-x-hidden">
            
            <main className="z-10 w-full max-w-7xl flex flex-col justify-between gap-6 grow">
                
                {/* --- HEADER --- */}
                <motion.header 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full flex-none"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3">
                                <motion.span 
                                    initial={{ width: 0 }}
                                    animate={{ width: 24 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                    className="h-px bg-(--secondary) hidden xs:block"
                                />
                                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.3em] text-(--secondary) uppercase whitespace-nowrap">
                                    Modulo: Evaluación de Mercado
                                </span>
                            </div>
                            
                            <h1 className="text-xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                                Motor de <span className="text-(--primary-container) inline-block relative">Predicción</span>
                            </h1>
                        </div>

                        <motion.div 
                            layout
                            className="bg-black/20 px-4 py-2.5 border border-white/5 rounded-xs backdrop-blur-xs w-full sm:w-auto sm:min-w-48 transition-all hover:border-(--secondary)/20 block shrink-0"
                        >
                            <p className="text-[8px] font-mono text-[#bec8d2]/40 uppercase mb-0.5">Selección Actual</p>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={`${selectedMake.nombre || 'none'}-${selectedModel.nombre || 'none'}`}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-[10px] font-bold text-(--secondary) tracking-widest uppercase truncate max-w-full sm:max-w-45"
                                >
                                    {selectedMake.nombre || '---'} // {selectedModel.nombre || '---'}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className="mt-3">
                        <p className="max-w-4xl text-[10px] md:text-[11px] text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-75">
                            Posibilidad de evaluación entre dos modelos: un modelo entrenado con vehículos evaluados en 2018 (<span className="text-white font-bold">Kaggle</span>) o mediante un modelo entrenado con precios actuales (<span className="text-white font-bold">Web Scraping</span>).
                        </p>
                    </div>
                </motion.header>

                {/* --- FORMULARIO --- */}
                <motion.form 
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handlePredict} 
                    className="grid grid-cols-1 lg:grid-cols-12 shadow-2xl rounded-sm overflow-hidden border border-[#3e4850]/10 grow w-full bg-(--surface-low)"
                >
                    {/* Bloque Izquierdo: Inputs de Datos */}
                    <div className="col-span-1 lg:col-span-8 p-5 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5 space-y-6 md:space-y-8 flex flex-col justify-center">
                        
                        {/* 01. Especificaciones Base */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">01</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Especificaciones Base</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Fabricante</label>
                                    <select name="make" value={formData.make} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5">
                                        <option value="">Seleccionar Marca...</option>
                                        {makes.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>

                                <div className={`space-y-1 group transition-all duration-300 ${!formData.make ? 'opacity-30 mix-blend-luminosity' : 'opacity-100'}`}>
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Modelo</label>
                                    <select 
                                        name="model" 
                                        value={formData.model} 
                                        onChange={handleChange} 
                                        disabled={!formData.make} 
                                        className={`input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5 ${!formData.make ? 'cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Seleccionar Modelo...</option>
                                        {models.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>

                                <div className={`md:col-span-2 space-y-1 group transition-all duration-300 ${(!formData.make || !formData.model) ? 'opacity-30 mix-blend-luminosity' : 'opacity-100'}`}>
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Versión Específica</label>
                                    <select 
                                        name="version" 
                                        value={formData.version} 
                                        onChange={handleChange} 
                                        disabled={!formData.make || !formData.model} 
                                        className={`input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5 ${(!formData.make || !formData.model) ? 'cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Seleccionar Versión...</option>
                                        {versions.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* 02. Historial y Uso */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">02</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Historial y Uso</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Fecha Matriculación</label>
                                    <input type="date" name="registration" max={today} value={formData.registration} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2" />
                                </div>
                                <div className="md:col-span-2 space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Kilometraje Total</label>
                                    <div className="relative">
                                        <input type="number" name="kms" min="0" step="1" onKeyDown={(e) => {if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)){e.preventDefault()}}} value={formData.kms || ''} onChange={handleChange} className="input-data-entry w-full pl-4 pr-12 transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5" placeholder="0" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-(--secondary) tracking-wider font-bold select-none pointer-events-none">KM</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 03. Configuración Técnica */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">03</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Configuración Técnica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                                <div className="space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Combustible</label>
                                    <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5">
                                        <option value="">Tipo...</option>
                                        {fuelTypes.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Transmisión</label>
                                    <select name="gear_type" value={formData.gear_type} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5">
                                        <option value="">Tipo...</option>
                                        {gearTypes.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest transition-colors group-focus-within:text-(--secondary)">Potencia (CV)</label>
                                    <input type="number" name="power" min="0" step="1" onKeyDown={(e) => {if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)){e.preventDefault()}}} value={formData.power || ''} onChange={handleChange} className="input-data-entry w-full transition-all focus:border-(--secondary)/40 focus:ring-1 focus:ring-(--secondary)/20 text-xs py-2.5" placeholder="0" />
                                </div>
                            </div>
                        </motion.div>

                        {/* 04. Peritaje Visual (Carga de Imágenes) */}
                        <motion.div variants={sectionVariants} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] md:text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs shadow-xs">04</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Análisis de Carrocería</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="group relative border-2 border-dashed border-white/10 hover:border-(--secondary)/40 transition-colors p-6 rounded-sm bg-(--surface-highest)/30 text-center cursor-pointer">
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="space-y-2">
                                        <span className="material-symbols-outlined text-2xl">Añadir Imágenes</span>
                                        <p className="text-xs text-white font-medium">Subir imágenes del vehículo</p>
                                        <p className="text-[10px] text-[#bec8d2]/40 uppercase tracking-wider">Selecciona una o varias fotos (Frontal, Trasera, Laterales)</p>
                                    </div>
                                </div>

                                {/* Galería de Previsualización Dinámica */}
                                {formData.imgs_b64.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-3 bg-black/20 rounded-sm border border-white/5">
                                        {formData.imgs_b64.map((img, index) => (
                                            <div key={index} className="relative aspect-video bg-(--surface-high) border border-white/10 rounded-xs overflow-hidden group/thumb">
                                                <img 
                                                    src={`data:image/jpeg;base64,${img}`} 
                                                    alt={`Miniatura ${index + 1}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined text-xs">Borrar</span>
                                                </button>
                                                <span className="absolute bottom-1 left-1 data-chip opacity-80">Foto {index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Bloque Derecho: Panel de Control de Inferencia */}
                    <motion.div 
                        variants={sectionVariants}
                        className="col-span-1 lg:col-span-4 bg-(--surface-container) p-5 md:p-8 flex flex-col justify-between relative overflow-hidden gap-6"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-(--secondary)/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="space-y-5 relative z-10">
                            <div className="pb-4 border-b border-white/10">
                                <p className="text-[10px] font-bold text-(--secondary) uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
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

                            {/* Selector de Algoritmo/Modelo Deshabilitado */}
                            <div className="space-y-1 group opacity-60 mix-blend-luminosity">
                                <label className="text-[9px] md:text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Algoritmo Predictor</label>
                                <select 
                                    disabled 
                                    value="xgboost" 
                                    className="input-data-entry w-full cursor-not-allowed bg-black/20 text-xs py-2.5"
                                >
                                    <option value="xgboost">XGBoost Regressor (XGBoost)</option>
                                    <option value="random_forest">Random Forest (Kaggle)</option>
                                </select>
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
                        <div className="mt-2 lg:mt-8 space-y-3 relative z-10 w-full">
                            <motion.button 
                                type="submit"
                                disabled={!formData.version || isPredicting}
                                whileHover={(formData.version && !isPredicting) ? { scale: 1.01, boxShadow: '0 0 20px rgba(14,165,233,0.15)' } : {}}
                                whileTap={(formData.version && !isPredicting) ? { scale: 0.99 } : {}}
                                className={`btn-primary-engine w-full flex items-center justify-center gap-3 py-3.5 transition-all duration-300 border rounded-xs ${
                                    (!formData.version || isPredicting)
                                    ? 'opacity-20 grayscale cursor-not-allowed border-transparent' 
                                    : 'cursor-pointer hover:border-(--secondary)/40 active:scale-[0.99]'
                                }`}
                            >
                                <span className="tracking-[0.2em] font-bold text-xs">
                                    {isPredicting ? 'EVALUANDO VEHÍCULO...' : 'PREDECIR PRECIO'}
                                </span>
                                
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
                                Margen de precisión estimado: ±7.92%
                            </p>
                        </div>
                    </motion.div>
                </motion.form>
            </main>
        </div>
    );
}