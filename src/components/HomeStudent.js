// src/components/HomeStudent.js

import React from 'react';
import Sidebar from './Sidebar'; // Importando o componente Sidebar
import '../styles/HomeStudent.css';
import CalendarComponent from './CalendarComponent';  // Importando o componente de calendário

const HomeStudent = () => {
  return (
    <div className="home-student">
      <Sidebar />
      <div className="content">
        <h2>Bem-vindo ao Eden AI</h2>
        <CalendarComponent></CalendarComponent>
        {/* Adicione aqui o conteúdo principal da página do estudante */}
      </div>
    </div>
  );
};

export default HomeStudent;
