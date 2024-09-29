import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  // Importando useParams para pegar o sessionId
import ChatPage from './ChatPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/HomeStudent.css';

const StudySession = () => {
  const { sessionId } = useParams();  // Pegando o sessionId da URL
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="home-student">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '>' : '<'} 
        </button>
        <button>
          {isCollapsed ? <FontAwesomeIcon icon={faHome} className="icon" /> : 'Home'}
        </button>
        <button>
          {isCollapsed ? <FontAwesomeIcon icon={faChartBar} className="icon" /> : 'Dashboard'}
        </button>
        <button>
          {isCollapsed ? <FontAwesomeIcon icon={faFolder} className="icon" /> : 'Study Session'}
        </button>
        <hr />
        <button>
          {isCollapsed ? <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> : 'Logout'}
        </button>
      </div>
      <div className="content">
        <h1>Study Session {sessionId}</h1>  {/* Exibindo o ID da sessão */}
        <ChatPage sessionId={sessionId} />  {/* Passando o sessionId para o ChatPage, se necessário */}
      </div>
    </div>
  );
};

export default StudySession;
