// src/pages/AthleteApp/AthleteCheckin.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchProtectedData } from '../../services/authService';
import { 
  FiSmile, FiMeh, FiFrown, FiBattery, FiMoon, 
  FiHeart, FiSave, FiCheck, FiCalendar, FiTrendingUp
} from 'react-icons/fi';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Greeting = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #64748B;
`;

const StreakBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ECFDF5;
  color: #10B981;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  
  svg {
    font-size: 16px;
  }
`;

const CheckinForm = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #10B981;
  }
`;

const MoodSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MoodButton = styled.button`
  padding: 20px;
  border: 2px solid ${props => props.selected ? '#10B981' : '#E2E8F0'};
  border-radius: 12px;
  background: ${props => props.selected ? '#F0FDF4' : 'white'};
  color: ${props => props.selected ? '#10B981' : '#64748B'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10B981;
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 32px;
  }
  
  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const SliderContainer = styled.div`
  background: #F8FAFC;
  border-radius: 8px;
  padding: 20px;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SliderLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #64748B;
  }
`;

const SliderValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #10B981;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: #E2E8F0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10B981;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10B981;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const SliderMarks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 10px;
`;

const SliderMark = styled.span`
  font-size: 11px;
  color: #94A3B8;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: #94A3B8;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #CBD5E1;
    cursor: not-allowed;
    transform: none;
  }
`;

const RecentCheckins = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const CheckinHistory = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`;

const CheckinCard = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const CheckinDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #64748B;
  }
`;

const CheckinStats = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  
  @media (max-width: 640px) {
    justify-content: space-around;
  }
`;

const CheckinStat = styled.div`
  text-align: center;
  
  .label {
    font-size: 11px;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 600;
    color: #1E293B;
    margin-top: 2px;
  }
`;

