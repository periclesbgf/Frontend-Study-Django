import React from 'react';
import Sidebar from './Sidebar';  // Importando o Sidebar
import '../styles/HomeStudent.css';
import CalendarComponent from './CalendarComponent';  // Importando o componente de calendário

const HomeStudent = () => {
  return (
    <div className="home-student">
      <Sidebar /> {/* Usando o Sidebar */}
      <div className="content">
        <h1>Calendário de Estudo</h1>
        <CalendarComponent />  {/* Mostrando o calendário com eventos fictícios */}
      </div>
    </div>
  );
};

export default HomeStudent;
