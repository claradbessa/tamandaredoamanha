import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Importações do TipTap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar'; 
function PostagemForm({ onSave, onCancel, postagemToEdit }) {
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [StarterKit],
    content: postagemToEdit?.conteudo || '', 
    editorProps: {
      attributes: {
        class: 'tiptap', 
      },
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const editorContent = editor.getHTML(); 

    formData.set('conteudo', editorContent);
    formData.append('voluntario_id', user.id);

    await onSave(formData, postagemToEdit?.id);
  };

  useEffect(() => {
    if (editor && postagemToEdit) {
      editor.commands.setContent(postagemToEdit.conteudo || '');
    }
  }, [postagemToEdit, editor]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          name="titulo" 
          defaultValue={postagemToEdit?.titulo || ''}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Conteúdo:</label>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
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
            name="midia"
            accept="image/*,video/*"
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}

export default PostagemForm;