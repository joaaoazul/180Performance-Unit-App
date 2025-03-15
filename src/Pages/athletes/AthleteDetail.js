// src/pages/athletes/AthleteDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiEdit2, FiChevronLeft, FiUser, FiCalendar, FiPhone, 
  FiMail, FiTarget, FiActivity, FiTrendingUp, FiRefreshCw,
  FiAward, FiClipboard, FiMessageSquare, FiPlus, FiUsers
} from 'react-icons/fi';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';
// import api from '../../services/api';

// Componentes estilizados
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: #10B981;
  }
`;

const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  text-decoration: none;
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  color: #64748B;
  overflow: hidden;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 5px;
`;

const ProfileBadge = styled.span`
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
  margin-left: 10px;
`;

const ProfilePlan = styled.div`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #EFF6FF;
  color: #3B82F6;
  margin-top: 5px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #1E293B;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #64748B;
    font-size: 16px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #E2E8F0;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 3px;
  }
`;

const Tab = styled.button`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? '#10B981' : '#64748B'};
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#10B981' : 'transparent'};
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.active ? '#10B981' : '#1E293B'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #F8FAFC;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #E2E8F0;
`;

const MetricLabel = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 14px;
  }
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
`;

const MetricTrend = styled.div`
  font-size: 12px;
  margin-top: 5px;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProgressChart = styled.div`
  height: 7px;
  width: 100%;
  background: #E2E8F0;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background: ${props => {
    if (props.value >= 75) return '#10B981';
    if (props.value >= 50) return '#3B82F6';
    if (props.value >= 25) return '#F59E0B';
    return '#EF4444';
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  border-bottom: 1px solid #E2E8F0;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #1E293B;
  border-bottom: 1px solid #F1F5F9;
`;

