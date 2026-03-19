import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000'


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

const getPredictions = async () => {
  const response = await apiClient.get('/cars/');
  return response.data;
};

const predictPrice = async (carData) => {
    const response = await apiClient.post('/cars/predict', carData);
    return response.data;
};

export {
    loginUser,
    getPredictions,
    predictPrice
}