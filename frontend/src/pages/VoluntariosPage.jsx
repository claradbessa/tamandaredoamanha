import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import VoluntarioForm from '../components/voluntarios/VoluntarioForm';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVoluntario, setEditingVoluntario] = useState(null);

  const fetchVoluntarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/voluntarios');
      setVoluntarios(response.data);
    } catch (err) {
      setError('Falha ao carregar os voluntários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoluntarios();
  }, []);

  const handleOpenModal = (voluntario = null) => {
    setEditingVoluntario(voluntario);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingVoluntario(null);
  };

  const handleSaveVoluntario = async (voluntarioData, voluntarioId) => {
    try {
      if (voluntarioId) {
        await api.put(`/voluntarios/${voluntarioId}`, voluntarioData);
      } else {
        await api.post('/voluntarios', voluntarioData);
      }
      handleCloseModal();
      fetchVoluntarios();
    } catch (err) {
      setError('Falha ao salvar o voluntário. Verifique os dados, especialmente se o e-mail já existe.');
      console.error(err);
    }
  };

  const handleDeleteVoluntario = async (voluntarioId) => {
    if (window.confirm('Tem a certeza que deseja excluir este voluntário? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/voluntarios/${voluntarioId}`);
        fetchVoluntarios();
      } catch (err) {
        setError('Falha ao excluir o voluntário.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>A carregar voluntários...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestão de Voluntários</h2>
        <button onClick={() => handleOpenModal()}>Adicionar Novo Voluntário</button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        title={editingVoluntario ? "Editar Voluntário" : "Cadastrar Voluntário"}
      >
        <VoluntarioForm
          onSave={handleSaveVoluntario}
          onCancel={handleCloseModal}
          voluntarioToEdit={editingVoluntario}
        />
      </Modal>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th style={{ width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {voluntarios.length > 0 ? (
            voluntarios.map(voluntario => (
              <tr key={voluntario.id}>
                <td>{voluntario.nome}</td>
                <td>{voluntario.email}</td>
                <td>{voluntario.ativo ? 'Ativo' : 'Inativo'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleOpenModal(voluntario)} title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteVoluntario(voluntario.id)} style={{ marginLeft: '10px' }} title="Excluir">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhum voluntário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VoluntariosPage;