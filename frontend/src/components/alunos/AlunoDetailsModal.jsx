import Modal from '../Modal';

function AlunoDetailsModal({ aluno, onClose }) {
  if (!aluno) {
    return null;
  }

  return (
    <Modal isOpen={!!aluno} onClose={onClose} title={`Detalhes de ${aluno.nome}`}>
      <div>
        <p><strong>ID:</strong> {aluno.id}</p>
        <p><strong>Nome Completo:</strong> {aluno.nome}</p>
        <p><strong>Data de Nascimento:</strong> {aluno.data_nascimento}</p>
        <p><strong>Nome do Responsável:</strong> {aluno.nome_responsaveis || 'Não informado'}</p>
        <p><strong>Telefone:</strong> {aluno.telefone || 'Não informado'}</p>
        <p><strong>Endereço:</strong> {aluno.endereco || 'Não informado'}</p>
        <p><strong>Observações:</strong> {aluno.observacoes || 'Nenhuma'}</p>
        <p><strong>Status:</strong> {aluno.ativo ? 'Ativo' : 'Inativo'}</p>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunoDetailsModal;