import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import PostagemForm from '../components/postagens/PostagemForm';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import logoPlaceholder from '../../public/logo_tamandare.png'; 

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
      const { data } = await api.get('/postagens');
      setPostagens(data);
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

  const handleOpenModal = (postagem = null) => {
    setError('');
    setSuccessMessage('');
    setEditingPostagem(postagem ? { ...postagem } : null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPostagem(null);
  };

  const handleSavePostagem = async (formData, postagemId) => {
    setError('');
    setSuccessMessage('');

    try {
      const postData = {};
      formData.forEach((value, key) => {
        if (key !== 'midia') {
          postData[key] = value;
        }
      });
      
      const file = formData.get('midia');

      if (file instanceof File && file.name) {
        const CLOUD_NAME = "dbr43jqca";
        const UPLOAD_PRESET = "TDA_gallery_uploads";
        const cloudinaryURL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(cloudinaryURL, {
          method: 'POST',
          body: cloudinaryFormData,
        });

        const cloudinaryData = await response.json();

        if (cloudinaryData.error) {
          throw new Error(`Erro no Cloudinary: ${cloudinaryData.error.message}`);
        }

        postData.midia_url = cloudinaryData.secure_url;
        postData.midia_public_id = cloudinaryData.public_id;
      }

      if (postagemId) {
        const { data: updated } = await api.put(`/postagens/${postagemId}`, postData);
        setPostagens(prev => prev.map(p => (p.id === postagemId ? updated : p)));
        showSuccess('Postagem atualizada com sucesso!');
      } else {
        const { data: created } = await api.post('/postagens', postData);
        setPostagens(prev => [created, ...prev]);
        showSuccess('Postagem criada com sucesso!');
      }

      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar postagem:', err);
      const serverMessage = err.response?.data?.message || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }
  };

  const handleDeletePostagem = async (postagemId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta postagem?')) return;
    setError('');
    setSuccessMessage('');

    try {
      await api.delete(`/postagens/${postagemId}`);
      setPostagens((prev) => prev.filter((p) => p.id !== postagemId));
      showSuccess('Postagem excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir postagem:', err);
      setError(err.response?.data?.message || 'Falha ao excluir a postagem.');
    }
  };

  if (loading) return <p>Carregando postagens...</p>;

  return (
    <>
      <div className="main-content-header">
        <h1>Postagens</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">Adicionar Postagem</button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingPostagem ? 'Editar Postagem' : 'Criar Nova Postagem'}
        >
          <PostagemForm
            onSave={handleSavePostagem}
            onCancel={handleCloseModal}
            postagemToEdit={editingPostagem}
          />
        </Modal>

        <table>
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Mídia</th>
              <th>Título</th>
              <th className="hide-on-mobile">Autor</th>
              <th className="hide-on-mobile">Status</th>
              <th style={{ width: '120px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {postagens.length > 0 ? (
              postagens.map((postagem) => (
                <tr key={postagem.id}>
                  <td>
                    {postagem.midia_url ? (
                      <img 
                        src={postagem.midia_url} 
                        alt={`Mídia da postagem: ${postagem.titulo}`} 
                        style={{ 
                          width: '100px', 
                          height: '80px',
                          borderRadius: '6px', 
                          objectFit: 'cover'
                        }} 
                      />
                    ) : (
                      <img 
                        src={logoPlaceholder} 
                        alt="Logo do Projeto" 
                        style={{ 
                          width: '100px', 
                          height: '80px',
                          borderRadius: '6px', 
                          objectFit: 'contain', 
                          opacity: 0.5         
                        }} 
                      />
                    )}
                  </td>
                  <td>{postagem.titulo}</td>
                  <td className="hide-on-mobile">{postagem.voluntario?.nome || 'N/A'}</td>
                  <td className="hide-on-mobile">{postagem.publicado ? 'Publicado' : 'Rascunho'}</td>
                  <td className="actions">
                    <button onClick={() => handleOpenModal(postagem)} title="Editar"><FaEdit /></button>
                    <button onClick={() => handleDeletePostagem(postagem.id)} title="Excluir"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Ainda não há postagens cadastradas.</p>
                  <button onClick={() => handleOpenModal()} className="btn btn-secondary">
                    Clique aqui para adicionar a primeira postagem
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PostagensPage;