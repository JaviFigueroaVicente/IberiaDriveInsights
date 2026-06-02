import { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import DirectionsCar from '../../assets/icons/directions_car.svg';
import FilterList from '../../assets/icons/filter_list.svg';
import CalendarMonth from '../../assets/icons/calendar_month.svg';
import Payments from '../../assets/icons/payments.svg';
import Search from '../../assets/icons/search.svg';
import Download from '../../assets/icons/download.svg';
import Share from '../../assets/icons/share.svg';
import ChevronRight from '../../assets/icons/chevron_right.svg';
import TrendingUp from '../../assets/icons/trending_up.svg';

import { getMyCars } from "../../composables/cars";

const ChevronLeftIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);
const XIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PaginationBtn = ({ text, icon: Icon, active, disabled, onClick }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`h-8 min-w-8 px-2 flex items-center justify-center rounded-xs font-mono text-[10px] uppercase tracking-wider border transition-all duration-150 cursor-pointer
            ${disabled 
                ? 'opacity-20 cursor-not-allowed border-white/5 text-(--on-surface)' 
                : active 
                    ? 'bg-white text-black border-white font-black' 
                    : 'bg-white/5 text-(--on-surface) border-white/5 hover:bg-white/10 hover:border-white/20'
            }`}
    >
        {Icon ? <Icon /> : text}
    </button>
);

