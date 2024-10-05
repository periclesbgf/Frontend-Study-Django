import React, { useState } from 'react';
import { loginUser, recoverPassword } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('accessToken', data.access_token);  // Armazena o token
      navigate('/home-student');  // Redireciona para a página HomeStudent
    } catch (err) {
      setError(err.detail || "Falha ao fazer login");
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    try {
      await recoverPassword(recoveryEmail);
      setRecoveryMessage("Link de redefinição de senha enviado para o seu e-mail!");
    } catch (err) {
      setError("Falha ao enviar o e-mail de recuperação");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}

      <p>
        <button onClick={() => setShowRecovery(true)}>Esqueceu sua senha?</button>
      </p>

      {showRecovery && (
        <div className="recovery-modal">
          <h2>Recuperar Senha</h2>
          <form onSubmit={handlePasswordRecovery}>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
            <button type="submit">Enviar E-mail de Recuperação</button>
          </form>
          {recoveryMessage && <p className="success">{recoveryMessage}</p>}
        </div>
      )}

      <p className="register-prompt">
        Não tem uma conta?
        <br />
        <Link className="register-link" to="/register-student">Registrar como Estudante</Link>
        <span> ou </span>
        <Link className="register-link" to="/register-teacher">Registrar como Professor</Link>
      </p>
    </div>
  );
};

export default Login;
