import { useState, useEffect } from 'react';
import api from '../../services/api';

function MatriculaForm({ alunoId, onMatriculaSaved, onCancel }) {
  const [aulas, setAulas] = useState([]);
  const [selectedAulaId, setSelectedAulaId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Busca a lista de todas as aulas disponíveis
  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await api.get('/aulas');
        setAulas(response.data);
      } catch (error) {
        console.error("Falha ao buscar aulas", error);
      }
    };
    fetchAulas();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAulaId) {
      alert('Por favor, selecione uma aula.');
      return;
    }
    setIsSaving(true);
    await onMatriculaSaved({
      aluno_id: alunoId,
      aula_id: selectedAulaId,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="aula">Selecione a Aula:</label>
        <select
          id="aula"
          value={selectedAulaId}
          onChange={(e) => setSelectedAulaId(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="">-- Escolha uma aula --</option>
          {aulas.map(aula => (
            <option key={aula.id} value={aula.id}>
              {aula.nome} ({aula.dia_semana})
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
        <button type="submit" disabled={isSaving} style={{ marginLeft: '10px' }}>
          {isSaving ? 'A matricular...' : 'Matricular'}
        </button>
      </div>
    </form>
  );
}

export default MatriculaForm;