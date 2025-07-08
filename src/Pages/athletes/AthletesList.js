// src/Pages/athletes/AthletesList.js - VOLTANDO AO ORIGINAL
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, FiSearch, FiFilter, FiMoreVertical, 
  FiEdit2, FiTrash2, FiUserPlus, FiRefreshCw,
  FiUsers
} from 'react-icons/fi';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';

// Componentes estilizados - ORIGINAL
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.secondary ? '#E2E8F0' : 'transparent'};
  background: ${props => props.secondary ? 'white' : '#10B981'};
  color: ${props => props.secondary ? '#64748B' : 'white'};
  text-decoration: none;
  
  &:hover {
    background: ${props => props.secondary ? '#F8FAFC' : '#0D9668'};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    background: #F8FAFC;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E2E8F0;
  background: white;
  color: #64748B;
  
  &:hover {
    background: #F8FAFC;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 14px;
  color: #1E293B;
  vertical-align: middle;
`;

const AthleteRow = styled.tr`
  transition: background 0.2s ease;
  
  &:hover {
    background: #F8FAFC;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const AthleteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #64748B;
  overflow: hidden;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AthleteName = styled.div`
  font-weight: 500;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    if (props.status === 'active') return '#ECFDF5';
    if (props.status === 'inactive') return '#FEF2F2';
    return '#F8FAFC';
  }};
  color: ${props => {
    if (props.status === 'active') return '#10B981';
    if (props.status === 'inactive') return '#EF4444';
    return '#64748B';
  }};
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background: #F1F5F9;
  }
`;

const ActionDropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
  min-width: 180px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ActionItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.danger ? '#EF4444' : '#1E293B'};
  text-decoration: none;
  
  &:hover {
    background: ${props => props.danger ? '#FEF2F2' : '#F8FAFC'};
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #CBD5E1;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 8px;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #64748B;
  margin: 0 0 20px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingIcon = styled(FiRefreshCw)`
  color: #10B981;
  font-size: 30px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #E2E8F0;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #64748B;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.active ? '#10B981' : 'white'};
  color: ${props => props.active ? 'white' : '#64748B'};
  border: 1px solid ${props => props.active ? '#10B981' : '#E2E8F0'};
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#0D9668' : '#F8FAFC'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Função principal do componente
const AthletesList = () => {
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  
  // Carregar dados dos atletas
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        
        // Verificar autenticação
        await fetchProtectedData('/auth/verify');
        
        // Dados mockados por agora
        setTimeout(() => {
          const mockAthletes = [
            {
              id: 1,
              name: 'Maria Oliveira',
              email: 'maria@example.com',
              phone: '(11) 99999-8888',
              status: 'active',
              plan: 'Premium',
              goal: 'Perda de peso',
              joinDate: '15/01/2023',
              lastActivity: '10/03/2023'
            },
            {
              id: 2,
              name: 'Carlos Santos',
              email: 'carlos@example.com',
              phone: '(11) 97777-6666',
              status: 'active',
              plan: 'Básico',
              goal: 'Hipertrofia',
              joinDate: '05/02/2023',
              lastActivity: '12/03/2023'
            },
            {
              id: 3,
              name: 'Ana Beatriz',
              email: 'ana@example.com',
              phone: '(11) 95555-4444',
              status: 'inactive',
              plan: 'Premium',
              goal: 'Condicionamento',
              joinDate: '20/12/2022',
              lastActivity: '28/02/2023'
            },
            {
              id: 4,
              name: 'Paulo Ricardo',
              email: 'paulo@example.com',
              phone: '(11) 93333-2222',
              status: 'active',
              plan: 'Premium',
              goal: 'Força',
              joinDate: '10/03/2023',
              lastActivity: '13/03/2023'
            }
          ];
          
          setAthletes(mockAthletes);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao buscar atletas:', error);
        setLoading(false);
      }
    };
    
    fetchAthletes();
  }, []);
  
  // Filtrar atletas por busca
  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.phone.includes(searchTerm)
  );
  
  // Manipulador para o menu de ações
  const toggleActionMenu = (id) => {
    setOpenActionMenu(openActionMenu === id ? null : id);
  };
  
  // Manipulador para clicar fora do menu de ações
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Iniciais do nome para avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <MainLayout title="Atletas">
      <PageHeader>
        <PageTitle>Atletas</PageTitle>
        <ActionButtons>
          <Button as={Link} to="/athletes/add">
            <FiPlus /> Adicionar Atleta
          </Button>
        </ActionButtons>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
        <FilterButton>
          <FiFilter /> Filtros
        </FilterButton>
      </FilterBar>
      
      <Card>
        {loading ? (
          <LoadingWrapper>
            <LoadingIcon />
          </LoadingWrapper>
        ) : filteredAthletes.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Atleta</Th>
                  <Th>Plano</Th>
                  <Th>Objetivo</Th>
                  <Th>Status</Th>
                  <Th>Data de Início</Th>
                  <Th>Última Atividade</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.map(athlete => (
                  <AthleteRow key={athlete.id}>
                    <Td>
                      <AthleteInfo>
                        <AvatarWrapper>
                          {athlete.avatar ? (
                            <Avatar src={athlete.avatar} alt={athlete.name} />
                          ) : (
                            getInitials(athlete.name)
                          )}
                        </AvatarWrapper>
                        <div>
                          <AthleteName>{athlete.name}</AthleteName>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{athlete.email}</div>
                        </div>
                      </AthleteInfo>
                    </Td>
                    <Td>{athlete.plan}</Td>
                    <Td>{athlete.goal}</Td>
                    <Td>
                      <StatusBadge status={athlete.status}>
                        {athlete.status === 'active' ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                    </Td>
                    <Td>{athlete.joinDate}</Td>
                    <Td>{athlete.lastActivity}</Td>
                    <Td>
                      <ActionMenu onClick={(e) => e.stopPropagation()}>
                        <ActionButton onClick={() => toggleActionMenu(athlete.id)}>
                          <FiMoreVertical />
                        </ActionButton>
                        <ActionDropdown isOpen={openActionMenu === athlete.id}>
                          <ActionItem as={Link} to={`/athletes/${athlete.id}`}>
                            <FiEdit2 /> Ver detalhes
                          </ActionItem>
                          <ActionItem as={Link} to={`/athletes/${athlete.id}/edit`}>
                            <FiEdit2 /> Editar atleta
                          </ActionItem>
                          <ActionItem>
                            <FiUserPlus /> Atribuir treino
                          </ActionItem>
                          <ActionItem danger>
                            <FiTrash2 /> Remover atleta
                          </ActionItem>
                        </ActionDropdown>
                      </ActionMenu>
                    </Td>
                  </AthleteRow>
                ))}
              </tbody>
            </Table>
            
            <Pagination>
              <PaginationInfo>
                Mostrando 1-{filteredAthletes.length} de {filteredAthletes.length} atletas
              </PaginationInfo>
              <PaginationButtons>
                <PageButton disabled>
                  &lt;
                </PageButton>
                <PageButton active>1</PageButton>
                <PageButton disabled>
                  &gt;
                </PageButton>
              </PaginationButtons>
            </Pagination>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiUsers />
            </EmptyIcon>
            <EmptyTitle>Nenhum atleta encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm 
                ? `Não encontramos atletas para a busca "${searchTerm}".` 
                : 'Você ainda não tem atletas cadastrados.'}
            </EmptyDescription>
            <Button as={Link} to="/athletes/add">
              <FiPlus /> Adicionar Atleta
            </Button>
          </EmptyState>
        )}
      </Card>
    </MainLayout>
  );
};

export default AthletesList;