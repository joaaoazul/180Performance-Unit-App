import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiChevronLeft, FiPieChart, FiSave, FiPlus, FiTrash2, 
  FiMove, FiRefreshCw, FiX, FiInfo, FiSearch, FiClock
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

const MacroSlider = styled.div`
  margin: 20px 0;
`;

const SliderContainer = styled.div`
  margin-bottom: 16px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SliderValue = styled.div`
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
`;

const SliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #E2E8F0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.color || '#10B981'};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.color || '#10B981'};
    cursor: pointer;
    border: none;
  }
`;

const MacroSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #F8FAFC;
`;

const MacroChart = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #3B82F6 0% ${props => props.protein}%, 
    #10B981 ${props => props.protein}% ${props => props.protein + props.carbs}%, 
    #F59E0B ${props => props.protein + props.carbs}% 100%
  );
`;

const MacroLegend = styled.div`
  flex: 1;
`;

const MacroItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const MacroColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.color};
`;

const MacroText = styled.div`
  font-size: 14px;
  color: #1E293B;
`;

const MacroPercentage = styled.span`
  font-weight: 600;
  margin-right: 5px;
`;

const MealContainer = styled.div`
  margin-bottom: 24px;
`;

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MealTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const MealControls = styled.div`
  display: flex;
  gap: 8px;
`;

const AddMealButton = styled.button`
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

const MealList = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
`;

const MealItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #E2E8F0;
  background: ${props => props.isDragging ? '#F1F5F9' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MealFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const MealNumber = styled.div`
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

const MealFormControls = styled.div`
  display: flex;
  gap: 8px;
`;

const MealControl = styled.button`
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

const SearchFoodButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #F1F5F9;
  color: #64748B;
  border: 1px solid #E2E8F0;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #E2E8F0;
  }
`;

const MealFormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FoodList = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  margin-top: 16px;
`;

const FoodItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FoodInfo = styled.div``;

const FoodName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
`;

const FoodDetails = styled.div`
  font-size: 13px;
  color: #64748B;
  margin-top: 4px;
  display: flex;
  gap: 8px;
`;

const FoodDetail = styled.span``;

const RemoveFoodButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: #F1F5F9;
  color: #64748B;
  cursor: pointer;
  
  &:hover {
    background: #E2E8F0;
    color: #EF4444;
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
  background: ${props => props.secondary ? 'white' : '#10B981'};
  color: ${props => props.secondary ? '#64748B' : 'white'};
  
  &:hover {
    background: ${props => props.secondary ? '#F8FAFC' : '#0D9668'};
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
  height: 100px;
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

// Modal para seleção de alimentos
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
  max-width: 800px;
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

// Componente principal
// Add this just before the CreateNutrition component
const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;

  svg {
    color: #64748B;
    flex-shrink: 0;
  }

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #1E293B;
    width: 100%;

    &::placeholder {
      color: #94A3B8;
    }
  }

  &:focus-within {
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const CreateNutrition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentMealIndex, setCurrentMealIndex] = useState(null);
  const [foodSelectorOpen, setFoodSelectorOpen] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    targetCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30
    },
    meals: [
      {
        name: 'Breakfast',
        time: '08:00',
        items: []
      }
    ],
    notes: ''
  });
  
  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchProtectedData();
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Manipulador de mudança nos campos principais
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'targetCalories') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Manipulador para alterações nos macronutrientes
  const handleMacroChange = (macro, value) => {
    const newValue = parseInt(value);
    
    // Ajustar outros macros proporcionalmente
    const currentTotal = Object.values(formData.macroSplit).reduce((a, b) => a + b, 0);
    const diff = newValue - formData.macroSplit[macro];
    
    // Não permitir valores negativos ou acima de 100%
    if (currentTotal + diff > 100) return;
    
    const otherMacros = Object.keys(formData.macroSplit).filter(m => m !== macro);
    const otherTotal = otherMacros.reduce((sum, m) => sum + formData.macroSplit[m], 0);
    
    if (otherTotal === 0) {
      // Se os outros macros somam 0, não podemos ajustar proporcionalmente
      setFormData({
        ...formData,
        macroSplit: {
          ...formData.macroSplit,
          [macro]: newValue
        }
      });
      return;
    }
    
    // Calcular novos valores mantendo proporção
    const newMacroSplit = { ...formData.macroSplit, [macro]: newValue };
    
    // Ajustar para garantir que a soma seja 100%
    const newTotal = Object.values(newMacroSplit).reduce((a, b) => a + b, 0);
    if (newTotal !== 100) {
      const remaining = 100 - newValue;
      
      // Distribuir o restante proporcionalmente
      otherMacros.forEach(m => {
        const proportion = formData.macroSplit[m] / otherTotal;
        newMacroSplit[m] = Math.round(remaining * proportion);
      });
      
      // Ajuste final para garantir exatamente 100%
      const finalTotal = Object.values(newMacroSplit).reduce((a, b) => a + b, 0);
      if (finalTotal !== 100) {
        const lastMacro = otherMacros[otherMacros.length - 1];
        newMacroSplit[lastMacro] += (100 - finalTotal);
      }
    }
    
    setFormData({
      ...formData,
      macroSplit: newMacroSplit
    });
  };
  
  // Manipulador de mudança nas refeições
  const handleMealChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMeals = [...formData.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };
  
  // Adicionar refeição
  const handleAddMeal = () => {
    setFormData({
      ...formData,
      meals: [
        ...formData.meals,
        {
          name: `Meal ${formData.meals.length + 1}`,
          time: '',
          items: []
        }
      ]
    });
  };
  
  // Remover refeição
  const handleRemoveMeal = (index) => {
    if (formData.meals.length === 1) {
      return; // Manter pelo menos uma refeição
    }
    
    const updatedMeals = formData.meals.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };
  
  // Mover refeição para cima
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const updatedMeals = [...formData.meals];
    const temp = updatedMeals[index];
    updatedMeals[index] = updatedMeals[index - 1];
    updatedMeals[index - 1] = temp;
    
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };
  
  // Mover refeição para baixo
  const handleMoveDown = (index) => {
    if (index === formData.meals.length - 1) return;
    
    const updatedMeals = [...formData.meals];
    const temp = updatedMeals[index];
    updatedMeals[index] = updatedMeals[index + 1];
    updatedMeals[index + 1] = temp;
    
    setFormData({
      ...formData,
      meals: updatedMeals
    });
  };
  
  // Abrir seletor de alimentos
  const handleOpenFoodSelector = (index) => {
    setCurrentMealIndex(index);
    setFoodSelectorOpen(true);
  };
  
  // Adicionar alimento a uma refeição
  const handleAddFoodToMeal = (foods) => {
    if (currentMealIndex === null) return;
    
    const updatedMeals = [...formData.meals];
    const currentMeal = updatedMeals[currentMealIndex];
    
    // Adicione os alimentos selecionados à refeição atual
    const newItems = foods.map(food => ({
      id: Date.now() + Math.random(), // ID único temporário
      foodId: food.id,
      name: food.name,
      quantity: food.defaultQuantity,
      unit: food.defaultUnit,
      calories: Math.round(food.nutritionPer100g.calories * (food.defaultQuantity / 100)),
      protein: +(food.nutritionPer100g.protein * (food.defaultQuantity / 100)).toFixed(1),
      carbs: +(food.nutritionPer100g.carbs * (food.defaultQuantity / 100)).toFixed(1),
      fat: +(food.nutritionPer100g.fat * (food.defaultQuantity / 100)).toFixed(1)
    }));
    
    currentMeal.items = [...currentMeal.items, ...newItems];
    
    setFormData({
      ...formData,
      meals: updatedMeals
    });
    
    setFoodSelectorOpen(false);
    setCurrentMealIndex(null);
  };
  
  // Remover alimento de uma refeição
  const handleRemoveFoodFromMeal = (mealIndex, itemIndex) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].items.splice(itemIndex, 1);
    
    setFormData({
      ...formData,
      meals: updatedMeals
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
      errors.type = 'Nutrition plan type is required';
    }
    
    if (!formData.targetCalories) {
      errors.targetCalories = 'Target calories are required';
    } else if (formData.targetCalories < 500 || formData.targetCalories > 10000) {
      errors.targetCalories = 'Target calories should be between 500 and 10000';
    }
    
    // Validar refeições
    formData.meals.forEach((meal, index) => {
      if (!meal.name.trim()) {
        errors[`meals[${index}].name`] = 'Meal name is required';
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
      // const response = await api.post('/api/nutrition-plans', formData);
      
      // Simulação de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a lista de planos nutricionais
      navigate('/nutrition');
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      // Mostrar mensagem de erro
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar e voltar para a lista
  const handleCancel = () => {
    navigate('/nutrition');
  };
  
  // Dados para o formulário
  const dietTypes = [
    { value: 'lowcarb', label: 'Low Carb' },
    { value: 'keto', label: 'Keto' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'bulking', label: 'Bulking' },
    { value: 'cutting', label: 'Cutting' },
    { value: 'custom', label: 'Custom' }
  ];
  
  // Exemplo de alimentos para o seletor (na implementação real seria buscado da API)
  const sampleFoods = [
    {
      id: 1,
      name: 'Chicken Breast',
      category: 'Proteins',
      defaultQuantity: 100,
      defaultUnit: 'g',
      nutritionPer100g: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0
      }
    },
    {
      id: 2,
      name: 'Brown Rice',
      category: 'Carbs',
      defaultQuantity: 100,
      defaultUnit: 'g',
      nutritionPer100g: {
        calories: 112,
        protein: 2.6,
        carbs: 24,
        fat: 0.9,
        fiber: 1.8,
        sugar: 0.4
      }
    },
    {
      id: 3,
      name: 'Avocado',
      category: 'Fats',
      defaultQuantity: 100,
      defaultUnit: 'g',
      nutritionPer100g: {
        calories: 160,
        protein: 2,
        carbs: 8.5,
        fat: 14.7,
        fiber: 6.7,
        sugar: 0.7
      }
    }
  ];
  
  return (
    <MainLayout>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BackButton to="/nutrition">
            <FiChevronLeft /> Back to Nutrition Plans
          </BackButton>
          <PageTitle>Create Nutrition Plan</PageTitle>
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
              <FiPieChart size={20} color="#10B981" />
              <FormTitle>Nutrition Plan Details</FormTitle>
            </FormHeader>
            
            <FormContent>
              <InfoBox>
                <InfoIcon>
                  <FiInfo />
                </InfoIcon>
                <InfoText>
                  Create a nutrition plan by filling in the details below. You can set your macronutrient distribution and add meals with specific foods.
                </InfoText>
              </InfoBox>
              
              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="title">Plan Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Low Carb Diet Plan, Bulking Plan, Weight Loss Plan"
                  />
                  {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="type">Plan Type *</Label>
                    <Select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      {dietTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                    {formErrors.type && <ErrorMessage>{formErrors.type}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="targetCalories">Target Daily Calories *</Label>
                    <Input
                      id="targetCalories"
                      name="targetCalories"
                      type="number"
                      min="500"
                      max="10000"
                      step="50"
                      value={formData.targetCalories}
                      onChange={handleChange}
                      placeholder="e.g., 2000"
                    />
                    {formErrors.targetCalories && <ErrorMessage>{formErrors.targetCalories}</ErrorMessage>}
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the nutrition plan, its goals, target audience, etc."
                  />
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>
                  <FiPieChart size={16} />
                  Macronutrient Distribution
                </SectionTitle>
                
                <MacroSlider>
                  <SliderContainer>
                    <SliderLabel>
                      <SliderName>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#3B82F6' }}></div>
                        Protein
                      </SliderName>
                      <SliderValue>{formData.macroSplit.protein}%</SliderValue>
                    </SliderLabel>
                    <SliderInput
                      type="range"
                      min="0"
                      max="100"
                      value={formData.macroSplit.protein}
                      onChange={(e) => handleMacroChange('protein', e.target.value)}
                      color="#3B82F6"
                    />
                  </SliderContainer>
                  
                  <SliderContainer>
                    <SliderLabel>
                      <SliderName>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#10B981' }}></div>
                        Carbohydrates
                      </SliderName>
                      <SliderValue>{formData.macroSplit.carbs}%</SliderValue>
                    </SliderLabel>
                    <SliderInput
                      type="range"
                      min="0"
                      max="100"
                      value={formData.macroSplit.carbs}
                      onChange={(e) => handleMacroChange('carbs', e.target.value)}
                      color="#10B981"
                    />
                  </SliderContainer>
                  
                  <SliderContainer>
                    <SliderLabel>
                      <SliderName>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F59E0B' }}></div>
                        Fat
                      </SliderName>
                      <SliderValue>{formData.macroSplit.fat}%</SliderValue>
                    </SliderLabel>
                    <SliderInput
                      type="range"
                      min="0"
                      max="100"
                      value={formData.macroSplit.fat}
                      onChange={(e) => handleMacroChange('fat', e.target.value)}
                      color="#F59E0B"
                    />
                  </SliderContainer>
                </MacroSlider>
                
                <MacroSummary>
                  <MacroChart
                    protein={formData.macroSplit.protein}
                    carbs={formData.macroSplit.carbs}
                  />
                  <MacroLegend>
                    <MacroItem>
                      <MacroColor color="#3B82F6" />
                      <MacroText>
                        <MacroPercentage>{formData.macroSplit.protein}%</MacroPercentage>
                        Protein: {Math.round(formData.targetCalories * (formData.macroSplit.protein / 100) / 4)}g
                      </MacroText>
                    </MacroItem>
                    <MacroItem>
                      <MacroColor color="#10B981" />
                      <MacroText>
                        <MacroPercentage>{formData.macroSplit.carbs}%</MacroPercentage>
                        Carbs: {Math.round(formData.targetCalories * (formData.macroSplit.carbs / 100) / 4)}g
                      </MacroText>
                    </MacroItem>
                    <MacroItem>
                      <MacroColor color="#F59E0B" />
                      <MacroText>
                        <MacroPercentage>{formData.macroSplit.fat}%</MacroPercentage>
                        Fat: {Math.round(formData.targetCalories * (formData.macroSplit.fat / 100) / 9)}g
                      </MacroText>
                    </MacroItem>
                  </MacroLegend>
                </MacroSummary>
              </FormSection>
              
              <FormSection>
                <SectionTitle>
                  <FiClock size={16} />
                  Meals
                </SectionTitle>
                
                <MealContainer>
                  <MealHeader>
                    <MealTitle>Daily Meals</MealTitle>
                    <AddMealButton type="button" onClick={handleAddMeal}>
                      <FiPlus size={14} /> Add Meal
                    </AddMealButton>
                  </MealHeader>
                  
                  <MealList>
                    {formData.meals.map((meal, index) => (
                      <MealItem key={index}>
                        <MealFormHeader>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MealNumber>{index + 1}</MealNumber>
                            <Label htmlFor={`meal-${index}-name`} style={{ margin: 0 }}>
                              {meal.name || 'New Meal'}
                            </Label>
                          </div>
                          
                          <MealFormControls>
                            <MealControl
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              <FiMove size={14} />
                            </MealControl>
                            <MealControl
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === formData.meals.length - 1}
                              title="Move Down"
                            >
                              <FiMove size={14} />
                            </MealControl>
                            <MealControl
                              type="button"
                              danger
                              onClick={() => handleRemoveMeal(index)}
                              disabled={formData.meals.length === 1}
                              title="Remove Meal"
                            >
                              <FiTrash2 size={14} />
                            </MealControl>
                          </MealFormControls>
                        </MealFormHeader>
                        
                        <MealFormGrid>
                          <FormGroup>
                            <Label htmlFor={`meal-${index}-name`}>Meal Name *</Label>
                            <Input
                              id={`meal-${index}-name`}
                              name="name"
                              value={meal.name}
                              onChange={(e) => handleMealChange(index, e)}
                              placeholder="e.g., Breakfast, Lunch, Dinner"
                            />
                            {formErrors[`meals[${index}].name`] && (
                              <ErrorMessage>{formErrors[`meals[${index}].name`]}</ErrorMessage>
                            )}
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor={`meal-${index}-time`}>Time (optional)</Label>
                            <Input
                              id={`meal-${index}-time`}
                              name="time"
                              type="time"
                              value={meal.time}
                              onChange={(e) => handleMealChange(index, e)}
                            />
                          </FormGroup>
                        </MealFormGrid>
                        
                        <div style={{ marginTop: '16px' }}>
                          <Label>Food Items</Label>
                          
                          <SearchFoodButton 
                            type="button"
                            onClick={() => handleOpenFoodSelector(index)}
                          >
                            <FiSearch size={14} /> Add Food Items
                          </SearchFoodButton>
                          
                          {meal.items.length > 0 ? (
                            <FoodList>
                              {meal.items.map((item, itemIndex) => (
                                <FoodItem key={itemIndex}>
                                  <FoodInfo>
                                    <FoodName>{item.name}</FoodName>
                                    <FoodDetails>
                                      <FoodDetail>{item.quantity} {item.unit}</FoodDetail>
                                      <FoodDetail>{item.calories} kcal</FoodDetail>
                                      <FoodDetail>P: {item.protein}g</FoodDetail>
                                      <FoodDetail>C: {item.carbs}g</FoodDetail>
                                      <FoodDetail>F: {item.fat}g</FoodDetail>
                                    </FoodDetails>
                                  </FoodInfo>
                                  <RemoveFoodButton
                                    type="button"
                                    onClick={() => handleRemoveFoodFromMeal(index, itemIndex)}
                                  >
                                    <FiX size={14} />
                                  </RemoveFoodButton>
                                </FoodItem>
                              ))}
                            </FoodList>
                          ) : (
                            <div style={{ 
                              padding: '16px', 
                              color: '#64748B', 
                              textAlign: 'center',
                              background: '#F8FAFC',
                              borderRadius: '8px',
                              marginTop: '16px'
                            }}>
                              No food items added yet
                            </div>
                          )}
                        </div>
                      </MealItem>
                    ))}
                  </MealList>
                </MealContainer>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Additional Notes</SectionTitle>
                <FormGroup>
                  <TextArea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes or instructions for the nutrition plan..."
                  />
                </FormGroup>
              </FormSection>
              
              <ButtonsContainer>
                <Button type="button" secondary onClick={handleCancel}>
                  <FiX /> Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <FiSave /> Save Nutrition Plan
                </Button>
              </ButtonsContainer>
            </FormContent>
          </FormContainer>
        </form>
      )}
      
      <Modal isOpen={foodSelectorOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Select Food Items</ModalTitle>
            <CloseButton onClick={() => setFoodSelectorOpen(false)}>
              <FiX />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <div style={{ marginBottom: '20px' }}>
              <SearchInput>
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search foods..."
                />
              </SearchInput>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Label>Available Foods</Label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {sampleFoods.map(food => (
                  <div 
                    key={food.id} 
                    style={{ 
                      padding: '16px', 
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleAddFoodToMeal([food])}
                  >
                    <div style={{ fontWeight: 500, marginBottom: '8px' }}>{food.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      {food.defaultQuantity} {food.defaultUnit} • {food.nutritionPer100g.calories} kcal per 100g
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      fontSize: '12px',
                      marginTop: '8px'
                    }}>
                      <span>P: {food.nutritionPer100g.protein}g</span>
                      <span>C: {food.nutritionPer100g.carbs}g</span>
                      <span>F: {food.nutritionPer100g.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button secondary onClick={() => setFoodSelectorOpen(false)}>
              <FiX /> Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
};

export default CreateNutrition;