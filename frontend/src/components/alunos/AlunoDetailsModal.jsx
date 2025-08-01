import Modal from '../Modal';
import { formatDateBR, formatPhoneBR } from '../../utils/formatters';
import api from '../../services/api';
import { FaTrashAlt } from 'react-icons/fa';

function AlunoDetailsModal({ aluno, onClose, onUpdate }) {
  if (!aluno) {
    return null;
  }

  const handleMatriculaDelete = async (matriculaId) => {
    if (window.confirm('Tem a certeza que deseja cancelar esta matrícula?')) {
      try {
        await api.delete(`/matriculas/${matriculaId}`);
        onUpdate(); // Pede à página principal para atualizar os dados
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
              <li key={aula.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span>
                  <strong>{aula.nome}</strong> ({aula.dia_semana || 'sem dia'}) - Prof. {aula.voluntario?.nome || 'N/A'}
                </span>
                <button onClick={() => handleMatriculaDelete(aula.pivot.id)} title="Cancelar Matrícula">
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Este aluno não está matriculado em nenhuma aula.</p>
        )}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunoDetailsModal;