import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTrashAlt } from 'react-icons/fa';

function GaleriaAdminPage() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/galeria');
      setImages(data);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar as imagens da galeria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files || files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('imagens[]', files[i]);
    }

    try {
      await api.post('/galeria', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Imagens enviadas com sucesso!');
      setFiles([]);
      event.target.reset();
      fetchImages();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar as imagens.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        await api.delete(`/galeria/${imageId}`);
        setSuccessMessage('Imagem excluída com sucesso!');
        fetchImages();
      } catch (err) {
        console.error(err);
        setError('Falha ao excluir a imagem.');
      }
    }
  };

  if (loading) return <p>Carregando galeria...</p>;

  return (
    <div>
      <h2>Gestão da Galeria da Página Inicial</h2>

      {successMessage && (
        <div style={{ color: 'green', background: '#e6ffed', padding: '10px', margin: '15px 0' }}>
          {successMessage}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', background: '#fde8e8', padding: '10px', margin: '15px 0' }}>
          {error}
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h4>Adicionar Novas Imagens</h4>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="imagens">Selecionar Imagens:</label>
            <input
              type="file"
              id="imagens"
              name="imagens"
              multiple
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              style={{ display: 'block', margin: '10px 0' }}
            />
          </div>
          <button type="submit" disabled={isUploading}>
            {isUploading ? 'Enviando...' : 'Enviar Imagens'}
          </button>
        </form>
      </div>

      <hr style={{ margin: '30px 0' }} />

      <h4>Imagens Atuais na Galeria</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              style={{ position: 'relative', border: '1px solid #ddd', padding: '5px' }}
            >
              <img
                src={image.url}
                alt={image.titulo || 'Imagem da galeria'}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <button
                onClick={() => handleDelete(image.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  borderRadius: '50%',
                  border: 'none',
                  padding: '5px',
                  cursor: 'pointer',
                }}
                title="Excluir Imagem"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))
        ) : (
          <p>Nenhuma imagem na galeria. Envie a primeira!</p>
        )}
      </div>
    </div>
  );
}

export default GaleriaAdminPage;
