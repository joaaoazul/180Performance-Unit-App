// src/components/layout/MainLayout.js
import React, { useContext } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F8FAFC;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 90px 30px 30px;
  min-height: 100vh;
`;

const MainLayout = ({ children, title }) => {
  const { user } = useContext(AuthContext);
  
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header title={title} notificationCount={3} />
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;