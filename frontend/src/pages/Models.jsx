import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Database from "../assets/icons/database.svg";
import Description from "../assets/icons/description.svg";
import FactCheck from "../assets/icons/fact_check.svg";
import Memory from "../assets/icons/memory.svg";
import { Link } from "react-router-dom";

// Variantes maestras para el efecto orquestado (Stagger) de los hijos directos
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Variantes de entrada con easing premium para desaceleraciones suaves
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

// Contenedor modular autogestionado por Viewport para evitar renderizados masivos síncronos
const FadeInWhenVisible = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

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
  <div className="bg-black/20 p-3 rounded-xs border border-white/5 group-hover:border-(--secondary)/20 transition-all duration-300">
    <p className="text-[7px] uppercase text-(--on-surface-variant) tracking-widest mb-1 opacity-60">
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
    whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    className={`bg-(--surface-low) border border-white/5 border-l-4 border-l-(--primary-container) p-8 rounded-sm flex flex-col justify-between hover:bg-(--surface-container) transition-all duration-500 group ${className}`}
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <span className="text-6xl font-bold step-number leading-none opacity-90 group-hover:opacity-100 transition-opacity">
          {number}
        </span>
        {badge && (
          <span className="bg-(--secondary)/10 text-(--secondary) px-2 py-1 rounded-xs text-[9px] font-bold border border-(--secondary)/20 uppercase tracking-[0.2em]">
            {badge}
          </span>
        )}
      </div>
      <div className="mb-4">
        <p className="text-(--secondary) text-[10px] font-bold uppercase tracking-[0.3em] mb-1">{subtitle}</p>
        <h3 className="text-2xl font-bold font-headline uppercase tracking-tight text-white group-hover:text-(--secondary) transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-(--on-surface-variant) leading-relaxed text-sm mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-auto">
      {metrics.map((m, i) => (
        <MetricBox key={i} label={m.label} value={m.value} />
      ))}
    </div>
  </motion.div>
);

