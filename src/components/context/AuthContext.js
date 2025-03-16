// src/components/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchProtectedData } from '../../services/authService';

// Criar o contexto primeiro
export const AuthContext = createContext();

// Depois definir o provider
export const AuthProvider = ({ children }) => {
  // Guarda os dados do usuário e o token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados do usuário quando o componente monta ou o token muda
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProtectedData();
        if (data && data.user) {
          setUser(data.user);
        } else {
          // Se não houver dados do usuário, limpar o token
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se houver erro na autenticação, faz logout
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [token]);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};