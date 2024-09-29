import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material'; // Corrigindo a importação do AddIcon
import Sidebar from './Sidebar';  // Importando o Sidebar
import '../styles/StudySessions.css';

const StudySessions = () => {
  const navigate = useNavigate();

  const [disciplines, setDisciplines] = useState([
    {
      id: 1,
      nome: 'Matemática',
      sessions: [
        { id: 101, nome: 'Estudo de Álgebra', assunto: 'Álgebra avançada' },
        { id: 102, nome: 'Geometria', assunto: 'Figuras e formas' },
      ],
    },
    {
      id: 2,
      nome: 'Física',
      sessions: [
        { id: 201, nome: 'Mecânica Clássica', assunto: 'Leis de Newton' },
        { id: 202, nome: 'Termodinâmica', assunto: 'Transferência de calor' },
      ],
    },
    {
      id: 3,
      nome: 'História',
      sessions: [
        { id: 301, nome: 'História Antiga', assunto: 'Civilizações egípcias' },
        { id: 302, nome: 'História Moderna', assunto: 'Revolução Industrial' },
      ],
    },
  ]);

  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionSubject, setNewSessionSubject] = useState('');
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');

  const createNewDiscipline = () => {
    const newDiscipline = {
      id: disciplines.length + 1,
      nome: newDisciplineName,
      sessions: [],
    };
    setDisciplines([...disciplines, newDiscipline]);
    setNewDisciplineName('');
    setOpenDisciplineModal(false);
  };

  const createNewSession = (disciplineId) => {
    const newSession = {
      id: Math.floor(Math.random() * 1000),
      nome: newSessionName,
      assunto: newSessionSubject,
    };

    const updatedDisciplines = disciplines.map(discipline =>
      discipline.id === disciplineId
        ? { ...discipline, sessions: [...discipline.sessions, newSession] }
        : discipline
    );

    setDisciplines(updatedDisciplines);
    setNewSessionName('');
    setNewSessionSubject('');
    setSelectedDiscipline(null);
    setOpenSessionModal(false);
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${sessionId}`);
  };

  return (
    <div className="study-sessions-container">
      <Sidebar /> {/* Adicionando o Sidebar */}
      <div className="study-sessions-content">
        <Typography variant="h3" align="center" gutterBottom>
          Sessões de Estudo por Disciplina
        </Typography>

        <div className="discipline-actions" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}  // Uso do AddIcon corrigido
            onClick={() => setOpenDisciplineModal(true)}
          >
            Nova Disciplina
          </Button>
        </div>

        <div className="discipline-list">
          {disciplines.map((discipline) => (
            <div key={discipline.id} className="discipline-section" style={{ marginBottom: '40px' }}>
              <Typography variant="h5" gutterBottom>
                {discipline.nome}
              </Typography>

              <Grid2 container spacing={3}>
                {discipline.sessions.map((session, index) => (
                  <Grid2 item xs={12} sm={6} md={4} key={index}>
                    <Card onClick={() => handleSessionClick(session.id)}>
                      <CardContent>
                        <Typography variant="h6">{session.nome}</Typography>
                        <Typography color="textSecondary">{session.assunto}</Typography>
                      </CardContent>
                    </Card>
                  </Grid2>
                ))}

                {/* Botão para adicionar nova sessão */}
                <Grid2 item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => {
                      setSelectedDiscipline(discipline.id);
                      setOpenSessionModal(true);
                    }}
                    style={{ backgroundColor: '#eee', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <CardContent>
                      <IconButton size="large">
                        <AddIcon fontSize="large" /> <Typography className="add_session_text"  variant="body2">Nova Sessão</Typography>
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </div>
          ))}
        </div>

        {/* Modal para criar nova sessão de estudo */}
        <Dialog open={openSessionModal} onClose={() => setOpenSessionModal(false)}>
          <DialogTitle>Criar Nova Sessão</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome da Sessão"
              fullWidth
              margin="normal"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <TextField
              label="Assunto"
              fullWidth
              margin="normal"
              value={newSessionSubject}
              onChange={(e) => setNewSessionSubject(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSessionModal(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={() => createNewSession(selectedDiscipline)} color="primary">
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para criar nova disciplina */}
        <Dialog open={openDisciplineModal} onClose={() => setOpenDisciplineModal(false)}>
          <DialogTitle>Criar Nova Disciplina</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome da Disciplina"
              fullWidth
              margin="normal"
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDisciplineModal(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={createNewDiscipline} color="primary">
              Criar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default StudySessions;