export default function MyPredictions({ currentUser, handleLogout }) {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    // Estados de filtrado vinculados a los inputs
    const [filterBrand, setFilterBrand] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterPrice, setFilterPrice] = useState("");
    const [filterSearch, setFilterSearch] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchPredictions = async () => {
            setIsLoading(true);
            try {
                const data = await getMyCars();
                setPredictions(data || []);
            } catch (error) {
                console.error("Error syncing with neural engine API:", error);
                setPredictions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPredictions();
    }, []);

    const hasActiveFilters = filterBrand !== "" || filterYear !== "" || filterPrice !== "" || filterSearch !== "";

    const handleResetFilters = () => {
        setFilterBrand("");
        setFilterYear("");
        setFilterPrice("");
        setFilterSearch("");
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    // Filtrado lógico basado en las propiedades de las relaciones cargadas
    const filteredPredictions = predictions.filter(car => {
        const makeName = car.make_rel?.nombre || '';
        const modelName = car.model_rel?.nombre || '';
        const versionName = car.version_rel?.nombre || '';
        const fullRegistrationDate = car.registration ? new Date(car.registration) : null;
        const registrationYear = fullRegistrationDate ? String(fullRegistrationDate.getFullYear()) : '';

        // Comprobación de texto sobre los nombres reales resueltos por el backend
        const matchesSearch = filterSearch === "" || 
            modelName.toLowerCase().includes(filterSearch.toLowerCase()) ||
            versionName.toLowerCase().includes(filterSearch.toLowerCase());
            
        const matchesPrice = filterPrice === "" || 
            Number(car.price) <= Number(filterPrice);

        const matchesYear = filterYear === "" || 
            registrationYear.includes(filterYear);

        const matchesBrand = filterBrand === "" || 
            makeName.toLowerCase().includes(filterBrand.toLowerCase());

        return matchesSearch && matchesPrice && matchesYear && matchesBrand;
    });

    const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage) || 1;
    
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [filteredPredictions.length, totalPages, currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPredictions.slice(indexOfFirstItem, indexOfLastItem);

    const startRange = filteredPredictions.length === 0 ? 0 : indexOfFirstItem + 1;
    const endRange = Math.min(indexOfLastItem, filteredPredictions.length);

    return (
        <div className="flex items-start min-h-screen bg-(--surface) text-(--on-surface) selection:bg-(--primary-container) selection:text-white">
            <SideBar currentUser={currentUser} onLogout={handleLogout}/>
            
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden p-8 max-w-7xl mx-auto w-full space-y-12">
                <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
                <div className="p-6 relative z-10 w-full">
                    
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-(--secondary)"></span>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-(--secondary)">
                                    ARCHIVO DE VEHÍCULOS
                                </p>
                            </div>
                            <h1 className="font-headline text-4xl font-bold tracking-tight mb-2 text-white uppercase">
                                MIS <span className="text-(--primary-container)">PREDICCIONES</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button 
                                onClick={() => window.location.href = '/predict'} 
                                className="btn-primary-engine flex items-center gap-2 px-5 py-2.5 tracking-widest text-[10px]"
                            >
                                <span className='tracking-widest'>NUEVA PREDICCIÓN</span>
                                <img src={ChevronRight} alt="Nav" className="w-3.5 h-3.5 invert" />
                            </button>

                            <div className="flex items-center gap-2 bg-(--surface-container-high) p-1 rounded-sm border border-white/5">
                                <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs cursor-pointer ${viewMode === 'list' ? 'bg-(--surface-highest) text-(--primary)' : 'text-(--on-surface-variant) hover:text-white'}`}>
                                    LISTA
                                </button>
                                <button onClick={() => setViewMode('grid')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs cursor-pointer ${viewMode === 'grid' ? 'bg-(--surface-highest) text-(--primary)' : 'text-(--on-surface-variant) hover:text-white'}`}>
                                    VISUAL
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Controles de Filtros Corregidos y Vinculados */}
                    <section className="flex flex-col space-y-3 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            
                            {/* Input: Marca (Texto) */}
                            <div className="bg-(--surface-low) border border-white/5 rounded-xs p-1 flex items-center group focus-within:border-white/20 focus-within:bg-(--surface-container-low) transition-all">
                                <div className="p-2 shrink-0 opacity-40 group-focus-within:opacity-100 transition-opacity">
                                    <img src={FilterList} alt="Brand" className="w-4 h-4" />
                                </div>
                                <input 
                                    value={filterBrand} 
                                    onChange={(e) => { setFilterBrand(e.target.value); setCurrentPage(1); }} 
                                    placeholder="Marca" 
                                    className="bg-transparent border-none text-[10px] text-white w-full focus:ring-0 font-mono font-bold tracking-widest placeholder:text-(--on-surface-variant)/30 outline-none uppercase py-1" 
                                />
                            </div>

                            {/* Input: Año (Número) */}
                            <div className="bg-(--surface-low) border border-white/5 rounded-xs p-1 flex items-center group focus-within:border-white/20 focus-within:bg-(--surface-container-low) transition-all">
                                <div className="p-2 shrink-0 opacity-40 group-focus-within:opacity-100 transition-opacity">
                                    <img src={CalendarMonth} alt="Year" className="w-4 h-4" />
                                </div>
                                <input 
                                    type="number"
                                    value={filterYear} 
                                    onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }} 
                                    placeholder="Año" 
                                    className="bg-transparent border-none text-[10px] text-white w-full focus:ring-0 font-mono font-bold tracking-widest placeholder:text-(--on-surface-variant)/30 outline-none uppercase py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                />
                            </div>

                            {/* Input: Presupuesto Máximo (Número) */}
                            <div className="bg-(--surface-low) border border-white/5 rounded-xs p-1 flex items-center group focus-within:border-white/20 focus-within:bg-(--surface-container-low) transition-all">
                                <div className="p-2 shrink-0 opacity-40 group-focus-within:opacity-100 transition-opacity">
                                    <img src={Payments} alt="Max Price" className="w-4 h-4" />
                                </div>
                                <input 
                                    type="number" 
                                    value={filterPrice} 
                                    onChange={(e) => { setFilterPrice(e.target.value); setCurrentPage(1); }} 
                                    placeholder="Precio Máximo" 
                                    className="bg-transparent border-none text-[10px] text-white w-full focus:ring-0 font-mono font-bold tracking-widest placeholder:text-(--on-surface-variant)/30 outline-none uppercase py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                />
                            </div>

                            {/* Input: Modelo o Especificación (Texto) */}
                            <div className="bg-(--surface-low) border border-white/5 rounded-xs p-1 flex items-center group focus-within:border-white/20 focus-within:bg-(--surface-container-low) transition-all">
                                <div className="p-2 shrink-0 opacity-40 group-focus-within:opacity-100 transition-opacity">
                                    <img src={Search} alt="Search" className="w-4 h-4" />
                                </div>
                                <input 
                                    value={filterSearch} 
                                    onChange={(e) => { setFilterSearch(e.target.value); setCurrentPage(1); }} 
                                    placeholder="Modelo" 
                                    className="bg-transparent border-none text-[10px] text-white w-full focus:ring-0 font-mono font-bold tracking-widest placeholder:text-(--on-surface-variant)/30 outline-none uppercase py-1" 
                                />
                            </div>
                        </div>

                        {/* Botón de reinicio de filtros */}
                        <div className={`overflow-hidden transition-all duration-300 ${hasActiveFilters ? 'h-8 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-red-500/10 text-(--on-surface-variant) hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xs transition-all font-mono text-[9px] uppercase tracking-widest cursor-pointer"
                                >
                                    <XIcon />
                                    <span className="font-bold animate-pulse">Restablecer Filtros</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Listado de Tarjetas */}
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50 col-span-full">
                                <div className="w-12 h-12 border-2 border-(--secondary)/20 border-t-(--secondary) rounded-full animate-spin mb-4" />
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Cargando Vehículos...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((car) => (
                                <div key={car.id} className="group relative bg-(--surface-low) hover:bg-(--surface-container) transition-all duration-300 rounded-sm border-l-2 border-(--secondary) overflow-hidden border-t border-r border-b">
                                    <div className={`flex gap-6 p-4 ${viewMode === 'grid' ? 'flex-col items-start' : 'flex-col lg:flex-row items-center'}`}>
                                        <div className={`rounded-sm bg-(--surface-highest) overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 border border-white/10 shrink-0 ${viewMode === 'grid' ? 'w-full h-40' : 'w-full lg:w-48 h-32'}`}>
                                            <div className="absolute inset-0 bg-linear-to-br from-(--primary)/20 to-transparent" />
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                <img src={DirectionsCar} alt="Vehicle preview" className="w-full h-full object-contain opacity-90" />
                                            </div>
                                            <div className="absolute bottom-2 left-2">
                                                <span className="bg-(--secondary) text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-xs shadow-lg">VEHÍCULO</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">
                                                    Información General
                                                </p>
                                                <h3 className="text-white font-headline text-lg font-bold">
                                                    {car.make_rel?.nombre || "DESCONOCIDO"} {car.model_rel?.nombre || ""}
                                                </h3>
                                                <p className="text-(--on-surface-variant) text-[10px] font-mono uppercase opacity-80 mt-0.5">
                                                    {car.version_rel?.nombre || "DESCONOCIDO"}
                                                </p>
                                                <p className="text-[8px] text-(--on-surface-variant) mt-1 uppercase tracking-tight font-mono">
                                                    Matriculado: {formatDate(car.registration)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">
                                                    Potencia y Especificaciones
                                                </p>
                                                <h4 className="text-white font-headline text-sm font-bold mt-1 uppercase tracking-wider">
                                                    {car.gear_rel?.nombre || 'Transmission'} • {car.power} CV
                                                </h4>
                                                <div className="flex items-center gap-1 text-[9px] text-(--primary) font-mono font-bold mt-1.5">
                                                    <img className="w-3 h-3" src={TrendingUp} alt="Engine" />
                                                    <span className="uppercase">{car.fuel_rel?.nombre || 'Engine Tier'}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">
                                                    Evaluación Y Rendimiento
                                                </p>
                                                <p className="text-white font-headline text-2xl font-black tracking-tighter">
                                                    €{Number(car.price).toLocaleString()}
                                                </p>
                                                <p className="text-(--secondary) text-[10px] font-mono uppercase font-bold tracking-wider mt-1">
                                                    {Number(car.kms).toLocaleString()} KMS
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex justify-between items-end gap-4 shrink-0 ${viewMode === 'grid' ? 'w-full border-t border-white/5 pt-3' : 'flex-col w-full lg:w-auto'}`}>
                                            <p className={`text-[9px] text-(--on-surface-variant) font-mono opacity-60 ${viewMode === 'grid' ? 'text-left' : 'text-right'}`}>
                                                ID-{car.id}
                                            </p>
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-(--surface-highest) hover:bg-(--primary)/20 text-(--on-surface-variant) hover:text-(--primary) transition-colors rounded-xs border border-white/5 cursor-pointer">
                                                    <img src={Download} alt="Download" className="w-3.5 h-3.5"/>
                                                </button>
                                                <button className="p-2 bg-(--surface-highest) hover:bg-(--secondary)/20 text-(--on-surface-variant) hover:text-(--secondary) transition-colors rounded-xs border border-white/5 cursor-pointer">
                                                    <img src={Share} alt="Share" className="w-3.5 h-3.5"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-(--surface-low) border border-dashed border-white/10 rounded-sm col-span-full">
                                <p className="text-(--on-surface-variant) text-xs uppercase tracking-widest">No hay coches con estas especificaciones.</p>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center bg-(--surface-low) px-6 sm:px-8 py-4 sm:py-5 rounded-sm border border-white/5 gap-4 relative z-10 w-full">
                        <p className="text-[9px] font-black text-(--on-surface-variant) uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-40 font-mono text-center sm:text-left">
                            Rango: {String(startRange).padStart(3, '0')}-{String(endRange).padStart(3, '0')} // Coches Totales: {filteredPredictions.length.toLocaleString()}
                        </p>
                        <div className="flex gap-1.5 sm:gap-2 max-w-full overflow-x-auto">
                            <PaginationBtn text="<<" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
                            <PaginationBtn icon={ChevronLeftIcon} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                            <PaginationBtn icon={ChevronRightIcon} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                            <PaginationBtn text=">>" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}