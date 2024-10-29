import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItem,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
  Collapse,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import { sendPrompt, getStudySessionById, getChatHistory, getStudyPlan } from '../services/api';
import '../styles/ChatPage.css';

import BotImage from '../assets/output_image.png';
import Sidebar from './Sidebar';

const ChatPage = () => {
  const { sessionId, disciplineId } = useParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [earliestTimestamp, setEarliestTimestamp] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [expandedSection, setExpandedSection] = useState('');
  const [isStudyPlanOpen, setIsStudyPlanOpen] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadSessionDetails = useCallback(async () => {
    try {
      const session = await getStudySessionById(sessionId);
      setSessionDetails(session);

      const initialMessages = await getChatHistory(sessionId, 10, null);
      if (initialMessages.length > 0) {
        setMessages(initialMessages);
        setEarliestTimestamp(initialMessages[0].timestamp);
        if (initialMessages.length < 10) setHasMore(false);
      } else {
        setMessages([{ role: 'assistant', content: `Bem-vindo à sessão ${sessionId}! Como posso ajudar você hoje?` }]);
        setHasMore(false);
      }
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao carregar os detalhes da sessão:', error);
    }
  }, [sessionId]);

  const loadStudyPlan = useCallback(async () => {
    if (!sessionId) return;
    
    setLoadingPlan(true);
    try {
      const response = await getStudyPlan(sessionId);
      
      // Mapeia os dados do plano para o formato esperado
      const mappedPlan = {
        title: response.disciplina,
        description: response.descricao,
        objective: response.objetivo_sessao,
        totalDuration: response.duracao_total,
        topics: response.plano_execucao.map(topic => ({
          title: topic.titulo,
          duration: topic.duracao,
          description: topic.descricao,
          progress: topic.progresso,
          subtopics: topic.conteudo.map((content, index) => ({
            title: content,
            completed: topic.progresso > (index + 1) * (100 / topic.conteudo.length)
          })),
          resources: topic.recursos,
          activity: topic.atividade
        }))
      };

      setStudyPlan(mappedPlan);
    } catch (error) {
      console.error('Erro ao carregar plano de estudos:', error);
    } finally {
      setLoadingPlan(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessionDetails();
    loadStudyPlan();
  }, [loadSessionDetails, loadStudyPlan]);

  const handleSendMessage = async () => {
    if ((!input.trim() && !file) || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      const response = await sendPrompt(sessionId, input, disciplineId, file);
      
      // Verifica se a resposta é uma imagem
      if (response && response.type === 'image') {
        const botMessage = {
          role: 'assistant',
          content: JSON.stringify(response)  // Mantém todo o objeto da imagem
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage = {
          role: 'assistant',
          content: response.response
        };
        setMessages(prev => [...prev, botMessage]);
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Ocorreu um erro. Tente novamente mais tarde.' },
      ]);
    } finally {
      setLoading(false);
      setInput('');
      scrollToBottom();
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const olderMessages = await getChatHistory(sessionId, 10, earliestTimestamp);
      if (olderMessages.length > 0) {
        setMessages(prev => [...olderMessages, ...prev]);
        setEarliestTimestamp(olderMessages[0].timestamp);
        if (olderMessages.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, sessionId, earliestTimestamp]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || loading || !hasMore) return;
    if (container.scrollTop === 0) loadMoreMessages();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !loading) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (content) => {
    try {
      // Tenta fazer parse do conteúdo como JSON
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Verifica se é uma mensagem com imagem
      if (parsedContent.type === 'image') {
        return (
          <Box className="message-with-image">
            <img 
              src={parsedContent.image} 
              alt="Imagem da resposta"
              className="response-image"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            />
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {parsedContent.content}
            </ReactMarkdown>
          </Box>
        );
      }
    } catch (e) {
      // Se não for JSON ou não for uma mensagem com imagem, renderiza como texto normal
    }

    // Renderização padrão para mensagens de texto
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const calculateProgress = () => {
    if (!studyPlan?.topics) return 0;
    
    let totalProgress = 0;
    studyPlan.topics.forEach(topic => {
      totalProgress += topic.progress || 0;
    });
    
    return Math.round(totalProgress / studyPlan.topics.length);
  };

  const StudyPlanPanel = () => (
    <>
      <Button
        className="study-plan-toggle"
        onClick={() => setIsStudyPlanOpen(!isStudyPlanOpen)}
        startIcon={isStudyPlanOpen ? <CloseIcon /> : <MenuBookIcon />}
      >
        {isStudyPlanOpen ? 'Fechar Plano' : 'Plano de Estudos'}
      </Button>

      <Paper className={`study-plan-panel ${isStudyPlanOpen ? 'open' : ''}`}>
        <div className="plan-header">
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBookIcon />
            Plano de Estudos
          </Typography>
          {studyPlan && (
            <Typography variant="subtitle2" sx={{ mt: 1, color: 'var(--text-secondary)' }}>
              {studyPlan.title}
            </Typography>
          )}
        </div>

        {loadingPlan ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : studyPlan ? (
          <div className="study-plan-content">
            <div className="progress-indicator">
              <Typography variant="body2">
                Progresso Total: {calculateProgress()}%
              </Typography>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateProgress()}%` }} 
                />
              </div>
            </div>

            <div className="plan-description">
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-secondary)' }}>
                {studyPlan.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'var(--text-secondary)' }}>
                <strong>Objetivo:</strong> {studyPlan.objective}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--text-secondary)' }}>
                Duração Total: {studyPlan.totalDuration}
              </Typography>
            </div>

            {studyPlan.topics?.map((topic, index) => (
              <div key={index} className="topic-item">
                <div 
                  className="topic-header"
                  onClick={() => setExpandedSection(
                    expandedSection === `topic-${index}` ? '' : `topic-${index}`
                  )}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    {topic.progress === 100 ? (
                      <CheckCircleIcon sx={{ color: 'var(--success-color)' }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: 'var(--text-secondary)' }} />
                    )}
                    <Box>
                      <Typography variant="subtitle1">
                        {topic.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                        {topic.duration}
                      </Typography>
                    </Box>
                  </Box>
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: expandedSection === `topic-${index}` ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>

                <Collapse in={expandedSection === `topic-${index}`}>
                  <div className="topic-content">
                    <Typography variant="body2" sx={{ p: 2, color: 'var(--text-secondary)' }}>
                      {topic.description}
                    </Typography>

                    <div className="subtopic-list">
                      {topic.subtopics?.map((subtopic, subIndex) => (
                        <div key={subIndex} className="subtopic-item">
                          {subtopic.completed ? (
                            <CheckCircleIcon 
                              fontSize="small" 
                              sx={{ color: 'var(--success-color)' }} 
                            />
                          ) : (
                            <RadioButtonUncheckedIcon 
                              fontSize="small" 
                              sx={{ color: 'var(--text-secondary)' }} 
                            />
                          )}
                          <Typography variant="body2" sx={{ 
                            color: subtopic.completed ? 
                              'var(--success-color)' : 
                              'var(--text-primary)'
                          }}>
                            {subtopic.title}
                          </Typography>
                        </div>
                      ))}
                    </div>

                    {topic.resources && topic.resources.length > 0 && (
                      <div className="resources-section">
                        <Typography variant="subtitle2" sx={{ p: 2, pb: 1 }}>
                          Recursos
                        </Typography>
                        {topic.resources.map((resource, resIndex) => (
                          <Typography 
                          key={resIndex} 
                          variant="body2" 
                          sx={{ pl: 3, color: 'var(--text-secondary)' }}
                        >
                          • {resource.tipo}: {resource.descricao}
                        </Typography>
                      ))}
                    </div>
                  )}

                  {topic.activity && (
                    <div className="activity-section">
                      <Typography variant="subtitle2" sx={{ p: 2, pb: 1 }}>
                        Atividade
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ pl: 3, color: 'var(--text-secondary)' }}
                      >
                        {topic.activity.descricao}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ pl: 3, display: 'block', mt: 1, color: 'var(--text-secondary)' }}
                      >
                        Tipo: {topic.activity.tipo}
                      </Typography>
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          ))}
        </div>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Typography>Nenhum plano de estudos encontrado</Typography>
        </Box>
      )}
    </Paper>
  </>
);

return (
  <div className="chat-page-container">
    <Sidebar />
    <div className="chat-content-wrapper">
      <div className="chat-page-content">
        <Box className="chat-container">
          <Typography variant="h5" className="chat-header">
            Chat da Sessão {sessionId} - Disciplina {disciplineId}
          </Typography>

          {sessionDetails && (
            <Box className="session-details">
              <Typography variant="subtitle1">
                Assunto: {sessionDetails.Assunto}
              </Typography>
            </Box>
          )}

          <Box
            className="chat-messages"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {hasMore && (
              <Box sx={{ textAlign: 'center', p: 1 }}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Button onClick={loadMoreMessages} variant="text" color="primary">
                    Carregar mais
                  </Button>
                )}
              </Box>
            )}

            {messages.map((msg, index) => (
              <ListItem
                key={index}
                className={`chat-message ${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <ListItemAvatar>
                    <Avatar src={BotImage} alt="Assistente" />
                  </ListItemAvatar>
                )}
                <Box className="message-content">
                  {renderMessageContent(msg.content)}
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box className="chat-input-container">
            {file && (
              <Chip
                label={file.name}
                onDelete={removeFile}
                color="primary"
                className="file-chip"
              />
            )}
            <Box className="chat-input-wrapper">
              <IconButton
                className="file-button"
                onClick={handleAttachClick}
                disabled={loading}
              >
                <AttachFileIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <TextField
                className="chat-input-field"
                variant="outlined"
                placeholder="Digite sua mensagem..."
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <Button
                className="send-button"
                variant="contained"
                onClick={handleSendMessage}
                disabled={loading}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
      <StudyPlanPanel />
    </div>

    <style jsx>{`
      .message-with-image {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      .response-image {
        object-fit: contain;
        background-color: #f5f5f5;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      }

      .response-image:hover {
        transform: scale(1.02);
        cursor: pointer;
      }

      .image-description {
        margin-top: 8px;
        color: var(--text-secondary);
      }
    `}</style>
  </div>
);
};

export default ChatPage;