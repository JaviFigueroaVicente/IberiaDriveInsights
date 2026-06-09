import { motion } from 'framer-motion';
import AnalysisPhoto from '../assets/analysis/bg-analysis.png';

// Variantes para animaciones de aparición progresiva secuencial (Stagger)
// Se utiliza un easing "easeOut" (cubic-bezier(0.16, 1, 0.3, 1)) para una desaceleración fluida y profesional.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const MetricCard = ({ label, value, progress, active = false }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeInOut" } }} // Microinteracción de elevación táctil
    className="bg-(--surface-high) p-4 rounded-sm transition-all hover:bg-(--surface-highest)/50"
  >
    <p className="text-[9px] uppercase tracking-widest text-(--on-surface-variant) mb-1">{label}</p>
    <p className={`text-2xl font-bold font-headline ${active ? 'text-white' : 'text-(--on-surface-variant)'}`}>
      {value}
    </p>
    <div className="w-full bg-black/20 h-1 mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }} // Evita re-animaciones innecesarias al hacer scroll repetido
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }} // Ajuste de aceleración para la carga de datos de la barra
        className={`h-full ${active ? 'bg-(--secondary)' : 'bg-(--on-surface-variant)/30'}`} 
      />
    </div>
  </motion.div>
);

const HyperparameterRow = ({ label, value, last = false }) => (
  <motion.div 
    variants={itemVariants} 
    whileHover={{ x: 4, transition: { duration: 0.15 } }} // Feedback sutil lateral al hacer hover en filas técnicas
    className={`flex justify-between items-center py-3 ${!last ? 'border-b border-white/5' : ''}`}
  >
    <span className="text-[9px] uppercase text-(--on-surface-variant) tracking-widest">{label}</span>
    <span className="font-headline text-sm text-white font-medium">{value}</span>
  </motion.div>
);

export default function Analysis() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots p-6 lg:p-12 mb-6"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="h-px bg-(--secondary)"
                ></motion.span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-(--secondary) uppercase">
                  Módulo: Evaluación de Modelos
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase leading-none">
                Análisis de Modelos & <br />
                <span className="text-(--primary-container) inline-block relative">Dashboard de Comparación</span>
              </h1>
            </div>

            {/* Bloque de Estado Lateral para simetría de diseño técnico con Predict */}
            <motion.div 
              layout
              className="bg-black/20 p-4 border border-white/5 rounded-sm backdrop-blur-xs min-w-55 transition-all hover:border-(--secondary)/20 hidden md:block"
            >
              <p className="text-[9px] font-mono text-[#bec8d2]/40 uppercase mb-1">Métrica Global</p>
              <p className="text-[11px] font-bold text-(--secondary) tracking-widest uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-(--secondary) rounded-full animate-pulse"></span>
                R² SCORE: 0.942
              </p>
            </motion.div>
          </motion.div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          
          {/* LADO IZQUIERDO */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <section className="bento-card">
              <h2 className="text-lg font-bold font-headline uppercase tracking-tight text-white mb-8">Rendimiento General del Motor Predictivo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h3 className="text-[10px] uppercase tracking-widest text-(--secondary) font-bold">Gradient Boosting (XGB)</h3>
                    <span className="bg-(--secondary)/10 text-(--secondary) px-2 py-0.5 rounded-sm text-[8px] font-bold border border-(--secondary)/20 uppercase">Activo</span>
                  </div>
                  <MetricCard label="MAE" value="€842.12" progress={88} active />
                  <MetricCard label="RMSE" value="€1,104.50" progress={92} active />
                </div>
                <div className="space-y-6 opacity-60">
                   <div className="flex justify-between items-end">
                    <h3 className="text-[10px] uppercase tracking-widest text-(--on-surface-variant) font-bold">Random Forest Regressor</h3>
                    <span className="bg-white/5 text-(--on-surface-variant) px-2 py-0.5 rounded-sm text-[8px] font-bold border border-white/10 uppercase">Referencia</span>
                  </div>
                  <div className="grid gap-4">
                    <MetricCard label="Error Medio Absoluto (MAE)" value="€915.80" progress={82} />
                    <MetricCard label="Error Cuadrático Medio (RMSE)" value="€1,240.22" progress={78} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-(--surface-low) p-8 rounded-sm">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-lg font-bold font-headline uppercase tracking-tight text-white">Distribución del Error por Segmento</h2>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 px-2 relative border-b border-white/10">
                {[
                  { label: '0-15k €', h1: '25%', h2: '35%' },
                  { label: '15k-30k €', h1: '45%', h2: '60%' },
                  { label: '30k-60k €', h1: '30%', h2: '40%' },
                  { label: '60k-100k €', h1: '80%', h2: '95%' },
                  { label: 'Lujo 100k+', h1: '60%', h2: '75%' },
                ].map((bar, i) => (
                  <motion.div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1 w-full max-w-12 h-full">
                      {/* Control secuencial exacto mediante stagger controlado localmente con el índice 'i' */}
                      <motion.div 
                        initial={{ scaleY: 0 }} 
                        whileInView={{ scaleY: 1 }} 
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ originY: 1 }} // Asegura que el escalado crezca desde la base inferior de la gráfica
                        transition={{ delay: 0.05 * i, duration: 0.8, ease: [0.25, 1, 0.5, 1] }} 
                        style={{ height: bar.h1, originY: 1 }} 
                        className="flex-1 bg-(--secondary)/80"
                      ></motion.div>
                      <motion.div 
                        initial={{ scaleY: 0 }} 
                        whileInView={{ scaleY: 1 }} 
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ originY: 1 }}
                        transition={{ delay: 0.05 * i + 0.1, duration: 0.8, ease: [0.25, 1, 0.5, 1] }} 
                        style={{ height: bar.h2, originY: 1 }} 
                        className="flex-1 bg-(--surface-highest)"
                      ></motion.div>
                    </div>
                    <span className="mt-4 text-[8px] font-bold uppercase text-(--on-surface-variant)">{bar.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* LADO DERECHO */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-(--surface-container) p-6 rounded-sm">
              <h2 className="text-md font-bold font-headline tracking-widest text-white mb-6 uppercase">Curva de Aprendizaje</h2>
              <div className="h-32 bg-black/20 rounded-sm">
                <motion.svg className="w-full h-full p-2" viewBox="0 0 200 100" preserveAspectRatio="none">
                  {/* Animación del trazado SVG usando pathLength controlado por la visibilidad en el viewport */}
                  <motion.path 
                    initial={{ pathLength: 0 }} 
                    whileInView={{ pathLength: 1 }} 
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }} 
                    d="M0 90 Q 50 10, 200 5" 
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="2" 
                  />
                </motion.svg>
              </div>
            </div>

            <div className="bg-(--surface-container) p-6 rounded-sm border-t-2 border-(--secondary)/20 grow">
              <h2 className="text-md font-bold font-headline tracking-widest text-white mb-6 uppercase">Hiperparámetros</h2>
              <HyperparameterRow label="Profundidad" value="8 Niveles" />
              <HyperparameterRow label="Tasa Aprendizaje" value="0.025" />
              <HyperparameterRow label="Estimadores" value="1,500" />
              <HyperparameterRow label="Submuestreo" value="0.82" last />
            </div>
          </aside>
        </div>

        {/* Footer Banner */}
        <motion.section 
          variants={itemVariants} 
          className="mt-12 relative h-100 rounded-sm overflow-hidden group"
        >
          <img src={AnalysisPhoto} className="w-full h-full object-cover opacity-20 grayscale transition-transform duration-[2s] group-hover:scale-105" alt="Análisis Técnico" />
          <div className="absolute inset-0 bg-linear-to-t from-(--surface) to-transparent"></div>
          <div className="absolute bottom-12 left-12">
            <div className="flex items-center gap-4 mb-2">
                <span className="h-px w-8 bg-(--secondary)"></span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-(--secondary)">Arquitectura Neural Fabric</span>
             </div>
             <h3 className="text-4xl font-headline font-bold text-white uppercase tracking-tighter mb-4">El Proceso de Diseño Kinético</h3>
             <p className="max-w-xl text-(--on-surface-variant) text-lg font-light leading-relaxed">
               Nuestro motor de valoración utiliza un método de ensamble propio, combinando la precisión categórica de Gradient Boosting con el manejo robusto de varianza de arquitecturas Random Forest.
             </p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}