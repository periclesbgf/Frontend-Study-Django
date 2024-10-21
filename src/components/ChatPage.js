// app/frontend/src/components/ChatPage.js

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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  sendPrompt,
  getStudySessionById,
  getChatHistory,
} from '../services/api';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [earliestTimestamp, setEarliestTimestamp] = useState(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadSessionDetails = useCallback(async () => {
    try {
      const session = await getStudySessionById(sessionId);
      setSessionDetails(session);

      const initialMessages = await getChatHistory(sessionId, 10, null);
      if (initialMessages && initialMessages.length > 0) {
        setMessages(initialMessages);
        setEarliestTimestamp(initialMessages[0].timestamp);
        if (initialMessages.length < 10) {
          setHasMore(false);
        }
      } else {
        const welcomeMessage = [
          {
            role: 'assistant',
            content: `Bem-vindo à sessão ${sessionId}! Como posso ajudar você hoje?`,
          },
        ];
        setMessages(welcomeMessage);
        setHasMore(false);
      }
      setIsInitialLoad(false);
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao carregar os detalhes da sessão:', error);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessionDetails();
  }, [loadSessionDetails]);

  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;
    if (loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      setLoading(true);
      const response = await sendPrompt(sessionId, input, disciplineId, file);
      const botMessage = { role: 'assistant', content: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      scrollToBottom();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      scrollToBottom();
    } finally {
      setLoading(false);
      setInput(''); // Limpa o campo de input após envio
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const uploadingMessage = {
      role: 'user',
      content: `Uploading file: ${selectedFile.name}`,
    };
    setMessages((prevMessages) => [...prevMessages, uploadingMessage]);

    setFile(selectedFile);
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isInitialLoad) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad]);

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const olderMessages = await getChatHistory(sessionId, 10, earliestTimestamp);

      if (olderMessages && olderMessages.length > 0) {
        setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
        setEarliestTimestamp(olderMessages[0].timestamp);
        if (olderMessages.length < 10) {
          setHasMore(false);
        }
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

    if (container.scrollTop === 0) {
      loadMoreMessages();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !loading) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (content) => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={materialDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
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

  return (
    <div className="chat-page-container">
      <Sidebar className="sidebar" />
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
            sx={{
              overflowY: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {hasMore && (
              <Box sx={{ textAlign: 'center', padding: '10px' }}>
                {loading && <CircularProgress size={24} />}
                {!loading && (
                  <Button onClick={loadMoreMessages} disabled={loading}>
                    Carregar mais
                  </Button>
                )}
              </Box>
            )}
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                className={`chat-message ${
                  msg.role === 'user' ? 'user' : 'assistant'
                }`}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  padding: '8px 0',
                }}
              >
                {msg.role === 'assistant' && (
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: 40, height: 40 }}
                      src={BotImage}
                      alt="Assistente"
                    />
                  </ListItemAvatar>
                )}
                <Box
                  sx={{
                    backgroundColor: msg.role === 'user' ? '#1976d2' : '#e0e0e0',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '16px',
                  }}
                >
                  {renderMessageContent(msg.content)}
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box className="chat-input-container" sx={{ display: 'flex', padding: '10px' }}>
            <IconButton
              color="primary"
              component="span"
              onClick={handleAttachClick}
              sx={{ marginRight: '10px' }}
            >
              <AttachFileIcon />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx"
            />
            <TextField
              variant="outlined"
              placeholder="Digite uma mensagem..."
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
              disabled={loading} // Desabilita o input durante o envio
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={loading} // Desabilita o botão durante o envio
              sx={{ marginLeft: '10px' }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ChatPage;
