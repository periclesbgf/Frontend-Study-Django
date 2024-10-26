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
  Edit as EditIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';

const Workspace = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [accessLevel, setAccessLevel] = useState('global');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Mock data structure with global files, disciplines, and sessions
  const [fileStructure, setFileStructure] = useState({
    global: {
      id: 'global',
      title: 'Arquivos Globais',
      files: [
        { id: 'g1', name: 'Global1.pdf', type: 'pdf', size: '2.4 MB', updated: '2024-03-15' },
        { id: 'g2', name: 'Global2.docx', type: 'doc', size: '1.1 MB', updated: '2024-03-14' },
      ]
    },
    disciplines: [
      {
        id: 'disc1',
        name: 'Cálculo I',
        files: [
          { id: 'd1', name: 'Derivadas.pdf', type: 'pdf', size: '2.4 MB', updated: '2024-03-15' }
        ],
        sessions: [
          {
            id: 'sess1',
            name: 'Limites e Continuidade',
            files: [
              { id: 's1', name: 'Exercícios.pdf', type: 'pdf', size: '1.5 MB', updated: '2024-03-15' }
            ]
          },
          {
            id: 'sess2',
            name: 'Derivadas',
            files: [
              { id: 's2', name: 'Notas.docx', type: 'doc', size: '1.2 MB', updated: '2024-03-14' }
            ]
          }
        ]
      },
      {
        id: 'disc2',
        name: 'Física I',
        files: [
          { id: 'd2', name: 'Mecânica.pdf', type: 'pdf', size: '3.1 MB', updated: '2024-03-13' }
        ],
        sessions: [
          {
            id: 'sess3',
            name: 'Cinemática',
            files: [
              { id: 's3', name: 'Exercícios.pdf', type: 'pdf', size: '1.8 MB', updated: '2024-03-12' }
            ]
          }
        ]
      }
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getFileIcon = useCallback((type) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon sx={{ color: '#ef4444' }} />;
      case 'doc':
        return <FileTextIcon sx={{ color: '#3b82f6' }} />;
      case 'image':
        return <ImageIcon sx={{ color: '#10b981' }} />;
      default:
        return <FileTextIcon sx={{ color: '#6b7280' }} />;
    }
  }, []);

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const newFileStructure = { ...fileStructure };
    let fileToMove;

    // Helper function to find and remove file
    const findAndRemoveFile = (container) => {
      const fileIndex = container.files.findIndex(f => f.id === draggableId);
      if (fileIndex !== -1) {
        fileToMove = container.files[fileIndex];
        container.files.splice(fileIndex, 1);
        return true;
      }
      return false;
    };

    // Remove file from source
    if (source.droppableId === 'global') {
      findAndRemoveFile(newFileStructure.global);
    } else {
      const [sourceType, sourceId] = source.droppableId.split('-');
      if (sourceType === 'discipline') {
        const discipline = newFileStructure.disciplines.find(d => d.id === sourceId);
        if (discipline) findAndRemoveFile(discipline);
      } else if (sourceType === 'session') {
        newFileStructure.disciplines.forEach(discipline => {
          discipline.sessions.forEach(session => {
            if (session.id === sourceId) {
              findAndRemoveFile(session);
            }
          });
        });
      }
    }

    // Add file to destination
    if (destination.droppableId === 'global') {
      newFileStructure.global.files.push(fileToMove);
    } else {
      const [destType, destId] = destination.droppableId.split('-');
      if (destType === 'discipline') {
        const discipline = newFileStructure.disciplines.find(d => d.id === destId);
        if (discipline) discipline.files.push(fileToMove);
      } else if (destType === 'session') {
        newFileStructure.disciplines.forEach(discipline => {
          discipline.sessions.forEach(session => {
            if (session.id === destId) {
              session.files.push(fileToMove);
            }
          });
        });
      }
    }

    setFileStructure(newFileStructure);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;
    
    try {
      // Aqui você implementaria a lógica real de upload
      console.log('Uploading file:', uploadFile);
      console.log('Access level:', accessLevel);
      console.log('Destination:', selectedDestination);
      
      // Simula sucesso do upload
      let newFile = {
        id: `new-${Date.now()}`,
        name: uploadFile.name,
        type: uploadFile.name.split('.').pop().toLowerCase(),
        size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
        updated: new Date().toISOString().split('T')[0]
      };

      const newFileStructure = { ...fileStructure };

      // Adiciona o arquivo no local apropriado baseado no access level
      if (accessLevel === 'global') {
        newFileStructure.global.files.push(newFile);
      } else if (accessLevel === 'discipline' && selectedDestination) {
        const discipline = newFileStructure.disciplines.find(d => d.id === selectedDestination);
        if (discipline) {
          discipline.files.push(newFile);
        }
      } else if (accessLevel === 'session' && selectedDestination) {
        newFileStructure.disciplines.forEach(discipline => {
          discipline.sessions.forEach(session => {
            if (session.id === selectedDestination) {
              session.files.push(newFile);
            }
          });
        });
      }

      setFileStructure(newFileStructure);
      setOpenUploadModal(false);
      setUploadFile(null);
      setAccessLevel('global');
      setSelectedDestination(null);
    } catch (error) {
      setError('Erro ao fazer upload do arquivo. Tente novamente.');
    }
  };

  const handleDeleteFile = (fileId, containerId, type) => {
    const newFileStructure = { ...fileStructure };
    
    if (type === 'global') {
      newFileStructure.global.files = newFileStructure.global.files.filter(f => f.id !== fileId);
    } else if (type === 'discipline') {
      const discipline = newFileStructure.disciplines.find(d => d.id === containerId);
      if (discipline) {
        discipline.files = discipline.files.filter(f => f.id !== fileId);
      }
    } else if (type === 'session') {
      newFileStructure.disciplines.forEach(discipline => {
        discipline.sessions.forEach(session => {
          if (session.id === containerId) {
            session.files = session.files.filter(f => f.id !== fileId);
          }
        });
      });
    }

    setFileStructure(newFileStructure);
  };

  const renderFileList = (files, droppableId, containerType, containerId) => (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`droppable-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
        >
          {files.map((file, index) => (
            <Draggable key={file.id} draggableId={file.id} index={index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                  sx={{
                    mb: 1,
                    backgroundColor: '#42464d',
                    '&:hover': {
                      backgroundColor: '#45494f',
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getFileIcon(file.type)}
                      <Typography sx={{ color: '#ffffff' }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b9bbbe', ml: 'auto' }}>
                        {file.size}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: '#ef4444' }}
                        onClick={() => handleDeleteFile(file.id, containerId, containerType)}
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
          <Typography variant="h3" align="center" gutterBottom sx={{ color: '#ffffff' }}>
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
                  backgroundColor: '#4752C4'
                }
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
                    <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                      <GlobeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Arquivos Globais
                    </Typography>
                    {renderFileList(fileStructure.global.files, 'global', 'global', 'global')}
                  </CardContent>
                </Card>
              </Grid>

              {/* Disciplines and Sessions */}
              {fileStructure.disciplines.map((discipline) => (
                <Grid item xs={12} md={6} key={discipline.id}>
                  <Card sx={{ backgroundColor: '#36393f' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                        <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {discipline.name}
                      </Typography>
                      
                      {/* Discipline Files */}
                      {renderFileList(discipline.files, `discipline-${discipline.id}`, 'discipline', discipline.id)}

                      {/* Sessions */}
                      {discipline.sessions.map((session) => (
                        <Box key={session.id} sx={{ mt: 2 }}>
                          <Button
                            onClick={() => toggleSession(session.id)}
                            sx={{ color: '#ffffff', textTransform: 'none', width: '100%', justifyContent: 'flex-start' }}
                          >
                            {expandedSessions[session.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            <Typography sx={{ ml: 1 }}>{session.name}</Typography>
                          </Button>
                          <Collapse in={expandedSessions[session.id]}>
                            <Box sx={{ pl: 4 }}>
                              {renderFileList(session.files, `session-${session.id}`, 'session', session.id)}
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
            <DialogTitle sx={{ 
              backgroundColor: '#2f3136',
              color: '#ffffff',
              borderBottom: '1px solid #4f545c'
            }}>
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
                    backgroundColor: 'rgba(88, 101, 242, 0.1)'
                  }
                }}
              >
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <UploadIcon sx={{ fontSize: 40, color: '#b9bbbe', mb: 1 }} />
                  <Typography sx={{ color: '#ffffff' }}>
                    {uploadFile ? uploadFile.name : 'Clique ou arraste um arquivo aqui'}
                  </Typography>
                </label>
              </Box>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="access-level-label" sx={{ color: '#b9bbbe' }}>
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
                      color: '#b9bbbe'
                    }
                  }}
                >
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="discipline">Disciplina</MenuItem>
                  <MenuItem value="session">Sessão</MenuItem>
                </Select>
              </FormControl>

              {/* Seleção condicional de destino */}
              {accessLevel !== 'global' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="destination-label" sx={{ color: '#b9bbbe' }}>
                    {accessLevel === 'discipline' ? 'Selecione a Disciplina' : 'Selecione a Sessão'}
                  </InputLabel>
                  <Select
                    labelId="destination-label"
                    value={selectedDestination || ''}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    label={accessLevel === 'discipline' ? 'Selecione a Disciplina' : 'Selecione a Sessão'}
                    sx={{
                      bgcolor: '#40444b',
                      color: '#ffffff',
                      '& .MuiSelect-icon': {
                        color: '#b9bbbe'
                      }
                    }}
                  >
                    {accessLevel === 'discipline' ? (
                      fileStructure.disciplines.map(discipline => (
                        <MenuItem key={discipline.id} value={discipline.id}>
                          {discipline.name}
                        </MenuItem>
                      ))
                    ) : (
                      fileStructure.disciplines.map(discipline => 
                        discipline.sessions.map(session => (
                          <MenuItem key={session.id} value={session.id}>
                            {`${discipline.name} - ${session.name}`}
                          </MenuItem>
                        ))
                      )
                    )}
                  </Select>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions sx={{ 
              borderTop: '1px solid #4f545c',
              padding: '16px 24px'
            }}>
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
                disabled={!uploadFile || (accessLevel !== 'global' && !selectedDestination)}
                variant="contained"
                sx={{
                  backgroundColor: '#5865F2',
                  '&:hover': {
                    backgroundColor: '#4752C4'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#40444b'
                  }
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