import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import AulaForm from '../components/aulas/AulaForm';
import AulaDetailsModal from '../components/aulas/AulaDetailsModal';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

function AulasPage() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [viewingAula, setViewingAula] = useState(null);

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

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Nome da Aula</th>
            <th>Horários</th>
            <th>Voluntário Responsável</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {aulas.length > 0 ? (
            aulas.map(aula => (
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
                  <button onClick={() => setViewingAula(aula)} title="Ver Detalhes"><FaEye /></button>
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
    </div>
  );
}

export default AulasPage;