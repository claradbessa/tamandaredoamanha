import Modal from '../Modal';

function AulaDetailsModal({ aula, onClose }) {
  if (!aula) {
    return null;
  }

  return (
    <Modal isOpen={!!aula} onClose={onClose} title={`Detalhes de ${aula.nome}`}>
      <div>
        <p><strong>Nome da Aula:</strong> {aula.nome}</p>
        <p><strong>Descrição:</strong> {aula.descricao || 'Não informado'}</p>
        <p><strong>Voluntário:</strong> {aula.voluntario?.nome || 'Não informado'}</p>
        <p><strong>Capacidade:</strong> {aula.capacidade || 'Não informado'}</p>
        <p><strong>Local:</strong> {aula.local_aula || 'Não informado'}</p>
        
        <hr style={{ margin: '20px 0' }} />

        <h4>Horários:</h4>
        {aula.horarios && aula.horarios.length > 0 ? (
          <ul>
            {aula.horarios.map(h => (
              <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum horário definido para esta aula.</p>
        )}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  );
}

export default AulaDetailsModal;