// src/components/Dashboard/Atletas.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const dummyAthletes = [
  { id: 1, name: 'Atleta 1', age: 25, health: 'Sem restrições', progress: 'Melhorando' },
  { id: 2, name: 'Atleta 2', age: 28, health: 'Diabetes', progress: 'Estável' },
  { id: 3, name: 'Atleta 3', age: 22, health: 'Sem restrições', progress: 'Em alta' },
];

const Atletas = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ficha Individual dos Atletas
      </Typography>
      <List>
        {dummyAthletes.map((athlete) => (
          <React.Fragment key={athlete.id}>
            <ListItem>
              <ListItemText
                primary={`${athlete.name} (${athlete.age} anos)`}
                secondary={`Saúde: ${athlete.health} | Progresso: ${athlete.progress}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Atletas;
