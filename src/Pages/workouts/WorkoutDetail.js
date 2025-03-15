import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiEdit2, FiChevronLeft, FiClock, FiTarget, FiActivity,
  FiCalendar, FiUser, FiMoreVertical, FiTrash2, FiShare2,
  FiCopy, FiPrinter, FiUpload, FiDownload, FiUsers, FiRefreshCw,
  FiList, FiDumbbell
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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
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
  min-width: 200px;
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
  font-size: 14px;
  
  &:hover {
    background: ${props => props.danger ? '#FEF2F2' : '#F8FAFC'};
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const WorkoutTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 5px;
`;

const WorkoutType = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: #EFF6FF;
  color: #3B82F6;
`;

const WorkoutDescription = styled.p`
  font-size: 15px;
  color: #1E293B;
  margin: 10px 0 20px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetaCard = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 14px;
  }
`;

const MetaValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const ExerciseTable = styled.table`
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
  padding: 16px;
  border-bottom: 1px solid #E2E8F0;
  font-size: 14px;
  color: #1E293B;
  vertical-align: top;
  
  &:first-child {
    font-weight: 500;
  }
`;

const ExerciseIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #F1F5F9;
  color: #64748B;
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
`;

const ExerciseNotes = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-top: 8px;
  font-style: italic;
`;

const SideCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SideCardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
`;

const SideCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SideCardContent = styled.div`
  padding: 16px 20px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #F1F5F9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryDate = styled.div`
  font-size: 14px;
  color: #1E293B;
`;

const HistoryMeta = styled.div`
  font-size: 13px;
  color: #64748B;
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
`;

const StartWorkoutButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: #0D9668;
  }
`;

const NotesSection = styled.div`
  margin-top: 10px;
`;

const NotesTitle = styled.h4`
  font-size: 15px;
  font-weight: 500;
  color: #1E293B;
  margin: 0 0 10px;
`;

const NotesContent = styled.p`
  font-size: 14px;
  color: #64748B;
  margin: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  background: #F1F5F9;
  color: #64748B;
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

// Componente principal
const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Fetch do treino pelo ID
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
          description: 'A comprehensive full body workout targeting all major muscle groups. Designed for intermediate fitness levels to build strength and endurance.',
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
        
        // Use dados da API ou os dados de exemplo
        // setWorkout(response.data);
        setWorkout(exampleWorkout);
      } catch (error) {
        console.error('Error fetching workout:', error);
        // Redirecionar em caso de erro ou se não encontrar o treino
        // navigate('/workouts');
      } finally {
        setLoading(false);
      }
    };
    
    getWorkout();
  }, [id, navigate]);
  
  // Formatar tipo de treino
  const formatWorkoutType = (type) => {
    const types = {
      'strength': 'Strength Training',
      'cardio': 'Cardio',
      'hiit': 'HIIT',
      'flexibility': 'Flexibility',
      'bodyweight': 'Bodyweight',
      'crossfit': 'CrossFit',
      'custom': 'Custom'
    };
    
    return types[type] || type;
  };
  
  // Formatar nível de dificuldade
  const formatDifficulty = (difficulty) => {
    const levels = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };
    
    return levels[difficulty] || difficulty;
  };
  
  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Abrir diálogo de confirmação
  const openConfirmDialog = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };
  
  // Fechar diálogo de confirmação
  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };
  
  // Deletar treino
  const handleDeleteWorkout = async () => {
    try {
      setLoading(true);
      
      // Simular chamada à API
      // await api.delete(`/api/workouts/${id}`);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirecionar após deletar
      navigate('/workouts');
    } catch (error) {
      console.error('Error deleting workout:', error);
      setLoading(false);
      setConfirmOpen(false);
    }
  };
  
  return (
    <MainLayout>
      <PageHeader>
        <BackButton to="/workouts">
          <FiChevronLeft /> Back to Workouts
        </BackButton>
        
        <HeaderActions>
          <ActionLink to={`/workouts/${id}/start`}>
            <FiActivity /> Start Workout
          </ActionLink>
          
          <ActionLink secondary to={`/workouts/${id}/edit`}>
            <FiEdit2 /> Edit
          </ActionLink>
          
          <ActionMenu>
            <ActionButton secondary onClick={toggleMenu}>
              <FiMoreVertical />
            </ActionButton>
            
            <ActionDropdown isOpen={menuOpen}>
              <ActionItem>
                <FiCopy /> Duplicate
              </ActionItem>
              <ActionItem>
                <FiShare2 /> Share
              </ActionItem>
              <ActionItem>
                <FiPrinter /> Print
              </ActionItem>
              <ActionItem>
                <FiDownload /> Export
              </ActionItem>
              <ActionItem danger onClick={openConfirmDialog}>
                <FiTrash2 /> Delete
              </ActionItem>
            </ActionDropdown>
          </ActionMenu>
        </HeaderActions>
      </PageHeader>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      ) : workout ? (
        <Grid>
          <div>
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <FiActivity /> Workout Overview
                </SectionTitle>
              </SectionHeader>
              
              <SectionContent>
                <WorkoutHeader>
                  <div>
                    <WorkoutTitle>{workout.title}</WorkoutTitle>
                    <WorkoutType>{formatWorkoutType(workout.type)}</WorkoutType>
                  </div>
                </WorkoutHeader>
                
                <WorkoutDescription>{workout.description}</WorkoutDescription>
                
                <MetaGrid>
                  <MetaCard>
                    <MetaLabel><FiActivity /> Type</MetaLabel>
                    <MetaValue>{formatWorkoutType(workout.type)}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiTarget /> Difficulty</MetaLabel>
                    <MetaValue>{formatDifficulty(workout.difficulty)}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiClock /> Duration</MetaLabel>
                    <MetaValue>{workout.duration} minutes</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiCalendar /> Created</MetaLabel>
                    <MetaValue>{formatDate(workout.createdAt)}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiUser /> Created by</MetaLabel>
                    <MetaValue>{workout.createdBy}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiCalendar /> Last updated</MetaLabel>
                    <MetaValue>{formatDate(workout.updatedAt)}</MetaValue>
                  </MetaCard>
                </MetaGrid>
                
                {workout.notes && (
                  <NotesSection>
                    <NotesTitle>Notes</NotesTitle>
                    <NotesContent>{workout.notes}</NotesContent>
                  </NotesSection>
                )}
                
                <TagsContainer>
                  {workout.targetMuscles.split(',').map((muscle, index) => (
                    <Tag key={index}>{muscle.trim()}</Tag>
                  ))}
                </TagsContainer>
              </SectionContent>
            </Section>
            
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <FiList /> Exercise List
                </SectionTitle>
              </SectionHeader>
              
              <SectionContent>
                <ExerciseTable>
                  <thead>
                    <tr>
                      <Th>Exercise</Th>
                      <Th>Sets</Th>
                      <Th>Reps</Th>
                      <Th>Rest</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.exercises.map((exercise, index) => (
                      <tr key={exercise.id}>
                        <Td>
                          <ExerciseIndex>{index + 1}</ExerciseIndex>
                          {exercise.name}
                          {exercise.notes && (
                            <ExerciseNotes>{exercise.notes}</ExerciseNotes>
                          )}
                        </Td>
                        <Td>{exercise.sets}</Td>
                        <Td>{exercise.reps}</Td>
                        <Td>{exercise.rest} sec</Td>
                      </tr>
                    ))}
                  </tbody>
                </ExerciseTable>
              </SectionContent>
            </Section>
          </div>
          
          <div>
            <SideCard>
              <SideCardHeader>
                <SideCardTitle>
                  <FiActivity /> Start Workout
                </SideCardTitle>
              </SideCardHeader>
              
              <SideCardContent>
                <div>Ready to begin this workout?</div>
                
                <ButtonContainer>
                  <StartWorkoutButton to={`/workouts/${id}/start`}>
                    <FiActivity /> Start Workout
                  </StartWorkoutButton>
                </ButtonContainer>
              </SideCardContent>
            </SideCard>
            
            <SideCard>
              <SideCardHeader>
                <SideCardTitle>
                  <FiUsers /> Workout History
                </SideCardTitle>
              </SideCardHeader>
              
              <SideCardContent>
                <HistoryItem>
                  <HistoryDate>Total Completions</HistoryDate>
                  <HistoryMeta>{workout.completionCount || 0}</HistoryMeta>
                </HistoryItem>
                
                <HistoryItem>
                  <HistoryDate>Last Completed</HistoryDate>
                  <HistoryMeta>{formatDate(workout.lastCompleted)}</HistoryMeta>
                </HistoryItem>
                
                <HistoryItem>
                  <HistoryDate>Best Time</HistoryDate>
                  <HistoryMeta>52 min</HistoryMeta>
                </HistoryItem>
              </SideCardContent>
            </SideCard>
          </div>
        </Grid>
      ) : (
        <div>Workout not found</div>
      )}
      
      <ConfirmDialog isOpen={confirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
          </DialogHeader>
          
          <DialogBody>
            <DialogText>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogText>
          </DialogBody>
          
          <DialogFooter>
            <ActionButton secondary onClick={closeConfirmDialog}>
              Cancel
            </ActionButton>
            <ActionButton danger onClick={handleDeleteWorkout}>
              <FiTrash2 /> Delete
            </ActionButton>
          </DialogFooter>
        </DialogContent>
      </ConfirmDialog>
    </MainLayout>
  );
};

export default WorkoutDetail;