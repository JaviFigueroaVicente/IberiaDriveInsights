import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000'


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
    model: '',
    version: '',
    months_old: 0,
    power: 0,
    gear_type: '',
    fuel_type: '',
    kms: 0,
    price: 0
}

const make = {
    make_id: 0,
    nombre: ''
}

const model = {
    model_id: 0,
    nombre: '',
    id_marca: 0
}

const version = {
    version_id: 0,
    nombre: '',
    id_modelo: 0
}

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

export{
    apiClient,
    getMakes,
    getModelsByMake,
    getVersionsByModel,
    getGearTypes,
    getFuelTypes,
    getCars,
    predictCar,
    car,
    make,
    model,
    version,
    fuel_type,
    gear_type
}