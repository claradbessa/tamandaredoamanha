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
      if (document.getElementById('imagens')) {
        document.getElementById('imagens').value = '';
      }
      await fetchImages();
    } catch (err) {
      console.error('Erro ao enviar imagens:', err);
      if (err.response) {
        setError(JSON.stringify(err.response.data, null, 2));
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
      setError(err.response?.data?.message || 'Falha ao excluir a imagem.');
    }
  };

  if (loading) return <p>Carregando galeria...</p>;

  return (
    <>
      <div className="main-content-header">
        <h1>Galeria de imagens</h1>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Adicionar Novas Imagens</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Selecionar Imagens:</label>
            <div className="custom-file-upload-wrapper" style={{ marginTop: '5px' }}>
              
              <label htmlFor="imagens" className="custom-file-upload-label">
                Escolher arquivos
              </label>

              <input
                type="file"
                id="imagens"
                name="imagens"
                multiple
                onChange={handleFileChange}
                accept="image/png,image/jpeg"
              />

              <span className="file-name-display">
                {files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Nenhum arquivo escolhido'}
              </span>

            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isUploading} className="btn btn-primary">
              {isUploading ? 'Enviando...' : 'Enviar Imagens'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Imagens Atuais na Galeria</h3>
        <div className="image-gallery-grid">
          {images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="gallery-item">
                <img
                  src={image.caminho}
                  alt={image.descricao || 'Imagem da galeria'}
                />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="delete-btn"
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
    </>
  );
}

export default GaleriaAdminPage;