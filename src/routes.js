// src/routes.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterStudent from './components/RegisterStudent';
import Login from './components/Login';
import HomeStudent from './components/HomeStudent';
import StudySessions from './components/StudySessions';
import StudySession from './components/StudySession';  // Certifique-se de importar o componente correto
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home-student" element={<PrivateRoute><HomeStudent /></PrivateRoute>} />
      <Route path="/sessions" element={<PrivateRoute><StudySessions /></PrivateRoute>} />
      <Route path="/study-session/:sessionId" element={<PrivateRoute><StudySession /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default AppRoutes;
