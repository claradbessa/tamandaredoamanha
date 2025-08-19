import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import VoluntarioForm from '../components/voluntarios/VoluntarioForm';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleOpenModal = (voluntario = null) => {
    clearMessages();
    setEditingVoluntario(voluntario);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingVoluntario(null);
  };

  const handleSaveVoluntario = async (voluntarioData, voluntarioId) => {
    clearMessages();
    try {
      if (voluntarioId) {
        await api.put(`/voluntarios/${voluntarioId}`, voluntarioData);
        showSuccess('Voluntário atualizado com sucesso!');
      } else {
        await api.post('/voluntarios', voluntarioData);
        showSuccess('Voluntário criado com sucesso!');
      }
      handleCloseModal();
      fetchVoluntarios();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao salvar o voluntário.';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const detailedError = Object.values(validationErrors).flat().join(' ');
        setError(detailedError);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDeleteVoluntario = async (voluntarioId) => {
    clearMessages();
    if (window.confirm('Tem a certeza que deseja excluir este voluntário? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/voluntarios/${voluntarioId}`);
        showSuccess('Voluntário excluído com sucesso!');
        fetchVoluntarios();
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Falha ao excluir o voluntário.';
        setError(errorMessage);
      }
    }
  };

  if (loading) return <p>Carregando voluntários...</p>;

  
  return (
    <>
      <div className="main-content-header">
        <h1>Voluntários</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">Adicionar Novo Voluntário</button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
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

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th className="hide-on-mobile">Email</th>
              <th className="hide-on-mobile">Cargo</th>
              <th>Status</th>
              <th style={{ width: '120px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {voluntarios.length > 0 ? (
              voluntarios.map(voluntario => (
                <tr key={voluntario.id}>
                  <td>{voluntario.nome}</td>
                  <td className="hide-on-mobile">{voluntario.email}</td>
                  <td className="hide-on-mobile">{voluntario.cargo}</td>
                  <td>{voluntario.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td className="actions">
                    <button onClick={() => handleOpenModal(voluntario)} title="Editar">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteVoluntario(voluntario.id)} title="Excluir">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Ainda não há voluntários cadastrados.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default VoluntariosPage;