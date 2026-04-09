import Monitoring from '../assets/icons/monitoring.svg'
import SettingsInputComponent from '../assets/icons/settings_input_component.svg'
import Share from '../assets/icons/share.svg'

export default function Footer() {
  return (
    <footer className="relative bg-(--surface-lowest) border-t border-white/5 py-16 px-6 md:px-20 overflow-hidden">
      {/* Sutil efecto de rejilla al final del footer */}
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-5"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-sm bg-(--primary-container)/10 p-1 flex items-center justify-center border border-(--primary-container)/20">
              <span className="text-center font-bold text-[5px] leading-none text-white uppercase grayscale">
                Iberia<br />Drive
              </span>
            </div>
            <h4 className="text-white font-bold tracking-tight uppercase">
              Iberia Drive <span className="text-(--primary-container)">Insights</span>
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-[#bec8d2]/80 font-light">
            El estándar de autoridad para la predicción del valor automotriz en la península ibérica. Impulsado por Motores Neuronales de alta precisión.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-bold text-white uppercase tracking-widest">
          {[
            { title: 'Red de Datos', links: ['Documentación API', 'Modelos ML', 'Integraciones'] },
            { title: 'Recursos', links: ['Informes de Mercado', 'Libros Blancos', 'Guías Fiscales'] },
            { title: 'Legal', links: ['Privacidad', 'Términos', 'Cumplimiento'] }
          ].map(section => (
            <div key={section.title} className="space-y-6">
              <h5 className="text-(--secondary) border-l-2 border-(--secondary) pl-3 leading-none">
                {section.title}
              </h5>
              <ul className="space-y-4 text-sm text-[#bec8d2] normal-case tracking-normal font-medium">
                {section.links.map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                      <span className="h-px w-0 bg-(--primary-container) transition-all group-hover:w-3"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-[#bec8d2]/40 uppercase tracking-[0.2em] font-mono">
        <div className="flex items-center gap-4">
          <p>© 2026 IBERIA DRIVE INSIGHTS</p>
          <span className="hidden md:inline text-white/10">|</span>
          <p className="text-(--secondary) opacity-80">v1.0-Estable</p>
        </div>

        <div className="flex gap-8 items-center">
          {/* Iconos sociales/técnicos */}
          <div className="flex gap-6 items-center text-[#bec8d2]/60">
            {[{ id: 'Share', src: Share },
              { id: 'Monitoring', src: Monitoring },
              { id: 'Settings', src: SettingsInputComponent }].map(icon => (
              <img 
                key={icon.id} 
                src={icon.src}
                alt={icon.id}
                className="cursor-pointer"
              >
              </img>
            ))}
          </div>
        </div>
      </div>

      {/* Detalle decorativo de esquina en el footer (opcional para simular el estilo de tarjeta) */}
      <div className="absolute bottom-0 right-0 h-16 w-16 border-b border-r border-white/10 pointer-events-none"></div>
    </footer>
  );
}