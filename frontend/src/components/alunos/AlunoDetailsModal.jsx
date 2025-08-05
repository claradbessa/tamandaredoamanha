import Modal from '../Modal';
import { formatDateBR, formatPhoneBR } from '../../utils/formatters';
import api from '../../services/api';
import { FaTrashAlt } from 'react-icons/fa';
import MatriculaForm from '../matriculas/MatriculaForm';
import { useState } from 'react';

function AlunoDetailsModal({ aluno, onClose, onUpdate }) {
  const [showMatriculaForm, setShowMatriculaForm] = useState(false);

  if (!aluno) {
    return null;
  }

  const handleMatriculaSave = async (matriculaData) => {
    try {
      await api.post('/matriculas', matriculaData);
      setShowMatriculaForm(false);
      onUpdate();
    } catch (error) {
      console.error("Falha ao matricular aluno", error);
      alert('Falha ao matricular aluno. O aluno já pode estar matriculado nesta aula.');
    }
  };

  const handleMatriculaDelete = async (matriculaId) => {
    if (window.confirm('Tem a certeza que deseja cancelar esta matrícula?')) {
      try {
        await api.delete(`/matriculas/${matriculaId}`);
        onUpdate();
      } catch (error) {
        console.error("Falha ao cancelar matrícula", error);
        alert('Falha ao cancelar matrícula.');
      }
    }
  };

  return (
    <Modal isOpen={!!aluno} onClose={onClose} title={`Detalhes de ${aluno.nome}`}>
      <div>
        <p><strong>Nome Completo:</strong> {aluno.nome}</p>
        <p><strong>Data de Nascimento:</strong> {formatDateBR(aluno.data_nascimento)}</p>
        <p><strong>Nome do Responsável:</strong> {aluno.nome_responsaveis || 'Não informado'}</p>
        <p><strong>Telefone:</strong> {formatPhoneBR(aluno.telefone) || 'Não informado'}</p>
        <p><strong>Endereço:</strong> {aluno.endereco || 'Não informado'}</p>
        <p><strong>Observações:</strong> {aluno.observacoes || 'Nenhuma'}</p>
        <p><strong>Status:</strong> {aluno.ativo ? 'Ativo' : 'Inativo'}</p>

        <hr style={{ margin: '20px 0' }} />

        <h4>Aulas Matriculadas:</h4>
        {aluno.aulas && aluno.aulas.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {aluno.aulas.map(aula => (
              <li key={aula.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <strong>{aula.nome}</strong> - Prof. {aula.voluntario?.nome || 'N/A'}
                  {aula.horarios && aula.horarios.length > 0 && (
                    <ul style={{ margin: '5px 0 0 0', padding: 0, listStyleType: 'none', fontSize: '0.9em', color: '#555' }}>
                      {aula.horarios.map(h => (
                        <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button onClick={() => handleMatriculaDelete(aula.pivot.id)} title="Cancelar Matrícula">
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Este aluno não está matriculado em nenhuma aula.</p>
        )}
        
        {showMatriculaForm ? (
          <MatriculaForm
            alunoId={aluno.id}
            onMatriculaSaved={handleMatriculaSave}
            onCancel={() => setShowMatriculaForm(false)}
          />
        ) : (
          <button onClick={() => setShowMatriculaForm(true)} style={{ marginTop: '10px' }}>
            Matricular em Nova Aula
          </button>
        )}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunoDetailsModal;