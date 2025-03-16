import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, FiSearch, FiFilter, FiRefreshCw, FiEdit2, 
  FiTrash2, FiMoreVertical, FiCopy, FiInfo, FiCalendar, 
  FiUser, FiTarget, FiPieChart
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

const NutritionPlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const NutritionPlanCard = styled.div`
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

const NutritionPlanHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #F1F5F9;
  background: ${props => props.type === 'lowcarb' ? '#E0F2FE' : 
               props.type === 'keto' ? '#F0FDF4' : 
               props.type === 'balanced' ? '#FEF3C7' : 
               props.type === 'bulking' ? '#F1F5F9' : 
               props.type === 'cutting' ? '#FEE2E2' : '#F8FAFC'};
`;

const NutritionPlanTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 4px;
`;

const NutritionPlanType = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: white;
  color: #64748B;
`;

const NutritionPlanContent = styled.div`
  padding: 20px;
`;

const NutritionPlanStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  background: #F8FAFC;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
`;

const NutritionPlanDescription = styled.p`
  font-size: 14px;
  color: #64748B;
  margin: 0 0 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NutritionPlanFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F1F5F9;
  padding: 12px 20px;
`;

const FooterInfo = styled.div`
  font-size: 13px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 4px;
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

const MacroChart = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const MacroProtein = styled.div`
  height: 100%;
  background: #3B82F6;
  width: ${props => props.percentage}%;
`;

const MacroCarbs = styled.div`
  height: 100%;
  background: #10B981;
  width: ${props => props.percentage}%;
`;

const MacroFat = styled.div`
  height: 100%;
  background: #F59E0B;
  width: ${props => props.percentage}%;
`;

