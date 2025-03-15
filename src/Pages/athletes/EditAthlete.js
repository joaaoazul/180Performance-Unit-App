// src/pages/athletes/EditAthlete.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiChevronLeft, FiUser, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
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

// Componente principal
const EditAthlete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthdate: '',
    goal: '',
    height: '',
    weight: '',
    emergencyContact: '',
    healthConditions: '',
    allergies: '',
    notes: '',
    status: 'active',
    plan: 'basic'
  });
  
  // Carregar dados do atleta
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        
        // Verificar autenticação
        await fetchProtectedData();
        
        // Aqui você faria uma chamada real para sua API
        // Exemplo: const response = await api.get(`/athletes/${id}`);
        
        // Dados mockados para demonstração
        setTimeout(() => {
          const mockAthlete = {
            id: id,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            gender: 'female',
            birthdate: '1990-05-12',
            goal: 'weight_loss',
            height: '165',
            weight: '68',
            emergencyContact: 'João Oliveira - (11) 98888-7777',
            healthConditions: 'Pressão baixa',
            allergies: 'Nenhuma',
            notes: 'Prefere treinar pela manhã. Tem dificuldade com exercícios de impacto.',
            status: 'active',
            plan: 'premium'
          };
          
          setFormData(mockAthlete);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
        setLoading(false);
        // Redirecionar em caso de erro
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
    
    // Limpar erro do campo quando o usuário digitar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
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
      // Aqui você faria uma chamada para sua API para atualizar o atleta
      // Por exemplo: await api.put(`/athletes/${id}`, formData);
      
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar para a página de detalhes do atleta após o sucesso
      navigate(`/athletes/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar atleta:', error);
      // Tratamento de erro - você pode exibir uma mensagem ao usuário
    } finally {
      setSaving(false);
    }
  };
  
  // Manipulador para cancelar e voltar para a página de detalhes
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
        <FormContainer>
          <FormHeader>
            <FiUser size={20} color="#10B981" />
            <FormTitle>Informações do Atleta</FormTitle>
          </FormHeader>
          
          <FormContent>
            <FormSection>
              <SectionTitle>Dados Básicos</SectionTitle>
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
                  <Label htmlFor="birthdate">Data de Nascimento</Label>
                  <Input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
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
              </FormGrid>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Informações de Treinamento</SectionTitle>
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
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Ex: 70"
                    step="0.1"
                  />
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
            </FormSection>
            
            <FormSection>
              <SectionTitle>Informações de Saúde</SectionTitle>
              <FormGrid>
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
                
                <FormGroup>
                  <Label htmlFor="healthConditions">Condições de Saúde</Label>
                  <Input
                    type="text"
                    id="healthConditions"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    placeholder="Condições médicas relevantes"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="allergies">Alergias</Label>
                  <Input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Alergias conhecidas"
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Observações</SectionTitle>
              <FormGroup>
                <Label htmlFor="notes">Notas Adicionais</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o atleta"
                />
              </FormGroup>
            </FormSection>
            
            <ButtonsContainer>
              <Button type="button" secondary onClick={handleCancel}>
                <FiX /> Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                <FiSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </ButtonsContainer>
          </FormContent>
        </FormContainer>
      </form>
    </MainLayout>
  );
};

export default EditAthlete;