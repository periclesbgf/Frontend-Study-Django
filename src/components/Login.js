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
      localStorage.setItem('accessToken', data.access_token);  // Store the token
      navigate('/home-student');  // Redirect to the HomeStudent page
    } catch (err) {
      setError(err.detail || "Failed to login");
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    try {
      await recoverPassword(recoveryEmail);
      setRecoveryMessage("Password reset link sent to your email!");
    } catch (err) {
      setError("Failed to send recovery email");
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
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}

      <p>
        <button onClick={() => setShowRecovery(true)}>Forgot Password?</button>
      </p>

      {showRecovery && (
        <div className="recovery-modal">
          <h2>Recover Password</h2>
          <form onSubmit={handlePasswordRecovery}>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit">Send Recovery Email</button>
          </form>
          {recoveryMessage && <p className="success">{recoveryMessage}</p>}
        </div>
      )}

      <p>
        Don't have an account? <Link className="ResgisterLoginLink" to="/register-student">Register as a Student</Link>
      </p>
    </div>
  );
};

export default Login;
