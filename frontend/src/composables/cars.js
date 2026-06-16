import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL


const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const car = {
    id: 0,
    make: '',
    make_name: '',
    model: '',
    model_name: '',
    version: '',
    version_name: '',
    registration: '',
    power: 0,
    gear_type: '',
    fuel_type: '',
    kms: 0,
    price: 0
}

const make = {
    id: 0,
    nombre: ''
}

const model = {
    id: 0,
    nombre: '',
    id_marca: 0
}

const version = {
    id: 0,
    nombre: '',
    id_modelo: 0
}

// Función para obtener el nombre descriptivo de la make, model o version desde el objeto car
const getMakeName = (car) => {
    return car.make_name || car.make || '';
};

const getModelName = (car) => {
    return car.model_name || car.model || '';
};

const getVersionName = (car) => {
    return car.version_name || car.version || '';
};

const fuel_type = {
    fuel_id: 0,
    nombre: ''
}

const gear_type = {
    gear_id: 0,
    nombre: ''
}

const getMakes = async () => {
    const response = await apiClient.get('/cars/make');
    return response.data;
};

const getModelsByMake = async(id) => {
    const response = await apiClient.get(`/cars/make/${id}/models`);
    return response.data;
}

const getVersionsByModel = async(id) => {
    const response = await apiClient.get(`/cars/model/${id}/versions`);
    return response.data;
}

const getGearTypes = async() => {
    const response = await apiClient.get('/cars/gear');
    return response.data;
}

const getFuelTypes = async() => {
    const response = await apiClient.get('/cars/fuel');
    return response.data;
}

const getCars = async () => {
    try {
        const response = await apiClient.get('/cars');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const predictCar = async (carData) => {
    try {
        const response = await apiClient.post('/cars/predict', carData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateCar = async(id,carData)=>{
    try {
        const response = await apiClient.put(`/cars/${id}`, carData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const deleteCar = async(id)=>{
    try {
        const response = await apiClient.delete(`/cars/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Perfil
const getMyCars = async() => {
    try {
        const response = await apiClient.get('/cars/my-cars');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export{
    apiClient,
    getMakes,
    getModelsByMake,
    getVersionsByModel,
    getGearTypes,
    getFuelTypes,
    getCars,
    predictCar,
    updateCar,
    deleteCar,
    getMyCars,
    car,
    make,
    model,
    version,
    fuel_type,
    gear_type
}