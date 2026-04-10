import { useState, useEffect } from 'react'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Predict from './Predict'
import Analysis from './Analysis'
import Models from './Models'
import Profile from './profile/Profile'
import MyPredictions from './profile/MyPredictions'
import { Routes, Route, BrowserRouter, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { getUserProfile, logoutUser } from '../composables/auth'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadInitialUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getUserProfile(token);
          setCurrentUser(response);
          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
        }
      }
      setLoadingUser(false);
    };
    loadInitialUser();
  }, []);

  if (loadingUser) {
    return <div></div>;
  }

  const loadCurrentUser = async (token) => {
    try {
      const response = await getUserProfile(token);
      setCurrentUser(response)
    } catch (error) {
      console.log(error)
    }
  };

  const handleLoginSuccess = async (token) => {
    setIsAuthenticated(true)
    localStorage.setItem('token', token)
    loadCurrentUser(token)
    navigate('/')
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setCurrentUser(null)
    navigate('/login')
  };

  const hideLogin = ['/login', '/register'].includes(location.pathname);
  return (
    <>
      {!hideLogin && <Header isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout}/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/models" element={<Models />} />
        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path="my-predictions" element={<MyPredictions />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      {!hideLogin && <Footer/>}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
