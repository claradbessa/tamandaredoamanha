import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import AulaForm from '../components/aulas/AulaForm';
import AulaDetailsModal from '../components/aulas/AulaDetailsModal';
import AlunosMatriculadosModal from '../components/aulas/AlunosMatriculadosModal'; // Importe o novo componente
import { FaEye, FaEdit, FaTrashAlt, FaUsers } from 'react-icons/fa'; // Importe o ícone FaUsers

function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [viewingAula, setViewingAula] = useState(null);
  const [viewingAlunos, setViewingAlunos] = useState(null); // Novo estado para o modal de alunos

  const fetchAulas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/aulas');
      setAulas(response.data);
    } catch (err) {
      setError('Falha ao carregar as aulas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const handleOpenFormModal = (aula = null) => {
    setEditingAula(aula);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingAula(null);
  };

  const handleSaveAula = async (aulaData, aulaId) => {
    try {
      if (aulaId) {
        await api.put(`/aulas/${aulaId}`, aulaData);
      } else {
        await api.post('/aulas', aulaData);
      }
      handleCloseFormModal();
      fetchAulas();
    } catch (err) {
      setError('Falha ao salvar a aula.');
      console.error(err);
    }
  };

  const handleDeleteAula = async (aulaId) => {
    if (window.confirm('Tem a certeza que deseja excluir esta aula?')) {
      try {
        await api.delete(`/aulas/${aulaId}`);
        fetchAulas();
      } catch (err) {
        setError('Falha ao excluir a aula.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>A carregar aulas...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestão de Aulas</h2>
        <button onClick={() => handleOpenFormModal()}>Adicionar Nova Aula</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingAula ? "Editar Aula" : "Cadastrar Aula"}
      >
        <AulaForm
          onSave={handleSaveAula}
          onCancel={handleCloseFormModal}
          aulaToEdit={editingAula}
        />
      </Modal>

      <AulaDetailsModal
        aula={viewingAula}
        onClose={() => setViewingAula(null)}
      />

      {/* Novo Modal para listar alunos */}
      <AlunosMatriculadosModal
        aula={viewingAlunos}
        onClose={() => setViewingAlunos(null)}
      />

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Nome da Aula</th>
            <th>Dia da Semana</th>
            <th>Horário</th>
            <th>Voluntário Responsável</th>
            <th style={{ width: '180px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aulas.length > 0 ? (
            aulas.map(aula => (
              <tr key={aula.id}>
                <td>{aula.nome}</td>
                <td>{aula.dia_semana}</td>
                <td>{aula.horario ? aula.horario.substring(0, 5) : ''}</td>
                <td>{aula.voluntario ? aula.voluntario.nome : 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  {/* Novo botão para ver alunos */}
                  <button onClick={() => setViewingAlunos(aula)} title="Ver Alunos Matriculados">
                    <FaUsers />
                  </button>
                  <button onClick={() => setViewingAula(aula)} style={{ marginLeft: '10px' }} title="Ver Detalhes">
                    <FaEye />
                  </button>
                  <button onClick={() => handleOpenFormModal(aula)} style={{ marginLeft: '10px' }} title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteAula(aula.id)} style={{ marginLeft: '10px' }} title="Excluir">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhuma aula encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AulasPage;