const CheckinMood = styled.div`
  font-size: 32px;
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10B981;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  z-index: 1000;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Componente Principal
const AthleteCheckin = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [todayChecked, setTodayChecked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);
  
  const [checkinData, setCheckinData] = useState({
    mood: '',
    energy: 5,
    sleep: 7,
    notes: ''
  });
  
  const [recentCheckins, setRecentCheckins] = useState([
    {
      date: '2024-03-14',
      mood: 'happy',
      energy: 8,
      sleep: 7
    },
    {
      date: '2024-03-13',
      mood: 'neutral',
      energy: 6,
      sleep: 5
    },
    {
      date: '2024-03-12',
      mood: 'happy',
      energy: 9,
      sleep: 8
    }
  ]);
  
  // Verificar se já fez check-in hoje
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const hasCheckedToday = recentCheckins.some(checkin => checkin.date === today);
    setTodayChecked(hasCheckedToday);
  }, [recentCheckins]);
  
  const handleMoodSelect = (mood) => {
    setCheckinData({ ...checkinData, mood });
  };
  
  const handleSubmit = async () => {
    if (!checkinData.mood) {
      alert('Por favor, selecione como está se sentindo hoje.');
      return;
    }
    
    try {
      // Aqui você faria a chamada para a API
      // await api.post('/athlete/checkins', checkinData);
      
      // Simular salvamento
      const newCheckin = {
        ...checkinData,
        date: new Date().toISOString().split('T')[0]
      };
      
      setRecentCheckins([newCheckin, ...recentCheckins]);
      setShowSuccess(true);
      setTodayChecked(true);
      setCurrentStreak(currentStreak + 1);
      
      // Limpar formulário
      setCheckinData({
        mood: '',
        energy: 5,
        sleep: 7,
        notes: ''
      });
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao salvar check-in:', error);
      alert('Erro ao salvar check-in. Tente novamente.');
    }
  };
  
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😐';
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  
  return (
    <Container>
      <Header>
        <Greeting>{getGreeting()}, Maria! 👋</Greeting>
        <Subtitle>
          {todayChecked ? 
            'Você já fez seu check-in hoje! Continue assim! 💪' : 
            'Como você está se sentindo hoje?'
          }
        </Subtitle>
        {currentStreak > 0 && (
          <StreakBadge>
            <FiTrendingUp />
            {currentStreak} dias de sequência!
          </StreakBadge>
        )}
      </Header>
      
      {!todayChecked && (
        <CheckinForm>
          <FormSection>
            <SectionTitle>
              <FiHeart />
              Como está seu humor hoje?
            </SectionTitle>
            <MoodSelector>
              <MoodButton 
                selected={checkinData.mood === 'happy'}
                onClick={() => handleMoodSelect('happy')}
              >
                <FiSmile />
                <span>Bem</span>
              </MoodButton>
              <MoodButton 
                selected={checkinData.mood === 'neutral'}
                onClick={() => handleMoodSelect('neutral')}
              >
                <FiMeh />
                <span>Normal</span>
              </MoodButton>
              <MoodButton 
                selected={checkinData.mood === 'sad'}
                onClick={() => handleMoodSelect('sad')}
              >
                <FiFrown />
                <span>Mal</span>
              </MoodButton>
            </MoodSelector>
          </FormSection>
          
          <FormSection>
            <SectionTitle>
              <FiBattery />
              Nível de Energia
            </SectionTitle>
            <SliderContainer>
              <SliderHeader>
                <SliderLabel>
                  <FiBattery />
                  Como está sua energia?
                </SliderLabel>
                <SliderValue>{checkinData.energy}/10</SliderValue>
              </SliderHeader>
              <Slider
                type="range"
                min="1"
                max="10"
                value={checkinData.energy}
                onChange={(e) => setCheckinData({ ...checkinData, energy: parseInt(e.target.value) })}
              />
              <SliderMarks>
                <SliderMark>Baixa</SliderMark>
                <SliderMark>Média</SliderMark>
                <SliderMark>Alta</SliderMark>
              </SliderMarks>
            </SliderContainer>
          </FormSection>
          
          <FormSection>
            <SectionTitle>
              <FiMoon />
              Qualidade do Sono
            </SectionTitle>
            <SliderContainer>
              <SliderHeader>
                <SliderLabel>
                  <FiMoon />
                  Como foi seu sono?
                </SliderLabel>
                <SliderValue>{checkinData.sleep}/10</SliderValue>
              </SliderHeader>
              <Slider
                type="range"
                min="1"
                max="10"
                value={checkinData.sleep}
                onChange={(e) => setCheckinData({ ...checkinData, sleep: parseInt(e.target.value) })}
              />
              <SliderMarks>
                <SliderMark>Ruim</SliderMark>
                <SliderMark>Regular</SliderMark>
                <SliderMark>Ótimo</SliderMark>
              </SliderMarks>
            </SliderContainer>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Observações (opcional)</SectionTitle>
            <NotesTextarea
              placeholder="Como foi seu dia? Alguma observação sobre treino, alimentação ou bem-estar..."
              value={checkinData.notes}
              onChange={(e) => setCheckinData({ ...checkinData, notes: e.target.value })}
            />
          </FormSection>
          
          <SubmitButton onClick={handleSubmit}>
            <FiSave />
            Salvar Check-in de Hoje
          </SubmitButton>
        </CheckinForm>
      )}
      
      <RecentCheckins>
        <SectionTitle>
          <FiCalendar />
          Check-ins Recentes
        </SectionTitle>
        
        <CheckinHistory>
          {recentCheckins.slice(0, 3).map((checkin, index) => (
            <CheckinCard key={index}>
              <CheckinDate>
                <FiCalendar />
                {new Date(checkin.date).toLocaleDateString('pt-BR', { 
                  weekday: 'short', 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </CheckinDate>
              
              <CheckinStats>
                <CheckinStat>
                  <div className="label">Energia</div>
                  <div className="value">{checkin.energy}/10</div>
                </CheckinStat>
                <CheckinStat>
                  <div className="label">Sono</div>
                  <div className="value">{checkin.sleep}/10</div>
                </CheckinStat>
              </CheckinStats>
              
              <CheckinMood>{getMoodEmoji(checkin.mood)}</CheckinMood>
            </CheckinCard>
          ))}
        </CheckinHistory>
      </RecentCheckins>
      
      {showSuccess && (
        <SuccessMessage>
          <FiCheck />
          Check-in salvo com sucesso!
        </SuccessMessage>
      )}
    </Container>
  );
};

export default AthleteCheckin;