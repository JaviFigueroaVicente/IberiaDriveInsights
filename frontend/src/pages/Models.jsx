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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

const FadeInWhenVisible = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

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
  <div className="metric-tile min-w-0 flex flex-col justify-center h-14">
    <p className="text-[7px] uppercase text-(--on-surface-variant) tracking-widest mb-0.5 opacity-60 truncate">
      {label}
    </p>
    <p className="text-[10px] font-bold text-white uppercase truncate">
      {value}
    </p>
  </div>
);

const ArchitectureCard = ({ number, title, subtitle, description, badge, metrics, className = "" }) => (
  <motion.div 
    variants={itemVariants} 
    className={`architecture-card p-8 flex flex-col justify-between group min-w-0 ${className}`}
  >
    <div className="flex flex-col grow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-6xl font-bold step-number leading-none">
          {number}
        </span>
        {badge && (
          <span className="data-chip uppercase tracking-[0.15em] whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-(--secondary) text-[10px] font-bold uppercase tracking-[0.3em] mb-1 truncate">{subtitle}</p>
        <h3 className="text-xl md:text-2xl font-bold font-headline uppercase tracking-tight text-white group-hover:text-(--secondary) transition-colors line-clamp-1">
          {title}
        </h3>
      </div>
      
      <p className="text-(--on-surface-variant) leading-relaxed text-xs md:text-sm mb-6 opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">
        {description}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-2.5 mt-auto pt-4 border-t border-white/5">
      {metrics.map((m, i) => (
        <MetricBox key={i} label={m.label} value={m.value} />
      ))}
    </div>
  </motion.div>
);

export default function Models() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots px-4 md:px-10 py-6 flex flex-col justify-between overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full grow flex flex-col justify-between gap-6">
        
        {/* --- BLOQUE 1: HEADER --- */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: 24 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="h-px bg-(--secondary)"
                ></motion.span>
                <span className="text-[9px] font-bold tracking-[0.3em] text-(--secondary) uppercase">
                  Ecosistema: Arquitectura de Inferencia
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                Lógica del <span className="text-(--primary-container) inline-block relative">Motor Predictivo</span>
              </h1>
            </div>

            {/* Chip de Estado del Sistema */}
            <motion.div 
              layout
              className="bg-black/20 px-4 py-2.5 border border-white/5 rounded-xs backdrop-blur-xs min-w-48 transition-all hover:border-(--secondary)/20 hidden md:block"
            >
              <p className="text-[8px] font-mono text-[#bec8d2]/40 uppercase mb-0.5">System Health</p>
              <p className="text-[10px] font-bold text-(--secondary) tracking-widest uppercase flex items-center gap-1.5">
                <span className="h-1 w-1 bg-(--secondary) rounded-full animate-system-live"></span>
                99.98% Stable
              </p>
            </motion.div>
          </div>

          <div className="mt-3">
            <p className="max-w-3xl text-[10px] md:text-[11px] text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-75">
              Evaluación mediante dos modelos independientes: análisis estructural de patrones históricos (<span className="text-white font-bold">Kaggle pre-2018</span>) y corrección por fluctuaciones dinámicas mediante captura en tiempo real (<span className="text-white font-bold">Web Scraping</span>).
            </p>
          </div>
        </motion.header>

        {/* --- BLOQUE 2: BENTO CARDS --- */}
        <FadeInWhenVisible className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-auto">
          <ArchitectureCard 
            className="lg:col-span-6" 
            number="01" 
            subtitle="Modelo de Datos Históricos" 
            title="Random Forest (Kaggle)" 
            badge="Dataset Base" 
            description="Entrenado de forma independiente con datos estáticos de la plataforma Kaggle. Este modelo proporciona la línea base estructural del mercado basándose estrictamente en registros históricos consolidados hasta el año 2018." 
            metrics={[
              { label: 'Algoritmo', value: 'Random Forest' }, 
              { label: 'Temporalidad', value: 'ANTERIOR ≤ 2018' }, 
              { label: 'Estimadores', value: '1,500 Árboles' }, 
              { label: 'Propósito', value: 'Patrón Estructural' }
            ]} 
          />
          <ArchitectureCard 
            className="lg:col-span-6" 
            number="02" 
            subtitle="Modelo de Datos Volátiles" 
            title="Gradient Boosting (XGBoost)" 
            badge="Dataset en Vivo" 
            description="Entrenado exclusivamente con datos dinámicos obtenidos mediante técnicas de Web Scraping automatizado. Captura las fluctuaciones de oferta, demanda y depreciación en tiempo real del mercado actual." 
            metrics={[
              { label: 'Algoritmo', value: 'XGBoost (Inferencia)' }, 
              { label: 'Temporalidad', value: 'Tiempo Real' }, 
              { label: 'Profundidad', value: 'Max-Depth 12' }, 
              { label: 'Propósito', value: 'Tendencia Volátil' }
            ]} 
          />
        </FadeInWhenVisible>

        {/* --- BLOQUE 3: PIPELINE DE PROCESAMIENTO --- */}
        <FadeInWhenVisible className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-(--secondary) text-[9px] font-bold uppercase tracking-[0.4em] mb-0.5">Workflow Terminal</span>
              <h2 className="text-xl font-bold font-headline uppercase tracking-tight text-white">Pipeline de Procesamiento</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {[
              { id: '01', step: 'Ingesta Activa', desc: 'Extracción de Datos de Datos Mediante WebScraping y Datos Abiertos.', status: 'Completado', img: Database },
              { id: '02', step: 'Normalización', desc: 'Escalado de variables y tratamiento de valores nulos o erróneos.', status: 'Completado', img: FactCheck },                  
              { id: '03', step: 'Entrenamiento', desc: 'Entrenamiento mediante XGBoost y Random Forest.', status: 'Completado', img: Memory },
              { id: '04', step: 'Entrega de Informe', desc: 'Generación de un precio con validación de confianza.', status: 'Completado', img: Description }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15 } }}
                className="bg-(--surface-container)/50 backdrop-blur-xs border border-white/5 p-5 rounded-sm relative z-10 group hover:border-(--secondary)/30 transition-all duration-300 flex flex-col justify-between min-w-0 h-44"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-9 h-9 rounded-xs flex items-center justify-center border border-white/10 bg-white/2">
                      <img
                        src={item.img}
                        alt={item.step}
                        className="w-5 h-5 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                    <span className="font-mono text-[9px] text-white/20 group-hover:text-(--secondary)/40 transition-colors">
                      PASO {item.id}
                    </span>
                  </div>

                  <h4 className="text-white text-[11px] font-bold uppercase mb-1 tracking-widest group-hover:text-(--secondary) transition-colors truncate">
                    {item.step}
                  </h4>
                  <p className="text-[10px] text-(--on-surface-variant) leading-normal opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-(--secondary) transition-colors"></div>
                  <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInWhenVisible>
        
        {/* --- BLOQUE 4: FOOTER DE ACCIÓN --- */}
        <FadeInWhenVisible className="w-full mt-2">
          <footer className="p-6 border border-white/5 bg-linear-to-b from-white/2 to-transparent rounded-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="text-right border-r border-white/10 pr-6 hidden md:block">
                <p className="text-[8px] text-white/30 uppercase font-mono leading-none mb-0.5">System Health</p>
                <p className="text-[11px] text-white/70 font-bold font-mono tracking-tighter uppercase">99.98% Stable</p>
              </div>
              <div className="max-w-md">
                <h3 className="text-white font-bold uppercase text-xs mb-0.5 tracking-tight">¿Listo para procesar una unidad?</h3>
                <p className="text-[10px] text-(--on-surface-variant) uppercase opacity-60">El motor de inferencia está listo para recibir nuevos parámetros.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/profile/my-predictions">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="border border-white/10 text-white text-[9px] font-bold uppercase px-6 py-3 rounded-xs hover:bg-white/5 transition-all tracking-widest cursor-pointer whitespace-nowrap"
                >
                  Ver Registros
                </motion.button>
              </Link>
              <Link to="/predict">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-(--primary-container) text-black text-[9px] font-bold uppercase px-6 py-3 rounded-xs transition-all tracking-widest cursor-pointer whitespace-nowrap"
                >
                  Nueva Valoración VIN
                </motion.button>
              </Link>
            </div>
          </footer>
        </FadeInWhenVisible>
      </div>
    </div>
  );
}