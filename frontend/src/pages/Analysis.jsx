import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ArrowRight from '../assets/icons/arrow_right.svg';

// Variantes del contenedor principal para activar el efecto Stagger (escalonado)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.05 
    } 
  }
};

// Variantes de aparición para los bloques del Bento Grid
const blockVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

// Variantes internas para los elementos anidados secundarios
const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const MetricCard = ({ label, value, progress, active = false }) => (
  <motion.div 
    variants={itemVariants} 
    whileHover={{ y: -2, transition: { duration: 0.15, ease: "easeInOut" } }}
    style={{ backgroundColor: 'var(--surface-high)' }}
    className="p-4 rounded-sm transition-all min-w-0"
  >
    <p style={{ color: 'var(--on-surface-variant)' }} className="text-[9px] md:text-[10px] uppercase tracking-widest mb-1 truncate">{label}</p>
    <p style={{ color: active ? '#ffffff' : 'var(--on-surface-variant)' }} className="text-2xl md:text-3xl font-bold tracking-tight truncate">
      {value}
    </p>
    <div className="w-full bg-black/20 h-1 mt-3 overflow-hidden rounded-xs">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }} 
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }} 
        style={{ backgroundColor: active ? 'var(--secondary)' : 'rgba(190, 200, 210, 0.3)' }}
        className="h-full" 
      />
    </div>
  </motion.div>
);

const HyperparameterRow = ({ label, value, last = false }) => (
  <motion.div 
    variants={itemVariants} 
    whileHover={{ x: 3, transition: { duration: 0.12 } }} 
    className={`flex justify-between items-center py-2.5 min-w-0 ${!last ? 'border-b border-white/5' : ''}`}
  >
    <span style={{ color: 'var(--on-surface-variant)' }} className="text-[9px] md:text-[10px] uppercase tracking-widest truncate mr-2">{label}</span>
    <span className="text-sm md:text-base text-white font-medium whitespace-nowrap">{value}</span>
  </motion.div>
);

