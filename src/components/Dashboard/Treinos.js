// src/components/Dashboard/Treinos.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const dummyPlans = [
  { id: 1, title: 'Plano A', description: 'Treino de força e resistência', videoUrl: 'https://youtu.be/example1' },
  { id: 2, title: 'Plano B', description: 'Treino aeróbico', videoUrl: 'https://youtu.be/example2' },
];

const Treinos = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gestão de Planos de Treino
      </Typography>
      <List>
        {dummyPlans.map((plan) => (
          <ListItem key={plan.id}>
            <ListItemText
              primary={plan.title}
              secondary={
                <>
                  {plan.description}
                  <br />
                  {plan.videoUrl && (
                    <Link href={plan.videoUrl} target="_blank" rel="noreferrer" underline="hover">
                      Ver Demonstração
                    </Link>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Treinos;
