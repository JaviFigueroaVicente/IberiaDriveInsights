import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

const blockVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const hpContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const hpRowVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
  }
};

const MetricCard = ({ label, value, progress, active = false }) => (
  <motion.div 
    variants={itemVariants} 
    style={{ backgroundColor: 'var(--surface-high)' }}
    className="p-4 rounded-sm transition-all min-w-0 flex-1"
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
    variants={hpRowVariants} 
    className={`flex justify-between items-center py-3.5 min-w-0 ${!last ? 'border-b border-white/5' : ''}`}
  >
    <span style={{ color: 'var(--on-surface-variant)' }} className="text-[9px] md:text-[10px] uppercase tracking-widest truncate mr-2">{label}</span>
    <span className="text-sm md:text-base text-white font-medium whitespace-nowrap">{value}</span>
  </motion.div>
);

export default function Analysis() {
  const [activeModel, setActiveModel] = useState('xgb');
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModelData() {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 320)); 
        
        const mockDbResponses = {
          xgb: {
            dataset: "Scrap en vivo",
            r2Score: "0.942",
            mae: "€1.321,33",
            maeProgress: 92.16,
            rmse: "€1.868,64",
            rmseProgress: 92.08,
            hyperparameters: [
              { label: "Muestra Procesada", value: "2.964 vehículos" },
              { label: "Profundidad Máxima", value: "5 Niveles" },
              { label: "Learning Rate", value: "0.05" },
              { label: "Subsample", value: "0.8" },
              { label: "Estimadores", value: "500" }
            ],
            bars: [
              { label: '0-15k €', h1: '22.4%', h2: '50.8%', count: "XGB: 22.4% | RF: 50.8%" },
              { label: '15k-30k €', h1: '46.3%', h2: '33.1%', count: "XGB: 46.3% | RF: 33.1%" },
              { label: '30k-60k €', h1: '26.6%', h2: '14.2%', count: "XGB: 26.6% | RF: 14.2%" },
              { label: '60k-100k €', h1: '3.9%', h2: '1.7%', count: "XGB: 3.9% | RF: 1.7%" },
              { label: 'Lujo 100k+', h1: '0.8%', h2: '0.2%', count: "XGB: 0.8% | RF: 0.2%" },
            ]
          },
          rf: {
            dataset: "Kaggle",
            r2Score: "0.918",
            mae: "€1.331,60",
            maeProgress: 93.89,
            rmse: "€2.229,37",
            rmseProgress: 91.52,
            hyperparameters: [
              { label: "Muestra Procesada", value: "83.996 vehículos" },
              { label: "Profundidad Máxima", value: "30 Niveles" },
              { label: "Min Samples Split ", value: "2" },
              { label: "Min Samples Leaf", value: "1" },
              { label: "Estimadores (Trees)", value: "200" }
            ],
           bars: [
              { label: '0-15k €', h1: '50.8%', h2: '22.4%', count: "RF: 50.8% | XGB: 22.4%" },
              { label: '15k-30k €', h1: '33.1%', h2: '46.3%', count: "RF: 33.1% | XGB: 46.3%" },
              { label: '30k-60k €', h1: '14.2%', h2: '26.6%', count: "RF: 14.2% | XGB: 26.6%" },
              { label: '60k-100k €', h1: '1.7%', h2: '3.9%', count: "RF: 1.7% | XGB: 3.9%" },
              { label: 'Lujo 100k+', h1: '0.2%', h2: '0.8%', count: "RF: 0.2% | XGB: 0.8%" },
            ]
          }
        };

        setMetricsData(mockDbResponses[activeModel]);
      } catch (err) {
        console.error("Error en lectura de BBDD:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchModelData();
  }, [activeModel]);

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
                  Módulo de Datos: Cuantificación Analítica
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                Distribución de Muestras <br />
                <span style={{ color: 'var(--primary-container)' }} className="inline-block relative">Por Segmentación de Precios</span>
              </h1>
            </div>

            <div className="bg-black/20 px-4 py-2 border border-white/5 rounded-sm backdrop-blur-xs min-w-44 transition-all hidden sm:block h-fit mb-0.5">
              <p style={{ color: 'rgba(190, 200, 210, 0.4)' }} className="text-[8px] font-mono uppercase mb-0.5">Archivo Activo</p>
              <p style={{ color: 'var(--secondary)' }} className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span style={{ backgroundColor: 'var(--secondary)' }} className="h-1 w-1 rounded-full animate-pulse"></span>
                {loading ? "CARGANDO..." : metricsData?.dataset}
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-12 gap-4 md:gap-5 items-stretch">
          
          {/* CONTROL DE SELECCIÓN Y METRICAS */}
          <motion.section 
            variants={blockVariants}
            style={{ backgroundColor: 'var(--surface-low)', borderColor: 'rgba(255, 255, 255, 0.05)' }} 
            className="col-span-12 border p-5 md:p-6 flex flex-col justify-between rounded-sm"
          >
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-white mb-4">Selección de Dataset y Motor Predictivo Asignado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 grow items-stretch">
              
              {/* XGBoost Box */}
              <div 
                onClick={() => setActiveModel('xgb')}
                className={`flex flex-col justify-between space-y-3 cursor-pointer p-3 rounded-xs border transition-all duration-300 ${
                  activeModel === 'xgb' ? 'border-(--secondary) bg-white/5 opacity-100' : 'border-transparent opacity-40 hover:opacity-75'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <h3 style={{ color: activeModel === 'xgb' ? 'var(--secondary)' : 'var(--on-surface-variant)' }} className="text-[10px] uppercase tracking-widest font-bold truncate">XGBoost (Numeric Matrice)</h3>
                    <p className="text-[8px] font-mono text-white/40 truncate">Data Target: Scrap en vivo</p>
                  </div>
                  <span style={{ 
                    backgroundColor: activeModel === 'xgb' ? 'rgba(93, 230, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                    color: activeModel === 'xgb' ? 'var(--secondary)' : 'var(--on-surface-variant)', 
                    borderColor: activeModel === 'xgb' ? 'rgba(93, 230, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)' 
                  }} className="px-2 py-0.5 rounded-sm text-[8px] font-bold border uppercase shrink-0">
                    {activeModel === 'xgb' ? 'Activo' : 'Analizar'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 grow">
                  <MetricCard label="MAE" value="€1.321,33" progress={92.16} active={activeModel === 'xgb'} />
                  <MetricCard label="RMSE" value="€1.868,64" progress={92.08} active={activeModel === 'xgb'} />
                </div>
              </div>
              
              {/* Random Forest Box */}
              <div 
                onClick={() => setActiveModel('rf')}
                className={`flex flex-col justify-between space-y-3 cursor-pointer p-3 rounded-xs border transition-all duration-300 ${
                  activeModel === 'rf' ? 'border-(--secondary) bg-white/5 opacity-100' : 'border-transparent opacity-40 hover:opacity-75'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <h3 style={{ color: activeModel === 'rf' ? 'var(--secondary)' : 'var(--on-surface-variant)' }} className="text-[10px] uppercase tracking-widest font-bold truncate">Random Forest (Categorical String)</h3>
                    <p className="text-[8px] font-mono text-white/40 truncate">Data Target: Kaggle</p>
                  </div>
                  <span style={{ 
                    backgroundColor: activeModel === 'rf' ? 'rgba(93, 230, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                    color: activeModel === 'rf' ? 'var(--secondary)' : 'var(--on-surface-variant)', 
                    borderColor: activeModel === 'rf' ? 'rgba(93, 230, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)' 
                  }} className="px-2 py-0.5 rounded-sm text-[8px] font-bold border uppercase shrink-0">
                    {activeModel === 'rf' ? 'Activo' : 'Analizar'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 grow">
                  <MetricCard label="MAE" value="€1.331,60" progress={93.89} active={activeModel === 'rf'} />
                  <MetricCard label="RMSE" value="€2.229,37" progress={91.52} active={activeModel === 'rf'} />
                </div>
              </div>

            </div>
          </motion.section>

          {/* GRÁFICA DE BARRAS DINÁMICA POR VOLUMEN DE COCHES */}
          <motion.section
            variants={blockVariants}
            style={{ backgroundColor: 'var(--surface-low)', borderColor: 'rgba(255, 255, 255, 0.05)' }} 
            className="col-span-12 lg:col-span-8 border p-5 md:p-6 rounded-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-sm md:text-base font-bold uppercase tracking-tight text-white">
                Volumetría de Coches Registrados por Segmento
              </h2>
            </div>
            
            <div className="h-full flex items-end justify-between gap-4 px-1 relative border-b border-white/10">
              <AnimatePresence mode="wait">
                {!loading && metricsData?.bars.map((bar, i) => (
                  <div key={`${activeModel}-bar-${i}`} className="flex-1 flex flex-col items-center h-full justify-end group min-w-0">
                    {/* Tooltip inline sutil con la cantidad total de coches */}
                    <span className="text-[9px] font-mono text-white/60 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {bar.count}
                    </span>
                    <div className="flex items-end gap-2 w-full max-w-14 h-full">
                      <motion.div 
                        initial={{ scaleY: 0 }} 
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ delay: 0.02 * i, duration: 0.35, ease: "easeOut" }} 
                        style={{ height: bar.h1, originY: 1, backgroundColor: 'var(--secondary)' }} 
                        className="flex-1 rounded-t-xs relative"
                      >
                        {/* Indicador de densidad en el core del gráfico */}
                        <div className="absolute top-1 left-0 right-0 h-px bg-white/20 mx-0.5"></div>
                      </motion.div>
                      <motion.div 
                        initial={{ scaleY: 0 }} 
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.35, ease: "easeOut" }} 
                        style={{ height: bar.h2, originY: 1, backgroundColor: 'var(--surface-highest)' }} 
                        className="flex-1 rounded-t-xs opacity-60"
                      ></motion.div>
                    </div>
                    <span style={{ color: 'var(--on-surface-variant)' }} className="mt-2.5 text-[8px] font-bold uppercase tracking-tighter whitespace-nowrap">{bar.label}</span>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* HIPERPARÁMETROS ASIGNADOS AL DATASET (Alto completo, sin hover y secuencial al cambiar) */}
          <motion.div 
            variants={blockVariants}
            style={{ 
              backgroundColor: 'var(--surface-container)', 
              borderColor: 'rgba(255, 255, 255, 0.05)', 
              borderTopColor: 'rgba(93, 230, 255, 0.2)' 
            }} 
            className="col-span-12 lg:col-span-4 border p-5 md:p-6 rounded-sm border-t-2 flex flex-col justify-between"
          >
            <h2 className="text-[11px] md:text-xs font-bold tracking-widest text-white mb-2 uppercase">Configuración de Carga</h2>
            <div className="flex flex-col justify-center grow">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="text-center font-mono text-[10px] text-white/30 animate-pulse py-10">Mapeando Estructura...</div>
                ) : (
                  <motion.div
                    key={activeModel}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={hpContainerVariants}
                  >
                    {metricsData?.hyperparameters.map((hp, idx, arr) => (
                      <HyperparameterRow 
                        key={hp.label} 
                        label={hp.label} 
                        value={hp.value} 
                        last={idx === arr.length - 1} 
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* BANNER INFORMATIVO */}
          <motion.div variants={blockVariants} className="col-span-12 block w-full">
            <section style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} className="bg-(--surface-container) relative h-28 rounded-sm border w-full flex items-center justify-between px-5 md:px-7">
              <div className="relative z-10 flex flex-col justify-center flex-1 mr-4">
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ backgroundColor: 'var(--secondary)' }} className="h-px w-6"></span>
                  <span style={{ color: 'var(--secondary)' }} className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em]">Evaluación de Modelos de Aprendizaje</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight mb-0.5">Control de Integridad</h3>
                <p style={{ color: 'var(--on-surface-variant)' }} className="max-w-3xl text-[11px] md:text-xs font-light leading-tight">
                  Nuestro motor de valoración utiliza un método de ensamble propio, para un modelo de aprendizaje automático usando Gradient Boosting y para otro modelo de aprendizaje automático usando Random Forest.
                </p>
              </div>
              <div className="relative z-10 shrink-0 hidden sm:block">
                <Link to='/models' className="btn-primary-engine w-full sm:w-auto h-9.5 px-8 text-[10px] font-bold tracking-widest uppercase flex flex-row items-center justify-center gap-2 cursor-pointer">
                  <span className="inline-flex items-center h-full pt-px">Modelos de Evaluación</span>
                  <img src={ArrowRight} alt="Arrow" className="w-4 h-4 object-contain" />
                </Link>
              </div>
            </section>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}