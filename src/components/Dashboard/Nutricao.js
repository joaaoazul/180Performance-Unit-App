// src/components/Dashboard/Nutricao.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Nutricao = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Planos Nutricionais
      </Typography>
      <Typography variant="body1">
        Aqui o personal trainer pode carregar e visualizar os planos alimentares personalizados para cada atleta. 
        (Ex: Dieta para perda de peso, ganho de massa, etc.)
      </Typography>
    </Box>
  );
};

export default Nutricao;
