// src/components/Header.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header
      style={{
        padding: '10px',
        background: '#f2f2f2',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2>180 Performance Unit</h2>
      {user && (
        <div>
          <span style={{ marginRight: '20px' }}>Bem-vindo, {user.name}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
