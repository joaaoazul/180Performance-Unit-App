// src/components/Layout/Header.js - Header Responsivo Corrigido
import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiSearch, FiBell, FiChevronDown, FiSettings, 
  FiUser, FiLogOut, FiMessageCircle, FiCalendar,
  FiPlus, FiMenu
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: ${props => props.sidebarCollapsed ? '80px' : '260px'};
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    left: 0;
    padding: 0 16px 0 72px; /* Espaço para o botão do menu mobile */
  }
  
  @media (max-width: 480px) {
    padding: 0 12px 0 68px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const PageInfo = styled.div``;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  line-height: 1;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: #64748B;
  margin: 2px 0 0 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const QuickActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }
  
  svg {
    font-size: 14px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px 16px 10px 40px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: white;
  }
  
  &::placeholder {
    color: #94A3B8;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 14px;
  color: #94A3B8;
  font-size: 16px;
`;

const MobileSearchButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 1024px) {
    display: flex;
  }
  
  &:hover {
    background: white;
    border-color: #CBD5E1;
    transform: translateY(-1px);
  }
  
  svg {
    color: #64748B;
    font-size: 18px;
  }
`;

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    border-color: #CBD5E1;
    transform: translateY(-1px);
  }
  
  svg {
    color: #64748B;
    font-size: 18px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
`;

const UserContainer = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 640px) {
    padding: 6px;
  }
  
  &:hover {
    border-color: #CBD5E1;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.div`
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
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
`;

const UserInfo = styled.div`
  text-align: left;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  line-height: 1;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #64748B;
  margin-top: 2px;
`;

const ChevronIcon = styled(FiChevronDown)`
  color: #94A3B8;
  font-size: 16px;
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (max-width: 480px) {
    width: 200px;
    right: -10px;
  }
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F8FAFC;
  }
  
  svg {
    color: #64748B;
    font-size: 16px;
  }
`;

const DropdownText = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const Divider = styled.div`
  height: 1px;
  background: #E2E8F0;
  margin: 8px 0;
`;

const Header = () => {
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);
  const { tenant } = useTenant();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);

  // Determinar título da página baseado na rota
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return { title: 'Dashboard', subtitle: 'Visão geral dos seus atletas e métricas' };
    if (path.includes('/athletes')) return { title: 'Atletas', subtitle: 'Gerir os seus clientes e acompanhar progressos' };
    if (path.includes('/workouts')) return { title: 'Treinos', subtitle: 'Criar e gerir planos de treino personalizados' };
    if (path.includes('/nutrition')) return { title: 'Nutrição', subtitle: 'Planos alimentares e acompanhamento nutricional' };
    if (path.includes('/calendar')) return { title: 'Agenda', subtitle: 'Sessões agendadas e disponibilidade' };
    if (path.includes('/messages')) return { title: 'Mensagens', subtitle: 'Comunicação com os seus atletas' };
    if (path.includes('/analytics')) return { title: 'Análises', subtitle: 'Relatórios e estatísticas detalhadas' };
    if (path.includes('/finance')) return { title: 'Financeiro', subtitle: 'Faturação, pagamentos e receitas' };
    if (path.includes('/settings')) return { title: 'Configurações', subtitle: 'Personalizar a sua aplicação' };
    
    return { title: 'Performance Unit', subtitle: 'Plataforma de gestão fitness' };
  };

  const pageInfo = getPageInfo();

  // Determinar ações rápidas baseadas na página
  const getQuickActions = () => {
    const path = location.pathname;
    
    if (path.includes('/athletes')) {
      return (
        <QuickActionBtn onClick={() => window.location.href = '/athletes/add'}>
          <FiPlus /> Novo Atleta
        </QuickActionBtn>
      );
    }
    
    if (path.includes('/workouts')) {
      return (
        <QuickActionBtn onClick={() => window.location.href = '/workouts/create'}>
          <FiPlus /> Criar Treino
        </QuickActionBtn>
      );
    }
    
    if (path.includes('/calendar')) {
      return (
        <QuickActionBtn onClick={() => console.log('Nova sessão')}>
          <FiCalendar /> Agendar Sessão
        </QuickActionBtn>
      );
    }
    
    return null;
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'PT';
  };

  return (
    <HeaderContainer sidebarCollapsed={sidebarCollapsed}>
      <LeftSection>
        <PageInfo>
          <PageTitle>{pageInfo.title}</PageTitle>
          <PageSubtitle>{pageInfo.subtitle}</PageSubtitle>
        </PageInfo>
        
        <QuickActions>
          {getQuickActions()}
        </QuickActions>
      </LeftSection>

      <RightSection>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            placeholder="Pesquisar atletas, treinos, sessões..."
          />
        </SearchContainer>
        
        <MobileSearchButton>
          <FiSearch />
        </MobileSearchButton>

        <NotificationContainer>
          <NotificationBtn>
            <FiBell />
            <NotificationBadge>3</NotificationBadge>
          </NotificationBtn>
        </NotificationContainer>

        <UserContainer className="user-dropdown-container">
          <UserButton 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <UserAvatar>
              {getInitials(user?.name)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.name || 'Personal Trainer'}</UserName>
              <UserRole>{tenant?.business_name || 'Personal Trainer'}</UserRole>
            </UserInfo>
            <ChevronIcon isOpen={isUserDropdownOpen} />
          </UserButton>
          
          <UserDropdown isOpen={isUserDropdownOpen}>
            <DropdownItem onClick={() => window.location.href = '/settings/profile'}>
              <FiUser />
              <DropdownText>Meu Perfil</DropdownText>
            </DropdownItem>
            <DropdownItem onClick={() => window.location.href = '/settings'}>
              <FiSettings />
              <DropdownText>Configurações</DropdownText>
            </DropdownItem>
            <DropdownItem onClick={() => window.location.href = '/messages'}>
              <FiMessageCircle />
              <DropdownText>Mensagens</DropdownText>
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={handleLogout}>
              <FiLogOut />
              <DropdownText>Terminar Sessão</DropdownText>
            </DropdownItem>
          </UserDropdown>
        </UserContainer>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;