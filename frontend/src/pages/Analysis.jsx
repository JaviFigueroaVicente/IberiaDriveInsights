import AnalysisPhoto from '../assets/analysis/bg-analysis.png';

const MetricCard = ({ label, value, progress, active = false }) => (
  <div className="bg-(--surface-high) p-4 rounded-sm transition-all hover:bg-(--surface-highest)/50">
    <p className="text-[9px] uppercase tracking-widest text-(--on-surface-variant) mb-1">{label}</p>
    <p className={`text-2xl font-bold font-headline ${active ? 'text-white' : 'text-(--on-surface-variant)'}`}>
      {value}
    </p>
    <div className="w-full bg-black/20 h-1 mt-4 overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${active ? 'bg-(--secondary)' : 'bg-(--on-surface-variant)/30'}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const HyperparameterRow = ({ label, value, last = false }) => (
  <div className={`flex justify-between items-center py-3 ${!last ? 'border-b border-white/5' : ''}`}>
    <span className="text-[9px] uppercase text-(--on-surface-variant) tracking-widest">{label}</span>
    <span className="font-headline text-sm text-white font-medium">{value}</span>
  </div>
);

export default function Analysis() {
  return (
    <div className="min-h-screen bg-(--surface) text-(--on-surface) font-body blueprint-grid-dots p-6 lg:p-12 mb-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Principal */}
        <header className="mb-12">
            {/* --- Cuerpo Principal: Título + Widget de Datos --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                {/* Sub-etiqueta con línea característica */}
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-(--secondary)"></span>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-(--secondary) uppercase">
                        Módulo: Evaluación de Modelos
                    </span>
                </div>
                
                {/* Título Principal con Énfasis */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase leading-none">
                    Análisis de Modelos & <br />
                    <span className="text-(--primary-container)">Dashboard de Comparación</span>
                </h1>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          
          {/* LADO IZQUIERDO: Performance y Gráficos */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            <section className="bento-card">              
              <h2 className="text-lg font-bold font-headline uppercase tracking-tight text-white kinetic-header mb-8">
                Rendimiento General del Motor Predictivo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* XGB */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h3 className="text-[10px] uppercase tracking-widest text-(--secondary) font-bold">Gradient Boosting (XGB)</h3>
                    <span className="bg-(--secondary)/10 text-(--secondary) px-2 py-0.5 rounded-sm text-[8px] font-bold border border-(--secondary)/20 uppercase">Activo Actualmente</span>
                  </div>
                  <div className="grid gap-4">
                    <MetricCard label="Error Medio Absoluto (MAE)" value="€842.12" progress={88} active />
                    <MetricCard label="Error Cuadrático Medio (RMSE)" value="€1,104.50" progress={92} active />
                  </div>
                </div>

                {/* Random Forest */}
                <div className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
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

            {/* Distribución de Error */}
            <section className="bg-(--surface-low) p-8 rounded-sm">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-lg font-bold font-headline uppercase tracking-tight text-white kinetic-header">
                  Distribución del Error por Segmento de Precio
                </h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-(--secondary)"></div>
                    <span className="text-[9px] uppercase font-bold text-(--on-surface-variant)">XGB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-(--surface-highest)"></div>
                    <span className="text-[9px] uppercase font-bold text-(--on-surface-variant)">RF</span>
                  </div>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 px-2 relative border-b border-white/10">
                {[
                  { label: '0-15k €', h1: '25%', h2: '35%' },
                  { label: '15k-30k €', h1: '45%', h2: '60%' },
                  { label: '30k-60k €', h1: '30%', h2: '40%' },
                  { label: '60k-100k €', h1: '80%', h2: '95%' },
                  { label: 'Lujo 100k+', h1: '60%', h2: '75%' },
                ].map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1 w-full max-w-12 h-full">
                      <div className="flex-1 bg-(--secondary)/80 bar-grow" style={{ height: bar.h1 }}></div>
                      <div className="flex-1 bg-(--surface-highest) bar-grow" style={{ height: bar.h2 }}></div>
                    </div>
                    <span className="mt-4 text-[8px] font-bold uppercase text-(--on-surface-variant)">{bar.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* LADO DERECHO: Sidebar Técnico */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            <div className="bg-(--surface-container) p-6 rounded-sm">
              <h2 className="text-md font-bold font-headline tracking-widest text-white mb-6 uppercase">Curva de Aprendizaje</h2>
              <div className="h-32 bg-black/20 rounded-sm mb-4 relative overflow-hidden">
                <svg className="w-full h-full p-2" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <path d="M0 90 Q 50 10, 200 5" fill="none" stroke="var(--secondary)" strokeWidth="2" />
                  <path d="M0 95 Q 70 40, 200 35" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4" opacity="0.2" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-(--on-surface-variant)">
                <span>PÉRDIDA INICIAL: 0.842</span>
                <span>FINAL: 0.114</span>
              </div>
            </div>

            <div className="bg-(--surface-container) p-6 rounded-sm border-t-2 border-(--secondary)/20">
              <h2 className="text-md font-bold font-headline tracking-widest text-white mb-6 flex items-center gap-2 uppercase">
                <span className="material-symbols-outlined text-(--secondary)">memory</span> Hiperparámetros
              </h2>
              <HyperparameterRow label="Profundidad (Layers)" value="8 Niveles" />
              <HyperparameterRow label="Tasa de Aprendizaje" value="0.025" />
              <HyperparameterRow label="Estimadores (N)" value="1,500" />
              <HyperparameterRow label="Submuestreo" value="0.82" last />
              <button className="w-full bg-(--primary-container) hover:bg-(--secondary) text-white font-bold transition-colors duration-300 mt-6 py-3 text-[10px] uppercase tracking-widest rounded-xs">
                Reentrenar Configuración
              </button>
            </div>
            
            <div className="bg-(--surface-low) p-6 rounded-sm">
              <h2 className="text-md font-bold font-headline tracking-widest text-white mb-6 uppercase">Matriz de Precisión por Gamas</h2>
              <div className="space-y-4">
                {[
                  { label: 'SUV / Todoterreno', val: 'PICO', w: '80%', c: 'bg-(--secondary)' },
                  { label: 'Eléctricos (EV)', val: 'OPTIMAL', w: '95%', c: 'bg-(--primary-container)' },
                  { label: 'Berlinas / Compactos', val: 'ESTABLE', w: '65%', c: 'bg-white/20' }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[9px] font-bold mb-1 uppercase">
                      <span className="text-(--on-surface-variant)">{item.label}</span>
                      <span className="text-white">{item.val}</span>
                    </div>
                    <div className="h-1 bg-black/20 w-full"><div className={`${item.c} h-full`} style={{ width: item.w }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Imagen de Proceso */}
        <section className="mt-12 relative h-100 rounded-sm overflow-hidden group">
          <img 
            src={AnalysisPhoto} 
            className="w-full h-full object-cover opacity-20 grayscale transition-transform duration-[2s] group-hover:scale-105"
            alt="Análisis Técnico"
          />
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
        </section>
      </div>
    </div>
  );
}