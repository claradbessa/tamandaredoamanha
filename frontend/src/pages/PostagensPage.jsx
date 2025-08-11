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
    // ----> INÍCIO DA DEPURAÇÃO <----
    console.log("A tentar salvar postagem com ID:", postagemId);
    if (!postagemId) {
        console.error("ERRO: ID da postagem é inválido na edição!");
        setError("Não foi possível editar: ID da postagem não encontrado.");
        return;
    }
    // ----> FIM DA DEPURAÇÃO <----
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (postagemId) {
        await api.post(`/postagens/${postagemId}`, formData, config);
        showSuccess('Postagem atualizada com sucesso!');
      } else {
        await api.post('/postagens', formData, config);
        showSuccess('Postagem criada com sucesso!');
      }
      handleCloseModal();
      fetchPostagens();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao salvar a postagem.';
      setError(errorMessage);
    }
  };

  const handleDeletePostagem = async (postagemId) => {
    clearMessages();
    // ----> INÍCIO DA DEPURAÇÃO <----
    console.log("A tentar excluir postagem com ID:", postagemId);
    // ----> FIM DA DEPURAÇÃO <----
    if (window.confirm('Tem a certeza que deseja excluir esta postagem?')) {
      try {
        if (!postagemId) {
            console.error("ERRO: ID da postagem é inválido! Exclusão cancelada.");
            setError("Não foi possível excluir: ID da postagem não encontrado.");
            return;
        }
        await api.delete(`/postagens/${postagemId}`);
        showSuccess('Postagem excluída com sucesso!');
        fetchPostagens();
      } catch (err) {
        setError('Falha ao excluir a postagem.');
      }
    }
  };

  const getMediaUrl = (path) => {
    return `https://render-m7dj.onrender.com/storage/${path}`;
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