import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiCalendar, FiClock, FiChevronLeft, FiChevronRight, 
  FiUser, FiMapPin, FiActivity, FiPhone, FiPlus,
  FiEdit2, FiArrowLeft, FiLink, FiHome, FiFilter
} from 'react-icons/fi';
import { fetchProtectedData } from '../../services/authService';
// import api from '../../services/api';

// Componentes estilizados com tamanhos fixos para evitar overflow
const CalendarContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
  height: ${props => props.fullHeight ? 'calc(100vh - 250px)' : '600px'};
  display: flex;
  flex-direction: column;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #E2E8F0;
`;

const CalendarTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CalendarDateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CalendarDate = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #1E293B;
  min-width: 150px;
  text-align: center;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #64748B;
  cursor: pointer;
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 16px;
`;

const ViewButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => props.active ? '#10B981' : '#F8FAFC'};
  color: ${props => props.active ? 'white' : '#64748B'};
  border: 1px solid ${props => props.active ? 'transparent' : '#E2E8F0'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#0D9668' : '#F1F5F9'};
  }
`;

const CalendarToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
`;

const ToolbarButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => props.primary ? '#10B981' : 'white'};
  color: ${props => props.primary ? 'white' : '#64748B'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#E2E8F0'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: ${props => props.primary ? '#0D9668' : '#F1F5F9'};
    color: ${props => props.primary ? 'white' : '#1E293B'};
  }
`;

const ToolbarButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// Componente de filtro para atletas
const AthleteFilter = styled.div`
  position: relative;
  min-width: 180px;
`;

const AthleteSelect = styled.select`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  border: 1px solid #E2E8F0;
  color: #64748B;
  cursor: pointer;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

// Componentes da visualização mensal
const MonthViewContainer = styled.div`
  padding: 12px;
  overflow-y: auto;
  flex: 1;
`;

const WeekDaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  padding: 6px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(80px, auto);
  gap: 1px;
  background: #E2E8F0;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  height: auto;
`;

const DayCell = styled.div`
  background: white;
  min-height: 80px;
  padding: 6px;
  position: relative;
  
  ${props => props.isToday && `
    background: #F0FDF4;
    font-weight: 600;
  `}
  
  ${props => props.isOtherMonth && `
    background: #F8FAFC;
    color: #94A3B8;
  `}
  
  &:hover {
    .day-actions {
      opacity: 1;
    }
  }
`;

const DayNumber = styled.div`
  font-size: 13px;
  font-weight: ${props => props.isToday ? '600' : '400'};
  color: ${props => props.isToday ? '#10B981' : '#1E293B'};
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${props => props.isOtherMonth && `
    color: #94A3B8;
  `}
`;

const DayActions = styled.div`
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const DayActionButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #E2E8F0;
  color: #64748B;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  
  &:hover {
    background: #CBD5E1;
    color: #1E293B;
  }
`;

const TodayMarker = styled.span`
  display: inline-block;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  background: #10B981;
  color: white;
  border-radius: 50%;
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
`;

const Session = styled.div`
  padding: 3px 5px;
  border-radius: 4px;
  font-size: 11px;
  background: ${props => props.color || '#3B82F6'};
  color: white;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const MoreSessions = styled.div`
  font-size: 10px;
  color: #64748B;
  margin-top: 2px;
  text-align: center;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Componentes da visualização semanal
const WeekViewContainer = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  flex: 1;
  overflow-y: auto;
`;

const TimeColumn = styled.div`
  border-right: 1px solid #E2E8F0;
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
`;

const TimeSlot = styled.div`
  height: 50px;
  padding: 6px;
  text-align: center;
  font-size: 11px;
  color: #64748B;
  border-bottom: 1px solid #E2E8F0;
`;

const DayColumn = styled.div`
  border-right: 1px solid #E2E8F0;
  
  &:last-child {
    border-right: none;
  }
`;

const DayHeader = styled.div`
  padding: 8px 6px;
  text-align: center;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DayName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
`;

const DayDate = styled.div`
  font-size: 14px;
  font-weight: ${props => props.isToday ? '600' : '400'};
  color: #1E293B;
  margin-top: 2px;
`;

const DayHeaderActions = styled.div`
  display: flex;
  margin-top: 4px;
  gap: 4px;
`;

const TimeCell = styled.div`
  position: relative;
  height: 50px;
  border-bottom: 1px solid #E2E8F0;
  background: ${props => props.isNow ? '#F0FDF4' : 'white'};
  
  &:hover {
    background: #F8FAFC;
    
    .cell-action {
      opacity: 1;
    }
  }
`;

const CellAction = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #E2E8F0;
  color: #64748B;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 5;
  
  &:hover {
    background: #CBD5E1;
    color: #1E293B;
  }
`;

const SessionEvent = styled.div`
  position: absolute;
  left: 2px;
  right: 2px;
  padding: 4px 6px;
  border-radius: 4px;
  background: ${props => props.color || '#3B82F6'};
  color: white;
  font-size: 11px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 2;
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

const SessionTitle = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SessionTime = styled.div`
  font-size: 10px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const SessionClient = styled.div`
  font-size: 10px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
`;

const SessionActionButtons = styled.div`
  display: none;
  
  ${SessionEvent}:hover & {
    display: flex;
    gap: 3px;
  }
`;

const SessionActionButton = styled.button`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 3px;
  cursor: pointer;
  font-size: 9px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CurrentTimeIndicator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px solid #EF4444;
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    width: 6px;
    height: 6px;
    background: #EF4444;
    border-radius: 50%;
  }
`;

const BackButton = styled(ToolbarButton)`
  margin-right: auto;
`;

const PlanningButton = styled(ToolbarButton)`
  margin-left: 8px;
