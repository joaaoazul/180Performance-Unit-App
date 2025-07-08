// src/pages/Athletes/AthleteDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';
import { 
  FiUser, FiCalendar, FiChevronLeft, FiEdit2, FiTrendingUp,
  FiActivity, FiClock, FiPlus, FiMail, FiPhone, FiTarget,
  FiMoreVertical, FiFileText, FiSend, FiSave, FiHeart,
  FiSmile, FiMeh, FiFrown, FiBattery, FiMoon, FiAlertCircle,
  FiTrendingDown, FiBarChart2, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Styled Components
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #64748B;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: #1E293B;
  }
`;

const EditButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #10B981;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #059669;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  color: #64748B;
  overflow: hidden;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ProfileBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
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

// Check-in specific styles
const CheckinOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const CheckinStat = styled.div`
  background: ${props => props.variant === 'alert' ? '#FEF2F2' : '#F8FAFC'};
  border: 1px solid ${props => props.variant === 'alert' ? '#FECACA' : '#E2E8F0'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckinStatInfo = styled.div`
  flex: 1;
`;

const CheckinStatLabel = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 4px;
`;

const CheckinStatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.variant === 'alert' ? '#EF4444' : '#1E293B'};
`;

const CheckinStatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.variant === 'alert' ? '#FEE2E2' : '#ECFDF5'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.variant === 'alert' ? '#EF4444' : '#10B981'};
  font-size: 20px;
`;

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const PeriodButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#10B981' : '#E2E8F0'};
  background: ${props => props.active ? '#10B981' : 'white'};
  color: ${props => props.active ? 'white' : '#64748B'};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10B981;
    color: ${props => props.active ? 'white' : '#10B981'};
  }
`;

const CheckinHistory = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
`;

const CheckinCard = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const CheckinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CheckinDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CheckinMood = styled.div`
  font-size: 24px;
`;

const CheckinMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
`;

const CheckinMetric = styled.div`
  text-align: center;
  padding: 8px;
  background: #F8FAFC;
  border-radius: 6px;
`;

const MetricIcon = styled.div`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 4px;
`;

const MetricScore = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const MetricName = styled.div`
  font-size: 11px;
  color: #64748B;
  margin-top: 2px;
`;

const CheckinNotes = styled.div`
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  padding: 10px;
  background: #F8FAFC;
  border-radius: 6px;
  margin-top: 8px;
`;

const AlertBanner = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  
  svg {
    color: #EF4444;
    font-size: 20px;
    flex-shrink: 0;
  }
`;

const AlertText = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: #DC2626;
  }
  
  p {
    margin: 0;
    font-size: 13px;
    color: #7F1D1D;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #CBD5E1;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #64748B;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #94A3B8;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingIcon = styled(FiActivity)`
  font-size: 32px;
  color: #10B981;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Componente principal
const AthleteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartPeriod, setChartPeriod] = useState('week');
  
  // Carregar dados do atleta
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        await fetchProtectedData();
        
        // Simular carregamento
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
            avatar: null,
            // Check-ins data
            checkins: [
              {
                id: 1,
                date: '2024-03-15',
                mood: 'happy',
                energy: 8,
                sleep: 7,
                notes: 'Me senti muito bem hoje! Treino foi excelente.',
                completed: true
              },
              {
                id: 2,
                date: '2024-03-14',
                mood: 'neutral',
                energy: 6,
                sleep: 5,
                notes: 'Dormi mal, mas consegui treinar.',
                completed: true
              },
              {
                id: 3,
                date: '2024-03-13',
                mood: 'sad',
                energy: 4,
                sleep: 6,
                notes: 'Dia difícil, sem energia para treinar.',
                completed: true
              },
              {
                id: 4,
                date: '2024-03-12',
                mood: 'happy',
                energy: 9,
                sleep: 8,
                notes: 'Ótima noite de sono, treino rendeu muito!',
                completed: true
              },
              {
                id: 5,
                date: '2024-03-11',
                mood: 'neutral',
                energy: 7,
                sleep: 7,
                notes: '',
                completed: true
              }
            ],
            // Dados para o gráfico
            checkinStats: {
              lastCheckin: '2024-03-15',
              totalCheckins: 25,
              currentStreak: 5,
              missedDays: 2,
              avgEnergy: 7.2,
              avgSleep: 6.8,
              avgMood: 'neutral'
            }
          };
          
          setAthlete(mockAthlete);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
        setLoading(false);
        navigate('/athletes');
      }
    };
    
    fetchAthleteData();
  }, [id, navigate]);
  
  // Função para obter emoji do humor
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😐';
    }
  };
  
  // Função para obter cor do humor
  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return '#10B981';
      case 'neutral': return '#F59E0B';
      case 'sad': return '#EF4444';
      default: return '#64748B';
    }
  };
  
  // Função para calcular dias sem check-in
  const getDaysSinceLastCheckin = () => {
    if (!athlete || !athlete.checkinStats.lastCheckin) return 0;
    const lastDate = new Date(athlete.checkinStats.lastCheckin);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Preparar dados para o gráfico
  const prepareChartData = () => {
    if (!athlete || !athlete.checkins) return [];
    
    return athlete.checkins.slice(0, 7).reverse().map(checkin => ({
      date: new Date(checkin.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      energia: checkin.energy,
      sono: checkin.sleep,
      humor: checkin.mood === 'happy' ? 10 : checkin.mood === 'neutral' ? 5 : 2
    }));
  };
  
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
            active={activeTab === 'checkins'} 
            onClick={() => setActiveTab('checkins')}
          >
            Check-ins Diários
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
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
          >
            Observações
          </Tab>
        </TabsContainer>
        
        {/* Tab Check-ins Diários */}
        {activeTab === 'checkins' && (
          <SectionContent>
            {/* Alerta se não fez check-in há mais de 2 dias */}
            {getDaysSinceLastCheckin() > 2 && (
              <AlertBanner>
                <FiAlertCircle />
                <AlertText>
                  <h4>Atenção: Check-in em atraso</h4>
                  <p>{athlete.name} não faz check-in há {getDaysSinceLastCheckin()} dias. Considere entrar em contato.</p>
                </AlertText>
              </AlertBanner>
            )}
            
            {/* Estatísticas dos Check-ins */}
            <CheckinOverview>
              <CheckinStat>
                <CheckinStatInfo>
                  <CheckinStatLabel>Check-ins Totais</CheckinStatLabel>
                  <CheckinStatValue>{athlete.checkinStats.totalCheckins}</CheckinStatValue>
                </CheckinStatInfo>
                <CheckinStatIcon>
                  <FiCheckCircle />
                </CheckinStatIcon>
              </CheckinStat>
              
              <CheckinStat>
                <CheckinStatInfo>
                  <CheckinStatLabel>Sequência Atual</CheckinStatLabel>
                  <CheckinStatValue>{athlete.checkinStats.currentStreak} dias</CheckinStatValue>
                </CheckinStatInfo>
                <CheckinStatIcon>
                  <FiTrendingUp />
                </CheckinStatIcon>
              </CheckinStat>
              
              <CheckinStat>
                <CheckinStatInfo>
                  <CheckinStatLabel>Média de Energia</CheckinStatLabel>
                  <CheckinStatValue>{athlete.checkinStats.avgEnergy}/10</CheckinStatValue>
                </CheckinStatInfo>
                <CheckinStatIcon>
                  <FiBattery />
                </CheckinStatIcon>
              </CheckinStat>
              
              <CheckinStat variant={athlete.checkinStats.missedDays > 0 ? 'alert' : ''}>
                <CheckinStatInfo>
                  <CheckinStatLabel>Dias Perdidos</CheckinStatLabel>
                  <CheckinStatValue variant={athlete.checkinStats.missedDays > 0 ? 'alert' : ''}>
                    {athlete.checkinStats.missedDays}
                  </CheckinStatValue>
                </CheckinStatInfo>
                <CheckinStatIcon variant={athlete.checkinStats.missedDays > 0 ? 'alert' : ''}>
                  <FiXCircle />
                </CheckinStatIcon>
              </CheckinStat>
            </CheckinOverview>
            
            {/* Gráfico de Tendências */}
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>
                  <FiBarChart2 style={{ display: 'inline', marginRight: '8px' }} />
                  Tendências dos Check-ins
                </ChartTitle>
                <PeriodSelector>
                  <PeriodButton 
                    active={chartPeriod === 'week'} 
                    onClick={() => setChartPeriod('week')}
                  >
                    Semana
                  </PeriodButton>
                  <PeriodButton 
                    active={chartPeriod === 'month'} 
                    onClick={() => setChartPeriod('month')}
                  >
                    Mês
                  </PeriodButton>
                </PeriodSelector>
              </ChartHeader>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="energia" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sono" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humor" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            {/* Histórico de Check-ins */}
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
              Histórico de Check-ins
            </h3>
            
            <CheckinHistory>
              {athlete.checkins.map(checkin => (
                <CheckinCard key={checkin.id}>
                  <CheckinHeader>
                    <CheckinDate>
                      <FiCalendar />
                      {new Date(checkin.date).toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </CheckinDate>
                    <CheckinMood>{getMoodEmoji(checkin.mood)}</CheckinMood>
                  </CheckinHeader>
                  
                  <CheckinMetrics>
                    <CheckinMetric>
                      <MetricIcon><FiBattery /></MetricIcon>
                      <MetricScore>{checkin.energy}/10</MetricScore>
                      <MetricName>Energia</MetricName>
                    </CheckinMetric>
                    
                    <CheckinMetric>
                      <MetricIcon><FiMoon /></MetricIcon>
                      <MetricScore>{checkin.sleep}/10</MetricScore>
                      <MetricName>Sono</MetricName>
                    </CheckinMetric>
                    
                    <CheckinMetric>
                      <MetricIcon><FiHeart /></MetricIcon>
                      <MetricScore style={{ color: getMoodColor(checkin.mood) }}>
                        {checkin.mood === 'happy' ? 'Bem' : checkin.mood === 'neutral' ? 'Normal' : 'Mal'}
                      </MetricScore>
                      <MetricName>Humor</MetricName>
                    </CheckinMetric>
                  </CheckinMetrics>
                  
                  {checkin.notes && (
                    <CheckinNotes>
                      {checkin.notes}
                    </CheckinNotes>
                  )}
                </CheckinCard>
              ))}
            </CheckinHistory>
            
            {athlete.checkins.length === 0 && (
              <EmptyState>
                <EmptyIcon><FiFileText /></EmptyIcon>
                <EmptyTitle>Nenhum check-in registrado</EmptyTitle>
                <EmptyDescription>
                  Este atleta ainda não fez nenhum check-in diário.
                </EmptyDescription>
              </EmptyState>
            )}
          </SectionContent>
        )}
        
        {/* Tab Visão Geral - adicionar resumo dos check-ins */}
        {activeTab === 'overview' && (
          <SectionContent>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
              Resumo de Atividades
            </h3>
            
            {/* Mini resumo dos check-ins na visão geral */}
            <div style={{ 
              background: '#F8FAFC', 
              border: '1px solid #E2E8F0', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                Check-ins Recentes
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Último Check-in</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                    {athlete.checkinStats.lastCheckin ? 
                      new Date(athlete.checkinStats.lastCheckin).toLocaleDateString('pt-BR') : 
                      'Nenhum'
                    }
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Sequência</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#10B981' }}>
                    {athlete.checkinStats.currentStreak} dias
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Média de Energia</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                    {athlete.checkinStats.avgEnergy}/10
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Humor Geral</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {athlete.checkinStats.avgMood === 'happy' ? '😊 Positivo' : 
                     athlete.checkinStats.avgMood === 'neutral' ? '😐 Neutro' : 
                     '😔 Baixo'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resto do conteúdo da visão geral... */}
          </SectionContent>
        )}
      </Section>
    </MainLayout>
  );
};

export default AthleteDetail;