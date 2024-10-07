// src/components/DisciplineSessions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
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
import '../styles/DisciplineSessions.css'; // Importando o CSS atualizado
import { getDisciplines, createDiscipline, uploadDisciplinePDF, getAllEducators } from '../services/api';

const DisciplineSessions = () => {
  const navigate = useNavigate();

  const [disciplines, setDisciplines] = useState([]);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');
  const [newDisciplineEmenta, setNewDisciplineEmenta] = useState('');
  const [newDisciplineObjetivos, setNewDisciplineObjetivos] = useState('');
  const [pdfFile, setPdfFile] = useState(null); // Guarda o arquivo PDF
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para carregar disciplinas
  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const response = await getDisciplines();
      setDisciplines(response || []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar os professores
  const loadEducators = async () => {
    setLoading(true);
    try {
      const response = await getAllEducators();
      setEducators(response.educators || []);
    } catch (error) {
      console.error('Erro ao carregar professores', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega as disciplinas e professores ao montar o componente
  useEffect(() => {
    loadDisciplines();
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
      // Limpar os campos
      setNewDisciplineName('');
      setNewDisciplineEmenta('');
      setNewDisciplineObjetivos('');
      setSelectedEducator('');
      setOpenDisciplineModal(false);
      setPdfFile(null);
    } catch (error) {
      console.error('Erro ao criar nova disciplina:', error);
    }
  };

  // Função para lidar com o upload de arquivos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setPdfFile(file); // Salva o arquivo no estado
  };

  // Função para lidar com o clique na disciplina
  const handleDisciplineClick = (disciplineId) => {
    navigate(`/study_sessions/${disciplineId}`);
  };

  // Função para limpar o professor selecionado
  const handleDeleteEducator = () => {
    setSelectedEducator(''); // Reseta o valor ao clicar no X
  };

  return (
    <div className="discipline-sessions-container">
      <Sidebar />
      <div className="discipline-sessions-content">
        <Typography variant="h3" align="center" gutterBottom>
          Disciplinas
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
          {loading ? (
            <Typography variant="body1" align="center">Carregando disciplinas...</Typography>
          ) : (
            disciplines.length > 0 ? (
              disciplines.map((discipline) => (
                <Card key={discipline.IdCurso} className="card" onClick={() => handleDisciplineClick(discipline.IdCurso)}>
                  <CardContent className="card-content">
                    <Typography className="card-title">{discipline.NomeCurso}</Typography>
                    <Typography className="card-description">
                      {discipline.Ementa ? discipline.Ementa : 'Sem descrição disponível'}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" align="center">Nenhuma disciplina encontrada.</Typography>
            )
          )}
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

            {/* Exibe o Chip do professor selecionado */}
            {selectedEducator && (
              <div style={{ marginTop: '10px' }}>
                <Chip
                  label={selectedEducator}
                  onDelete={handleDeleteEducator}
                  deleteIcon={<CancelIcon />}
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: '#000',
                    fontWeight: 'bold',
                    '.MuiChip-label': { color: '#000 !important' },
                  }}
                />
              </div>
            )}

            <InputLabel style={{ marginTop: '20px' }}>Ou carregue o arquivo PDF da EMENTA do curso</InputLabel>
            <Button variant="contained" component="label">
              Upload PDF
              <input type="file" hidden accept="application/pdf" onChange={handleFileUpload} />
            </Button>

            {/* Exibe o nome do arquivo após o upload */}
            {pdfFile && <Typography variant="body2" style={{ marginTop: '10px', color: '#000'}}>{pdfFile.name}</Typography>}

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

export default DisciplineSessions;
