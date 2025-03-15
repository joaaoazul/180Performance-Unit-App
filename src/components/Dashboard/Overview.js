// src/components/Dashboard/Overview.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Overview = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Visão Geral dos Atletas e Sessões
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="subtitle1">Total de Atletas</Typography>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>25</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="subtitle1">Sessões Hoje</Typography>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>8</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="subtitle1">Receita Mensal</Typography>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>R$ 5.200</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Overview;
