import React, { useState } from 'react';
import { registerUser } from '../services/api';
import '../styles/RegisterTeacher.css';

const RegisterTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specialCode, setSpecialCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(name, email, password, 'educator', specialCode);
      setMessage('Professor registrado com sucesso!');
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
          placeholder="Especialização em Disciplina"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
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
    </div>
  );
};

export default RegisterTeacher;