// src/components/ProtectedData.js
import React, { useEffect, useState } from 'react';
import { fetchProtectedData } from '../services/authService';
import { Box, Typography } from '@mui/material';

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

  if (loading) return <Typography>Carregando dados protegidos...</Typography>;
  if (error) return <Typography color="error">Erro: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Dados Protegidos:</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}

export default ProtectedData;
