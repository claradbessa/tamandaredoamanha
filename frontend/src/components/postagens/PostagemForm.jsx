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
    
    if (postagemToEdit) {
      formData.append('_method', 'PUT');
    }

    await onSave(formData, postagemToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="conteudo">Conteúdo:</label>
        <textarea
          id="conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
          rows={5}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="midia">Imagem ou Vídeo:</label>
        <input
          type="file"
          id="midia"
          onChange={(e) => setMidia(e.target.files[0])}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
        <button type="submit" disabled={isSaving} style={{ marginLeft: '10px' }}>
          {isSaving ? 'A salvar...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default PostagemForm;