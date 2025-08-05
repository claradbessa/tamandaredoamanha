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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestão de Alunos</h2>
        <button onClick={() => handleOpenFormModal()}>Adicionar Novo Aluno</button>
      </div>

      {successMessage && <div style={{ color: 'green', background: '#e6ffed', padding: '10px', margin: '15px 0', borderRadius: '5px' }}>{successMessage}</div>}
      {/* O componente de erro agora pode mostrar mensagens mais detalhadas */}
      {error && <div style={{ color: 'red', background: '#fde8e8', padding: '10px', margin: '15px 0', borderRadius: '5px' }}>{error}</div>}
      
      <div style={{ margin: '20px 0', position: 'relative' }}>
        <input
          type="text"
          placeholder="Buscar aluno por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', paddingLeft: '40px', boxSizing: 'border-box' }}
        />
        <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
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

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nome do Responsável</th>
            <th>Telefone</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedAlunos.length > 0 ? (
            filteredAndSortedAlunos.map(aluno => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.nome_responsaveis}</td>
                <td>{formatPhoneBR(aluno.telefone)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => setViewingAluno(aluno)} title="Ver Detalhes"><FaEye /></button>
                  <button onClick={() => handleOpenFormModal(aluno)} style={{ marginLeft: '10px' }} title="Editar"><FaEdit /></button>
                  <button onClick={() => handleDeleteAluno(aluno.id)} style={{ marginLeft: '10px' }} title="Excluir"><FaTrashAlt /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
              <p>Ainda não há alunos cadastrados.</p>
              <button onClick={() => handleOpenFormModal()}>
                Clique aqui para adicionar o primeiro aluno
              </button>
            </td>
          </tr>
          )}
        </tbody>
      </table>

      <Pagination meta={paginationMeta} onPageChange={fetchAlunos} />
    </div>
  );
}

export default AlunosPage;