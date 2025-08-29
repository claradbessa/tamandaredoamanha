import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaWhatsapp, FaCopy, FaInstagram } from 'react-icons/fa';
import './ContatoPage.css';

function ContatoPage() {
  const whatsappNumber = '5512996051909';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  
  // --- INFORMAÇÕES DO PIX ATUALIZADAS ---
  const pixKey = '12996051909';
  const titular = 'Fabiana R. de A. Silva'; 
  const instituicao = 'BCO SANTANDER (BRASIL) S.A.';
  
  const [copyButtonText, setCopyButtonText] = useState('Copiar Chave PIX');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar Chave PIX'), 2000);
    });
  };

  return (
    <div>
      <Helmet>
        <title>Contato e Doações | Projeto Tamandaré do Amanhã</title>
        <meta 
          name="description" 
          content="Entre em contato com o Projeto Tamandaré do Amanhã. Encontre nosso endereço, telefone ou doe via PIX para apoiar nossa causa em Guaratinguetá-SP."
        />

        <meta property="og:title" content="Contato e Doações | Projeto Tamandaré do Amanhã" />
          
        <meta property="og:description" content="Entre em contato com o Projeto Tamandaré do Amanhã. Encontre nosso endereço, telefone ou doe via PIX para apoiar nossa causa em Guaratinguetá-SP." />
          
        <meta property="og:image" content="https://www.tamandaredoamanha.com.br/og-image-tamandare-do-amanha.png" />
          
        <meta property="og:url" content="https://www.tamandaredoamanha.com.br/contato" />
          
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="contato-container">
        <div className="contato-header">
          <h1>Entre em Contato</h1>
          <p>
            Sua participação é muito importante para nós. Veja abaixo as melhores formas de doar ou de entrar em contato.
          </p>
        </div>

        <div className="contato-cards-container">
          {/* --- CARD DE DOAÇÕES ATUALIZADO --- */}
          <div className="contact-card donation-card">
            <h3>Apoie Nossa Causa</h3>
            <p>Sua doação nos ajuda a continuar nosso trabalho. A forma mais fácil de doar é via PIX.</p>
            
            <div className="pix-details">
              <div className="pix-detail-item">
                <span>Titular da Conta:</span>
                <strong>{titular}</strong>
              </div>
              <div className="pix-detail-item">
                <span>Instituição:</span>
                <strong>{instituicao}</strong>
              </div>
              <div className="pix-detail-item">
                <span>Telefone:</span>
                <strong>{pixKey}</strong>
              </div>
            </div>

            <button onClick={handleCopyPix} className="copy-pix-button-full">
              <FaCopy /> {copyButtonText}
            </button>

            <p className="pix-confirmation-note">
              Ao transferir, por favor, confirme o nome do destinatário antes de finalizar. Agradecemos imensamente sua contribuição!
            </p>
          </div>

          {/* --- CARD DE OUTRAS FORMAS DE CONTATO --- */}
          <div className="contact-card">
            <h3>Outras Formas de Contato</h3>
            <p>Para dúvidas, voluntariado ou sugestões, fale conosco por um dos canais abaixo.</p>
            <div className="contact-buttons">
              <a 
                href={whatsappLink} 
                className="whatsapp-button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={22} />
                <span>Conversar no WhatsApp</span>
              </a>
              <a 
                href="https://www.instagram.com/tmdoamanha/" 
                className="instagram-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaInstagram size={22} />
                <span>Siga-nos no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContatoPage;