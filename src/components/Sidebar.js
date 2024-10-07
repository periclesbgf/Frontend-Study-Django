import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState); // Notifica o estado colapsado
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </button>
      {!isCollapsed && <h3>Menu</h3>}
      <button onClick={() => navigate('/home-student')}>
        <FontAwesomeIcon icon={faHome} className="icon" />
        {!isCollapsed && 'Home'}
      </button>
      <button onClick={() => navigate('/dashboard')}>
        <FontAwesomeIcon icon={faChartBar} className="icon" />
        {!isCollapsed && 'Dashboard'}
      </button>
      <button onClick={() => navigate('/discipline_sessions')}> {/* Alterei a rota para discipline_sessions */}
        <FontAwesomeIcon icon={faFolder} className="icon" />
        {!isCollapsed && 'Discipline Sessions'}
      </button>
      <button onClick={() => navigate('/workspace')}>
        <FontAwesomeIcon icon={faBriefcase} className="icon" />
        {!isCollapsed && 'Workspace'}
      </button>
      <hr />
      <button onClick={() => navigate('/login')}>
        <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
        {!isCollapsed && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
