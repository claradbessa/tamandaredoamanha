import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import HomePage from './pages/HomePage';
import GaleriaPage from './pages/GaleriaPage';
import BlogPage from './pages/BlogPage';
import SinglePostPage from './pages/SinglePostPage';
import ContatoPage from './pages/ContatoPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage.jsx';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}> 
          <Route path="/" element={<HomePage />} />
          <Route path="/galeria" element={<GaleriaPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/post/:id" element={<SinglePostPage />} />
          <Route path="/contato" element={<ContatoPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

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

        <Route path="*" element={<NotFoundPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;