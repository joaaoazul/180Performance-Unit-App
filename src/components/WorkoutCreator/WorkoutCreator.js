// src/components/WorkoutCreator.js
import React, { useState, useEffect } from 'react';
import { inputStyle, buttonStyle, actionButtonStyle } from '../../styles';

function WorkoutCreator() {
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    athleteId: '',
    exercises: []
  });
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    // Dados dummy de exercícios
    setAvailableExercises([
      { id: 'ex1', name: 'Agachamento' },
      { id: 'ex2', name: 'Supino' },
      { id: 'ex3', name: 'Puxada' }
    ]);
  }, []);

  const addExercise = () => {
    if (selectedExercise) {
      setWorkout({
        ...workout,
        exercises: [
          ...workout.exercises,
          { exerciseId: selectedExercise.id, name: selectedExercise.name, sets: 3, reps: 12 }
        ]
      });
      setSelectedExercise(null);
    }
  };

  const removeExercise = (index) => {
    const updated = [...workout.exercises];
    updated.splice(index, 1);
    setWorkout({ ...workout, exercises: updated });
  };

  const saveWorkout = () => {
    // Aqui, chamarias uma função para salvar o treino no backend.
    console.log('Treino salvo:', workout);
    setWorkout({ title: '', description: '', athleteId: '', exercises: [] });
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3>Criar Treino</h3>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Título do Treino"
          value={workout.title}
          onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Descrição"
          value={workout.description}
          onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
          style={{ ...inputStyle, height: '80px' }}
        />
        <select
          value={workout.athleteId}
          onChange={(e) => setWorkout({ ...workout, athleteId: e.target.value })}
          style={inputStyle}
        >
          <option value="">Selecione um atleta</option>
          {/* Opções de atletas; dados dummy por ora */}
          <option value="1">Atleta 1</option>
          <option value="2">Atleta 2</option>
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h4>Adicionar Exercícios</h4>
        <select
          value={selectedExercise ? selectedExercise.id : ''}
          onChange={(e) => {
            const ex = availableExercises.find(ex => ex.id === e.target.value);
            setSelectedExercise(ex);
          }}
          style={inputStyle}
        >
          <option value="">Selecione um exercício</option>
          {availableExercises.map(exercise => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <button onClick={addExercise} style={buttonStyle}>
          Adicionar
        </button>
      </div>
      <div>
        <h4>Exercícios no Treino</h4>
        <ul>
          {workout.exercises.map((ex, index) => (
            <li key={index}>
              {ex.name} - Séries: {ex.sets}, Repetições: {ex.reps}
              <button onClick={() => removeExercise(index)} style={actionButtonStyle}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={saveWorkout} style={{ ...buttonStyle, background: '#17a2b8' }}>
        Salvar Treino
      </button>
    </div>
  );
}

export default WorkoutCreator;
