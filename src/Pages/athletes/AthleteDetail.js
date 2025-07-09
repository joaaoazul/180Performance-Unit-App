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
  FiTrendingDown, FiBarChart2, FiCheckCircle, FiXCircle,
  FiCamera, FiInfo, FiUsers, FiClipboard, FiArchive,
  FiPieChart, FiImage, FiDownload, FiEye, FiTrash2
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
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

// Health Information Styles
const HealthSection = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const HealthTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const HealthItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HealthLabel = styled.div`
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
`;

const HealthValue = styled.div`
  font-size: 14px;
  color: #1E293B;
  padding: 8px 12px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
`;

const AlertTag = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
`;

// Progress Photos & Measurements Styles
const MeasurementEntry = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const MeasurementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MeasurementDate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MeasurementActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  background: white;
  color: #64748B;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #F8FAFC;
    color: #1E293B;
  }
  
  &.danger {
    color: #EF4444;
    border-color: #FECACA;
    
    &:hover {
      background: #FEF2F2;
    }
  }
`;

const MeasurementGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BodyMeasurements = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const MeasurementCard = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
`;

const MeasurementIcon = styled.div`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 4px;
`;

const MeasurementLabel = styled.div`
  font-size: 11px;
  color: #64748B;
  margin-bottom: 4px;
`;

const MeasurementValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
`;

const MeasurementChange = styled.div`
  font-size: 10px;
  color: ${props => props.positive ? '#10B981' : props.negative ? '#EF4444' : '#64748B'};
  margin-top: 2px;
`;

const WeightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WeightCard = styled.div`
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const WeightValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
`;

const WeightChange = styled.div`
  font-size: 12px;
  color: ${props => props.positive ? '#EF4444' : '#10B981'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const PhotosSection = styled.div`
  margin-top: 20px;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  background: #F8FAFC;
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    border-color: #10B981;
    background: #F0FDF4;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  font-size: 11px;
  text-align: center;
`;

const PhotoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748B;
  
  svg {
    font-size: 24px;
  }
`;

const AddMeasurementButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #059669;
  }
`;

const NotesSection = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #FFFBEB;
  border: 1px solid #FED7AA;
  border-radius: 6px;
`;

const NotesLabel = styled.div`
  font-size: 12px;
  color: #92400E;
  margin-bottom: 4px;
  font-weight: 500;
`;

const NotesText = styled.div`
  font-size: 13px;
  color: #451A03;
  line-height: 1.4;
`;

// Check-in specific styles (mantidas do código original)
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
        
        // Simular carregamento com dados expandidos
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
            
            // Informações pessoais e de saúde
            personalInfo: {
              birthDate: '15/08/1985',
              age: 38,
              gender: 'Feminino',
              height: '165 cm',
              emergencyContact: 'João Oliveira - (11) 98888-7777',
              occupation: 'Advogada',
              address: 'Rua das Flores, 123 - São Paulo/SP'
            },
            
            // Informações de saúde
            healthInfo: {
              conditions: ['Hipertensão'],
              previousInjuries: ['Lesão no joelho direito (2019)'],
              surgeries: ['Nenhuma'],
              medications: ['Losartana 50mg (manhã)'],
              previousActivity: 'Sedentária',
              sleepHabits: '6-7 horas por noite',
              eatingHabits: 'Dieta rica em carboidratos, pouca proteína',
              allergies: ['Amendoim'],
              limitations: 'Evitar exercícios de alto impacto no joelho direito'
            },
            
            // Medições e pesagens
            measurements: [
              {
                id: 1,
                date: '2024-03-15',
                weight: 68.5,
                previousWeight: 70.2,
                bodyMeasurements: {
                  waist: 75,
                  hips: 102,
                  chest: 92,
                  thighs: 58,
                  arms: 28,
                  abdomen: 82
                },
                previousMeasurements: {
                  waist: 77,
                  hips: 103,
                  chest: 93,
                  thighs: 59,
                  arms: 29,
                  abdomen: 84
                },
                photos: {
                  front: '/api/photos/maria-front-20240315.jpg',
                  side: '/api/photos/maria-side-20240315.jpg',
                  back: '/api/photos/maria-back-20240315.jpg'
                },
                notes: 'Ótima evolução! Perdeu 1.7kg e reduziu medidas em todas as áreas. Muito motivada com os resultados.'
              },
              {
                id: 2,
                date: '2024-03-01',
                weight: 70.2,
                previousWeight: 71.8,
                bodyMeasurements: {
                  waist: 77,
                  hips: 103,
                  chest: 93,
                  thighs: 59,
                  arms: 29,
                  abdomen: 84
                },
                previousMeasurements: {
                  waist: 79,
                  hips: 104,
                  chest: 94,
                  thighs: 60,
                  arms: 30,
                  abdomen: 86
                },
                photos: {
                  front: '/api/photos/maria-front-20240301.jpg',
                  side: '/api/photos/maria-side-20240301.jpg',
                  back: '/api/photos/maria-back-20240301.jpg'
                },
                notes: 'Continuando o progresso. Relatou mais energia e disposição.'
              }
            ],
            
            // Check-ins data (mantido do código original)
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
  
  // Função para calcular diferença de medidas
  const getMeasurementChange = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change),
      isPositive: change < 0, // Para medidas corporais, redução é positiva
      isNegative: change > 0
    };
  };
  
  // Função para calcular diferença de peso
  const getWeightChange = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change < 0, // Para peso, redução é positiva (para objetivo de perda)
      isNegative: change > 0
    };
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
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')}
          >
            Informações do Cliente
          </Tab>
          <Tab 
            active={activeTab === 'measurements'} 
            onClick={() => setActiveTab('measurements')}
          >
            Pesagens & Medidas
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
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
          >
            Observações
          </Tab>
        </TabsContainer>
        
        {/* Tab Informações do Cliente */}
        {activeTab === 'info' && (
          <SectionContent>
            {/* Informações Pessoais */}
            <HealthSection>
              <HealthTitle>
                <FiUser /> Informações Pessoais
              </HealthTitle>
              <HealthGrid>
                <HealthItem>
                  <HealthLabel>Data de Nascimento</HealthLabel>
                  <HealthValue>{athlete.personalInfo.birthDate}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Idade</HealthLabel>
                  <HealthValue>{athlete.personalInfo.age} anos</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Gênero</HealthLabel>
                  <HealthValue>{athlete.personalInfo.gender}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Altura</HealthLabel>
                  <HealthValue>{athlete.personalInfo.height}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Profissão</HealthLabel>
                  <HealthValue>{athlete.personalInfo.occupation}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Contato de Emergência</HealthLabel>
                  <HealthValue>{athlete.personalInfo.emergencyContact}</HealthValue>
                </HealthItem>
              </HealthGrid>
            </HealthSection>

            {/* Condições de Saúde */}
            <HealthSection>
              <HealthTitle>
                <FiHeart /> Condições de Saúde
              </HealthTitle>
              <HealthGrid>
                <HealthItem>
                  <HealthLabel>Doenças Pré-existentes</HealthLabel>
                  <HealthValue>
                    {athlete.healthInfo.conditions.length > 0 ? (
                      athlete.healthInfo.conditions.map((condition, index) => (
                        <div key={index}>
                          {condition}
                          <AlertTag>Atenção</AlertTag>
                        </div>
                      ))
                    ) : (
                      'Nenhuma'
                    )}
                  </HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Lesões Anteriores</HealthLabel>
                  <HealthValue>
                    {athlete.healthInfo.previousInjuries.length > 0 ? (
                      athlete.healthInfo.previousInjuries.map((injury, index) => (
                        <div key={index}>
                          {injury}
                          <AlertTag>Cuidado</AlertTag>
                        </div>
                      ))
                    ) : (
                      'Nenhuma'
                    )}
                  </HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Cirurgias</HealthLabel>
                  <HealthValue>{athlete.healthInfo.surgeries.join(', ') || 'Nenhuma'}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Medicação Atual</HealthLabel>
                  <HealthValue>
                    {athlete.healthInfo.medications.length > 0 ? (
                      athlete.healthInfo.medications.map((med, index) => (
                        <div key={index}>{med}</div>
                      ))
                    ) : (
                      'Nenhuma'
                    )}
                  </HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Alergias</HealthLabel>
                  <HealthValue>
                    {athlete.healthInfo.allergies.length > 0 ? (
                      athlete.healthInfo.allergies.map((allergy, index) => (
                        <div key={index}>
                          {allergy}
                          <AlertTag>Alergia</AlertTag>
                        </div>
                      ))
                    ) : (
                      'Nenhuma'
                    )}
                  </HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Limitações Físicas</HealthLabel>
                  <HealthValue>{athlete.healthInfo.limitations || 'Nenhuma'}</HealthValue>
                </HealthItem>
              </HealthGrid>
            </HealthSection>

            {/* Hábitos e Estilo de Vida */}
            <HealthSection>
              <HealthTitle>
                <FiActivity /> Hábitos e Estilo de Vida
              </HealthTitle>
              <HealthGrid>
                <HealthItem>
                  <HealthLabel>Nível de Atividade Anterior</HealthLabel>
                  <HealthValue>{athlete.healthInfo.previousActivity}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Hábitos de Sono</HealthLabel>
                  <HealthValue>{athlete.healthInfo.sleepHabits}</HealthValue>
                </HealthItem>
                <HealthItem>
                  <HealthLabel>Hábitos Alimentares</HealthLabel>
                  <HealthValue>{athlete.healthInfo.eatingHabits}</HealthValue>
                </HealthItem>
              </HealthGrid>
            </HealthSection>
          </SectionContent>
        )}

        {/* Tab Pesagens & Medidas */}
        {activeTab === 'measurements' && (
          <SectionContent>
            <SectionHeader>
              <SectionTitle>
                <FiArchive /> Registro de Pesagens Quinzenais
              </SectionTitle>
              <AddMeasurementButton onClick={() => navigate(`/athletes/${id}/measurements/add`)}>
                <FiPlus /> Nova Pesagem
              </AddMeasurementButton>
            </SectionHeader>

            {athlete.measurements.map((measurement, index) => (
              <MeasurementEntry key={measurement.id}>
                <MeasurementHeader>
                  <MeasurementDate>
                    <FiCalendar />
                    {new Date(measurement.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </MeasurementDate>
                  <MeasurementActions>
                    <ActionButton>
                      <FiEye /> Ver Detalhes
                    </ActionButton>
                    <ActionButton>
                      <FiEdit2 /> Editar
                    </ActionButton>
                    <ActionButton className="danger">
                      <FiTrash2 /> Excluir
                    </ActionButton>
                  </MeasurementActions>
                </MeasurementHeader>

                <MeasurementGrid>
                  {/* Medidas Corporais */}
                  <div>
                    <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                      📏 Perímetros Corporais
                    </h4>
                    <BodyMeasurements>
                      <MeasurementCard>
                        <MeasurementIcon>⚖️</MeasurementIcon>
                        <MeasurementLabel>Cintura</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.waist} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.waist,
                            measurement.previousMeasurements?.waist
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>

                      <MeasurementCard>
                        <MeasurementIcon>🍑</MeasurementIcon>
                        <MeasurementLabel>Quadril</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.hips} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.hips,
                            measurement.previousMeasurements?.hips
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>

                      <MeasurementCard>
                        <MeasurementIcon>💪</MeasurementIcon>
                        <MeasurementLabel>Peito</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.chest} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.chest,
                            measurement.previousMeasurements?.chest
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>

                      <MeasurementCard>
                        <MeasurementIcon>🦵</MeasurementIcon>
                        <MeasurementLabel>Coxa</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.thighs} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.thighs,
                            measurement.previousMeasurements?.thighs
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>

                      <MeasurementCard>
                        <MeasurementIcon>💪</MeasurementIcon>
                        <MeasurementLabel>Braço</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.arms} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.arms,
                            measurement.previousMeasurements?.arms
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>

                      <MeasurementCard>
                        <MeasurementIcon>🤰</MeasurementIcon>
                        <MeasurementLabel>Abdômen</MeasurementLabel>
                        <MeasurementValue>{measurement.bodyMeasurements.abdomen} cm</MeasurementValue>
                        {(() => {
                          const change = getMeasurementChange(
                            measurement.bodyMeasurements.abdomen,
                            measurement.previousMeasurements?.abdomen
                          );
                          return change ? (
                            <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                              {change.isPositive ? '▼' : '▲'} {change.value} cm
                            </MeasurementChange>
                          ) : null;
                        })()}
                      </MeasurementCard>
                    </BodyMeasurements>
                  </div>

                  {/* Peso */}
                  <WeightSection>
                    <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                      ⚖️ Peso Corporal
                    </h4>
                    <WeightCard>
                      <WeightValue>{measurement.weight} kg</WeightValue>
                      {(() => {
                        const change = getWeightChange(measurement.weight, measurement.previousWeight);
                        return change ? (
                          <WeightChange positive={change.isPositive} negative={change.isNegative}>
                            {change.isPositive ? <FiTrendingDown /> : <FiTrendingUp />}
                            {change.isPositive ? '-' : '+'}{change.value} kg
                          </WeightChange>
                        ) : null;
                      })()}
                    </WeightCard>
                  </WeightSection>
                </MeasurementGrid>

                {/* Fotos de Progresso */}
                <PhotosSection>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                    📸 Fotos de Progresso
                  </h4>
                  <PhotosGrid>
                    <PhotoCard>
                      {measurement.photos.front ? (
                        <>
                          <img src={measurement.photos.front} alt="Frente" />
                          <PhotoLabel>Frente</PhotoLabel>
                        </>
                      ) : (
                        <PhotoPlaceholder>
                          <FiCamera />
                          <span>Frente</span>
                        </PhotoPlaceholder>
                      )}
                    </PhotoCard>

                    <PhotoCard>
                      {measurement.photos.side ? (
                        <>
                          <img src={measurement.photos.side} alt="Lado" />
                          <PhotoLabel>Lado</PhotoLabel>
                        </>
                      ) : (
                        <PhotoPlaceholder>
                          <FiCamera />
                          <span>Lado</span>
                        </PhotoPlaceholder>
                      )}
                    </PhotoCard>

                    <PhotoCard>
                      {measurement.photos.back ? (
                        <>
                          <img src={measurement.photos.back} alt="Costas" />
                          <PhotoLabel>Costas</PhotoLabel>
                        </>
                      ) : (
                        <PhotoPlaceholder>
                          <FiCamera />
                          <span>Costas</span>
                        </PhotoPlaceholder>
                      )}
                    </PhotoCard>
                  </PhotosGrid>
                </PhotosSection>

                {/* Observações */}
                {measurement.notes && (
                  <NotesSection>
                    <NotesLabel>📝 Observações</NotesLabel>
                    <NotesText>{measurement.notes}</NotesText>
                  </NotesSection>
                )}
              </MeasurementEntry>
            ))}

            {athlete.measurements.length === 0 && (
              <EmptyState>
                <EmptyIcon><FiArchive /></EmptyIcon>
                <EmptyTitle>Nenhuma pesagem registrada</EmptyTitle>
                <EmptyDescription>
                  Comece registrando a primeira pesagem e medidas corporais deste atleta.
                </EmptyDescription>
                <AddMeasurementButton 
                  onClick={() => navigate(`/athletes/${id}/measurements/add`)}
                  style={{ marginTop: '16px' }}
                >
                  <FiPlus /> Primeira Pesagem
                </AddMeasurementButton>
              </EmptyState>
            )}
          </SectionContent>
        )}

        {/* Tab Check-ins Diários */}
        {activeTab === 'checkins' && (
          <SectionContent>
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
            
            {/* Lista de check-ins */}
            <div style={{ display: 'grid', gap: '12px' }}>
              {athlete.checkins.map(checkin => (
                <div key={checkin.id} style={{
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '24px' }}>
                    {getMoodEmoji(checkin.mood)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {new Date(checkin.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      Energia: {checkin.energy}/10 • Sono: {checkin.sleep}/10
                    </div>
                    {checkin.notes && (
                      <div style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
                        {checkin.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionContent>
        )}

        {/* Tab Visão Geral */}
        {activeTab === 'overview' && (
          <SectionContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Resumo de Check-ins */}
              <div style={{ 
                background: '#F8FAFC', 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px', 
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                  📊 Check-ins Recentes
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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

              {/* Resumo de Progresso */}
              {athlete.measurements.length > 0 && (
                <div style={{ 
                  background: '#F0FDF4', 
                  border: '1px solid #BBF7D0', 
                  borderRadius: '8px', 
                  padding: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                    📏 Progresso Físico
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Peso Atual</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                        {athlete.measurements[0].weight} kg
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Última Medição</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                        {new Date(athlete.measurements[0].date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Cintura</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                        {athlete.measurements[0].bodyMeasurements.waist} cm
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Total Medições</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                        {athlete.measurements.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alertas de Saúde */}
              {(athlete.healthInfo.conditions.length > 0 || athlete.healthInfo.previousInjuries.length > 0) && (
                <div style={{ 
                  background: '#FEF2F2', 
                  border: '1px solid #FECACA', 
                  borderRadius: '8px', 
                  padding: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#DC2626' }}>
                    ⚠️ Atenção Médica
                  </h4>
                  <div style={{ fontSize: '13px', color: '#7F1D1D' }}>
                    {athlete.healthInfo.conditions.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Condições:</strong> {athlete.healthInfo.conditions.join(', ')}
                      </div>
                    )}
                    {athlete.healthInfo.previousInjuries.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Lesões:</strong> {athlete.healthInfo.previousInjuries.join(', ')}
                      </div>
                    )}
                    {athlete.healthInfo.limitations && (
                      <div>
                        <strong>Limitações:</strong> {athlete.healthInfo.limitations}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SectionContent>
        )}

        {/* Placeholder para outras tabs */}
        {activeTab === 'workouts' && (
          <SectionContent>
            <EmptyState>
              <EmptyIcon><FiActivity /></EmptyIcon>
              <EmptyTitle>Treinos em desenvolvimento</EmptyTitle>
              <EmptyDescription>
                Esta seção será implementada em breve.
              </EmptyDescription>
            </EmptyState>
          </SectionContent>
        )}

        {activeTab === 'notes' && (
          <SectionContent>
            <EmptyState>
              <EmptyIcon><FiFileText /></EmptyIcon>
              <EmptyTitle>Observações em desenvolvimento</EmptyTitle>
              <EmptyDescription>
                Esta seção será implementada em breve.
              </EmptyDescription>
            </EmptyState>
          </SectionContent>
        )}
      </Section>
    </MainLayout>
  );
};

export default AthleteDetail;