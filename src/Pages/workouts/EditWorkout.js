import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiChevronLeft, FiActivity, FiSave, FiPlus, FiTrash2, 
  FiMove, FiRefreshCw, FiX, FiInfo, FiEdit2, FiList
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

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FormHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const FormContent = styled.div`
  padding: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: ${props => props.flex || 1};
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 12px;
  margin-top: 5px;
`;

const ExerciseContainer = styled.div`
  margin-bottom: 24px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ExerciseTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const ExerciseControls = styled.div`
  display: flex;
  gap: 8px;
`;

const AddExerciseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #0D9668;
  }
`;

const ExerciseList = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
`;

const ExerciseItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
  background: ${props => props.isDragging ? '#F1F5F9' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ExerciseNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #64748B;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
`;

const ExerciseFormControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ExerciseControl = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background: ${props => props.danger ? '#FEE2E2' : '#F1F5F9'};
  color: ${props => props.danger ? '#EF4444' : '#64748B'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.danger ? '#FECACA' : '#E2E8F0'};
  }
`;

const ExerciseFormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
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
  background: ${props => props.secondary ? 'white' : props.danger ? '#EF4444' : '#10B981'};
  color: ${props => props.secondary ? '#64748B' : 'white'};
  
  &:hover {
    background: ${props => props.secondary ? '#F8FAFC' : props.danger ? '#DC2626' : '#0D9668'};
  }
  
  &:disabled {
    background: #94A3B8;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  padding: 16px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const InfoIcon = styled.div`
  color: #3B82F6;
  font-size: 20px;
  margin-top: 2px;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #1E293B;
  line-height: 1.5;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingIcon = styled(FiRefreshCw)`
  color: #10B981;
  font-size: 24px;
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
const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [originalWorkout, setOriginalWorkout] = useState(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: '',
    duration: '',
    targetMuscles: '',
    notes: '',
    exercises: []
  });
  
  // Fetch do treino para edição
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
        const workout = exampleWorkout; // ou response.data
        
        setOriginalWorkout(workout);
        
        // Preencher o formulário com os dados atuais do treino
        setFormData({
          title: workout.title,
          description: workout.description || '',
          type: workout.type,
          difficulty: workout.difficulty,
          duration: workout.duration || '',
          targetMuscles: workout.targetMuscles || '',
          notes: workout.notes || '',
          exercises: workout.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest || '',
            notes: ex.notes || ''
          }))
        });
      } catch (error) {
        console.error('Error fetching workout:', error);
        // Redirecionar em caso de erro
        navigate('/workouts');
      } finally {
        setLoading(false);
      }
    };
    
    getWorkout();
  }, [id, navigate]);
  
  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchProtectedData();
      } catch (error) {
        console.error('Erro de autenticação:', error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Manipulador de mudança nos campos principais
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Manipulador de mudança nos exercícios
  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
    
    // Limpar erros do exercício quando usuário digitar
    if (formErrors[`exercises[${index}].${name}`]) {
      setFormErrors({
        ...formErrors,
        [`exercises[${index}].${name}`]: null
      });
    }
  };
  
  // Adicionar exercício
  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          id: Date.now(), // ID temporário
          name: '',
          sets: '',
          reps: '',
          rest: '',
          notes: ''
        }
      ]
    });
  };
  
  // Remover exercício
  const handleRemoveExercise = (index) => {
    if (formData.exercises.length === 1) {
      return; // Manter pelo menos um exercício
    }
    
    const updatedExercises = formData.exercises.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
    
    // Limpar erros relacionados ao exercício removido
    const updatedErrors = { ...formErrors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`exercises[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    
    setFormErrors(updatedErrors);
  };
  
  // Mover exercício para cima
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const updatedExercises = [...formData.exercises];
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[index - 1];
    updatedExercises[index - 1] = temp;
    
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };
  
  // Mover exercício para baixo
  const handleMoveDown = (index) => {
    if (index === formData.exercises.length - 1) return;
    
    const updatedExercises = [...formData.exercises];
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[index + 1];
    updatedExercises[index + 1] = temp;
    
    setFormData({
      ...formData,
      exercises: updatedExercises
    });
  };
  
  // Validar formulário
  const validateForm = () => {
    const errors = {};
    
    // Validar campos obrigatórios
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.type) {
      errors.type = 'Workout type is required';
    }
    
    if (!formData.difficulty) {
      errors.difficulty = 'Difficulty level is required';
    }
    
    // Validar exercícios
    formData.exercises.forEach((exercise, index) => {
      if (!exercise.name.trim()) {
        errors[`exercises[${index}].name`] = 'Exercise name is required';
      }
      
      if (!exercise.sets) {
        errors[`exercises[${index}].sets`] = 'Sets are required';
      } else if (isNaN(exercise.sets) || parseInt(exercise.sets) <= 0) {
        errors[`exercises[${index}].sets`] = 'Sets must be a positive number';
      }
      
      if (!exercise.reps) {
        errors[`exercises[${index}].reps`] = 'Reps are required';
      } else if (isNaN(exercise.reps) && !exercise.reps.toLowerCase().includes('to failure')) {
        errors[`exercises[${index}].reps`] = 'Enter a number or "to failure"';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Enviar dados para API
      // const response = await api.put(`/api/workouts/${id}`, formData);
      
      // Simulação de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para detalhes do treino
      navigate(`/workouts/${id}`);
    } catch (error) {
      console.error('Error updating workout:', error);
      // Mostrar mensagem de erro
    } finally {
      setLoading(false);
    }
  };
  
  // Abrir diálogo de confirmação ao cancelar edição
  const openConfirmDialog = () => {
    // Verificar se houve alterações
    const hasChanges = JSON.stringify(formData) !== JSON.stringify({
      title: originalWorkout.title,
      description: originalWorkout.description || '',
      type: originalWorkout.type,
      difficulty: originalWorkout.difficulty,
      duration: originalWorkout.duration || '',
      targetMuscles: originalWorkout.targetMuscles || '',
      notes: originalWorkout.notes || '',
      exercises: originalWorkout.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest || '',
        notes: ex.notes || ''
      }))
    });
    
    if (hasChanges) {
      setConfirmOpen(true);
    } else {
      // Se não houver alterações, voltar direto
      navigate(`/workouts/${id}`);
    }
  };
  
  // Fechar diálogo de confirmação
  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };
  
  // Cancelar e voltar para os detalhes
  const handleCancel = () => {
    navigate(`/workouts/${id}`);
  };
  
  return (
    <MainLayout>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BackButton to={`/workouts/${id}`}>
            <FiChevronLeft /> Back to Workout
          </BackButton>
          <PageTitle>Edit Workout</PageTitle>
        </div>
      </PageHeader>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormContainer>
            <FormHeader>
              <FiEdit2 size={20} color="#10B981" />
              <FormTitle>Workout Details</FormTitle>
            </FormHeader>
            
            <FormContent>
              <InfoBox>
                <InfoIcon>
                  <FiInfo />
                </InfoIcon>
                <InfoText>
                  Edit your workout details below. You can modify exercise details, add new exercises, or change the order.
                </InfoText>
              </InfoBox>
              
              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="title">Workout Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Body Workout, Upper Body Push, Leg Day"
                  />
                  {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="type">Workout Type *</Label>
                    <Select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      <option value="strength">Strength Training</option>
                      <option value="cardio">Cardio</option>
                      <option value="hiit">HIIT</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="bodyweight">Bodyweight</option>
                      <option value="crossfit">CrossFit</option>
                      <option value="custom">Custom</option>
                    </Select>
                    {formErrors.type && <ErrorMessage>{formErrors.type}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                    >
                      <option value="">Select difficulty</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </Select>
                    {formErrors.difficulty && <ErrorMessage>{formErrors.difficulty}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 45"
                    />
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the workout purpose, goals, or any special instructions..."
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="targetMuscles">Target Muscle Groups</Label>
                  <Input
                    id="targetMuscles"
                    name="targetMuscles"
                    value={formData.targetMuscles}
                    onChange={handleChange}
                    placeholder="e.g., Chest, Back, Legs, Shoulders, etc."
                  />
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>
                  <FiList size={16} />
                  Exercises
                </SectionTitle>
                
                <ExerciseContainer>
                  <ExerciseHeader>
                    <ExerciseTitle>Exercise List</ExerciseTitle>
                    <AddExerciseButton type="button" onClick={handleAddExercise}>
                      <FiPlus size={14} /> Add Exercise
                    </AddExerciseButton>
                  </ExerciseHeader>
                  
                  <ExerciseList>
                    {formData.exercises.map((exercise, index) => (
                      <ExerciseItem key={exercise.id || index}>
                        <ExerciseFormHeader>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ExerciseNumber>{index + 1}</ExerciseNumber>
                            <Label htmlFor={`exercise-${index}-name`} style={{ margin: 0 }}>
                              {exercise.name || 'New Exercise'}
                            </Label>
                          </div>
                          
                          <ExerciseFormControls>
                            <ExerciseControl
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              <FiMove size={14} />
                            </ExerciseControl>
                            <ExerciseControl
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === formData.exercises.length - 1}
                              title="Move Down"
                            >
                              <FiMove size={14} />
                            </ExerciseControl>
                            <ExerciseControl
                              type="button"
                              danger
                              onClick={() => handleRemoveExercise(index)}
                              disabled={formData.exercises.length === 1}
                              title="Remove Exercise"
                            >
                              <FiTrash2 size={14} />
                            </ExerciseControl>
                          </ExerciseFormControls>
                        </ExerciseFormHeader>
                        
                        <ExerciseFormGrid>
                          <FormGroup>
                            <Label htmlFor={`exercise-${index}-name`}>Exercise Name *</Label>
                            <Input
                              id={`exercise-${index}-name`}
                              name="name"
                              value={exercise.name}
                              onChange={(e) => handleExerciseChange(index, e)}
                              placeholder="e.g., Bench Press, Squat, etc."
                            />
                            {formErrors[`exercises[${index}].name`] && (
                              <ErrorMessage>{formErrors[`exercises[${index}].name`]}</ErrorMessage>
                            )}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor={`exercise-${index}-sets`}>Sets *</Label>
                            <Input
                              id={`exercise-${index}-sets`}
                              name="sets"
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => handleExerciseChange(index, e)}
                              placeholder="e.g., 3"
                            />
                            {formErrors[`exercises[${index}].sets`] && (
                              <ErrorMessage>{formErrors[`exercises[${index}].sets`]}</ErrorMessage>
                            )}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor={`exercise-${index}-reps`}>Reps *</Label>
                            <Input
                              id={`exercise-${index}-reps`}
                              name="reps"
                              value={exercise.reps}
                              onChange={(e) => handleExerciseChange(index, e)}
                              placeholder="e.g., 10 or '8-12' or 'failure'"
                            />
                            {formErrors[`exercises[${index}].reps`] && (
                              <ErrorMessage>{formErrors[`exercises[${index}].reps`]}</ErrorMessage>
                            )}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor={`exercise-${index}-rest`}>Rest (seconds)</Label>
                            <Input
                              id={`exercise-${index}-rest`}
                              name="rest"
                              type="number"
                              min="0"
                              value={exercise.rest}
                              onChange={(e) => handleExerciseChange(index, e)}
                              placeholder="e.g., 90"
                            />
                          </FormGroup>
                          
                          <FormGroup style={{ gridColumn: '1 / -1' }}>
                            <Label htmlFor={`exercise-${index}-notes`}>Notes</Label>
                            <Input
                              id={`exercise-${index}-notes`}
                              name="notes"
                              value={exercise.notes}
                              onChange={(e) => handleExerciseChange(index, e)}
                              placeholder="e.g., Focus on form, slow negatives, etc."
                            />
                          </FormGroup>
                        </ExerciseFormGrid>
                      </ExerciseItem>
                    ))}
                  </ExerciseList>
                </ExerciseContainer>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Additional Notes</SectionTitle>
                <FormGroup>
                  <TextArea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes or instructions for the workout..."
                  />
                </FormGroup>
              </FormSection>
              
              <ButtonsContainer>
                <Button type="button" secondary onClick={openConfirmDialog}>
                  <FiX /> Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <FiSave /> Save Changes
                </Button>
              </ButtonsContainer>
            </FormContent>
          </FormContainer>
        </form>
      )}
      
      <ConfirmDialog isOpen={confirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes</DialogTitle>
          </DialogHeader>
          
          <DialogBody>
            <DialogText>
              You have unsaved changes. Are you sure you want to discard them?
            </DialogText>
          </DialogBody>
          
          <DialogFooter>
            <Button secondary onClick={closeConfirmDialog}>
              Continue Editing
            </Button>
            <Button danger onClick={handleCancel}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </ConfirmDialog>
    </MainLayout>
  );
};

export default EditWorkout;