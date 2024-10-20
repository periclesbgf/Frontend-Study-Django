// src/AppRoutes.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterStudent from './components/RegisterStudent';
import RegisterTeacher from './components/RegisterTeacher';
import Login from './components/Login';
import HomeStudent from './components/HomeStudent';
import StudySessions from './components/StudySessions';
import ChatPage from './components/ChatPage'; // Certifique-se de importar o ChatPage
import PrivateRoute from './components/PrivateRoute';
import DisciplineSessions from './components/DisciplineSessions';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import NotFound from './components/NotFound';
import ProfilePage from './components/ProfilePage'; // Importando a página de perfil
import { StudySessionsProvider } from './contexts/StudySessionsContext';

const AppRoutes = () => (
  <Router>
    <StudySessionsProvider>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Home />} />

        {/* Rotas de registro */}
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home do estudante */}
        <Route
          path="/home-student"
          element={
            <PrivateRoute>
              <HomeStudent />
            </PrivateRoute>
          }
        />

        {/* Discipline Sessions: Exibe os cards de disciplinas */}
        <Route
          path="/discipline_sessions"
          element={
            <PrivateRoute>
              <DisciplineSessions />
            </PrivateRoute>
          }
        />

        {/* Study Sessions: Exibe as sessões de estudo de uma disciplina específica */}
        <Route
          path="/study_sessions/:disciplineId"
          element={
            <PrivateRoute>
              <StudySessions />
            </PrivateRoute>
          }
        />

        {/* ChatPage: Exibe o chat de uma sessão de estudo específica */}
        <Route
          path="/study_sessions/:disciplineId/:sessionId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Workspace */}
        <Route
          path="/workspace"
          element={
            <PrivateRoute>
              <Workspace />
            </PrivateRoute>
          }
        />

        {/* Página de Perfil */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </StudySessionsProvider>
  </Router>
);

export default AppRoutes;
