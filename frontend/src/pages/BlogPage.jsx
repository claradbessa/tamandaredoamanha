import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './BlogPage.css';

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
      <Header />
      <main className="blog-page-container">
        <h2>Notícias e Atividades</h2>
        <p>Acompanhe os últimos acontecimentos e novidades do nosso projeto.</p>

        {loading && <p>A carregar postagens...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="posts-grid">
          {posts.map(post => (
            // Cada card é um link para a página individual do post
            <Link to={`/post/${post.id}`} key={post.id} className="post-card">
              <img src={post.midia_url} alt={post.titulo} />
              <div className="post-card-content">
                <h3>{post.titulo}</h3>
                <p>Por {post.voluntario?.nome || 'ONG'}</p>
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