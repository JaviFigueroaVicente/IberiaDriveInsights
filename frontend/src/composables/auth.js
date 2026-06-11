import axios from "axios";

// const API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = 'https://iberiadriveinsights.onrender.com'


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


const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email); 
  params.append('password', password);

  try {
    const response = await apiClient.post('/auth/token', params);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    // console.error("Error 422:", error.response?.data);
    throw error;
  }
}

const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if(!token){
      // console.log('No token found');
      return;
    }
    await apiClient.post('/auth/logout', {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    // console.log('Logout successful');

  } catch (error) {
    // console.log(error);
    localStorage.removeItem('token');
    throw error;
  }
}

const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('/auth/me', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const changePassword = async ({ current_password, new_password }) => {
  try {
    const response = await apiClient.put('/auth/me/change-password', {
          current_password,
          new_password
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};

// Administrador
const getUsers = async () => {
  try {
    const response = await apiClient.get('/auth/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar los datos o el rol jerárquico de un usuario por su UID
const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/auth/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar usuario del sistema
const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/auth/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  apiClient,
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateProfile,
  changePassword,
  getUsers,
  updateUser,
  deleteUser
}