// src/components/Sidebar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';  // Certifique-se de adicionar estilos adequados no CSS

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </button>
      {!isCollapsed && <h3>Menu</h3>}
      <button onClick={() => handleNavigation('/home-student')}>
        <FontAwesomeIcon icon={faHome} className="icon" />
        {!isCollapsed && 'Home'}
      </button>
      <button onClick={() => handleNavigation('/dashboard')}>
        <FontAwesomeIcon icon={faChartBar} className="icon" />
        {!isCollapsed && 'Dashboard'}
      </button>
      <button onClick={() => handleNavigation('/study_sessions')}>
        <FontAwesomeIcon icon={faFolder} className="icon" />
        {!isCollapsed && 'Study Sessions'}
      </button>
      <button onClick={() => handleNavigation('/workspace')}>
        <FontAwesomeIcon icon={faBriefcase} className="icon" />
        {!isCollapsed && 'Workspace'}
      </button>
      <hr />
      <button onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
        {!isCollapsed && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
