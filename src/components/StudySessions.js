import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import { getStudySessionFromDiscipline, createStudySession } from '../services/api';

const StudySessions = () => {
  const { disciplineId } = useParams(); // Obtém o ID da disciplina pela URL
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para controle do modal de criação de sessão
  const [openModal, setOpenModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Função para carregar as sessões de estudo
  const loadStudySessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudySessionFromDiscipline(disciplineId);
      console.log('Dados das sessões:', response); // Para depuração

      if (response && response.study_sessions && response.study_sessions.length > 0) {
        setSessions(response.study_sessions);
      } else {
        console.error('Nenhuma sessão de estudo encontrada para esta disciplina.');
        setSessions([]);
      }
    } catch (error) {
      console.error('Erro ao carregar sessões de estudo:', error);
    } finally {
      setLoading(false);
    }
  }, [disciplineId]);

  // Carrega as sessões ao montar o componente
  useEffect(() => {
    loadStudySessions();
  }, [loadStudySessions]);

  // Redireciona para a sessão específica
  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${disciplineId}/${sessionId}`);
  };

  // Cria uma nova sessão de estudo
  const handleCreateSession = async () => {
    try {
      await createStudySession({
        discipline_id: parseInt(disciplineId, 10),
        subject: newSubject,
        start_time: startTime,
        end_time: endTime,
      });
      setOpenModal(false);
      loadStudySessions(); // Recarrega as sessões após criação
    } catch (error) {
      console.error('Erro ao criar sessão de estudo:', error);
    }
  };

  return (
    <div className="study-sessions-container">
      <Sidebar />
      <div className="study-sessions-content">
        <Typography variant="h3" align="center" gutterBottom>
          Sessões de Estudo - Disciplina {disciplineId}
        </Typography>

        <div className="study-actions" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Nova Sessão de Estudo
          </Button>
        </div>

        <div className="session-list">
          {loading ? (
            <Typography variant="body1" align="center">
              Carregando sessões de estudo...
            </Typography>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <Card
                key={session.IdSessao}
                className="card"
                onClick={() => handleSessionClick(session.IdSessao)}
              >
                <CardContent className="card-content">
                  <Typography className="card-title">{session.Assunto}</Typography>
                  <Typography className="card-description">
                    Início: {new Date(session.Inicio).toLocaleString()}
                  </Typography>
                  <Typography className="card-description">
                    Fim: {new Date(session.Fim).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" align="center">
              Nenhuma sessão de estudo encontrada.
            </Typography>
          )}
        </div>

        {/* Modal para criar nova sessão */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Criar Nova Sessão de Estudo</DialogTitle>
          <DialogContent>
            <TextField
              label="Assunto"
              fullWidth
              margin="normal"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <TextField
              label="Data de Início"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de Fim"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleCreateSession} color="primary">
              Criar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default StudySessions;
