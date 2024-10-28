import React, { useEffect, useState } from 'react';
import { 
  Button, Box, Typography, CircularProgress, 
  MenuItem, Select, FormControl, InputLabel, Card,
  Avatar, Divider, Grid, Paper, Tooltip,
  Alert, Snackbar
} from '@mui/material';
import {
  School,
  Edit,
  Psychology,
  Help,
  SaveAlt,
  Cancel
} from '@mui/icons-material';
import { getProfile, updateProfile } from '../services/api';
import Sidebar from './Sidebar';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const learningStyleOptions = {
    Percepcao: [
      { value: 'Sensorial', description: 'Prefere informações concretas e práticas' },
      { value: 'Intuitiva', description: 'Prefere conceitos abstratos e teóricos' }
    ],
    Entrada: [
      { value: 'Visual', description: 'Aprende melhor com imagens e diagramas' },
      { value: 'Verbal', description: 'Aprende melhor com explicações verbais' }
    ],
    Processamento: [
      { value: 'Ativo', description: 'Aprende fazendo e experimentando' },
      { value: 'Reflexivo', description: 'Aprende pensando e analisando' }
    ],
    Entendimento: [
      { value: 'Sequencial', description: 'Prefere aprender passo a passo' },
      { value: 'Global', description: 'Prefere ter uma visão geral primeiro' }
    ]
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar o perfil.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSelectChange = (field) => (event) => {
    setProfile({
      ...profile,
      EstiloAprendizagem: { ...profile.EstiloAprendizagem, [field]: event.target.value }
    });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profile);
      setShowSnackbar(true);
      setEditMode(false);
    } catch (err) {
      setError('Erro ao atualizar o perfil.');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    fetchProfile(); // Recarrega os dados originais
  };

  if (loading) {
    return (
      <Box className="profile-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="profile-error">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="profile-page-container">
      <Sidebar />
      <Box className="profile-content">
        <Box className="profile-header">
          <Typography variant="h4" className="profile-title">
            Perfil de Estudante
          </Typography>
          <Box className="header-actions">
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  className="cancel-button"
                  startIcon={<Cancel />}
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  className="save-button"
                  startIcon={<SaveAlt />}
                  onClick={handleUpdateProfile}
                >
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                className="edit-button"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
              >
                Editar Perfil
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card className="profile-card">
              <Box className="profile-avatar-container">
                <Avatar className="profile-avatar">
                  {profile.Nome?.charAt(0)}
                </Avatar>
                <Typography variant="h6" className="profile-name">
                  {profile.Nome}
                </Typography>
                <Typography variant="body1" className="profile-email">
                  {profile.Email}
                </Typography>
              </Box>
              <Divider />
              <Box className="profile-stats">
                <Box className="stat-item">
                  <School />
                  <Typography variant="body1">Estudante</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card className="profile-card">
              <Box className="card-header">
                <Typography variant="h6" className="section-title">
                  <Psychology /> Estilos de Aprendizagem
                </Typography>
                <Typography variant="body2" className="section-description">
                  Seus estilos de aprendizagem determinam como você melhor processa e retém informações
                </Typography>
              </Box>
              <Divider />
              
              <Grid container spacing={3} className="learning-styles-grid">
                {Object.entries(learningStyleOptions).map(([key, options]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <FormControl fullWidth className="learning-style-select">
                      <InputLabel id={`${key}-label`}>{key}</InputLabel>
                      <Select
                        labelId={`${key}-label`}
                        value={profile.EstiloAprendizagem?.[key] || ''}
                        onChange={handleSelectChange(key)}
                        disabled={!editMode}
                        label={key}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            }
                          }
                        }}
                      >
                        {options.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box className="select-option">
                              <Typography>{option.value}</Typography>
                              <Tooltip 
                                title={option.description}
                                placement="right"
                              >
                                <Help fontSize="small" />
                              </Tooltip>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Card>

            <Paper className="info-paper">
              <Box className="info-content">
                <Psychology className="info-icon" />
                <Box>
                  <Typography variant="h6">
                    Descubra seu Estilo de Aprendizagem
                  </Typography>
                  <Typography variant="body2">
                    Faça o teste completo para identificar seu perfil de aprendizagem
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  href="https://www.makerzine.com.br/testes/teste-descubra-qual-e-o-seu-estilo-de-aprendizagem-segundo-o-modelo-felder-silverman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="test-button"
                >
                  Fazer Teste
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setShowSnackbar(false)}
            className="success-alert"
          >
            Perfil atualizado com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProfilePage;