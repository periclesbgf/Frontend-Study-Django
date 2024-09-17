import React from 'react';
import ChatPage from './ChatPage';  // O ChatBot importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/HomeStudent.css'; // Importando o CSS

const StudySession = () => {
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
        {/* Renderizando o chatbot */}
        <ChatPage />
      </div>
    </div>
  );
};

export default StudySession;
