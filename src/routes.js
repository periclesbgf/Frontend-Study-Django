import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterStudent from './components/RegisterStudent';
import RegisterTeacher from './components/RegisterTeacher';
import Login from './components/Login';
import HomeStudent from './components/HomeStudent';
import StudySessions from './components/StudySessions';
import StudySession from './components/StudySession';
import Workspace from './components/Workspace';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import DisciplineSessions from './components/DisciplineSessions'; // Importando a página de Discipline Sessions

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<Home />} />

      {/* Rotas de registro */}
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/register-teacher" element={<RegisterTeacher />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Home do estudante */}
      <Route path="/home-student" element={<PrivateRoute><HomeStudent /></PrivateRoute>} />

      {/* Discipline Sessions: Exibe os cards de disciplinas */}
      <Route path="/discipline_sessions" element={<PrivateRoute><DisciplineSessions /></PrivateRoute>} />

      {/* Study Sessions: Exibe as sessões de estudo de uma disciplina específica */}
      <Route path="/study_sessions/:disciplineId" element={<PrivateRoute><StudySessions /></PrivateRoute>} />

      {/* Study Session: Exibe uma sessão de estudo específica dentro de uma disciplina */}
      <Route path="/study_sessions/:disciplineId/:sessionId" element={<PrivateRoute><StudySession /></PrivateRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Workspace */}
      <Route path="/workspace" element={<PrivateRoute><Workspace /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default AppRoutes;
