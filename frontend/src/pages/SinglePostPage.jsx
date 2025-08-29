import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './SinglePostPage.css';

function SinglePostPage() {
  const { id } = useParams(); 
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
  if (!post) return <p>Postagem não encontrada.</p>;

  const plainTextContent = post.conteudo.replace(/<[^>]*>?/gm, '');

  return (
    <div>
      <Helmet>
        <title>{`${post.titulo} | Projeto Tamandaré do Amanhã`}</title>
        <meta name="description" content={`${plainTextContent.substring(0, 155)}...`} />
        <meta property="og:title" content={`${post.titulo} | Projeto Tamandaré do Amanhã`} />
        <meta property="og:description" content={`${plainTextContent.substring(0, 155)}...`} />
        <meta property="og:image" content={post.midia_url || "https://www.tamandaredoamanha.com.br/og-image-tamandare-do-amanha.png"} />
        <meta property="og:url" content={`https://www.tamandaredoamanha.com.br/post/${post.id}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <main className="single-post-container">
        <article>
          <h1>{post.titulo}</h1>
          <p className="post-meta">
            Publicado por {post.voluntario?.nome || 'ONG'}
          </p>
          
          {post.midia_url && (
            <img className="post-image" src={post.midia_url} alt={post.titulo} />
          )}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.conteudo }} />

          <Link to="/blog" className="back-to-blog-link">
            ← Voltar para todas as postagens
          </Link>
        </article>
      </main>
    </div>
  );
}

export default SinglePostPage;