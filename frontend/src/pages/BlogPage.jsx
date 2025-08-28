import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './BlogPage.css';
import logoPlaceholder from '../../public/logo_tamandare.png'; 

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/postagens');
        setPosts(data);
      } catch (err) {
        setError('Não foi possível carregar as postagens.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Notícias e Atividades | Projeto Tamandaré do Amanhã</title>
        <meta 
          name="description" 
          content="Acompanhe as últimas notícias e atividades do Projeto Tamandaré do Amanhã. Veja fotos de nossas aulas, eventos e conquistas da comunidade." 
        />
        <meta property="og:title" content="Notícias e Atividades | Projeto Tamandaré do Amanhã" />
        <meta property="og:description" content="Acompanhe as últimas notícias e atividades do Projeto Tamandaré do Amanhã. Veja fotos de nossas aulas, eventos e conquistas da comunidade." />
        <meta property="og:image" content="https://www.tamandaredoamanha.com.br/og-image-tamandare-do-amanha.png" />
        <meta property="og:url" content="https://www.tamandaredoamanha.com.br/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <main className="blog-page-container">
        <h2>Notícias e Atividades</h2>
        <p>Acompanhe os últimos acontecimentos e novidades do nosso projeto.</p>

        {loading && <p>Carregando postagens...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="posts-grid">
          {posts.map(post => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-card">
              {post.midia_url ? (
                <img 
                  src={post.midia_url} 
                  alt={post.titulo} 
                  className="post-card-image"
                />
              ) : (
                <img 
                  src={logoPlaceholder} 
                  alt="Logo do Projeto Tamandaré do Amanhã" 
                  className="post-card-image-placeholder" 
                />
              )}
              <div className="post-card-content">
                <h3>{post.titulo}</h3>
                
                <div>
                  <p>Por {post.voluntario?.nome || 'ONG'}</p>
                  <span className="read-more-link">Ler mais →</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPage;