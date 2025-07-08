// src/services/authService.js - VERSÃO TEMPORÁRIA para testar frontend

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : '/api';

// Função temporária que simula sucesso
export const fetchProtectedData = async (endpoint = '', options = {}) => {
  console.log(`[MOCK] fetchProtectedData called with: ${endpoint}`);
  
  // Se for verificação de auth, simular sucesso
  if (endpoint === '/auth/verify' || endpoint === '') {
    return {
      success: true,
      user: {
        id: 1,
        name: 'João Silva',
        email: 'joao@demo.com',
        role: 'trainer'
      }
    };
  }
  
  // Para outras endpoints, simular dados
  return {
    success: true,
    data: []
  };
};

// Função login temporária
export const login = async (email, password) => {
  console.log(`[MOCK] Login attempt: ${email}`);
  
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular login bem-sucedido sempre
  const mockUser = {
    id: 1,
    name: 'João Silva',
    email: email,
    role: 'trainer'
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  // Guardar no localStorage
  localStorage.setItem('authToken', mockToken);
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return {
    success: true,
    user: mockUser,
    token: mockToken
  };
};

// Função register temporária
export const register = async (userData) => {
  console.log(`[MOCK] Register attempt:`, userData);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser = {
    id: 1,
    name: userData.name || 'Novo Utilizador',
    email: userData.email,
    role: 'trainer'
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  localStorage.setItem('authToken', mockToken);
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return {
    success: true,
    user: mockUser,
    token: mockToken
  };
};

// Função logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('[MOCK] User logged out');
};

// Função para verificar se está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return !!token;
};

// Função para obter usuário atual
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

// Função para obter token
export const getToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Forgot password temporário
export const forgotPassword = async (email) => {
  console.log(`[MOCK] Forgot password for: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

// Reset password temporário
export const resetPassword = async (token, newPassword) => {
  console.log(`[MOCK] Reset password with token: ${token}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

// Export default também para manter compatibilidade
const authService = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  forgotPassword,
  resetPassword,
  fetchProtectedData
};

export default authService;