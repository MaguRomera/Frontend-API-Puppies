import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import { Preferencias } from './pages/preferencias';
import { Mascota } from './pages/mascota';
import { cargaNuevaMascota } from './pages/cargaNuevaMascota';
import { Login } from './pages/login';
import './App.css'
import { RecvProvider } from './lib/recv';

import { AuthProvider, useAuth } from './context/authcontext'; 

const ProtectedRoute = ({ element: Element }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Element /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <AuthProvider> 
                <RecvProvider>
                    <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Rutas protegidas*/}
                    <Route path="/" element={<ProtectedRoute element={Home} />} />
                    <Route path="/preferencias" element={<ProtectedRoute element={Preferencias} />} />
                    <Route path="/mascota" element={<ProtectedRoute element={Mascota} />} />
                    <Route path="/cargar-mascota" element={<ProtectedRoute element={cargaNuevaMascota} />} />
                  </Routes>
                </RecvProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;