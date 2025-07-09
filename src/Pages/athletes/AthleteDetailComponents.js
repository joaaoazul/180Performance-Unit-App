// src/components/Athletes/AthleteDetailComponents.js
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// ============================================================================
// STYLED COMPONENTS ADICIONAIS PARA MEDIÇÕES E CHECK-INS
// ============================================================================

// Componentes para Medições
export const MeasurementEntry = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
`;

export const MeasurementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const MeasurementDate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 17px;
  }
`;

export const MeasurementActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  background: white;
  color: #64748B;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #F8FAFC;
    color: #1E293B;
  }
  
  &.danger {
    color: #EF4444;
    border-color: #FECACA;
    
    &:hover {
      background: #FEF2F2;
    }
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

export const MeasurementGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const BodyMeasurements = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const MeasurementCard = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 10px 8px;
  }
`;

export const MeasurementIcon = styled.div`
  font-size: 16px;
  color: #64748B;
  margin-bottom: 4px;
`;

export const MeasurementLabel = styled.div`
  font-size: 11px;
  color: #64748B;
  margin-bottom: 4px;
`;

export const MeasurementValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
`;

export const MeasurementChange = styled.div`
  font-size: 10px;
  color: ${props => props.positive ? '#10B981' : props.negative ? '#EF4444' : '#64748B'};
  margin-top: 2px;
`;

export const WeightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WeightCard = styled.div`
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

export const WeightValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
`;

export const WeightChange = styled.div`
  font-size: 12px;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

// ============================================================================
// COMPONENTES PARA FOTOS DE PROGRESSO
// ============================================================================

export const PhotosSection = styled.div`
  margin-top: 20px;
`;

export const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  background: #F8FAFC;
  border: 2px dashed #CBD5E1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    border-color: #10B981;
    background: #F0FDF4;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PhotoLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  font-size: 11px;
  text-align: center;
`;

export const PhotoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748B;
  
  svg {
    font-size: 24px;
  }
`;

export const NotesSection = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #FFFBEB;
  border: 1px solid #FED7AA;
  border-radius: 6px;
`;

export const NotesLabel = styled.div`
  font-size: 12px;
  color: #92400E;
  margin-bottom: 4px;
  font-weight: 500;
`;

export const NotesText = styled.div`
  font-size: 13px;
  color: #451A03;
  line-height: 1.4;
`;

// ============================================================================
// COMPONENTES PARA CHECK-INS
// ============================================================================

export const CheckinCard = styled.div`
  background: #F8FAFC;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E2E8F0;
  margin-bottom: 16px;
`;

export const CheckinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const CheckinDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
`;

export const CheckinStatus = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.completed ? '#ECFDF5' : '#FEF2F2'};
  color: ${props => props.completed ? '#10B981' : '#EF4444'};
`;

export const MoodSelector = styled.div`
  display: flex;
  gap: 12px;
  margin: 12px 0;
`;

export const MoodOption = styled.button`
  padding: 12px;
  border: 2px solid ${props => props.selected ? '#10B981' : '#E2E8F0'};
  border-radius: 8px;
  background: ${props => props.selected ? '#F0FDF4' : 'white'};
  color: ${props => props.selected ? '#10B981' : '#64748B'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10B981;
  }
`;

export const ScaleInput = styled.input`
  width: 100%;
  margin-top: 8px;
  accent-color: #10B981;
`;

export const ScaleValue = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin-top: 8px;
`;

// ============================================================================
// COMPONENTES PARA OBSERVAÇÕES
// ============================================================================

export const ObservationCard = styled.div`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const ObservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const ObservationTitle = styled.h4`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

export const ObservationMeta = styled.div`
  font-size: 12px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ObservationContent = styled.div`
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
`;

export const PriorityBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    if (props.priority === 'high') return '#FEF2F2';
    if (props.priority === 'medium') return '#FFFBEB';
    return '#F8FAFC';
  }};
  color: ${props => {
    if (props.priority === 'high') return '#DC2626';
    if (props.priority === 'medium') return '#D97706';
    return '#64748B';
  }};
`;

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    if (props.type === 'health') return '#FEF2F2';
    if (props.type === 'training') return '#EFF6FF';
    if (props.type === 'nutrition') return '#F0FDF4';
    return '#F8FAFC';
  }};
  color: ${props => {
    if (props.type === 'health') return '#DC2626';
    if (props.type === 'training') return '#2563EB';
    if (props.type === 'nutrition') return '#059669';
    return '#64748B';
  }};
`;

// ============================================================================
// COMPONENTES PARA FORMULÁRIOS
// ============================================================================

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
`;

// ============================================================================
// COMPONENTES PARA ESTATÍSTICAS
// ============================================================================

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

export const StatChange = styled.div`
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${props => props.positive ? '#059669' : '#DC2626'};
`;

// ============================================================================
// COMPONENTES UTILITÁRIOS
// ============================================================================

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #E5E7EB;
  margin: 24px 0;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.bg || '#F3F4F6'};
  color: ${props => props.color || '#374151'};
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  background: white;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    color: #374151;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  background: #1F2937;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(-4px);
  transition: opacity 0.2s ease;
  pointer-events: none;
`;

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

export const getMeasurementChange = (current, previous) => {
  if (!previous) return null;
  const change = current - previous;
  return {
    value: Math.abs(change),
    isPositive: change < 0, // Para medidas corporais, diminuir é positivo
    isNegative: change > 0
  };
};

export const getWeightChange = (current, previous) => {
  if (!previous) return null;
  const change = current - previous;
  return {
    value: Math.abs(change).toFixed(1),
    isPositive: change < 0, // Para peso, diminuir pode ser positivo dependendo do objetivo
    isNegative: change > 0
  };
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return { bg: '#ECFDF5', color: '#059669' };
    case 'inactive':
      return { bg: '#FEF2F2', color: '#DC2626' };
    case 'paused':
      return { bg: '#FFFBEB', color: '#D97706' };
    default:
      return { bg: '#F3F4F6', color: '#6B7280' };
  }
};

export const getMoodIcon = (mood) => {
  switch (mood) {
    case 'happy':
      return '😊';
    case 'neutral':
      return '😐';
    case 'sad':
      return '😔';
    default:
      return '😐';
  }
};

export const getEnergyColor = (energy) => {
  if (energy >= 8) return '#059669';
  if (energy >= 6) return '#D97706';
  if (energy >= 4) return '#F59E0B';
  return '#DC2626';
};

// ============================================================================
// COMPONENTES PARA MODAIS
// ============================================================================

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #374151;
  }
`;

// ============================================================================
// RESPONSIVE HELPERS
// ============================================================================

export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

export const respondTo = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`
};