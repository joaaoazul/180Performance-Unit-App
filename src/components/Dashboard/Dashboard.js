// src/components/Dashboard.js
import React from 'react';
import Header from '../Header/Header';
import ManageAthletes from '../ManageAthletes/ManageAthletes';
import WorkoutCreator from '../WorkoutCreator/WorkoutCreator';
import ScheduleCalendar from '../ScheduleCalendar/ScheduleCalendar';

const Dashboard = () => {
  return (
    <div>
      <Header />
      <div style={{ padding: '20px', background: '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
        <h2 style={{ marginBottom: '20px', color: '#343a40' }}>
          Dashboard do Personal Trainer
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          {/* Cards de resumo (estatísticas) */}
          <div style={cardStyle}>
            <h3>Total de Atletas</h3>
            <p style={statValue}>25</p>
          </div>
          <div style={cardStyle}>
            <h3>Sessões Hoje</h3>
            <p style={statValue}>8</p>
          </div>
          <div style={cardStyle}>
            <h3>Receita Mensal</h3>
            <p style={statValue}>R$ 5.200</p>
          </div>
        </div>
        
        {/* Seção de Gestão de Atletas */}
        <ManageAthletes />
        
        {/* Seção de Criação de Treino */}
        <WorkoutCreator />
        
        {/* Seção de Agenda e Agendamento */}
        <ScheduleCalendar />
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const statValue = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#007bff'
};

export default Dashboard;
