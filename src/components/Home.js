import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Bem-vindo ao Eden AI</h1>

      <p className="app-description">
        Eden AI é uma plataforma desenvolvida para aprimorar a experiência educacional, conectando alunos e professores de maneira personalizada. 
        Com o Eden AI, os alunos podem acessar sessões de estudo personalizadas, acompanhar seu progresso acadêmico e colaborar com educadores em tempo real.
        Nosso objetivo é proporcionar uma experiência de aprendizado integrada, utilizando tecnologia generativa para atender às necessidades individuais de cada aluno.
      </p>

      <p className="password-security">
        A sua senha é protegida utilizando criptografia de hash. Isso significa que, mesmo que alguém tenha acesso ao banco de dados, 
        não conseguirá visualizar ou recuperar a senha que você digitou.
      </p>

      <div className="links-container">
        <Link className="custom-link" to="/register-student">Registrar como Estudante</Link>
        <Link className="custom-link" to="/register-teacher">Registrar como Professor</Link>
        <Link className="custom-link" to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
