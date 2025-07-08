// src/components/Layout/MainLayout.js
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F8FAFC;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '260px'};
  padding: 90px 30px 30px;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 80px 20px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 75px 16px 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const MainLayout = ({ children, title }) => {
  const { user } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(false); // Reset collapse state on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <LayoutContainer>
      <Sidebar onToggle={setSidebarCollapsed} />
      <Header title={title} notificationCount={3} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;