export default function Analysis() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)' }}
      className="grow blueprint-grid-dots px-4 md:px-10 py-6 md:py-8 flex flex-col justify-center overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-5 md:gap-6">
        
        {/* HEADER */}
        <header>
          <motion.div 
            variants={blockVariants} 
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: 24 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  style={{ backgroundColor: 'var(--secondary)' }}
                  className="h-px"
                ></motion.span>
                <span style={{ color: 'var(--secondary)' }} className="text-[9px] font-bold tracking-[0.3em] uppercase">
                  Módulo: Evaluación de Modelos
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                Análisis de Modelos & <br />
                <span style={{ color: 'var(--primary-container)' }} className="inline-block relative">Dashboard de Comparación</span>
              </h1>
            </div>

            <div className="bg-black/20 px-4 py-2 border border-white/5 rounded-sm backdrop-blur-xs min-w-44 transition-all hidden sm:block h-fit mb-0.5">
              <p style={{ color: 'rgba(190, 200, 210, 0.4)' }} className="text-[8px] font-mono uppercase mb-0.5">Métrica Global</p>
              <p style={{ color: 'var(--secondary)' }} className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span style={{ backgroundColor: 'var(--secondary)' }} className="h-1 w-1 rounded-full animate-pulse"></span>
                R² SCORE: 0.942
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-12 gap-4 md:gap-5 items-stretch">
          
          {/* RENDIMIENTO GENERAL */}
          <motion.section 
            variants={blockVariants}
            style={{ 
              backgroundColor: 'var(--surface-low)', 
              borderColor: 'rgba(255, 255, 255, 0.05)' 
            }} 
            className="col-span-12 lg:col-span-8 border p-5 md:p-6 flex flex-col justify-between rounded-sm"
          >
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-white mb-4">Rendimiento General del Motor Predictivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 grow items-stretch">
              
              <div className="flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-center">
                  <h3 style={{ color: 'var(--secondary)' }} className="text-[10px] uppercase tracking-widest font-bold truncate">Gradient Boosting (XGB)</h3>
                  <span style={{ backgroundColor: 'rgba(93, 230, 255, 0.1)', color: 'var(--secondary)', borderColor: 'rgba(93, 230, 255, 0.2)' }} className="px-2 py-0.5 rounded-sm text-[8px] font-bold border uppercase">Activo</span>
                </div>
                <div className="grid grid-cols-2 gap-3 grow">
                  <MetricCard label="MAE" value="€842.12" progress={88} active />
                  <MetricCard label="RMSE" value="€1,104.50" progress={92} active />
                </div>
              </div>
              
              <div className="flex flex-col justify-between space-y-3 opacity-60 hover:opacity-85 transition-opacity">
                <div className="flex justify-between items-center">
                  <h3 style={{ color: 'var(--on-surface-variant)' }} className="text-[10px] uppercase tracking-widest font-bold truncate">Random Forest Regressor</h3>
                  <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--on-surface-variant)', borderColor: 'rgba(255, 255, 255, 0.1)' }} className="px-2 py-0.5 rounded-sm text-[8px] font-bold border uppercase">Referencia</span>
                </div>
                <div className="grid grid-cols-2 gap-3 grow">
                  <MetricCard label="MAE" value="€915.80" progress={82} />
                  <MetricCard label="RMSE" value="€1,240.22" progress={78} />
                </div>
              </div>

            </div>
          </motion.section>

          {/* CURVA DE APRENDIZAJE */}
          <motion.div 
            variants={blockVariants}
            style={{ 
              backgroundColor: 'var(--surface-container)', 
              borderColor: 'rgba(255, 255, 255, 0.05)' 
            }} 
            className="col-span-12 sm:col-span-6 lg:col-span-4 border p-5 md:p-6 rounded-sm flex flex-col justify-between min-h-40"
          >
            <h2 className="text-[11px] md:text-xs font-bold tracking-widest text-white uppercase mb-3">Curva de Aprendizaje</h2>
            <div className="grow bg-black/20 rounded-xs overflow-hidden flex items-center justify-center p-2">
              <svg className="w-full h-full max-h-24" viewBox="0 0 200 100" preserveAspectRatio="none">
                <motion.path 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }} 
                  d="M0 90 Q 50 10, 200 5" 
                  fill="none" 
                  stroke="var(--secondary)" 
                  strokeWidth="2.5" 
                />
              </svg>
            </div>
          </motion.div>

          {/* DISTRIBUCIÓN DEL ERROR POR SEGMENTO */}
          <motion.section
            variants={blockVariants}
            style={{ 
              backgroundColor: 'var(--surface-low)', 
              borderColor: 'rgba(255, 255, 255, 0.05)' 
            }} 
            className="col-span-12 lg:col-span-8 border p-5 md:p-6 rounded-sm flex flex-col justify-between"
          >
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-white mb-4">Distribución del Error por Segmento</h2>
            <div className="h-28 flex items-end justify-between gap-3 px-1 relative border-b border-white/10">
              {[
                { label: '0-15k €', h1: '25%', h2: '35%' },
                { label: '15k-30k €', h1: '45%', h2: '60%' },
                { label: '30k-60k €', h1: '30%', h2: '40%' },
                { label: '60k-100k €', h1: '80%', h2: '95%' },
                { label: 'Lujo 100k+', h1: '60%', h2: '75%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group min-w-0">
                  <div className="flex items-end gap-1.5 w-full max-w-12 h-full">
                    <motion.div 
                      initial={{ scaleY: 0 }} 
                      whileInView={{ scaleY: 1 }} 
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + (0.05 * i), duration: 0.5 }} 
                      style={{ height: bar.h1, originY: 1, backgroundColor: 'var(--secondary)' }} 
                      className="flex-1 opacity-80"
                    ></motion.div>
                    <motion.div 
                      initial={{ scaleY: 0 }} 
                      whileInView={{ scaleY: 1 }} 
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (0.05 * i), duration: 0.5 }} 
                      style={{ height: bar.h2, originY: 1, backgroundColor: 'var(--surface-highest)' }} 
                      className="flex-1"
                    ></motion.div>
                  </div>
                  <span style={{ color: 'var(--on-surface-variant)' }} className="mt-2.5 text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap">{bar.label}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* HIPERPARÁMETROS */}
          <motion.div 
            variants={blockVariants}
            style={{ 
              backgroundColor: 'var(--surface-container)', 
              borderColor: 'rgba(255, 255, 255, 0.05)', 
              borderTopColor: 'rgba(93, 230, 255, 0.2)' 
            }} 
            className="col-span-12 sm:col-span-6 lg:col-span-4 border p-5 md:p-6 rounded-sm border-t-2 flex flex-col justify-between"
          >
            <h2 className="text-[11px] md:text-xs font-bold tracking-widest text-white mb-2 uppercase">Hiperparámetros</h2>
            <div className="flex flex-col justify-center grow">
              <HyperparameterRow label="Profundidad" value="8 Niveles" />
              <HyperparameterRow label="Tasa Aprendizaje" value="0.025" />
              <HyperparameterRow label="Estimadores" value="1,500" />
              <HyperparameterRow label="Submuestreo" value="0.82" last />
            </div>
          </motion.div>

          {/* BANNER DE CIERRE */}
          <motion.div 
            variants={blockVariants}
            className="col-span-12 block w-full"
          >
            <div className="block w-full">
              <section 
                style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                className="bg-(--surface-container) relative h-28 rounded-sm overflow-hidden border w-full flex items-center justify-between px-5 md:px-7 transition-colors duration-300"
              >
                <div className="relative z-10 flex flex-col justify-center flex-1 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span style={{ backgroundColor: 'var(--secondary)' }} className="h-px w-6"></span>
                    <span style={{ color: 'var(--secondary)' }} className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em]">Arquitectura Neural Fabric</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight mb-0.5">El Proceso de Diseño Kinético</h3>
                  <p style={{ color: 'var(--on-surface-variant)' }} className="max-w-3xl text-[11px] md:text-xs font-light leading-tight">
                    Nuestro motor de valoración utiliza un método de ensamble propio, combinando la precisión categórica de Gradient Boosting con el manejo robusto de varianza de arquitecturas Random Forest.
                  </p>
                </div>

                <div className="relative z-10 shrink-0 hidden sm:block">
                  <Link to='/models'  className="btn-primary-engine w-full sm:w-auto h-9.5 px-8 text-[10px] font-bold tracking-widest uppercase flex flex-row items-center justify-center gap-2 leading-none cursor-pointer">
                    <span className="inline-flex items-center h-full pt-px">
                      GENERAR EVALUACIÓN
                    </span>                  
                    <img 
                      src={ArrowRight} 
                      alt="Arrow" 
                      className="w-4 h-4 object-contain shrink-0" 
                    />
                  </Link>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}