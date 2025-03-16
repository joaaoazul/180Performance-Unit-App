import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, FiFilter, FiX, FiCheck, FiPlus, 
  FiRefreshCw, FiImage 
} from 'react-icons/fi';
import { fetchProtectedData } from '../../services/authService';

// Componentes estilizados
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  font-size: 20px;
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

const ModalBody = styled.div`
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background: white;
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

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const ExerciseCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.selected ? '#10B981' : '#E2E8F0'};
  box-shadow: ${props => props.selected ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none'};
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.selected ? '#10B981' : '#CBD5E1'};
    box-shadow: ${props => props.selected ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
`;

const ExerciseImageContainer = styled.div`
  height: 150px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ExerciseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ExercisePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  height: 100%;
  
  svg {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 12px;
  }
`;

const MuscleTargetIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(16, 185, 129, 0.8);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #10B981;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ExerciseContent = styled.div`
  padding: 16px;
`;

const ExerciseName = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 4px;
`;

const ExerciseCategory = styled.div`
  font-size: 13px;
  color: #64748B;
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

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
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

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #64748B;
  font-size: 15px;
`;

// Componente principal
const ExerciseSelector = ({ isOpen, onClose, onSelectExercises, selectedExerciseIds = [] }) => {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(selectedExerciseIds);
  
  // Dados para os filtros
  const muscleGroups = [
    'All',
    'Chest',
    'Back',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Legs',
    'Core',
    'Full Body'
  ];
  
  // Fetch exercises
  useEffect(() => {
    const getExercises = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente de produção, você usaria fetchProtectedData
        // const response = await fetchProtectedData('/api/exercises');
        
        // Dados de exemplo para desenvolvimento
        const exampleData = [
          {
            id: 1,
            name: 'Bench Press',
            description: 'A compound exercise that primarily targets the chest muscles.',
            primaryMuscle: 'Chest',
            secondaryMuscles: ['Shoulders', 'Triceps'],
            equipment: 'Barbell',
            category: 'Strength',
            difficulty: 'Intermediate',
            imageUrl: 'https://example.com/bench-press.jpg',
            videoUrl: 'https://example.com/bench-press-video.mp4',
            instructions: '1. Lie on a bench with your feet flat on the floor.\n2. Grip the barbell with hands slightly wider than shoulder-width.\n3. Lower the bar to your chest.\n4. Press the bar back up to the starting position.',
            createdAt: '2023-01-15T10:30:00Z',
            updatedAt: '2023-02-20T14:45:00Z'
          },
          {
            id: 2,
            name: 'Squat',
            description: 'A fundamental compound exercise that targets the legs and lower body.',
            primaryMuscle: 'Legs',
            secondaryMuscles: ['Glutes', 'Lower Back', 'Core'],
            equipment: 'Barbell',
            category: 'Strength',
            difficulty: 'Intermediate',
            imageUrl: 'https://example.com/squat.jpg',
            videoUrl: null,
            instructions: '1. Stand with feet shoulder-width apart.\n2. Place the barbell across your upper back.\n3. Bend knees and hips to lower your body.\n4. Return to the starting position by extending your knees and hips.',
            createdAt: '2023-01-16T11:20:00Z',
            updatedAt: '2023-02-21T15:35:00Z'
          },
          {
            id: 3,
            name: 'Pull-Up',
            description: 'An upper body compound exercise that primarily targets the back muscles.',
            primaryMuscle: 'Back',
            secondaryMuscles: ['Biceps', 'Shoulders'],
            equipment: 'Pull-Up Bar',
            category: 'Bodyweight',
            difficulty: 'Advanced',
            imageUrl: 'https://example.com/pull-up.jpg',
            videoUrl: 'https://example.com/pull-up-video.mp4',
            instructions: '1. Grip the pull-up bar with palms facing away from you.\n2. Hang with arms fully extended.\n3. Pull your body up until your chin clears the bar.\n4. Lower your body back to the starting position with control.',
            createdAt: '2023-01-17T12:10:00Z',
            updatedAt: '2023-02-22T16:25:00Z'
          },
          {
            id: 4,
            name: 'Push-Up',
            description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
            primaryMuscle: 'Chest',
            secondaryMuscles: ['Shoulders', 'Triceps', 'Core'],
            equipment: 'None',
            category: 'Bodyweight',
            difficulty: 'Beginner',
            imageUrl: 'https://example.com/push-up.jpg',
            videoUrl: null,
            instructions: '1. Start in a plank position with hands slightly wider than shoulder-width.\n2. Lower your body until your chest nearly touches the floor.\n3. Push back up to the starting position.\n4. Keep your body in a straight line throughout the movement.',
            createdAt: '2023-01-18T09:15:00Z',
            updatedAt: '2023-02-23T11:30:00Z'
          },
          {
            id: 5,
            name: 'Deadlift',
            description: 'A compound strength exercise that targets multiple muscle groups.',
            primaryMuscle: 'Back',
            secondaryMuscles: ['Legs', 'Glutes', 'Core'],
            equipment: 'Barbell',
            category: 'Strength',
            difficulty: 'Intermediate',
            imageUrl: 'https://example.com/deadlift.jpg',
            videoUrl: 'https://example.com/deadlift-video.mp4',
            instructions: '1. Stand with feet hip-width apart, barbell over midfoot.\n2. Bend at hips and knees to grip the bar.\n3. Lift the bar by straightening your hips and knees.\n4. Return the bar to the floor with control.',
            createdAt: '2023-01-19T14:45:00Z',
            updatedAt: '2023-02-24T16:20:00Z'
          },
          {
            id: 6,
            name: 'Dumbbell Shoulder Press',
            description: 'An isolation exercise for building shoulder strength and size.',
            primaryMuscle: 'Shoulders',
            secondaryMuscles: ['Triceps'],
            equipment: 'Dumbbells',
            category: 'Strength',
            difficulty: 'Intermediate',
            imageUrl: 'https://example.com/shoulder-press.jpg',
            videoUrl: null,
            instructions: '1. Sit on a bench with back support.\n2. Hold dumbbells at shoulder height with palms facing forward.\n3. Press the weights upward until arms are extended.\n4. Lower the weights back to shoulder level.',
            createdAt: '2023-01-20T10:30:00Z',
            updatedAt: '2023-02-25T12:15:00Z'
          }
        ];
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use dados da API ou os dados de exemplo
        setExercises(exampleData);
        setFilteredExercises(exampleData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      getExercises();
    }
  }, [isOpen]);
  
  // Inicializar selectedIds com props
  useEffect(() => {
    setSelectedIds(selectedExerciseIds);
  }, [selectedExerciseIds, isOpen]);
  
  // Filtrar exercícios
  useEffect(() => {
    let result = [...exercises];
    
    // Aplicar filtro de pesquisa
    if (search) {
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Aplicar filtro de grupo muscular
    if (filter !== 'all') {
      result = result.filter(ex => 
        ex.primaryMuscle.toLowerCase() === filter.toLowerCase() ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some(m => 
          m.toLowerCase() === filter.toLowerCase()
        ))
      );
    }
    
    setFilteredExercises(result);
  }, [search, filter, exercises]);
  
  // Toggle seleção de exercício
  const toggleSelectExercise = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Confirmar seleção de exercícios
  const handleConfirm = () => {
    const selectedExercises = exercises.filter(ex => selectedIds.includes(ex.id));
    onSelectExercises(selectedExercises);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Select Exercises</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FilterBar>
            <SearchInput>
              <FiSearch />
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchInput>
            
            <FilterSelect
              value={filter}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            >
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle.toLowerCase()}>
                  {muscle}
                </option>
              ))}
            </FilterSelect>
          </FilterBar>
          
          {loading ? (
            <LoadingWrapper>
              <LoadingIcon />
            </LoadingWrapper>
          ) : filteredExercises.length > 0 ? (
            <ExerciseGrid>
              {filteredExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  selected={selectedIds.includes(exercise.id)}
                  onClick={() => toggleSelectExercise(exercise.id)}
                >
                  <ExerciseImageContainer>
                    {exercise.imageUrl ? (
                      <ExerciseImage src={exercise.imageUrl} alt={exercise.name} />
                    ) : (
                      <ExercisePlaceholder>
                        <FiImage />
                        <span>No Image</span>
                      </ExercisePlaceholder>
                    )}
                    <MuscleTargetIndicator>{exercise.primaryMuscle}</MuscleTargetIndicator>
                    {selectedIds.includes(exercise.id) && (
                      <SelectedIndicator>
                        <FiCheck size={16} />
                      </SelectedIndicator>
                    )}
                  </ExerciseImageContainer>
                  
                  <ExerciseContent>
                    <ExerciseName>{exercise.name}</ExerciseName>
                    <ExerciseCategory>
                      {exercise.equipment} • {exercise.category}
                    </ExerciseCategory>
                  </ExerciseContent>
                </ExerciseCard>
              ))}
            </ExerciseGrid>
          ) : (
            <NoResultsMessage>
              No exercises found. Try adjusting your search or filters.
            </NoResultsMessage>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button secondary onClick={onClose}>
            <FiX /> Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <FiCheck /> Add Selected ({selectedIds.length})
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExerciseSelector;