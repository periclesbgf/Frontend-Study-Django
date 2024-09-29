import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import ChatPage from './ChatPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'; // Adicionando o ícone do Workplace
import '../styles/HomeStudent.css';

const StudySession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="home-student">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '>' : '<'}
        </button>
        <button onClick={() => handleNavigation('home')}>
          <FontAwesomeIcon icon={faHome} className="icon" />
          {!isCollapsed && <span>Home</span>}
        </button>
        <button onClick={() => handleNavigation('dashboard')}>
          <FontAwesomeIcon icon={faChartBar} className="icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>
        <button onClick={() => handleNavigation('study_session')}>
          <FontAwesomeIcon icon={faFolder} className="icon" />
          {!isCollapsed && <span>Study Session</span>}
        </button>
        <button onClick={() => handleNavigation('workplace')}>  {/* Botão do Workplace */}
          <FontAwesomeIcon icon={faBriefcase} className="icon" />
          {!isCollapsed && <span>Workplace</span>}
        </button>
        <hr />
        <button onClick={() => handleNavigation('logout')}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
      <div className="content">
        <h1>Study Session {sessionId}</h1>
        <ChatPage sessionId={sessionId} />
      </div>
    </div>
  );
};

export default StudySession;
