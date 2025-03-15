// src/pages/workouts/WorkoutsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, FiSearch, FiFilter, FiMoreVertical, 
  FiEdit2, FiTrash2, FiEye, FiRefreshCw, FiCopy 
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

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 200px;
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

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E2E8F0;
  background: white;
  color: #64748B;
  
  &:hover {
    background: #F8FAFC;
  }
`;

const Select = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: white;
  font-size: 14px;
  color: #64748B;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

const Grid = styled.div`
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

const WorkoutHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const WorkoutTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 5px;
`;

const WorkoutType = styled.div`
  font-size: 12px;
  color: #64748B;
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background: #F1F5F9;
  }
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
  
  &:hover {
    background: ${props => props.danger ? '#FEF2F2' : '#F8FAFC'};
  }
`;

const WorkoutContent = styled.div`
  padding: 20px;
`;

const MetaList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.div`
  font-size: 12px;
  color: #64748B;
  margin-bottom: 3px;
`;

const MetaValue = styled.div`
  font-size: 14px;
  color: #1E293B;
  font-weight: 500;
`;

const ExerciseList = styled.div`
  margin-top: 16px;
`;

const ExerciseListTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin: 0 0 10px;
`;

const ExerciseItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 13px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseName = styled.div`
  color: #1E293B;
`;

const ExerciseDetails = styled.div`
  color: #64748B;
`;

const CardFooter = styled.div`
  display: flex;
  border-top: 1px solid #F1F5F9;
`;

