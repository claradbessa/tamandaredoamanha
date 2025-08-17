import Modal from '../Modal';

function AulaDetailsModal({ aula, onClose }) {
  if (!aula) {
    return null;
  }

  return (
    <Modal isOpen={!!aula} onClose={onClose} title={`Detalhes da aula de ${aula.nome}`}>
      
      <dl className="student-details-list">
        <dt>Nome da Aula:</dt>
        <dd>{aula.nome}</dd>

        <dt>Descrição:</dt>
        <dd>{aula.descricao || 'Não informado'}</dd>

        <dt>Voluntário:</dt>
        <dd>{aula.voluntario?.nome || 'Não informado'}</dd>

        <dt>Capacidade:</dt>
        <dd>{aula.capacidade || 'Não informado'}</dd>
        
        <dt>Local:</dt>
        <dd>{aula.local_aula || 'Não informado'}</dd>
      </dl>
      
      <hr style={{ margin: '20px 0' }} />

      <h4>Horários:</h4>
      {aula.horarios && aula.horarios.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {aula.horarios.map(h => (
            <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum horário definido para esta aula.</p>
      )}
      
      <div className="modal-footer">
        <button onClick={onClose} className="btn btn-secondary">Fechar</button>
      </div>
    </Modal>
  );
}

export default AulaDetailsModal;