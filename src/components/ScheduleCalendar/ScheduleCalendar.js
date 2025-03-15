// src/components/ScheduleCalendar.js
import React, { useState, useEffect } from 'react';
import { inputStyle, buttonStyle, actionButtonStyle } from '../../styles';


function ScheduleCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    athleteId: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'training',
    notes: ''
  });

  useEffect(() => {
    // Dados dummy de eventos
    setEvents([
      { id: 1, title: 'Sessão com Atleta 1', date: new Date(), startTime: '09:00', endTime: '10:00', type: 'training', athlete: { name: 'Atleta 1' } }
    ]);
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setNewEvent({ ...newEvent, date });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setShowModal(false);
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3>Agenda e Pagamentos</h3>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={buttonStyle}>Anterior</button>
        <h4>{selectedDate.toLocaleDateString()}</h4>
        <button style={buttonStyle}>Próximo</button>
      </div>
      <div>
        <h4>Eventos do Dia</h4>
        <ul>
          {events.filter(ev => new Date(ev.date).toDateString() === selectedDate.toDateString()).map(event => (
            <li key={event.id}>
              {event.title} ({event.startTime} - {event.endTime})
            </li>
          ))}
        </ul>
      </div>
      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h4>Agendar Novo Evento</h4>
            <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Título"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
              <select
                value={newEvent.athleteId}
                onChange={(e) => setNewEvent({ ...newEvent, athleteId: e.target.value })}
                required
              >
                <option value="">Selecione um atleta</option>
                <option value="1">Atleta 1</option>
                <option value="2">Atleta 2</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  required
                />
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Observações"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={buttonStyle}>
                  Cancelar
                </button>
                <button type="submit" style={buttonStyle}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalContentStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  minWidth: '300px'
};

export default ScheduleCalendar;
