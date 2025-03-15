import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, FiSearch, FiFilter, FiChevronLeft, FiRefreshCw,
  FiVideo, FiImage, FiInfo, FiCopy, FiX, FiCheck,
  FiEye, FiEdit2, FiTrash2, FiMoreVertical
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ExerciseCard = styled.div`
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

const ExerciseImageContainer = styled.div`
  height: 180px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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
  
  svg {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 12px;
  }
`;

const VideoIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MuscleTargetIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(16, 185, 129, 0.8);
  color: white;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
`;

const ExerciseContent = styled.div`
  padding: 20px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ExerciseName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 5px;
`;

const ExerciseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #F1F5F9;
  color: #64748B;
`;

const ExerciseFooter = styled.div`
  border-top: 1px solid #F1F5F9;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
`;

const FooterText = styled.div`
  font-size: 13px;
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
  font-size: 14px;
  
  &:hover {
    background: ${props => props.danger ? '#FEF2F2' : '#F8FAFC'};
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

// Modal para adicionar/editar exercício
const Modal = styled.div`
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

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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

const FormGroup = styled.div`
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
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1E293B;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  
  & > * {
    flex: 1;
  }
`;

const FileInput = styled.div`
  width: 100%;
  border: 2px dashed #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #CBD5E1;
  }
  
  input {
    display: none;
  }
`;

const FileInputText = styled.div`
  font-size: 14px;
  color: #64748B;
  margin-top: 8px;
`;

const FilePreview = styled.div`
  margin-top: 16px;
  position: relative;
  display: ${props => props.hasFile ? 'block' : 'none'};
`;

const FilePreviewImage = styled.img`
  width: 100%;
  border-radius: 8px;
  max-height: 200px;
  object-fit: cover;
`;

const RemoveFileButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

// Componente principal
const ExerciseLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

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
        // Neste exemplo, usamos fetchProtectedData, mas você pode usar sua API
        const response = await fetchProtectedData('/api/exercises');
        
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
          }
        ];
        
        // Use dados da API ou os dados de exemplo
        setExercises(response?.data || exampleData);
        setFilteredExercises(response?.data || exampleData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getExercises();
  }, []);

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

  // Abrir modal para adicionar exercício
  const handleAddExercise = () => {
    setCurrentExercise(null);
    setModalOpen(true);
  };

  // Abrir modal para editar exercício
  const handleEditExercise = (exercise) => {
    setCurrentExercise(exercise);
    setModalOpen(true);
    setMenuOpen(null);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentExercise(null);
  };

  // Salvar exercício (adicionar ou atualizar)
  const handleSaveExercise = async (formData) => {
    try {
      setLoading(true);
      
      if (currentExercise) {
        // Atualizar exercício existente
        // await api.put(`/api/exercises/${currentExercise.id}`, formData);
        
        // Atualizar estado local
        const updatedExercises = exercises.map(ex => 
          ex.id === currentExercise.id ? { ...ex, ...formData } : ex
        );
        setExercises(updatedExercises);
      } else {
        // Adicionar novo exercício
        // const response = await api.post('/api/exercises', formData);
        
        // Atualizar estado local (simulado)
        const newExercise = {
          id: Date.now(), // Simulação de ID
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setExercises([...exercises, newExercise]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  // Excluir exercício
  const handleDeleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        setLoading(true);
        
        // await api.delete(`/api/exercises/${id}`);
        
        // Atualizar estado local
        const updatedExercises = exercises.filter(ex => ex.id !== id);
        setExercises(updatedExercises);
        
        setMenuOpen(null);
      } catch (error) {
        console.error('Error deleting exercise:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle menu de ações
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  // Formulário para adicionar/editar exercício
  const ExerciseForm = ({ exercise, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: exercise?.name || '',
      description: exercise?.description || '',
      primaryMuscle: exercise?.primaryMuscle || 'Chest',
      secondaryMuscles: exercise?.secondaryMuscles || [],
      equipment: exercise?.equipment || '',
      category: exercise?.category || 'Strength',
      difficulty: exercise?.difficulty || 'Beginner',
      instructions: exercise?.instructions || '',
      imageUrl: exercise?.imageUrl || '',
      videoUrl: exercise?.videoUrl || ''
    });
    
    const [imagePreview, setImagePreview] = useState(exercise?.imageUrl || '');
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
      const muscles = [...formData.secondaryMuscles];
      
      if (checked) {
        muscles.push(value);
      } else {
        const index = muscles.indexOf(value);
        if (index > -1) {
          muscles.splice(index, 1);
        }
      }
      
      setFormData(prev => ({ ...prev, secondaryMuscles: muscles }));
    };
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          // Na implementação real, você usaria upload de arquivo para uma CDN ou servidor
          setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    const handleRemoveImage = () => {
      setImagePreview('');
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Exercise Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        
        <InputGroup>
          <FormGroup>
            <Label htmlFor="primaryMuscle">Primary Muscle *</Label>
            <Select
              id="primaryMuscle"
              name="primaryMuscle"
              value={formData.primaryMuscle}
              onChange={handleChange}
              required
            >
              {muscleGroups.filter(m => m !== 'All').map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="equipment">Equipment</Label>
            <Input
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
            />
          </FormGroup>
        </InputGroup>
        
        <FormGroup>
          <Label>Secondary Muscles</Label>
          <CheckboxGroup>
            {muscleGroups
              .filter(m => m !== 'All' && m !== formData.primaryMuscle)
              .map(muscle => (
                <CheckboxLabel key={muscle}>
                  <Checkbox
                    type="checkbox"
                    value={muscle}
                    checked={formData.secondaryMuscles.includes(muscle)}
                    onChange={handleCheckboxChange}
                  />
                  {muscle}
                </CheckboxLabel>
              ))}
          </CheckboxGroup>
        </FormGroup>
        
        <InputGroup>
          <FormGroup>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Plyometric">Plyometric</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>
          </FormGroup>
        </InputGroup>
        
        <FormGroup>
          <Label htmlFor="instructions">Instructions</Label>
          <TextArea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter step-by-step instructions..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo etc.)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Exercise Image</Label>
          <FileInput>
            <FiImage size={24} color="#94A3B8" />
            <FileInputText>Click to upload an image</FileInputText>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FileInput>
          
          <FilePreview hasFile={imagePreview}>
            <FilePreviewImage src={imagePreview} alt="Preview" />
            <RemoveFileButton onClick={handleRemoveImage}>
              <FiX size={14} />
            </RemoveFileButton>
          </FilePreview>
        </FormGroup>
        
        <ModalFooter>
          <Button secondary type="button" onClick={onCancel}>
            <FiX /> Cancel
          </Button>
          <Button type="submit">
            <FiCheck /> Save Exercise
          </Button>
        </ModalFooter>
      </form>
    );
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Exercise Library</PageTitle>
        <ActionButtons>
          <Button onClick={handleAddExercise}>
            <FiPlus /> Add Exercise
          </Button>
        </ActionButtons>
      </PageHeader>

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
          onChange={(e) => setFilter(e.target.value)}
        >
          {muscleGroups.map(muscle => (
            <option 
              key={muscle} 
              value={muscle === 'All' ? 'all' : muscle.toLowerCase()}
            >
              {muscle}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      {loading ? (
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      ) : filteredExercises.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FiDumbbell />
          </EmptyIcon>
          <EmptyTitle>No exercises found</EmptyTitle>
          <EmptyDescription>
            {search || filter !== 'all' 
              ? "Try adjusting your search or filters"
              : "Get started by adding exercises to your library"}
          </EmptyDescription>
          <Button onClick={handleAddExercise}>
            <FiPlus /> Add Your First Exercise
          </Button>
        </EmptyState>
      ) : (
        <ExerciseGrid>
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id}>
              <ExerciseImageContainer>
                {exercise.imageUrl ? (
                  <ExerciseImage src={exercise.imageUrl} alt={exercise.name} />
                ) : (
                  <ExercisePlaceholder>
                    <FiImage />
                    <span>No image</span>
                  </ExercisePlaceholder>
                )}
                
                {exercise.videoUrl && (
                  <VideoIndicator>
                    <FiVideo size={12} /> Video
                  </VideoIndicator>
                )}
                
                <MuscleTargetIndicator>
                  {exercise.primaryMuscle}
                </MuscleTargetIndicator>
              </ExerciseImageContainer>
              
              <ExerciseContent>
                <ExerciseHeader>
                  <div>
                    <ExerciseName>{exercise.name}</ExerciseName>
                  </div>
                </ExerciseHeader>
                
                <ExerciseTags>
                  <Tag>{exercise.category}</Tag>
                  <Tag>{exercise.difficulty}</Tag>
                  {exercise.equipment && <Tag>{exercise.equipment}</Tag>}
                </ExerciseTags>
              </ExerciseContent>
              
              <ExerciseFooter>
                <FooterText>
                  {new Date(exercise.updatedAt).toLocaleDateString()}
                </FooterText>
                
                <ActionMenu>
                  <ActionButton onClick={() => toggleMenu(exercise.id)}>
                    <FiMoreVertical />
                  </ActionButton>
                  
                  <ActionDropdown isOpen={menuOpen === exercise.id}>
                    <ActionItem onClick={() => handleEditExercise(exercise)}>
                      <FiEdit2 size={14} /> Edit
                    </ActionItem>
                    <ActionItem>
                      <FiEye size={14} /> View Details
                    </ActionItem>
                    <ActionItem>
                      <FiCopy size={14} /> Duplicate
                    </ActionItem>
                    <ActionItem 
                      danger 
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      <FiTrash2 size={14} /> Delete
                    </ActionItem>
                  </ActionDropdown>
                </ActionMenu>
              </ExerciseFooter>
            </ExerciseCard>
          ))}
        </ExerciseGrid>
      )}

      <Modal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {currentExercise ? 'Edit Exercise' : 'Add New Exercise'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              <FiX />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <ExerciseForm 
              exercise={currentExercise}
              onSave={handleSaveExercise}
              onCancel={handleCloseModal}
            />
          </ModalBody>
        </ModalContent>
        </Modal>
    </MainLayout>
  );
};

export default ExerciseLibrary;