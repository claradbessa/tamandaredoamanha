import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDateBR } from '../utils/formatters';

function RelatorioFrequenciaPage() {
  const [aulas, setAulas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aulasResponse, frequenciasResponse] = await Promise.all([
          api.get('/aulas'),
          api.get('/frequencias')
        ]);
        setAulas(aulasResponse.data.data);
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

  if (loading) return <p>Carregando...</p>;

  const registrosFiltrados = selectedAula
    ? registros.filter(r => r.aula_id === selectedAula.id)
    : [];

  return (
    <>
      <div className="main-content-header">
        <h1>Relatório de Frequência</h1>
        {selectedAula && (
          <button onClick={() => setSelectedAula(null)} className="btn btn-secondary">← Ver todas as aulas</button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        {!selectedAula ? (
          <div>
            <h3>Por favor, selecione uma aula para ver o relatório:</h3>
            <div className="class-selection-list" style={{ marginTop: '20px' }}>
              {aulas.map(aula => (
                <div 
                  key={aula.id} 
                  onClick={() => setSelectedAula(aula)} 
                  className="class-selection-item"
                >
                  <strong>{aula.nome}</strong>
                  <div className="details">
                    <span>Prof. {aula.voluntario?.nome || 'N/A'}</span>
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
        ) : (
          <div>
            <h3>Exibindo frequência para: {selectedAula.nome}</h3>
            
            <table style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Aluno(a)</th>
                  <th>Status</th>
                  <th className="hide-on-mobile">Registado por</th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map(registro => (
                    <tr key={registro.id}>
                      <td>{formatDateBR(registro.data)}</td>
                      <td>{registro.aluno?.nome || 'Aluno não encontrado'}</td>
                      <td>{registro.presenca ? 
                        <span style={{color: 'var(--cor-sucesso)', fontWeight: 'bold'}}>Presente</span> : 
                        <span style={{color: 'var(--cor-erro)'}}>Falta</span>}
                      </td>
                      <td className="hide-on-mobile">{registro.voluntario?.nome || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      Nenhum registo de frequência encontrado para esta aula.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default RelatorioFrequenciaPage;