import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faChartBar, 
  faFolder, 
  faSignOutAlt, 
  faBriefcase, 
  faUser,
  faBars,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', checkWidth);
    checkWidth();

    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const menuItems = [
    { path: '/home-student', icon: faHome, label: 'Home' },
    { path: '/dashboard', icon: faChartBar, label: 'Dashboard' },
    { path: '/discipline_sessions', icon: faFolder, label: 'Disciplinas' },
    { path: '/workspace', icon: faBriefcase, label: 'Workspace' },
    { path: '/profile', icon: faUser, label: 'Perfil' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} 
        onClick={() => setIsMobileOpen(false)}
      />
           
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Toggle Button */}
        <button 
          className="toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Mobile Menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Menu Items */}
        <div className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <FontAwesomeIcon icon={item.icon} className="icon" />
              <span className="label">{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            className="menu-item logout"
            onClick={() => handleNavigation('/login')}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            <span className="label">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;