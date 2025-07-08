// src/components/Layout/Sidebar.js - VERSÃO FINAL SEM SCROLL
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, FiUsers, FiCalendar, FiBarChart2, 
  FiMessageSquare, FiSettings, FiLogOut,
  FiChevronLeft, FiChevronRight, FiGrid, FiX,
  FiMenu
} from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';

// MOBILE TOGGLE BUTTON - só aparece quando sidebar está fechada
const MobileMenuToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  width: 44px;
  height: 44px;
  background: #10B981;
  border: none;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: ${props => props.sidebarOpen ? 'none' : 'flex'};
  }
  
  svg {
    color: white;
    font-size: 20px;
  }
`;

// MOBILE OVERLAY
const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const SidebarContainer = styled.div`
  width: ${props => props.collapsed ? '80px' : '260px'};
  height: 100vh;
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #334155 100%);
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    box-shadow: ${props => props.mobileOpen ? '4px 0 20px rgba(0, 0, 0, 0.15)' : 'none'};
  }
`;

const LogoSection = styled.div`
  height: 70px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
`;

const LogoText = styled.div`
  color: white;
  transition: all 0.3s ease;
  opacity: ${props => props.collapsed ? '0' : '1'};
  width: ${props => props.collapsed ? '0' : 'auto'};
  overflow: hidden;
  
  @media (max-width: 768px) {
    opacity: 1;
    width: auto;
  }
  
  h1 {
    font-size: 17px;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    white-space: nowrap;
  }
  
  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin: 2px 0 0 0;
    white-space: nowrap;
  }
`;

// COLLAPSE BUTTON - Desktop only
const CollapseButton = styled.button`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    transition: transform 0.3s ease;
    transform: rotate(${props => props.collapsed ? '180deg' : '0deg'});
  }
`;

// MOBILE CLOSE BUTTON
const MobileCloseButton = styled.button`
  display: none;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  svg {
    color: white;
    font-size: 16px;
  }
`;

const MenuContainer = styled.div`
  flex: 1;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* NO SCROLL */
`;

const MenuList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  color: ${props => props.active ? '#10B981' : 'rgba(255, 255, 255, 0.8)'};
  background: ${props => props.active ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  min-height: 44px;
  gap: 14px;
  
  /* Collapsed state - CENTRALIZADO */
  ${props => props.collapsed && `
    justify-content: center;
    padding: 12px 0;
    gap: 0;
    
    &::before {
      display: none !important;
    }
  `}
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 12px;
    gap: 14px;
  }
  
  &:hover {
    color: #10B981;
    background: rgba(16, 185, 129, 0.05);
  }
  
  /* Active indicator - barra lateral */
  ${props => props.active && !props.collapsed && `
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: #10B981;
      border-radius: 0 2px 2px 0;
    }
  `}
`;

const MenuIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
  
  ${props => props.collapsed && `
    width: 24px;
    height: 24px;
    font-size: 20px;
  `}
`;

const MenuText = styled.span`
  font-size: 14px;
  white-space: nowrap;
  opacity: ${props => props.collapsed ? '0' : '1'};
  width: ${props => props.collapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: opacity 0.2s ease;
  
  @media (max-width: 768px) {
    opacity: 1;
    width: auto;
  }
`;

const NotificationDot = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  background: #EF4444;
  border-radius: 8px;
  border: 2px solid #1E293B;
  font-size: 9px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 0 3px;
`;

const QuickAppsButton = styled.button`
  display: flex;
  align-items: center;
  margin: 12px 12px 0;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  min-height: 44px;
  gap: 14px;
  
  ${props => props.collapsed && `
    justify-content: center;
    padding: 12px 0;
    gap: 0;
  `}
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 12px;
    gap: 14px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #10B981;
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const ProfileSection = styled.div`
  padding: 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  
  ${props => props.collapsed && `
    justify-content: center;
    padding: 8px;
    gap: 0;
  `}
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 12px;
    padding: 10px;
  }
`;

const ProfileAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: ${props => props.collapsed ? 'none' : 'block'};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ProfileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileRole = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
  }
  
  svg {
    color: #EF4444;
    font-size: 14px;
  }
`;

// Botão de collapse para modo collapsed
const CollapsedCollapseButton = styled.button`
  display: ${props => props.collapsed ? 'flex' : 'none'};
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 8px auto;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.8);
    font-size: 18px;
    transform: rotate(180deg);
  }
`;

// Botão de logout para modo collapsed
const CollapsedLogoutButton = styled.button`
  display: ${props => props.collapsed ? 'flex' : 'none'};
  width: 44px;
  height: 44px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    transform: scale(1.05);
  }
  
  svg {
    color: #EF4444;
    font-size: 18px;
  }
`;

// Modal components
const AppsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
  padding: 20px;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const AppsModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  
  @media (max-width: 480px) {
    padding: 24px;
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AppsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
    
    @media (max-width: 480px) {
      font-size: 20px;
    }
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F1F5F9;
    transform: scale(1.05);
  }
  
  svg {
    color: #64748B;
    font-size: 18px;
  }
`;

const AppsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const AppCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    border-color: #10B981;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.1);
  }
`;

const AppIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 12px;
`;

const AppName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  text-align: center;
  line-height: 1.2;
`;

