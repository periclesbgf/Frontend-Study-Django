// src/components/StudySession.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatPage from './ChatPage';
import Sidebar from './Sidebar'; // Certifique-se de que o Sidebar está importando o onToggle
import '../styles/StudySession.css';

const StudySession = () => {
  const { sessionId } = useParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className={`study-session-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="study-session-content">
        <div className="chat-wrapper">
          <ChatPage sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
};

export default StudySession;
