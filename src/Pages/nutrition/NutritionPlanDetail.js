import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiEdit2, FiChevronLeft, FiClock, FiTarget, FiPieChart,
  FiCalendar, FiUser, FiMoreVertical, FiTrash2, FiShare2,
  FiCopy, FiPrinter, FiDownload, FiRefreshCw, FiPlus,
  FiInfo, FiX, FiCheck
} from 'react-icons/fi';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';

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
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.secondary ? '#E2E8F0' : 'transparent'};
  background: ${props => props.secondary ? 'white' : '#10B981'};
  color: ${props => props.secondary ? '#64748B' : 'white'};
  
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
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

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PlanTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 5px;
`;

const PlanType = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => 
    props.type === 'lowcarb' ? '#E0F2FE' : 
    props.type === 'keto' ? '#F0FDF4' : 
    props.type === 'balanced' ? '#FEF3C7' : 
    props.type === 'bulking' ? '#F1F5F9' : 
    props.type === 'cutting' ? '#FEE2E2' : '#F8FAFC'
  };
  color: ${props => 
    props.type === 'lowcarb' ? '#0369A1' : 
    props.type === 'keto' ? '#16A34A' : 
    props.type === 'balanced' ? '#D97706' : 
    props.type === 'bulking' ? '#475569' : 
    props.type === 'cutting' ? '#B91C1C' : '#64748B'
  };
`;

const PlanDescription = styled.p`
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
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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

const MacroChart = styled.div`
  margin-top: 24px;
`;

const MacroChartHeader = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1E293B;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MacroBarContainer = styled.div`
  margin-bottom: 20px;
`;

const MacroBar = styled.div`
  height: 24px;
  width: 100%;
  background: #F1F5F9;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
`;

const MacroBarProtein = styled.div`
  height: 100%;
  background: #3B82F6;
  width: ${props => props.percentage}%;
`;

const MacroBarCarbs = styled.div`
  height: 100%;
  background: #10B981;
  width: ${props => props.percentage}%;
`;

const MacroBarFat = styled.div`
  height: 100%;
  background: #F59E0B;
  width: ${props => props.percentage}%;
`;

const MacroLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const MacroItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MacroColorBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: ${props => props.color};
`;

const MacroName = styled.span`
  font-size: 14px;
  color: #1E293B;
`;

const MacroValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
`;

const MealList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MealCard = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
`;

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
`;

const MealTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1E293B;
  margin: 0;
`;

const MealTime = styled.div`
  font-size: 14px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MealContent = styled.div`
  padding: 16px;
`;

const FoodList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FoodItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FoodName = styled.div`
  font-size: 14px;
  color: #1E293B;
`;

const FoodQuantity = styled.div`
  font-size: 14px;
  color: #64748B;
`;

const FoodNutrients = styled.div`
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #64748B;
`;

const FoodNutrient = styled.div`
  &:before {
    content: "${props => props.label}:";
    margin-right: 3px;
    font-weight: 500;
  }
`;

const MealSummary = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MealTotals = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
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

const ButtonContainer = styled.div`
  margin-top: 16px;
