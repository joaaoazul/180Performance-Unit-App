// src/pages/athletes/EditAthlete.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiChevronLeft, FiUser, FiSave, FiX, FiRefreshCw, 
  FiTarget, FiAlertTriangle, FiPhone, FiMail, FiInfo
} from 'react-icons/fi';
import MainLayout from '../../components/Layout/MainLayout';
import { fetchProtectedData } from '../../services/authService';

// Componentes estilizados
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  font-size: 22px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  background: ${props => props.bg || '#F8FAFC'};
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #10B981;
  }
`;

const AlertBox = styled.div`
  background: #FEF2F2;
  border: 2px solid #FECACA;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const AlertText = styled.div`
  flex: 1;
  
  .title {
    font-weight: 600;
    color: #DC2626;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .desc {
    color: #7F1D1D;
    font-size: 13px;
    line-height: 1.4;
  }
`;

const QuickInfo = styled.div`
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  
  .title {
    font-weight: 600;
    color: #166534;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .desc {
    color: #365314;
    font-size: 13px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  background: #F9FAFB;
  margin: 20px 0 0;
  border-radius: 8px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.primary ? `
    background: #10B981;
    color: white;
    &:hover { background: #059669; }
  ` : `
    background: white;
    color: #64748B;
    border: 2px solid #E5E7EB;
    &:hover { background: #F9FAFB; }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #DC2626;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingIcon = styled(FiRefreshCw)`
  color: #10B981;
  font-size: 28px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Componente principal
const EditAthlete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    // Essencial para PT
    name: '',
    email: '',
    phone: '',
    goal: '',
    status: 'active',
    
    // Info básica necessária
    age: '',
    gender: '',
    emergencyContact: '',
    
    // O que realmente importa para treino
    limitations: '',
    preferences: '',
    notes: '',
    
    // Info médica BÁSICA (não detalhada)
    hasHealthIssues: false,
    healthSummary: ''
  });
  
  // Carregar dados do atleta
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        await fetchProtectedData();
        
        // Dados simulados - focados no que PT precisa
        setTimeout(() => {
          const mockAthlete = {
            id: id,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            goal: 'weight_loss',
            status: 'active',
            age: '38',
            gender: 'female',
            emergencyContact: 'João - (11) 98888-7777',
            
            // Informações práticas para treino
            limitations: 'Evitar exercícios de impacto no joelho direito',
            preferences: 'Prefere treinar pela manhã, não gosta de exercícios muito intensos',
            notes: 'Muito motivada, mas fica ansiosa com exercícios novos. Explicar bem antes.',
            
            // Info médica simplificada
            hasHealthIssues: true,
            healthSummary: 'Hipertensão controlada com medicação. Sem outras restrições.'
          };
          
          setFormData(mockAthlete);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
        setLoading(false);
        navigate('/athletes');
      }
    };
    
    fetchAthleteData();
  }, [id, navigate]);
  
  // Manipulador de mudança nos campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpar erro do campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validação simples e prática
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório para contacto';
    }
    
    if (!formData.goal) {
      errors.goal = 'Objetivo é importante para planear treinos';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Simular gravação
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(`/athletes/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar atleta:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/athletes/${id}`);
  };
  
  if (loading) {
    return (
      <MainLayout title="Editar Atleta">
        <LoadingWrapper>
          <LoadingIcon />
        </LoadingWrapper>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Editar Atleta">
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BackButton to={`/athletes/${id}`}>
            <FiChevronLeft /> Voltar
          </BackButton>
          <PageTitle>Editar {formData.name}</PageTitle>
        </div>
      </PageHeader>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          
          {/* Informações Essenciais */}
          <Section>
            <SectionHeader bg="#EFF6FF">
              <FiUser size={18} color="#3B82F6" />
              <SectionTitle>Informações Essenciais</SectionTitle>
            </SectionHeader>
            
            <SectionContent>
              <QuickGrid>
                <FormGroup>
                  <Label htmlFor="name">Nome*</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome do atleta"
                  />
                  {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Telefone*</Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                  {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="emergencyContact">Contato Emergência</Label>
                  <Input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Nome - Telefone"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Ex: 35"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="gender">Gênero</Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Selecionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </Select>
                </FormGroup>
              </QuickGrid>
            </SectionContent>
          </Section>

          {/* Objetivo e Status */}
          <Section>
            <SectionHeader bg="#F0FDF4">
              <FiTarget size={18} color="#10B981" />
              <SectionTitle>Objetivo e Status</SectionTitle>
            </SectionHeader>
            
            <SectionContent>
              <QuickInfo>
                <div className="title">💡 Dica Importante</div>
                <div className="desc">
                  O objetivo define todo o plano de treino. Seja específico para melhores resultados!
                </div>
              </QuickInfo>
              
              <QuickGrid>
                <FormGroup>
                  <Label htmlFor="goal">Objetivo Principal*</Label>
                  <Select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                  >
                    <option value="">Selecionar objetivo</option>
                    <option value="weight_loss">🔥 Perder Peso</option>
                    <option value="muscle_gain">💪 Ganhar Músculo</option>
                    <option value="strength">🏋️ Aumentar Força</option>
                    <option value="endurance">🏃 Melhorar Resistência</option>
                    <option value="health">❤️ Saúde Geral</option>
                    <option value="sport">⚽ Performance Desportiva</option>
                  </Select>
                  {formErrors.goal && <ErrorMessage>{formErrors.goal}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">✅ Ativo</option>
                    <option value="inactive">⏸️ Inativo</option>
                    <option value="paused">⏯️ Pausado</option>
                  </Select>
                </FormGroup>
              </QuickGrid>
            </SectionContent>
          </Section>

          {/* Informações Médicas Básicas */}
          <Section>
            <SectionHeader bg="#FEF2F2">
              <FiAlertTriangle size={18} color="#EF4444" />
              <SectionTitle>Informações de Saúde (Básicas)</SectionTitle>
            </SectionHeader>
            
            <SectionContent>
              <AlertBox>
                <FiAlertTriangle color="#DC2626" />
                <AlertText>
                  <div className="title">⚠️ Importante para Segurança</div>
                  <div className="desc">
                    Só registar informações que impactam diretamente o treino. 
                    Para questões médicas complexas, sempre referenciar a profissionais de saúde.
                  </div>
                </AlertText>
              </AlertBox>
              
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    name="hasHealthIssues"
                    checked={formData.hasHealthIssues}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Este atleta tem condições de saúde que afetam o treino
                </Label>
              </FormGroup>
              
              {formData.hasHealthIssues && (
                <FormGroup>
                  <Label htmlFor="healthSummary">Resumo das Condições (simples)</Label>
                  <TextArea
                    id="healthSummary"
                    name="healthSummary"
                    value={formData.healthSummary}
                    onChange={handleChange}
                    placeholder="Ex: Hipertensão controlada, problema no joelho esquerdo"
                  />
                </FormGroup>
              )}
            </SectionContent>
          </Section>

          {/* Limitações e Preferências */}
          <Section>
            <SectionHeader bg="#FFFBEB">
              <FiInfo size={18} color="#F59E0B" />
              <SectionTitle>Limitações e Preferências de Treino</SectionTitle>
            </SectionHeader>
            
            <SectionContent>
              <QuickInfo>
                <div className="title">🎯 Foco Prático</div>
                <div className="desc">
                  Use este espaço para registar tudo que precisa lembrar-se durante os treinos.
                </div>
              </QuickInfo>
              
              <FormGroup>
                <Label htmlFor="limitations">🚫 Limitações Físicas</Label>
                <TextArea
                  id="limitations"
                  name="limitations"
                  value={formData.limitations}
                  onChange={handleChange}
                  placeholder="Ex: Não pode fazer agachamento (problema no joelho), evitar exercícios com saltos"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="preferences">⭐ Preferências e Observações</Label>
                <TextArea
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  placeholder="Ex: Prefere treinar de manhã, gosta de música motivacional, fica nervoso com exercícios novos"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="notes">📝 Notas Gerais</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Qualquer coisa importante que precise lembrar sobre este atleta"
                />
              </FormGroup>
            </SectionContent>
          </Section>

          {/* Botões */}
          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              <FiX /> Cancelar
            </Button>
            <Button type="submit" primary disabled={saving}>
              <FiSave /> {saving ? 'A Guardar...' : 'Guardar Alterações'}
            </Button>
          </ButtonGroup>
          
        </form>
      </FormContainer>
    </MainLayout>
  );
};

export default EditAthlete;