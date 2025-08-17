import Modal from '../Modal';

function AlunosMatriculadosModal({ aula, onClose }) {
  if (!aula) {
    return null;
  }

  return (
    <Modal isOpen={!!aula} onClose={onClose} title={`Alunos matriculados em ${aula.nome}`}>
      <div>
        {aula.alunos && aula.alunos.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {aula.alunos.map(aluno => (
              <li key={aluno.id} style={{ padding: '5px 0' }}>{aluno.nome}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum aluno matriculado nesta aula.</p>
        )}
      </div>

      <div className="modal-footer">
        <button onClick={onClose} className="btn btn-secondary">Fechar</button>
      </div>
    </Modal>
  );
}

export default AlunosMatriculadosModal;