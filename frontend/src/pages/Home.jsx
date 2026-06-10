import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createScope } from 'animejs';
import { animate } from 'animejs/animation';

import Trending from '../assets/icons/trending.svg';
import Analytics from '../assets/icons/analytics.svg';
import Verified from '../assets/icons/verified.svg';
import DynamicFeed from '../assets/icons/dynamic_feed.svg';
import AccountTree from '../assets/icons/account_tree.svg';
import BlurOn from '../assets/icons/blur_on.svg';
import Bolt from '../assets/icons/bolt.svg';

import brainVideo from '../assets/videos/Brain_Hologram.mp4';

// Variantes maestras para el bloque inicial (Hero)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.12,
      when: "beforeChildren" 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

export default function Home() {
  const root = useRef(null);
  const scope = useRef(null);

  // Ciclo controlado de inicialización para Anime.js v4
  useEffect(() => {
    scope.current = createScope(root.current);

    scope.current.add(() => {
      animate('.progress-bar', {
        scaleX: [0, 1],
        duration: 1200,
        easing: 'easeOutQuad'
      });
    });

    return () => scope.current.revert();
  }, []);

  return (
    <motion.main 
      ref={root}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots"
    >
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] overflow-hidden z-20 flex items-center px-6 md:px-20">
        
        {/* Capa de Vídeo */}
        <div className="absolute inset-0 z-0 hidden md:block select-none pointer-events-none">
          <video 
            src={brainVideo} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute w-full h-full object-cover opacity-35"
            style={{ 
              objectPosition: '85% 50%',
              transform: 'translateZ(0)' 
            }} 
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--surface) via-(--surface)/85 to-transparent"></div>
        </div>

        {/* Contenido Técnico */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="lg:max-w-4xl">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <span className="inline-block w-12 h-0.5 bg-(--secondary)"></span>
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-(--secondary) uppercase">
                MOTOR PREDICTIVO V1.0
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-white text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter mb-8 uppercase font-headline">
              La Ciencia de Datos <br />Aplicada al{" "}
              <span className="text-(--primary-container)">Mercado Automotriz.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl mb-10 leading-relaxed text-(--on-surface-variant) font-light max-w-3xl">
              Arquitecturas avanzadas de Machine Learning para ofrecer las valoraciones más precisas del mercado ibérico con latencia de milisegundos.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/predict">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary-engine h-14 px-10 text-xs font-bold tracking-widest uppercase flex items-center gap-3 cursor-pointer"
                >
                  Empezar Predicción <img src={Trending} alt="Trend" className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/analysis">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="bg-(--surface-high) hover:bg-(--surface-highest) transition-colors h-14 px-8 rounded-sm text-white text-xs tracking-widest font-bold border-b-2 border-(--primary)/20 cursor-pointer uppercase"
                >
                  Ver Precisión
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-(--surface-low) min-h-[calc(100vh-5rem)] flex flex-col justify-center py-16 px-6 md:px-20 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center w-full">
          
          {/* Columna Izquierda: Información de los Modelos */}
          <div className="lg:col-span-1 space-y-5">
            <h2 className="text-white text-3xl font-bold tracking-tight uppercase font-headline">
              Integridad del Motor & Métricas
            </h2>
            <p className="leading-relaxed text-(--on-surface-variant) text-sm font-light">
              Nuestros modelos de Machine Learning se validan mediante dos posibles arquitecturas, comparando datos genéricos con flujos de mercado real.
            </p>
            
            {/* Precisión XGBOOST */}
            <div className="p-5 bg-(--surface-highest) rounded-sm border border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <img src={Verified} alt="Verified" className="w-4 h-4" />
                <span className="text-[9px] font-bold text-white tracking-widest uppercase opacity-60">PRECISIÓN DE XGBOOST</span>
              </div>
              <div className="text-4xl font-bold text-(--primary) mb-3 font-headline tracking-tight">88.55%</div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "88.55%" }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full bg-(--primary) progress-bar origin-left" 
                />
              </div>
            </div>

            {/* Precisión Random Forest */}
            <div className="p-5 bg-(--surface-highest) rounded-sm border border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <img src={Verified} alt="Verified" className="w-4 h-4" />
                <span className="text-[9px] font-bold text-white tracking-widest uppercase opacity-60">PRECISIÓN DE RANDOM FOREST</span>
              </div>
              <div className="text-4xl font-bold text-(--secondary) mb-3 font-headline tracking-tight">93.85%</div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "93.85%" }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full bg-(--secondary) progress-bar origin-left" 
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas de Métricas en Rejilla */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {[
              { type: "XGBOOST", label: "Margen de Error", value: "1.455,53€", desc: "Varianza observada con simulaciones reales usando el modelo de regresión.", border: "border-l-(--primary)" },
              { type: "XGBOOST", label: "Margen de Confianza", value: "91.1%", desc: "Intervalo de confianza para modelos de vehículo de cualquier antigüedad.", border: "border-l-(--secondary)" },
              { type: "RANDOM FOREST", label: "Margen de Error", value: "1.359,71€", desc: "Varianza observada con simulaciones reales usando aprendizaje en árbol.", border: "border-l-(--primary)" },
              { type: "RANDOM FOREST", label: "Margen de Confianza", value: "91.34%", desc: "Intervalo de confianza para modelos de vehículo hasta el año 2018.", border: "border-l-(--secondary)" }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.18 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className={`bg-(--surface-container) p-6 lg:p-8 rounded-sm border border-white/5 border-l-4 ${card.border} group hover:bg-(--surface-high) transition-colors flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4 lg:mb-6">
                    <img src={Analytics} alt="Icon" className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">{card.type}</span>
                  </div>
                  <h3 className="text-white text-sm lg:text-base font-bold mb-1 uppercase tracking-wider">{card.label}</h3>
                  <p className="text-2xl lg:text-3xl font-light text-white mb-3 tracking-tight">{card.value}</p>
                </div>
                <p className="text-xs text-(--on-surface-variant) opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CORE ARCHITECTURE & CTA */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="min-h-[calc(100vh-5rem)] flex flex-col justify-between py-16 px-6 md:px-20 bg-(--surface-lowest) border-t border-white/5"
      >
        <div className="my-auto max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-white text-3xl md:text-4xl font-bold uppercase font-headline tracking-tight">
              Arquitectura del Núcleo Predictivo
            </h2>
            <div className="h-0.5 w-20 bg-(--primary-container) opacity-60 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Bloque Random Forest */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group p-6 lg:p-8 bg-(--surface-container) hover:bg-(--surface-high) transition-all duration-300 border border-white/5 rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="size-11 rounded-xs flex items-center justify-center bg-(--primary)/10 border border-(--primary)/10 group-hover:border-(--primary)/30 transition-colors">
                    <img src={AccountTree} alt="Tree" className="w-5 h-5" />
                  </div>
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-tight uppercase group-hover:text-(--primary) transition-colors">Random Forest</h3>
                </div>
                <p className="leading-relaxed text-(--on-surface-variant) text-xs lg:text-sm font-light mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  Utiliza el aprendizaje en árboles de decisión para mejorar la precisión del modelo y predecir tendencias de mercado con alta estabilidad dimensional.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-black/30 text-[9px] font-bold text-white/60 rounded-xs border border-white/5 uppercase font-mono tracking-widest">
                  SCIKIT LEARN
                </span>
              </div>
            </motion.div>

            {/* Bloque Regression */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group p-6 lg:p-8 bg-(--surface-container) hover:bg-(--surface-high) transition-all duration-300 border border-white/5 rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="size-11 rounded-xs flex items-center justify-center bg-(--secondary)/10 border border-(--secondary)/10 group-hover:border-(--secondary)/30 transition-colors">
                    <img src={BlurOn} alt="Regression" className="w-5 h-5" />
                  </div>
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-tight uppercase group-hover:text-(--secondary) transition-colors">Regression</h3>
                </div>
                <p className="leading-relaxed text-(--on-surface-variant) text-xs lg:text-sm font-light mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  Utiliza el aprendizaje en regresión iterativa para capturar correlaciones lineales y no lineales complejas entre variables de equipamiento técnico.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-black/30 text-[9px] font-bold text-white/60 rounded-xs border border-white/5 uppercase font-mono tracking-widest">
                  XGBOOST
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bloque CTA */}
        <div className="w-full max-w-5xl mx-auto pt-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-(--surface-high) p-6 lg:p-8 rounded-sm relative border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xs"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-white text-2xl font-bold uppercase font-headline tracking-tight">Inicializar Evaluación</h2>
              <p className="text-(--on-surface-variant) text-xs font-light">Prueba las especificaciones para obtener un resultado estimado de alta fidelidad.</p>
            </div>
            <div className="w-full sm:w-auto">
              <Link to="/predict">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary-engine w-full sm:w-auto h-12.5 px-8 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  GENERAR EVALUACIÓN <img src={Bolt} alt="Bolt" className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}