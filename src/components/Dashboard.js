import React from 'react';
import Sidebar from './Sidebar'; // Importando o componente Sidebar

const Dashboard = () => {
  return (
    <div className="home-student">
      {/* Incluindo o Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal do Dashboard */}
      <div className="content">
        <h2>Dashboard</h2>
        <p>Here you can view your progress and statistics.</p>
      </div>
    </div>
  );
};

export default Dashboard;
