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
  Divider,
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
  const [studyShift, setStudyShift] = useState('');
  const [classStartTime, setClassStartTime] = useState('');
  const [classEndTime, setClassEndTime] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [educators, setEducators] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);

  const formatTimeForDisplay = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

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

  const validateForm = () => {
    if (!studyShift || !classStartTime || !classEndTime) {
      alert('Turno de estudo e horários da aula são obrigatórios');
      return false;
    }

    if (!pdfFile && !newDisciplineName.trim()) {
      alert('Forneça o nome da disciplina ou faça upload de um PDF');
      return false;
    }

    // Validar se o horário de fim é posterior ao de início
    const startTime = new Date(`2000-01-01T${classStartTime}`);
    const endTime = new Date(`2000-01-01T${classEndTime}`);
    if (endTime <= startTime) {
      alert('O horário de fim deve ser posterior ao horário de início');
      return false;
    }

    return true;
  };

  const createNewDiscipline = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const disciplineData = {
        studyShift,
        classStartTime,
        classEndTime,
        ...(pdfFile ? { file: pdfFile } : {
          nomeCurso: newDisciplineName,
          ementa: newDisciplineEmenta,
          objetivos: newDisciplineObjetivos,
          professorId: selectedEducator || null,
        })
      };

      if (pdfFile) {
        await uploadDisciplinePDF(disciplineData);
      } else {
        const newDiscipline = await createDiscipline(disciplineData);
        setDisciplines(prev => [...prev, newDiscipline]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
      alert('Erro ao criar disciplina. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenDisciplineModal(false);
    setNewDisciplineName('');
    setNewDisciplineEmenta('');
    setNewDisciplineObjetivos('');
    setStudyShift('');
    setClassStartTime('');
    setClassEndTime('');
    setSelectedEducator('');
    setPdfFile(null);
    setUploadHover(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecione um arquivo PDF');
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
    } else {
      alert('Por favor, forneça um arquivo PDF');
    }
  };

  const getShiftLabel = (shift) => {
    const shifts = {
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite'
    };
    return shifts[shift] || shift;
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
                    <Box className="card-info">
                      <Typography className="card-description">
                        {discipline.Ementa || 'Sem descrição disponível'}
                      </Typography>
                      <Box className="card-details">
                        <Chip 
                          icon={<TimeIcon />}
                          label={getShiftLabel(discipline.studyShift)}
                          className="info-chip shift-chip"
                        />
                        <Typography className="time-info">
                          Aula: {formatTimeForDisplay(discipline.classStartTime)} às {formatTimeForDisplay(discipline.classEndTime)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="card-footer">
                      <Box className="card-update">
                        <TimeIcon fontSize="small" />
                        <Typography variant="caption">
                          {new Date(discipline.DataCriacao).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
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
            <Box className="required-fields">
              <Box className="shift-select">
                <InputLabel>Turno de Estudo *</InputLabel>
                <Select
                  fullWidth
                  value={studyShift}
                  onChange={(e) => setStudyShift(e.target.value)}
                  required
                  className="modal-input"
                >
                  <MenuItem value="manha">Manhã</MenuItem>
                  <MenuItem value="tarde">Tarde</MenuItem>
                  <MenuItem value="noite">Noite</MenuItem>
                </Select>
              </Box>

              <Box className="class-time">
                <Typography variant="subtitle2" className="time-label">
                  Horário da Aula *
                </Typography>
                <Box className="time-inputs">
                  <TextField
                    label="Início"
                    type="time"
                    value={classStartTime}
                    onChange={(e) => setClassStartTime(e.target.value)}
                    className="time-input"
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      step: 300
                    }}
                    helperText={classStartTime ? `Horário: ${formatTimeForDisplay(classStartTime)}` : ''}
                  />
                  <TextField
                    label="Fim"
                    type="time"
                    value={classEndTime}
                    onChange={(e) => setClassEndTime(e.target.value)}
                    className="time-input"
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      step: 300
                    }}
                    helperText={classEndTime ? `Horário: ${formatTimeForDisplay(classEndTime)}` : ''}
                  />
                </Box>
              </Box>
            </Box>

            <Divider className="modal-divider" />

            <Box className={`conditional-fields ${pdfFile ? 'disabled' : ''}`}>
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
            </Box>

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
                  {pdfFile && (
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.preventDefault();
                        setPdfFile(null);
                      }}
                      className="remove-file"
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
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
              disabled={loading || (!pdfFile && !newDisciplineName) || !studyShift || !classStartTime || !classEndTime}
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