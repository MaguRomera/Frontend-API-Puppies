import React, { useState } from 'react';
import { useAuth } from '../context/authcontext'; 

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        try {
            await login(username, password); 
        } catch (err) {
            setError(err.message); 
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">API PUPPIES LOGO</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="auth-input"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />
                {error && <p className="auth-error-message">{error}</p>}
                <button type="submit" disabled={loading} className="auth-button">
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>
                        
        </div>
    );
}