import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import { registerUser } from '../services/api';
import '../styles/RegisterTeacher.css';

const RegisterTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialCode, setSpecialCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Instancia o hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password, 'educator', specialCode);
      setMessage('Professor registrado com sucesso!');
      
      // Redireciona o usuário para a página de login
      setTimeout(() => {
        navigate('/login'); // Navega para a página de login
      }, 1500); // Espera 1.5 segundos para mostrar a mensagem antes de redirecionar
    } catch (error) {
      setMessage('Erro ao registrar professor.');
    }
  };

  return (
    <div className="register-teacher-container">
      <h1>Registro de Professor</h1>
      <form onSubmit={handleSubmit} className="register-teacher-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Instituição"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código Especial (Special Code)"
          value={specialCode}
          onChange={(e) => setSpecialCode(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}

      {/* Mensagem de segurança da senha */}
      <p className="password-security">
        A sua senha é protegida utilizando criptografia de hash. Isso significa que, mesmo que alguém tenha acesso ao banco de dados, não conseguirá visualizar ou recuperar a senha que você digitou.
      </p>
    </div>
  );
};

export default RegisterTeacher;
