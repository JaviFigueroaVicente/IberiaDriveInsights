export default function Error() {
  return (
    <div className="bg-[--surface] text-[--on-surface] min-h-screen flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative blueprint-grid-dots">

      {/* Fondo técnico sutil */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary-container) 1px, transparent 0)',
          backgroundSize: 'clamp(20px, 5vw, 32px) clamp(20px, 5vw, 32px)'
        }}
      />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        
        {/* Columna Mensaje: Centrada en móvil, alineada a la izquierda en desktop */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-10">
          
          <div className="space-y-4 w-full">
            <div className="inline-block">
              <h2
                className="text-[--secondary] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] border-b border-[--secondary]/20 pb-2"
              >
                Error Protocol: 404
              </h2>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
              Neural Path <br/>
              <span className="text-[--surface-container] [text-shadow:1px_1px_0_#1e263e,-1px_-1px_0_#1e263e,1px_-1px_0_#1e263e,-1px_1px_0_#1e263e]">Not Found</span>
            </h1>
            
            <p className="text-[--on-surface-variant] text-sm md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed opacity-80">
              El nodo de datos solicitado ha sido desconectado o movido fuera del cluster de inteligencia.
            </p>
          </div>

          {/* Terminal de Error: Ajustable al ancho */}
          <div className="bg-[--surface-low]/50 backdrop-blur-sm p-4 md:p-6 rounded-xs border border-white/5 font-mono text-[10px] md:text-xs w-full max-w-sm">
            <div className="flex justify-between mb-2">
              <span className="text-[--on-surface-variant]/40">STATUS:</span>
              <span className="text-[--secondary] font-bold">TERMINATED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[--on-surface-variant]/40">ERROR_ID:</span>
              <span className="text-white">0x800404_NODE_MISSING</span>
            </div>
          </div>

          {/* Botón: Full width en móvil pequeño, auto en desktop */}
          <div className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[--primary-container] hover:bg-[--secondary] text-[--surface] px-8 md:px-12 py-4 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-[--primary-container]/10">
              Volver al Centro de Control
            </button>
          </div>
        </div>

        {/* Columna Visual: Se oculta en móviles pequeños o se vuelve más sutil */}
        <div className="hidden lg:flex justify-center relative select-none">
          <span className="text-[15rem] xl:text-[22rem] font-black text-[--surface-lowest] leading-none tracking-tighter">
            404
          </span>
          
          {/* Círculo decorativo escalable */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 xl:w-80 xl:h-80 border border-[--secondary]/10 rounded-full animate-[pulse_4s_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 xl:w-96 xl:h-96 border border-[--primary]/5 rounded-full" />
        </div>
      </div>

      {/* Marca de agua / Versión (Opcional, inferior derecha) */}
      <div className="absolute bottom-6 right-6 hidden md:block">
        <span className="text-[9px] font-mono text-[--on-surface-variant]/20 uppercase tracking-widest">
          v2.4 // Kinetic Blueprint
        </span>
      </div>
    </div>
  );
};