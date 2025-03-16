import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiChevronLeft, FiClock, FiPlay, FiPause, FiSkipForward, 
  FiCheckCircle, FiX, FiFlag, FiRefreshCw, FiSave, 
  FiActivity, FiHelpCircle, FiAlertCircle, FiChevronDown,
  FiChevronUp, FiPlus, FiMinus, FiList
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

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const WorkoutInfoCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkoutTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 4px;
`;

const WorkoutMeta = styled.div`
  color: #64748B;
  font-size: 14px;
`;

const TimerCard = styled.div`
  background: linear-gradient(to right, #10B981, #059669);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimerDisplay = styled.div`
  font-size: 36px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  
  span {
    opacity: 0.7;
  }
`;

const TimerControls = styled.div`
  display: flex;
  gap: 16px;
`;

const TimerButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ExerciseList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const ExerciseListHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExerciseListTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExerciseListContent = styled.div`
  /* Altura com scroll quando necessário */
  max-height: 600px;
  overflow-y: auto;
`;

const ExerciseItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #F1F5F9;
  position: relative;
  background: ${props => props.active ? '#F8FAFC' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.expanded ? '12px' : '0'};
`;

const ExerciseTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExerciseIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? '#10B981' : '#F1F5F9'};
  color: ${props => props.active ? 'white' : '#64748B'};
  font-size: 12px;
  font-weight: 600;
  margin-right: 4px;
`;

const ExerciseToggle = styled.button`
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
`;

const ExerciseDetails = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
  font-size: 14px;
  display: ${props => props.expanded ? 'block' : 'none'};
`;

const ExerciseMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const ExerciseMetaItem = styled.div`
  font-size: 14px;
  color: #64748B;
  
  span {
    font-weight: 500;
    color: #1E293B;
  }
`;

const ExerciseNotes = styled.div`
  font-size: 14px;
  color: #64748B;
  margin-bottom: 12px;
  
  p {
    margin: 0;
  }
`;

const SetsList = styled.div`
  margin-top: 16px;
`;

const SetsHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 80px;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
  border-bottom: 1px solid #E2E8F0;
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 80px;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SetNumber = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
`;

const SetInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #E2E8F0;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    &:disabled {
      background: #F8FAFC;
      color: #94A3B8;
    }
  }
`;

const SetComplete = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  border-radius: 4px;
  background: ${props => props.completed ? '#10B981' : '#F1F5F9'};
  color: ${props => props.completed ? 'white' : '#64748B'};
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.completed ? '#059669' : '#E2E8F0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CountControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  
  button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F1F5F9;
    border: none;
    color: #64748B;
    cursor: pointer;
    
    &:hover {
      background: #E2E8F0;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  input {
    flex: 1;
    border: none;
    padding: 4px 8px;
    text-align: center;
    font-size: 14px;
    
    &:focus {
      outline: none;
    }
  }
`;

const CurrentExerciseCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CurrentExerciseHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  background: #10B981;
  color: white;
`;

const CurrentExerciseTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
`;

const CurrentExerciseMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  opacity: 0.9;
`;

const CurrentExerciseContent = styled.div`
  padding: 20px;
`;

const RestTimer = styled.div`
  background: ${props => props.active ? '#F1F5F9' : 'transparent'};
  border-radius: 8px;
  padding: ${props => props.active ? '16px' : '0'};
  margin-bottom: ${props => props.active ? '16px' : '0'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

const RestTimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const RestTimerTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RestTimerDisplay = styled.div`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #1E293B;
`;

const RestTimerControls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
`;

const SetsProgress = styled.div`
  margin-bottom: 20px;
`;

const SetsProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SetsProgressTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SetsProgressCount = styled.div`
  font-size: 14px;
  color: #64748B;
`;

const SetsProgressBar = styled.div`
  height: 8px;
  background: #F1F5F9;
  border-radius: 4px;
  overflow: hidden;
`;

const SetsProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: #10B981;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const NotesInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  margin-top: 8px;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const FinishWorkoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    background: #94A3B8;
    cursor: not-allowed;
  }
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

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const DialogContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const DialogHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
`;

const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const DialogBody = styled.div`
  padding: 20px;
`;

const DialogText = styled.p`
  font-size: 15px;
  color: #1E293B;
  margin: 0 0 20px;
`;

const DialogFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
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
  
  &:hover {
    background: ${props => props.secondary ? '#F8FAFC' : '#0D9668'};
  }
  
  &:disabled {
    background: ${props => props.danger ? '#F87171' : '#94A3B8'};
    cursor: not-allowed;
  }
`;

// Componente principal
const WorkoutSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [expandedExercises, setExpandedExercises] = useState({});
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Ref para os timers
  const sessionTimerRef = useRef(null);
  const restTimerRef = useRef(null);
  const isMounted = useRef(true);
  
  // Estado para os dados da sessão
  const [sessionData, setSessionData] = useState({
    startTime: null,
    endTime: null,
    duration: 0,
    exerciseResults: []
  });
  
  // Verificar se o componente está montado
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      
      // Limpar timers ao desmontar o componente
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, []);
  
  // Buscar dados do treino
  useEffect(() => {
    const getWorkout = async () => {
      try {
        setLoading(true);
        
        // Simulação de chamada à API
        // const response = await api.get(`/api/workouts/${id}`);
        
        // Dados de exemplo para desenvolvimento
        const exampleWorkout = {
          id: parseInt(id),
          title: 'Full Body Workout - Level 2',
          description: 'A comprehensive full body workout targeting all major muscle groups.',
          type: 'strength',
          difficulty: 'intermediate',
          duration: 60,
          targetMuscles: 'Chest, Back, Legs, Shoulders, Arms, Core',
          createdBy: 'John Doe',
          createdAt: '2023-03-15T10:30:00Z',
          updatedAt: '2023-03-20T14:45:00Z',
          completionCount: 12,
          lastCompleted: '2023-05-12T08:30:00Z',
          notes: 'Rest 1-2 minutes between sets. Focus on proper form. If the exercise feels too easy, increase weight or reps.',
          exercises: [
            {
              id: 1,
              name: 'Barbell Squat',
              sets: 4,
              reps: '8-10',
              rest: 90,
              notes: 'Keep chest up, drive through heels'
            },
            {
              id: 2,
              name: 'Bench Press',
              sets: 4,
              reps: '8-10',
              rest: 90,
              notes: 'Full range of motion, keep shoulders retracted'
            },
            {
              id: 3,
              name: 'Bent Over Row',
              sets: 3,
              reps: '10-12',
              rest: 60,
              notes: 'Maintain neutral spine'
            },
            {
              id: 4,
              name: 'Overhead Press',
              sets: 3,
              reps: '8-10',
              rest: 60,
              notes: ''
            },
            {
              id: 5,
              name: 'Romanian Deadlift',
              sets: 3,
              reps: '10-12',
              rest: 90,
              notes: 'Hinge at hips, soft bend in knees'
            },
            {
              id: 6,
              name: 'Plank',
              sets: 3,
              reps: '45 seconds',
              rest: 45,
              notes: 'Maintain straight line from head to heels'
            }
          ]
        };
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verificar se o componente ainda está montado antes de atualizar o estado
        if (!isMounted.current) return;
        
        // Use dados da API ou os dados de exemplo
        const workoutData = exampleWorkout; // ou response.data;
        
        setWorkout(workoutData);
        
        // Inicializar dados da sessão
        if (workoutData && workoutData.exercises) {
          try {
            const exerciseResults = workoutData.exercises.map(exercise => ({
              exerciseId: exercise.id,
              name: exercise.name,
              sets: Array(exercise.sets).fill().map((_, index) => ({
                setNumber: index + 1,
                weight: '',
                reps: '',
                completed: false
              })),
              notes: ''
            }));
            
            setSessionData(prev => ({
              ...prev,
              exerciseResults
            }));
          } catch (error) {
            console.error("Erro ao processar dados dos exercícios:", error);
          }
        }
        
      } catch (error) {
        console.error('Error fetching workout:', error);
        if (isMounted.current) {
          navigate('/workouts');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    
    getWorkout();
  }, [id, navigate]);
  
  // Iniciar sessão de treino
  const startWorkout = () => {
    if (!workout) return;
    
    setWorkoutStarted(true);
    setSessionData(prev => ({
      ...prev,
      startTime: new Date().toISOString()
    }));
    
    // Iniciar timer da sessão
    startSessionTimer();
  };
  
  // Parar sessão de treino
  const stopWorkout = () => {
    setTimerRunning(false);
    setRestTimerRunning(false);
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
  };
  
  // Iniciar timer da sessão
  const startSessionTimer = () => {
    // Certificar-se de que não há timer rodando
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    setTimerRunning(true);
    
    sessionTimerRef.current = setInterval(() => {
      if (isMounted.current) {
        setSessionTimer(prev => prev + 1);
      }
    }, 1000);
  };
  
  // Pausar timer da sessão
  const pauseSessionTimer = () => {
    setTimerRunning(false);
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };
  
  // Iniciar timer de descanso
  const startRestTimer = (seconds) => {
    // Verificar se seconds é um número válido
    const validSeconds = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 60;
    
    // Certificar-se de que não há timer rodando
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }
    
    setRestTimer(validSeconds);
    setRestTimerRunning(true);
    setShowRestTimer(true);
    
    restTimerRef.current = setInterval(() => {
      if (isMounted.current) {
        setRestTimer(prev => {
          if (prev <= 1) {
            // Timer finalizado
            clearInterval(restTimerRef.current);
            restTimerRef.current = null;
            setRestTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };
  
  // Pausar timer de descanso
  const pauseRestTimer = () => {
    setRestTimerRunning(false);
    
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
  };
  
  // Cancelar timer de descanso
  const cancelRestTimer = () => {
    setRestTimerRunning(false);
    setShowRestTimer(false);
    
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      restTimerRef.current = null;
    }
  };
  
  // Formatar tempo
  const formatTime = (timeInSeconds) => {
    if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds)) {
      return '00:00';
    }
    
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle expandir/colapsar exercício
  const toggleExerciseExpanded = (index) => {
    setExpandedExercises(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Ir para próximo exercício
  const goToNextExercise = () => {
    if (!workout || !workout.exercises) return;
    
    if (activeExerciseIndex < workout.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      toggleExerciseExpanded(activeExerciseIndex + 1);
    }
  };
  
  // Definir exercício ativo
  const setActiveExercise = (index) => {
    setActiveExerciseIndex(index);
    toggleExerciseExpanded(index);
  };
  
  // Atualizar peso para um set
  const updateSetWeight = (exerciseIndex, setIndex, value) => {
    if (!sessionData || !sessionData.exerciseResults) return;
    
    try {
      const updatedResults = [...sessionData.exerciseResults];
      if (updatedResults[exerciseIndex] && updatedResults[exerciseIndex].sets && updatedResults[exerciseIndex].sets[setIndex]) {
        updatedResults[exerciseIndex].sets[setIndex].weight = value;
        
        setSessionData(prev => ({
          ...prev,
          exerciseResults: updatedResults
        }));
      }
    } catch (error) {
      console.error("Erro ao atualizar peso:", error);
    }
  };
  
  // Atualizar repetições para um set
  const updateSetReps = (exerciseIndex, setIndex, value) => {
    if (!sessionData || !sessionData.exerciseResults) return;try {
        const updatedResults = [...sessionData.exerciseResults];
        if (updatedResults[exerciseIndex] && updatedResults[exerciseIndex].sets && updatedResults[exerciseIndex].sets[setIndex]) {
          updatedResults[exerciseIndex].sets[setIndex].reps = value;
          
          setSessionData(prev => ({
            ...prev,
            exerciseResults: updatedResults
          }));
        }
      } catch (error) {
        console.error("Erro ao atualizar repetições:", error);
      }
    };
    
    // Marcar set como completo
    const toggleSetCompleted = (exerciseIndex, setIndex) => {
      if (!sessionData || !sessionData.exerciseResults) return;
      
      try {
        const updatedResults = [...sessionData.exerciseResults];
        if (updatedResults[exerciseIndex] && updatedResults[exerciseIndex].sets && updatedResults[exerciseIndex].sets[setIndex]) {
          const currentValue = updatedResults[exerciseIndex].sets[setIndex].completed;
          updatedResults[exerciseIndex].sets[setIndex].completed = !currentValue;
          
          // Se marcar como completo e houver um próximo set, mostre o timer de descanso
          if (!currentValue && setIndex < updatedResults[exerciseIndex].sets.length - 1) {
            const restTime = workout?.exercises[exerciseIndex]?.rest || 60;
            startRestTimer(restTime);
          }
          
          // Se completou o último set deste exercício, vá para o próximo exercício
          if (!currentValue && setIndex === updatedResults[exerciseIndex].sets.length - 1) {
            if (exerciseIndex < (workout?.exercises?.length || 0) - 1) {
              setTimeout(() => {
                if (isMounted.current) {
                  goToNextExercise();
                }
              }, 500);
            }
          }
          
          setSessionData(prev => ({
            ...prev,
            exerciseResults: updatedResults
          }));
        }
      } catch (error) {
        console.error("Erro ao marcar set como completo:", error);
      }
    };
    
    // Calcular progresso dos sets para o exercício atual
    const calculateSetsProgress = (exerciseIndex) => {
      if (!sessionData || !sessionData.exerciseResults || !sessionData.exerciseResults[exerciseIndex]) {
        return { completedSets: 0, totalSets: 0, progress: 0 };
      }
      
      try {
        const sets = sessionData.exerciseResults[exerciseIndex].sets || [];
        const completedSets = sets.filter(set => set.completed).length;
        const totalSets = sets.length;
        
        return {
          completedSets,
          totalSets,
          progress: totalSets > 0 ? (completedSets / totalSets) * 100 : 0
        };
      } catch (error) {
        console.error("Erro ao calcular progresso dos sets:", error);
        return { completedSets: 0, totalSets: 0, progress: 0 };
      }
    };
    
    // Calcular progresso geral do treino
    const calculateWorkoutProgress = () => {
      if (!sessionData || !sessionData.exerciseResults) {
        return { completedSets: 0, totalSets: 0, progress: 0 };
      }
      
      try {
        const allSets = sessionData.exerciseResults.flatMap(ex => ex.sets || []);
        const completedSets = allSets.filter(set => set.completed).length;
        const totalSets = allSets.length;
        
        return {
          completedSets,
          totalSets,
          progress: totalSets > 0 ? (completedSets / totalSets) * 100 : 0
        };
      } catch (error) {
        console.error("Erro ao calcular progresso geral:", error);
        return { completedSets: 0, totalSets: 0, progress: 0 };
      }
    };
    
    // Verificar se o treino está completo
    const isWorkoutComplete = () => {
      const { completedSets, totalSets } = calculateWorkoutProgress();
      return completedSets === totalSets && totalSets > 0;
    };
    
    // Abrir diálogo de confirmação
    const openConfirmDialog = (action) => {
      setConfirmAction(action);
      setConfirmOpen(true);
    };
    
    // Fechar diálogo de confirmação
    const closeConfirmDialog = () => {
      setConfirmAction(null);
      setConfirmOpen(false);
    };
    
    // Salvar e finalizar treino
    const finishWorkout = async () => {
      if (!workout) return;
      
      try {
        setLoading(true);
        
        // Parar timers
        stopWorkout();
        
        // Atualizar dados da sessão
        const endTime = new Date().toISOString();
        const duration = sessionTimer;
        
        const finalSessionData = {
          ...sessionData,
          endTime,
          duration,
          notes: sessionNotes,
          workoutId: workout.id
        };
        
        console.log("Finalizando treino com dados:", finalSessionData);
        
        // Simulação de chamada à API para salvar a sessão
        // await api.post('/api/workout-sessions', finalSessionData);
        
        // Simulação de atualização de estatísticas do treino
        // await api.post(`/api/workouts/${id}/complete`, {
        //   sessionId: "new-session-id", // Resposta da chamada anterior
        //   completionTime: new Date().toISOString()
        // });
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted.current) return;
        
        setWorkoutCompleted(true);
        
        // Redirecionar para página de sucesso ou detalhes do treino
        navigate(`/workouts/${id}?completed=true`);
        
      } catch (error) {
        console.error('Error saving workout session:', error);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    
    // Cancelar treino atual
    const cancelWorkout = () => {
      stopWorkout();
      navigate(`/workouts/${id}`);
    };
  
    // Componente para um exercício individual
    const ExerciseRow = ({ exercise, index }) => {
      if (!exercise) return null;
      
      const isActive = index === activeExerciseIndex;
      const isExpanded = expandedExercises[index] || false;
      const { completedSets, totalSets } = calculateSetsProgress(index);
      
      // Verificar se o exercício está completo
      const isExerciseComplete = completedSets === totalSets && totalSets > 0;
      
      return (
        <ExerciseItem active={isActive}>
          <ExerciseHeader expanded={isExpanded}>
            <ExerciseTitle>
              <ExerciseIndex active={isActive || isExerciseComplete}>{index + 1}</ExerciseIndex>
              {exercise.name}
              {isExerciseComplete && <FiCheckCircle color="#10B981" size={16} style={{ marginLeft: '8px' }} />}
            </ExerciseTitle>
            
            <ExerciseToggle onClick={() => toggleExerciseExpanded(index)}>
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </ExerciseToggle>
          </ExerciseHeader>
          
          <ExerciseDetails expanded={isExpanded}>
            <ExerciseMeta>
              <ExerciseMetaItem>
                Sets: <span>{exercise.sets}</span>
              </ExerciseMetaItem>
              <ExerciseMetaItem>
                Reps: <span>{exercise.reps}</span>
              </ExerciseMetaItem>
              <ExerciseMetaItem>
                Rest: <span>{exercise.rest}s</span>
              </ExerciseMetaItem>
            </ExerciseMeta>
            
            {exercise.notes && (
              <ExerciseNotes>
                <p>{exercise.notes}</p>
              </ExerciseNotes>
            )}
            
            <Button 
              onClick={() => setActiveExercise(index)}
              style={{ marginTop: '12px' }}
            >
              {isActive ? 'Current Exercise' : 'Start Exercise'}
            </Button>
          </ExerciseDetails>
        </ExerciseItem>
      );
    };
  
    return (
      <MainLayout>
        <PageHeader>
          <div>
            <BackButton to={`/workouts/${id}`}>
              <FiChevronLeft /> Back to Workout
            </BackButton>
            <PageTitle>Workout Session</PageTitle>
          </div>
        </PageHeader>
        
        {loading ? (
          <LoadingWrapper>
            <LoadingIcon />
          </LoadingWrapper>
        ) : workout ? (
          <>
            {!workoutStarted ? (
              <div>
                <WorkoutInfoCard>
                  <div>
                    <WorkoutTitle>{workout.title}</WorkoutTitle>
                    <WorkoutMeta>
                      {workout.exercises.length} exercises • Estimated {workout.duration} minutes
                    </WorkoutMeta>
                  </div>
                  
                  <Button onClick={startWorkout}>
                    <FiPlay /> Start Workout
                  </Button>
                </WorkoutInfoCard>
                
                <ExerciseList>
                  <ExerciseListHeader>
                    <ExerciseListTitle>
                      <FiActivity /> Exercise List
                    </ExerciseListTitle>
                  </ExerciseListHeader>
                  
                  <ExerciseListContent>
                    {workout.exercises.map((exercise, index) => (
                      <ExerciseRow 
                        key={exercise.id || index} 
                        exercise={exercise} 
                        index={index}
                      />
                    ))}
                  </ExerciseListContent>
                </ExerciseList>
              </div>
            ) : (
              <>
                <TimerCard>
                  <TimerDisplay>
                    {formatTime(sessionTimer)}
                  </TimerDisplay>
                  
                  <TimerControls>
                    {timerRunning ? (
                      <TimerButton
                        onClick={pauseSessionTimer}
                        title="Pause Timer"
                      >
                        <FiPause />
                      </TimerButton>
                    ) : (
                      <TimerButton
                        onClick={startSessionTimer}
                        title="Resume Timer"
                      >
                        <FiPlay />
                      </TimerButton>
                    )}
                  </TimerControls>
                </TimerCard>
                
                <ContentGrid>
                  <div>
                    <ExerciseList>
                      <ExerciseListHeader>
                        <ExerciseListTitle>
                          <FiActivity /> Exercise Progress
                        </ExerciseListTitle>
                        
                        <div>
                          {calculateWorkoutProgress().completedSets} / {calculateWorkoutProgress().totalSets} sets completed
                        </div>
                      </ExerciseListHeader>
                      
                      <ExerciseListContent>
                        {workout.exercises.map((exercise, index) => (
                          <ExerciseRow 
                            key={exercise.id || index} 
                            exercise={exercise} 
                            index={index}
                          />
                        ))}
                      </ExerciseListContent>
                    </ExerciseList>
                  </div>
                  
                  <div>
                    <CurrentExerciseCard>
                      {workout.exercises[activeExerciseIndex] && (
                        <>
                          <CurrentExerciseHeader>
                            <CurrentExerciseTitle>
                              {workout.exercises[activeExerciseIndex].name}
                            </CurrentExerciseTitle>
                            <CurrentExerciseMeta>
                              <div>Sets: {workout.exercises[activeExerciseIndex].sets}</div>
                              <div>Reps: {workout.exercises[activeExerciseIndex].reps}</div>
                            </CurrentExerciseMeta>
                          </CurrentExerciseHeader>
                          
                          <CurrentExerciseContent>
                            <RestTimer 
                              active={restTimerRunning} 
                              visible={showRestTimer}
                            >
                              <RestTimerHeader>
                                <RestTimerTitle>
                                  <FiClock /> Rest Timer
                                </RestTimerTitle>
                                
                                <Button 
                                  secondary 
                                  onClick={cancelRestTimer}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  <FiX /> Skip
                                </Button>
                              </RestTimerHeader>
                              
                              <RestTimerDisplay>
                                {formatTime(restTimer)}
                              </RestTimerDisplay>
                              
                              <RestTimerControls>
                                {restTimerRunning ? (
                                  <Button secondary onClick={pauseRestTimer}>
                                    <FiPause /> Pause
                                  </Button>
                                ) : (
                                  <Button 
                                    onClick={() => {
                                      const restTime = workout.exercises[activeExerciseIndex].rest || 60;
                                      startRestTimer(restTime);
                                    }}
                                  >
                                    <FiPlay /> Resume
                                  </Button>
                                )}
                              </RestTimerControls>
                            </RestTimer>
                            
                            <SetsProgress>
                              <SetsProgressHeader>
                                <SetsProgressTitle>
                                  <FiActivity /> Sets Progress
                                </SetsProgressTitle>
                                
                                <SetsProgressCount>
                                  {calculateSetsProgress(activeExerciseIndex).completedSets} / {calculateSetsProgress(activeExerciseIndex).totalSets}
                                </SetsProgressCount>
                              </SetsProgressHeader>
                              
                              <SetsProgressBar>
                                <SetsProgressFill progress={calculateSetsProgress(activeExerciseIndex).progress} />
                              </SetsProgressBar>
                            </SetsProgress>
                            
                            <SetsList>
                              <SetsHeader>
                                <div>Set</div>
                                <div>Weight</div>
                                <div>Reps</div>
                                <div>Done</div>
                              </SetsHeader>
                              
                              {sessionData.exerciseResults[activeExerciseIndex]?.sets.map((set, idx) => (
                                <SetRow key={idx}>
                                  <SetNumber>Set {idx + 1}</SetNumber>
                                  
                                  <SetInput>
                                    <input
                                      type="text"
                                      value={set.weight}
                                      onChange={(e) => updateSetWeight(activeExerciseIndex, idx, e.target.value)}
                                      placeholder="kg"
                                      disabled={set.completed}
                                    />
                                  </SetInput>
                                  
                                  <SetInput>
                                    <input
                                      type="text"
                                      value={set.reps}
                                      onChange={(e) => updateSetReps(activeExerciseIndex, idx, e.target.value)}
                                      placeholder="reps"
                                      disabled={set.completed}
                                    />
                                  </SetInput>
                                  
                                  <SetComplete
                                    completed={set.completed}
                                    onClick={() => toggleSetCompleted(activeExerciseIndex, idx)}
                                  >
                                    <FiCheckCircle />
                                  </SetComplete>
                                </SetRow>
                              ))}
                            </SetsList>
                            
                            {workout.exercises[activeExerciseIndex].notes && (
                              <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748B' }}>
                                <strong>Notes:</strong> {workout.exercises[activeExerciseIndex].notes}
                              </div>
                            )}
                          </CurrentExerciseContent>
                        </>
                      )}
                    </CurrentExerciseCard>
                    
                    <CurrentExerciseCard style={{ marginTop: '24px', padding: '20px' }}>
                      <h4 style={{ margin: '0 0 12px' }}>Session Notes</h4>
                      <NotesInput
                        placeholder="Add any notes about this workout session..."
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                      />
                      
                      <FinishWorkoutButton
                        disabled={!workoutStarted}
                        onClick={() => openConfirmDialog('finish')}
                      >
                        <FiFlag /> Finish Workout
                      </FinishWorkoutButton>
                      
                      <Button
                        secondary
                        style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                        onClick={() => openConfirmDialog('cancel')}
                      >
                        <FiX /> Cancel Workout
                      </Button>
                    </CurrentExerciseCard>
                  </div>
                </ContentGrid>
              </>
            )}
            
            <ConfirmDialog isOpen={confirmOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {confirmAction === 'finish' ? 'Finish Workout' : 'Cancel Workout'}
                  </DialogTitle>
                </DialogHeader>
                
                <DialogBody>
                  <DialogText>
                    {confirmAction === 'finish'
                      ? `Are you sure you want to finish this workout? ${!isWorkoutComplete() ? 'Not all sets have been marked as completed.' : ''}`
                      : 'Are you sure you want to cancel this workout? All progress will be lost.'}
                  </DialogText>
                </DialogBody>
                
                <DialogFooter>
                  <Button secondary onClick={closeConfirmDialog}>
                    Go Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirmAction === 'finish') {
                        finishWorkout();
                      } else {
                        cancelWorkout();
                      }
                      closeConfirmDialog();
                    }}
                  >
                    {confirmAction === 'finish' ? 'Finish Workout' : 'Cancel Workout'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </ConfirmDialog>
          </>
        ) : (
          <div>Workout not found</div>
        )}
      </MainLayout>
    );
  };
  
  export default WorkoutSession;