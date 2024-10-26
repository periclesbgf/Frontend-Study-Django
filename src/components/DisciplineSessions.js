import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import '../styles/DisciplineSessions.css';
import {
  getDisciplines,
  createDiscipline,
  uploadDisciplinePDF,
  getAllEducators,
} from '../services/api';

const DisciplineSessions = () => {
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');
  const [newDisciplineEmenta, setNewDisciplineEmenta] = useState('');
  const [newDisciplineObjetivos, setNewDisciplineObjetivos] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);

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

  const loadEducators = async () => {
    try {
      const response = await getAllEducators();
      setEducators(response.educators || []);
    } catch (error) {
      console.error('Erro ao carregar professores', error);
    }
  };

  useEffect(() => {
    loadDisciplines();
    loadEducators();
  }, []);

  const createNewDiscipline = async () => {
    if (!newDisciplineName.trim()) return;
    
    setLoading(true);
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
        setDisciplines(prev => [...prev, newDiscipline]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenDisciplineModal(false);
    setNewDisciplineName('');
    setNewDisciplineEmenta('');
    setNewDisciplineObjetivos('');
    setSelectedEducator('');
    setPdfFile(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleDisciplineClick = (disciplineId) => {
    navigate(`/study_sessions/${disciplineId}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setUploadHover(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setUploadHover(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadHover(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  return (
    <div className="discipline-sessions-container">
      <Sidebar />
      <div className="discipline-sessions-content">
        <Typography variant="h3" align="center" className="page-title">
          Disciplinas
        </Typography>

        <div className="discipline-actions">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDisciplineModal(true)}
            className="add-button"
          >
            Nova Disciplina
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          <div className="discipline-list">
            {disciplines.length > 0 ? (
              disciplines.map((discipline) => (
                <Card
                  key={discipline.IdCurso}
                  className="discipline-card"
                  onClick={() => handleDisciplineClick(discipline.IdCurso)}
                >
                  <CardContent className="card-content">
                    <Box className="card-header">
                      <SchoolIcon className="card-icon" />
                      <Typography className="card-title">
                        {discipline.NomeCurso}
                      </Typography>
                    </Box>
                    <Typography className="card-description">
                      {discipline.Ementa || 'Sem descrição disponível'}
                    </Typography>
                    <Box className="card-footer">
                      <Tooltip title="Última atualização">
                        <Box className="card-update">
                          <TimeIcon fontSize="small" />
                          <Typography variant="caption">
                            {new Date(discipline.DataCriacao).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography className="no-disciplines">
                Nenhuma disciplina encontrada
              </Typography>
            )}
          </div>
        )}

        <Dialog 
          open={openDisciplineModal} 
          onClose={handleCloseModal}
          className="discipline-modal"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome da Disciplina"
              fullWidth
              margin="normal"
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
              disabled={pdfFile !== null}
              className="modal-input"
            />
            
            <TextField
              label="Ementa"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={newDisciplineEmenta}
              onChange={(e) => setNewDisciplineEmenta(e.target.value)}
              disabled={pdfFile !== null}
              className="modal-input"
            />

            <TextField
              label="Objetivos"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={newDisciplineObjetivos}
              onChange={(e) => setNewDisciplineObjetivos(e.target.value)}
              disabled={pdfFile !== null}
              className="modal-input"
            />

            <Box className="educator-select">
              <InputLabel>Professor</InputLabel>
              <Select
                fullWidth
                value={selectedEducator}
                onChange={(e) => setSelectedEducator(e.target.value)}
                disabled={pdfFile !== null}
              >
                {educators.map((educator, index) => (
                  <MenuItem key={index} value={educator}>
                    {educator}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {selectedEducator && (
              <Box className="selected-educator">
                <Chip
                  label={selectedEducator}
                  onDelete={() => setSelectedEducator('')}
                  deleteIcon={<CancelIcon />}
                />
              </Box>
            )}

            <Box 
              className={`upload-area ${uploadHover ? 'drag-over' : ''} ${pdfFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="pdf-upload"
                hidden
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              <label htmlFor="pdf-upload">
                <Box className="upload-content">
                  <UploadIcon className="upload-icon" />
                  <Typography>
                    {pdfFile ? pdfFile.name : 'Arraste ou clique para fazer upload da ementa em PDF'}
                  </Typography>
                </Box>
              </label>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button 
              onClick={handleCloseModal}
              color="error"
            >
              Cancelar
            </Button>
            <Button
              onClick={createNewDiscipline}
              variant="contained"
              disabled={loading || (!newDisciplineName && !pdfFile)}
            >
              {loading ? <CircularProgress size={24} /> : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DisciplineSessions;