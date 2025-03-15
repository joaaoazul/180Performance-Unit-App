import React from 'react';
import styled from 'styled-components';
import { FiBell, FiSearch, FiPlus } from 'react-icons/fi';

const HeaderContainer = styled.header`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  width: calc(100% - 260px);
  right: 0;
  top: 0;
  z-index: 90;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const SearchBar = styled.div`
  position: relative;
  margin-right: 20px;
`;

const SearchInput = styled.input`
  padding: 8px 15px 8px 35px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 14px;
  width: 200px;
  transition: all 0.3s ease;
  
  &:focus {
    width: 250px;
    border-color: #10B981;
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${props => props.primary ? '#10B981' : '#F8FAFC'};
  color: ${props => props.primary ? 'white' : '#64748B'};
  font-size: 18px;
  cursor: pointer;
  margin-left: 15px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.primary ? '#0D9668' : '#F1F5F9'};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = ({ title, notificationCount = 3 }) => {
  return (
    <HeaderContainer>
      <PageTitle>{title}</PageTitle>
      <HeaderRight>
        <SearchBar>
          <SearchInput placeholder="Buscar..." />
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
        </SearchBar>
        
        <IconButton>
          <FiBell />
          {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
        </IconButton>
        
        <IconButton primary>
          <FiPlus />
        </IconButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;