const Sidebar = ({ onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const { tenant } = useTenant();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showApps, setShowApps] = useState(false);

  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
    
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { collapsed } 
    }));
  }, [collapsed, onToggle]);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'PU';
  };

  // Menu items reduzidos para evitar scroll
  const mainMenuItems = [
    { to: '/dashboard', icon: FiHome, text: 'Dashboard', notifications: 0 },
    { to: '/athletes', icon: FiUsers, text: 'Atletas', notifications: 0 },
    { to: '/workouts', icon: GiWeightLiftingUp, text: 'Treinos', notifications: 0 },
    { to: '/nutrition', icon: IoFastFoodOutline, text: 'Nutrição', notifications: 0 },
    { to: '/calendar', icon: FiCalendar, text: 'Agenda', notifications: 2 },
    { to: '/messages', icon: FiMessageSquare, text: 'Mensagens', notifications: 3 },
    { to: '/settings', icon: FiSettings, text: 'Configurações', notifications: 0 },
  ];

  const allApps = [
    { to: '/dashboard', icon: FiHome, name: 'Dashboard' },
    { to: '/athletes', icon: FiUsers, name: 'Atletas' },
    { to: '/workouts', icon: GiWeightLiftingUp, name: 'Treinos' },
    { to: '/nutrition', icon: IoFastFoodOutline, name: 'Nutrição' },
    { to: '/calendar', icon: FiCalendar, name: 'Agenda' },
    { to: '/messages', icon: FiMessageSquare, name: 'Mensagens' },
    { to: '/analytics', icon: FiBarChart2, name: 'Análises' },
    { to: '/settings', icon: FiSettings, name: 'Configurações' },
  ];

  return (
    <>
      <MobileMenuToggle onClick={handleMobileToggle} sidebarOpen={mobileOpen}>
        <FiMenu />
      </MobileMenuToggle>
      
      <MobileOverlay isOpen={mobileOpen} onClick={handleMobileToggle} />
      
      <SidebarContainer collapsed={collapsed} mobileOpen={mobileOpen}>
        <LogoSection>
          <LogoWrapper>
            <LogoIcon>
              {tenant?.logo_url ? (
                <img 
                  src={tenant.logo_url} 
                  alt="Logo" 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '4px',
                    objectFit: 'contain'
                  }} 
                />
              ) : (
                getInitials(tenant?.app_name || tenant?.business_name)
              )}
            </LogoIcon>
            <LogoText collapsed={collapsed}>
              <h1>{tenant?.app_name || tenant?.business_name || 'Performance Unit'}</h1>
              <p>Gestão Fitness</p>
            </LogoText>
          </LogoWrapper>
          
          <MobileCloseButton onClick={handleMobileToggle}>
            <FiX />
          </MobileCloseButton>
        </LogoSection>

        <MenuContainer>
          <MenuList>
            {mainMenuItems.map((item, index) => (
              <MenuItem
                key={index}
                to={item.to}
                active={location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.includes(item.to)) ? 1 : 0}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              >
                <MenuIcon collapsed={collapsed}>
                  <item.icon />
                  {item.notifications > 0 && (
                    <NotificationDot>
                      {item.notifications > 9 ? '9+' : item.notifications}
                    </NotificationDot>
                  )}
                </MenuIcon>
                <MenuText collapsed={collapsed}>
                  {item.text}
                </MenuText>
              </MenuItem>
            ))}
          </MenuList>
          
          <QuickAppsButton 
            collapsed={collapsed} 
            onClick={() => {
              setShowApps(true);
              setMobileOpen(false);
            }}
          >
            <MenuIcon collapsed={collapsed}>
              <FiGrid />
            </MenuIcon>
            <MenuText collapsed={collapsed}>
              Todas as Apps
            </MenuText>
          </QuickAppsButton>
        </MenuContainer>

        <ProfileSection>
          <ProfileContainer collapsed={collapsed}>
            <ProfileAvatar>
              {getInitials(user?.name)}
            </ProfileAvatar>
            <ProfileInfo collapsed={collapsed}>
              <ProfileName>{user?.name || 'Personal Trainer'}</ProfileName>
              <ProfileRole>{tenant?.business_name || 'Personal Trainer'}</ProfileRole>
            </ProfileInfo>
            <div style={{ display: collapsed ? 'none' : 'flex', gap: '8px' }}>
              <CollapseButton collapsed={collapsed} onClick={handleToggle}>
                <FiChevronLeft />
              </CollapseButton>
              <LogoutButton collapsed={collapsed} onClick={handleLogout}>
                <FiLogOut />
              </LogoutButton>
            </div>
          </ProfileContainer>
          {/* Botões separados para modo collapsed */}
          <CollapsedCollapseButton collapsed={collapsed} onClick={handleToggle}>
            <FiChevronLeft style={{ transform: 'rotate(180deg)' }} />
          </CollapsedCollapseButton>
          <CollapsedLogoutButton collapsed={collapsed} onClick={handleLogout}>
            <FiLogOut />
          </CollapsedLogoutButton>
        </ProfileSection>
      </SidebarContainer>

      <AppsOverlay show={showApps} onClick={() => setShowApps(false)}>
        <AppsModal onClick={(e) => e.stopPropagation()}>
          <AppsHeader>
            <h2>Todas as Aplicações</h2>
            <CloseButton onClick={() => setShowApps(false)}>
              <FiX />
            </CloseButton>
          </AppsHeader>
          <AppsGrid>
            {allApps.map((app, index) => (
              <AppCard key={index} to={app.to} onClick={() => setShowApps(false)}>
                <AppIcon>
                  <app.icon />
                </AppIcon>
                <AppName>{app.name}</AppName>
              </AppCard>
            ))}
          </AppsGrid>
        </AppsModal>
      </AppsOverlay>
    </>
  );
};

export default Sidebar;