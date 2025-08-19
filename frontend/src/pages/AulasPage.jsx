import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import AulaForm from '../components/aulas/AulaForm';
import AulaDetailsModal from '../components/aulas/AulaDetailsModal';
import Pagination from '../components/Pagination';
import AlunosMatriculadosModal from '../components/aulas/AlunosMatriculadosModal';
import { FaEye, FaEdit, FaTrashAlt, FaUsers, FaSearch, FaClipboardList } from 'react-icons/fa';

function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [viewingAula, setViewingAula] = useState(null);
  const [viewingAlunos, setViewingAlunos] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAulas = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/aulas?page=${page}`);
      setAulas(response.data.data);
      setPaginationMeta(response.data);
    } catch (err) {
      setError('Falha ao carregar as aulas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleOpenFormModal = (aula = null) => {
    clearMessages();
    setEditingAula(aula);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingAula(null);
  };

  const handleSaveAula = async (aulaData, aulaId) => {
    clearMessages();
    try {
      if (aulaId) {
        await api.put(`/aulas/${aulaId}`, aulaData);
        showSuccess('Aula atualizada com sucesso!');
      } else {
        await api.post('/aulas', aulaData);
        showSuccess('Aula criada com sucesso!');
      }
      handleCloseFormModal();
      fetchAulas(paginationMeta?.current_page || 1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao salvar a aula.';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const detailedError = Object.values(validationErrors).flat().join(' ');
        setError(detailedError);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDeleteAula = async (aulaId) => {
    clearMessages();
    if (window.confirm('Tem a certeza que deseja excluir esta aula?')) {
      try {
        await api.delete(`/aulas/${aulaId}`);
        showSuccess('Aula excluída com sucesso!');
        fetchAulas(paginationMeta?.current_page || 1);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Falha ao excluir a aula.';
        setError(errorMessage);
      }
    }
  };

  const filteredAndSortedAulas = aulas
    .filter(aula =>
      aula.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (loading) return <p>Carregando aulas...</p>;

  return (
      <>
        <div className="main-content-header">
          <h1>Aulas</h1>
          <button onClick={() => handleOpenFormModal()} className="btn btn-primary">Adicionar Nova Aula</button>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <div className="form-group" style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar aula por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
          </div>

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

          <AulaDetailsModal aula={viewingAula} onClose={() => setViewingAula(null)} />
          <AlunosMatriculadosModal aula={viewingAlunos} onClose={() => setViewingAlunos(null)} />

          <table>
            <thead>
              <tr>
                <th>Nome da Aula</th>
                <th className="hide-on-mobile">Horários</th>
                <th className="hide-on-mobile">Voluntário Responsável</th>
                <th style={{ width: '220px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAulas.length > 0 ? (
                filteredAndSortedAulas.map(aula => (
                  <tr key={aula.id}>
                    <td>{aula.nome}</td>
                    <td className="hide-on-mobile">
                      {aula.horarios && aula.horarios.length > 0 ? (
                        <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                          {aula.horarios.map(h => (
                            <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
                          ))}
                        </ul>
                      ) : 'Nenhum horário definido'}
                    </td>
                    <td className="hide-on-mobile">{aula.voluntario ? aula.voluntario.nome : 'N/A'}</td>
                    <td className="actions">
                      <Link to={`/admin/aulas/${aula.id}/frequencia`} title="Registar Frequência">
                        <button><FaClipboardList /></button>
                      </Link>
                      <button onClick={() => setViewingAlunos(aula)} title="Ver Alunos Matriculados"><FaUsers /></button>
                      <button onClick={() => setViewingAula(aula)} title="Ver Detalhes"><FaEye /></button>
                      <button onClick={() => handleOpenFormModal(aula)} title="Editar"><FaEdit /></button>
                      <button onClick={() => handleDeleteAula(aula.id)} title="Excluir"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Ainda não há aulas cadastradas.</p>
                    <button onClick={() => handleOpenFormModal()} className="btn btn-secondary">
                      Clique aqui para adicionar a primeira aula
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination meta={paginationMeta} onPageChange={fetchAulas} />
        </div>
      </>
  );
}

export default AulasPage;