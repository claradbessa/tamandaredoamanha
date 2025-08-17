import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function FrequenciaPage() {
  const { id: aulaId } = useParams();
  const { user } = useAuth();
  const [aula, setAula] = useState(null);
  const [frequencias, setFrequencias] = useState({});
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAulaData = async () => {
      try {
        setLoading(true);
        const aulaResponse = await api.get(`/aulas/${aulaId}`);
        setAula(aulaResponse.data);
        const frequenciaInicial = {};
        aulaResponse.data.alunos.forEach(aluno => {
          frequenciaInicial[aluno.id] = 'presente';
        });
        setFrequencias(frequenciaInicial);
      } catch (err) {
        setError('Falha ao carregar dados da aula.');
      } finally {
        setLoading(false);
      }
    };
    fetchAulaData();
  }, [aulaId]);

  const handleFrequenciaChange = (alunoId, status) => {
    setFrequencias(prevFrequencias => ({
      ...prevFrequencias,
      [alunoId]: status,
    }));
  };

  const handleSaveFrequencia = async () => {
    setError('');
    setSuccessMessage('');
    const payload = {
      aula_id: parseInt(aulaId, 10),
      data: data,
      registrado_por: user.id,
      frequencias: Object.entries(frequencias).map(([alunoId, status]) => ({
        aluno_id: parseInt(alunoId, 10),
        presenca: status === 'presente',
      })),
    };
    try {
      await api.post('/frequencias/batch', payload);
      setSuccessMessage('Frequência salva com sucesso!');
    } catch (err) {
      setError('Falha ao salvar a frequência.');
      console.error(err);
    }
  };

  if (loading) return <p>A carregar dados da aula...</p>;

  return (
    <>
      <div className="main-content-header">
        <div>
          <h1>Registo de Frequência</h1>
          <h2 style={{ fontSize: '1.2rem', color: '#555', fontWeight: 'normal' }}>{aula?.nome}</h2>
        </div>
        <Link to="/admin/aulas" className="btn btn-secondary">← Voltar para Aulas</Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
          <label htmlFor="data-frequencia">Data da Frequência:</label>
          <input
            type="date"
            id="data-frequencia"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome do Aluno</th>
              <th style={{width: '250px'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {aula?.alunos.length > 0 ? (
              aula.alunos.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>
                    <label style={{ marginRight: '20px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`frequencia-${aluno.id}`}
                        checked={frequencias[aluno.id] === 'presente'}
                        onChange={() => handleFrequenciaChange(aluno.id, 'presente')}
                      />
                      {' '}Presente
                    </label>
                    <label style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`frequencia-${aluno.id}`}
                        checked={frequencias[aluno.id] === 'ausente'}
                        onChange={() => handleFrequenciaChange(aluno.id, 'ausente')}
                      />
                      {' '}Falta
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum aluno matriculado nesta aula.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={handleSaveFrequencia} className="btn btn-primary">Salvar Frequência</button>
        </div>
      </div>
    </>
  );
}

export default FrequenciaPage;