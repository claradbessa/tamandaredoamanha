import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [aulasPorDia, setAulasPorDia] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await api.get('/aulas');
        const todasAsAulas = response.data.data;
        const aulasAgrupadas = todasAsAulas.reduce((acc, aula) => {
          aula.horarios.forEach(horario => {
            const dia = horario.dia_semana;
            if (!acc[dia]) acc[dia] = [];
            acc[dia].push({ ...aula, horario: horario.horario });
          });
          return acc;
        }, {});
        setAulasPorDia(aulasAgrupadas);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAulas();
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const ordemDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

  return (
    <>
      <div className="main-content-header">
        <h1>Dashboard Administrativo</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
      </div>
      
      <div className="welcome-card">
        {auth.user && (
          <h2 style={{ fontWeight: 'normal', marginBottom: '15px' }}>
            Olá, <strong>{auth.user.nome}</strong>!
          </h2>
        )}
        <p>
          Bem-vindo(a) ao painel de gestão do Projeto Tamandaré do Amanhã.
        </p>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Aulas da Semana</h2>
        
        {loading ? (
          <p>Carregando agenda...</p>
        ) : (
          <div className="schedule-grid">
            {ordemDias.map(dia => (
              aulasPorDia[dia] && (
                <div key={dia} className="day-column">
                  <h3>{dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
                  {aulasPorDia[dia].sort((a,b) => a.horario.localeCompare(b.horario)).map(aula => (
                    <div key={`${aula.id}-${aula.horario}`} className="class-card">
                      <strong>{aula.nome}</strong>
                      <span>{`Às ${aula.horario.substring(0, 5)}`}</span>
                      <span style={{ fontStyle: 'italic' }}>{`Prof. ${aula.voluntario?.nome || 'N/A'}`}</span>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Ações Rápidas</h3>
        <div className="quick-actions">
          <Link to="/admin/alunos" className="btn btn-primary">
            Gerenciar Alunos
          </Link>
          <Link to="/admin/aulas" className="btn btn-primary">
            Gerenciar Aulas
          </Link>
          <Link to="/admin/postagens" className="btn btn-secondary">
            Criar Nova Postagem
          </Link>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;