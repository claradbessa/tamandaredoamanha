import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function PostagemForm({ onSave, onCancel, postagemToEdit }) {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [midia, setMidia] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth(); 

  useEffect(() => {
    if (postagemToEdit) {
      setTitulo(postagemToEdit.titulo || '');
      setConteudo(postagemToEdit.conteudo || '');
    } else {
      setTitulo('');
      setConteudo('');
    }
  }, [postagemToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    formData.append('voluntario_id', user.id);
    if (midia) {
      formData.append('midia', midia);
    }

    await onSave(formData, postagemToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="conteudo">Conteúdo:</label>
        <textarea
          id="conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
          rows={5}
        />
      </div>

      <div className="form-group">
        <label>Imagem ou Vídeo (opcional):</label>
        <div className="custom-file-upload-wrapper" style={{ marginTop: '5px' }}>
          
          <label htmlFor="midia" className="custom-file-upload-label">
            Escolher arquivo
          </label>

          <input
            type="file"
            id="midia"
            onChange={(e) => setMidia(e.target.files[0])}
            accept="image/*,video/*"
          />

          <span className="file-name-display">
            {midia ? midia.name : 'Nenhum arquivo escolhido'}
          </span>
        </div>

        {postagemToEdit?.midia_url && !midia && (
          <small style={{ display: 'block', marginTop: '5px' }}>
            * Deixe em branco para manter a mídia atual.
          </small>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onCancel} disabled={isSaving} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} className="btn btn-primary">
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default PostagemForm;