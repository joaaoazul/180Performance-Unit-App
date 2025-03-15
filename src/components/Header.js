// src/components/Layout/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Header({ drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Painel do Personal Trainer
        </Typography>
        {/* Aqui podes colocar botões de logout, notificações, etc. */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
