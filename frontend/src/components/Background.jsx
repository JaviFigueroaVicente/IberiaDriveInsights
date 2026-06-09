import { motion } from 'framer-motion';

export const Background = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Rejilla estática con brillo sutil */}
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(#00e676 0.5px, transparent 0.5px)', 
      backgroundSize: '40px 40px' 
    }}></div>

    {/* Línea de escaneo vertical */}
    <motion.div 
      initial={{ top: '-10%' }}
      animate={{ top: '110%' }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      className="absolute left-0 w-full h-px bg-linear-to-r from-transparent via-(--primary-container) to-transparent opacity-30"
    ></motion.div>

    {/* Círculos de datos (Glows) */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ repeat: Infinity, duration: 10 }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-(--primary-container)/10 rounded-full blur-3xl"
    ></motion.div>
    
    <motion.div 
      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ repeat: Infinity, duration: 15, delay: 2 }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-(--secondary)/10 rounded-full blur-3xl"
    ></motion.div>
  </div>
);