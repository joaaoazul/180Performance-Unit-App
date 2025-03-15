// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Grid } from '@mui/material';
import MetricCard from './Cards/MetricCard';

function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard title="Total de Atletas" value="25" color="#ef5350" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard title="Sessões Hoje" value="8" color="#ab47bc" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard title="Receita Mensal" value="R$ 5.200" color="#5c6bc0" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard title="Novos Alunos" value="12" color="#29b6f6" />
      </Grid>
      {/* etc... podes adicionar gráficos, tabelas, etc. */}
    </Grid>
  );
}

export default Dashboard;
