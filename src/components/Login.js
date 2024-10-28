import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Person,
  Lock,
  School,
  Email,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { loginUser, recoverPassword } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('accessToken', data.access_token);
      navigate('/home-student');
    } catch (err) {
      setError(err.detail || "Falha ao fazer login");
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await recoverPassword(recoveryEmail);
      setRecoveryMessage("Link de redefinição de senha enviado para o seu e-mail!");
      setTimeout(() => {
        setShowRecovery(false);
        setRecoveryMessage('');
      }, 3000);
    } catch (err) {
      setError("Falha ao enviar o e-mail de recuperação");
    }
  };

  return (
    <Box className="login-page">
      <Paper elevation={3} className="login-container">
        <Box className="login-header">
          <School className="login-icon" />
          <Typography variant="h4" className="login-title">
            Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            fullWidth
            label="E-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
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
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-button"
          >
            Entrar
          </Button>
        </form>

        <Button
          variant="text"
          onClick={() => setShowRecovery(true)}
          className="forgot-password-button"
        >
          Esqueceu sua senha?
        </Button>

        <Divider className="divider">
          <Typography variant="body2">ou</Typography>
        </Divider>

        <Box className="register-options">
          <Typography variant="body1" className="register-text">
            Não tem uma conta?
          </Typography>
          <Box className="register-buttons">
            <Button
              component={Link}
              to="/register-student"
              variant="outlined"
              className="register-button student"
              startIcon={<School />}
            >
              Registrar como Estudante
            </Button>
            <Button
              component={Link}
              to="/register-teacher"
              variant="outlined"
              className="register-button teacher"
              startIcon={<Person />}
            >
              Registrar como Professor
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={showRecovery}
        onClose={() => setShowRecovery(false)}
        className="recovery-dialog"
      >
        <DialogTitle>Recuperar Senha</DialogTitle>
        <DialogContent>
          {recoveryMessage ? (
            <Alert severity="success">{recoveryMessage}</Alert>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="E-mail"
              type="email"
              fullWidth
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="recovery-input"
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRecovery(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handlePasswordRecovery} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
