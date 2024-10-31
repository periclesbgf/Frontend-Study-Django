// src/components/Workspace.js

import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Collapse,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Book as BookIcon,
  Public as GlobeIcon,
  Description as FileTextIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import {
  uploadMaterial,
  getMaterials,
  updateMaterialAccess,
  deleteMaterial,
  getDisciplines,
  getStudySessions,
} from '../services/api';
import '../styles/Workspace.css';

const Workspace = () => {
  const [materials, setMaterials] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [accessLevel, setAccessLevel] = useState('global');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Fetch materials, disciplines, and sessions when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialsData, disciplinesData] = await Promise.all([
          getMaterials(),
          getDisciplines(),
        ]);

        // Fetch sessions for each discipline
        const sessionsData = await Promise.all(
          disciplinesData.map((discipline) =>
            getStudySessions(discipline.id)
          )
        );

        setMaterials(materialsData.materials);
        setDisciplines(disciplinesData);
        setSessions(sessionsData.flat());
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFileIcon = useCallback((type) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon sx={{ color: '#ef4444' }} />;
      case 'doc':
      case 'docx':
        return <FileTextIcon sx={{ color: '#3b82f6' }} />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <ImageIcon sx={{ color: '#10b981' }} />;
      default:
        return <FileTextIcon sx={{ color: '#6b7280' }} />;
    }
  }, []);

  const toggleSession = (sessionId) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    try {
      // Determine new access level based on destination
      let newAccessLevel =
        destination.droppableId === 'global'
          ? 'global'
          : destination.droppableId.startsWith('discipline-')
          ? 'discipline'
          : 'session';

      // Extract IDs from destination
      const [, destId] = destination.droppableId.split('-');

      // Update material access
      await updateMaterialAccess(
        draggableId,
        newAccessLevel,
        newAccessLevel === 'discipline' ? destId : null,
        newAccessLevel === 'session' ? destId : null
      );

      // Reload materials
      const materialsData = await getMaterials();
      setMaterials(materialsData.materials);
    } catch (error) {
      console.error('Erro ao mover arquivo:', error);
      setError('Erro ao mover o arquivo');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    try {
      await uploadMaterial(
        uploadFile,
        accessLevel,
        accessLevel === 'discipline' ? selectedDestination : null,
        accessLevel === 'session' ? selectedDestination : null
      );

      // Reset modal state
      setOpenUploadModal(false);
      setUploadFile(null);
      setAccessLevel('global');
      setSelectedDestination(null);

      // Reload materials
      const materialsData = await getMaterials();
      setMaterials(materialsData.materials);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao fazer upload do arquivo. Tente novamente.');
    }
  };

  const handleDeleteFile = async (materialId) => {
    try {
      await deleteMaterial(materialId);
      // Reload materials
      const materialsData = await getMaterials();
      setMaterials(materialsData.materials);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      setError('Erro ao deletar o arquivo');
    }
  };

  // Organize materials into a structured format
  const organizeMaterials = () => {
    const fileStructure = {
      global: {
        id: 'global',
        title: 'Arquivos Globais',
        files: [],
      },
      disciplines: [],
    };

    // Separate global materials
    fileStructure.global.files = materials.filter(
      (m) => m.access_level === 'global'
    );

    // For each discipline
    disciplines.forEach((discipline) => {
      const disciplineMaterials = materials.filter(
        (m) =>
          m.access_level === 'discipline' && m.discipline_id === discipline.id
      );

      const disciplineSessions = sessions.filter(
        (s) => s.discipline_id === discipline.id
      );

      const disciplineItem = {
        id: discipline.id,
        name: discipline.name,
        files: disciplineMaterials,
        sessions: [],
      };

      // For each session in the discipline
      disciplineSessions.forEach((session) => {
        const sessionMaterials = materials.filter(
          (m) =>
            m.access_level === 'session' && m.session_id === session.id
        );

        const sessionItem = {
          id: session.id,
          name: session.name,
          files: sessionMaterials,
        };

        disciplineItem.sessions.push(sessionItem);
      });

      fileStructure.disciplines.push(disciplineItem);
    });

    return fileStructure;
  };

  const fileStructure = organizeMaterials();

  const renderFileList = (files, droppableId, containerType, containerId) => (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`droppable-area ${
            snapshot.isDraggingOver ? 'drag-over' : ''
          }`}
        >
          {files.map((file, index) => (
            <Draggable key={file.id} draggableId={file.id} index={index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`draggable-item ${
                    snapshot.isDragging ? 'dragging' : ''
                  }`}
                  sx={{
                    mb: 1,
                    backgroundColor: '#42464d',
                    '&:hover': {
                      backgroundColor: '#45494f',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getFileIcon(file.type)}
                      <Typography sx={{ color: '#ffffff' }}>
                        {file.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#b9bbbe', ml: 'auto' }}
                      >
                        {file.size}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: '#ef4444' }}
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="workspace-container">
        <Sidebar />
        <div className="workspace-content">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: '#ffffff' }}
          >
            Workspace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setOpenUploadModal(true)}
              sx={{
                backgroundColor: '#5865F2',
                '&:hover': {
                  backgroundColor: '#4752C4',
                },
              }}
            >
              Upload de Arquivo
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress sx={{ backgroundColor: '#40444b' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Global Files Section */}
              <Grid item xs={12}>
                <Card sx={{ backgroundColor: '#36393f', mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: '#ffffff', mb: 2 }}
                    >
                      <GlobeIcon
                        sx={{ mr: 1, verticalAlign: 'middle' }}
                      />
                      Arquivos Globais
                    </Typography>
                    {renderFileList(
                      fileStructure.global.files,
                      'global',
                      'global',
                      'global'
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Disciplines and Sessions */}
              {fileStructure.disciplines.map((discipline) => (
                <Grid item xs={12} md={6} key={discipline.id}>
                  <Card sx={{ backgroundColor: '#36393f' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ color: '#ffffff', mb: 2 }}
                      >
                        <BookIcon
                          sx={{ mr: 1, verticalAlign: 'middle' }}
                        />
                        {discipline.name}
                      </Typography>

                      {/* Discipline Files */}
                      {renderFileList(
                        discipline.files,
                        `discipline-${discipline.id}`,
                        'discipline',
                        discipline.id
                      )}

                      {/* Sessions */}
                      {discipline.sessions.map((session) => (
                        <Box key={session.id} sx={{ mt: 2 }}>
                          <Button
                            onClick={() => toggleSession(session.id)}
                            sx={{
                              color: '#ffffff',
                              textTransform: 'none',
                              width: '100%',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {expandedSessions[session.id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                            <Typography sx={{ ml: 1 }}>
                              {session.name}
                            </Typography>
                          </Button>
                          <Collapse in={expandedSessions[session.id]}>
                            <Box sx={{ pl: 4 }}>
                              {renderFileList(
                                session.files,
                                `session-${session.id}`,
                                'session',
                                session.id
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Upload Modal */}
          <Dialog
            open={openUploadModal}
            onClose={() => setOpenUploadModal(false)}
            maxWidth="sm"
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
              Upload de Arquivo
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box
                className={`upload-zone ${uploadFile ? 'has-file' : ''}`}
                sx={{
                  border: '2px dashed #4f545c',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#5865F2',
                    backgroundColor: 'rgba(88, 101, 242, 0.1)',
                  },
                }}
              >
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <UploadIcon
                    sx={{ fontSize: 40, color: '#b9bbbe', mb: 1 }}
                  />
                  <Typography sx={{ color: '#ffffff' }}>
                    {uploadFile
                      ? uploadFile.name
                      : 'Clique ou arraste um arquivo aqui'}
                  </Typography>
                </label>
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel
                  id="access-level-label"
                  sx={{ color: '#b9bbbe' }}
                >
                  Nível de Acesso
                </InputLabel>
                <Select
                  labelId="access-level-label"
                  value={accessLevel}
                  onChange={(e) => {
                    setAccessLevel(e.target.value);
                    setSelectedDestination(null);
                  }}
                  label="Nível de Acesso"
                  sx={{
                    bgcolor: '#40444b',
                    color: '#ffffff',
                    '& .MuiSelect-icon': {
                      color: '#b9bbbe',
                    },
                  }}
                >
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="discipline">Disciplina</MenuItem>
                  <MenuItem value="session">Sessão</MenuItem>
                </Select>
              </FormControl>

              {/* Conditional destination selection */}
              {accessLevel !== 'global' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel
                    id="destination-label"
                    sx={{ color: '#b9bbbe' }}
                  >
                    {accessLevel === 'discipline'
                      ? 'Selecione a Disciplina'
                      : 'Selecione a Sessão'}
                  </InputLabel>
                  <Select
                    labelId="destination-label"
                    value={selectedDestination || ''}
                    onChange={(e) =>
                      setSelectedDestination(e.target.value)
                    }
                    label={
                      accessLevel === 'discipline'
                        ? 'Selecione a Disciplina'
                        : 'Selecione a Sessão'
                    }
                    sx={{
                      bgcolor: '#40444b',
                      color: '#ffffff',
                      '& .MuiSelect-icon': {
                        color: '#b9bbbe',
                      },
                    }}
                  >
                    {accessLevel === 'discipline'
                      ? disciplines.map((discipline) => (
                          <MenuItem
                            key={discipline.id}
                            value={discipline.id}
                          >
                            {discipline.name}
                          </MenuItem>
                        ))
                      : sessions.map((session) => (
                          <MenuItem
                            key={session.id}
                            value={session.id}
                          >
                            {session.name}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                borderTop: '1px solid #4f545c',
                padding: '16px 24px',
              }}
            >
              <Button
                onClick={() => {
                  setOpenUploadModal(false);
                  setUploadFile(null);
                  setAccessLevel('global');
                  setSelectedDestination(null);
                }}
                sx={{ color: '#b9bbbe' }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={
                  !uploadFile ||
                  (accessLevel !== 'global' && !selectedDestination)
                }
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
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Workspace;
