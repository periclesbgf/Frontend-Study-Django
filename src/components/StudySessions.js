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
  IconButton,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import { 
  getStudySessionFromDiscipline, 
  createStudySession, 
  updateStudySession, 
  getStudySessionById, 
  getStudyPlan
} from '../services/api';

const StudySessions = () => {
  const { disciplineId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editPlan, setEditPlan] = useState('');

  const loadStudySessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudySessionFromDiscipline(disciplineId);
      if (response && response.study_sessions && response.study_sessions.length > 0) {
        setSessions(response.study_sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Erro ao carregar sessões de estudo:', error);
    } finally {
      setLoading(false);
    }
  }, [disciplineId]);

  useEffect(() => {
    loadStudySessions();
  }, [loadStudySessions]);

  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${disciplineId}/${sessionId}`);
  };

  const handleCreateSession = async () => {
    try {
      await createStudySession({
        discipline_id: parseInt(disciplineId, 10),
        subject: newSubject,
        start_time: newStartTime,
        end_time: newEndTime,
      });
      setOpenCreateModal(false);
      setNewSubject('');
      setNewStartTime('');
      setNewEndTime('');
      loadStudySessions();
    } catch (error) {
      console.error('Erro ao criar sessão de estudo:', error);
    }
  };

  const handleEditSession = async (sessionId) => {
    try {
      const session = await getStudySessionById(sessionId);
      const plan = await getStudyPlan(sessionId);

      setEditSession(session);
      setEditSubject(session.Assunto || '');
      setEditStartTime(session.Inicio || '');
      setEditEndTime(session.Fim || '');
      setEditPlan(plan.descricao || '');
      setOpenEditModal(true);
    } catch (error) {
      console.error('Erro ao buscar sessão ou plano de estudo:', error);
    }
  };

  const handleUpdateSession = async () => {
    try {
      await updateStudySession(editSession.IdSessao, {
        subject: editSubject,
        descricao: editPlan,
        start_time: editStartTime,
        end_time: editEndTime,
      });
      setOpenEditModal(false);
      loadStudySessions(); // Recarrega as sessões após a atualização
    } catch (error) {
      console.error('Erro ao atualizar sessão de estudo:', error);
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
            onClick={() => setOpenCreateModal(true)}
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
              <Card key={session.IdSessao} className="card" style={{ position: 'relative', minHeight: '120px' }}>
                <CardContent className="card-content" style={{ paddingBottom: '40px' }}>
                  <IconButton
                    onClick={() => handleEditSession(session.IdSessao)}
                    color="primary"
                    aria-label="editar"
                    style={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <div onClick={() => handleSessionClick(session.IdSessao)} style={{ cursor: 'pointer' }}>
                    <Typography className="card-title" variant="h6" gutterBottom>
                      {session.Assunto}
                    </Typography>
                  </div>
                </CardContent>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={session.Produtividade || 0}
                  />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Progresso: {session.Produtividade || 0}%
                  </Typography>
                </div>
              </Card>
            ))
          ) : (
            <Typography variant="body1" align="center">
              Nenhuma sessão de estudo encontrada.
            </Typography>
          )}
        </div>

        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
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
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de Fim"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateModal(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleCreateSession} color="primary">
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Editar Sessão de Estudo</DialogTitle>
          <DialogContent>
            <TextField
              label="Assunto"
              fullWidth
              margin="normal"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
            />
            <TextField
              label="Data de Início"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de Fim"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Plano de Estudos"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={editPlan}
              onChange={(e) => setEditPlan(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleUpdateSession} color="primary">
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default StudySessions;
