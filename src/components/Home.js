import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  School,
  Person,
  Login,
  Security,
  Psychology,
  Timeline,
  Group,
  AutoStories,
} from '@mui/icons-material';
import '../styles/Home.css';

const Home = () => {
  const features = [
    {
      icon: <Psychology />,
      title: 'Aprendizado Personalizado',
      description: 'Sessões de estudo adaptadas ao seu estilo de aprendizagem único.'
    },
    {
      icon: <Timeline />,
      title: 'Acompanhamento de Progresso',
      description: 'Monitore seu desenvolvimento acadêmico em tempo real.'
    },
    {
      icon: <Group />,
      title: 'Colaboração em Tempo Real',
      description: 'Interaja com professores e colegas de forma dinâmica.'
    },
    {
      icon: <AutoStories />,
      title: 'Conteúdo Inteligente',
      description: 'Material de estudo gerado por IA para maximizar seu aprendizado.'
    }
  ];

  return (
    <Box className="home-container">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" className="hero-title">
                Bem-vindo ao Eden AI
              </Typography>
              <Typography variant="h5" className="hero-subtitle">
                Transformando a educação através da inteligência artificial
              </Typography>
              <Box className="hero-buttons">
                <Button
                  component={Link}
                  to="/register-student"
                  variant="contained"
                  className="hero-button student"
                  startIcon={<School />}
                >
                  Sou Estudante
                </Button>
                <Button
                  component={Link}
                  to="/register-teacher"
                  variant="contained"
                  className="hero-button teacher"
                  startIcon={<Person />}
                >
                  Sou Professor
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className="hero-image-container">
              <img 
                src="/hero-image.png" 
                alt="Eden AI Learning" 
                className="hero-image"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title">
            Por que escolher o Eden AI?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card">
                  <CardContent>
                    <Box className="feature-icon">
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Security Section */}
      <Box className="security-section">
        <Container maxWidth="md">
          <Paper elevation={3} className="security-paper">
            <Security className="security-icon" />
            <Typography variant="h6" className="security-title">
              Sua segurança é nossa prioridade
            </Typography>
            <Typography variant="body1" className="security-text">
              Utilizamos criptografia avançada para proteger seus dados e informações pessoais.
              Todas as senhas são armazenadas com hash seguro, garantindo a privacidade dos nossos usuários.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="cta-section">
        <Container maxWidth="md">
          <Typography variant="h3" className="cta-title">
            Comece sua jornada agora
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            Entre para uma comunidade de aprendizado inovadora
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            className="cta-button"
            startIcon={<Login />}
          >
            Acessar Plataforma
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
