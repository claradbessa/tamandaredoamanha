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

  const safeSetImages = (data) => {
    if (Array.isArray(data)) setImages(data);
    else setImages([]);
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/galeria');
      safeSetImages(data);
    } catch (err) {
      console.error('Erro ao carregar a galeria:', err);
      setError(err.response?.data?.message || 'Falha ao carregar as imagens da galeria.');
      safeSetImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files || []));
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
    files.forEach((file) => formData.append('imagens[]', file));

    try {
      await api.post('/galeria', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Imagens enviadas com sucesso!');
      setFiles([]);
      event.target.reset();
      await fetchImages();
    } catch (err) {
      console.error('Erro ao enviar imagens:', err);

      if (err.response) {
        console.log('Resposta do backend:', err.response.data);
        setError(JSON.stringify(err.response.data, null, 2)); // JSON formatado
      } else {
        setError(err.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      await api.delete(`/galeria/${imageId}`);
      setSuccessMessage('Imagem excluída com sucesso!');
      await fetchImages();
    } catch (err) {
      console.error('Erro ao excluir imagem:', err);
      setError(err.response?.data?.message || 'Falha ao excluir a imagem.');
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
        <pre style={{ color: 'red', background: '#fde8e8', padding: '10px', margin: '15px 0', whiteSpace: 'pre-wrap' }}>
          {error}
        </pre>
      )}

      <div className="action-icons" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
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
              accept="image/png,image/jpeg"
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
                alt={image.descricao || 'Imagem da galeria'}
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
