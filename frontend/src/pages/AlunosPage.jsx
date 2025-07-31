import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import AlunoForm from '../components/alunos/AlunoForm';
import AlunoDetailsModal from '../components/alunos/AlunoDetailsModal';
import { formatPhoneBR } from '../utils/formatters';
import { FaEye, FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';

function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState(null);
  const [viewingAluno, setViewingAluno] = useState(null);

  // 1. Novo estado para guardar o termo da busca
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch (err) {
      setError('Falha ao carregar os alunos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleOpenFormModal = (aluno = null) => {
    setEditingAluno(aluno);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingAluno(null);
  };

  const handleSaveAluno = async (alunoData, alunoId) => {
    try {
      if (alunoId) {
        await api.put(`/alunos/${alunoId}`, alunoData);
      } else {
        await api.post('/alunos', alunoData);
      }
      handleCloseFormModal();
      fetchAlunos();
    } catch (err) {
      setError('Falha ao salvar o aluno.');
      console.error(err);
    }
  };

  const handleDeleteAluno = async (alunoId) => {
    if (window.confirm('Tem a certeza que deseja excluir este aluno?')) {
      try {
        await api.delete(`/alunos/${alunoId}`);
        fetchAlunos();
      } catch (err) {
        setError('Falha ao excluir o aluno.');
        console.error(err);
      }
    }
  };

  // 2. Lógica para filtrar e ordenar os alunos antes de exibir
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
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 3. Adiciona o campo de busca */}
      <div style={{ margin: '20px 0', position: 'relative' }}>
        <input
          type="text"
          placeholder="Buscar aluno por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            paddingLeft: '40px',
            boxSizing: 'border-box' 
          }}
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
          {/* 4. Usa a nova lista filtrada e ordenada para renderizar a tabela */}
          {filteredAndSortedAlunos.length > 0 ? (
            filteredAndSortedAlunos.map(aluno => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.nome_responsaveis}</td>
                <td>{formatPhoneBR(aluno.telefone)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => setViewingAluno(aluno)} title="Ver Detalhes">
                    <FaEye />
                  </button>
                  <button onClick={() => handleOpenFormModal(aluno)} style={{ marginLeft: '10px' }} title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteAluno(aluno.id)} style={{ marginLeft: '10px' }} title="Excluir">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhum aluno encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlunosPage;