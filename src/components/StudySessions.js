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
  Box,
  Paper,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  AutoAwesome as AutoAwesomeIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import {
  getStudySessionFromDiscipline,
  createStudySession,
  updateStudySession,
  getStudySessionById,
  getStudyPlan,
  createAutomaticStudyPlan,
  getSessionsWithoutPlan,
} from '../services/api';

const StudySessions = () => {
  const { disciplineId } = useParams();
  const navigate = useNavigate();

  // Estados principais
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para criação manual de sessão
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  // Estados para edição de sessão
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [originalOrder, setOriginalOrder] = useState([]);

  // Estados para geração automática de plano
  const [openAutoplanModal, setOpenAutoplanModal] = useState(false);
  const [sessionsWithoutPlan, setSessionsWithoutPlan] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [autoplanDuration, setAutoplanDuration] = useState('60');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loadingSessionsWithoutPlan, setLoadingSessionsWithoutPlan] = useState(false);

  // Estado para o período de estudo
  const [studyPeriod, setStudyPeriod] = useState(''); // Período de estudo (manhã, tarde ou noite)

  // Estados para mensagens de erro
  const [error, setError] = useState(null);

  // Carrega as sessões de estudo
  const loadStudySessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudySessionFromDiscipline(disciplineId);
      const sessions = response.study_sessions || [];
      
      // Se não temos uma ordem original salva ainda, salvamos a ordem atual
      if (originalOrder.length === 0) {
        const orderMap = sessions.map(session => session.IdSessao);
        setOriginalOrder(orderMap);
        setSessions(sessions);
      } else {
        // Ordenamos as sessões baseado na ordem original
        const orderedSessions = [...sessions].sort((a, b) => {
          const indexA = originalOrder.indexOf(a.IdSessao);
          const indexB = originalOrder.indexOf(b.IdSessao);
          
          // Se uma sessão não estiver na ordem original, ela vai para o fim
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });
        
        setSessions(orderedSessions);
      }
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar sessões de estudo:', error);
      setError('Erro ao carregar sessões de estudo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [disciplineId, originalOrder]);

  // Carrega sessões sem plano
  const loadSessionsWithoutPlan = async () => {
    setLoadingSessionsWithoutPlan(true);
    try {
      const response = await getSessionsWithoutPlan();
      if (response && Array.isArray(response.sessions)) {
        setSessionsWithoutPlan(response.sessions);
        if (response.sessions.length > 0) {
          setSelectedSessionId(response.sessions[0].id_sessao);
        }
      } else {
        setSessionsWithoutPlan([]);
      }
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar sessões sem plano:', error);
      setError('Erro ao carregar sessões disponíveis. Por favor, tente novamente.');
      setSessionsWithoutPlan([]);
    } finally {
      setLoadingSessionsWithoutPlan(false);
    }
  };

  useEffect(() => {
    loadStudySessions();
  }, [loadStudySessions]);

  // Handlers para navegação e interação
  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${disciplineId}/${sessionId}`);
  };

  // Handler para abrir modal de plano automático
  const handleOpenAutoplanModal = async () => {
    await loadSessionsWithoutPlan();
    setOpenAutoplanModal(true);
  };

  // Função handleGenerateAutoPlan atualizada
  const handleGenerateAutoPlan = async () => {
    if (!selectedSessionId) return;

    setGeneratingPlan(true);
    try {
      const selectedSession = sessionsWithoutPlan.find(
        (session) => session.id_sessao === selectedSessionId
      );

      if (!selectedSession) throw new Error('Sessão não encontrada');

      const result = await createAutomaticStudyPlan(disciplineId, {
        session_id: selectedSessionId,
        descricao: selectedSession.Assunto,
        duracao: autoplanDuration,
        periodo: studyPeriod, // Inclui o período selecionado na requisição
      });

      setGeneratedPlan(result.plano);
      setError(null);
      await loadStudySessions();
      await loadSessionsWithoutPlan();
    } catch (error) {
      console.error('Erro ao gerar plano automático:', error);
      setError('Erro ao gerar plano. Por favor, tente novamente.');
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Handler para criação manual de sessão
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
      await loadStudySessions();
      setError(null);
    } catch (error) {
      console.error('Erro ao criar sessão de estudo:', error);
      setError('Erro ao criar sessão. Por favor, tente novamente.');
    }
  };

  // Handler para edição de sessão
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
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar sessão ou plano de estudo:', error);
      setError('Erro ao carregar dados da sessão. Por favor, tente novamente.');
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
      await loadStudySessions();
      setError(null);
    } catch (error) {
      console.error('Erro ao atualizar sessão de estudo:', error);
      setError('Erro ao atualizar sessão. Por favor, tente novamente.');
    }
  };

  // Reset dos estados do modal de plano automático
  const handleCloseAutoplanModal = () => {
    setOpenAutoplanModal(false);
    setSelectedSessionId('');
    setAutoplanDuration('60');
    setStudyPeriod(''); // Reseta o período de estudo
    setGeneratedPlan(null);
    setError(null);
  };

  return (
    <div className="study-sessions-container">
      <Sidebar />
      <div className="study-sessions-content">
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#ffffff' }}>
          Sessões de Estudo - Disciplina {disciplineId}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Card de Geração Automática de Plano */}
        <Paper
          elevation={3}
          className="header-card"
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#42464d',
            color: '#ffffff',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            Crie seu Plano de Estudos Personalizado
          </Typography>
          <Typography variant="body1" sx={{ color: '#b9bbbe' }} paragraph align="center">
            Nosso assistente criará um plano adaptado ao seu estilo de aprendizagem
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleOpenAutoplanModal}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: '#5865F2',
                '&:hover': {
                  backgroundColor: '#4752C4',
                },
              }}
            >
              Gerar Plano Automático
            </Button>
          </Box>
        </Paper>

        <Divider sx={{ my: 4, borderColor: '#4f545c' }} />
        <div className="session-list">
          {loading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress sx={{ backgroundColor: '#40444b' }} />
              <Typography variant="body1" align="center" sx={{ mt: 2, color: '#ffffff' }}>
                Carregando sessões de estudo...
              </Typography>
            </Box>
          ) : sessions.length > 0 ? (
            <Grid container spacing={3}>
              {sessions.map((session) => (
                <Grid item xs={12} md={6} lg={4} key={session.IdSessao}>
                  <Card
                    className="session-card"
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      backgroundColor: '#42464d',
                      border: '1px solid #4f545c',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                      <IconButton
                        onClick={() => handleEditSession(session.IdSessao)}
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: '#5865F2',
                          '&:hover': {
                            backgroundColor: 'rgba(88, 101, 242, 0.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <Box
                        onClick={() => handleSessionClick(session.IdSessao)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                          {session.Assunto}
                        </Typography>

                        <Box display="flex" alignItems="center" mb={1}>
                          <AccessTimeIcon sx={{ mr: 1, color: '#b9bbbe' }} />
                          <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
                            {new Date(session.Inicio).toLocaleString()}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <AssignmentIcon sx={{ mr: 1, color: '#b9bbbe' }} />
                          <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
                            {session.objetivo_sessao || 'Sem objetivo definido'}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mt={1}>
                          <DescriptionIcon sx={{ mr: 1, color: '#b9bbbe' }} />
                          <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
                            Progresso: {session.Produtividade || 0}%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <LinearProgress
                      variant="determinate"
                      value={session.Produtividade || 0}
                      sx={{
                        height: 8,
                        backgroundColor: '#40444b',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#5865F2',
                        },
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" sx={{ color: '#ffffff' }}>
              Nenhuma sessão de estudo encontrada.
            </Typography>
          )}
        </div>

        {/* Modal de Geração Automática de Plano */}
        <Dialog
          open={openAutoplanModal}
          onClose={handleCloseAutoplanModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: '#36393f',
              color: '#ffffff',
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#2f3136',
              color: '#ffffff',
              borderBottom: '1px solid #4f545c',
            }}
          >
            Gerar Plano de Estudos Personalizado
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {loadingSessionsWithoutPlan ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress sx={{ backgroundColor: '#40444b' }} />
                <Typography variant="body2" align="center" sx={{ mt: 1, color: '#b9bbbe' }}>
                  Carregando sessões disponíveis...
                </Typography>
              </Box>
            ) : sessionsWithoutPlan.length === 0 ? (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  backgroundColor: '#4f545c',
                  color: '#ffffff',
                  '& .MuiAlert-icon': {
                    color: '#ffffff',
                  },
                }}
              >
                Todas as suas sessões já possuem planos de estudo.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel sx={{ color: '#b9bbbe' }}>Selecione a Sessão</InputLabel>
                  <Select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    label="Selecione a Sessão"
                    sx={{
                      backgroundColor: '#40444b',
                      color: '#ffffff',
                      '& .MuiSelect-icon': {
                        color: '#b9bbbe',
                      },
                    }}
                  >
                    {sessionsWithoutPlan.map((session) => (
                      <MenuItem
                        key={session.id_sessao}
                        value={session.id_sessao}
                        sx={{
                          backgroundColor: '#40444b',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: '#45494f',
                          },
                        }}
                      >
                        <Box>
                          <Typography sx={{ color: '#ffffff' }}>{session.Assunto}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: '#b9bbbe' }}>
                    Selecione uma sessão para gerar o plano de estudos
                  </FormHelperText>
                </FormControl>

                {/* Dropdown para selecionar o período de estudo */}
                <FormControl fullWidth margin="normal">
                  <InputLabel sx={{ color: '#b9bbbe' }}>Preferencia de Estudo</InputLabel>
                  <Select
                    value={studyPeriod}
                    onChange={(e) => setStudyPeriod(e.target.value)}
                    label="Período de Estudo"
                    sx={{
                      backgroundColor: '#40444b',
                      color: '#ffffff',
                      '& .MuiSelect-icon': {
                        color: '#b9bbbe',
                      },
                    }}
                  >
                    <MenuItem value="manhã">Manhã</MenuItem>
                    <MenuItem value="tarde">Tarde</MenuItem>
                    <MenuItem value="noite">Noite</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: '#b9bbbe' }}>
                    Selecione o período desejado
                  </FormHelperText>
                </FormControl>

                {/* Campo de Duração Desejada */}
                <TextField
                  label="Duração Desejada (em minutos)"
                  fullWidth
                  margin="normal"
                  value={autoplanDuration}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setAutoplanDuration(value); // Atualiza apenas se for numérico
                    }
                  }}
                  helperText="Insira a duração em minutos (ex: 60, 90)"
                  inputProps={{
                    inputMode: 'numeric', // Força teclado numérico em dispositivos móveis
                    pattern: '[0-9]*', // Aceita apenas dígitos
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#40444b',
                      color: '#ffffff',
                      '& fieldset': {
                        borderColor: '#4f545c',
                      },
                      '&:hover fieldset': {
                        borderColor: '#5865F2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b9bbbe',
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#b9bbbe',
                    },
                  }}
                />
              </>
            )}
            {generatingPlan && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress
                  sx={{
                    backgroundColor: '#40444b',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#5865F2',
                    },
                  }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1, color: '#b9bbbe' }}>
                  Gerando seu plano personalizado...
                </Typography>
              </Box>
            )}
            {generatedPlan && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: '#2f3136',
                  borderRadius: 2,
                  border: '1px solid #4f545c',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                  Plano de Estudos Gerado
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: '#b9bbbe' }}>
                  Duração Total: {generatedPlan.duracao_total}
                </Typography>
                <Divider sx={{ my: 2, borderColor: '#4f545c' }} />
                {generatedPlan.plano_execucao.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: '#36393f',
                      borderRadius: 1,
                      border: '1px solid #4f545c',
                      '&:hover': {
                        bgcolor: '#40444b',
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#5865F2',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#5865F2',
                          color: 'white',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        {index + 1}
                      </span>
                      {step.titulo} ({step.duracao})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: '#dcddde',
                      }}
                    >
                      {step.descricao}
                    </Typography>
                    {step.recursos && step.recursos.length > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          bgcolor: '#2f3136',
                          p: 2,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#b9bbbe',
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          Recursos:
                        </Typography>
                        <ul
                          style={{
                            marginTop: 4,
                            paddingLeft: '20px',
                            listStyle: 'none',
                          }}
                        >
                          {step.recursos.map((recurso, idx) => (
                            <li
                              key={idx}
                              style={{
                                marginBottom: '8px',
                                position: 'relative',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#dcddde',
                                  display: 'flex',
                                  alignItems: 'center',
                                  '&::before': {
                                    content: '"•"',
                                    color: '#5865F2',
                                    position: 'absolute',
                                    left: '-15px',
                                    fontSize: '1.2rem',
                                  },
                                }}
                              >
                                <strong style={{ color: '#b9bbbe' }}>{recurso.tipo}:</strong>
                                <span style={{ marginLeft: '4px' }}>{recurso.descricao}</span>
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              borderTop: '1px solid #4f545c',
              padding: '16px 24px',
            }}
          >
            <Button
              onClick={handleCloseAutoplanModal}
              sx={{
                color: '#b9bbbe',
                '&:hover': {
                  backgroundColor: 'rgba(185, 187, 190, 0.1)',
                },
              }}
            >
              Fechar
            </Button>
            <Button
              onClick={handleGenerateAutoPlan}
              disabled={!selectedSessionId || generatingPlan || loadingSessionsWithoutPlan}
              variant="contained"
              sx={{
                backgroundColor: '#5865F2',
                '&:hover': {
                  backgroundColor: '#4752C4',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#40444b',
                },
              }}
            >
              {generatingPlan ? 'Gerando...' : 'Gerar Plano'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Criação Manual de Sessão */}
        <Dialog
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          PaperProps={{
            style: {
              backgroundColor: '#36393f',
              color: '#ffffff',
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#2f3136',
              color: '#ffffff',
              borderBottom: '1px solid #4f545c',
            }}
          >
            Criar Nova Sessão de Estudo
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Assunto"
              fullWidth
              margin="normal"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
              }}
            />
            <TextField
              label="Data de Início"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
                '& input': {
                  color: '#ffffff',
                },
              }}
            />
            <TextField
              label="Data de Fim"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
                '& input': {
                  color: '#ffffff',
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              borderTop: '1px solid #4f545c',
              padding: '16px 24px',
            }}
          >
            <Button
              onClick={() => setOpenCreateModal(false)}
              sx={{
                color: '#b9bbbe',
                '&:hover': {
                  backgroundColor: 'rgba(185, 187, 190, 0.1)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={!newSubject || !newStartTime || !newEndTime}
              variant="contained"
              sx={{
                backgroundColor: '#5865F2',
                '&:hover': {
                  backgroundColor: '#4752C4',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#40444b',
                },
              }}
            >
              Criar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Edição de Sessão */}
        <Dialog
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          PaperProps={{
            style: {
              backgroundColor: '#36393f',
              color: '#ffffff',
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#2f3136',
              color: '#ffffff',
              borderBottom: '1px solid #4f545c',
            }}
          >
            Editar Sessão de Estudo
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Assunto"
              fullWidth
              margin="normal"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
              }}
            />
            <TextField
              label="Data de Início"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
                '& input': {
                  color: '#ffffff',
                },
              }}
            />
            <TextField
              label="Data de Fim"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
                '& input': {
                  color: '#ffffff',
                },
              }}
            />
            <TextField
              label="Plano de Estudos"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={editPlan}
              onChange={(e) => setEditPlan(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#40444b',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: '#4f545c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5865F2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b9bbbe',
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              borderTop: '1px solid #4f545c',
              padding: '16px 24px',
            }}
          >
            <Button
              onClick={() => setOpenEditModal(false)}
              sx={{
                color: '#b9bbbe',
                '&:hover': {
                  backgroundColor: 'rgba(185, 187, 190, 0.1)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateSession}
              disabled={!editSubject || !editStartTime || !editEndTime}
              variant="contained"
              sx={{
                backgroundColor: '#5865F2',
                '&:hover': {
                  backgroundColor: '#4752C4',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#40444b',
                },
              }}
            >
              Salvar Alterações
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer Actions */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateModal(true)}
            sx={{
              backgroundColor: '#5865F2',
              '&:hover': {
                backgroundColor: '#4752C4',
              },
            }}
          >
            Criar Sessão Manual
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default StudySessions;
