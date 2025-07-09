// src/pages/Athletes/AthleteDetail.js - Versão Completa
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';
import { 
  FiUser, FiCalendar, FiChevronLeft, FiEdit2, FiTrendingUp,
  FiActivity, FiClock, FiPlus, FiMail, FiPhone, FiTarget,
  FiFileText, FiSend, FiSave, FiHeart, FiSmile, FiMeh, 
  FiFrown, FiBattery, FiMoon, FiAlertCircle, FiTrendingDown, 
  FiBarChart2, FiCheckCircle, FiXCircle, FiCamera, FiInfo, 
  FiUsers, FiClipboard, FiArchive, FiEye, FiTrash2,
  FiAlertTriangle, FiX
} from 'react-icons/fi';

// Importar componentes personalizados
import {
  MeasurementEntry, MeasurementHeader, MeasurementDate, MeasurementActions,
  ActionButton, MeasurementGrid, BodyMeasurements, MeasurementCard,
  MeasurementIcon, MeasurementLabel, MeasurementValue, MeasurementChange,
  WeightSection, WeightCard, WeightValue, WeightChange,
  PhotosSection, PhotosGrid, PhotoCard, PhotoLabel, PhotoPlaceholder,
  NotesSection, NotesLabel, NotesText,
  CheckinCard, CheckinHeader, CheckinDate, CheckinStatus,
  MoodSelector, MoodOption, ScaleInput, ScaleValue,
  ObservationCard, ObservationHeader, ObservationTitle, ObservationMeta,
  ObservationContent, PriorityBadge, TypeBadge,
  FormGroup, Label, Input, TextArea, Select, ButtonGroup,
  PrimaryButton, SecondaryButton, StatsGrid, StatCard,
  StatValue, StatLabel, StatChange, Divider, Badge,
  ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton,
  getMeasurementChange, getWeightChange, formatDate, getMoodIcon, getEnergyColor
} from './AthleteDetailComponents';

// ============================================================================
// BREAKPOINTS E CONSTANTES
// ============================================================================
const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// ============================================================================
// STYLED COMPONENTS - LAYOUT PRINCIPAL
// ============================================================================
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
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
  
  @media (max-width: ${breakpoints.mobile}) {
    justify-content: center;
    padding: 12px 16px;
    background: #F8FAFC;
    border-radius: 8px;
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
  
  @media (max-width: ${breakpoints.mobile}) {
    justify-content: center;
    padding: 14px 20px;
    font-size: 16px;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
  
  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 8px;
    margin-bottom: 16px;
  }
`;

const SectionContent = styled.div`
  padding: 20px;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 16px;
  }
