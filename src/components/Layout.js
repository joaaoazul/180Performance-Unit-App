// src/components/Layout/Layout.js
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Dashboard/Sidebar';
import Header from './Header';

const drawerWidth = 240;

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
        <Header drawerWidth={drawerWidth} />
        {/* Espaço para o conteúdo real */}
        <Box sx={{ p: 3, mt: 8 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