const MacroLegend = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748B;
`;

const MacroItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MacroColor = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

// Componente principal
const NutritionPlans = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);

  // Dados para os filtros
  const dietTypes = [
    'All',
    'Low Carb',
    'Keto',
    'Balanced',
    'Bulking',
    'Cutting',
    'Custom'
  ];

  // Fetch dos planos de nutrição
  useEffect(() => {
    const getNutritionPlans = async () => {
      try {
        setLoading(true);
        // Neste exemplo, usamos fetchProtectedData, mas você pode usar sua API
        // const response = await fetchProtectedData('/api/nutrition-plans');
        
        // Dados de exemplo para desenvolvimento
        const exampleData = [
          {
            id: 1,
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
            createdAt: '2023-03-15T10:30:00Z',
            updatedAt: '2023-04-10T14:20:00Z'
          },
          {
            id: 2,
            title: "Plano Cetogênico para Definição",
            description: "Dieta cetogênica com alta taxa de gorduras, proteínas moderadas e mínimo de carboidratos para induzir cetose.",
            type: "keto",
            targetCalories: 1800,
            macroSplit: {
              protein: 30,
              carbs: 5,
              fat: 65
            },
            mealsPerDay: 3,
            createdAt: '2023-03-20T11:15:00Z',
            updatedAt: '2023-04-15T09:30:00Z'
          },
          {
            id: 3,
            title: "Plano Balanceado para Manutenção",
            description: "Dieta balanceada para manutenção do peso com proporções equilibradas de macronutrientes.",
            type: "balanced",
            targetCalories: 2200,
            macroSplit: {
              protein: 30,
              carbs: 40,
              fat: 30
            },
            mealsPerDay: 5,
            createdAt: '2023-03-25T14:45:00Z',
            updatedAt: '2023-04-12T16:20:00Z'
          },
          {
            id: 4,
            title: "Plano de Hipertrofia (Bulking)",
            description: "Plano alimentar com superávit calórico para ganho de massa muscular com foco em proteínas e carboidratos complexos.",
            type: "bulking",
            targetCalories: 3000,
            macroSplit: {
              protein: 35,
              carbs: 45,
              fat: 20
            },
            mealsPerDay: 6,
            createdAt: '2023-03-28T09:00:00Z',
            updatedAt: '2023-04-14T11:10:00Z'
          },
          {
            id: 5,
            title: "Plano de Definição (Cutting)",
            description: "Dieta com déficit calórico moderado para perda de gordura preservando massa muscular.",
            type: "cutting",
            targetCalories: 1600,
            macroSplit: {
              protein: 45,
              carbs: 30,
              fat: 25
            },
            mealsPerDay: 4,
            createdAt: '2023-04-02T13:30:00Z',
            updatedAt: '2023-04-18T15:45:00Z'
          }
        ];
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use dados da API ou os dados de exemplo
        // setPlans(response?.data || exampleData);
        // setFilteredPlans(response?.data || exampleData);
        setPlans(exampleData);
        setFilteredPlans(exampleData);
      } catch (error) {
        console.error('Error fetching nutrition plans:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getNutritionPlans();
  }, []);

  // Filtrar planos
  useEffect(() => {
    let result = [...plans];
    
    // Aplicar filtro de pesquisa
    if (search) {
      result = result.filter(plan => 
        plan.title.toLowerCase().includes(search.toLowerCase()) ||
        plan.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Aplicar filtro de tipo de dieta
    if (filter !== 'all') {
      result = result.filter(plan => 
        plan.type.toLowerCase() === filter.toLowerCase()
      );
    }
    
    setFilteredPlans(result);
  }, [search, filter, plans]);

  // Toggle menu de ações
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Nutrition Plans</PageTitle>
        <ActionButtons>
          <Button as={Link} to="/nutrition/create">
            <FiPlus /> Create Plan
          </Button>
        </ActionButtons>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <FiSearch />
          <input
            type="text"
            placeholder="Search nutrition plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchInput>
        
        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
        >
          {dietTypes.map(type => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      ) : filteredPlans.length > 0 ? (
        <NutritionPlanGrid>
          {filteredPlans.map(plan => (
            <NutritionPlanCard key={plan.id}>
              <NutritionPlanHeader type={plan.type}>
                <NutritionPlanTitle>{plan.title}</NutritionPlanTitle>
                <NutritionPlanType>{formatDietType(plan.type)}</NutritionPlanType>
              </NutritionPlanHeader>
              
              <NutritionPlanContent>
                <NutritionPlanStats>
                  <StatItem>
                    <StatValue>{plan.targetCalories}</StatValue>
                    <StatLabel>Calories</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{plan.mealsPerDay}</StatValue>
                    <StatLabel>Meals</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>
                      <FiPieChart size={16} />
                    </StatValue>
                    <StatLabel>Macros</StatLabel>
                  </StatItem>
                </NutritionPlanStats>
                
                <MacroChart>
                  <MacroProtein percentage={plan.macroSplit.protein} />
                  <MacroCarbs percentage={plan.macroSplit.carbs} />
                  <MacroFat percentage={plan.macroSplit.fat} />
                </MacroChart>
                
                <MacroLegend>
                  <MacroItem>
                    <MacroColor color="#3B82F6" />
                    P: {plan.macroSplit.protein}%
                  </MacroItem>
                  <MacroItem>
                    <MacroColor color="#10B981" />
                    C: {plan.macroSplit.carbs}%
                  </MacroItem>
                  <MacroItem>
                    <MacroColor color="#F59E0B" />
                    F: {plan.macroSplit.fat}%
                  </MacroItem>
                </MacroLegend>
                
                <NutritionPlanDescription>
                  {plan.description}
                </NutritionPlanDescription>
                
                <Button as={Link} to={`/nutrition/${plan.id}`} style={{ width: '100%' }}>
                  View Details
                </Button>
              </NutritionPlanContent>
              
              <NutritionPlanFooter>
                <FooterInfo>
                  <FiCalendar size={14} /> Updated {formatDate(plan.updatedAt)}
                </FooterInfo>
                
                <ActionMenu>
                  <ActionButton onClick={() => toggleMenu(plan.id)}>
                    <FiMoreVertical />
                  </ActionButton>
                  
                  <ActionDropdown isOpen={menuOpen === plan.id}>
                    <ActionItem as={Link} to={`/nutrition/${plan.id}/edit`}>
                      <FiEdit2 size={14} /> Edit
                    </ActionItem>
                    <ActionItem>
                      <FiCopy size={14} /> Duplicate
                    </ActionItem>
                    <ActionItem danger>
                      <FiTrash2 size={14} /> Delete
                    </ActionItem>
                  </ActionDropdown>
                </ActionMenu>
              </NutritionPlanFooter>
            </NutritionPlanCard>
          ))}
        </NutritionPlanGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiInfo />
          </EmptyIcon>
          <EmptyTitle>No nutrition plans found</EmptyTitle>
          <EmptyDescription>
            {search || filter !== 'all'
              ? "No plans match your search criteria. Try adjusting your filters."
              : "You haven't created any nutrition plans yet."}
          </EmptyDescription>
          <Button as={Link} to="/nutrition/create">
            <FiPlus /> Create Your First Plan
          </Button>
        </EmptyState>
      )}
    </MainLayout>
  );
};

export default NutritionPlans;