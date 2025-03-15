// src/components/Dashboard/Chat.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Chat = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comunicação
      </Typography>
      <Typography variant="body1">
        Área para chat e envio de notificações entre o personal trainer e os atletas.
      </Typography>
    </Box>
  );
};

export default Chat;
