import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  Search, Settings, Trash2, X, Activity, 
  ShieldAlert, Database, Loader2, UserPlus, Save,
  ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Car
} from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar";
import { getUsers, registerUser, updateUser, deleteUser } from "../../composables/auth";

export default function UserRegistry({ currentUser, handleLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 8;

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Estados para el Modal Matricial de Identidad
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [backupPassword, setBackupPassword] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        surname: "",
        role: 2
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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data || []);
        } catch (error) {
            console.error("Error al sincronizar el registro de identidades:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getRoleMetadata = (roleNumber) => {
        switch(Number(roleNumber)) {
            case 0: 
                return { name: "ROOT_ADMIN", color: "text-(--secondary)", dot: "bg-(--secondary)", shadow: "shadow-[0_0_10px_var(--secondary)]" };
            case 1: 
                return { name: "SYSTEM_OPERATOR", color: "text-(--primary-container)", dot: "bg-(--primary-container)", shadow: "shadow-[0_0_10px_var(--primary-container)]" };
            default: 
                return { name: "BASIC_USER", color: "text-white/60", dot: "bg-white/20", shadow: "shadow-none" };
        }
    };

    // Apertura y reseteo del modal polivalente
    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setBackupPassword(user.password || "");
            setFormData({
                email: user.email,
                password: "",
                name: user.name || "",
                surname: user.surname || "",
                role: Number(user.role)
            });
        } else {
            setEditingUser(null);
            setBackupPassword("");
            setFormData({
                email: "",
                password: "",
                name: "",
                surname: "",
                role: 2
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingUser) {
                const updatePayload = {
                    email: formData.email,
                    name: formData.name,
                    surname: formData.surname,
                    role: Number(formData.role),
                    password: formData.password.trim() !== "" ? formData.password : backupPassword,
                    updated_at: new Date().toISOString()
                };

                const updatedData = await updateUser(editingUser.id, updatePayload);
                setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u));
                Toast.fire({ icon: 'success', title: 'Usuario Actualizado' });
            } else {
                // Validación estricta de contraseña en creación
                if (!formData.password) {
                    Toast.fire({ icon: 'error', title: 'Contraseña requerida' });
                    return;
                }
                const newIdentity = await registerUser({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    surname: formData.surname,
                    role: Number(formData.role)
                });
                setUsers([newIdentity, ...users]);
                Toast.fire({ icon: 'success', title: 'Usuario Creado' });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error en la operación de identidad:", error);
            Toast.fire({ icon: 'error', title: 'Error 422' });
        }
    };

    // Protocolo de eliminación segura
    const handleDeleteUser = async (user) => {
        if (user.id === currentUser?.id) {
            Swal.fire({
                title: 'OPERACIÓN_DENEGADA',
                text: 'No es posible revocar tu propio nodo de identidad activo.',
                icon: 'error',
                background: 'var(--surface)',
                color: 'var(--on-surface)'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'CONFIRMAR_REVOCACIÓN',
            text: `¿Deseas purgar la identidad USR-${String(user.id).padStart(5, '0')} (${user.name})?`,
            icon: 'warning',
            iconColor: 'var(--secondary)',
            showCancelButton: true,
            confirmButtonText: 'ELIMINAR_NODO',
            cancelButtonText: 'ABORTAR',
            background: 'var(--surface)',
            color: 'var(--on-surface)',
            backdrop: 'rgba(6, 14, 32, 0.8)',
            buttonsStyling: false,
            customClass: {
                popup: 'architecture-card border-none rounded-none p-6 shadow-2xl max-w-[90%] sm:max-w-[340px]',
                title: 'font-headline italic tracking-tighter uppercase text-base sm:text-lg mb-2 text-white',
                htmlContainer: 'font-body opacity-60 text-[11px] mb-6 uppercase tracking-widest',
                actions: 'flex flex-col sm:flex-row w-full gap-2 px-2', 
                confirmButton: 'btn-primary-engine w-full sm:flex-1 py-2 text-[10px] order-1 sm:order-2',
                cancelButton: 'bg-(--surface-highest) text-white font-headline w-full sm:flex-1 px-4 py-2 uppercase tracking-widest text-[10px] hover:bg-(--surface-high) transition-all rounded-xs order-2 sm:order-1'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(user.id);
                setUsers(prev => prev.filter(item => item.id !== user.id));
                Toast.fire({ icon: 'success', title: 'Usuario Eliminado' });
            } catch (error) {
                console.error("Error al eliminar identidad:", error);
                Toast.fire({ icon: 'error', title: 'Error al eliminar usuario' });
            }
        }
    };

    const filteredUsers = users.filter(user => 
        String(user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.surname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.id || '').includes(searchTerm)
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'cars_count') {
            aValue = a.cars ? a.cars.length : 0;
            bValue = b.cars ? b.cars.length : 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage) || 1;
    const currentItems = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startRange = sortedUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endRange = Math.min(currentPage * itemsPerPage, sortedUsers.length);

    const metrics = {
        totalUsers: users.length,
        totalAdmins: users.filter(u => Number(u.role) === 0).length,
        totalOperators: users.filter(u => Number(u.role) === 1).length,
        totalRegisteredCars: users.reduce((acc, u) => acc + (u.cars ? u.cars.length : 0), 0)
    };

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
            className={`font-headline px-3 py-2 uppercase tracking-widest text-[10px] transition-all rounded-xs border flex items-center justify-center min-w-8
                ${disabled ? 'opacity-20 cursor-not-allowed border-white/5 bg-transparent text-white/40' : 
                  active ? 'bg-(--secondary) border-(--secondary) text-black font-black shadow-[0_0_10px_var(--secondary)]' : 
                  'bg-(--surface-highest) border-white/5 text-white hover:bg-(--surface-high)'}`}
        >
            {Icon ? <Icon className="w-3.5 h-3.5" /> : text}
        </button>
    );

    return (
        <div className="min-h-screen bg-(--surface) flex flex-col md:flex-row">
            <AdminSideBar currentUser={currentUser} handleLogout={handleLogout} />

            <main className="flex-1 bg-(--surface) p-4 sm:p-6 lg:p-8 overflow-y-auto relative scrollbar-hide w-full">
                <div className="neural-glow"></div>
                
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/5 mb-6 sm:mb-10 relative z-10 w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="h-6 w-1 bg-(--secondary) shadow-[0_0_12px_var(--secondary)]"></div>
                            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter uppercase italic text-white">Identity_Control_Center</h2>
                        </div>
                        <p className="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-(--secondary) font-bold opacity-80 italic">Identity Management // Auth Protocol: MAD_SEC_04</p>
                    </div>
                    <motion.button onClick={() => openModal()} whileHover={{ scale: 1.02 }} className="btn-primary-engine flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span className="tracking-widest text-[10px] sm:text-[11px]">Crear_Identidad</span>
                    </motion.button>
                </div>

                {/* BENTO STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-10 relative z-10 w-full">
                    {[
                        { label: "Total_Identidades", value: metrics.totalUsers, icon: Database, color: "text-white" },
                        { label: "Nodos_Administradores", value: metrics.totalAdmins, icon: ShieldAlert, color: "text-(--secondary)" },
                        { label: "Operadores_Sistema", value: metrics.totalOperators, icon: Activity, color: "text-(--primary-container)" },
                        { label: "Activos_Registrados_Total", value: metrics.totalRegisteredCars, icon: Car, color: "text-emerald-400" },
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

                {/* TABLA PRINCIPAL */}
                <div className="glass-panel rounded-sm border border-white/10 shadow-2xl relative z-10 mb-6 w-full overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-white/2">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4 text-(--secondary)" />
                            <input 
                                type="text" placeholder="BUSCAR POR UID, NOMBRE O EMAIL..." 
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-(--surface-highest) text-[10px] sm:text-[11px] pl-10 pr-4 py-2.5 sm:py-3 rounded-xs font-mono text-white outline-none focus:border-(--secondary) transition-all uppercase"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <table className="w-full text-[11px] text-left border-collapse min-w-150 lg:min-w-full">
                            <thead className="bg-(--surface-lowest) text-(--on-surface-variant) uppercase tracking-[0.2em] border-b border-b-white/10">
                                <tr>
                                    <th onClick={() => requestSort('id')} className="px-4 sm:px-6 py-4 cursor-pointer select-none group hover:text-white transition-colors w-[15%]">
                                        Identity_UID {renderSortIcon('id')}
                                    </th>
                                    <th onClick={() => requestSort('name')} className="px-4 sm:px-6 py-4 cursor-pointer select-none group hover:text-white transition-colors w-[40%]">
                                        Operario / Credenciales {renderSortIcon('name')}
                                    </th>
                                    <th onClick={() => requestSort('role')} className="px-4 py-4 text-center w-[20%]">
                                        Tier_Role {renderSortIcon('role')}
                                    </th>
                                    <th onClick={() => requestSort('cars_count')} className="px-4 py-4 text-center hidden sm:table-cell w-[15%]">
                                        Registered_Assets {renderSortIcon('cars_count')}
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-center w-[10%]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-16 text-center"><Loader2 className="w-7 h-7 animate-spin mx-auto text-(--secondary)" /></td></tr>
                                ) : currentItems.length === 0 ? (
                                    <tr><td colSpan="5" className="p-10 text-center font-mono text-white/40 uppercase tracking-widest">No_Identities_Found</td></tr>
                                ) : currentItems.map((user) => {
                                    const roleMeta = getRoleMetadata(user.role);
                                    const carCount = user.cars ? user.cars.length : 0;
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-(--secondary)/5 transition-all">
                                            <td className="px-4 sm:px-6 py-4 text-white/40">#{String(user.id).padStart(5, '0')}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-4 font-body">
                                                    <div className="w-9 h-9 bg-(--surface-highest) rounded-xs border border-white/10 flex items-center justify-center text-(--secondary) font-headline font-black text-xs shadow-inner uppercase">
                                                        {user.name ? user.name.charAt(0) : 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] sm:text-[13px] font-black text-white tracking-tight leading-none mb-1">{user.name} {user.surname}</p>
                                                        <p className="text-[10px] text-(--on-surface-variant) opacity-40 font-mono tracking-tighter">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/2 border border-white/5 rounded-xs">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dot} ${roleMeta.shadow} animate-pulse`}></span>
                                                    <span className={`${roleMeta.color} text-[9px] font-black uppercase tracking-widest`}>{roleMeta.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center hidden sm:table-cell">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Car className={`w-3.5 h-3.5 ${carCount > 0 ? 'text-emerald-400' : 'text-white/20'}`} />
                                                    <span className={`font-bold ${carCount > 0 ? 'text-white' : 'text-white/40'}`}>{carCount} u.</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center">
                                                <div className="flex justify-center gap-1.5">
                                                    <button onClick={() => openModal(user)} className="p-2 bg-(--surface-high) text-white/20 hover:text-(--secondary) transition-colors rounded-xs"><Settings className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDeleteUser(user)} className="p-2 bg-(--surface-high) text-white/20 hover:text-red-500 transition-colors rounded-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINACIÓN */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center bg-(--surface-low) px-6 sm:px-8 py-4 sm:py-5 rounded-sm border border-white/5 gap-4 relative z-10 w-full">
                    <p className="text-[9px] font-black text-(--on-surface-variant) uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-40 font-mono text-center sm:text-left">
                        Log_Range: {String(startRange).padStart(3, '0')}-{String(endRange).padStart(3, '0')} // Total_Entities: {filteredUsers.length.toLocaleString()}
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

                {/* MODAL MATRICIAL DE IDENTIDAD (CREACIÓN / EDICIÓN) */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-(--surface)/90 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-(--surface-low) border border-white/10 shadow-2xl my-auto overflow-hidden rounded-xs">
                                <form onSubmit={handleSubmit} className="p-5 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="font-headline text-xl sm:text-2xl font-bold text-white uppercase italic">{editingUser ? 'Modificar_Nodo' : 'Nueva_Identidad'}</h3>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white p-1 transition-colors"><X className="w-5 h-5" /></button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 block">01_Nombre</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)" />
                                        </div>

                                        <div>
                                            <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 block">02_Apellidos</label>
                                            <input required type="text" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)" />
                                        </div>

                                        <div>
                                            <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 block">03_Email Corporativo</label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)" />
                                        </div>

                                        <div>
                                            <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 block">
                                                04_Llave Acceso (Contraseña)
                                            </label>
                                            <input 
                                                type="password" 
                                                required={!editingUser} 
                                                placeholder={editingUser ? "DEJAR EN BLANCO PARA USAR LA CONTRASEÑA ANTERIOR..." : "MÍNIMO 6 CARACTERES"}
                                                value={formData.password} 
                                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                                className="w-full bg-(--surface-highest) p-2.5 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)" 
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[9px] sm:text-[10px] font-bold text-(--secondary) uppercase mb-1.5 block">05_Nivel de Acceso (Role Tier)</label>
                                            <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-(--surface-highest) p-2.5 text-xs text-white outline-none border border-white/5 focus:border-(--secondary)">
                                                <option value={2}>Usuario Básico</option>
                                                <option value={1}>Administrador</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary-engine w-full mt-8 py-3 flex items-center justify-center gap-3">
                                        <Save className="w-4 h-4" />
                                        <span className="tracking-widest text-[10px] font-bold uppercase">{editingUser ? 'Actualizar_Identidad' : 'Grabar_Identidad'}</span>
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