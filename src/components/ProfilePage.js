// src/components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { 
  TextField, Button, Box, Typography, CircularProgress, 
  MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { getProfile, updateProfile } from '../services/api';
import Sidebar from './Sidebar'; // Importa o componente Sidebar
import '../styles/ProfilePage.css'; // Importa o CSS da página de perfil

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
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
      setUpdated(true);
      setTimeout(() => setUpdated(false), 2000);
    } catch (err) {
      setError('Erro ao atualizar o perfil.');
    }
  };

  if (loading) return <CircularProgress />;

  if (error) return <Typography className="profile-error-message">{error}</Typography>;

  return (
    <Box className="profile-page-container">
      <Sidebar /> {/* Sidebar fixa à esquerda */}

      <Box className="profile-content">
        <Typography className="profile-header">Perfil de Estudante</Typography>

        <TextField
          label="Nome"
          value={profile.Nome || ''}
          fullWidth
          margin="normal"
          className="profile-input"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          value={profile.Email || ''}
          fullWidth
          margin="normal"
          className="profile-input"
          InputProps={{ readOnly: true }}
        />

        {/* Dropdowns para os estilos de aprendizagem */}
        <FormControl fullWidth margin="normal" className="profile-input">
          <InputLabel>Percepção</InputLabel>
          <Select
            value={profile.EstiloAprendizagem?.Percepcao || ''}
            onChange={handleSelectChange('Percepcao')}
          >
            <MenuItem value="Sensorial">Sensorial</MenuItem>
            <MenuItem value="Intuitiva">Intuitiva</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" className="profile-input">
          <InputLabel>Entrada</InputLabel>
          <Select
            value={profile.EstiloAprendizagem?.Entrada || ''}
            onChange={handleSelectChange('Entrada')}
          >
            <MenuItem value="Visual">Visual</MenuItem>
            <MenuItem value="Verbal">Verbal</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" className="profile-input">
          <InputLabel>Processamento</InputLabel>
          <Select
            value={profile.EstiloAprendizagem?.Processamento || ''}
            onChange={handleSelectChange('Processamento')}
          >
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Reflexivo">Reflexivo</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" className="profile-input">
          <InputLabel>Entendimento</InputLabel>
          <Select
            value={profile.EstiloAprendizagem?.Entendimento || ''}
            onChange={handleSelectChange('Entendimento')}
          >
            <MenuItem value="Sequencial">Sequencial</MenuItem>
            <MenuItem value="Global">Global</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          className="profile-save-button"
          onClick={handleUpdateProfile}
        >
          Salvar Alterações
        </Button>

        {updated && (
          <Typography className="profile-success-message">
            Perfil atualizado com sucesso!
          </Typography>
        )}

        <Typography className="profile-info-message" marginTop={2}>
          Não sabe seu estilo de aprendizagem? Faça o teste no link abaixo:
        </Typography>
        <a
          href="https://www.makerzine.com.br/testes/teste-descubra-qual-e-o-seu-estilo-de-aprendizagem-segundo-o-modelo-felder-silverman/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Teste de Estilo de Aprendizagem
        </a>
      </Box>
    </Box>
  );
};

export default ProfilePage;
