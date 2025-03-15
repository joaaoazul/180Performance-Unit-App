// src/components/Dashboard/Cards/MetricCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function MetricCard({ title, value, color }) {
  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MetricCard;
