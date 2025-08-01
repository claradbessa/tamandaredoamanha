import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

function AulaForm({ onSave, onCancel, aulaToEdit }) {
  // Estados para os campos principais da aula
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [voluntarioId, setVoluntarioId] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localAula, setLocalAula] = useState('');
  
  // Estado para a lista de horários
  const [horarios, setHorarios] = useState([{ dia_semana: '', horario: '' }]);
  
  const [voluntarios, setVoluntarios] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Busca a lista de voluntários
  useEffect(() => {
    api.get('/voluntarios').then(response => {
      setVoluntarios(response.data);
    });
  }, []);

  // Preenche o formulário ao editar uma aula
  useEffect(() => {
    if (aulaToEdit) {
      setNome(aulaToEdit.nome || '');
      setDescricao(aulaToEdit.descricao || '');
      setVoluntarioId(aulaToEdit.voluntario_id || '');
      setCapacidade(aulaToEdit.capacidade || '');
      setLocalAula(aulaToEdit.local_aula || '');
      
      // Se houver horários, preenche. Senão, começa com um campo vazio.
      if (aulaToEdit.horarios && aulaToEdit.horarios.length > 0) {
        setHorarios(aulaToEdit.horarios.map(h => ({ dia_semana: h.dia_semana, horario: h.horario.substring(0, 5) })));
      } else {
        setHorarios([{ dia_semana: '', horario: '' }]);
      }
    }
  }, [aulaToEdit]);

  // Funções para gerir a lista de horários
  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const handleAddHorario = () => {
    setHorarios([...horarios, { dia_semana: '', horario: '' }]);
  };

  const handleRemoveHorario = (index) => {
    const newHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(newHorarios);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const aulaData = {
      nome,
      descricao,
      voluntario_id: voluntarioId,
      capacidade,
      local_aula: localAula,
      horarios, // Envia a lista de horários para a API
    };
    await onSave(aulaData, aulaToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos de dados principais da aula */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nome">Nome da Aula:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>

      {/* Secção de Horários Dinâmicos */}
      <hr style={{ margin: '20px 0' }}/>
      <label>Horários:</label>
      {horarios.map((horario, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <select value={horario.dia_semana} onChange={(e) => handleHorarioChange(index, 'dia_semana', e.target.value)} required style={{ flex: 1, padding: '8px', marginRight: '10px' }}>
            <option value="">Selecione um dia</option>
            <option value="segunda">Segunda</option>
            <option value="terca">Terça</option>
            <option value="quarta">Quarta</option>
            <option value="quinta">Quinta</option>
            <option value="sexta">Sexta</option>
            <option value="sabado">Sábado</option>
            <option value="domingo">Domingo</option>
          </select>
          <input type="time" value={horario.horario} onChange={(e) => handleHorarioChange(index, 'horario', e.target.value)} required style={{ flex: 1, padding: '8px' }} />
          {horarios.length > 1 && (
            <button type="button" onClick={() => handleRemoveHorario(index)} style={{ marginLeft: '10px' }} title="Remover Horário">
              <FaTrashAlt />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddHorario} style={{ display: 'flex', alignItems: 'center' }}>
        <FaPlus size={12} style={{ marginRight: '5px' }} /> Adicionar Horário
      </button>
      <hr style={{ margin: '20px 0' }}/>
      
      {/* Outros campos */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="capacidade">Capacidade (Nº de Alunos):</label>
        <input type="number" id="capacidade" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="localAula">Local da Aula:</label>
        <input type="text" id="localAula" value={localAula} onChange={(e) => setLocalAula(e.target.value)} placeholder="Ex: Sala 1, Pátio" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="voluntario">Voluntário Responsável:</label>
        <select id="voluntario" value={voluntarioId} onChange={(e) => setVoluntarioId(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
          <option value="">Nenhum</option>
          {voluntarios.map(voluntario => (
            <option key={voluntario.id} value={voluntario.id}>{voluntario.nome}</option>
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