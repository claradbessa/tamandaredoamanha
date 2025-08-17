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
    <>
      <div className="main-content-header">
        <h1>Postagens</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">Adicionar Nova Postagem</button>
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
              postagens.map((postagem, idx) => (
                // MANTENDO A SUA LÓGICA DE KEY, QUE É MAIS SEGURA
                <tr key={postagem.id ?? `post-${idx}`}>
                  <td>
                    {postagem.midia_url ? (
                      <img src={postagem.midia_url} alt={postagem.titulo} style={{ width: '100px', height: 'auto', borderRadius: '6px' }} />
                    ) : 'Sem imagem'}
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
                  {/* MANTENDO SEU BOTÃO ORIGINAL, QUE EU TINHA REMOVIDO POR ENGANO */}
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
