// src/pages/athletes/EditAthlete.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiChevronLeft, FiUser, FiSave, FiX, FiRefreshCw, FiHeart,
  FiActivity, FiInfo, FiClipboard, FiAlertTriangle, FiPlus,
  FiTrash2, FiTarget
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
  overflow: hidden;
  margin-bottom: 20px;
`;

const FormHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.bgColor || '#F8FAFC'};
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
  margin-bottom: 24px;
  
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

const InfoBox = styled.div`
  background: #FFFBEB;
  border: 1px solid #FED7AA;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #92400E;
`;

const HealthAlert = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #7F1D1D;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  padding: 20px;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
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

const DynamicList = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #F8FAFC;
  padding: 12px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  
  &:hover {
    background: #059669;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #DC2626;
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
    // Dados básicos
    name: '',
    email: '',
    phone: '',
    status: 'active',
    plan: 'basic',
    
    // Informações pessoais
    birthDate: '',
    age: '',
    gender: '',
    height: '',
    emergencyContact: '',
    occupation: '',
    address: '',
    
    // Objetivos e treinamento
    goal: '',
    
    // Informações de saúde
    conditions: [],
    previousInjuries: [],
    surgeries: [],
    medications: [],
    allergies: [],
    limitations: '',
    
    // Hábitos
    previousActivity: '',
    sleepHabits: '',
    eatingHabits: '',
    
    // Observações gerais
    notes: ''
  });
  
  // Estados para listas dinâmicas
  const [newCondition, setNewCondition] = useState('');
  const [newInjury, setNewInjury] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  // Carregar dados do atleta
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        await fetchProtectedData();
        
        // Simulando carregamento de dados
        setTimeout(() => {
          const mockAthlete = {
            id: id,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            status: 'active',
            plan: 'premium',
            
            // Informações pessoais
            birthDate: '1985-08-15',
            age: 38,
            gender: 'female',
            height: '165',
            emergencyContact: 'João Oliveira - (11) 98888-7777',
            occupation: 'Advogada',
            address: 'Rua das Flores, 123 - São Paulo/SP',
            
            // Objetivos
            goal: 'weight_loss',
            
            // Condições de saúde
            conditions: ['Hipertensão'],
            previousInjuries: ['Lesão no joelho direito (2019)'],
            surgeries: [],
            medications: ['Losartana 50mg (manhã)'],
            allergies: ['Amendoim'],
            limitations: 'Evitar exercícios de alto impacto no joelho direito',
            
            // Hábitos
            previousActivity: 'sedentary',
            sleepHabits: '6-7 horas por noite',
            eatingHabits: 'Dieta rica em carboidratos, pouca proteína',
            
            // Observações
            notes: 'Muito motivada e comprometida com os objetivos. Prefere treinar pela manhã.'
          };
          
          setFormData(mockAthlete);
          setLoading(false);
        }, 1000);
        
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro do campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Funções para gerenciar listas dinâmicas
  const addToList = (listName, value, setter) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [listName]: [...formData[listName], value.trim()]
      });
      setter('');
    }
  };
  
  const removeFromList = (listName, index) => {
    const newList = formData[listName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [listName]: newList
    });
  };
  
  // Validação do formulário
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Aqui faria a chamada à API
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <BackButton to={`/athletes/${id}`}>
            <FiChevronLeft /> Voltar
          </BackButton>
          <PageTitle>Editar Atleta</PageTitle>
        </div>
      </PageHeader>
      
      <form onSubmit={handleSubmit}>
        {/* Dados Básicos */}
        <FormContainer>
          <FormHeader>
            <FiUser size={20} color="#10B981" />
            <FormTitle>Dados Básicos</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Nome Completo*</Label>
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
                <Label htmlFor="email">Email*</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
                {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
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
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="pending">Pendente</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="plan">Plano</Label>
                <Select
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                >
                  <option value="basic">Básico</option>
                  <option value="standard">Padrão</option>
                  <option value="premium">Premium</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </FormContent>
        </FormContainer>

        {/* Informações Pessoais */}
        <FormContainer>
          <FormHeader>
            <FiInfo size={20} color="#3B82F6" />
            <FormTitle>Informações Pessoais</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
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
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Ex: 175"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="occupation">Profissão</Label>
                <Input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Profissão do atleta"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                <Input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Nome e telefone"
                />
              </FormGroup>
            </FormGrid>
            
            <FormGroup>
              <Label htmlFor="address">Endereço</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Endereço completo"
              />
            </FormGroup>
          </FormContent>
        </FormContainer>

        {/* Objetivos e Treinamento */}
        <FormContainer>
          <FormHeader>
            <FiTarget size={20} color="#F59E0B" />
            <FormTitle>Objetivos e Treinamento</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="goal">Objetivo Principal</Label>
                <Select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="weight_loss">Perda de Peso</option>
                  <option value="muscle_gain">Hipertrofia</option>
                  <option value="endurance">Resistência</option>
                  <option value="strength">Força</option>
                  <option value="health">Saúde</option>
                  <option value="other">Outro</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="previousActivity">Nível de Atividade Anterior</Label>
                <Select
                  id="previousActivity"
                  name="previousActivity"
                  value={formData.previousActivity}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="sedentary">Sedentário</option>
                  <option value="light">Atividade Leve</option>
                  <option value="moderate">Atividade Moderada</option>
                  <option value="active">Ativo</option>
                  <option value="very_active">Muito Ativo</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </FormContent>
        </FormContainer>

        {/* Informações de Saúde */}
        <FormContainer>
          <FormHeader bgColor="#FEF2F2">
            <FiHeart size={20} color="#EF4444" />
            <FormTitle>Informações de Saúde</FormTitle>
          </FormHeader>
          
          <FormContent>
            <HealthAlert>
              <FiAlertTriangle />
              <div>
                <strong>Importante:</strong> Estas informações são cruciais para a segurança do treinamento. 
                Mantenha sempre atualizadas e consulte profissionais de saúde quando necessário.
              </div>
            </HealthAlert>
            
            {/* Doenças Pré-existentes */}
            <FormSection>
              <SectionTitle>
                <FiHeart /> Doenças Pré-existentes
              </SectionTitle>
              <DynamicList>
                {formData.conditions.map((condition, index) => (
                  <ListItem key={index}>
                    <span>{condition}</span>
                    <RemoveButton onClick={() => removeFromList('conditions', index)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ListItem>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Digite uma condição de saúde"
                    style={{ margin: 0 }}
                  />
                  <AddItemButton onClick={() => addToList('conditions', newCondition, setNewCondition)}>
                    <FiPlus /> Adicionar
                  </AddItemButton>
                </div>
              </DynamicList>
            </FormSection>

            {/* Lesões Anteriores */}
            <FormSection>
              <SectionTitle>
                🩹 Lesões Anteriores
              </SectionTitle>
              <DynamicList>
                {formData.previousInjuries.map((injury, index) => (
                  <ListItem key={index}>
                    <span>{injury}</span>
                    <RemoveButton onClick={() => removeFromList('previousInjuries', index)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ListItem>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="text"
                    value={newInjury}
                    onChange={(e) => setNewInjury(e.target.value)}
                    placeholder="Digite uma lesão anterior"
                    style={{ margin: 0 }}
                  />
                  <AddItemButton onClick={() => addToList('previousInjuries', newInjury, setNewInjury)}>
                    <FiPlus /> Adicionar
                  </AddItemButton>
                </div>
              </DynamicList>
            </FormSection>

            {/* Cirurgias */}
            <FormSection>
              <SectionTitle>
                🏥 Cirurgias
              </SectionTitle>
              <DynamicList>
                {formData.surgeries.map((surgery, index) => (
                  <ListItem key={index}>
                    <span>{surgery}</span>
                    <RemoveButton onClick={() => removeFromList('surgeries', index)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ListItem>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="text"
                    value={newSurgery}
                    onChange={(e) => setNewSurgery(e.target.value)}
                    placeholder="Digite uma cirurgia"
                    style={{ margin: 0 }}
                  />
                  <AddItemButton onClick={() => addToList('surgeries', newSurgery, setNewSurgery)}>
                    <FiPlus /> Adicionar
                  </AddItemButton>
                </div>
              </DynamicList>
            </FormSection>

            {/* Medicações */}
            <FormSection>
              <SectionTitle>
                💊 Medicação Atual
              </SectionTitle>
              <DynamicList>
                {formData.medications.map((medication, index) => (
                  <ListItem key={index}>
                    <span>{medication}</span>
                    <RemoveButton onClick={() => removeFromList('medications', index)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ListItem>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Digite uma medicação"
                    style={{ margin: 0 }}
                  />
                  <AddItemButton onClick={() => addToList('medications', newMedication, setNewMedication)}>
                    <FiPlus /> Adicionar
                  </AddItemButton>
                </div>
              </DynamicList>
            </FormSection>

            {/* Alergias */}
            <FormSection>
              <SectionTitle>
                🚫 Alergias
              </SectionTitle>
              <DynamicList>
                {formData.allergies.map((allergy, index) => (
                  <ListItem key={index}>
                    <span>{allergy}</span>
                    <RemoveButton onClick={() => removeFromList('allergies', index)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ListItem>
                ))}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Digite uma alergia"
                    style={{ margin: 0 }}
                  />
                  <AddItemButton onClick={() => addToList('allergies', newAllergy, setNewAllergy)}>
                    <FiPlus /> Adicionar
                  </AddItemButton>
                </div>
              </DynamicList>
            </FormSection>

            {/* Limitações */}
            <FormSection>
              <SectionTitle>
                ⚠️ Limitações Físicas
              </SectionTitle>
              <FormGroup>
                <TextArea
                  name="limitations"
                  value={formData.limitations}
                  onChange={handleChange}
                  placeholder="Descreva limitações físicas ou exercícios que devem ser evitados"
                />
              </FormGroup>
            </FormSection>
          </FormContent>
        </FormContainer>

        {/* Hábitos e Estilo de Vida */}
        <FormContainer>
          <FormHeader>
            <FiActivity size={20} color="#8B5CF6" />
            <FormTitle>Hábitos e Estilo de Vida</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="sleepHabits">Hábitos de Sono</Label>
                <Input
                  type="text"
                  id="sleepHabits"
                  name="sleepHabits"
                  value={formData.sleepHabits}
                  onChange={handleChange}
                  placeholder="Ex: 7-8 horas por noite"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="eatingHabits">Hábitos Alimentares</Label>
                <Input
                  type="text"
                  id="eatingHabits"
                  name="eatingHabits"
                  value={formData.eatingHabits}
                  onChange={handleChange}
                  placeholder="Ex: 3 refeições por dia"
                />
              </FormGroup>
            </FormGrid>
            
            <InfoBox>
              <FiInfo />
              <div>
                <strong>Dica:</strong> Informações sobre hábitos de sono e alimentação ajudam a personalizar 
                melhor o programa de treinamento e dar orientações mais precisas.
              </div>
            </InfoBox>
          </FormContent>
        </FormContainer>

        {/* Observações Gerais */}
        <FormContainer>
          <FormHeader>
            <FiClipboard size={20} color="#64748B" />
            <FormTitle>Observações Gerais</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormSection>
              <FormGroup>
                <Label htmlFor="notes">Notas Adicionais</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o atleta, preferências de treino, horários, motivações, etc."
                  style={{ minHeight: '120px' }}
                />
              </FormGroup>
            </FormSection>
            
            <InfoBox>
              <FiInfo />
              <div>
                Use este espaço para registrar informações importantes como preferências de horário, 
                motivações pessoais, feedback sobre treinos anteriores, ou qualquer observação 
                que possa ajudar no acompanhamento do atleta.
              </div>
            </InfoBox>
          </FormContent>
        </FormContainer>

        {/* Botões de Ação */}
        <FormContainer>
          <ButtonsContainer>
            <Button type="button" secondary onClick={handleCancel}>
              <FiX /> Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <FiSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonsContainer>
        </FormContainer>
      </form>
    </MainLayout>
  );
};

export default EditAthlete;