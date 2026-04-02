import {Link} from 'react-router-dom'
import '../styles/home.css'
import Trending from '../assets/icons/trending.svg'
import Analytics from '../assets/icons/analytics.svg'
import Verified from '../assets/icons/verified.svg'
import DynamicFeed from '../assets/icons/dynamic_feed.svg'
import AccountTree from '../assets/icons/account_tree.svg' 
import BlurOn from '../assets/icons/blur_on.svg'
import Bolt from '../assets/icons/bolt.svg'

export default function Home(){
    return (
        <div className='home'> 
            <section className='relative flex items-center px-6 md:px-20 py-20 '>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                    <div className='lg:col-span-8'>
                        <div className='flex items-center gap-3 mb-6'>
                            <span className='inline-block w-12 h-0.5 bg-[#22d3ee]'></span>
                            <span className='font-label tracking-[0.2em] text-xs font-bold'>MOTOR PREDICTIVO V1.0</span>
                        </div>
                        <h1 className='text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8'>La Ciencia de Datos Aplicada al<span className='text-primary'> Mercado Automotriz</span></h1>
                        <p className='text-lg md:text-xl max-w-2xl mb-10 leading-relaxed'>
                             Arquitecturas avanzadas de Machine Learning para ofrecer las valoraciones más precisas del mercado ibérico con latencia de milisegundos.
                        </p>
                        <div className='flex flex-wrap gap-4'>
                            <button className='prediciton-button h-14 px-10 font-bold tracking-wide flex items-center gap-3'>
                                Empezar Predicción
                                <img src={Trending} alt='' />
                            </button>
                            <button className='accuracy-button h-14 px-8 not-[]:text-base font-semibold border-b-2'>
                                Ver Precisión
                            </button>
                        </div>
                    </div>
                    {/* Buscar componenete animado de una gráfica */}
                    <div className='lg:col-span-4 lg:flex items-center'>
                        <div className='glass-panel p-8 rounded-lg border glow-subtle'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex justify-between items-end'>
                                    <div>
                                        <p className='font-label text-[10px] tracking-widest mb-1'>LAST UPDATE</p>
                                        <p className=' text-[#5de6ff] text-sm'>2 MINS AGO</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-label text-[10px] tracking-widest mb-1'>PROCESSED</p>
                                        <p className='e text-sm'>1.2M DATAPOINTS</p>
                                    </div>
                                </div>
                                <div className='h-px bg-outline-variant/20'></div>
                                <div className='relative h-48 w-full'>
                                    <img className='w-full h-full object-cover rounded-sm opacity-60 mix-blend-screen' data-alt='Futuristic glowing neon line chart displaying complex data trends on a dark technical background' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAilxC5REMDTwI5bEkGo64tSiRKQoUaYqRxVNLi-5so3uxPk2CutA014cDrfxbPnljxsJ_i8LiHJQcZRnRlWkohW1vN_Pjm-jgoKPPr8YCW1PVEZ4i-o1sK5UiS8xezWsRcMaeiSP-hAo7xBq5GXwtyi2TL8y86TCbVk7VlvV_OMDyq4RFH8E_TRFPl0OVrG_xqvvDvjCmNDhr3GVjHUYZg7VCVC697VbNCA4D7yUEFIn6-vO3E-y_QNLEd_c5DuETcdlte9r7fQTVu'/>
                                </div>
                            </div>
                        </div>                    
                    </div>
                </div>
            </section>
            <section className='metrics py-24 px-6 md:px-20'>
                <div className='max-w-7xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 items-start'>
                        <div className='lg:col-span-1'>
                            <h2 className='text-3xl font-bold mb-6 tracking-tight'>Integridad del Motor &amp; Métricas en Tiempo Real</h2>
                            <p className='mb-8 leading-relaxed'>
                                Nuestros modelos de Machine Learning se validan mediante dos posibles modelos, uno sacado de datos genéricos y el otro de datos reales.
                            </p>
                            <div className='p-6 rounded-0.125rem accuracy-meter mb-6'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <img src={Verified} alt='' />
                                    <span className='text-xs font-bold tracking-widest'>PRECISIÓN DE XGBOOST</span>
                                </div>
                                <div className='text-4xl font-bold mb-4 meter'>88.55%</div>
                                <div className='w-full h-2 rounded-full overflow-hidden meter-line'>
                                    <div className='h-full w-[88.55%]'></div>
                                </div>
                            </div>
                            <div className='p-6 rounded-0.125rem accuracy-meter'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <img src={Verified} alt='' />
                                    <span className='text-xs font-bold tracking-widest'>PRECISIÓN DE RANDOM FOREST</span>
                                </div>
                                <div className='text-4xl font-bold mb-4 meter'>93.85%</div>
                                <div className='w-full h-2 rounded-full overflow-hidden meter-line'>
                                    <div className='h-full w-[93.85%]'></div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 card-section'>
                            <div className='p-8 rounded-lg border-l-4 card'>
                                <div className='flex justify-between items-start mb-6'>
                                    <img src={Analytics} alt='' />
                                    <span className='text-xs'>XGBOOST</span>
                                </div>
                                <h3 className='text-xl font-bold mb-2'>Margen de Error</h3>
                                <p className='text-4xl font-light mb-4'>1455,53€</p>
                                <p className='text-sm'>Varianza observada con simulaciones reales usando el modelo de regresión.</p>
                            </div>
                            <div className='p-8 rounded-lg border-l-4 card'>
                                <div className='flex justify-between items-start mb-6'>
                                    <img src={DynamicFeed} alt='' />
                                    <span className='text-xs'>XGBOOST</span>
                                </div>
                                <h3 className='text-xl font-bold mb-2'>Margen de Confianza</h3>
                                <p className='text-4xl font-light mb-4'>91.1%</p>
                                <p className='text-sm'>Intervalo de confianza para modelos de vehículo de cualquier antigüedad.</p>
                            </div>
                            <div className='p-8 rounded-lg border-l-4 card'>
                                <div className='flex justify-between items-start mb-6'>
                                    <img src={Analytics} alt='' />
                                    <span className='text-xs'>RANDOM FOREST</span>
                                </div>
                                <h3 className='text-xl font-bold mb-2'>Margen de Error</h3>
                                <p className='text-4xl font-light mb-4'>1359,71€</p>
                                <p className='text-sm'>Varianza observada con simulaciones reales usando el modelo de aprendizaje en árbol.</p>
                            </div>
                            <div className='p-8 rounded-lg border-l-4 card'>
                                <div className='flex justify-between items-start mb-6'>
                                    <img src={DynamicFeed} alt='' />
                                    <span className='text-xs'>RANDOM FOREST</span>
                                </div>
                                <h3 className='text-xl font-bold mb-2'>Margen de Confianza</h3>
                                <p className='text-4xl font-light mb-4'>91.34%</p>
                                <p className='text-sm'>Intervalo de confianza para modelos de vehículo hasta el año 2018 .</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='core-model py-24 px-6 md:px-20'>
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-16'>
                        <h2 className=' text-4xl font-bold mb-4'>Arquitectura del Núcleo Predictivo</h2>
                        <div className='h-1 w-24 bg-[#89ceff] mx-auto mb-6'></div>
                        <p className=' max-w-2xl mx-auto'>Nuestro enfoque de Machine Learning tiene la posibilidad de usar múltiples modelos, incluyendo métodos de regresión y árboles de decisión para mitigar sesgos algorítmicos y potenciar la profundidad predictiva del sistema.</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                        <div className='card-core group p-8 border rounded-lg'>
                            <div className='mb-6 flex items-center gap-4'>
                                <div className='size-12 rounded-0.125rem flex items-center justify-center icon'>
                                    <img src={AccountTree} alt='' />
                                </div>
                                <h3 className=' text-2xl font-bold tracking-tight'>Random Forest</h3>
                            </div>
                            <p className='leading-relaxed mb-8'>
                                Utiliza el aprendizaje en árboles de decisión para mejorar la precisión del modelo y predecir con mayor precisión.                                
                            </p>
                            <div className='flex gap-2'>
                                <span className='px-3 py-1 text-[10px] font-bold tracking-widest rounded-sm'>SCIKIT LEARN</span>
                            </div>
                        </div>
                        <div className='card-core group p-8 border rounded-lg'>
                            <div className='mb-6 flex items-center gap-4'>
                                <div className='size-12 rounded-0.125rem flex items-center justify-center icon'>
                                    <img src={BlurOn} alt='' />
                                </div>
                                <h3 className=' text-2xl font-bold tracking-tight'>Regression</h3>
                            </div>
                            <p className='leading-relaxed mb-8'>
                                Utiliza el aprendizaje en regresión para mejorar la precisión del modelo y predecir con mayor precisión.
                            </p>
                            <div className='flex gap-2'>
                                <span className='px-3 py-1 text-[10px] font-bold tracking-widest rounded-sm'>XGBOOST</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='initialize-evaluation py-24 px-6 md:px-20'>
                    <div className='bg-[#222a3d] p-1px p-10 rounded-lg shadow-2xl relative overflow-hidden flex flex-col items-center md:flex-row align-middle justify-evenly gap-8'> 
                        <div>
                            <h2 className='text-white text-4xl font-bold mb-2'>Inicializar Evaluación</h2>
                            <p className='text-[#bec8d2]'>Prueba las especificaciones para obtener un resultado estimado.</p>
                        </div>
                        <div>
                            <Link to='/' className='w-full primary-gradient h-14.5 rounded-0.125rem text-[#00344d] font-bold text-sm flex items-center justify-center gap-2'>
                                <button type='buttton' className='flex items-center p-4 gap-2'>
                                    GENERAR EVALUACIÓN
                                    <span className='text-lg'><img src={Bolt} alt='' /></span>
                                </button>
                            </Link>
                        </div>
                    </div>
            </section>
        </div>
    )
}