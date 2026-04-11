import Database from "../assets/icons/database.svg";
import Description from "../assets/icons/description.svg";
import FactCheck from "../assets/icons/fact_check.svg";
import Memory from "../assets/icons/memory.svg";
import { Link } from "react-router-dom";

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
  <div className={`bg-(--surface-low) border border-white/5 border-l-4 border-l-(--primary-container) p-8 rounded-sm flex flex-col justify-between hover:bg-(--surface-container) transition-all duration-500 group ${className}`}>
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
  </div>
);

export default function Models() {
  return (
    <div className="min-h-screen bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots p-6 lg:p-12 mb-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera Técnica */}
        <header className="mb-12">
            {/* --- Cuerpo Principal: Título + Widget de Datos --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4 flex-1">
                {/* Etiqueta de Módulo con línea característica */}
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-(--secondary)"></span>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-(--secondary) uppercase">
                        Ecosistema: Ensamble Híbrido
                    </span>
                </div>
                
                {/* Título Principal con efectos de opacidad */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase leading-none">
                    Lógica del <br />
                    <span className="text-(--primary-container)">Motor Predictivo</span>
                </h1>

                {/* Descripción técnica */}
                <p className="max-w-2xl text-[11px] md:text-xs text-(--on-surface-variant) font-light leading-relaxed uppercase tracking-wide opacity-80">
                    Combinamos la velocidad de modelos lineales con la profundidad de <span className="text-white font-bold text-[10px]">redes neuronales</span> para garantizar que cada tasación refleje la realidad física del mercado.
                </p>
                </div>
                </div>
            </header>

        {/* Rejilla Bento: Explicación de Modelos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          
          <ArchitectureCard 
            className="md:col-span-8"
            number="01"
            subtitle="Regresión Avanzada"
            title="Gradient Boosting (XGBoost)"
            badge="Capa de Precisión"
            description="Es el corazón del sistema. Funciona mediante un proceso iterativo de corrección: cada árbol de decisión aprende de los errores (residuos) del anterior. Esto permite capturar matices mínimos en el valor de extras y equipamiento que otros modelos ignoran."
            metrics={[
              { label: 'Método', value: 'Corrección Residual' },
              { label: 'Profundidad', value: 'Max-Depth 12' },
              { label: 'Learning Rate', value: '0.012_ETA' },
              { label: 'Ajuste', value: 'Dinámico' }
            ]}
          />

          <ArchitectureCard 
            className="md:col-span-4 md:row-span-2"
            number="02"
            subtitle="Control de Varianza"
            title="Random Forest"
            badge="Estabilidad"
            description="Actúa como un 'filtro de realidad'. Al generar cientos de árboles independientes y promediar sus resultados, Random Forest neutraliza el ruido del mercado y los valores atípicos (outliers) causados por anuncios con precios irreales en portales públicos."
            metrics={[
              { label: 'Estimadores', value: '1,500 Árboles' },
              { label: 'Bootstrap', value: 'True (0.8)' },
              { label: 'Varianza', value: 'Mínima' },
              { label: 'Validación', value: 'Cross-Val' },
              { label: 'Robustez', value: 'Alta' },
              { label: 'Confianza', value: '99.4%' }
            ]}
          />

          <ArchitectureCard 
            className="md:col-span-8"
            number="03"
            subtitle="Análisis de Contexto"
            title="Capa Macroeconómica"
            badge="Contextual"
            description="No todo es el coche; el entorno importa. Esta capa ajusta la valoración final basándose en el IPC, el coste de financiación actual y la deseabilidad del modelo en zonas geográficas específicas, aplicando un factor de corrección por 'Sentimiento de Mercado'."
            metrics={[
              { label: 'Impacto IPC', value: 'Sincronizado' },
              { label: 'Zona Geográfica', value: 'Heat-Map' },
              { label: 'Stock Nivel', value: 'Real-Time' },
              { label: 'Factor K', value: '1.04_VAR' }
            ]}
          />
        </div>

        {/* Mejorado: Pipeline Visual de Datos */}
        <section className="mt-20 relative">
            {/* Encabezado del Pipeline */}
            <div className="flex items-center gap-4 mb-10">
                <div className="flex flex-col">
                  <span className="text-(--secondary) text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Workflow Terminal</span>
                  <h2 className="text-2xl font-bold font-headline uppercase tracking-tight text-white">Pipeline de Procesamiento</h2>
                  </div>
                  <div className="h-px grow bg-linear-to-r from-white/20 to-transparent"></div>
                  <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                </div>
            </div>

            {/* Flujo de Pasos Estilo Dashboard Técnico */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Línea conectora de fondo */}
                <div className="hidden md:block absolute top-11.25 left-0 w-full h-px bg-white/5 z-0"></div>

                {[
                    { 
                    id: '01', 
                    step: 'Ingesta Activa', 
                    desc: 'Sincronización con APIs de mercado y limpieza de metadatos VIN.',
                    status: 'Completado',
                    img: Database 
                    },
                    { 
                    id: '02', 
                    step: 'Normalización', 
                    desc: 'Escalado de variables y tratamiento de valores nulos o erróneos.',
                    status: 'En curso',
                    img: FactCheck 
                    },
                    { 
                    id: '03', 
                    step: 'Ensamble Neuronal', 
                    desc: 'Cómputo paralelo en núcleos CUDA (XGBoost + RF + DL).',
                    status: 'Esperando',
                    img: Memory
                    },
                    { 
                    id: '04', 
                    step: 'Entrega de Informe', 
                    desc: 'Generación de PDF técnico con validación de confianza.',
                    status: 'Esperando',
                    img: Description 
                    }
                ].map((item, index) => (
                    <div key={index} className="bg-(--surface-container)/50 border border-white/5 p-6 rounded-sm relative z-10 group hover:border-(--secondary)/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                          {/* Contenedor de la Imagen */}
                          <div className={`w-12 h-12 rounded-xs flex items-center justify-center border transition-all duration-500 ${index === 1 ? 'border-(--secondary) bg-(--secondary)/10' : 'border-white/10'}`}>
                          <img 
                              src={item.img} 
                              alt={item.step} 
                              className={`w-6 h-6 object-contain transition-all ${index === 1 ? 'brightness-110 drop-shadow-[0_0_8px_rgba(93,230,255,0.6)]' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`} 
                          />
                          </div>
                          <span className="font-mono text-[10px] text-white/20 group-hover:text-(--secondary)/40">STEP_{item.id}</span>
                      </div>
                      
                      <h4 className="text-white text-xs font-bold uppercase mb-2 tracking-widest">{item.step}</h4>
                      <p className="text-[11px] text-(--on-surface-variant) leading-relaxed mb-4 opacity-70 group-hover:opacity-100">
                          {item.desc}
                      </p>

                      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                          <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-(--secondary) animate-pulse' : 'bg-white/10'}`}></div>
                          <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">{item.status}</span>
                      </div>
                    </div>
                ))}
                </div>
            </section>

            {/* --- FOOTER DE ACCIÓN MEJORADO --- */}
            <footer className="mt-20 p-10 border border-(--secondary)/20 bg-linear-to-b from-(--secondary)/5 to-transparent rounded-sm flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                  <div className="text-right border-r border-white/10 pr-6 hidden md:block">
                  <p className="text-[9px] text-white/30 uppercase font-mono leading-none mb-1">System Health</p>
                  <p className="text-xs text-(--secondary) font-bold font-mono tracking-tighter uppercase">99.98% Stable</p>
                  </div>
                  <div className="max-w-md">
                  <h3 className="text-white font-bold uppercase text-sm mb-1 tracking-tight">¿Listo para procesar una unidad?</h3>
                  <p className="text-[11px] text-(--on-surface-variant) uppercase opacity-60">El motor de inferencia está listo para recibir nuevos parámetros.</p>
                  </div>
              </div>
              
              <div className="flex gap-4">
                  <Link to="my-predictions">
                      <button className="border border-white/10 text-white text-[10px] font-bold uppercase px-8 py-4 rounded-xs hover:bg-white/5 transition-all tracking-widest">
                          Ver Registros
                      </button>
                  </Link>
                  <Link to="/predict">
                      <button className="bg-(--primary-container) text-black text-[10px] font-bold uppercase px-8 py-4 rounded-xs hover:bg-(--secondary) transition-all tracking-widest shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95">
                          Nueva Valoración VIN
                      </button>
                  </Link>
              </div>
            </footer>
      </div>
    </div>
  );
}