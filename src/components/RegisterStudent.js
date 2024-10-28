import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  LinearProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  School,
  Info,
} from '@mui/icons-material';
import { registerUser } from '../services/api';
import '../styles/Auth.css';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (pass.match(/[a-z]+/)) strength += 20;
    if (pass.match(/[A-Z]+/)) strength += 20;
    if (pass.match(/[0-9]+/)) strength += 20;
    if (pass.match(/[$@#&!]+/)) strength += 20;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 20) return '#f44336';
    if (strength <= 40) return '#ff9800';
    if (strength <= 60) return '#ffeb3b';
    if (strength <= 80) return '#4caf50';
    return '#2e7d32';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await registerUser(name, email, password, 'student');
      setMessage(response.message);
      setMessageType('success');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.detail || "Falha ao registrar");
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <Box className="register-page">
      <Paper elevation={3} className="register-container">
        <Box className="register-header">
          <IconButton
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <School className="register-icon" />
          <Typography variant="h4" className="register-title">
            Registro de Estudante
          </Typography>
        </Box>

        {loading && (
          <LinearProgress className="register-progress" />
        )}

        {message && (
          <Alert 
            severity={messageType} 
            className="register-alert"
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <TextField
            fullWidth
            label="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person className="input-icon" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="input-icon" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="input-icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {password && (
            <Box className="password-strength">
              <Box className="strength-bar-container">
                <Box 
                  className="strength-bar"
                  sx={{ 
                    width: `${passwordStrength}%`,
                    bgcolor: getPasswordStrengthColor(passwordStrength)
                  }}
                />
              </Box>
              <Typography variant="caption">
                Força da senha: {passwordStrength}%
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="register-button"
            disabled={loading || passwordStrength < 60}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>

        <Divider className="divider">
          <Typography variant="body2">Informações de Segurança</Typography>
        </Divider>

        <Box className="security-info">
          <Typography variant="body2" className="security-text">
            <Info className="info-icon" />
            Sua senha é protegida utilizando criptografia avançada. Recomendamos:
          </Typography>
          <ul className="security-list">
            <li>Mínimo de 8 caracteres</li>
            <li>Letras maiúsculas e minúsculas</li>
            <li>Números</li>
            <li>Caracteres especiais (@#$&!)</li>
          </ul>
        </Box>

        <Button
          component={Link}
          to="/login"
          variant="text"
          className="login-link"
        >
          Já tem uma conta? Faça login
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterStudent;