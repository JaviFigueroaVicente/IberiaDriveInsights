import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  Search, Plus, Settings, Trash2, X, Calendar, Activity, 
  TrendingUp, BarChart3, Database, Loader2, Save, Info
} from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar";
import { getCars, getMakes, getModelsByMake, getVersionsByModel } from "../../composables/cars"; 

export default function AdminCars({ currentUser, handleLogout }) {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 8;

    // ESTADOS PARA FORMULARIO Y SELECTS
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [versions, setVersions] = useState([]);
    const [formData, setFormData] = useState({
        make: "", model: "", version: "", power: 0,
        fuel_type: "Diesel", gear_type: "Manual", kms: 0, price: 0
    });

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'var(--surface-highest)', 
        color: 'var(--on-surface)',
        customClass: {
            popup: 'border border-white/10 rounded-xs font-body shadow-2xl max-w-xs',
            title: 'text-[10px] font-black uppercase tracking-widest'
        }
    });

    useEffect(() => {
        fetchFleet();
        loadMakes();
    }, []);

    // Encadenamiento de Selects con protección contra UNDEFINED
    useEffect(() => {
        const fetchModels = async () => {
            if (formData.make && formData.make !== "undefined") {
                const data = await getModelsByMake(formData.make);
                setModels(data || []);
            }
        };
        fetchModels();
    }, [formData.make]);

    useEffect(() => {
        const fetchVersions = async () => {
            if (formData.model && formData.model !== "undefined") {
                const data = await getVersionsByModel(formData.model);
                setVersions(data || []);
            }
        };
        fetchVersions();
    }, [formData.model]);

    const fetchFleet = async () => {
        try {
            const cars = await getCars();
            setFleet(cars || []);
        } catch (error) {
            setFleet([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMakes = async () => {
        const data = await getMakes();
        setMakes(data || []);
    };

    const openModal = async (car = null) => {
        if (car) {
            setEditingCar(car);
            setFormData({
                make: car.make,
                model: car.model,
                version: car.version,
                power: car.power,
                fuel_type: car.fuel_type,
                gear_type: car.gear_type,
                kms: car.kms,
                price: car.price
            });
            // Obtener modelos y versiones usando los nombres (no IDs, ya que no existen en la BD)
            const mods = await getModelsByMake(car.make);
            setModels(mods || []);
            const vers = await getVersionsByModel(car.model);
            setVersions(vers || []);
        } else {
            setEditingCar(null);
            setFormData({
                make: "", model: "", version: "", power: 0,
                fuel_type: "Diesel", gear_type: "Manual", kms: 0, price: 0
            });
            setModels([]);
            setVersions([]);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCar) {
                setFleet(fleet.map(c => c.id === editingCar.id ? { ...formData, id: c.id } : c));
                Toast.fire({ icon: 'success', title: 'ACTIVO_ACTUALIZADO' });
            } else {
                const newCar = { ...formData, id: Math.floor(Math.random() * 10000) };
                setFleet([newCar, ...fleet]);
                Toast.fire({ icon: 'success', title: 'ACTIVO_REGISTRADO' });
            }
            setIsModalOpen(false);
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'ERROR_DE_PROTOCOLO' });
        }
    };

    const handleDeleteCar = async (car) => {
        const result = await Swal.fire({
            title: 'CONFIRMAR_ELIMINACIÓN',
            text: `¿Deseas retirar el activo #${String(car.id).padStart(5, '0')}?`,
            icon: 'warning',
            iconColor: 'var(--secondary)',
            showCancelButton: true,
            confirmButtonText: 'ELIMINAR',
            cancelButtonText: 'CANCELAR',
            background: 'var(--surface)',
            color: 'var(--on-surface)',
            backdrop: 'rgba(6, 14, 32, 0.8)',
            buttonsStyling: false,
            customClass: {
                popup: 'architecture-card border-none rounded-none p-6 shadow-2xl max-w-[320px]',
                title: 'font-headline italic tracking-tighter uppercase text-lg mb-2 text-white',
                htmlContainer: 'font-body opacity-60 text-[11px] mb-6 uppercase tracking-widest',
                actions: 'flex w-full gap-2 px-2', 
                confirmButton: 'btn-primary-engine flex-1 py-2 text-[10px] order-2',
                cancelButton: 'bg-(--surface-highest) text-white font-headline px-4 py-2 uppercase tracking-widest text-[10px] hover:bg-(--surface-high) transition-all rounded-xs flex-1 order-1'
            }
        });

        if (result.isConfirmed) {
            setFleet(prev => prev.filter(item => item.id !== car.id));
            Toast.fire({ icon: 'success', title: 'PROTOCOLO_DE_BORRADO_COMPLETO' });
        }
    };

    const metrics = {
        totalAssets: fleet.length,
        avgPrice: fleet.length ? Math.round(fleet.reduce((acc, car) => acc + Number(car.price), 0) / fleet.length) : 0,
        avgKms: fleet.length ? Math.round(fleet.reduce((acc, car) => acc + Number(car.kms), 0) / fleet.length) : 0,
        aiValidated: fleet.filter(car => car.is_prediction).length
    };

    const filteredFleet = fleet.filter(car => 
        car.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.id.toString().includes(searchTerm)
    );

    const currentItems = filteredFleet.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-(--surface) flex flex-col md:flex-row overflow-x-hidden">
            <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />

            <main className="flex-1 bg-(--surface) p-4 md:p-8 overflow-y-auto relative scrollbar-hide">
                <div className="neural-glow"></div>
                
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-white/5 mb-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
                            <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter uppercase italic text-white">Fleet_Control_Center</h2>
                        </div>
                        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-(--secondary) font-bold opacity-80 italic">System_Status: Operational // Root_Access</p>
                    </div>
                    <motion.button onClick={() => openModal()} whileHover={{ scale: 1.02 }} className="btn-primary-engine flex items-center gap-3 px-8 py-3">
                        <Plus className="w-4 h-4" />
                        <span className="tracking-widest text-[11px]">Registrar_Activo</span>
                    </motion.button>
                </div>

                {/* METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
                    {[
                        { label: "Total_Activos", value: metrics.totalAssets, icon: Database, color: "text-(--secondary)" },
                        { label: "Valor_Medio", value: `${metrics.avgPrice.toLocaleString()}€`, icon: TrendingUp, color: "text-emerald-400" },
                        { label: "KM_Promedio", value: `${metrics.avgKms.toLocaleString()} KM`, icon: BarChart3, color: "text-amber-400" },
                        { label: "Predicciones_IA", value: metrics.aiValidated, icon: Activity, color: "text-purple-400" },
                    ].map((m, idx) => (
                        <div key={idx} className="glass-panel p-5 border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{m.label}</p>
                                <h3 className="text-2xl font-black font-headline tracking-tighter text-white">{m.value}</h3>
                            </div>
                            <div className={`p-3 bg-white/2 border border-white/5 ${m.color}`}><m.icon className="w-5 h-5" /></div>
                        </div>
                    ))}
                </div>

                {/* TABLE */}
                <div className="glass-panel rounded-sm border border-white/10 shadow-2xl relative overflow-hidden z-10 mb-20">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/2">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4 text-(--secondary)" />
                            <input 
                                type="text" placeholder="BUSCAR POR UID, MARCA O MODELO..." 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-(--surface-highest) text-[11px] pl-10 pr-4 py-3 rounded-xs font-mono text-white outline-none focus:border-(--secondary) transition-all uppercase"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left border-collapse min-w-200">
                            <thead className="bg-(--surface-lowest) text-(--on-surface-variant) uppercase tracking-[0.2em] border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-5">UID</th>
                                    <th className="px-6 py-5">Especificaciones</th>
                                    <th className="px-6 py-5 text-center">Registro</th>
                                    <th className="px-6 py-5 text-right">Valor</th>
                                    <th className="px-6 py-5 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-(--secondary)" /></td></tr>
                                ) : currentItems.map((car) => (
                                    <tr key={car.id} className="hover:bg-(--secondary)/5 transition-all">
                                        <td className="px-6 py-4 font-mono text-white/40">#{String(car.id).padStart(5, '0')}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[13px] text-white">{car.make} {car.model}</span>
                                                <span className="text-[9px] text-white/40 uppercase italic">{car.version}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-white font-mono">{new Date(car.registration).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-black text-white">{Number(car.price).toLocaleString()}€</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openModal(car)} className="p-2 bg-(--surface-high) text-white/20 hover:text-(--secondary)"><Settings className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDeleteCar(car)} className="p-2 bg-(--surface-high) text-white/20 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL CON FIX .toUpperCase() Y UNDEFINED */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-(--surface)/90 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-(--surface-low) border border-white/10 shadow-2xl">
                                <form onSubmit={handleSubmit} className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="font-headline text-2xl font-bold text-white uppercase italic">{editingCar ? 'Modificar_Activo' : 'Nuevo_Registro'}</h3>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white"><X /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            {/* MARCA */}
                                            <div>
                                                <label className="text-[10px] font-bold text-(--secondary) uppercase mb-2 block">01_Marca</label>
                                                <select required value={formData.make || ""} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)">
                                                    <option value="">SELECCIONAR...</option>
                                                    {makes.map((m, i) => {
                                                        const val = typeof m === 'object' ? m.name : m;
                                                        return <option key={i} value={val || ""}>{String(val || "").toUpperCase()}</option>
                                                    })}
                                                </select>
                                            </div>
                                            {/* MODELO */}
                                            <div>
                                                <label className="text-[10px] font-bold text-(--secondary) uppercase mb-2 block">02_Modelo</label>
                                                <select required disabled={!formData.make} value={formData.model || ""} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary) disabled:opacity-20">
                                                    <option value="">SELECCIONAR...</option>
                                                    {models.map((m, i) => {
                                                        const val = typeof m === 'object' ? m.name : m;
                                                        return <option key={i} value={val || ""}>{String(val || "").toUpperCase()}</option>
                                                    })}
                                                </select>
                                            </div>
                                            {/* VERSIÓN */}
                                            <div>
                                                <label className="text-[10px] font-bold text-(--secondary) uppercase mb-2 block">03_Versión</label>
                                                <select required disabled={!formData.model} value={formData.version || ""} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary) disabled:opacity-20">
                                                    <option value="">SELECCIONAR...</option>
                                                    {versions.map((v, i) => {
                                                        const val = typeof v === 'object' ? v.name : v;
                                                        return <option key={i} value={val || ""}>{String(val || "").toUpperCase()}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-white/40 uppercase mb-2 block">Año</label>
                                                    <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-white/40 uppercase mb-2 block">CV</label>
                                                    <input type="number" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-white/40 uppercase mb-2 block">Kilómetros</label>
                                                <input type="number" value={formData.kms} onChange={e => setFormData({...formData, kms: e.target.value})} className="w-full bg-(--surface-highest) p-3 text-xs text-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-(--secondary) uppercase mb-2 block">VALOR_MERCADO_€</label>
                                                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-(--secondary)/30 p-4 text-xl text-(--secondary) font-black outline-none text-center" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary-engine w-full mt-10 py-4 flex items-center justify-center gap-3">
                                        <Save className="w-4 h-4" />
                                        <span className="tracking-widest text-[11px] font-bold uppercase">{editingCar ? 'Ejecutar_Actualización' : 'Confirmar_Registro'}</span>
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}