`;

// ... [Outros styled components do arquivo anterior] ...

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const AthleteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para check-ins diários
  const [newCheckin, setNewCheckin] = useState({
    mood: '',
    energy: 5,
    sleep: 5,
    motivation: 5,
    notes: ''
  });
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  
  // Estados para observações
  const [newObservation, setNewObservation] = useState({
    type: 'general',
    title: '',
    content: '',
    priority: 'normal'
  });
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [observations, setObservations] = useState([]);
  
  // Estados para medições
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  
  // Função para calcular iniciais
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Carregar dados do atleta (dados mockados expandidos)
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        await fetchProtectedData();
        
        setTimeout(() => {
          const mockAthlete = {
            id: id,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            status: 'active',
            plan: 'Premium',
            joinDate: '15/01/2023',
            lastActivity: '10/03/2023',
            avatar: null,
            
            // Info PT-friendly
            age: 38,
            gender: 'Feminino',
            goal: '🔥 Perder Peso',
            emergencyContact: 'João Oliveira - (11) 98888-7777',
            
            // Informações práticas para treino
            hasHealthIssues: true,
            healthSummary: 'Hipertensão controlada com medicação. Evitar exercícios de alto impacto no joelho direito.',
            limitations: 'Evitar exercícios de impacto no joelho direito',
            preferences: 'Prefere treinar pela manhã, não gosta de exercícios muito intensos',
            notes: 'Muito motivada, mas fica ansiosa com exercícios novos. Explicar bem antes de executar.',
            
            // Check-ins stats expandido
            checkinStats: {
              lastCheckin: '2024-03-15',
              totalCheckins: 25,
              currentStreak: 5,
              missedDays: 2,
              avgEnergy: 7.2,
              avgSleep: 6.8,
              avgMood: 'neutral',
              avgMotivation: 7.5
            },
            
            // Medições expandidas
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
                  front: null,
                  side: null,
                  back: null
                },
                notes: 'Ótima evolução! Perdeu 1.7kg e reduziu medidas em todas as áreas.'
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
                  front: null,
                  side: null,
                  back: null
                },
                notes: 'Continuando o progresso. Relatou mais energia e disposição.'
              }
            ],
            
            // Check-ins recentes
            recentCheckins: [
              {
                id: 1,
                date: '2024-03-15',
                mood: 'happy',
                energy: 8,
                sleep: 7,
                motivation: 9,
                notes: 'Ótimo dia! Me senti muito bem no treino.'
              },
              {
                id: 2,
                date: '2024-03-14',
                mood: 'neutral',
                energy: 6,
                sleep: 5,
                motivation: 7,
                notes: 'Dormi mal, mas consegui treinar.'
              }
            ]
          };
          
          setAthlete(mockAthlete);
          
          // Mock observations
          setObservations([
            {
              id: 1,
              type: 'training',
              title: 'Evolução no agachamento',
              content: 'Hoje conseguiu fazer 3 séries de 12 repetições com 40kg. Evolução significativa!',
              priority: 'high',
              date: '2024-03-15',
              createdBy: 'Personal Trainer'
            },
            {
              id: 2,
              type: 'health',
              title: 'Dor no joelho',
              content: 'Relatou leve desconforto no joelho direito. Ajustamos o treino para evitar impacto.',
              priority: 'medium',
              date: '2024-03-10',
              createdBy: 'Personal Trainer'
            }
          ]);
          
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
  
  // Função para salvar check-in
  const handleSaveCheckin = () => {
    const checkin = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newCheckin
    };
    
    // Aqui seria feita a chamada para a API
    console.log('Salvando check-in:', checkin);
    
    // Reset form
    setNewCheckin({
      mood: '',
      energy: 5,
      sleep: 5,
      motivation: 5,
      notes: ''
    });
    setShowCheckinModal(false);
  };
  
  // Função para salvar observação
  const handleSaveObservation = () => {
    if (!newObservation.title || !newObservation.content) return;
    
    const observation = {
      id: Date.now(),
      ...newObservation,
      date: new Date().toISOString().split('T')[0],
      createdBy: 'Personal Trainer'
    };
    
    setObservations(prev => [observation, ...prev]);
    
    // Reset form
    setNewObservation({
      type: 'general',
      title: '',
      content: '',
      priority: 'normal'
    });
    setShowObservationModal(false);
  };
  
  if (loading) {
    return (
      <MainLayout title="Detalhes do Atleta">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <FiActivity 
            size={32} 
            style={{ 
              color: '#10B981', 
              animation: 'spin 1s linear infinite' 
            }} 
          />
        </div>
      </MainLayout>
    );
  }
  
  if (!athlete) {
    return (
      <MainLayout title="Detalhes do Atleta">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }}>
            <FiUser />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#64748B' }}>
            Atleta não encontrado
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#94A3B8' }}>
            Não foi possível encontrar as informações deste atleta.
          </p>
          <BackButton to="/athletes" style={{ marginTop: '16px' }}>
            <FiChevronLeft /> Voltar para lista de atletas
          </BackButton>
        </div>
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
          {/* Profile Header */}
          <div style={{ 
            display: 'flex', 
            gap: '30px', 
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: '600',
              color: '#64748B',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {athlete.avatar ? (
                <img 
                  src={athlete.avatar} 
                  alt={athlete.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                getInitials(athlete.name)
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: '0 0 10px',
                fontSize: '28px',
                fontWeight: '600',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {athlete.name}
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: athlete.status === 'active' ? '#ECFDF5' : '#FEF2F2',
                  color: athlete.status === 'active' ? '#10B981' : '#EF4444'
                }}>
                  {athlete.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </h1>
              
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#EFF6FF',
                color: '#3B82F6',
                marginBottom: '20px'
              }}>
                {athlete.goal}
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '5px' }}>
                    Telefone
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#1E293B', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FiPhone style={{ color: '#64748B' }} /> {athlete.phone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '5px' }}>
                    Email
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#1E293B', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FiMail style={{ color: '#64748B' }} /> {athlete.email}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '5px' }}>
                    Idade
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#1E293B', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FiUser style={{ color: '#64748B' }} /> {athlete.age} anos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContent>
        
        {/* Tabs Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          overflowX: 'auto'
        }}>
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'info', label: 'Info do Cliente' },
            { key: 'measurements', label: 'Pesagens & Medidas' },
            { key: 'checkins', label: 'Check-ins Diários' },
            { key: 'workouts', label: 'Treinos' },
            { key: 'notes', label: 'Observações' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab.key ? '#10B981' : '#64748B',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab.key ? '#10B981' : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* TAB CONTENT */}
        {activeTab === 'overview' && (
          <SectionContent>
            {/* Alertas de Saúde */}
            {athlete.hasHealthIssues && (
              <div style={{
                background: '#FEF2F2',
                border: '2px solid #FECACA',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <FiAlertTriangle size={20} style={{ color: '#DC2626', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#DC2626', marginBottom: '6px' }}>
                    ⚠️ Atenção - Condições de Saúde
                  </div>
                  <div style={{ color: '#7F1D1D', fontSize: '14px' }}>
                    {athlete.healthSummary}
                  </div>
                </div>
              </div>
            )}

            {/* Cards de Resumo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* Check-ins Card */}
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📊 Check-ins Recentes
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Último Check-in</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {formatDate(athlete.checkinStats.lastCheckin)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Sequência</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>
                      {athlete.checkinStats.currentStreak} dias
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Energia Média</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {athlete.checkinStats.avgEnergy}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Progresso Físico */}
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📏 Progresso Físico
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Peso Atual</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#3B82F6' }}>
                      {athlete.measurements.length > 0 ? `${athlete.measurements[0].weight} kg` : 'Não registrado'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Última Medição</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {athlete.measurements.length > 0 ? 
                        formatDate(athlete.measurements[0].date) : 
                        'Nenhuma'
                      }
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Total Medições</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {athlete.measurements.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacto Rápido */}
              <div style={{
                background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF3C7 100%)',
                border: '1px solid #FEF08A',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📞 Contacto Rápido
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiPhone style={{ color: '#CA8A04' }} />
                    <a 
                      href={`tel:${athlete.phone}`}
                      style={{ color: '#A16207', textDecoration: 'none', fontSize: '14px' }}
                    >
                      {athlete.phone}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiMail style={{ color: '#CA8A04' }} />
                    <a 
                      href={`mailto:${athlete.email}`}
                      style={{ color: '#A16207', textDecoration: 'none', fontSize: '14px' }}
                    >
                      {athlete.email}
                    </a>
                  </div>
                  <div style={{ 
                    marginTop: '8px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid #FEF08A',
                    fontSize: '12px',
                    color: '#7C2D12'
                  }}>
                    <FiAlertTriangle style={{ color: '#DC2626', marginRight: '6px' }} />
                    <strong>Emergência:</strong> {athlete.emergencyContact}
                  </div>
                </div>
              </div>
            </div>
          </SectionContent>
        )}

        {/* TAB MEASUREMENTS */}
        {activeTab === 'measurements' && (
          <SectionContent>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiArchive /> Registro de Pesagens
              </h4>
              <PrimaryButton onClick={() => setShowMeasurementModal(true)}>
                <FiPlus /> Nova Pesagem
              </PrimaryButton>
            </div>

            {athlete.measurements.length > 0 ? (
              athlete.measurements.map((measurement, index) => (
                <MeasurementEntry key={measurement.id}>
                  <MeasurementHeader>
                    <MeasurementDate>
                      <FiCalendar />
                      {formatDate(measurement.date)}
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
                        {Object.entries(measurement.bodyMeasurements).map(([key, value]) => {
                          const labels = {
                            waist: { icon: '⚖️', label: 'Cintura' },
                            hips: { icon: '🍑', label: 'Quadril' },
                            chest: { icon: '💪', label: 'Peito' },
                            thighs: { icon: '🦵', label: 'Coxa' },
                            arms: { icon: '💪', label: 'Braço' },
                            abdomen: { icon: '🤰', label: 'Abdômen' }
                          };
                          
                          const change = getMeasurementChange(
                            value,
                            measurement.previousMeasurements?.[key]
                          );
                          
                          return (
                            <MeasurementCard key={key}>
                              <MeasurementIcon>
                                {labels[key]?.icon || '📐'}
                              </MeasurementIcon>
                              <MeasurementLabel>
                                {labels[key]?.label || key}
                              </MeasurementLabel>
                              <MeasurementValue>{value} cm</MeasurementValue>
                              {change && (
                                <MeasurementChange positive={change.isPositive} negative={change.isNegative}>
                                  {change.isPositive ? '▼' : '▲'} {change.value} cm
                                </MeasurementChange>
                              )}
                            </MeasurementCard>
                          );
                        })}
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
                      {['front', 'side', 'back'].map(position => (
                        <PhotoCard key={position}>
                          {measurement.photos[position] ? (
                            <>
                              <img src={measurement.photos[position]} alt={position} />
                              <PhotoLabel>
                                {position === 'front' ? 'Frente' : 
                                 position === 'side' ? 'Lado' : 'Costas'}
                              </PhotoLabel>
                            </>
                          ) : (
                            <PhotoPlaceholder>
                              <FiCamera />
                              <span>
                                {position === 'front' ? 'Frente' : 
                                 position === 'side' ? 'Lado' : 'Costas'}
                              </span>
                            </PhotoPlaceholder>
                          )}
                        </PhotoCard>
                      ))}
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
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', color: '#CBD5E1', marginBottom: '16px' }}>
                  <FiArchive />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>
                  Nenhuma pesagem registrada
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
                  Comece registrando a primeira pesagem e medidas corporais deste atleta.
                </p>
                <PrimaryButton onClick={() => setShowMeasurementModal(true)}>
                  <FiPlus /> Primeira Pesagem
                </PrimaryButton>
              </div>
            )}
          </SectionContent>
        )}

        {/* TAB CHECK-INS */}
        {activeTab === 'checkins' && (
          <SectionContent>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiClipboard /> Check-ins Diários
              </h4>
              <PrimaryButton onClick={() => setShowCheckinModal(true)}>
                <FiPlus /> Novo Check-in
              </PrimaryButton>
            </div>

            {/* Stats Grid */}
            <StatsGrid>
              <StatCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <StatLabel>Check-ins Totais</StatLabel>
                    <StatValue>{athlete.checkinStats.totalCheckins}</StatValue>
                  </div>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#ECFDF5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#10B981', fontSize: '20px'
                  }}>
                    <FiCheckCircle />
                  </div>
                </div>
              </StatCard>
              
              <StatCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <StatLabel>Sequência Atual</StatLabel>
                    <StatValue>{athlete.checkinStats.currentStreak} dias</StatValue>
                  </div>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#FEF3C7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#F59E0B', fontSize: '20px'
                  }}>
                    <FiActivity />
                  </div>
                </div>
              </StatCard>

              <StatCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <StatLabel>Energia Média</StatLabel>
                    <StatValue style={{ color: getEnergyColor(athlete.checkinStats.avgEnergy) }}>
                      {athlete.checkinStats.avgEnergy}/10
                    </StatValue>
                  </div>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#EFF6FF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#3B82F6', fontSize: '20px'
                  }}>
                    <FiBattery />
                  </div>
                </div>
              </StatCard>

              <StatCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <StatLabel>Sono Médio</StatLabel>
                    <StatValue>{athlete.checkinStats.avgSleep}/10</StatValue>
                  </div>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: '#F3E8FF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#8B5CF6', fontSize: '20px'
                  }}>
                    <FiMoon />
                  </div>
                </div>
              </StatCard>
            </StatsGrid>

            {/* Recent Check-ins */}
            {athlete.recentCheckins && athlete.recentCheckins.length > 0 && (
              <div>
                <h4 style={{ margin: '24px 0 16px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                  Check-ins Recentes
                </h4>
                {athlete.recentCheckins.map(checkin => (
                  <CheckinCard key={checkin.id}>
                    <CheckinHeader>
                      <CheckinDate>{formatDate(checkin.date)}</CheckinDate>
                      <CheckinStatus completed={true}>
                        ✅ Concluído
                      </CheckinStatus>
                    </CheckinHeader>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {getMoodIcon(checkin.mood)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Humor</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: getEnergyColor(checkin.energy), marginBottom: '4px' }}>
                          {checkin.energy}/10
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Energia</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                          {checkin.sleep}/10
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Sono</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                          {checkin.motivation}/10
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Motivação</div>
                      </div>
                    </div>
                    
                    {checkin.notes && (
                      <div style={{ 
                        padding: '8px 12px', 
                        background: '#F8FAFC', 
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#374151',
                        fontStyle: 'italic'
                      }}>
                        "{checkin.notes}"
                      </div>
                    )}
                  </CheckinCard>
                ))}
              </div>
            )}
          </SectionContent>
        )}

        {/* TAB OBSERVATIONS */}
        {activeTab === 'notes' && (
          <SectionContent>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiFileText /> Observações
              </h4>
              <PrimaryButton onClick={() => setShowObservationModal(true)}>
                <FiPlus /> Nova Observação
              </PrimaryButton>
            </div>

            {observations.length > 0 ? (
              observations.map(observation => (
                <ObservationCard key={observation.id}>
                  <ObservationHeader>
                    <div>
                      <ObservationTitle>{observation.title}</ObservationTitle>
                      <ObservationMeta>
                        <span>{formatDate(observation.date)}</span>
                        <span>•</span>
                        <span>{observation.createdBy}</span>
                        <TypeBadge type={observation.type}>
                          {observation.type === 'training' ? 'Treino' :
                           observation.type === 'health' ? 'Saúde' :
                           observation.type === 'nutrition' ? 'Nutrição' : 'Geral'}
                        </TypeBadge>
                      </ObservationMeta>
                    </div>
                    <PriorityBadge priority={observation.priority}>
                      {observation.priority === 'high' ? 'Alta' :
                       observation.priority === 'medium' ? 'Média' : 'Normal'}
                    </PriorityBadge>
                  </ObservationHeader>
                  <ObservationContent>{observation.content}</ObservationContent>
                </ObservationCard>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', color: '#CBD5E1', marginBottom: '16px' }}>
                  <FiFileText />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>
                  Nenhuma observação registrada
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
                  Adicione observações importantes sobre este atleta.
                </p>
                <PrimaryButton onClick={() => setShowObservationModal(true)}>
                  <FiPlus /> Primeira Observação
                </PrimaryButton>
              </div>
            )}
          </SectionContent>
        )}

        {/* Outros tabs placeholder */}
        {(activeTab === 'info' || activeTab === 'workouts') && (
          <SectionContent>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', color: '#CBD5E1', marginBottom: '16px' }}>
                {activeTab === 'info' ? <FiInfo /> : <FiActivity />}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>
                {activeTab === 'info' ? 'Informações Detalhadas' : 'Gestão de Treinos'}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0' }}>
                {activeTab === 'info' 
                  ? 'Esta funcionalidade será implementada em breve.'
                  : 'A gestão de treinos será implementada em breve.'
                }
              </p>
            </div>
          </SectionContent>
        )}
      </Section>

      {/* MODAIS */}
      
      {/* Modal de Check-in */}
      {showCheckinModal && (
        <ModalOverlay onClick={() => setShowCheckinModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Novo Check-in Diário</ModalTitle>
              <CloseButton onClick={() => setShowCheckinModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Como está seu humor hoje?</Label>
              <MoodSelector>
                {[
                  { value: 'happy', icon: '😊', label: 'Feliz' },
                  { value: 'neutral', icon: '😐', label: 'Neutro' },
                  { value: 'sad', icon: '😔', label: 'Triste' }
                ].map(mood => (
                  <MoodOption
                    key={mood.value}
                    selected={newCheckin.mood === mood.value}
                    onClick={() => setNewCheckin(prev => ({ ...prev, mood: mood.value }))}
                  >
                    <span style={{ fontSize: '24px' }}>{mood.icon}</span>
                    <span style={{ fontSize: '12px' }}>{mood.label}</span>
                  </MoodOption>
                ))}
              </MoodSelector>
            </FormGroup>

            <FormGroup>
              <Label>Nível de Energia (1-10)</Label>
              <ScaleInput
                type="range"
                min="1"
                max="10"
                value={newCheckin.energy}
                onChange={e => setNewCheckin(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
              />
              <ScaleValue style={{ color: getEnergyColor(newCheckin.energy) }}>
                {newCheckin.energy}/10
              </ScaleValue>
            </FormGroup>

            <FormGroup>
              <Label>Qualidade do Sono (1-10)</Label>
              <ScaleInput
                type="range"
                min="1"
                max="10"
                value={newCheckin.sleep}
                onChange={e => setNewCheckin(prev => ({ ...prev, sleep: parseInt(e.target.value) }))}
              />
              <ScaleValue>{newCheckin.sleep}/10</ScaleValue>
            </FormGroup>

            <FormGroup>
              <Label>Nível de Motivação (1-10)</Label>
              <ScaleInput
                type="range"
                min="1"
                max="10"
                value={newCheckin.motivation}
                onChange={e => setNewCheckin(prev => ({ ...prev, motivation: parseInt(e.target.value) }))}
              />
              <ScaleValue>{newCheckin.motivation}/10</ScaleValue>
            </FormGroup>

            <FormGroup>
              <Label>Observações (opcional)</Label>
              <TextArea
                placeholder="Como foi seu dia? Algo importante para relatar..."
                value={newCheckin.notes}
                onChange={e => setNewCheckin(prev => ({ ...prev, notes: e.target.value }))}
              />
            </FormGroup>

            <ButtonGroup>
              <SecondaryButton onClick={() => setShowCheckinModal(false)}>
                <FiX /> Cancelar
              </SecondaryButton>
              <PrimaryButton onClick={handleSaveCheckin}>
                <FiSave /> Salvar Check-in
              </PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Observação */}
      {showObservationModal && (
        <ModalOverlay onClick={() => setShowObservationModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Nova Observação</ModalTitle>
              <CloseButton onClick={() => setShowObservationModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Tipo de Observação</Label>
              <Select
                value={newObservation.type}
                onChange={e => setNewObservation(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="general">Geral</option>
                <option value="training">Treino</option>
                <option value="health">Saúde</option>
                <option value="nutrition">Nutrição</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Prioridade</Label>
              <Select
                value={newObservation.priority}
                onChange={e => setNewObservation(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="normal">Normal</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Título</Label>
              <Input
                placeholder="Ex: Evolução no agachamento, Dor no joelho..."
                value={newObservation.title}
                onChange={e => setNewObservation(prev => ({ ...prev, title: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Descrição</Label>
              <TextArea
                placeholder="Descreva a observação em detalhes..."
                value={newObservation.content}
                onChange={e => setNewObservation(prev => ({ ...prev, content: e.target.value }))}
                style={{ minHeight: '100px' }}
              />
            </FormGroup>

            <ButtonGroup>
              <SecondaryButton onClick={() => setShowObservationModal(false)}>
                <FiX /> Cancelar
              </SecondaryButton>
              <PrimaryButton 
                onClick={handleSaveObservation}
                disabled={!newObservation.title || !newObservation.content}
              >
                <FiSave /> Salvar Observação
              </PrimaryButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Medição (placeholder) */}
      {showMeasurementModal && (
        <ModalOverlay onClick={() => setShowMeasurementModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Nova Pesagem</ModalTitle>
              <CloseButton onClick={() => setShowMeasurementModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', color: '#CBD5E1', marginBottom: '16px' }}>
                <FiArchive />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>
                Formulário de Pesagem
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>
                Este formulário será implementado em breve com campos para peso, medidas corporais e fotos.
              </p>
              <SecondaryButton onClick={() => setShowMeasurementModal(false)}>
                <FiX /> Fechar
              </SecondaryButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* CSS para animações */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .desktop-grid {
            grid-template-columns: 1fr !important;
          }
          
          .mobile-stack {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .mobile-center {
            text-align: center !important;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default AthleteDetail;