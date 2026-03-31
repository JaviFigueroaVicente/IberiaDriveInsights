import { Link } from 'react-router-dom'
import '../styles/footer.css'

export default function Footer(){
    return(
        <footer className="flex flex-col md:flex-row justify-between items-center border-t border-white/20 py-8 px-6">
            <div className="flex flex-col items-start gap-4">
                <h3>IBERIA DRIVE INSIGHTS</h3>
                <p className="text-xs">© 2026 IBERIA DRIVE INSIGHTS. TODOS LOS DERECHOS RESERVADOS</p>
            </div>
            <div>
                <ul className="flex flex-col justify-start mt-8 md:mt-0 md:flex-row gap-4 text-xs">
                    <li><Link to='/'>POLÍTICA DE PRIVACIDAD</Link></li>
                    <li><Link to='/'>POLÍTICA DE COOKIES</Link></li>
                    <li><Link to='/'>TERMINOS Y CONDICIONES</Link></li>
                    <li><Link to='/'>SOBRE NOSOTROS</Link></li>
                </ul>
            </div>
        </footer>
    )
}