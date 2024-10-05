import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import { registerUser } from '../services/api';
import '../styles/Register.css';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(name, email, password, 'student');
      setMessage(response.message);

      // Redireciona para a tela de login após o registro bem-sucedido
      setTimeout(() => {
        navigate('/login'); // Navega para a tela de login
      }, 1500); // Tempo de espera para exibir a mensagem de sucesso antes do redirecionamento

    } catch (err) {
      setMessage(err.detail || "Falha ao registrar");
    }
  };

  return (
    <div className="register-container">
      <h1>Registrar como Estudante</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
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

export default RegisterStudent;
