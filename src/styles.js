// src/styles.js
export const sidebarStyle = {
    width: '250px',
    background: '#343a40',
    color: '#fff',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box',
  };
  
  export const sidebarItemStyle = (active) => ({
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '4px',
    background: active ? '#007bff' : 'transparent',
    cursor: 'pointer',
  });
  
  export const mainContentStyle = {
    flex: 1,
    padding: '20px',
    background: '#f8f9fa',
    minHeight: '100vh',
    boxSizing: 'border-box',
  };
  
  export const buttonStyle = {
    padding: '8px 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  export const inputStyle = {
    padding: '8px',
    flex: 1,
  };
  
  export const actionButtonStyle = {
    padding: '4px 8px',
    margin: '0 4px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };
  