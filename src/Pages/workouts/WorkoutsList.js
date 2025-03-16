import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, FiSearch, FiFilter, FiCalendar, FiActivity, 
  FiClock, FiTarget, FiMoreVertical, FiEdit2, FiTrash2,
  FiRefreshCw, FiPlay, FiCopy, FiShare2
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

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
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
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #10B981;
  color: white;
  text-decoration: none;
  
  &:hover {
    background: #0D9668;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    background: #F8FAFC;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 14px;
  min-width: 180px;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

const WorkoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const WorkoutCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const WorkoutCardHeader = styled.div`
  position: relative;
  height: 120px;
  background: linear-gradient(to right, #10B981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const WorkoutTypeIndicator = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #1E293B;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const WorkoutTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-align: center;
  margin: 0;
`;

const WorkoutContent = styled.div`
  padding: 20px;
`;

const MetaDataList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const MetaDataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetaIcon = styled.div`
  color: #10B981;
  display: flex;
  align-items: center;
`;

const MetaText = styled.div`
  font-size: 14px;
  color: #64748B;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #F1F5F9;
  color: #64748B;
`;

const WorkoutCardFooter = styled.div`
  border-top: 1px solid #F1F5F9;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterText = styled.div`
  font-size: 13px;
  color: #64748B;
`;

const FooterActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background: ${props => props.primary ? '#10B981' : '#F1F5F9'};
  color: ${props => props.primary ? 'white' : '#64748B'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.primary ? '#0D9668' : '#E2E8F0'};
  }
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
  min-width: 180px;
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

const DetailLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #CBD5E1;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
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
const WorkoutList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  // Fetch workouts
  useEffect(() => {
    const getWorkouts = async () => {
      try {
        setLoading(true);
        
        // Simulação de chamada à API
        // const response = await api.get('/api/workouts');
        
        // Dados de exemplo para desenvolvimento
        const exampleWorkouts = [
          {
            id: 1,
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
            exercises: [
              { name: 'Squat', sets: 4, reps: '8-10' },
              { name: 'Bench Press', sets: 4, reps: '8-10' },
              { name: 'Bent Over Row', sets: 3, reps: '10-12' },
              { name: 'Overhead Press', sets: 3, reps: '8-10' },
              { name: 'Romanian Deadlift', sets: 3, reps: '10-12' },
              { name: 'Plank', sets: 3, reps: '45 seconds' }
            ]
          },
          {
            id: 2,
            title: 'Upper Body Push Day',
            description: 'Focus on pushing movements for chest, shoulders, and triceps.',
            type: 'strength',
            difficulty: 'advanced',
            duration: 45,
            targetMuscles: 'Chest, Shoulders, Triceps',
            createdBy: 'John Doe',
            createdAt: '2023-04-10T09:15:00Z',
            updatedAt: '2023-04-10T09:15:00Z',
            completionCount: 8,
            lastCompleted: '2023-05-08T07:45:00Z',
            exercises: [
              { name: 'Incline Bench Press', sets: 4, reps: '8-10' },
              { name: 'Flat Dumbbell Press', sets: 4, reps: '10-12' },
              { name: 'Overhead Press', sets: 3, reps: '8-10' },
              { name: 'Lateral Raises', sets: 3, reps: '12-15' },
              { name: 'Tricep Pushdowns', sets: 3, reps: '12-15' },
              { name: 'Tricep Extensions', sets: 3, reps: '10-12' }
            ]
          },
          {
            id: 3,
            title: 'Lower Body Focus',
            description: 'Intense leg workout targeting all lower body muscle groups.',
            type: 'strength',
            difficulty: 'intermediate',
            duration: 50,
            targetMuscles: 'Quads, Hamstrings, Glutes, Calves',
            createdBy: 'John Doe',
            createdAt: '2023-04-15T11:00:00Z',
            updatedAt: '2023-04-20T16:30:00Z',
            completionCount: 6,
            lastCompleted: '2023-05-10T08:00:00Z',
            exercises: [
              { name: 'Back Squat', sets: 4, reps: '6-8' },
              { name: 'Romanian Deadlift', sets: 4, reps: '8-10' },
              { name: 'Walking Lunges', sets: 3, reps: '10 each leg' },
              { name: 'Leg Press', sets: 3, reps: '12-15' },
              { name: 'Leg Curls', sets: 3, reps: '12-15' },
              { name: 'Calf Raises', sets: 4, reps: '15-20' }
            ]
          },
          {
            id: 4,
            title: 'HIIT Cardio Circuit',
            description: 'High-intensity interval training to improve cardiovascular fitness and burn calories.',
            type: 'hiit',
            difficulty: 'advanced',
            duration: 30,
            targetMuscles: 'Full Body, Cardiovascular',
            createdBy: 'John Doe',
            createdAt: '2023-05-01T08:45:00Z',
            updatedAt: '2023-05-01T08:45:00Z',
            completionCount: 4,
            lastCompleted: '2023-05-11T06:30:00Z',
            exercises: [
              { name: 'Burpees', sets: 4, reps: '45s work, 15s rest' },
              { name: 'Mountain Climbers', sets: 4, reps: '45s work, 15s rest' },
              { name: 'Jump Squats', sets: 4, reps: '45s work, 15s rest' },
              { name: 'Push-up to Plank Jack', sets: 4, reps: '45s work, 15s rest' },
              { name: 'High Knees', sets: 4, reps: '45s work, 15s rest' },
              { name: 'Jumping Lunges', sets: 4, reps: '45s work, 15s rest' }
            ]
          }
        ];
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use dados da API ou os dados de exemplo
        setWorkouts(exampleWorkouts);
        setFilteredWorkouts(exampleWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getWorkouts();
  }, []);
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...workouts];
    
    // Filtrar por texto
    if (search) {
      result = result.filter(workout => 
        workout.title.toLowerCase().includes(search.toLowerCase()) ||
        workout.description.toLowerCase().includes(search.toLowerCase()) ||
        workout.targetMuscles.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtrar por tipo
    if (typeFilter !== 'all') {
      result = result.filter(workout => workout.type === typeFilter);
    }
    
    // Filtrar por dificuldade
    if (difficultyFilter !== 'all') {
      result = result.filter(workout => workout.difficulty === difficultyFilter);
    }
    
    // Ordenar resultados
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'popularity':
        result.sort((a, b) => (b.completionCount || 0) - (a.completionCount || 0));
        break;
      default:
        break;
    }
    
    setFilteredWorkouts(result);
  }, [workouts, search, typeFilter, difficultyFilter, sortBy]);

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
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };
  
  // Abrir diálogo de confirmação para deletar
  const openConfirmDialog = (workout) => {
    setWorkoutToDelete(workout);
    setMenuOpen(null);
    setConfirmOpen(true);
  };
  
  // Fechar diálogo de confirmação
  const closeConfirmDialog = () => {
    setConfirmOpen(false);
    setWorkoutToDelete(null);
  };
  
  // Deletar treino
  const handleDeleteWorkout = async () => {
    if (!workoutToDelete) return;
    
    try {
      setLoading(true);
      
      // Simulação de chamada à API
      // await api.delete(`/api/workouts/${workoutToDelete.id}`);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar estado local
      const updatedWorkouts = workouts.filter(w => w.id !== workoutToDelete.id);
      setWorkouts(updatedWorkouts);
      
      closeConfirmDialog();
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Exibir ícone de tipo de treino
  const WorkoutTypeIcon = ({ type }) => {
    switch (type) {
      case 'strength':
        return <FiActivity />;
      case 'cardio':
        return <FiActivity />;
      case 'hiit':
        return <FiActivity />;
      case 'flexibility':
        return <FiActivity />;
      case 'bodyweight':
        return <FiActivity />;
      default:
        return <FiActivity />;
    }
  };
  
  // Exibir cor de fundo baseada no tipo de treino
  const getWorkoutHeaderBackground = (type) => {
    const colors = {
      'strength': 'linear-gradient(to right, #10B981, #059669)',
      'cardio': 'linear-gradient(to right, #3B82F6, #2563EB)',
      'hiit': 'linear-gradient(to right, #EF4444, #DC2626)',
      'flexibility': 'linear-gradient(to right, #8B5CF6, #7C3AED)',
      'bodyweight': 'linear-gradient(to right, #F59E0B, #D97706)',
      'crossfit': 'linear-gradient(to right, #6366F1, #4F46E5)',
      'custom': 'linear-gradient(to right, #64748B, #475569)'
    };
    
    return colors[type] || colors.custom;
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>My Workouts</PageTitle>
        <ActionButtons>
          <CreateButton to="/workouts/create">
            <FiPlus /> Create Workout
          </CreateButton>
        </ActionButtons>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <FiSearch />
          <input
            type="text"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchInput>
        
        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="strength">Strength Training</option>
          <option value="cardio">Cardio</option>
          <option value="hiit">HIIT</option>
          <option value="flexibility">Flexibility</option>
          <option value="bodyweight">Bodyweight</option>
          <option value="crossfit">CrossFit</option>
          <option value="custom">Custom</option>
        </FilterSelect>
        
        <FilterSelect
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </FilterSelect>
        
        <FilterSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Most Recent</option>
          <option value="name">Alphabetical</option>
          <option value="duration">Duration</option>
          <option value="popularity">Most Used</option>
        </FilterSelect>
      </FilterBar>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      ) : filteredWorkouts.length > 0 ? (
        <WorkoutGrid>
          {filteredWorkouts.map(workout => (
            <WorkoutCard key={workout.id}>
              <WorkoutCardHeader style={{ background: getWorkoutHeaderBackground(workout.type) }}>
                <WorkoutTypeIndicator>
                  <WorkoutTypeIcon type={workout.type} />
                  {formatWorkoutType(workout.type)}
                </WorkoutTypeIndicator>
                <WorkoutTitle>{workout.title}</WorkoutTitle>
                <DetailLink to={`/workouts/${workout.id}`} />
              </WorkoutCardHeader>
              
              <WorkoutContent>
                <MetaDataList>
                  <MetaDataItem>
                    <MetaIcon>
                      <FiTarget />
                    </MetaIcon>
                    <MetaText>{formatDifficulty(workout.difficulty)}</MetaText>
                  </MetaDataItem>
                  
                  <MetaDataItem>
                    <MetaIcon>
                      <FiClock />
                    </MetaIcon>
                    <MetaText>{workout.duration} min</MetaText>
                  </MetaDataItem>
                  
                  <MetaDataItem>
                    <MetaIcon>
                      <FiActivity />
                    </MetaIcon>
                    <MetaText>{workout.exercises.length} exercises</MetaText>
                  </MetaDataItem>
                  
                  <MetaDataItem>
                    <MetaIcon>
                      <FiCalendar />
                    </MetaIcon>
                    <MetaText>
                      {workout.completionCount ? `${workout.completionCount} times` : 'Never done'}
                    </MetaText>
                  </MetaDataItem>
                </MetaDataList>
                  <TagsContainer>
                    {workout.targetMuscles.split(',').map((muscle, index) => (
                      <Tag key={index}>{muscle.trim()}</Tag>
                    ))}
                  </TagsContainer>
                </WorkoutContent>
                
                <WorkoutCardFooter>
                  <FooterText>Last updated: {formatDate(workout.updatedAt)}</FooterText>
                  
                  <FooterActions>
                    <ActionButton 
                      primary
                      title="Start Workout"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/workouts/${workout.id}/start`);
                      }}
                    >
                      <FiPlay />
                    </ActionButton>
                    
                    <ActionMenu>
                      <ActionButton
                        title="More Options"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMenu(workout.id);
                        }}
                      >
                        <FiMoreVertical />
                      </ActionButton>
                      
                      <ActionDropdown isOpen={menuOpen === workout.id}>
                        <ActionItem
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/workouts/${workout.id}/edit`);
                          }}
                        >
                          <FiEdit2 /> Edit
                        </ActionItem>
                        <ActionItem>
                          <FiCopy /> Duplicate
                        </ActionItem>
                        <ActionItem>
                          <FiShare2 /> Share
                        </ActionItem>
                        <ActionItem 
                          danger
                          onClick={(e) => {
                            e.preventDefault();
                            openConfirmDialog(workout);
                          }}
                        >
                          <FiTrash2 /> Delete
                        </ActionItem>
                      </ActionDropdown>
                    </ActionMenu>
                  </FooterActions>
                </WorkoutCardFooter>
              </WorkoutCard>
            ))}
          </WorkoutGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiActivity />
            </EmptyIcon>
            <EmptyTitle>No workouts found</EmptyTitle>
            <EmptyDescription>
              {search || typeFilter !== 'all' || difficultyFilter !== 'all' 
                ? 'Try adjusting your filters or search terms.' 
                : 'Get started by creating your first workout.'}
            </EmptyDescription>
            <CreateButton to="/workouts/create">
              <FiPlus /> Create Workout
            </CreateButton>
          </EmptyState>
        )}
        
        <ConfirmDialog isOpen={confirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Workout</DialogTitle>
            </DialogHeader>
            
            <DialogBody>
              <DialogText>
                Are you sure you want to delete "{workoutToDelete?.title}"? This action cannot be undone.
              </DialogText>
            </DialogBody>
            
            <DialogFooter>
              <Button secondary onClick={closeConfirmDialog}>
                Cancel
              </Button>
              <Button onClick={handleDeleteWorkout}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </ConfirmDialog>
      </MainLayout>
    );
  };
  
  export default WorkoutList;