const FooterButton = styled(Link)`
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  background: #F8FAFC;
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
  
  &:first-child {
    border-right: 1px solid #F1F5F9;
  }
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

// Função principal do componente
const WorkoutsList = () => {
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  
  // Carregar dados dos treinos
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        
        // Verificar autenticação
        await fetchProtectedData();
        
        // Aqui você faria uma chamada para sua API
        // Exemplo: const response = await api.get('/workouts');
        
        // Dados mockados para demonstração
        setTimeout(() => {
          const mockWorkouts = [
            {
              id: 1,
              title: 'Treino A - Superiores',
              type: 'Força',
              description: 'Foco em peito, ombros e tríceps',
              difficulty: 'Intermediário',
              duration: 60,
              targetMuscles: 'Peito, Ombros, Tríceps',
              exercises: [
                { name: 'Supino Reto', detail: '4 x 12' },
                { name: 'Desenvolvimento', detail: '3 x 12' },
                { name: 'Tríceps Corda', detail: '3 x 15' },
                { name: 'Elevação Lateral', detail: '3 x 15' }
              ],
              createdAt: '10/03/2023'
            },
            {
              id: 2,
              title: 'Treino B - Inferiores',
              type: 'Força',
              description: 'Foco em pernas e glúteos',
              difficulty: 'Avançado',
              duration: 70,
              targetMuscles: 'Quadríceps, Glúteos, Posteriores',
              exercises: [
                { name: 'Agachamento', detail: '4 x 10' },
                { name: 'Leg Press', detail: '4 x 12' },
                { name: 'Stiff', detail: '3 x 12' },
                { name: 'Cadeira Extensora', detail: '3 x 15' }
              ],
              createdAt: '08/03/2023'
            },
            {
              id: 3,
              title: 'HIIT Cardio',
              type: 'Cardio',
              description: 'Treino de alta intensidade',
              difficulty: 'Intermediário',
              duration: 30,
              targetMuscles: 'Full Body',
              exercises: [
                { name: 'Burpees', detail: '45s' },
                { name: 'Mountain Climbers', detail: '45s' },
                { name: 'Jumping Jacks', detail: '45s' },
                { name: 'Descanso', detail: '15s' }
              ],
              createdAt: '05/03/2023'
            },
            {
              id: 4,
              title: 'Treino C - Costas e Bíceps',
              type: 'Força',
              description: 'Foco em costas e bíceps',
              difficulty: 'Iniciante',
              duration: 50,
              targetMuscles: 'Costas, Bíceps',
              exercises: [
                { name: 'Puxada Frontal', detail: '4 x 12' },
                { name: 'Remada Curvada', detail: '4 x 10' },
                { name: 'Rosca Direta', detail: '3 x 12' },
                { name: 'Rosca Martelo', detail: '3 x 12' }
              ],
              createdAt: '03/03/2023'
            }
          ];
          
          setWorkouts(mockWorkouts);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);
  
  // Filtrar treinos por busca e tipo
  const filteredWorkouts = workouts.filter(workout => 
    (workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     workout.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterType === 'all' || workout.type === filterType)
  );
  
  // Manipulador para o menu de ações
  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setOpenActionMenu(openActionMenu === id ? null : id);
  };
  
  // Manipulador para clicar fora do menu de ações
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Manipulador para duplicar treino
  const handleDuplicateWorkout = (id) => {
    // Aqui você faria uma chamada para sua API para duplicar o treino
    // Exemplo: await api.post(`/workouts/${id}/duplicate`);
    console.log(`Duplicando treino ${id}`);
    setOpenActionMenu(null);
  };
  
  // Manipulador para excluir treino
  const handleDeleteWorkout = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      // Aqui você faria uma chamada para sua API para excluir o treino
      // Exemplo: await api.delete(`/workouts/${id}`);
      console.log(`Excluindo treino ${id}`);
      // Atualizar estado
      setWorkouts(workouts.filter(workout => workout.id !== id));
      setOpenActionMenu(null);
    }
  };
  
  // Renderização condicional com base no estado de carregamento
  if (loading) {
    return (
      <MainLayout title="Treinos">
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Treinos">
      <PageHeader>
        <PageTitle>Treinos</PageTitle>
        <ActionButtons>
          <Button as={Link} to="/workouts/create">
            <FiPlus /> Criar Novo Treino
          </Button>
        </ActionButtons>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar por nome, descrição ou exercícios..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
        <Select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos os tipos</option>
          <option value="Força">Força</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibilidade">Flexibilidade</option>
          <option value="HIIT">HIIT</option>
          <option value="Funcional">Funcional</option>
        </Select>
        
        <FilterButton>
          <FiFilter /> Mais Filtros
        </FilterButton>
      </FilterBar>
      
      {filteredWorkouts.length > 0 ? (
        <Grid>
          {filteredWorkouts.map(workout => (
            <WorkoutCard key={workout.id}>
              <WorkoutHeader>
                <div>
                  <WorkoutTitle>{workout.title}</WorkoutTitle>
                  <WorkoutType>{workout.type}</WorkoutType>
                </div>
                <ActionMenu onClick={(e) => e.stopPropagation()}>
                  <ActionButton onClick={(e) => toggleActionMenu(workout.id, e)}>
                    <FiMoreVertical />
                  </ActionButton>
                  <ActionDropdown isOpen={openActionMenu === workout.id}>
                    <ActionItem as={Link} to={`/workouts/${workout.id}`}>
                      <FiEye /> Ver detalhes
                    </ActionItem>
                    <ActionItem as={Link} to={`/workouts/${workout.id}/edit`}>
                      <FiEdit2 /> Editar treino
                    </ActionItem>
                    <ActionItem onClick={() => handleDuplicateWorkout(workout.id)}>
                      <FiCopy /> Duplicar treino
                    </ActionItem>
                    <ActionItem danger onClick={() => handleDeleteWorkout(workout.id)}>
                      <FiTrash2 /> Excluir treino
                    </ActionItem>
                  </ActionDropdown>
                </ActionMenu>
              </WorkoutHeader>
              
              <WorkoutContent>
                <div>{workout.description}</div>
                
                <MetaList>
                  <MetaItem>
                    <MetaLabel>Duração</MetaLabel>
                    <MetaValue>{workout.duration} min</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Dificuldade</MetaLabel>
                    <MetaValue>{workout.difficulty}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Músculos</MetaLabel>
                    <MetaValue>{workout.targetMuscles}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Criado em</MetaLabel>
                    <MetaValue>{workout.createdAt}</MetaValue>
                  </MetaItem>
                </MetaList>
                
                <ExerciseList>
                  <ExerciseListTitle>Exercícios</ExerciseListTitle>
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <ExerciseItem key={index}>
                      <ExerciseName>{exercise.name}</ExerciseName>
                      <ExerciseDetails>{exercise.detail}</ExerciseDetails>
                    </ExerciseItem>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '8px', textAlign: 'center' }}>
                      +{workout.exercises.length - 3} mais exercícios
                    </div>
                  )}
                </ExerciseList>
              </WorkoutContent>
              
              <CardFooter>
                <FooterButton to={`/workouts/${workout.id}`}>
                  <FiEye /> Ver Detalhes
                </FooterButton>
                <FooterButton to={`/workouts/${workout.id}/edit`}>
                  <FiEdit2 /> Editar
                </FooterButton>
              </CardFooter>
            </WorkoutCard>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiRefreshCw />
          </EmptyIcon>
          <EmptyTitle>Nenhum treino encontrado</EmptyTitle>
          <EmptyDescription>
            {searchTerm || filterType !== 'all'
              ? `Não encontramos treinos com os filtros aplicados.`
              : 'Você ainda não criou nenhum treino.'}
          </EmptyDescription>
          <Button as={Link} to="/workouts/create">
            <FiPlus /> Criar Novo Treino
          </Button>
        </EmptyState>
      )}
    </MainLayout>
  );
};

export default WorkoutsList;