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

export default function Home() {
  const root = useRef(null);
  const scope = useRef(null);

  // Animaciones Anime.js v4 para gráficos y barras de progreso
  useEffect(() => {
    scope.current = createScope(root.current);

    scope.current.add(() => {
      // Animación de flujo continuo para la línea del gráfico
      animate('.realtime-path', {
        strokeDashoffset: [200, 0],
        duration: 2500,
        easing: 'cubicBezier(0.4, 0, 0.2, 1)',
        loop: true
      });

      // Efecto de pulso para los puntos del gráfico
      animate('.data-point', {
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true
      });

      // Animación de las barras de progreso
      animate('.progress-bar', {
        scaleX: [0, 1],
        duration: 1500,
        easing: 'easeOutQuad'
      });
    });

    return () => scope.current.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        when: "beforeChildren" 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  const metricsSectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <motion.main 
      ref={root}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-(--surface)"
    >
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center px-6 md:px-20 py-24 overflow-hidden z-20 bg-(--surface)">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--surface)/60 to-(--surface) pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <span className="inline-block w-12 h-0.5 bg-[#22d3ee]"></span>
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#22d3ee] uppercase">
                MOTOR PREDICTIVO V1.0
              </span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-white text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8 uppercase">
              La Ciencia de Datos Aplicada al<br />
              <span className="text-(--primary)">Mercado Automotriz.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed text-[#bec8d2]">
              Arquitecturas avanzadas de Machine Learning para ofrecer las valoraciones más precisas del mercado ibérico con latencia de milisegundos.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/predict">
                <button className="btn-primary-engine h-14 px-10 text-base flex items-center gap-3">
                  Empezar Predicción <img src={Trending} alt="Trend" className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/">
                <button className="bg-(--surface-high) hover:bg-(--surface-highest) transition-colors h-14 px-8 rounded-sm text-white text-base font-semibold border-b-2 border-[#89ceff]/30">
                  Ver Precisión
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-4 hidden lg:block relative">
            <div className="neural-glow top-0 right-0 w-64 h-64 opacity-20"></div>
            <div className="relative glass-panel p-8 rounded-lg border border-white/5 shadow-2xl backdrop-blur-xl bg-(--surface-high)/40">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end text-[10px] text-[#bec8d2] font-semibold tracking-widest uppercase">
                  <div>LAST UPDATE <span className="block font-mono text-sm text-(--secondary) normal-case tracking-normal">2 MINS AGO</span></div>
                  <div className="text-right">PROCESSED <span className="block font-mono text-sm text-white normal-case tracking-normal">1.2M DATAPOINTS</span></div>
                </div>
                <div className="relative glass-panel p-8 rounded-lg border border-white/5 shadow-2xl backdrop-blur-xl bg-(--surface-high)/40">
                  <div className="h-48 w-full bg-black/20 rounded-sm flex items-center justify-center border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#89ceff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                      <path className="realtime-path" d="M0 40 L20 20 L40 35 L60 10 L80 25 L100 5" fill="none" stroke="#89ceff" strokeWidth="2" strokeDasharray="200" />
                      <circle className="data-point" cx="20" cy="20" r="2" fill="#5de6ff" />
                      <circle className="data-point" cx="60" cy="10" r="2" fill="#5de6ff" />
                      <circle className="data-point" cx="100" cy="5" r="2" fill="#5de6ff" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- METRICS SECTION --- */}
      <motion.section 
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.2, delayChildren: 0.1 } 
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 bg-(--surface-low) py-24 px-6 md:px-20 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-1">
            <h2 className="text-white text-3xl font-bold mb-6 tracking-tight uppercase">Integridad del Motor & Métricas</h2>
            <p className="leading-relaxed text-[#bec8d2] mb-8">Nuestros modelos de Machine Learning se validan mediante dos posibles arquitecturas, comparando datos genéricos con flujos de mercado real.</p>
            
            {/* Precisión XGBOOST con animación de barra */}
            <div className="p-6 bg-(--surface-highest) rounded-sm border border-white/5 mb-6">
              <div className="flex items-center gap-3 mb-2"><img src={Verified} alt="Verified" className="w-4 h-4" /><span className="text-[10px] font-bold text-white tracking-widest uppercase">PRECISIÓN DE XGBOOST</span></div>
              <div className="text-5xl font-bold text-(--primary) mb-4">88.55%</div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "88.55%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-(--primary)" 
                />
              </div>
            </div>

            {/* Precisión Random Forest con animación de barra */}
            <div className="p-6 bg-(--surface-highest) rounded-sm border border-white/5">
              <div className="flex items-center gap-3 mb-2"><img src={Verified} alt="Verified" className="w-4 h-4" /><span className="text-[10px] font-bold text-white tracking-widest uppercase">PRECISIÓN DE RANDOM FOREST</span></div>
              <div className="text-5xl font-bold text-(--secondary) mb-4">93.85%</div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "93.85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-(--secondary)" 
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas que aparecen en cascada */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-(--surface-container) p-8 rounded-lg border-l-4 border-(--primary)">
              <div className="flex justify-between items-start mb-6"><img src={Analytics} alt="Analytics" className="w-8 h-8 opacity-70" /><span className="text-xs font-mono opacity-60 uppercase">XGBOOST</span></div>
              <h3 className="text-white text-xl font-bold mb-2 uppercase">Margen de Error</h3>
              <p className="text-4xl font-light text-white mb-4">1.455,53€</p>
              <p className="text-sm text-[#bec8d2]">Varianza observada con simulaciones reales usando el modelo de regresión.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-(--surface-container) p-8 rounded-lg border-l-4 border-(--secondary)">
              <div className="flex justify-between items-start mb-6"><img src={DynamicFeed} alt="Feed" className="w-8 h-8 opacity-70" /><span className="text-xs font-mono opacity-60 uppercase">XGBOOST</span></div>
              <h3 className="text-white text-xl font-bold mb-2 uppercase">Margen de Confianza</h3>
              <p className="text-4xl font-light text-white mb-4">91.1%</p>
              <p className="text-sm text-[#bec8d2]">Intervalo de confianza para modelos de vehículo de cualquier antigüedad.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-(--surface-container) p-8 rounded-lg border-l-4 border-(--primary)">
              <div className="flex justify-between items-start mb-6"><img src={Analytics} alt="Analytics" className="w-8 h-8 opacity-70" /><span className="text-xs font-mono opacity-60 uppercase">RANDOM FOREST</span></div>
              <h3 className="text-white text-xl font-bold mb-2 uppercase">Margen de Error</h3>
              <p className="text-4xl font-light text-white mb-4">1.359,71€</p>
              <p className="text-sm text-[#bec8d2]">Varianza observada con simulaciones reales usando aprendizaje en árbol.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-(--surface-container) p-8 rounded-lg border-l-4 border-(--secondary)">
              <div className="flex justify-between items-start mb-6"><img src={DynamicFeed} alt="Feed" className="w-8 h-8 opacity-70" /><span className="text-xs font-mono opacity-60 uppercase">RANDOM FOREST</span></div>
              <h3 className="text-white text-xl font-bold mb-2 uppercase">Margen de Confianza</h3>
              <p className="text-4xl font-light text-white mb-4">91.34%</p>
              <p className="text-sm text-[#bec8d2]">Intervalo de confianza para modelos de vehículo hasta el año 2018.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- CORE ARCHITECTURE --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 } // El delay entre la aparición de cada tarjeta
          }
        }}
        className="py-24 px-6 md:px-20 bg-(--surface-lowest)"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-white text-4xl font-bold mb-4 uppercase"
          >
            Arquitectura del Núcleo Predictivo
          </motion.h2>
          <motion.div 
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            className="h-1 w-24 bg-(--primary) opacity-50 mx-auto mb-6"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
            className="group p-8 bg-(--surface-container) hover:bg-(--surface-high) transition-all duration-300 border border-white/5 rounded-lg"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="size-12 rounded-sm flex items-center justify-center bg-(--primary)/10">
                <img src={AccountTree} alt="Tree" className="w-6 h-6" />
              </div>
              <h3 className="text-white text-2xl font-bold tracking-tight uppercase">Random Forest</h3>
            </div>
            <p className="leading-relaxed text-[#bec8d2] mb-8">Utiliza el aprendizaje en árboles de decisión para mejorar la precisión del modelo y predecir tendencias de mercado con alta estabilidad.</p>
            <span className="px-3 py-1 bg-black/30 text-[10px] font-bold text-white rounded-sm border border-white/5 uppercase">SCIKIT LEARN</span>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
            className="group p-8 bg-(--surface-container) hover:bg-(--surface-high) transition-all duration-300 border border-white/5 rounded-lg"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="size-12 rounded-sm flex items-center justify-center bg-(--secondary)/10">
                <img src={BlurOn} alt="Regression" className="w-6 h-6" />
              </div>
              <h3 className="text-white text-2xl font-bold tracking-tight uppercase">Regression</h3>
            </div>
            <p className="leading-relaxed text-[#bec8d2] mb-8">Utiliza el aprendizaje en regresión para capturar correlaciones lineales y no lineales complejas entre variables técnicas.</p>
            <span className="px-3 py-1 bg-black/30 text-[10px] font-bold text-white rounded-sm border border-white/5 uppercase">XGBOOST</span>
          </motion.div>
        </div>
      </motion.section>

      {/* --- CTA FINAL --- */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.5 }} 
        className="py-24 px-6 md:px-20 bg-(--surface)"
      >
        <div className="max-w-5xl mx-auto bg-[#222a3d] p-10 rounded-lg shadow-2xl relative border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-white text-4xl font-bold mb-2 uppercase">Inicializar Evaluación</h2>
            <p className="text-[#bec8d2]">Prueba las especificaciones para obtener un resultado estimado de alta fidelidad.</p>
          </div>
          <Link to="/predict">
            <button className="btn-primary-engine w-full h-14.5 text-sm flex items-center justify-center gap-2">
              GENERAR EVALUACIÓN <img src={Bolt} alt="Bolt" className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </motion.section>
    </motion.main>
  );
}