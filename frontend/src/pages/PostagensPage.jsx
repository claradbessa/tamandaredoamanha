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

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleOpenModal = (postagem = null) => {
    clearMessages();

    setEditingPostagem(postagem ? { ...postagem } : null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPostagem(null);
  };

  const formDataToObject = (formData) => {
    const obj = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) continue;
      obj[key] = value;
    }
    return obj;
  };

  // - Ao editar: se não houver ficheiro, enviamos PUT com JSON contendo TODOS os campos importantes
  //   preenchendo a partir do objeto existente para não sobrescrever com null.
  // - Se houver ficheiro, enviamos POST + _method=PUT com multipart/form-data, e depois fazemos GET do recurso
  //   para garantir que temos o objeto completo do backend.
  const handleSavePostagem = async (formData, postagemId) => {
    clearMessages();

    try {
      if (postagemId) {
        // === EDIT ===
        const fileEntry = formData.get('midia');
        const hasFile = fileEntry instanceof File && fileEntry.name;

        if (hasFile) {
          // upload 
          formData.append('_method', 'PUT');
          console.log('[PostagensPage] Enviando edição (POST + _method=PUT) para', `/postagens/${postagemId}`);
          await api.post(`/postagens/${postagemId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // Busca versão completa do backend e mesclar no estado
          const { data: updated } = await api.get(`/postagens/${postagemId}`);
          setPostagens((prev) => prev.map((p) => (p.id === postagemId ? { ...p, ...updated } : p)));
        } else {
          // Sem arquivo: construir payload JSON com todos os campos importantes,
          // preenchendo campos faltantes com os valores atuais do item para evitar sobrescrever com null.
          const payloadPartial = formDataToObject(formData);
          const current = postagens.find((p) => p.id === postagemId) || {};
          const payload = {
            titulo: payloadPartial.titulo ?? current.titulo ?? '',
            conteudo: payloadPartial.conteudo ?? current.conteudo ?? '',
            voluntario_id: payloadPartial.voluntario_id ?? current.voluntario_id ?? current.voluntario?.id ?? null,
            publicado: typeof payloadPartial.publicado !== 'undefined' ? payloadPartial.publicado : current.publicado ?? false,
            categoria: payloadPartial.categoria ?? current.categoria ?? null,
          };

          console.log('[PostagensPage] Enviando edição (PUT JSON) payload:', payload);
          const { data: updated } = await api.put(`/postagens/${postagemId}`, payload);

          // O backend pode devolver o objeto atualizado; se não, pedimos o recurso
          if (updated && updated.id) {
            setPostagens((prev) => prev.map((p) => (p.id === postagemId ? { ...p, ...updated } : p)));
          } else {
            const { data: fetched } = await api.get(`/postagens/${postagemId}`);
            setPostagens((prev) => prev.map((p) => (p.id === postagemId ? { ...p, ...fetched } : p)));
          }
        }

        showSuccess('Postagem atualizada com sucesso!');
      } else {
        // === CREATE ===
        console.log('[PostagensPage] Criando postagem com form-data');
        const { data: created } = await api.post('/postagens', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Insere no topo da lista
        setPostagens((prev) => [created, ...prev]);
        showSuccess('Postagem criada com sucesso!');
      }

      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar postagem:', err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }
  };

  // Excluir postagem
  const handleDeletePostagem = async (postagemId) => {
    clearMessages();
    if (!postagemId) {
      setError('ID da postagem inválido para excluir.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir esta postagem?')) return;

    try {
      const res = await api.delete(`/postagens/${postagemId}`);
      console.log('Resposta delete:', res);

      // Remove localmente
      setPostagens((prev) => prev.filter((p) => p.id !== postagemId));
      showSuccess('Postagem excluída com sucesso!');

      // Verificação extra: busca a lista do backend para confirmar (se algo voltar, mostra warning)
      const { data: fresh } = await api.get('/postagens');
      setPostagens(fresh);

      // Se a postagem ainda existir no server, avisa e escreve no console para debug
      const stillExists = fresh.some((p) => p.id === postagemId);
      if (stillExists) {
        console.warn(`[PostagensPage] Atenção: após delete, postagem ${postagemId} ainda existe no backend.`);
        setError('A exclusão no servidor não foi persistida. Verifique os logs do backend.');
      }
    } catch (err) {
      console.error('Erro ao excluir postagem:', err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : 'Falha ao excluir a postagem.');
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
        title={editingPostagem ? 'Editar Postagem' : 'Criar Nova Postagem'}
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
            <th style={{ width: '100px' }}>Mídia</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Status</th>
            <th style={{ width: '120px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {postagens.length > 0 ? (
            postagens.map((postagem, idx) => (
              // fallback key seguro (id preferencial; se faltar, usa índice)
              <tr key={postagem.id ?? `post-${idx}`}>
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
