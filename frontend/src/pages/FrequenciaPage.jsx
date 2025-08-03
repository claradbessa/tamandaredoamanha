import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function FrequenciaPage() {
  const { id } = useParams(); // Pega o ID da aula a partir da URL
  const { user } = useAuth(); // Pega o voluntário logado para saber quem registou

  const [aula, setAula] = useState(null);
  const [frequencias, setFrequencias] = useState({});
  const [data, setData] = useState(new Date().toISOString().split('T')[0]); // Data de hoje por defeito
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Busca os dados da aula e prepara o estado da frequência
  useEffect(() => {
    const fetchAulaData = async () => {
      try {
        setLoading(true);
        const aulaResponse = await api.get(`/aulas/${id}`);
        setAula(aulaResponse.data);

        const frequenciaInicial = {};
        aulaResponse.data.alunos.forEach(aluno => {
          frequenciaInicial[aluno.id] = 'presente'; // Começa com todos como "presente"
        });
        setFrequencias(frequenciaInicial);

      } catch (err) {
        setError('Falha ao carregar dados da aula.');
      } finally {
        setLoading(false);
      }
    };
    fetchAulaData();
  }, [id]);

  const handleFrequenciaChange = (alunoId, status) => {
    setFrequencias(prevFrequencias => ({
      ...prevFrequencias,
      [alunoId]: status,
    }));
  };

  const handleSaveFrequencia = async () => {
    setError('');
    setSuccessMessage('');

    const payload = Object.entries(frequencias).map(([alunoId, status]) => ({
      aluno_id: parseInt(alunoId, 10),
      aula_id: parseInt(id, 10),
      data: data,
      presenca: status === 'presente',
      registrado_por: user.id,
    }));

    try {
      // O backend espera um registo de cada vez.
      // Uma melhoria futura seria criar um endpoint para receber um array.
      for (const registro of payload) {
        await api.post('/frequencias', registro);
      }
      setSuccessMessage('Frequência salva com sucesso!');
    } catch (err) {
      setError('Falha ao salvar a frequência. Pode já existir um registo para um ou mais alunos nesta data.');
      console.error(err);
    }
  };

  if (loading) return <p>A carregar dados da aula...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Link to="/admin/aulas">← Voltar para Aulas</Link>
      <h2 style={{marginTop: '15px'}}>Registo de Frequência</h2>
      {aula && <h3>{aula.nome}</h3>}
      
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="data-frequencia">Data da Frequência: </label>
        <input
          type="date"
          id="data-frequencia"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      {successMessage && <div style={{ color: 'green', background: '#e6ffed', padding: '10px', margin: '15px 0' }}>{successMessage}</div>}

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome do Aluno</th>
            <th style={{width: '200px'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {aula?.alunos.length > 0 ? (
            aula.alunos.map(aluno => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>
                  <label>
                    <input
                      type="radio"
                      name={`frequencia-${aluno.id}`}
                      checked={frequencias[aluno.id] === 'presente'}
                      onChange={() => handleFrequenciaChange(aluno.id, 'presente')}
                    />
                    Presente
                  </label>
                  <label style={{ marginLeft: '15px' }}>
                    <input
                      type="radio"
                      name={`frequencia-${aluno.id}`}
                      checked={frequencias[aluno.id] === 'ausente'}
                      onChange={() => handleFrequenciaChange(aluno.id, 'ausente')}
                    />
                    Falta
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhum aluno matriculado nesta aula.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={handleSaveFrequencia}>Salvar Frequência</button>
      </div>
    </div>
  );
}

export default FrequenciaPage;