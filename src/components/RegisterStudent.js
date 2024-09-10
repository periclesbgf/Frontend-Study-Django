import React, { useState } from 'react';
import { registerUser } from '../services/api';
import '../styles/Register.css';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(name, email, password, 'student');
      setMessage(response.message);  // Sucesso
    } catch (err) {
      if (err.detail && typeof err.detail === 'object' && err.detail.msg) {
        // Extrair a mensagem correta do objeto de erro
        setMessage(err.detail.msg);
      } else if (Array.isArray(err.detail)) {
        // Se o erro for uma lista, mapear os erros
        const errorMessages = err.detail.map(error => error.msg).join(', ');
        setMessage(errorMessages);
      } else {
        // Exibe uma mensagem padrão de falha
        setMessage("Falha ao registrar a conta.");
      }
    }
  };
  

  return (
    <div className="register-container">
      <h1>Register as Student</h1>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
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
          placeholder="Password" 
          required 
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterStudent;
