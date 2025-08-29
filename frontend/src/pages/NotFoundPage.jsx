import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaQuestionCircle } from 'react-icons/fa'; 
import './NotFoundPage.css'; 

function NotFoundPage() {
  return (
    <div>
      <Header />
      <main className="not-found-container">
        <div className="not-found-icon">
          <FaQuestionCircle />
        </div>
        <h1>404 - Página Não Encontrada</h1>
        <p>
          Oops! Parece que o caminho que você tentou acessar não existe.
        </p>
        <Link to="/" className="cta-button">
          Voltar para a Página Inicial
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;