`;

const StartPlanButton = styled(Link)`
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
const NutritionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Fetch do plano de nutrição pelo ID
  useEffect(() => {
    const getNutritionPlan = async () => {
      try {
        setLoading(true);
        // Simulação de chamada à API
        // const response = await api.get(`/api/nutrition-plans/${id}`);
        
        // Dados de exemplo para desenvolvimento
        const examplePlan = {
          id: parseInt(id),
          title: "Plano de Dieta Low Carb",
          description: "Plano de alimentação com baixo teor de carboidratos para emagrecimento. Foco em proteínas e gorduras saudáveis com limitação de carboidratos refinados.",
          type: "lowcarb",
          targetCalories: 2000,
          macroSplit: {
            protein: 40, // porcentagem
            carbs: 20,
            fat: 40
          },
          mealsPerDay: 4,
          createdBy: "John Doe",
          createdAt: "2023-03-15T10:30:00Z",
          updatedAt: "2023-04-10T14:20:00Z",
          notes: "Beber pelo menos 2L de água por dia. Evitar carboidratos refinados após as 18h. Priorizar gorduras saudáveis como abacate, azeite e castanhas.",
          meals: [
            {
              id: 1,
              name: "Café da manhã",
              time: "08:00",
              items: [
                {
                  id: 101,
                  name: "Ovos mexidos",
                  quantity: 3,
                  unit: "unidades",
                  calories: 210,
                  protein: 18,
                  carbs: 1.5,
                  fat: 15
                },
                {
                  id: 102,
                  name: "Abacate",
                  quantity: 0.5,
                  unit: "unidade",
                  calories: 160,
                  protein: 2,
                  carbs: 8,
                  fat: 15
                },
                {
                  id: 103,
                  name: "Café preto",
                  quantity: 1,
                  unit: "xícara",
                  calories: 2,
                  protein: 0,
                  carbs: 0,
                  fat: 0
                }
              ]
            },
            {
              id: 2,
              name: "Almoço",
              time: "12:00",
              items: [
                {
                  id: 201,
                  name: "Peito de frango grelhado",
                  quantity: 150,
                  unit: "g",
                  calories: 180,
                  protein: 40,
                  carbs: 0,
                  fat: 4
                },
                {
                  id: 202,
                  name: "Salada verde",
                  quantity: 1,
                  unit: "porção",
                  calories: 50,
                  protein: 3,
                  carbs: 5,
                  fat: 2
                },
                {
                  id: 203,
                  name: "Azeite de oliva",
                  quantity: 1,
                  unit: "colher",
                  calories: 119,
                  protein: 0,
                  carbs: 0,
                  fat: 14
                }
              ]
            },
            {
              id: 3,
              name: "Lanche da tarde",
              time: "16:00",
              items: [
                {
                  id: 301,
                  name: "Iogurte natural",
                  quantity: 200,
                  unit: "g",
                  calories: 120,
                  protein: 10,
                  carbs: 9,
                  fat: 5
                },
                {
                  id: 302,
                  name: "Castanhas",
                  quantity: 20,
                  unit: "g",
                  calories: 110,
                  protein: 4,
                  carbs: 3,
                  fat: 10
                }
              ]
            },
            {
              id: 4,
              name: "Jantar",
              time: "20:00",
              items: [
                {
                  id: 401,
                  name: "Salmão grelhado",
                  quantity: 150,
                  unit: "g",
                  calories: 280,
                  protein: 32,
                  carbs: 0,
                  fat: 18
                },
                {
                  id: 402,
                  name: "Brócolis cozido",
                  quantity: 100,
                  unit: "g",
                  calories: 55,
                  protein: 4,
                  carbs: 10,
                  fat: 0.5
                },
                {
                  id: 403,
                  name: "Azeite de oliva",
                  quantity: 1,
                  unit: "colher",
                  calories: 119,
                  protein: 0,
                  carbs: 0,
                  fat: 14
                }
              ]
            }
          ]
        };
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use dados da API ou os dados de exemplo
        // setNutritionPlan(response.data);
        setNutritionPlan(examplePlan);
      } catch (error) {
        console.error('Error fetching nutrition plan:', error);
        // Redirecionar em caso de erro ou se não encontrar o plano
        // navigate('/nutrition');
      } finally {
        setLoading(false);
      }
    };
    
    getNutritionPlan();
  }, [id, navigate]);
  
  // Formatar tipo de dieta
  const formatDietType = (type) => {
    const types = {
      'lowcarb': 'Low Carb',
      'keto': 'Keto',
      'balanced': 'Balanced',
      'bulking': 'Bulking',
      'cutting': 'Cutting',
      'custom': 'Custom'
    };
    
    return types[type] || type;
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
  
  // Calcular totais de nutrientes para uma refeição
  const calculateMealTotals = (items) => {
    return items.reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      protein: totals.protein + item.protein,
      carbs: totals.carbs + item.carbs,
      fat: totals.fat + item.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
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
  
  // Deletar plano de nutrição
  const handleDeletePlan = async () => {
    try {
      setLoading(true);
      
      // Simular chamada à API
      // await api.delete(`/api/nutrition-plans/${id}`);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirecionar após deletar
      navigate('/nutrition');
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      setLoading(false);
      setConfirmOpen(false);
    }
  };
  
  return (
    <MainLayout>
      <PageHeader>
        <BackButton to="/nutrition">
          <FiChevronLeft /> Back to Nutrition Plans
        </BackButton>
        
        <HeaderActions>
          <ActionLink secondary to={`/nutrition/${id}/edit`}>
            <FiEdit2 /> Edit Plan
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
      ) : nutritionPlan ? (
        <Grid>
          <div>
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <FiPieChart /> Nutrition Plan Overview
                </SectionTitle>
              </SectionHeader>
              
              <SectionContent>
                <PlanHeader>
                  <div>
                    <PlanTitle>{nutritionPlan.title}</PlanTitle>
                    <PlanType type={nutritionPlan.type}>{formatDietType(nutritionPlan.type)}</PlanType>
                  </div>
                </PlanHeader>
                
                <PlanDescription>{nutritionPlan.description}</PlanDescription>
                
                <MetaGrid>
                  <MetaCard>
                    <MetaLabel><FiTarget /> Target Calories</MetaLabel>
                    <MetaValue>{nutritionPlan.targetCalories} kcal</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiClock /> Meals Per Day</MetaLabel>
                    <MetaValue>{nutritionPlan.mealsPerDay}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiUser /> Created By</MetaLabel>
                    <MetaValue>{nutritionPlan.createdBy}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiCalendar /> Created</MetaLabel>
                    <MetaValue>{formatDate(nutritionPlan.createdAt)}</MetaValue>
                  </MetaCard>
                  
                  <MetaCard>
                    <MetaLabel><FiCalendar /> Last Updated</MetaLabel>
                    <MetaValue>{formatDate(nutritionPlan.updatedAt)}</MetaValue>
                  </MetaCard>
                </MetaGrid>
                
                <MacroChart>
                  <MacroChartHeader>
                    <FiPieChart /> Macronutrients Distribution
                  </MacroChartHeader>
                  
                  <MacroBarContainer>
                    <MacroBar>
                      <MacroBarProtein percentage={nutritionPlan.macroSplit.protein} />
                      <MacroBarCarbs percentage={nutritionPlan.macroSplit.carbs} />
                      <MacroBarFat percentage={nutritionPlan.macroSplit.fat} />
                    </MacroBar>
                  </MacroBarContainer>
                  
                  <MacroLegend>
                    <MacroItem>
                      <MacroColorBox color="#3B82F6" />
                      <MacroName>Protein:</MacroName>
                      <MacroValue>{nutritionPlan.macroSplit.protein}%</MacroValue>
                    </MacroItem>
                    
                    <MacroItem>
                      <MacroColorBox color="#10B981" />
                      <MacroName>Carbs:</MacroName>
                      <MacroValue>{nutritionPlan.macroSplit.carbs}%</MacroValue>
                    </MacroItem>
                    
                    <MacroItem>
                      <MacroColorBox color="#F59E0B" />
                      <MacroName>Fat:</MacroName>
                      <MacroValue>{nutritionPlan.macroSplit.fat}%</MacroValue>
                    </MacroItem>
                  </MacroLegend>
                </MacroChart>
                
                {nutritionPlan.notes && (
                  <NotesSection>
                    <NotesTitle>Notes</NotesTitle>
                    <NotesContent>{nutritionPlan.notes}</NotesContent>
                  </NotesSection>
                )}
              </SectionContent>
            </Section>
            
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <FiClock /> Meal Plan
                </SectionTitle>
              </SectionHeader>
              
              <SectionContent>
                <MealList>
                  {nutritionPlan.meals.map(meal => {
                    const mealTotals = calculateMealTotals(meal.items);
                    
                    return (
                      <MealCard key={meal.id}>
                        <MealHeader>
                          <MealTitle>{meal.name}</MealTitle>
                          <MealTime>
                            <FiClock size={14} />
                            {meal.time}
                          </MealTime>
                        </MealHeader>
                        
                        <MealContent>
                          <FoodList>
                            {meal.items.map(item => (
                              <FoodItem key={item.id}>
                                <FoodName>{item.name}</FoodName>
                                <FoodQuantity>{item.quantity} {item.unit}</FoodQuantity>
                                <FoodNutrients>
                                  <FoodNutrient label="Cal">{item.calories}</FoodNutrient>
                                  <FoodNutrient label="P">{item.protein}g</FoodNutrient>
                                  <FoodNutrient label="C">{item.carbs}g</FoodNutrient>
                                  <FoodNutrient label="F">{item.fat}g</FoodNutrient>
                                </FoodNutrients>
                              </FoodItem>
                            ))}
                          </FoodList>
                          
                          <MealSummary>
                            <MealTotals>
                              Total: {mealTotals.calories} kcal
                            </MealTotals>
                            
                            <FoodNutrients>
                              <FoodNutrient label="P">{mealTotals.protein.toFixed(1)}g</FoodNutrient>
                              <FoodNutrient label="C">{mealTotals.carbs.toFixed(1)}g</FoodNutrient>
                              <FoodNutrient label="F">{mealTotals.fat.toFixed(1)}g</FoodNutrient>
                            </FoodNutrients>
                          </MealSummary>
                        </MealContent>
                      </MealCard>
                    );
                  })}
                </MealList>
              </SectionContent>
            </Section>
          </div>
          
          <div>
            <SideCard>
              <SideCardHeader>
                <SideCardTitle>
                  <FiTarget /> Daily Nutrition Summary
                </SideCardTitle>
              </SideCardHeader>
              
              <SideCardContent>
                <MetaCard style={{ margin: '0 0 16px' }}>
                  <MetaLabel>Total Daily Calories</MetaLabel>
                  <MetaValue>{nutritionPlan.targetCalories} kcal</MetaValue>
                </MetaCard>
                
                <MacroChart>
                  <MacroLegend style={{ marginBottom: '16px' }}>
                    <MacroItem>
                      <MacroColorBox color="#3B82F6" />
                      <MacroName>Protein:</MacroName>
                      <MacroValue>{Math.round(nutritionPlan.targetCalories * (nutritionPlan.macroSplit.protein / 100) / 4)}g</MacroValue>
                    </MacroItem>
                    
                    <MacroItem>
                      <MacroColorBox color="#10B981" />
                      <MacroName>Carbs:</MacroName>
                      <MacroValue>{Math.round(nutritionPlan.targetCalories * (nutritionPlan.macroSplit.carbs / 100) / 4)}g</MacroValue>
                    </MacroItem>
                    
                    <MacroItem>
                      <MacroColorBox color="#F59E0B" />
                      <MacroName>Fat:</MacroName>
                      <MacroValue>{Math.round(nutritionPlan.targetCalories * (nutritionPlan.macroSplit.fat / 100) / 9)}g</MacroValue>
                    </MacroItem>
                  </MacroLegend>
                </MacroChart>
                
                <ButtonContainer>
                  <StartPlanButton to={`/nutrition/${id}/track`}>
                    <FiCheck /> Start Tracking
                  </StartPlanButton>
                </ButtonContainer>
              </SideCardContent>
            </SideCard>
            
            <SideCard>
              <SideCardHeader>
                <SideCardTitle>
                  <FiInfo /> Nutrition Tips
                </SideCardTitle>
              </SideCardHeader>
              
              <SideCardContent>
                <ul style={{ padding: '0 0 0 20px', margin: 0 }}>
                  <li style={{ marginBottom: '8px', fontSize: '14px', color: '#64748B' }}>
                    Drink water 30 mins before meals to help with portion control.
                  </li>
                  <li style={{ marginBottom: '8px', fontSize: '14px', color: '#64748B' }}>
                    Aim for a variety of colored vegetables to ensure a wide range of nutrients.
                  </li>
                  <li style={{ marginBottom: '8px', fontSize: '14px', color: '#64748B' }}>
                    {nutritionPlan.type === 'lowcarb' ? 
                      'Choose fiber-rich, low-glycemic carbs like leafy greens and non-starchy vegetables.' :
                     nutritionPlan.type === 'keto' ?
                      'Keep your net carbs (total carbs minus fiber) under 20-30g per day to maintain ketosis.' :
                     nutritionPlan.type === 'bulking' ?
                      'Prioritize calorie-dense foods that are still nutrient-rich to hit your calorie goals.' :
                     nutritionPlan.type === 'cutting' ?
                      'Focus on high protein intake to help preserve muscle mass during calorie restriction.' :
                      'Balance your plate with 1/2 vegetables, 1/4 protein, and 1/4 complex carbs.'
                    }
                  </li>
                </ul>
              </SideCardContent>
            </SideCard>
          </div>
        </Grid>
      ) : (
        <div>Nutrition plan not found</div>
      )}
      
      <ConfirmDialog isOpen={confirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Nutrition Plan</DialogTitle>
          </DialogHeader>
          
          <DialogBody>
            <DialogText>
              Are you sure you want to delete this nutrition plan? This action cannot be undone.
            </DialogText>
          </DialogBody>
          
          <DialogFooter>
            <ActionButton secondary onClick={closeConfirmDialog}>
              Cancel
            </ActionButton>
            <ActionButton danger onClick={handleDeletePlan}>
              <FiTrash2 /> Delete
            </ActionButton>
          </DialogFooter>
        </DialogContent>
      </ConfirmDialog>
    </MainLayout>
  );
};

export default NutritionPlanDetail;