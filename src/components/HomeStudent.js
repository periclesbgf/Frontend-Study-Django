// src/components/HomeStudent.js

import React from 'react';
import Sidebar from './Sidebar';
import '../styles/HomeStudent.css';
import CalendarComponent from './CalendarComponent';  // Import the calendar component

const HomeStudent = () => {
  return (
    <div className="home-student">
      <Sidebar />
      <div className="content">
        <h2>Bem-vindo ao Eden AI</h2>
        <CalendarComponent />  {/* Calendar displaying real events */}
        {/* Add the main student page content here */}
      </div>
    </div>
  );
};

export default HomeStudent;
