// src/services/authService.js - Versão com XMLHttpRequest em vez de fetch

// Função de login usando XMLHttpRequest em vez de fetch
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      // Cria uma nova requisição XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      // Configura a requisição
      xhr.open('POST', 'http://localhost:3000/auth/login', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      // Define o handler para quando a requisição for completada
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log('Status da resposta:', xhr.status);
          console.log('Tipo de conteúdo:', xhr.getResponseHeader('Content-Type'));
          console.log('Resposta bruta:', xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            // Sucesso - tenta fazer o parse do JSON
            try {
              const data = JSON.parse(xhr.responseText);
              
              // Guarda o token no localStorage
              if (data.token) {
                localStorage.setItem('token', data.token);
              }
              
              resolve(data);
            } catch (jsonError) {
              console.error('Erro ao fazer parse do JSON:', jsonError);
              console.error('Texto da resposta:', xhr.responseText);
              reject(new Error('A resposta do servidor não é JSON válido'));
            }
          } else {
            // Erro na requisição
            try {
              // Tenta fazer parse do erro como JSON
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || `Erro ${xhr.status}`));
            } catch (e) {
              // Se não for JSON, usa o texto bruto
              reject(new Error(`Erro ${xhr.status}: ${xhr.responseText || xhr.statusText}`));
            }
          }
        }
      };
      
      // Define handler para erros de rede
      xhr.onerror = function() {
        console.error('Erro de rede na requisição');
        reject(new Error('Não foi possível conectar ao servidor. Verifique sua conexão.'));
      };
      
      // Envia a requisição
      xhr.send(JSON.stringify({ email, password }));
      
    } catch (error) {
      console.error('Erro ao criar a requisição:', error);
      reject(error);
    }
  });
};

// Função para obter o token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Função para buscar dados protegidos no backend (usando XMLHttpRequest)
export const fetchProtectedData = async () => {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) {
      reject(new Error('Token não encontrado! Faça login novamente.'));
      return;
    }
    
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:3000/auth/me', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error('Resposta inválida do servidor'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || `Erro ${xhr.status}`));
            } catch (e) {
              reject(new Error(`Erro ${xhr.status}: ${xhr.statusText}`));
            }
          }
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Erro de conexão ao servidor'));
      };
      
      xhr.send();
    } catch (error) {
      reject(error);
    }
  });
};

export const logout = () => {
  localStorage.removeItem('token');
};