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

const getMake = async (carData) => {
    try {
        const response = await apiClient.get('/cars/make', { params: carData });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getMakes = async () => {
    const response = await apiClient.get('/cars/make');
    return response.data;
};

const getModelsByMake = async (makeId) => {
    if (!makeId) return [];
    const response = await apiClient.get(`/cars/make/${makeId}/models`);
    return response.data;
};

const getVersionsByModel = async (modelId) => {
    if (!modelId) return [];
    const response = await apiClient.get(`/cars/model/${modelId}/versions`);
    return response.data;
};


export{
    apiClient,
    getMakes,
    getMake,
    getModelsByMake,
    getVersionsByModel,
    make,
    model,
    version
}