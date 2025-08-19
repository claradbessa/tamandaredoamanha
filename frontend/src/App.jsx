import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AlunosPage from './pages/AlunosPage';
import AulasPage from './pages/AulasPage';
import VoluntariosPage from './pages/VoluntariosPage';
import PostagensPage from './pages/PostagensPage';
import FrequenciaPage from './pages/FrequenciaPage'; 
import RelatorioFrequenciaPage from './pages/RelatorioFrequenciaPage';
import GaleriaAdminPage from './pages/GaleriaAdminPage';
import GaleriaPage from './pages/GaleriaPage';
import BlogPage from './pages/BlogPage';
// import SinglePostPage from './pages/SinglePostPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/blog" element={<BlogPage />} /> 
        {/* <Route path="/post/:id" element={<SinglePostPage />} /> */}

        {/* Rotas Protegidas com o Layout de Admin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/alunos" element={<AlunosPage />} />
            <Route path="/admin/aulas" element={<AulasPage />} />
            <Route path="/admin/aulas/:id/frequencia" element={<FrequenciaPage />} />
            <Route path="/admin/frequencia" element={<RelatorioFrequenciaPage />} />
            <Route path="/admin/voluntarios" element={<VoluntariosPage />} />
            <Route path="/admin/postagens" element={<PostagensPage />} />
            <Route path="/admin/galeria" element={<GaleriaAdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;