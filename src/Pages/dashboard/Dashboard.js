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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease forwards;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  animation: fadeIn 0.3s ease forwards;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
  animation: fadeIn 0.4s ease forwards;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeInfo = styled.div`
  animation: fadeIn 0.2s ease forwards;
`;

const WelcomeTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 5px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #64748B;
  margin: 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
`;

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #10B981;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  text-decoration: none;
  
  svg {
    margin-left: 8px;
  }
  
  &:hover {
    background: #0D9668;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled(FiRefreshCw)`
  color: #10B981;
  font-size: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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
            value: 'R$ 3.850',
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
            color: '#EF4444',
            bgColor: '#FEF2F2'
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
          author: "Motivação FitPro"
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
          { name: 'Força', value: 40 },
          { name: 'HIIT', value: 25 },
          { name: 'Funcional', value: 20 },
          { name: 'Cardio', value: 10 },
          { name: 'Mobilidade', value: 5 }
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
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <WelcomeSection>
        <WelcomeInfo>
          <WelcomeTitle>Bem-vindo, {user?.name?.split(' ')[0] || 'Trainer'}! 💪</WelcomeTitle>
          <WelcomeSubtitle>Acompanhe seus atletas e atividades do dia</WelcomeSubtitle>
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
          
          <TwoColumnGrid style={{ marginTop: '20px' }}>
            <AthleteProgressCard athletes={dashboardData.athletes} />
            <UpcomingSessionsCard sessions={dashboardData.sessions} />
          </TwoColumnGrid>
          
          <PerformanceChart data={dashboardData.performanceData} />
          
          <ChartsRow>
            <div>
              <h3 style={{ margin: '20px 0', fontSize: '18px', fontWeight: '600', color: '#1E293B' }}>
                Metas Concluídas
              </h3>
              <p style={{ color: '#64748B', marginBottom: '20px' }}>
                Seus atletas estão tendo um bom desempenho! A média de conclusão de metas está em 75%, acima da média do setor que é 68%.
              </p>
              <ActionButton href="/athletes">
                Ver relatório completo <FiChevronRight />
              </ActionButton>
            </div>
            <WorkoutDistributionCard data={dashboardData.workoutDistribution} />
          </ChartsRow>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;