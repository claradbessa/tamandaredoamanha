import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import AulaForm from '../components/aulas/AulaForm';
import AulaDetailsModal from '../components/aulas/AulaDetailsModal';
import Pagination from '../components/Pagination';
import { FaEye, FaEdit, FaTrashAlt, FaUsers, FaSearch } from 'react-icons/fa';

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
        showSuccess('Aula atualizada com sucesso!');
      } else {
        await api.post('/aulas', aulaData);
        showSuccess('Aula criada com sucesso!');
      }
      handleCloseFormModal();
      fetchAulas(paginationMeta?.current_page || 1);
    } catch (err) {
      setError('Falha ao salvar a aula.');
      console.error(err);
    }
  };

  const handleDeleteAula = async (aulaId) => {
    if (window.confirm('Tem a certeza que deseja excluir esta aula?')) {
      try {
        await api.delete(`/aulas/${aulaId}`);
        showSuccess('Aula excluída com sucesso!');
        fetchAulas(paginationMeta?.current_page || 1);
      } catch (err) {
        setError('Falha ao excluir a aula.');
        console.error(err);
      }
    }
  };

  const filteredAndSortedAulas = aulas
    .filter(aula =>
      aula.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (loading) return <p>A carregar aulas...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestão de Aulas</h2>
        <button onClick={() => handleOpenFormModal()}>Adicionar Nova Aula</button>
      </div>

      {successMessage && <div style={{ color: 'green', background: '#e6ffed', padding: '10px', margin: '15px 0', borderRadius: '5px' }}>{successMessage}</div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ margin: '20px 0', position: 'relative' }}>
        <input
          type="text"
          placeholder="Buscar aula por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', paddingLeft: '40px', boxSizing: 'border-box' }}
        />
        <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
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

      <AulaDetailsModal
        aula={viewingAula}
        onClose={() => setViewingAula(null)}
      />

      {/* Continua a existir, mas não é usado nesta página
      <AlunosMatriculadosModal
        aula={viewingAlunos}
        onClose={() => setViewingAlunos(null)}
      />
      */}

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome da Aula</th>
            <th>Horários</th>
            <th>Voluntário Responsável</th>
            <th style={{ width: '180px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedAulas.length > 0 ? (
            filteredAndSortedAulas.map(aula => (
              <tr key={aula.id}>
                <td>{aula.nome}</td>
                <td>
                  {aula.horarios && aula.horarios.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                      {aula.horarios.map(h => (
                        <li key={h.id}>{`${h.dia_semana} às ${h.horario.substring(0, 5)}`}</li>
                      ))}
                    </ul>
                  ) : 'Nenhum horário definido'}
                </td>
                <td>{aula.voluntario ? aula.voluntario.nome : 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => setViewingAlunos(aula)} title="Ver Alunos Matriculados"><FaUsers /></button>
                  <button onClick={() => setViewingAula(aula)} style={{ marginLeft: '10px' }} title="Ver Detalhes"><FaEye /></button>
                  <button onClick={() => handleOpenFormModal(aula)} style={{ marginLeft: '10px' }} title="Editar"><FaEdit /></button>
                  <button onClick={() => handleDeleteAula(aula.id)} style={{ marginLeft: '10px' }} title="Excluir"><FaTrashAlt /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhuma aula encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination meta={paginationMeta} onPageChange={fetchAulas} />
    </div>
  );
}

export default AulasPage;