import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
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
  InputLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import { getStudySessions, createDiscipline, uploadDisciplinePDF } from '../services/api'; // Import API functions

const StudySessions = () => {
  const navigate = useNavigate();

  // State para guardar as disciplinas e sessões reais vindas do backend
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionSubject, setNewSessionSubject] = useState('');
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');
  const [newDisciplineEmenta, setNewDisciplineEmenta] = useState('');
  const [newDisciplineObjetivos, setNewDisciplineObjetivos] = useState('');
  const [pdfFile, setPdfFile] = useState(null);  // Estado para armazenar o arquivo PDF

  // Função para buscar as sessões do backend
  const loadStudySessions = async () => {
    try {
      const sessions = await getStudySessions();
      setDisciplines(sessions); // Ajustar conforme a estrutura de dados retornada do backend
    } catch (error) {
      console.error('Erro ao carregar sessões de estudo', error);
    }
  };

  // Chama a função ao carregar o componente
  useEffect(() => {
    loadStudySessions();
  }, []);

  // Função para criar uma nova disciplina via nome ou via PDF
  const createNewDiscipline = async () => {
    try {
      if (pdfFile) {
        // Se um arquivo PDF for carregado, faça o upload
        await uploadDisciplinePDF(pdfFile);
      } else {
        // Caso contrário, cria a disciplina pelo nome, ementa e objetivos
        const newDiscipline = await createDiscipline({
          nomeCurso: newDisciplineName,
          ementa: newDisciplineEmenta,
          objetivos: newDisciplineObjetivos
        });
        setDisciplines([...disciplines, newDiscipline]); // Atualiza o estado local
      }
      setNewDisciplineName('');
      setNewDisciplineEmenta('');
      setNewDisciplineObjetivos('');
      setOpenDisciplineModal(false);
      setPdfFile(null);  // Limpar o arquivo PDF após o upload
    } catch (error) {
      console.error('Erro ao criar nova disciplina', error);
    }
  };

  // Função para lidar com o upload de arquivos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);  // Armazena o arquivo PDF no estado
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

              <Grid container spacing={3}>
                {discipline.sessions.map((session, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card onClick={() => handleSessionClick(session.id)}>
                      <CardContent>
                        <Typography variant="h6">{session.nome}</Typography>
                        <Typography color="textSecondary">{session.assunto}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {/* Botão para adicionar nova sessão */}
                <Grid item xs={12} sm={6} md={4}>
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
                </Grid>
              </Grid>
            </div>
          ))}
        </div>

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
              disabled={pdfFile !== null}  // Desabilita o campo se o PDF for carregado
            />
            <TextField
              label="Ementa"
              fullWidth
              margin="normal"
              value={newDisciplineEmenta}
              onChange={(e) => setNewDisciplineEmenta(e.target.value)}
              disabled={pdfFile !== null}  // Desabilita o campo se o PDF for carregado
            />
            <TextField
              label="Objetivos"
              fullWidth
              margin="normal"
              value={newDisciplineObjetivos}
              onChange={(e) => setNewDisciplineObjetivos(e.target.value)}
              disabled={pdfFile !== null}  // Desabilita o campo se o PDF for carregado
            />
            <InputLabel>Ou carregue o arquivo PDF da EMENTA do curso</InputLabel>
            <Button variant="contained" component="label">
              Upload PDF
              <input type="file" hidden accept="application/pdf" onChange={handleFileUpload} />
            </Button>
            {pdfFile && <Typography variant="body2">{pdfFile.name}</Typography>} {/* Exibe o nome do arquivo PDF */}
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