export default function Models() {
  return (
    <div className="min-h-screen bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots p-6 lg:p-12 mb-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Animado de entrada */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="h-px bg-(--secondary)"
                ></motion.span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-(--secondary) uppercase">
                  Ecosistema: Arquitectura de Inferencia
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase leading-none">
                Lógica del <span className="text-(--primary-container) inline-block relative">Motor Predictivo</span>
              </h1>
            </div>

            {/* Opcional: Chip de Estado del Sistema a la derecha para emparejar con el diseño de Predict */}
            <motion.div 
              layout
              className="bg-black/20 p-4 border border-white/5 rounded-sm backdrop-blur-xs min-w-55 transition-all hover:border-(--secondary)/20 hidden md:block"
            >
              <p className="text-[9px] font-mono text-[#bec8d2]/40 uppercase mb-1">System Health</p>
              <p className="text-[11px] font-bold text-(--secondary) tracking-widest uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-(--secondary) rounded-full animate-pulse"></span>
                99.98% Stable
              </p>
            </motion.div>
          </div>

          <div className="mt-4">
            <p className="max-w-2xl text-[11px] md:text-xs text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-80">
              Evaluación mediante dos modelos independientes: análisis estructural de patrones históricos (<span className="text-white font-bold text-[10px]">Kaggle pre-2018</span>) y corrección por fluctuaciones dinámicas mediante captura en tiempo real (<span className="text-white font-bold text-[10px]">Web Scraping</span>).
            </p>
          </div>
        </motion.header>

        {/* Bloque 1: Bloques de Arquitectura */}
        <FadeInWhenVisible className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          <ArchitectureCard 
            className="md:col-span-6" 
            number="01" 
            subtitle="Modelo de Datos Históricos" 
            title="Random Forest (Kaggle)" 
            badge="Dataset Base" 
            description="Entrenado de forma independiente con datos estáticos de la plataforma Kaggle. Este modelo proporciona la línea base estructural del mercado basándose estrictamente en registros históricos consolidados hasta el año 2018." 
            metrics={[
              { label: 'Algoritmo', value: 'Random Forest' }, 
              { label: 'Temporalidad', value: '≤ 2018 (Legacy)' }, 
              { label: 'Estimadores', value: '1,500 Árboles' }, 
              { label: 'Propósito', value: 'Patrón Histórico' }
            ]} 
          />
          <ArchitectureCard 
            className="md:col-span-6" 
            number="02" 
            subtitle="Modelo de Datos Volátiles" 
            title="Gradient Boosting (XGBoost)" 
            badge="Dataset en Vivo" 
            description="Entrenado exclusivamente con datos dinámicos obtenidos mediante técnicas de Web Scraping automatizado. Captura las fluctuaciones de oferta, demanda y depreciación en tiempo real del mercado actual." 
            metrics={[
              { label: 'Algoritmo', value: 'XGBoost (Inferencia)' }, 
              { label: 'Temporalidad', value: 'Tiempo Real (Actual)' }, 
              { label: 'Profundidad', value: 'Max-Depth 12' }, 
              { label: 'Propósito', value: 'Tendencia Actual' }
            ]} 
          />
        </FadeInWhenVisible>

        {/* Bloque 2: Pipeline de Procesamiento */}
        <FadeInWhenVisible className="mt-20 relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex flex-col">
              <span className="text-(--secondary) text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Workflow Terminal</span>
              <h2 className="text-2xl font-bold font-headline uppercase tracking-tight text-white">Pipeline de Procesamiento</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { id: '01', step: 'Ingesta Activa', desc: 'Extracción de Datos de Datos Mediante WebScraping y Datos Abiertos.', status: 'Completado', img: Database },
              { id: '02', step: 'Normalización', desc: 'Escalado de variables y tratamiento de valores nulos o erróneos.', status: 'Completado', img: FactCheck },                  
              { id: '03', step: 'Entrenamiento de Modelos', desc: 'Entrenamiento mediante XGBoost y Random Forest.', status: 'Completado', img: Memory },
              { id: '04', step: 'Entrega de Informe', desc: 'Generación de un precio con validación de confianza.', status: 'Completado', img: Description }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15 } }}
                className="bg-(--surface-container)/50 backdrop-blur-xs border border-white/5 p-6 rounded-sm relative z-10 group hover:border-(--secondary)/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xs flex items-center justify-center border border-white/10 bg-white/2">
                      <img
                        src={item.img}
                        alt={item.step}
                        className="w-6 h-6 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-white/20 group-hover:text-(--secondary)/40 transition-colors">
                      PASO {item.id}
                    </span>
                  </div>

                  <h4 className="text-white text-xs font-bold uppercase mb-2 tracking-widest group-hover:text-(--secondary) transition-colors">
                    {item.step}
                  </h4>
                  <p className="text-[11px] text-(--on-surface-variant) leading-relaxed mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-(--secondary) transition-colors"></div>
                  <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInWhenVisible>
        
        {/* Bloque 3: Footer de Acción */}
        <FadeInWhenVisible className="mt-20">
          <footer className="p-10 border border-white/5 bg-linear-to-b from-white/2 to-transparent rounded-sm flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="text-right border-r border-white/10 pr-6 hidden md:block">
                <p className="text-[9px] text-white/30 uppercase font-mono leading-none mb-1">System Health</p>
                <p className="text-xs text-white/70 font-bold font-mono tracking-tighter uppercase">99.98% Stable</p>
              </div>
              <div className="max-w-md">
                <h3 className="text-white font-bold uppercase text-sm mb-1 tracking-tight">¿Listo para procesar una unidad?</h3>
                <p className="text-[11px] text-(--on-surface-variant) uppercase opacity-60">El motor de inferencia está listo para recibir nuevos parámetros.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link to="/profile/my-predictions">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-white/10 text-white text-[10px] font-bold uppercase px-8 py-4 rounded-xs hover:bg-white/5 transition-all tracking-widest cursor-pointer"
                >
                  Ver Registros
                </motion.button>
              </Link>
              <Link to="/predict">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-(--primary-container) text-black text-[10px] font-bold uppercase px-8 py-4 rounded-xs transition-all tracking-widest cursor-pointer"
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