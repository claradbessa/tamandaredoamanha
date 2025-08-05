import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDateBR } from '../utils/formatters';

function RelatorioFrequenciaPage() {
  const [aulas, setAulas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca a lista de aulas (com voluntários e horários) e todos os registos de frequência
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos a rota paginada para obter todos os detalhes, incluindo voluntário e horários
        const [aulasResponse, frequenciasResponse] = await Promise.all([
          api.get('/aulas'),
          api.get('/frequencias')
        ]);
        setAulas(aulasResponse.data.data); // A lista de aulas está em .data
        setRegistros(frequenciasResponse.data);
      } catch (err) {
        setError('Falha ao carregar os dados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>A carregar...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const registrosFiltrados = selectedAula
    ? registros.filter(r => r.aula_id === selectedAula.id)
    : [];

  return (
    <div>
      <h2>Relatório de Frequência</h2>

      {!selectedAula && (
        <div>
          <h3>Por favor, selecione uma aula para ver o relatório:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aulas.map(aula => (
              <div 
                key={aula.id} 
                onClick={() => setSelectedAula(aula)} 
                style={{ cursor: 'pointer', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}
              >
                <strong style={{ fontSize: '1.1em' }}>{aula.nome}</strong>
                <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                  <span>Prof. {aula.voluntario?.nome || 'N/A'}</span>
                  {/* Mapeia e exibe a lista de horários */}
                  {aula.horarios && aula.horarios.length > 0 && (
                    <ul style={{ margin: '5px 0 0 0', padding: 0, listStyleType: 'none' }}>
                      {aula.horarios.map(h => (
                        <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAula && (
        <div>
          <button onClick={() => setSelectedAula(null)}>← Voltar para a lista de aulas</button>
          <h3 style={{ marginTop: '20px' }}>Exibindo frequência para: {selectedAula.nome}</h3>
          
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Aluno(a)</th>
                <th>Status</th>
                <th>Registado por</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map(registro => (
                  <tr key={registro.id}>
                    <td>{formatDateBR(registro.data)}</td>
                    <td>{registro.aluno?.nome || 'Aluno não encontrado'}</td>
                    <td>{registro.presenca ? 'Presente' : 'Falta'}</td>
                    <td>{registro.voluntario?.nome || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                    Nenhum registo de frequência encontrado para esta aula.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RelatorioFrequenciaPage;