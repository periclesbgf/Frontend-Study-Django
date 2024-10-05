import React, { useState, useEffect } from 'react';
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
  TextField,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Cancel as CancelIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import { getStudySessions, createDiscipline, uploadDisciplinePDF, getAllEducators } from '../services/api';

const StudySessions = () => {
  const navigate = useNavigate();

  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionSubject, setNewSessionSubject] = useState('');
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');
  const [newDisciplineEmenta, setNewDisciplineEmenta] = useState('');
  const [newDisciplineObjetivos, setNewDisciplineObjetivos] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para carregar os professores
  const loadEducators = async () => {
    setLoading(true);
    try {
      const response = await getAllEducators();
      setEducators(response.educators);
    } catch (error) {
      console.error('Erro ao carregar professores', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar as sessões de estudo
  const loadStudySessions = async () => {
    try {
      const sessions = await getStudySessions();
      setDisciplines(sessions);
    } catch (error) {
      console.error('Erro ao carregar sessões de estudo', error);
    }
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    loadStudySessions();
    loadEducators();
  }, []);

  // Função para criar uma nova disciplina
  const createNewDiscipline = async () => {
    try {
      if (pdfFile) {
        await uploadDisciplinePDF(pdfFile);
      } else {
        const newDiscipline = await createDiscipline({
          nomeCurso: newDisciplineName,
          ementa: newDisciplineEmenta,
          objetivos: newDisciplineObjetivos,
          professorId: selectedEducator || null,
        });
        setDisciplines([...disciplines, newDiscipline]);
      }
      // Limpar os valores após criar a disciplina
      setNewDisciplineName('');
      setNewDisciplineEmenta('');
      setNewDisciplineObjetivos('');
      setSelectedEducator('');
      setOpenDisciplineModal(false);
      setPdfFile(null);
    } catch (error) {
      console.error('Erro ao criar nova disciplina', error);
    }
  };

  // Função para lidar com o upload de arquivos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  // Função para lidar com o clique na sessão
  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${sessionId}`);
  };

  // Função para limpar o professor selecionado
  const handleDeleteEducator = () => {
    setSelectedEducator(''); // Resetar o valor ao clicar no X
  };

  return (
    <div className="study-sessions-container">
      <Sidebar />
      <div className="study-sessions-content">
        <Typography variant="h3" align="center" gutterBottom>
          Sessões de Estudo por Disciplina
        </Typography>

        <div className="discipline-actions" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
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
                        <AddIcon fontSize="large" /> <Typography className="add_session_text" variant="body2">Nova Sessão</Typography>
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid2>
              </Grid2>
            </div>
          ))}
        </div>

        <Dialog open={openDisciplineModal} onClose={() => setOpenDisciplineModal(false)}>
          <DialogTitle>Criar Nova Disciplina</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome da Disciplina"
              fullWidth
              margin="normal"
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
              disabled={pdfFile !== null}
            />
            <TextField
              label="Ementa"
              fullWidth
              margin="normal"
              value={newDisciplineEmenta}
              onChange={(e) => setNewDisciplineEmenta(e.target.value)}
              disabled={pdfFile !== null}
            />
            <TextField
              label="Objetivos"
              fullWidth
              margin="normal"
              value={newDisciplineObjetivos}
              onChange={(e) => setNewDisciplineObjetivos(e.target.value)}
              disabled={pdfFile !== null}
            />

            {/* Dropdown de Professores */}
            <InputLabel>Professor</InputLabel>
            {loading ? (
              <CircularProgress />
            ) : (
              <Select
                fullWidth
                value={selectedEducator}
                onChange={(e) => setSelectedEducator(e.target.value)}
              >
                {educators.length > 0 ? (
                  educators.map((educator, index) => (
                    <MenuItem key={index} value={educator}>
                      {educator}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Nenhum professor encontrado</MenuItem>
                )}
              </Select>
            )}

            {/* Renderizar o Chip se o educador for selecionado */}
            {selectedEducator && (
              <div style={{ marginTop: '10px' }}>
                <Chip
                  label={selectedEducator}
                  onDelete={handleDeleteEducator} // Chama a função para resetar o valor ao clicar no X
                  deleteIcon={<CancelIcon />}
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: '#000', // Garantir que a cor do texto seja preto
                    fontWeight: 'bold',
                    '.MuiChip-label': { color: '#000 !important' }, // Forçar a cor do texto
                  }}
                />
              </div>
            )}

            <InputLabel style={{ marginTop: '20px' }}>Ou carregue o arquivo PDF da EMENTA do curso</InputLabel>
            <Button variant="contained" component="label">
              Upload PDF
              <input type="file" hidden accept="application/pdf" onChange={handleFileUpload} />
            </Button>
            {pdfFile && <Typography variant="body2">{pdfFile.name}</Typography>}
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
