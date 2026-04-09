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

const predictCar = async (carData) => {
    try {
        const response = await apiClient.post('/predict/predict-price', carData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export{
    apiClient,
    predictCar,
}