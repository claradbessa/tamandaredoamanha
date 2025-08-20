import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './SinglePostPage.css';

function SinglePostPage() {
  const { id } = useParams(); // Pega o ID da postagem a partir da URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/postagens/${id}`);
        setPost(data);
      } catch (err) {
        setError('Não foi possível carregar a postagem.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p>Carregando postagem...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

 return (
    <div>
      <Header />
      <main className="single-post-container">
        {post ? (
          <article>
            <h1>{post.titulo}</h1>
            <p className="post-meta">
              Publicado por {post.voluntario?.nome || 'ONG'}
            </p>
            
            {post.midia_url && (
              <img className="post-image" src={post.midia_url} alt={post.titulo} />
            )}

            <div className="post-content">
              {post.conteudo.split('\n').map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))}
            </div>

            <Link to="/blog" className="back-to-blog-link">
              ← Voltar para todas as postagens
            </Link>
          </article>
        ) : (
          <p>Postagem não encontrada.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SinglePostPage;