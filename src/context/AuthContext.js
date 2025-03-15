// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Guarda os dados do usuário e o token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Se tiver token armazenado, poderás querer decodificá-lo para obter dados do usuário
  // (aqui é opcional; para simplicidade, deixamos null e atualizamos no login)

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
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
