// src/components/LoadingScreen.js
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h3 className="loading-text">Carregando...</h3>
        <p className="loading-subtitle">A preparar a sua aplicação personalizada</p>
      </div>
    </div>
  );
};

export default LoadingScreen;