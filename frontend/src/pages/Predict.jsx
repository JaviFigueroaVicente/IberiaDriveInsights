import '../styles/predict.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictCar } from '../composables/predict';
import { getMakes, getModelsByMake, getVersionsByModel, make, model, version } from '../composables/cars';


export default function Predict(){
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        version: '',
        registration: '',
        power: 0,
        gear_type: '',
        fuel_type: '',
        kms: 0
    });

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [versions, setVersions] = useState([]);

    const [selectedMake, setSelectedMake] = useState(make);
    const [selectedModel, setSelectedModel] = useState(model);
    const [selectedVersion, setSelectedVersion] = useState(version);

    useEffect(() => {
        getMakes().then(setMakes).catch(console.error);
    }, []);

    // Cargar modelos al cambiar marca
    useEffect(() => {
        if (formData.make) {
            getModelsByMake(formData.make).then(setModels);
        } else {
            setModels([]);
        }
        // Reset de hijos en el form y en los objetos seleccionados
        setFormData(prev => ({ ...prev, model: '', version: '' }));
        setSelectedModel(model);
        setSelectedVersion(version);
    }, [formData.make]);

    // Cargar versiones al cambiar modelo
    useEffect(() => {
        if (formData.model) {
            getVersionsByModel(formData.model).then(setVersions);
        } else {
            setVersions([]);
        }
        setFormData(prev => ({ ...prev, version: '' }));
        setSelectedVersion(version);
    }, [formData.model]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Actualizamos el formData general
        setFormData(prev => ({ ...prev, [name]: value }));

        // LÓGICA PARA RECUPERAR EL OBJETO COMPLETO
        if (name === 'make') {
            const found = makes.find(m => m.id === parseInt(value));
            if (found) setSelectedMake({ make_id: found.id, nombre: found.nombre });
        }
        
        if (name === 'model') {
            const found = models.find(m => m.id === parseInt(value));
            if (found) setSelectedModel({ model_id: found.id, nombre: found.nombre, id_marca: found.id_marca });
        }

        if (name === 'version') {
            const found = versions.find(v => v.id === parseInt(value));
            if (found) setSelectedVersion({ version_id: found.id, nombre: found.nombre, id_modelo: found.id_modelo });
        }
    }

    const handlePredict = async (e) => {
        e.preventDefault();
        try {
            // Aquí puedes enviar formData o incluso usar los selectedMake.make_id si lo prefieres
            const response = await predictCar(formData);
            navigate('/login');
        } catch (error) {
            console.error("Error en la predicción", error);
        }
    }

    return (
        <div className="predict-container">
            <h2 className="text-primary font-bold mb-6 tracking-widest">PREDICTIVE ENGINE V1.0</h2>
            
            {/* Opcional: Feedback visual de lo que se va "recuperando" */}
            <div className="mb-4 text-xs text-gray-500">
                Selección: {selectedMake.nombre} {selectedModel.nombre} {selectedVersion.nombre}
            </div>

            <form onSubmit={handlePredict} className="tech-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="flex flex-col">
                        <label>MARCA</label>
                        <select name="make" value={formData.make} onChange={handleChange}>
                            <option value="">Seleccionar...</option>
                            {makes.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label>MODELO</label>
                        <select name="model" value={formData.model} onChange={handleChange} disabled={!formData.make}>
                            <option value="">Seleccionar...</option>
                            {models.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label>VERSION</label>
                        <select name="version" value={formData.version} onChange={handleChange} disabled={!formData.model}>
                            <option value="">Seleccionar...</option>
                            {versions.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                        </select>
                    </div>

                    {/* Resto de campos... */}
                    <div className="flex flex-col">
                        <label>POTENCIA (CV)</label>
                        <input type="number" name="power" value={formData.power} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col">
                        <label>KILÓMETROS</label>
                        <input type="number" name="kms" value={formData.kms} onChange={handleChange} />
                    </div>
                </div>

                <button type='submit' className="btn-predict mt-8">
                    CALCULAR VALOR IBERIA_DRIVE
                </button>
            </form>
        </div>
    );
}