const Tr = styled.tr`
  &:hover {
    background: #F8FAFC;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0D9668;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  color: #CBD5E1;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 16px;
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
  min-height: 300px;
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

// Componente principal
const AthleteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');
  
  // Carregar dados do atleta
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        
        // Verificar autenticação
        await fetchProtectedData();
        
        // Em um cenário real, você faria chamadas à API aqui
        // Exemplo:
        // const response = await api.get(`/athletes/${id}`);
        // const workouts = await api.get(`/athletes/${id}/workouts`);
        // const measurements = await api.get(`/athletes/${id}/measurements`);
        // const appointments = await api.get(`/athletes/${id}/appointments`);
        
        // Dados mockados para demonstração
        setTimeout(() => {
          const mockAthlete = {
            id: id,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            status: 'active',
            plan: 'Premium',
            goal: 'Perda de peso',
            joinDate: '15/01/2023',
            lastActivity: '10/03/2023',
            birthdate: '12/05/1990',
            gender: 'Feminino',
            address: 'Rua das Flores, 123 - São Paulo, SP',
            height: '1.65 m',
            weight: '68 kg',
            bodyFat: '24%',
            emergencyContact: 'João Oliveira - (11) 98888-7777',
            healthConditions: 'Pressão baixa',
            allergies: 'Nenhuma',
            notes: 'Prefere treinar pela manhã. Tem dificuldade com exercícios de impacto.',
            metrics: {
              attendance: { value: 85, trend: 5, label: 'Frequência (%)' },
              completion: { value: 92, trend: 3, label: 'Conclusão de Treinos (%)' },
              progress: { value: 70, trend: 8, label: 'Progresso (%)' }
            },
            workouts: [
              { id: 1, date: '10/03/2023', name: 'Treino A - Superior', status: 'Concluído', completion: '100%' },
              { id: 2, date: '08/03/2023', name: 'Treino B - Inferior', status: 'Concluído', completion: '85%' },
              { id: 3, date: '06/03/2023', name: 'Treino C - Full Body', status: 'Concluído', completion: '90%' },
              { id: 4, date: '03/03/2023', name: 'Treino A - Superior', status: 'Concluído', completion: '100%' }
            ],
            measurements: [
              { 
                id: 1, 
                date: '10/03/2023', 
                weight: '68 kg', 
                bodyFat: '24%',
                measurements: { chest: '92 cm', waist: '75 cm', hips: '102 cm' }
              },
              { 
                id: 2, 
                date: '10/02/2023', 
                weight: '70 kg', 
                bodyFat: '25%',
                measurements: { chest: '93 cm', waist: '77 cm', hips: '103 cm' }
              },
              { 
                id: 3, 
                date: '10/01/2023', 
                weight: '72 kg', 
                bodyFat: '26%',
                measurements: { chest: '94 cm', waist: '79 cm', hips: '104 cm' }
              }
            ],
            appointments: [
              { id: 1, date: '15/03/2023', time: '09:00', type: 'Treino', status: 'Agendado' },
              { id: 2, date: '17/03/2023', time: '10:00', type: 'Avaliação', status: 'Agendado' },
              { id: 3, date: '20/03/2023', time: '09:00', type: 'Treino', status: 'Agendado' }
            ]
          };
          
          setAthlete(mockAthlete);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
        setLoading(false);
        // Redirecionar em caso de erro
        navigate('/athletes');
      }
    };
    
    fetchAthleteData();
  }, [id, navigate]);
  
  // Manipulador para envio de mensagem
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      // Num cenário real, você enviaria a mensagem para o backend
      // await api.post(`/messages/athlete/${id}`, { message: messageText });
      
      // Simulação de sucesso
      alert('Mensagem enviada com sucesso!');
      setMessageText('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };
  
  // Funções para adicionar novos itens
  const handleAddWorkout = () => {
    navigate(`/workouts/create?athleteId=${id}`);
  };
  
  const handleAddMeasurement = () => {
    navigate(`/athletes/${id}/measurements/add`);
  };
  
  const handleAddAppointment = () => {
    navigate(`/calendar/new?athleteId=${id}`);
  };
  
  // Obter iniciais do nome
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (loading) {
    return (
      <MainLayout title="Detalhes do Atleta">
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      </MainLayout>
    );
  }
  
  if (!athlete) {
    return (
      <MainLayout title="Detalhes do Atleta">
        <EmptyState>
          <EmptyIcon><FiUser /></EmptyIcon>
          <EmptyTitle>Atleta não encontrado</EmptyTitle>
          <EmptyDescription>
            Não foi possível encontrar as informações deste atleta.
          </EmptyDescription>
          <BackButton to="/athletes">
            <FiChevronLeft /> Voltar para lista de atletas
          </BackButton>
        </EmptyState>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Detalhes do Atleta">
      <PageHeader>
        <BackButton to="/athletes">
          <FiChevronLeft /> Voltar para lista de atletas
        </BackButton>
        <EditButton to={`/athletes/${id}/edit`}>
          <FiEdit2 /> Editar Atleta
        </EditButton>
      </PageHeader>
      
      <Section>
        <SectionContent>
          <ProfileHeader>
            <ProfileAvatar>
              {athlete.avatar ? (
                <img src={athlete.avatar} alt={athlete.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(athlete.name)
              )}
            </ProfileAvatar>
            
            <ProfileInfo>
              <ProfileName>
                {athlete.name}
                <ProfileBadge status={athlete.status}>
                  {athlete.status === 'active' ? 'Ativo' : 'Inativo'}
                </ProfileBadge>
              </ProfileName>
              <ProfilePlan>{athlete.plan}</ProfilePlan>
              
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue><FiMail /> {athlete.email}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue><FiPhone /> {athlete.phone}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Data de Início</InfoLabel>
                  <InfoValue><FiCalendar /> {athlete.joinDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Objetivo</InfoLabel>
                  <InfoValue><FiTarget /> {athlete.goal}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </ProfileInfo>
          </ProfileHeader>
        </SectionContent>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </Tab>
          <Tab 
            active={activeTab === 'workouts'} 
            onClick={() => setActiveTab('workouts')}
          >
            Treinos
          </Tab>
          <Tab 
            active={activeTab === 'measurements'} 
            onClick={() => setActiveTab('measurements')}
          >
            Medidas
          </Tab>
          <Tab 
            active={activeTab === 'appointments'} 
            onClick={() => setActiveTab('appointments')}
          >
            Agendamentos
          </Tab>
          <Tab 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
          >
            Notas
          </Tab>
        </TabsContainer>
        
        {activeTab === 'overview' && (
          <SectionContent>
            <MetricsGrid>
              {Object.entries(athlete.metrics).map(([key, metric]) => (
                <MetricCard key={key}>
                  <MetricLabel>
                    {key === 'attendance' && <FiCalendar />}
                    {key === 'completion' && <FiActivity />}
                    {key === 'progress' && <FiTrendingUp />}
                    {metric.label}
                  </MetricLabel>
                  <MetricValue>{metric.value}%</MetricValue>
                  <MetricTrend positive={metric.trend > 0}>
                    {metric.trend > 0 ? <FiTrendingUp /> : <FiTrendingUp style={{ transform: 'rotate(180deg)' }} />}
                    {Math.abs(metric.trend)}% que no mês anterior
                  </MetricTrend>
                  <ProgressChart>
                    <ProgressBar value={metric.value} />
                  </ProgressChart>
                </MetricCard>
              ))}
            </MetricsGrid>
            
            <Grid>
              <Section style={{ margin: 0 }}>
                <SectionHeader>
                  <SectionTitle>
                    <FiClipboard /> Treinos Recentes
                  </SectionTitle>
                  <Link to={`/athletes/${id}/workouts`} style={{ fontSize: '14px', color: '#10B981', textDecoration: 'none' }}>
                    Ver todos
                  </Link>
                </SectionHeader>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Data</Th>
                        <Th>Treino</Th>
                        <Th>Status</Th>
                        <Th>Completude</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {athlete.workouts.slice(0, 3).map(workout => (
                        <Tr key={workout.id}>
                          <Td>{workout.date}</Td>
                          <Td>{workout.name}</Td>
                          <Td>{workout.status}</Td>
                          <Td>{workout.completion}</Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </Section>
              
              <Section style={{ margin: 0 }}>
                <SectionHeader>
                  <SectionTitle>
                    <FiUser /> Informações Pessoais
                  </SectionTitle>
                </SectionHeader>
                <SectionContent>
                  <InfoGrid style={{ gridTemplateColumns: '1fr' }}>
                    <InfoItem>
                      <InfoLabel>Data de Nascimento</InfoLabel>
                      <InfoValue>{athlete.birthdate}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Gênero</InfoLabel>
                      <InfoValue>{athlete.gender}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Altura</InfoLabel>
                      <InfoValue>{athlete.height}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Peso Atual</InfoLabel>
                      <InfoValue>{athlete.weight}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Gordura Corporal</InfoLabel>
                      <InfoValue>{athlete.bodyFat}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Contato de Emergência</InfoLabel>
                      <InfoValue>{athlete.emergencyContact}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Condições de Saúde</InfoLabel>
                      <InfoValue>{athlete.healthConditions || 'Nenhuma'}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Alergias</InfoLabel>
                      <InfoValue>{athlete.allergies || 'Nenhuma'}</InfoValue>
                    </InfoItem>
                  </InfoGrid>
                </SectionContent>
              </Section>
            </Grid>
          </SectionContent>
        )}
        
        {activeTab === 'workouts' && (
          <SectionContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Histórico de Treinos</h3>
              <AddButton onClick={handleAddWorkout}>
                <FiPlus /> Atribuir Novo Treino
              </AddButton>
            </div>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Treino</Th>
                    <Th>Status</Th>
                    <Th>Completude</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {athlete.workouts.map(workout => (
                    <Tr key={workout.id}>
                      <Td>{workout.date}</Td>
                      <Td>{workout.name}</Td>
                      <Td>{workout.status}</Td>
                      <Td>{workout.completion}</Td>
                      <Td>
                        <Link to={`/workouts/${workout.id}`} style={{ color: '#10B981', marginRight: '10px' }}>
                          Ver
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContent>
        )}
        
        {activeTab === 'measurements' && (
          <SectionContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Histórico de Medidas</h3>
              <AddButton onClick={handleAddMeasurement}>
                <FiPlus /> Adicionar Nova Medida
              </AddButton>
            </div>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Peso</Th>
                    <Th>Gordura Corporal</Th>
                    <Th>Tórax</Th>
                    <Th>Cintura</Th>
                    <Th>Quadril</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {athlete.measurements.map(measurement => (
                    <Tr key={measurement.id}>
                      <Td>{measurement.date}</Td>
                      <Td>{measurement.weight}</Td>
                      <Td>{measurement.bodyFat}</Td>
                      <Td>{measurement.measurements.chest}</Td>
                      <Td>{measurement.measurements.waist}</Td>
                      <Td>{measurement.measurements.hips}</Td>
                      <Td>
                        <Link to={`/athletes/${id}/measurements/${measurement.id}`} style={{ color: '#10B981' }}>
                          Detalhes
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContent>
        )}
        
        {activeTab === 'notes' && (
  <SectionContent>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notas</h3>
      <AddButton>
        <FiPlus /> Adicionar Nota
      </AddButton>
    </div>
    
    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      <div style={{ fontSize: '14px', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px', color: '#1E293B' }}>{athlete.notes}</p>
      </div>
      
      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 10px', fontWeight: '500' }}>Enviar mensagem</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Escreva uma mensagem para o atleta..." 
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '8px', 
              border: '1px solid #E2E8F0',
              fontSize: '14px'
            }}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={handleSendMessage}
          >
            <FiMessageSquare style={{ marginRight: '5px' }} /> Enviar
          </button>
        </div>
      </div>
    </div>
  </SectionContent>
)}
      </Section>
    </MainLayout>
  );
};

export default AthleteDetail;