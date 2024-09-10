// src/routes.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterStudent from './components/RegisterStudent';
import Login from './components/Login';
import HomeStudent from './components/HomeStudent';
import StudySessions from './components/StudySessions';
import ChatPage from './components/ChatPage';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home-student" element={<PrivateRoute><HomeStudent /></PrivateRoute>} />
      <Route path="/sessions" element={<PrivateRoute><StudySessions /></PrivateRoute>} />
      <Route path="/session/:sessionName" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default AppRoutes;
