import React from 'react';
import Sidebar from './Sidebar';  // Importando o Sidebar
import '../styles/Workspace.css';

const Workplace = () => {
  return (
    <div className="workplace-container">
      <Sidebar /> {/* Adicionando o Sidebar */}
      <div className="content">
        <h1>Workplace</h1>
        <p>Aqui é o seu espaço de trabalho!</p>
      </div>
    </div>
  );
};

export default Workplace;
