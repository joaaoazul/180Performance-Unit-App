// src/hooks/useAthleteDetail.js
import { useState, useEffect } from 'react';
import { fetchProtectedData } from '../services/authService';

export const useAthleteDetail = (athleteId) => {
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular chamada à API
        await fetchProtectedData();
        
        // Em produção, seria algo como:
        // const response = await api.get(`/athletes/${athleteId}`);
        // setAthlete(response.data);
        
        // Mock data para demonstração
        setTimeout(() => {
          const mockAthlete = {
            id: athleteId,
            name: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(11) 99999-8888',
            status: 'active',
            plan: 'Premium',
            joinDate: '15/01/2023',
            lastActivity: '10/03/2023',
            avatar: null,
            age: 38,
            gender: 'Feminino',
            goal: '🔥 Perder Peso',
            emergencyContact: 'João Oliveira - (11) 98888-7777',
            hasHealthIssues: true,
            healthSummary: 'Hipertensão controlada com medicação. Evitar exercícios de alto impacto no joelho direito.',
            limitations: 'Evitar exercícios de impacto no joelho direito',
            preferences: 'Prefere treinar pela manhã, não gosta de exercícios muito intensos',
            notes: 'Muito motivada, mas fica ansiosa com exercícios novos. Explicar bem antes de executar.',
            checkinStats: {
              lastCheckin: '2024-03-15',
              totalCheckins: 25,
              currentStreak: 5,
              missedDays: 2,
              avgEnergy: 7.2,
              avgSleep: 6.8,
              avgMood: 'neutral',
              avgMotivation: 7.5
            },
            measurements: [
              {
                id: 1,
                date: '2024-03-15',
                weight: 68.5,
                previousWeight: 70.2,
                bodyMeasurements: {
                  waist: 75,
                  hips: 102,
                  chest: 92,
                  thighs: 58,
                  arms: 28,
                  abdomen: 82
                },
                previousMeasurements: {
                  waist: 77,
                  hips: 103,
                  chest: 93,
                  thighs: 59,
                  arms: 29,
                  abdomen: 84
                },
                photos: {
                  front: null,
                  side: null,
                  back: null
                },
                notes: 'Ótima evolução! Perdeu 1.7kg e reduziu medidas em todas as áreas.'
              }
            ],
            recentCheckins: [
              {
                id: 1,
                date: '2024-03-15',
                mood: 'happy',
                energy: 8,
                sleep: 7,
                motivation: 9,
                notes: 'Ótimo dia! Me senti muito bem no treino.'
              }
            ]
          };
          
          setAthlete(mockAthlete);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (athleteId) {
      fetchAthleteData();
    }
  }, [athleteId]);

  const updateAthlete = (updates) => {
    setAthlete(prev => ({ ...prev, ...updates }));
  };

  const refreshData = () => {
    setLoading(true);
    // Refetch data logic here
  };

  return {
    athlete,
    loading,
    error,
    updateAthlete,
    refreshData
  };
};

// src/hooks/useCheckins.js
import { useState, useCallback } from 'react';

export const useCheckins = (athleteId) => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);

  const addCheckin = useCallback(async (checkinData) => {
    setLoading(true);
    try {
      // Em produção seria uma chamada à API
      // await api.post(`/athletes/${athleteId}/checkins`, checkinData);
      
      const newCheckin = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...checkinData
      };
      
      setCheckins(prev => [newCheckin, ...prev]);
      setLoading(false);
      return newCheckin;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [athleteId]);

  const updateCheckin = useCallback(async (checkinId, updates) => {
    setLoading(true);
    try {
      // await api.put(`/checkins/${checkinId}`, updates);
      
      setCheckins(prev => 
        prev.map(checkin => 
          checkin.id === checkinId 
            ? { ...checkin, ...updates }
            : checkin
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteCheckin = useCallback(async (checkinId) => {
    setLoading(true);
    try {
      // await api.delete(`/checkins/${checkinId}`);
      
      setCheckins(prev => prev.filter(checkin => checkin.id !== checkinId));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    checkins,
    loading,
    addCheckin,
    updateCheckin,
    deleteCheckin
  };
};

// src/hooks/useObservations.js
import { useState, useCallback } from 'react';

export const useObservations = (athleteId) => {
  const [observations, setObservations] = useState([
    {
      id: 1,
      type: 'training',
      title: 'Evolução no agachamento',
      content: 'Hoje conseguiu fazer 3 séries de 12 repetições com 40kg. Evolução significativa!',
      priority: 'high',
      date: '2024-03-15',
      createdBy: 'Personal Trainer'
    },
    {
      id: 2,
      type: 'health',
      title: 'Dor no joelho',
      content: 'Relatou leve desconforto no joelho direito. Ajustamos o treino para evitar impacto.',
      priority: 'medium',
      date: '2024-03-10',
      createdBy: 'Personal Trainer'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const addObservation = useCallback(async (observationData) => {
    setLoading(true);
    try {
      // await api.post(`/athletes/${athleteId}/observations`, observationData);
      
      const newObservation = {
        id: Date.now(),
        ...observationData,
        date: new Date().toISOString().split('T')[0],
        createdBy: 'Personal Trainer'
      };
      
      setObservations(prev => [newObservation, ...prev]);
      setLoading(false);
      return newObservation;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [athleteId]);

  const updateObservation = useCallback(async (observationId, updates) => {
    setLoading(true);
    try {
      // await api.put(`/observations/${observationId}`, updates);
      
      setObservations(prev => 
        prev.map(obs => 
          obs.id === observationId 
            ? { ...obs, ...updates }
            : obs
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteObservation = useCallback(async (observationId) => {
    setLoading(true);
    try {
      // await api.delete(`/observations/${observationId}`);
      
      setObservations(prev => prev.filter(obs => obs.id !== observationId));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    observations,
    loading,
    addObservation,
    updateObservation,
    deleteObservation
  };
};

// src/utils/athleteHelpers.js

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

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
    isPositive: change < 0,
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

export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
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

export const getMoodLabel = (mood) => {
  switch (mood) {
    case 'happy':
      return 'Feliz';
    case 'neutral':
      return 'Neutro';
    case 'sad':
      return 'Triste';
    default:
      return 'Não informado';
  }
};

export const getEnergyColor = (energy) => {
  if (energy >= 8) return '#059669';
  if (energy >= 6) return '#D97706';
  if (energy >= 4) return '#F59E0B';
  return '#DC2626';
};

export const getEnergyLabel = (energy) => {
  if (energy >= 8) return 'Excelente';
  if (energy >= 6) return 'Boa';
  if (energy >= 4) return 'Moderada';
  return 'Baixa';
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return { bg: '#FEF2F2', color: '#DC2626' };
    case 'medium':
      return { bg: '#FFFBEB', color: '#D97706' };
    case 'low':
    default:
      return { bg: '#F8FAFC', color: '#64748B' };
  }
};

export const getTypeColor = (type) => {
  switch (type) {
    case 'health':
      return { bg: '#FEF2F2', color: '#DC2626' };
    case 'training':
      return { bg: '#EFF6FF', color: '#2563EB' };
    case 'nutrition':
      return { bg: '#F0FDF4', color: '#059669' };
    case 'general':
    default:
      return { bg: '#F8FAFC', color: '#64748B' };
  }
};

export const calculateProgress = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(100, Math.max(0, (current / target) * 100));
};

export const getProgressColor = (progress) => {
  if (progress >= 75) return '#059669';
  if (progress >= 50) return '#3B82F6';
  if (progress >= 25) return '#F59E0B';
  return '#DC2626';
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
};

export const validateCheckinData = (data) => {
  const errors = {};
  
  if (!data.mood) {
    errors.mood = 'Humor é obrigatório';
  }
  
  if (data.energy < 1 || data.energy > 10) {
    errors.energy = 'Energia deve estar entre 1 e 10';
  }
  
  if (data.sleep < 1 || data.sleep > 10) {
    errors.sleep = 'Sono deve estar entre 1 e 10';
  }
  
  if (data.motivation < 1 || data.motivation > 10) {
    errors.motivation = 'Motivação deve estar entre 1 e 10';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateObservationData = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Título é obrigatório';
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Conteúdo é obrigatório';
  }
  
  if (data.title && data.title.length > 100) {
    errors.title = 'Título deve ter no máximo 100 caracteres';
  }
  
  if (data.content && data.content.length > 1000) {
    errors.content = 'Conteúdo deve ter no máximo 1000 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateCheckinReport = (checkins) => {
  if (!checkins || checkins.length === 0) {
    return null;
  }
  
  const totalCheckins = checkins.length;
  const avgEnergy = (checkins.reduce((sum, c) => sum + c.energy, 0) / totalCheckins).toFixed(1);
  const avgSleep = (checkins.reduce((sum, c) => sum + c.sleep, 0) / totalCheckins).toFixed(1);
  const avgMotivation = (checkins.reduce((sum, c) => sum + c.motivation, 0) / totalCheckins).toFixed(1);
  
  const moodCounts = checkins.reduce((acc, c) => {
    acc[c.mood] = (acc[c.mood] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommonMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  
  return {
    totalCheckins,
    avgEnergy: parseFloat(avgEnergy),
    avgSleep: parseFloat(avgSleep),
    avgMotivation: parseFloat(avgMotivation),
    mostCommonMood,
    moodCounts
  };
};

export const exportAthleteData = (athlete) => {
  const dataStr = JSON.stringify(athlete, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `atleta_${athlete.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// src/constants/athleteConstants.js

export const MOOD_OPTIONS = [
  { value: 'happy', icon: '😊', label: 'Feliz', color: '#059669' },
  { value: 'neutral', icon: '😐', label: 'Neutro', color: '#6B7280' },
  { value: 'sad', icon: '😔', label: 'Triste', color: '#DC2626' }
];

export const OBSERVATION_TYPES = [
  { value: 'general', label: 'Geral', color: '#6B7280' },
  { value: 'training', label: 'Treino', color: '#2563EB' },
  { value: 'health', label: 'Saúde', color: '#DC2626' },
  { value: 'nutrition', label: 'Nutrição', color: '#059669' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Baixa', color: '#6B7280' },
  { value: 'normal', label: 'Normal', color: '#3B82F6' },
  { value: 'medium', label: 'Média', color: '#D97706' },
  { value: 'high', label: 'Alta', color: '#DC2626' }
];

export const MEASUREMENT_LABELS = {
  waist: { icon: '⚖️', label: 'Cintura' },
  hips: { icon: '🍑', label: 'Quadril' },
  chest: { icon: '💪', label: 'Peito' },
  thighs: { icon: '🦵', label: 'Coxa' },
  arms: { icon: '💪', label: 'Braço' },
  abdomen: { icon: '🤰', label: 'Abdômen' }
};

export const ATHLETE_STATUS = {
  active: { label: 'Ativo', color: '#059669', bg: '#ECFDF5' },
  inactive: { label: 'Inativo', color: '#DC2626', bg: '#FEF2F2' },
  paused: { label: 'Pausado', color: '#D97706', bg: '#FFFBEB' }
};

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};