`;

// Componente do calendário
const Calendar = ({ 
  onSessionClick, 
  onAddSession, 
  onEditSession, 
  onBackClick, 
  onDashboardClick,
  fullHeight = false 
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState('month'); // 'month' ou 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weekDays, setWeekDays] = useState([]);
  const [athleteFilter, setAthleteFilter] = useState('all');
  const [athletes, setAthletes] = useState([]);
  
  // Buscar sessões do servidor
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // const response = await api.get('/api/sessions');
        // setSessions(response.data);
        
        // Dados de exemplo para desenvolvimento
        const exampleSessions = [
          {
            id: 1,
            title: 'Personal Training - Alex',
            client: 'Alex Johnson',
            start: new Date(currentYear, currentMonth, 15, 9, 0),
            end: new Date(currentYear, currentMonth, 15, 10, 0),
            color: '#3B82F6',
            location: 'Main Gym',
            type: 'personal',
            workoutPlanId: 2 // ID do plano associado
          },
          {
            id: 2,
            title: 'Group Class - HIIT',
            client: 'Multiple',
            start: new Date(currentYear, currentMonth, 15, 17, 0),
            end: new Date(currentYear, currentMonth, 15, 18, 0),
            color: '#10B981',
            location: 'Studio 2',
            type: 'group',
            workoutPlanId: 5
          },
          {
            id: 3,
            title: 'Nutrition Consultation',
            client: 'Sarah Miller',
            start: new Date(currentYear, currentMonth, 17, 14, 0),
            end: new Date(currentYear, currentMonth, 17, 15, 0),
            color: '#F59E0B',
            location: 'Office',
            type: 'consultation'
          },
          {
            id: 4,
            title: 'Personal Training - Mark',
            client: 'Mark Wilson',
            start: new Date(currentYear, currentMonth, 18, 8, 0),
            end: new Date(currentYear, currentMonth, 18, 9, 0),
            color: '#3B82F6',
            location: 'Main Gym',
            type: 'personal',
            workoutPlanId: 1
          },
          {
            id: 5,
            title: 'Group Class - Yoga',
            client: 'Multiple',
            start: new Date(currentYear, currentMonth, 20, 18, 0),
            end: new Date(currentYear, currentMonth, 20, 19, 0),
            color: '#8B5CF6',
            location: 'Studio 1',
            type: 'group',
            workoutPlanId: 3
          }
        ];
        
        // Adicionar mais dados de exemplo para testar o layout
        for (let i = 6; i <= 15; i++) {
          if (Math.random() > 0.7) {
            const hour = 8 + Math.floor(Math.random() * 12);
            const clients = ['Alex Johnson', 'Mark Wilson', 'Sarah Miller', 'Jane Doe', 'John Smith', 'Multiple'];
            const clientName = clients[Math.floor(Math.random() * clients.length)];
            
            exampleSessions.push({
              id: 100 + i,
              title: `Session #${i}`,
              client: clientName,
              start: new Date(currentYear, currentMonth, i, hour, 0),
              end: new Date(currentYear, currentMonth, i, hour + 1, 0),
              color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 5)],
              location: 'Main Gym',
              type: 'personal',
              workoutPlanId: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null
            });
          }
        }
        
        setSessions(exampleSessions);
        
        // Extrair lista única de atletas para o filtro
        const uniqueAthletes = [...new Set(exampleSessions.map(session => session.client))];
        setAthletes(uniqueAthletes);
        
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [currentMonth, currentYear]);
  
  // Filtrar sessões quando o filtro de atleta muda
  useEffect(() => {
    if (athleteFilter === 'all') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session => session.client === athleteFilter);
      setFilteredSessions(filtered);
    }
  }, [sessions, athleteFilter]);
  
  // Atualizar dias da semana quando currentDate mudar
  useEffect(() => {
    if (view === 'week') {
      const currentDay = currentDate.getDay(); // 0-6 (Domingo-Sábado)
      
      // Calcular o primeiro dia da semana (Domingo)
      const firstDayOfWeek = new Date(currentDate);
      firstDayOfWeek.setDate(currentDate.getDate() - currentDay);
      
      // Criar os 7 dias da semana
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        days.push(date);
      }
      
      setWeekDays(days);
    }
  }, [currentDate, view]);
  
  // Navegar para o mês/semana anterior
  const handlePrevious = () => {
    if (view === 'month') {
      const newDate = new Date(currentYear, currentMonth - 1, 1);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };
  
  // Navegar para o mês/semana seguinte
  const handleNext = () => {
    if (view === 'month') {
      const newDate = new Date(currentYear, currentMonth + 1, 1);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };
  
  // Navegar para hoje
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };
  
  // Alternar entre visualizações de mês e semana
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  // Adicionar uma nova sessão em uma data/hora específica
  const handleAddSessionAtTime = (date, hour) => {
    // Criar data para o início da sessão
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    
    // Criar data para o fim da sessão (1 hora depois)
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    
    // Chamar a função de adicionar sessão passada pelo componente pai
    if (onAddSession) {
      onAddSession(startTime, endTime);
    }
  };
  
  // Ir para o plano de treino associado à sessão
  const goToWorkoutPlan = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.workoutPlanId) {
      navigate(`/workouts/${session.workoutPlanId}`);
    }
  };
  
  // Alterar o filtro de atleta
  const handleAthleteFilterChange = (e) => {
    setAthleteFilter(e.target.value);
  };
  
  // Formatação de data para exibição
  const formatDate = (date, format = 'long') => {
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } else if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else if (format === 'weekday') {
      return date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
    }
  };
  
  // Renderizar os dias da visualização mensal
  const renderMonthView = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Determinar o primeiro dia a ser exibido (pode ser do mês anterior)
    const firstDayOfGrid = new Date(firstDayOfMonth);
    const dayOfWeek = firstDayOfMonth.getDay();
    firstDayOfGrid.setDate(firstDayOfMonth.getDate() - dayOfWeek);
    
    // Criar grid de 6 semanas (42 dias)
    const days = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfGrid);
      date.setDate(firstDayOfGrid.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const isOtherMonth = month !== currentMonth;
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      // Filtrar sessões para este dia (usando filteredSessions em vez de sessions)
      const daySessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.start);
        return (
          sessionDate.getDate() === day &&
          sessionDate.getMonth() === month &&
          sessionDate.getFullYear() === year
        );
      });
      
      // Ordenar sessões por hora de início
      daySessions.sort((a, b) => a.start - b.start);
      
      // Limitar visualização a 2 sessões por dia (com contador +X para o restante)
      const visibleSessions = daySessions.slice(0, 2);
      const hiddenCount = daySessions.length - visibleSessions.length;
      
      days.push(
        <DayCell 
          key={i} 
          isOtherMonth={isOtherMonth}
          isToday={isToday}
        >
          <DayNumber isToday={isToday} isOtherMonth={isOtherMonth}>
            {isToday ? <TodayMarker>{day}</TodayMarker> : day}
            <DayActions className="day-actions">
              <DayActionButton 
                onClick={() => handleAddSessionAtTime(date, 9)} 
                title="Add Session"
              >
                <FiPlus />
              </DayActionButton>
            </DayActions>
          </DayNumber>
          
          <SessionsList>
            {visibleSessions.map(session => (
              <Session 
                key={session.id}
                color={session.color}
                onClick={() => onSessionClick(session)}
                title={`${session.title} - ${session.client}`}
              >
                <FiClock size={8} />
                {session.start.getHours()}:{String(session.start.getMinutes()).padStart(2, '0')} 
                {session.title}
                {session.workoutPlanId && <FiLink size={8} style={{ marginLeft: 'auto' }} />}
              </Session>
            ))}
            
            {hiddenCount > 0 && (
              <MoreSessions onClick={() => console.log('Show more')}>
                +{hiddenCount} more
              </MoreSessions>
            )}
          </SessionsList>
        </DayCell>
      );
    }
    
    return (
      <MonthViewContainer>
        <WeekDaysHeader>
          <WeekDay>Sun</WeekDay>
          <WeekDay>Mon</WeekDay>
          <WeekDay>Tue</WeekDay>
          <WeekDay>Wed</WeekDay>
          <WeekDay>Thu</WeekDay>
          <WeekDay>Fri</WeekDay>
          <WeekDay>Sat</WeekDay>
        </WeekDaysHeader>
        <MonthGrid>
          {days}
        </MonthGrid>
      </MonthViewContainer>
    );
  };
  
  // Renderizar a visualização semanal
  const renderWeekView = () => {
    const today = new Date();
    
    // Horas para visualização (8:00 - 18:00) - menos horas para tela menor
    const hours = [];
    for (let i = 8; i < 19; i++) {
      hours.push(`${i}:00`);
    }
    
    // Hora atual para indicador
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isToday = (date) => {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };
    
    return (
      <WeekViewContainer>
        <TimeColumn>
          {hours.map((hour, index) => (
            <TimeSlot key={index}>{hour}</TimeSlot>
          ))}
        </TimeColumn>
        
        {weekDays.map((date, dayIndex) => (
          <DayColumn key={dayIndex}>
            <DayHeader>
              <DayName>{formatDate(date, 'weekday')}</DayName>
              <DayDate isToday={isToday(date)}>
                {isToday(date) ? <TodayMarker>{date.getDate()}</TodayMarker> : date.getDate()}
              </DayDate>
              <DayHeaderActions>
                <DayActionButton 
                  onClick={() => handleAddSessionAtTime(date, 9)} 
                  title="Add Session"
                >
                  <FiPlus />
                </DayActionButton>
              </DayHeaderActions>
            </DayHeader>
            
            {hours.map((hour, hourIndex) => {
              const timeHour = parseInt(hour.split(':')[0]);
              const isNowHour = isToday(date) && currentHour === timeHour;
              
              // Filtrar sessões para este dia e hora (usando filteredSessions)
              const hourSessions = filteredSessions.filter(session => {
                const sessionDate = new Date(session.start);
                return (
                  sessionDate.getDate() === date.getDate() &&
                  sessionDate.getMonth() === date.getMonth() &&
                  sessionDate.getFullYear() === date.getFullYear() &&
                  sessionDate.getHours() === timeHour
                );
              });
              
              return (
                <TimeCell key={hourIndex} isNow={isNowHour}>
                  <CellAction 
                    className="cell-action" 
                    onClick={() => handleAddSessionAtTime(date, timeHour)}
                    title="Add Session"
                  >
                    <FiPlus />
                  </CellAction>
                  
                  {isNowHour && (
                    <CurrentTimeIndicator
                      style={{ top: `${Math.floor((currentMinute / 60) * 100)}%` }}
                    />
                  )}
                  
                  {hourSessions.map(session => {
                    const startHour = session.start.getHours();
                    const startMinute = session.start.getMinutes();
                    const endHour = session.end.getHours();
                    const endMinute = session.end.getMinutes();
                    
                    // Calcular posição e altura
                    const top = startMinute / 60 * 100;
                    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60;
                    const height = duration * 100;
                    
                    return (
                      <SessionEvent
                        key={session.id}
                        color={session.color}
                        style={{
                          top: `${top}%`,
                          height: `${height}%`
                        }}
                        onClick={() => onSessionClick(session)}
                      >
                        <SessionTitle>
                          {session.title}
                          <SessionActionButtons>
                            <SessionActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEditSession) onEditSession(session);
                              }}
                              title="Edit Session"
                            >
                              <FiEdit2 />
                            </SessionActionButton>
                            
                            {session.workoutPlanId && (
                              <SessionActionButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToWorkoutPlan(session.id);
                                }}
                                title="View Workout Plan"
                              >
                                <FiLink />
                              </SessionActionButton>
                            )}
                          </SessionActionButtons>
                        </SessionTitle>
                        
                        <SessionTime>
                          <FiClock size={10} />
                          {startHour}:{String(startMinute).padStart(2, '0')} - 
                          {endHour}:{String(endMinute).padStart(2, '0')}
                        </SessionTime>
                        
                        <SessionClient>
                          <FiUser size={10} />
                          {session.client}
                        </SessionClient>
                      </SessionEvent>
                    );
                  })}
                </TimeCell>
              );
            })}
          </DayColumn>
        ))}
      </WeekViewContainer>
    );
  };
  
  return (
    <CalendarContainer fullHeight={fullHeight}>
      <CalendarHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTitle>
            <FiCalendar /> Calendar
          </CalendarTitle>
          
          <ViewSelector>
            <ViewButton 
              active={view === 'month'} 
              onClick={() => handleViewChange('month')}
            >
              Month
            </ViewButton>
            <ViewButton 
              active={view === 'week'} 
              onClick={() => handleViewChange('week')}
            >
              Week
            </ViewButton>
          </ViewSelector>
        </div>
        
        <CalendarDateNavigation>
          <NavButton onClick={handlePrevious}>
            <FiChevronLeft />
          </NavButton>
          
          <CalendarDate>
            {view === 'month' 
              ? formatDate(new Date(currentYear, currentMonth, 1)) 
              : weekDays.length > 0 
                ? `${formatDate(weekDays[0], 'short')} - ${formatDate(weekDays[6], 'short')}`
                : ''
            }
          </CalendarDate>
          
          <NavButton onClick={handleNext}>
            <FiChevronRight />
          </NavButton>
        </CalendarDateNavigation>
      </CalendarHeader>
      
      <CalendarToolbar>
        <ToolbarButtonGroup>
          {onBackClick && (
            <BackButton onClick={onBackClick}>
              <FiArrowLeft /> Back
            </BackButton>
          )}
          
          {onDashboardClick && (
            <BackButton onClick={onDashboardClick}>
              <FiHome /> Dashboard
            </BackButton>
          )}
          
          <ToolbarButton onClick={handleToday}>
            Today
          </ToolbarButton>
          
          <ToolbarButton 
            primary
            onClick={() => {
              const now = new Date();
              if (onAddSession) onAddSession(now, new Date(now.getTime() + 60 * 60 * 1000));
            }}
          >
            <FiPlus /> Add Session
          </ToolbarButton>
        </ToolbarButtonGroup>
        
        <ToolbarButtonGroup>
          <AthleteFilter>
            <AthleteSelect
              value={athleteFilter}
              onChange={handleAthleteFilterChange}
            >
              <option value="all">All Athletes</option>
              {athletes.map((athlete, index) => (
                <option key={index} value={athlete}>
                  {athlete}
                </option>
              ))}
            </AthleteSelect>
          </AthleteFilter>
          
          <PlanningButton 
            onClick={() => navigate('/workouts')}
            title="Go to Workout Plans"
          >
            <FiActivity /> Workout Plans
          </PlanningButton>
        </ToolbarButtonGroup>
      </CalendarToolbar>
      
      {view === 'month' ? renderMonthView() : renderWeekView()}
    </CalendarContainer>
  );
};

export default Calendar;