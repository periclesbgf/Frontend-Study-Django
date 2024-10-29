import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/HomeStudent.css';
import CalendarComponent from './CalendarComponent';

const HomeStudent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onCollapse={setIsSidebarCollapsed}
      />
      <div className={`home-student ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="content">
          <h2>Bem-vindo ao Eden AI</h2>
          <CalendarComponent />
        </div>
      </div>
    </>
  );
};

export default HomeStudent;