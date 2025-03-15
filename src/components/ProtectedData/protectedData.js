// src/components/ProtectedData.js
import React, { useEffect, useState } from 'react';
import { fetchProtectedData } from '../../services/authService';

function ProtectedData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchProtectedData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <p>Carregando dados protegidos...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Dados Protegidos:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ProtectedData;
