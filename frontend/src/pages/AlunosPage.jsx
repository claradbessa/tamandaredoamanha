import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import AlunoForm from '../components/alunos/AlunoForm';
import AlunoDetailsModal from '../components/alunos/AlunoDetailsModal';
import Pagination from '../components/Pagination';
import { formatPhoneBR } from '../utils/formatters';
import { FaEye, FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';

function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState(null);
  const [viewingAluno, setViewingAluno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlunos = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/alunos?page=${page}`);
      setAlunos(response.data.data);
      setPaginationMeta(response.data);
    } catch (err) {
      setError('Falha ao carregar os alunos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleOpenFormModal = (aluno = null) => {
    clearMessages();
    setEditingAluno(aluno);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingAluno(null);
  };

  const handleSaveAluno = async (alunoData, alunoId) => {
    clearMessages();
    try {
      if (alunoId) {
        await api.put(`/alunos/${alunoId}`, alunoData);
        showSuccess('Aluno atualizado com sucesso!');
      } else {
        await api.post('/alunos', alunoData);
        showSuccess('Aluno criado com sucesso!');
      }
      handleCloseFormModal();
      fetchAlunos(paginationMeta?.current_page || 1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao salvar o aluno.';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const detailedError = Object.values(validationErrors).flat().join(' ');
        setError(detailedError);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDeleteAluno = async (alunoId) => {
    clearMessages();
    if (window.confirm('Tem a certeza que deseja excluir este aluno?')) {
      try {
        await api.delete(`/alunos/${alunoId}`);
        showSuccess('Aluno excluído com sucesso!');
        fetchAlunos(paginationMeta?.current_page || 1);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Falha ao excluir o aluno.';
        setError(errorMessage);
      }
    }
  };

  const filteredAndSortedAlunos = alunos
    .filter(aluno => 
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (loading) return <p>A carregar alunos...</p>;
  
  return (
    <>
      <div className="main-content-header">
        <h1>Alunos</h1>
        <button onClick={() => handleOpenFormModal()} className="btn btn-primary">Adicionar Novo Aluno</button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="form-group" style={{ marginBottom: '20px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
        </div>

        <Modal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          title={editingAluno ? "Editar Aluno" : "Cadastrar Aluno"}
        >
          <AlunoForm
            onSave={handleSaveAluno}
            onCancel={handleCloseFormModal}
            alunoToEdit={editingAluno}
          />
        </Modal>

        <AlunoDetailsModal
          aluno={viewingAluno}
          onClose={() => setViewingAluno(null)}
          onUpdate={() => {
            setViewingAluno(null);
            fetchAlunos(paginationMeta?.current_page || 1);
          }}
        />

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th className="hide-on-mobile">Nome do Responsável</th>
              <th className="hide-on-mobile">Telefone</th>
              <th style={{ width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedAlunos.length > 0 ? (
              filteredAndSortedAlunos.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td className="hide-on-mobile">{aluno.nome_responsaveis}</td>
                  <td className="hide-on-mobile">{formatPhoneBR(aluno.telefone)}</td>
                  <td className="actions">
                    <button onClick={() => setViewingAluno(aluno)} title="Ver Detalhes"><FaEye /></button>
                    <button onClick={() => handleOpenFormModal(aluno)} title="Editar"><FaEdit /></button>
                    <button onClick={() => handleDeleteAluno(aluno.id)} title="Excluir"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Ainda não há alunos cadastrados.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <Pagination meta={paginationMeta} onPageChange={fetchAlunos} />
      </div>
    </>
  );
}

export default AlunosPage;