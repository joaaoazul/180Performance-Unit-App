// src/pages/dashboard/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { 
  FiUsers, FiCalendar, FiDollarSign, FiActivity,
  FiTrendingUp, FiAward, FiRefreshCw, FiChevronRight 
} from 'react-icons/fi';
import MainLayout from '../../components/Layout/MainLayout';
import StatCard from '../../components/Dashboard/StatCard';
import MotivationCard from '../../components/Dashboard/MotivationCard';
import AthleteProgressCard from '../../components/Dashboard/AthleteProgressCard';
import UpcomingSessionsCard from '../../components/Dashboard/UpComingSessionsCard';
import PerformanceChart from '../../components/Dashboard/PerformanceChart';
import WorkoutDistributionCard from '../../components/Dashboard/WorkoutDistributionCard';
import { AuthContext } from '../../components/context/AuthContext';
import { fetchProtectedData } from '../../services/authService';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const WelcomeInfo = styled.div``;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 8px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #64748B;
  margin: 0;
  font-weight: 400;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #E2E8F0;
  color: #64748B;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F8FAFC;
    border-color: #CBD5E1;
    color: #1E293B;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 16px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(180deg);
  }
`;

const InsightSection = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  h3 {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    color: #1E293B;
  }
  
  p {
    color: #64748B;
    margin-bottom: 20px;
    line-height: 1.6;
    font-size: 14px;
  }
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #10B981;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    font-size: 16px;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(2px);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #E2E8F0;
  border-top-color: #10B981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
`;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Funções para carregar dados da API
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Aqui você faria uma chamada real à sua API
      // const response = await api.get('/dashboard');
      
      // Por enquanto, usamos o fetchProtectedData apenas para validar
      // a autenticação com o backend
      await fetchProtectedData();
      
      // Simular delay para ver o loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados mockados para demonstração
      setDashboardData({
        stats: [
          {
            title: 'Atletas Ativos',
            value: '12',
            trend: 'este mês',
            percentChange: 8.2,
            icon: FiUsers,
            color: '#3B82F6',
            bgColor: '#EFF6FF'
          },
          {
            title: 'Sessões Hoje',
            value: '5',
            trend: 'vs ontem',
            percentChange: 12.5,
            icon: FiCalendar,
            color: '#10B981',
            bgColor: '#ECFDF5'
          },
          {
            title: 'Receita Mensal',
            value: '€3.850',
            trend: 'vs último mês',
            percentChange: 5.1,
            icon: FiDollarSign,
            color: '#F59E0B',
            bgColor: '#FFFBEB'
          },
          {
            title: 'Taxa de Retenção',
            value: '92%',
            trend: 'vs último mês',
            percentChange: 1.5,
            icon: FiActivity,
            color: '#8B5CF6',
            bgColor: '#F3E8FF'
          }
        ],
        athletes: [
          {
            name: 'Maria Oliveira',
            goalProgress: 85,
            image: null
          },
          {
            name: 'Carlos Santos',
            goalProgress: 70,
            image: null
          },
          {
            name: 'Ana Beatriz',
            goalProgress: 60,
            image: null
          },
          {
            name: 'Paulo Ricardo',
            goalProgress: 35,
            image: null
          }
        ],
        sessions: [
          {
            title: 'Treino de Força',
            time: '09:00 - 10:00',
            athlete: 'Maria Oliveira',
            location: 'Academia Central',
            color: '#10B981'
          },
          {
            title: 'Avaliação Física',
            time: '11:30 - 12:30',
            athlete: 'Carlos Santos',
            location: 'Academia Central',
            color: '#3B82F6'
          },
          {
            title: 'HIIT',
            time: '15:00 - 16:00',
            athlete: 'Ana Beatriz',
            location: 'Parque Municipal',
            color: '#F59E0B'
          }
        ],
        motivation: {
          quote: "Não conte os dias, faça com que os dias contem. Transforme cada sessão em uma oportunidade para alcançar a grandeza.",
          author: "Performance Unit"
        },
        performanceData: [
          { name: 'Jan', attendance: 90, performance: 85, satisfaction: 88 },
          { name: 'Fev', attendance: 93, performance: 88, satisfaction: 90 },
          { name: 'Mar', attendance: 91, performance: 90, satisfaction: 92 },
          { name: 'Abr', attendance: 95, performance: 92, satisfaction: 93 },
          { name: 'Mai', attendance: 92, performance: 93, satisfaction: 91 },
          { name: 'Jun', attendance: 97, performance: 95, satisfaction: 94 }
        ],
        workoutDistribution: [
          { name: 'Força', value: 40, color: '#10B981' },
          { name: 'HIIT', value: 25, color: '#3B82F6' },
          { name: 'Funcional', value: 20, color: '#F59E0B' },
          { name: 'Cardio', value: 10, color: '#8B5CF6' },
          { name: 'Mobilidade', value: 5, color: '#EF4444' }
        ]
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Tratar erro - talvez mostrar uma mensagem ao usuário
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Manipulador para o botão de atualizar
  const handleRefresh = () => {
    loadDashboardData();
  };
  
  return (
    <MainLayout title="Dashboard">
      {isLoading && (
        <LoadingOverlay>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>A carregar o dashboard...</LoadingText>
          </LoadingContainer>
        </LoadingOverlay>
      )}
      
      <DashboardContainer>
        <WelcomeSection>
          <WelcomeInfo>
            <WelcomeTitle>Bem-vindo, {user?.name?.split(' ')[0] || 'Treinador'}! 💪</WelcomeTitle>
            <WelcomeSubtitle>Acompanha os teus atletas e o seu progresso diário</WelcomeSubtitle>
          </WelcomeInfo>
          
          <RefreshButton onClick={handleRefresh}>
            <FiRefreshCw /> Atualizar dados
          </RefreshButton>
        </WelcomeSection>
        
        {dashboardData && (
          <>
            <GridContainer>
              {dashboardData.stats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  trend={stat.trend}
                  percentChange={stat.percentChange}
                  icon={stat.icon}
                  color={stat.color}
                  bgColor={stat.bgColor}
                />
              ))}
            </GridContainer>
            
            <MotivationCard 
              quote={dashboardData.motivation.quote}
              author={dashboardData.motivation.author}
            />
            
            <TwoColumnGrid style={{ marginTop: '24px' }}>
              <AthleteProgressCard athletes={dashboardData.athletes} />
              <UpcomingSessionsCard sessions={dashboardData.sessions} />
            </TwoColumnGrid>
            
            <PerformanceChart data={dashboardData.performanceData} />
            
            <ChartsRow>
              <InsightSection>
                <h3>Metas Concluídas</h3>
                <p>
                  Os teus atletas estão com um excelente desempenho! A média de conclusão de metas está em 75%, 
                  superando a média do setor que é 68%. Continua o excelente trabalho!
                </p>
                <ActionButton href="/athletes">
                  Ver relatório completo <FiChevronRight />
                </ActionButton>
              </InsightSection>
              <WorkoutDistributionCard data={dashboardData.workoutDistribution} />
            </ChartsRow>
          </>
        )}
      </DashboardContainer>
    </MainLayout>
  );
};

export default Dashboard;