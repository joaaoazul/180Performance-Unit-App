// src/services/authService.js

// Função de login: envia dados para o backend, guarda o token no localStorage e retorna os dados.
export const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao tentar fazer login');
      }
  
      // Guarda o token no localStorage
      localStorage.setItem('token', data.token);
  
      return data;
    } catch (error) {
      throw new Error(error.message || 'Falha na comunicação com o servidor');
    }
  };
  
  // Função para obter o token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Função para buscar dados protegidos no backend
  export const fetchProtectedData = async () => {
    const token = getToken();
    if (!token) {
      throw new Error('Token não encontrado! Faça login novamente.');
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Não autorizado');
      }
  
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados protegidos:', error);
      throw new Error(error.message || 'Erro desconhecido');
    }
  };

  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  