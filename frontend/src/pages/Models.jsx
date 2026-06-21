import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Database from "../assets/icons/database.svg";
import Description from "../assets/icons/description.svg";
import FactCheck from "../assets/icons/fact_check.svg";
import Memory from "../assets/icons/memory.svg";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

const FadeInWhenVisible = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.02 });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const MetricBox = ({ label, value }) => (
  <motion.div 
    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
    className="metric-tile min-w-0 flex flex-col justify-center h-14 px-3 bg-white/2 border border-white/5 rounded-xs transition-colors duration-200"
  >
    <p className="text-[7px] uppercase text-(--on-surface-variant) tracking-widest mb-0.5 opacity-60 truncate">
      {label}
    </p>
    <p className="text-[10px] font-bold text-white uppercase truncate">
      {value}
    </p>
  </motion.div>
);

const ArchitectureCard = ({ number, title, subtitle, description, badge, metrics, className = "" }) => (
  <motion.div 
    variants={itemVariants} 
    whileHover={{ 
      y: -6, 
      borderColor: "rgba(255, 255, 255, 0.15)",
      boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)"
    }}
    className={`architecture-card p-6 md:p-8 flex flex-col justify-between group min-w-0 bg-(--surface-container)/20 border border-white/5 rounded-sm transition-all duration-300 ease-out ${className}`}
  >
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-4xl lg:text-5xl font-bold step-number leading-none text-white/30 group-hover:text-(--secondary) transition-colors duration-300">
          {number}
        </span>
        {badge && (
          <span className="data-chip uppercase tracking-[0.15em] text-[8px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white/90">
            {badge}
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-(--secondary) text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5 truncate">{subtitle}</p>
        <h3 className="text-lg lg:text-xl font-bold font-headline uppercase tracking-tight text-white group-hover:text-(--secondary) transition-colors duration-300 truncate">
          {title}
        </h3>
      </div>
      
      <p className="text-(--on-surface-variant) leading-relaxed text-xs lg:text-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300 pb-4">
        {description}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 w-full">
      {metrics.map((m, i) => (
        <MetricBox key={i} label={m.label} value={m.value} />
      ))}
    </div>
  </motion.div>
);

export default function Models() {
  return (
    <div className="min-h-screen bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots px-4 md:px-10 py-8 flex flex-col justify-between overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 grow justify-between">
        
        <div className="flex flex-col gap-8 w-full">
          
          {/* HEADER */}
          <motion.header 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ delay: 0.15, duration: 0.25 }}
                    className="h-px bg-(--secondary)"
                  ></motion.span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-(--secondary) uppercase whitespace-nowrap">
                    Ecosistema: Arquitectura de Inferencia
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                  Lógica del <span className="text-(--primary-container) inline-block relative">Motor Predictivo</span>
                </h1>
              </div>

              <motion.div 
                layout
                whileHover={{ scale: 1.02 }}
                className="bg-black/20 px-4 py-2.5 border border-white/5 rounded-xs backdrop-blur-xs w-full sm:min-w-48 sm:w-auto transition-all hover:border-(--secondary)/20 block shrink-0"
              >
                <p className="text-[8px] font-mono text-[#bec8d2]/40 uppercase mb-0.5">System Health</p>
                <p className="text-[10px] font-bold text-(--secondary) tracking-widest uppercase flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-(--secondary) rounded-full animate-pulse shadow-[0_0_8px_var(--secondary)]"></span>
                  Estable
                </p>
              </motion.div>
            </div>

            <div className="mt-4">
              <p className="max-w-4xl text-[10px] md:text-[11px] text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-75">
                Evaluación mediante dos modelos independientes: análisis estructural de patrones históricos (<span className="text-white font-bold">Kaggle pre-2018</span>) y corrección por fluctuaciones dinámicas mediante captura en tiempo real (<span className="text-white font-bold">Web Scraping</span>).
              </p>
            </div>
          </motion.header>

          {/* TARJETAS BENTO */}
          {/* Adaptado a grid-cols-1 en móviles y md:grid-cols-2 para asegurar la renderización perfecta de ambas tarjetas sin solapamientos */}
          <FadeInWhenVisible className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
            <ArchitectureCard 
              className="col-span-1" 
              number="01" 
              subtitle="Modelo de Datos Volátiles" 
              title="Gradient Boosting (XGBoost)" 
              badge="Dataset Scrap" 
              description="Entrenado exclusivamente con datos dinámicos obtenidos mediante técnicas de Web Scraping automatizado. Captura las fluctuaciones de oferta, demanda y depreciación en tiempo real del mercado actual." 
              metrics={[
                { label: 'Algoritmo', value: 'XGBoost Regression' }, 
                { label: 'Muestra Total', value: '2.964 vehículos' }, 
                { label: 'Estimadores', value: '500 Árboles' }, 
                { label: 'Profundidad', value: 'Max-Depth 5' }
              ]} 
            />
            <ArchitectureCard 
              className="col-span-1" 
              number="02" 
              subtitle="Modelo de Datos Históricos" 
              title="Random Forest (Kaggle)" 
              badge="Dataset Kaggle" 
              description="Entrenado de forma independiente con datos estáticos de la plataforma Kaggle. Este modelo proporciona la línea base estructural del mercado basándose estrictamente en registros históricos consolidados hasta el año 2018." 
              metrics={[
                { label: 'Algoritmo', value: 'Random Forest' }, 
                { label: 'Muestra Total', value: '83.996 vehículos' }, 
                { label: 'Estimadores', value: '200 Árboles' }, 
                { label: 'Profundidad', value: '30 Niveles' }
              ]} 
            />            
          </FadeInWhenVisible>

          {/* PIPELINE */}
          <FadeInWhenVisible className="w-full flex-none mt-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-(--secondary) text-[9px] font-bold uppercase tracking-[0.4em] mb-0.5">Workflow Terminal</span>
                <h2 className="text-xl font-bold font-headline uppercase tracking-tight text-white">Pipeline de Procesamiento</h2>
              </div>
            </div>
            
            {/* Grid adaptativo para el pipeline de pasos del flujo de trabajo de 1, 2 a 4 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {[
                { id: '01', step: 'Ingesta Activa', desc: 'Extracción de Datos de Datos Mediante WebScraping y Datos Abiertos.', status: 'Completado', img: Database },
                { id: '02', step: 'Normalización', desc: 'Escalado de variables y tratamiento de valores nulos o erróneos.', status: 'Completado', img: FactCheck },                  
                { id: '03', step: 'Entrenamiento', desc: 'Entrenamiento mediante XGBoost y Random Forest.', status: 'Completado', img: Memory },
                { id: '04', step: 'Entrega de Informe', desc: 'Generación de un precio con validación de confianza.', status: 'Completado', img: Description }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(255,255,255,0.15)", transition: { duration: 0.2 } }}
                  className="bg-(--surface-container)/50 backdrop-blur-xs border border-white/5 p-5 rounded-sm relative z-10 group transition-all duration-300 flex flex-col justify-between min-w-0 min-h-39"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-8 h-8 rounded-xs flex items-center justify-center border border-white/10 bg-white/2 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.step}
                          className="w-4 h-4 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-115 transition-all duration-300"
                        />
                      </div>
                      <span className="font-mono text-[9px] text-white/20 group-hover:text-(--secondary)/50 transition-colors duration-300">
                        PASO {item.id}
                      </span>
                    </div>

                    <h4 className="text-white text-[11px] font-bold uppercase mb-1 tracking-widest group-hover:text-(--secondary) transition-colors duration-300 truncate">
                      {item.step}
                    </h4>
                    <p className="text-[10px] text-(--on-surface-variant) leading-normal opacity-70 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-(--secondary) transition-colors duration-300"></div>
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInWhenVisible>
        </div>

        {/* FOOTER DE ACCIÓN */}
        <motion.div 
          className="w-full flex-none mt-4"
          initial={{ opacity: 0, y: 24 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} 
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <footer className="bg-(--surface-container) p-5 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 rounded-sm">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="text-left sm:text-right border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-6 block shrink-0 w-full sm:w-auto">
                <p className="text-[8px] text-white/30 uppercase font-mono leading-none mb-0.5">System Health</p>
                <p className="text-[11px] text-white/70 font-bold font-mono tracking-tighter uppercase">99.98% Stable</p>
              </div>
              <div className="max-w-md hidden md:block">
                <h3 className="text-white font-bold uppercase text-xs mb-0.5 tracking-tight">¿Listo para procesar una unidad?</h3>
                <p className="text-[10px] text-(--on-surface-variant) uppercase opacity-60">El motor de inferencia está listo para recibir nuevos parámetros.</p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3 shrink-0 w-full md:flex-row sm:w-auto justify-end">
              <Link to="/profile/my-predictions">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="border w-full border-white/10 text-white text-[9px] font-bold uppercase px-6 py-3 rounded-xs hover:bg-white/5 transition-all tracking-widest cursor-pointer whitespace-nowrap"
                >
                  Ver Registros
                </motion.button>
              </Link>
              <Link to="/predict">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary-engine w-full sm:w-auto px-6 py-3 text-[9px] font-bold tracking-widest uppercase flex flex-row items-center justify-center leading-none cursor-pointer h-9.75"
                >
                  <span className="inline-flex items-center h-full">
                    NUEVA PREDICCIÓN
                  </span>             
                </motion.button>
              </Link>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}