import { useState, useEffect } from 'react';
import api from '../../services/api';

function AulaForm({ onSave, onCancel, aulaToEdit }) {
  const [nome, setNome] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horario, setHorario] = useState('');
  const [voluntarioId, setVoluntarioId] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localAula, setLocalAula] = useState('');
  const [voluntarios, setVoluntarios] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Estilo padronizado para todos os campos
  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    boxSizing: 'border-box' // Garante que o padding não aumente a largura
  };

  useEffect(() => {
    api.get('/voluntarios').then(response => {
      setVoluntarios(response.data);
    });
  }, []);

  useEffect(() => {
    if (aulaToEdit) {
      setNome(aulaToEdit.nome || '');
      setDiaSemana(aulaToEdit.dia_semana || '');
      setHorario(aulaToEdit.horario ? aulaToEdit.horario.substring(0, 5) : '');
      setVoluntarioId(aulaToEdit.voluntario_id || '');
      setCapacidade(aulaToEdit.capacidade || '');
      setLocalAula(aulaToEdit.local_aula || '');
    }
  }, [aulaToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const aulaData = {
      nome,
      dia_semana: diaSemana,
      horario: horario ? horario.substring(0, 5) : null,
      voluntario_id: voluntarioId,
      capacidade: capacidade,
      local_aula: localAula,
    };
    await onSave(aulaData, aulaToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nome">Nome da Aula:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="diaSemana">Dia da Semana:</label>
        <select
          id="diaSemana"
          value={diaSemana}
          onChange={(e) => setDiaSemana(e.target.value)}
          style={inputStyle}
        >
          <option value="">Selecione um dia</option>
          <option value="segunda">Segunda-feira</option>
          <option value="terca">Terça-feira</option>
          <option value="quarta">Quarta-feira</option>
          <option value="quinta">Quinta-feira</option>
          <option value="sexta">Sexta-feira</option>
          <option value="sabado">Sábado</option>
          <option value="domingo">Domingo</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="horario">Horário:</label>
        <input
          type="time"
          id="horario"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          style={inputStyle}
        />
      </div>
       <div style={{ marginBottom: '15px' }}>
        <label htmlFor="capacidade">Capacidade (Nº de Alunos):</label>
        <input
          type="number"
          id="capacidade"
          value={capacidade}
          onChange={(e) => setCapacidade(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="localAula">Local da Aula:</label>
        <input
          type="text"
          id="localAula"
          value={localAula}
          onChange={(e) => setLocalAula(e.target.value)}
          placeholder="Ex: Sala 1, Pátio"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="voluntario">Voluntário Responsável:</label>
        <select
          id="voluntario"
          value={voluntarioId}
          onChange={(e) => setVoluntarioId(e.target.value)}
          style={inputStyle}
        >
          <option value="">Nenhum</option>
          {voluntarios.map(voluntario => (
            <option key={voluntario.id} value={voluntario.id}>
              {voluntario.nome}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
        <button type="submit" disabled={isSaving} style={{ marginLeft: '10px' }}>
          {isSaving ? 'A salvar...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default AulaForm;