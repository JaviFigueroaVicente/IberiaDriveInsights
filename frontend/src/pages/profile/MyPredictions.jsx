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

export default function MyPredictions({ currentUser, handleLogout}) {
    // 01. Structural Logic: State for predictions and UI controls
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    useEffect(() => {
        // Simulación de fetch inicial (Integrar con services/cars.js luego)
        const fetchPredictions = async () => {
            setIsLoading(true);
            try {
                // Simulando delay de red para efectos de carga "Cyber"
                setTimeout(() => {
                    const mockData = [
                        {
                            id: 1,
                            make: "BMW",
                            model: "M4 Competition",
                            version: "S58 Engine Pack",
                            price: 84500,
                            kms: 12400,
                            registration: "2023-05-15",
                            created_at: "2026-04-10T14:22:00",
                            confidence: 98.4
                        },
                        {
                            id: 2,
                            make: "Tesla",
                            model: "Model S",
                            version: "Plaid Dual Motor",
                            price: 62400,
                            kms: 28000,
                            registration: "2022-11-20",
                            created_at: "2026-04-08T11:05:00",
                            confidence: 95.7
                        }
                    ];
                    setPredictions(mockData);
                    setIsLoading(false);
                }, 1200);
            } catch (error) {
                console.error("Error syncing with neural engine:", error);
                setIsLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    // Helper para formatear fechas del backend
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    const filterConfig = [
        { label: 'Status', icon: FilterList },
        { label: 'Date Range', icon: CalendarMonth },
        { label: 'Price', icon: Payments },
        { label: 'Model Search', icon: Search

         },
    ];

    return (
        <div className="flex items-start min-h-screen bg-(--surface) text-(--on-surface) selection:bg-(--primary-container) selection:text-white">
            <SideBar currentUser={currentUser} onLogout={handleLogout}/>
            
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden p-8 max-w-7xl mx-auto w-full space-y-12">
                
                {/* Ambient Kinetic Background */}
                <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none " />

                <div className="p-6">
                    {/* 01. Header Section */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-headline text-4xl font-bold tracking-tight mb-2 text-white uppercase">
                                My Predictions
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-12 bg-(--secondary) opacity-50"></span>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-(--on-surface-variant) font-bold">
                                    Valuation Archive & Performance Log
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-(--surface-container-high) p-1 rounded-sm border border-white/5">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs cursor-pointer ${viewMode === 'list' ? 'bg-(--surface-highest) text-(--primary)' : 'text-(--on-surface-variant) hover:text-white'}`}
                            >
                                List View
                            </button>
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xs cursor-pointer ${viewMode === 'grid' ? 'bg-(--surface-highest) text-(--primary)' : 'text-(--on-surface-variant) hover:text-white'}`}
                            >
                                Visual Grid
                            </button>
                        </div>
                    </header>

                    {/* 02. Filters Bar */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {filterConfig.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-(--surface-low) border border-white/5 rounded-sm p-1 flex items-center group focus-within:border-(--secondary)/50 transition-all"
                            >
                                <div className="p-2 shrink-0">
                                    <img 
                                        src={item.icon} 
                                        alt={item.label} 
                                        className="w-5 h-5 object-contain opacity-50 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                                <input 
                                    placeholder={item.label.toUpperCase()} 
                                    className="bg-transparent border-none text-[10px] text-white w-full focus:ring-0 font-bold tracking-widest placeholder:text-(--on-surface-variant)/50 outline-none"
                                />
                            </div>
                        ))}
                    </section>

                    {/* 03. Data Display Section */}
                    <div className="space-y-4">
                        {isLoading ? (
                            // Loading State (Cyber Style)
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <div className="w-12 h-12 border-2 border-(--secondary)/20 border-t-(--secondary) rounded-full animate-spin mb-4" />
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Synchronizing Neural Logs...</p>
                            </div>
                        ) : predictions.length > 0 ? (
                            predictions.map((car) => (
                                <div 
                                    key={car.id}
                                    className="group relative bg-(--surface-low) hover:bg-(--surface-container) transition-all duration-300 rounded-sm border-l-2 border-(--secondary) overflow-hidden border-t border-r border-b"
                                >
                                    <div className="flex flex-col lg:flex-row items-center gap-6 p-4">
                                        {/* Car Preview Image Placeholder */}
                                        <div className="w-full lg:w-48 h-32 rounded-sm bg-(--surface-highest) overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 border border-white/10">
                                            <div className="absolute inset-0 bg-linear-to-br from-(--primary)/20 to-transparent" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <img src={DirectionsCar} alt="Vehicle preview" className="w-full h-full object-contain opacity-90" />
                                            </div>
                                            <div className="absolute bottom-2 left-2">
                                                <span className="bg-(--secondary) text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-xs shadow-lg">LATEST</span>
                                            </div>
                                        </div>

                                        {/* Data Grid Mapping from Backend Schema */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">Vehicle Blueprint</p>
                                                <h3 className="text-white font-headline text-lg font-bold">{car.make} {car.model}</h3>
                                                <p className="text-(--secondary) text-[10px] font-mono uppercase opacity-80">{car.version} • {car.kms.toLocaleString()} KM</p>
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">Precision Valuation</p>
                                                <p className="text-white font-headline text-2xl font-black tracking-tighter">€{car.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-1 text-[9px] text-(--primary) font-bold">
                                                    <img className="material-symbols-outlined" src={TrendingUp} alt="Check" />
                                                    <span>ALIGNED WITH MARKET</span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-(--on-surface-variant) tracking-widest mb-1">Model Confidence</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1 bg-(--surface-highest) rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-(--secondary) shadow-[0_0_8px_var(--secondary)] transition-all duration-1000" 
                                                            style={{ width: `${car.confidence}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-(--secondary) font-headline font-bold text-xs">{car.confidence}%</p>
                                                </div>
                                                <p className="text-[8px] text-(--on-surface-variant) mt-1 uppercase tracking-tight">Neural Engine Verified</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex lg:flex-col justify-between items-end gap-2 w-full lg:w-auto">
                                            <p className="text-[9px] text-(--on-surface-variant) font-mono text-right opacity-60">
                                                {formatDate(car.created_at)}<br/>
                                                PX-{car.id}-KINETIC
                                            </p>
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-(--surface-highest) hover:bg-(--primary)/20 text-(--on-surface-variant) hover:text-(--primary) transition-colors rounded-xs border border-white/5 cursor-pointer">
                                                    <img src={Download} alt="Download" className="material-symbols-outlined"/>
                                                </button>
                                                <button className="p-2 bg-(--surface-highest) hover:bg-(--secondary)/20 text-(--on-surface-variant) hover:text-(--secondary) transition-colors rounded-xs border border-white/5 cursor-pointer">
                                                    <img src={Share} alt="Share" className="material-symbols-outlined "/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Empty State
                            <div className="text-center py-20 bg-(--surface-low) border border-dashed border-white/10 rounded-sm">
                                <p className="text-(--on-surface-variant) text-xs uppercase tracking-widest">No predictions found in local logs.</p>
                            </div>
                        )}
                    </div>

                    {/* 04. Footer / Pagination */}
                    <footer className="mt-8 flex justify-between items-center text-(--on-surface-variant) p-4 bg-(--surface-low) border border-white/5 rounded-sm">
                        <p className="text-[9px] uppercase tracking-widest font-bold">Showing {predictions.length} of {predictions.length} entries</p>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-xs bg-(--surface-highest) text-white text-[10px] font-bold border border-white/10">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-xs bg-(--surface-low) text-(--on-surface-variant) text-[10px] hover:text-white cursor-pointer transition-all border border-white/5">
                                <img src={ChevronRight} className="material-symbols-outlined"/>
                            </button>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};