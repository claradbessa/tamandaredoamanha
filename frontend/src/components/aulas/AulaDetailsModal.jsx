import Modal from '../Modal';

function AulaDetailsModal({ aula, onClose }) {
  if (!aula) {
    return null;
  }

  return (
    <Modal isOpen={!!aula} onClose={onClose} title={`Detalhes de ${aula.nome}`}>
      <div>
        {/* <p><strong>ID:</strong> {aula.id}</p> */}
        <p><strong>Nome da Aula:</strong> {aula.nome}</p>
        <p><strong>Descrição:</strong> {aula.descricao || 'Não informado'}</p>
        <p><strong>Dia da Semana:</strong> {aula.dia_semana || 'Não informado'}</p>
        <p><strong>Horário:</strong> {aula.horario ? aula.horario.substring(0, 5) : 'Não informado'}</p>
        <p><strong>Voluntário:</strong> {aula.voluntario?.nome || 'Não informado'}</p>
        <p><strong>Capacidade:</strong> {aula.capacidade || 'Não informado'}</p>
        <p><strong>Local:</strong> {aula.local_aula || 'Não informado'}</p>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AulaDetailsModal;