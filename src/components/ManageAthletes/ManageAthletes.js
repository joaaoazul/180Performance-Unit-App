// src/components/ManageAthletes.js
import React, { useState, useEffect } from 'react';

const ManageAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', healthInfo: '' });
  const [editingAthleteId, setEditingAthleteId] = useState(null);

  // Carrega dados dummy (simulação; no futuro, buscar do backend)
  useEffect(() => {
    const dummyAthletes = [
      { id: 1, name: 'Atleta 1', age: 25, healthInfo: 'Sem restrições' },
      { id: 2, name: 'Atleta 2', age: 28, healthInfo: 'Diabetes Tipo 2' },
      { id: 3, name: 'Atleta 3', age: 22, healthInfo: 'Sem restrições' },
    ];
    setAthletes(dummyAthletes);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAthleteId) {
      setAthletes(athletes.map(athlete =>
        athlete.id === editingAthleteId ? { ...athlete, ...formData } : athlete
      ));
      setEditingAthleteId(null);
    } else {
      const newAthlete = { id: Date.now(), ...formData };
      setAthletes([...athletes, newAthlete]);
    }
    setFormData({ name: '', age: '', healthInfo: '' });
  };

  const handleEdit = (athlete) => {
    setFormData({ name: athlete.name, age: athlete.age, healthInfo: athlete.healthInfo });
    setEditingAthleteId(athlete.id);
  };

  const handleDelete = (id) => {
    setAthletes(athletes.filter(athlete => athlete.id !== id));
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3>Gestão de Atletas</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Nome do Atleta"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="number"
          name="age"
          placeholder="Idade"
          value={formData.age}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="healthInfo"
          placeholder="Informações de Saúde"
          value={formData.healthInfo}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          {editingAthleteId ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#e9ecef' }}>
          <tr>
            <th style={tableCellStyle}>Nome</th>
            <th style={tableCellStyle}>Idade</th>
            <th style={tableCellStyle}>Saúde</th>
            <th style={tableCellStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map(athlete => (
            <tr key={athlete.id}>
              <td style={tableCellStyle}>{athlete.name}</td>
              <td style={tableCellStyle}>{athlete.age}</td>
              <td style={tableCellStyle}>{athlete.healthInfo}</td>
              <td style={tableCellStyle}>
                <button onClick={() => handleEdit(athlete)} style={actionButtonStyle}>
                  Editar
                </button>
                <button onClick={() => handleDelete(athlete.id)} style={actionButtonStyle}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = {
  padding: '8px',
  flex: 1
};

const buttonStyle = {
  padding: '8px 16px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

const tableCellStyle = {
  padding: '8px',
  border: '1px solid #dee2e6',
  textAlign: 'center'
};

const actionButtonStyle = {
  padding: '4px 8px',
  margin: '0 4px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default ManageAthletes;
