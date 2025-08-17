
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

function AulaForm({ onSave, onCancel, aulaToEdit }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [voluntarioId, setVoluntarioId] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [localAula, setLocalAula] = useState('');
  const [horarios, setHorarios] = useState([{ dia_semana: '', horario: '' }]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/voluntarios').then(response => {
      setVoluntarios(response.data);
    });
  }, []);

  useEffect(() => {
    if (aulaToEdit) {
      setNome(aulaToEdit.nome || '');
      setDescricao(aulaToEdit.descricao || '');
      setVoluntarioId(aulaToEdit.voluntario_id || '');
      setCapacidade(aulaToEdit.capacidade || '');
      setLocalAula(aulaToEdit.local_aula || '');
      if (aulaToEdit.horarios && aulaToEdit.horarios.length > 0) {
        setHorarios(aulaToEdit.horarios.map(h => ({ dia_semana: h.dia_semana, horario: h.horario.substring(0, 5) })));
      } else {
        setHorarios([{ dia_semana: '', horario: '' }]);
      }
    }
  }, [aulaToEdit]);

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
      horarios,
    };
    await onSave(aulaData, aulaToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome da Aula:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>

      <hr style={{ margin: '20px 0' }}/>
      
      <div className="form-group">
        <label>Horários:</label>
        {horarios.map((horario, index) => (
          <div key={index} className="horario-row">
            <select value={horario.dia_semana} onChange={(e) => handleHorarioChange(index, 'dia_semana', e.target.value)} required>
              <option value="">Selecione um dia</option>
              <option value="segunda">Segunda</option>
              <option value="terca">Terça</option>
              <option value="quarta">Quarta</option>
              <option value="quinta">Quinta</option>
              <option value="sexta">Sexta</option>
              <option value="sabado">Sábado</option>
              <option value="domingo">Domingo</option>
            </select>
            <input type="time" value={horario.horario} onChange={(e) => handleHorarioChange(index, 'horario', e.target.value)} required />
            {horarios.length > 1 && (
              <button type="button" onClick={() => handleRemoveHorario(index)} className="btn-icon-danger" title="Remover Horário">
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddHorario} className="btn btn-secondary add-horario-btn">
          <FaPlus size={12} /> Adicionar Horário
        </button>
      </div>
      
      <hr style={{ margin: '20px 0' }}/>
      
      <div className="form-group">
        <label htmlFor="capacidade">Capacidade (Nº de Alunos):</label>
        <input type="number" id="capacidade" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="localAula">Local da Aula:</label>
        <input type="text" id="localAula" value={localAula} onChange={(e) => setLocalAula(e.target.value)} placeholder="Ex: Sala 1, Pátio" />
      </div>
      <div className="form-group">
        <label htmlFor="voluntario">Voluntário Responsável:</label>
        <select id="voluntario" value={voluntarioId} onChange={(e) => setVoluntarioId(e.target.value)}>
          <option value="">Nenhum</option>
          {voluntarios.map(voluntario => (
            <option key={voluntario.id} value={voluntario.id}>{voluntario.nome}</option>
          ))}
        </select>
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onCancel} disabled={isSaving} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} className="btn btn-primary">
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default AulaForm;