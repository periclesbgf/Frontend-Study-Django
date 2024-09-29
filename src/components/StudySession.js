import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import ChatPage from './ChatPage';
import Sidebar from './Sidebar';  // Certifique-se de que o Sidebar está sendo importado corretamente
import '../styles/HomeStudent.css';

const StudySession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="home-student">
      <Sidebar />
      <div className="content">
        <h1>Study Session {sessionId}</h1>
        <ChatPage sessionId={sessionId} />
      </div>
    </div>
  );
};

export default StudySession;
