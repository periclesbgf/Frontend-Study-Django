import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RegisterStudent from './components/RegisterStudent';
import Login from './components/Login';
import HomeStudent from './components/HomeStudent';
import StudySessions from './components/StudySessions';
import StudySession from './components/StudySession';
import Workspace from './components/Workspace';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home-student" element={<PrivateRoute><HomeStudent /></PrivateRoute>} />
      <Route path="/study_sessions" element={<PrivateRoute><StudySessions /></PrivateRoute>} />
      <Route path="/study_sessions/:sessionId" element={<PrivateRoute><StudySession /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/workspace" element={<PrivateRoute><Workspace /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default AppRoutes;
