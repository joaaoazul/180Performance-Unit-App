// src/components/Layout/Sidebar.js - VOLTANDO AO ORIGINAL
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, FiUsers, FiCalendar, FiBarChart2, 
  FiMessageSquare, FiDollarSign, FiSettings, FiLogOut 
} from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import logo from '../../assets/logo/logo.jpg';

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
  color: #CBD5E1;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const LogoContainer = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.img`
  height: 40px;
`;

const MenuContainer = styled.div`
  padding: 20px 0;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 25px;
  color: ${props => props.active ? '#10B981' : '#CBD5E1'};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: #10B981;
    background: rgba(16, 185, 129, 0.05);
  }
  
  ${props => props.active && `
    background: rgba(16, 185, 129, 0.05);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: #10B981;
    }
  `}
`;

const MenuIcon = styled.div`
  margin-right: 15px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.span`
  font-size: 15px;
`;

const Divider = styled.div`
  margin: 20px 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const ProfileContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #10B981;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 10px;
`;

const ProfileName = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 14px;
    color: white;
  }
  
  p {
    margin: 0;
    font-size: 12px;
    opacity: 0.7;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #CBD5E1;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    color: #10B981;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const initials = user?.name 
    ? user.name.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase() 
    : 'PT';

  return (
    <SidebarContainer>
      <LogoContainer>
        <Logo src={logo} alt="FitPro Coach" />
      </LogoContainer>
      
      <MenuContainer>
        <MenuItem to="/dashboard" active={location.pathname === '/dashboard' ? 1 : 0}>
          <MenuIcon><FiHome /></MenuIcon>
          <MenuText>Dashboard</MenuText>
        </MenuItem>
        
        <MenuItem to="/athletes" active={location.pathname.includes('/athletes') ? 1 : 0}>
          <MenuIcon><FiUsers /></MenuIcon>
          <MenuText>Atletas</MenuText>
        </MenuItem>
        
        <MenuItem to="/workouts" active={location.pathname.includes('/workouts') ? 1 : 0}>
          <MenuIcon><GiWeightLiftingUp /></MenuIcon>
          <MenuText>Treinos</MenuText>
        </MenuItem>
        
        <MenuItem to="/nutrition" active={location.pathname.includes('/nutrition') ? 1 : 0}>
          <MenuIcon><IoFastFoodOutline /></MenuIcon>
          <MenuText>Nutrição</MenuText>
        </MenuItem>
        
        <MenuItem to="/calendar" active={location.pathname === '/calendar' ? 1 : 0}>
          <MenuIcon><FiCalendar /></MenuIcon>
          <MenuText>Agenda</MenuText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem to="/messages" active={location.pathname === '/messages' ? 1 : 0}>
          <MenuIcon><FiMessageSquare /></MenuIcon>
          <MenuText>Mensagens</MenuText>
        </MenuItem>
        
        <MenuItem to="/analytics" active={location.pathname === '/analytics' ? 1 : 0}>
          <MenuIcon><FiBarChart2 /></MenuIcon>
          <MenuText>Análises</MenuText>
        </MenuItem>
        
        <MenuItem to="/finance" active={location.pathname === '/finance' ? 1 : 0}>
          <MenuIcon><FiDollarSign /></MenuIcon>
          <MenuText>Financeiro</MenuText>
        </MenuItem>
        
        <MenuItem to="/settings" active={location.pathname === '/settings' ? 1 : 0}>
          <MenuIcon><FiSettings /></MenuIcon>
          <MenuText>Configurações</MenuText>
        </MenuItem>
      </MenuContainer>
      
      <ProfileContainer>
        <ProfileInfo>
          <ProfileImage>{initials}</ProfileImage>
          <ProfileName>
            <h4>{user?.name || 'Personal Trainer'}</h4>
            <p>Personal Trainer</p>
          </ProfileName>
          <LogoutButton title="Logout" onClick={handleLogout}>
            <FiLogOut />
          </LogoutButton>
        </ProfileInfo>
      </ProfileContainer>
    </SidebarContainer>
  );
};

export default Sidebar;