import { useState, useEffect } from 'react';
import api from '../../services/api';
import './GallerySection.css';

function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/galeria');
        // Pega apenas as 6 imagens mais recentes para a página inicial
        setImages(data.slice(0, 6));
      } catch (err) {
        setError('Não foi possível carregar as imagens da galeria.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (error) {
    return <div className="gallery-container"><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div className="gallery-container">
      <h2>Galeria de Fotos</h2>
      <div className="gallery-grid">
        {loading ? (
          <p>Carregando imagens...</p>
        ) : (
          images.map(image => (
            <div key={image.id} className="gallery-item">
              <img src={image.url} alt={image.descricao || 'Foto do projeto'} />
              <p>{image.titulo || 'Atividade da ONG'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GallerySection;