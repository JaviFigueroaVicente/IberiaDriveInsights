import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  Search, Plus, Settings, Trash2, X, Activity, 
  TrendingUp, BarChart3, Database, Loader2, Save,
  ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar";
import { 
  getCars, 
  getMakes, 
  getModelsByMake, 
  getVersionsByModel,
  getGearTypes,
  getFuelTypes,
  updateCar,
  predictCar, 
  deleteCar   
} from "../../composables/cars"; 

export default function AdminCars({ currentUser, handleLogout }) {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 8;

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [versions, setVersions] = useState([]);
    const [gearTypes, setGearTypes] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    
    const [formData, setFormData] = useState({
        make: "", model: "", version: "", power: 0,
        fuel_type: "", gear_type: "", kms: 0, price: 0, registration: ""
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
        loadInitialSelects();
    }, []);

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

    const loadInitialSelects = async () => {
        try {
            const [makesData, gearData, fuelData] = await Promise.all([
                getMakes(),
                getGearTypes(),
                getFuelTypes()
            ]);
            setMakes(makesData || []);
            setGearTypes(gearData || []);
            setFuelTypes(fuelData || []);
        } catch (error) {
            console.error("Error al cargar maestros del servidor", error);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
                price: car.price,
                registration: car.registration || ""
            });
            
            const mods = await getModelsByMake(car.make);
            setModels(mods || []);
            const vers = await getVersionsByModel(car.model);
            setVersions(vers || []);
        } else {
            setEditingCar(null);
            setFormData({
                make: "", model: "", version: "", power: 0,
                fuel_type: "", gear_type: "", kms: 0, price: 0, registration: ""
            });
            setModels([]);
            setVersions([]);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const commonData = {
            make: String(formData.make),
            model: String(formData.model),
            version: String(formData.version),
            gear_type: String(formData.gear_type),
            fuel_type: String(formData.fuel_type),
            power: parseInt(formData.power, 10),
            kms: parseInt(formData.kms, 10),
            registration: formData.registration
        };

        try {
            if (editingCar) {
                const updatePayload = {
                    ...commonData,
                    id: editingCar.id,
                    price: parseInt(formData.price, 10)
                };
                const updatedCarFromServer = await updateCar(editingCar.id, updatePayload);
                setFleet(fleet.map(c => c.id === editingCar.id ? updatedCarFromServer : c));
                Toast.fire({ icon: 'success', title: 'Actualizado' });
            } else {
                const newCarFromServer = await predictCar(commonData);
                setFleet([newCarFromServer, ...fleet]);
                Toast.fire({ icon: 'success', title: 'Registrado' });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error en la operación del activo:", error);
            Toast.fire({ icon: 'error', title: 'Error al registrar' });
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
                popup: 'architecture-card border-none rounded-none p-5 sm:p-6 shadow-2xl max-w-[90%] sm:max-w-[320px]',
                title: 'font-headline italic tracking-tighter uppercase text-base sm:text-lg mb-2 text-white',
                htmlContainer: 'font-body opacity-60 text-[10px] sm:text-[11px] mb-6 uppercase tracking-widest',
                actions: 'flex flex-col sm:flex-row w-full gap-2 px-2', 
                confirmButton: 'btn-primary-engine w-full sm:flex-1 py-2 text-[10px] order-1 sm:order-2',
                cancelButton: 'bg-(--surface-highest) text-white font-headline w-full sm:flex-1 px-4 py-2 uppercase tracking-widest text-[10px] hover:bg-(--surface-high) transition-all rounded-xs order-2 sm:order-1'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteCar(car.id);
                setFleet(prev => prev.filter(item => item.id !== car.id));
                Toast.fire({ icon: 'success', title: 'Eliminado' });
            } catch (error) {
                console.error("Error al eliminar el activo:", error);
                Toast.fire({ icon: 'error', title: 'Error al borrar' });
            }
        }
    };

    const metrics = {
        totalAssets: fleet.length,
        avgPrice: fleet.length ? Math.round(fleet.reduce((acc, car) => acc + Number(car.price), 0) / fleet.length) : 0,
        avgKms: fleet.length ? Math.round(fleet.reduce((acc, car) => acc + Number(car.kms), 0) / fleet.length) : 0,
        aiValidated: fleet.filter(car => car.is_prediction).length
    };

    const filteredFleet = fleet.filter(car => 
        String(car.make_rel?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(car.model_rel?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(car.version_rel?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.id.toString().includes(searchTerm)
    );

    const sortedFleet = [...filteredFleet].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        let aValue, bValue;

        if (sortConfig.key === 'make') {
            aValue = a.make_rel?.nombre || '';
            bValue = b.make_rel?.nombre || '';
        } else if (sortConfig.key === 'registration') {
            aValue = a.registration ? new Date(a.registration).getTime() : 0;
            bValue = b.registration ? new Date(b.registration).getTime() : 0;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedFleet.length / itemsPerPage) || 1;
    const currentItems = sortedFleet.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const startRange = sortedFleet.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endRange = Math.min(currentPage * itemsPerPage, sortedFleet.length);

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-60 transition-opacity ml-1.5 inline-block" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ArrowUp className="w-3 h-3 text-(--secondary) ml-1.5 inline-block" />
            : <ArrowDown className="w-3 h-3 text-(--secondary) ml-1.5 inline-block" />;
    };

    const PaginationBtn = ({ text, icon: Icon, active, disabled, onClick }) => (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`font-headline px-2.5 sm:px-3 py-1.5 sm:py-2 uppercase tracking-widest text-[9px] sm:text-[10px] transition-all rounded-xs border flex items-center justify-center min-w-7 sm:min-w-8
                ${disabled ? 'opacity-20 cursor-not-allowed border-white/5 bg-transparent text-white/40' : 
                  active ? 'bg-(--secondary) border-(--secondary) text-black font-black shadow-[0_0_10px_var(--secondary)]' : 
                  'bg-(--surface-highest) border-white/5 text-white hover:bg-(--surface-high)'}`}
        >
            {Icon ? <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : text}
        </button>
    );

    return (
        <div className="min-h-screen bg-(--surface) flex flex-col lg:flex-row overflow-x-hidden">
            <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />

            <main className="flex-1 bg-(--surface) p-4 sm:p-6 lg:p-8 overflow-y-auto relative scrollbar-hide w-full">
                <div className="neural-glow"></div>
                
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/5 mb-6 sm:mb-10 relative z-10 w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="h-5 sm:h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
                            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter uppercase italic text-white">Fleet_Control_Center</h2>
                        </div>
                        <p className="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-(--secondary) font-bold opacity-80 italic">System_Status: Operational // Root_Access</p>
                    </div>
                    <motion.button onClick={() => openModal()} whileHover={{ scale: 1.02 }} className="btn-primary-engine flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="tracking-widest text-[10px] sm:text-[11px]">Registrar_Activo</span>
                    </motion.button>
                </div>

                {/* METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-10 relative z-10 w-full">
                    {[
                        { label: "Total_Activos", value: metrics.totalAssets, icon: Database, color: "text-(--secondary)" },
                        { label: "Valor_Medio", value: `${metrics.avgPrice.toLocaleString()}€`, icon: TrendingUp, color: "text-emerald-400" },
                        { label: "KM_Promedio", value: `${metrics.avgKms.toLocaleString()} KM`, icon: BarChart3, color: "text-amber-400" },
                        { label: "Predicciones_IA", value: metrics.aiValidated, icon: Activity, color: "text-purple-400" },
                    ].map((m, idx) => (
                        <div key={idx} className="glass-panel p-4 sm:p-5 border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{m.label}</p>
                                <h3 className="text-xl sm:text-2xl font-black font-headline tracking-tighter text-white">{m.value}</h3>
                            </div>
                            <div className={`p-2.5 sm:p-3 bg-white/2 border border-white/5 ${m.color}`}><m.icon className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                        </div>
                    ))}
                </div>

                {/* TABLE */}
                <div className="glass-panel rounded-sm border border-white/10 shadow-2xl relative z-10 mb-6 w-full overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-white/2">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4 text-(--secondary)" />
                            <input 
                                type="text" placeholder="BUSCAR POR UID, MARCA O MODELO..." 
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-(--surface-highest) text-[10px] sm:text-[11px] pl-10 pr-4 py-2.5 sm:py-3 rounded-xs font-mono text-white outline-none focus:border-(--secondary) transition-all uppercase"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <table className="w-full text-[11px] text-left border-collapse min-w-150 lg:min-w-full">
                            <thead className="bg-(--surface-lowest) text-(--on-surface-variant) uppercase tracking-[0.2em] border-b border-b-white/10">
                                <tr>
                                    <th onClick={() => requestSort('id')} className="px-4 sm:px-6 py-4 cursor-pointer select-none group hover:text-white transition-colors w-[10%]">
                                        UID {renderSortIcon('id')}
                                    </th>
                                    <th onClick={() => requestSort('make')} className="px-4 sm:px-6 py-4 cursor-pointer select-none group hover:text-white transition-colors w-[40%]">
                                        Especificaciones {renderSortIcon('make')}
                                    </th>
                                    <th className="px-4 py-4 text-center hidden md:table-cell w-[15%]">Configuración</th>
                                    <th onClick={() => requestSort('registration')} className="px-4 py-4 text-center hidden sm:table-cell w-[15%]">
                                        Registro {renderSortIcon('registration')}
                                    </th>
                                    <th onClick={() => requestSort('price')} className="px-4 sm:px-6 py-4 text-right cursor-pointer select-none group hover:text-white transition-colors w-[12%]">
                                        Valor {renderSortIcon('price')}
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center w-[8%]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-16 text-center"><Loader2 className="w-7 h-7 animate-spin mx-auto text-(--secondary)" /></td></tr>
                                ) : currentItems.length === 0 ? (
                                    <tr><td colSpan="6" className="p-10 text-center font-mono text-white/40 uppercase tracking-widest">No_Entities_Found</td></tr>
                                ) : currentItems.map((car) => (
                                    <tr key={car.id} className="hover:bg-(--secondary)/5 transition-all">
                                        <td className="px-4 sm:px-6 py-3.5 font-mono text-white/40">#{String(car.id).padStart(5, '0')}</td>
                                        <td className="px-4 sm:px-6 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[12px] sm:text-[13px] text-white">
                                                    {car.make_rel?.nombre} {car.model_rel?.nombre}
                                                </span>
                                                <span className="text-[9px] text-white/40 uppercase italic mt-0.5">
                                                    {car.version_rel?.nombre} — {car.power} CV
                                                    <span className="inline sm:hidden"> — {car.gear_rel?.nombre}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-center hidden md:table-cell">
                                            <div className="flex flex-col items-center">
                                                <span className="text-white uppercase font-mono text-[10px]">{car.fuel_rel?.nombre}</span>
                                                <span className="text-white/40 uppercase font-mono text-[9px]">{car.gear_rel?.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                                            <span className="text-white font-mono">
                                                {car.registration ? new Date(car.registration).toLocaleDateString() : "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right">
                                            <span className="font-black text-white">{Number(car.price).toLocaleString()}€</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5">
                                            <div className="flex justify-center gap-1.5">
                                                <button onClick={() => openModal(car)} className="p-2 bg-(--surface-high) text-white/20 hover:text-(--secondary) transition-colors"><Settings className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDeleteCar(car)} className="p-2 bg-(--surface-high) text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINACIÓN */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center bg-(--surface-low) px-6 sm:px-8 py-4 sm:py-5 rounded-sm border border-white/5 gap-4 relative z-10 w-full">
                    <p className="text-[9px] font-black text-(--on-surface-variant) uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-40 font-mono text-center sm:text-left">
                        Log_Range: {String(startRange).padStart(3, '0')}-{String(endRange).padStart(3, '0')} // Total_Entities: {filteredFleet.length.toLocaleString()}
                    </p>
                    <div className="flex gap-1.5 sm:gap-2 max-w-full overflow-x-auto">
                        <PaginationBtn text="<<" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
                        <PaginationBtn icon={ChevronLeft} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => page >= currentPage - 1 && page <= currentPage + 1)
                            .map((page) => (
                                <PaginationBtn 
                                    key={page}
                                    text={String(page)} 
                                    active={currentPage === page} 
                                    onClick={() => setCurrentPage(page)}
                                />
                            ))
                        }
                        <PaginationBtn icon={ChevronRight} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                        <PaginationBtn text=">>" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
                    </div>
                </div>

                {/* MODAL */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-(--surface)/90 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-(--surface-low) border border-white/10 shadow-2xl my-auto overflow-hidden rounded-xs">
                                <form onSubmit={handleSubmit} className="p-5 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                                    <div className="flex justify-between items-start mb-6 sm:mb-8">
                                        <h3 className="font-headline text-xl sm:text-2xl font-bold text-white uppercase italic">{editingCar ? 'Modificar_Activo' : 'Nuevo_Registro'}</h3>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white p-1 transition-colors"><X className="w-5 h-5" /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                                        <div className="space-y-4 sm:space-y-5">
                                            {/* MARCA */}
                                            <div>
                                                <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 sm:mb-2 block">01_Marca</label>
                                                <select required value={formData.make || ""} onChange={e => setFormData({...formData, make: e.target.value, model: "", version: ""})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)">
                                                    <option value="">SELECCIONAR...</option>
                                                    {makes.map((m) => (
                                                        <option key={m.id} value={m.id}>{String(m.nombre || "").toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* MODELO */}
                                            <div>
                                                <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 sm:mb-2 block">02_Modelo</label>
                                                <select required disabled={!formData.make} value={formData.model || ""} onChange={e => setFormData({...formData, model: e.target.value, version: ""})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary) disabled:opacity-20">
                                                    <option value="">SELECCIONAR...</option>
                                                    {models.map((m) => (
                                                        <option key={m.id} value={m.id}>{String(m.nombre || "").toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* VERSIÓN */}
                                            <div>
                                                <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 sm:mb-2 block">03_Versión</label>
                                                <select required disabled={!formData.model} value={formData.version || ""} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary) disabled:opacity-20">
                                                    <option value="">SELECCIONAR...</option>
                                                    {versions.map((v) => (
                                                        <option key={v.id} value={v.id}>{String(v.nombre || "").toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] sm:text-[10px] text-white/40 uppercase mb-1.5 sm:mb-2 block">Transmisión</label>
                                                    <select required value={formData.gear_type || ""} onChange={e => setFormData({...formData, gear_type: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)">
                                                        <option value="">ELEGIR...</option>
                                                        {gearTypes.map((g) => (
                                                            <option key={g.id} value={g.id}>{String(g.nombre || "").toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] sm:text-[10px] text-white/40 uppercase mb-1.5 sm:mb-2 block">Combustible</label>
                                                    <select required value={formData.fuel_type || ""} onChange={e => setFormData({...formData, fuel_type: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)">
                                                        <option value="">ELEGIR...</option>
                                                        {fuelTypes.map((f) => (
                                                            <option key={f.id} value={f.id}>{String(f.nombre || "").toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] sm:text-[10px] text-white/40 uppercase mb-1.5 sm:mb-2 block">Fecha Registro</label>
                                                    <input type="date" value={formData.registration} onChange={e => setFormData({...formData, registration: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white border border-white/5 outline-none focus:border-(--secondary)" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] sm:text-[10px] text-white/40 uppercase mb-1.5 sm:mb-2 block">CV</label>
                                                    <input type="number" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white border border-white/5 outline-none focus:border-(--secondary)" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase mb-1.5 sm:mb-2 block">Kilómetros</label>
                                                <input type="number" value={formData.kms} onChange={e => setFormData({...formData, kms: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 sm:p-3 text-xs text-white border border-white/5 outline-none focus:border-(--secondary)" />
                                            </div>
                                            <div>
                                                <label className="text-[9px] sm:text-[10px] text-(--secondary) uppercase mb-1.5 sm:mb-2 block">VALOR_MERCADO_€</label>
                                                <input 
                                                    type="number" 
                                                    disabled={!editingCar} 
                                                    placeholder="CALCULADO POR IA AL REGISTRAR" 
                                                    value={editingCar ? formData.price : ""} 
                                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                                    className="w-full bg-white/5 border border-(--secondary)/30 p-3 sm:p-4 text-lg sm:text-xl text-(--secondary) font-black outline-none text-center disabled:opacity-50 disabled:placeholder-white/20" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary-engine w-full mt-6 sm:mt-10 py-3 sm:py-4 flex items-center justify-center gap-3">
                                        <Save className="w-4 h-4" />
                                        <span className="tracking-widest text-[10px] sm:text-[11px] font-bold uppercase">{editingCar ? 'Ejecutar_Actualización' : 'Confirmar_Registro'}</span>
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