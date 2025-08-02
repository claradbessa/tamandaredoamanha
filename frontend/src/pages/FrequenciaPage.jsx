import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function FrequenciaPage() {
  const { id } = useParams(); // Pega o ID da aula a partir da URL
  const { user } = useAuth(); // Pega o voluntário logado

  const [aula, setAula] = useState(null);
  const [frequencias, setFrequencias] = useState({});
  const [data, setData] = useState(new Date().toISOString().split('T')[0]); // Data de hoje por defeito
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os dados da aula e os registos de frequência existentes para a data selecionada
  useEffect(() => {
    const fetchAulaData = async () => {
      try {
        setLoading(true);
        const aulaResponse = await api.get(`/aulas/${id}`);
        setAula(aulaResponse.data);

        // Prepara o estado inicial de frequência para cada aluno matriculado
        const frequenciaInicial = {};
        aulaResponse.data.alunos.forEach(aluno => {
          frequenciaInicial[aluno.id] = 'presente'; // Começa com todos presentes
        });
        setFrequencias(frequenciaInicial);

      } catch (err) {
        setError('Falha ao carregar dados da aula.');
      } finally {
        setLoading(false);
      }
    };
    fetchAulaData();
  }, [id, data]);

  const handleFrequenciaChange = (alunoId, status) => {
    setFrequencias(prevFrequencias => ({
      ...prevFrequencias,
      [alunoId]: status,
    }));
  };

  const handleSaveFrequencia = async () => {
    try {
      const payload = Object.entries(frequencias).map(([alunoId, status]) => ({
        aluno_id: alunoId,
        aula_id: id,
        data: data,
        presenca: status === 'presente',
        registrado_por: user.id,
      }));

      for (const registro of payload) {
        await api.post('/frequencias', registro);
      }

      alert('Frequência salva com sucesso!');
    } catch (err) {
      setError('Falha ao salvar a frequência. Pode já existir um registo para um ou mais alunos nesta data.');
      console.error(err);
    }
  };

  if (loading) return <p>A carregar dados da aula...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Registo de Frequência</h2>
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

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome do Aluno</th>
            <th>Status</th>
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