import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictCar } from '../composables/predict';
import { getMakes, getModelsByMake, getVersionsByModel, make, model, version } from '../composables/cars';
import VerifiedUser from '../assets/icons/verified_user.svg'
import Bolt from '../assets/icons/bolt.svg'

export default function Predict() {
    const navigate = useNavigate();

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

    const [selectedMake, setSelectedMake] = useState(make);
    const [selectedModel, setSelectedModel] = useState(model);
    const [selectedVersion, setSelectedVersion] = useState(version);

    useEffect(() => {
        getMakes().then(setMakes).catch(console.error);
    }, []);

    useEffect(() => {
        if (formData.make) {
            getModelsByMake(formData.make).then(setModels);
        } else {
            setModels([]);
        }
        setFormData(prev => ({ ...prev, model: '', version: '' }));
        setSelectedModel(model);
        setSelectedVersion(version);
    }, [formData.make]);

    useEffect(() => {
        if (formData.model) {
            getVersionsByModel(formData.model).then(setVersions);
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
            const found = makes.find(m => m.id === parseInt(value));
            if (found) setSelectedMake({ make_id: found.id, nombre: found.nombre });
        }
        if (name === 'model') {
            const found = models.find(m => m.id === parseInt(value));
            if (found) setSelectedModel({ model_id: found.id, nombre: found.nombre, id_marca: found.id_marca });
        }
        if (name === 'version') {
            const found = versions.find(v => v.id === parseInt(value));
            if (found) setSelectedVersion({ version_id: found.id, nombre: found.nombre, id_modelo: found.id_modelo });
        }
    }

    const handlePredict = async (e) => {
        e.preventDefault();
        try {
            await predictCar(formData);
            navigate('/login');
        } catch (error) {
            console.error("Error en la predicción", error);
        }
    }

    return (
        <div className="min-h-screen bg-(--surface) text-[#dae2fd] p-6 lg:p-12 blueprint-grid relative overflow-hidden flex items-center justify-center">
            <div className="neural-glow top-0 right-0 opacity-5"></div>

            <main className="z-10 w-full max-w-7xl">
                {/* Cabecera */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-(--secondary)"></span>
                            <span className="text-[10px] font-bold tracking-[0.3em] text-(--secondary) uppercase">Modulo: Evaluación de Mercado</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase leading-none">
                            Motor de <span className="text-(--primary-container)">Predicción</span>
                        </h1>
                    </div>
                    
                    <div className="bg-black/20 p-4 border border-white/5 rounded-sm">
                        <p className="text-[9px] font-mono text-[#bec8d2]/40 uppercase mb-1">Selección Actual</p>
                        <p className="text-[11px] font-bold text-(--secondary) tracking-widest uppercase">
                            {selectedMake.nombre || '---'} // {selectedModel.nombre || '---'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handlePredict} className="grid grid-cols-1 lg:grid-cols-12 shadow-2xl rounded-sm overflow-hidden border border-[#3e4850]/10">
                    
                    {/* Panel de Inputs */}
                    <div className="lg:col-span-8 bg-(--surface-low) p-8 md:p-12 border-r border-white/5 space-y-12">
                        
                        {/* 01: Core Specs */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs">01</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Especificaciones Base</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Fabricante</label>
                                    <select name="make" value={formData.make} onChange={handleChange} className="input-data-entry w-full">
                                        <option value="">Seleccionar Marca...</option>
                                        {makes.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Modelo</label>
                                    <select name="model" value={formData.model} onChange={handleChange} disabled={!formData.make} className="input-data-entry w-full">
                                        <option value="">Seleccionar Modelo...</option>
                                        {models.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Versión Específica</label>
                                    <select name="version" value={formData.version} onChange={handleChange} disabled={!formData.model} className="input-data-entry w-full">
                                        <option value="">Seleccionar Versión...</option>
                                        {versions.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 02: Usage */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs">02</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Historial y Uso</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Fecha Matriculación</label>
                                    <input type="date" name="registration" value={formData.registration} onChange={handleChange} className="input-data-entry w-full" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Kilometraje Total</label>
                                    <div className="relative">
                                        <input type="number" name="kms" value={formData.kms} onChange={handleChange} className="input-data-entry w-full pl-4" placeholder="0" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-(--secondary)">KM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 03: Tech */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white px-2 py-0.5 bg-(--surface-high) rounded-xs">03</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#bec8d2]">Configuración Técnica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Combustible</label>
                                    <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="input-data-entry w-full">
                                        <option value="">Tipo...</option>
                                        <option value="Petrol">Gasolina</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Eléctrico</option>
                                        <option value="Hybrid">Híbrido</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Transmisión</label>
                                    <select name="gear_type" value={formData.gear_type} onChange={handleChange} className="input-data-entry w-full">
                                        <option value="">Tipo...</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automático</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[#bec8d2]/60 uppercase tracking-widest">Potencia (CV)</label>
                                    <input type="number" name="power" value={formData.power} onChange={handleChange} className="input-data-entry w-full" placeholder="0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Acción Lateral */}
                    <div className="lg:col-span-4 bg-(--surface-container) p-8 md:p-10 flex flex-col justify-between">
                        <div className="space-y-8">
                            <div className="pb-6 border-b border-white/10">
                                <p className="text-[10px] font-bold text-(--secondary) uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="h-2 w-2 bg-(--secondary) rounded-full animate-pulse"></span>
                                    Neural Processing
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-[#bec8d2]/60 uppercase">Estado Entrada</span>
                                        <span className="text-white font-mono">{formData.make ? 'DATOS_RECUPERADOS' : 'ESPERANDO...'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 p-5 rounded-sm border border-white/5">
                                <p className="text-[10px] leading-relaxed text-[#bec8d2]/60 uppercase tracking-wider mb-4">
                                    El cálculo se basará en el análisis de gradiente sobre {selectedVersion.nombre || 'el modelo seleccionado'}.
                                </p>
                                <div className="flex items-center gap-2 text-(--primary-container)">
                                    <img src={VerifiedUser} alt="Verified User" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Cifrado de grado industrial</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <button 
                                type="submit"
                                disabled={!formData.version}
                                className={`btn-primary-engine w-full flex items-center justify-center gap-3 py-4 transition-all ${!formData.version ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                            >
                                <span className="tracking-[0.2em] font-bold">PREDECIR PRECIO</span>
                                <img src={Bolt} alt="Bolt" />
                            </button>
                            <p className="text-[8px] text-center text-[#bec8d2]/30 uppercase tracking-[0.15em]">
                                Margen de precisión estimado: ±2.1%
                            </p>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}