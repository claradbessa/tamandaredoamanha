import Modal from '../Modal';

function AlunosMatriculadosModal({ aula, onClose }) {
  if (!aula) {
    return null;
  }

  return (
    <Modal isOpen={!!aula} onClose={onClose} title={`Alunos em ${aula.nome}`}>
      <div>
        {aula.alunos && aula.alunos.length > 0 ? (
          <ul>
            {aula.alunos.map(aluno => (
              <li key={aluno.id}>{aluno.nome}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum aluno matriculado nesta aula.</p>
        )}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunosMatriculadosModal;