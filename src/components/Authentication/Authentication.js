// src/components/Authentication.js
import React, { useState, useContext } from 'react';
import { login } from '../../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await login(email, password);
      // Aqui, assumimos que o backend retorna { token, message, ... }  
      // Se o backend retornar dados do usuário, ajuste aqui:
      loginUser(res.token, { name: res.name || 'Usuário', email });
      setMessage(res.message);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Login - 180 Performance Unit</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Entrar
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default Authentication;
