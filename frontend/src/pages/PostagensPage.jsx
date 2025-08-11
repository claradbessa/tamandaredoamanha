import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import PostagemForm from '../components/postagens/PostagemForm';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function PostagensPage() {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostagem, setEditingPostagem] = useState(null);

  const fetchPostagens = async () => {
    try {
      setLoading(true);
      const response = await api.get('/postagens');
      setPostagens(response.data);
    } catch (err) {
      console.error('Erro ao carregar postagens:', err);
      setError('Falha ao carregar as postagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostagens();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleOpenModal = (postagem = null) => {
    clearMessages();
    setEditingPostagem(postagem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPostagem(null);
  };

  const handleSavePostagem = async (formData, postagemId) => {
    clearMessages();

    try {
      if (postagemId) {
        const hasFile = !!formData.get('midia'); 

        if (hasFile) {
          formData.append('_method', 'PUT');
          const res = await api.post(`/postagens/${postagemId}`, formData);
          console.log('Resposta update (POST+_method):', res);
        } else {
          const res = await api.put(`/postagens/${postagemId}`, formData);
          console.log('Resposta update (PUT):', res);
        }

        showSuccess('Postagem atualizada com sucesso!');
      } else {
        const res = await api.post('/postagens', formData);
        console.log('Resposta create:', res);
        showSuccess('Postagem criada com sucesso!');
      }

      handleCloseModal();
      await fetchPostagens();
    } catch (err) {
      console.error('Erro ao salvar postagem:', err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }
  };

  const handleDeletePostagem = async (postagemId) => {
    clearMessages();
    if (!postagemId) {
      setError('ID da postagem inválido para excluir.');
      return;
    }

    if (window.confirm('Tem a certeza que deseja excluir esta postagem?')) {
      try {
        const res = await api.delete(`/postagens/${postagemId}`);
        console.log('Resposta delete:', res);
        showSuccess('Postagem excluída com sucesso!');
        await fetchPostagens();
      } catch (err) {
        console.error('Erro ao excluir postagem:', err);
        const serverMessage = err.response?.data?.message || err.response?.data || err.message;
        setError(typeof serverMessage === 'string' ? serverMessage : 'Falha ao excluir a postagem.');
      }
    }
  };

  if (loading) return <p>A carregar postagens...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestão de Postagens</h2>
        <button onClick={() => handleOpenModal()}>Adicionar Nova Postagem</button>
      </div>

      {successMessage && <div style={{ color: 'green', background: '#e6ffed', padding: '10px', margin: '15px 0' }}>{successMessage}</div>}
      {error && <div style={{ color: 'red', background: '#fde8e8', padding: '10px', margin: '15px 0' }}>{error}</div>}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPostagem ? "Editar Postagem" : "Criar Nova Postagem"}
      >
        <PostagemForm 
          onSave={handleSavePostagem}
          onCancel={handleCloseModal}
          postagemToEdit={editingPostagem}
        />
      </Modal>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{width: '100px'}}>Mídia</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Status</th>
            <th style={{ width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {postagens.length > 0 ? (
            postagens.map(postagem => (
              <tr key={postagem.id}>
                <td>
                  {postagem.midia_url ? (
                    <img src={postagem.midia_url} alt={postagem.titulo} style={{ width: '100px', height: 'auto' }} />
                  ) : 'Sem imagem'}
                </td>
                <td>{postagem.titulo}</td>
                <td>{postagem.voluntario?.nome || 'N/A'}</td>
                <td>{postagem.publicado ? 'Publicado' : 'Rascunho'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleOpenModal(postagem)} title="Editar"><FaEdit /></button>
                  <button onClick={() => handleDeletePostagem(postagem.id)} style={{ marginLeft: '10px' }} title="Excluir"><FaTrashAlt /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                <p>Ainda não há postagens cadastradas.</p>
                <button onClick={() => handleOpenModal()}>
                  Clique aqui para adicionar a primeira postagem
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PostagensPage;
