// src/components/alunos/AlunoDetailsModal.jsx

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
      
      {/* Usamos <dl> para uma lista de definições, que é semanticamente melhor */}
      <dl className="student-details-list">
        <dt>Nome Completo:</dt>
        <dd>{aluno.nome}</dd>
        
        <dt>Data de Nascimento:</dt>
        <dd>{formatDateBR(aluno.data_nascimento)}</dd>
        
        <dt>Nome do Responsável:</dt>
        <dd>{aluno.nome_responsaveis || 'Não informado'}</dd>
        
        <dt>Telefone:</dt>
        <dd>{formatPhoneBR(aluno.telefone) || 'Não informado'}</dd>
        
        <dt>Endereço:</dt>
        <dd>{aluno.endereco || 'Não informado'}</dd>
        
        <dt>Observações:</dt>
        <dd>{aluno.observacoes || 'Nenhuma'}</dd>

        <dt>Status:</dt>
        <dd>{aluno.ativo ? 'Ativo' : 'Inativo'}</dd>
      </dl>

      <hr style={{ margin: '20px 0' }} />

      <h4>Aulas Matriculadas:</h4>
      {aluno.aulas && aluno.aulas.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {aluno.aulas.map(aula => (
            <li key={aula.id} className="enrolled-class-item">
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
              <button onClick={() => handleMatriculaDelete(aula.pivot.id)} title="Cancelar Matrícula" className="btn-icon-danger">
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
        <button onClick={() => setShowMatriculaForm(true)} className="btn btn-primary" style={{ marginTop: '10px' }}>
          Matricular em Nova Aula
        </button>
      )}

      {/* Footer do Modal com botões estilizados */}
      <div className="modal-footer">
        <button onClick={onClose} className="btn btn-secondary">Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunoDetailsModal;