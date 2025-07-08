// src/components/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchProtectedData } from '../../services/authService';

// Criar o contexto primeiro
export const AuthContext = createContext();

// Depois definir o provider
export const AuthProvider = ({ children }) => {
  // Guarda os dados do usuário e o token
  const [user, setUser] = useState(null);
  // MUDANÇA: usar 'authToken' em vez de 'token' para compatibilidade
  const [token, setToken] = useState(localStorage.getItem('authToken') || localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados do usuário quando o componente monta ou o token muda
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // MUDANÇA: Verificar se já temos dados do usuário no localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // Se não tiver, buscar da API (quando implementarmos)
        const data = await fetchProtectedData('/auth/verify');
        if (data && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Se não houver dados do usuário, limpar o token
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se houver erro na autenticação, faz logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [token]);

  const loginUser = (newToken, userData) => {
    // MUDANÇA: Salvar em ambos os locais para compatibilidade
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logoutUser = () => {
    // MUDANÇA: Remover de ambos os locais
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};