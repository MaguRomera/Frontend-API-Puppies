import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'https://apipuppies.santiagocezar2013.workers.dev/api/auth';

const api = axios.create();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // Función p refrescar el token
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return false;
        }

        try {
            const response = await axios.post(`${API_URL}/refresh`, { refresh: refreshToken });
            const newAccessToken = response.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error("Fallo al refrescar token. Cerrando sesión.");
            logout(false);
            return false;
        }
    };
    
    // Manejo automático d token expirado
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    const success = await refreshAccessToken();
                    if (success) {
                        originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                        return api(originalRequest);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);
    
    // p agregar el token de acceso a las peticiones protegidas
    api.interceptors.request.use(config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });
    

    // Func login
    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            const { access: accessToken, refresh: refreshToken, user: userData } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setIsLoggedIn(true);
            setUser(userData);
            
            navigate('/');
            return true;
        } catch (error) {
            setLoading(false);
            throw new Error(error.response?.data?.message || "Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    // Func logout
    const logout = async (callApi = true) => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (callApi && refreshToken) {
            try {
                await axios.post(
                    `${API_URL}/revoke`, 
                    { refresh: refreshToken },
                    { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } }
                );
            } catch (error) {
                console.warn("Fallo al invalidar token en la API, pero se cerrará la sesión localmente.");
            }
        }
        
        localStorage.clear(); 
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
    };


    // verificación d tokens al cargar la app
     useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                setIsLoggedIn(true);

                const success = await refreshAccessToken();
                
                if (success) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            }
            
            setLoading(false);
        };
        
        checkAuth();
    }, []);


    const value = {
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        api 
    };

    if (loading) {
        return <div>Cargando sesión...</div>; 
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}