// src/components/ChatPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendPrompt, getStudySessionById } from '../services/api';
import '../styles/ChatPage.css';

import BotImage from '../assets/output_image.png';
import Sidebar from './Sidebar';

const ChatPage = () => {
  const { sessionId, disciplineId } = useParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Função para buscar os detalhes da sessão
  const loadSessionDetails = async () => {
    try {
      const session = await getStudySessionById(sessionId);
      setSessionDetails(session);

      // Se houver um histórico de conversa, carregar as mensagens
      if (session.HistoricoConversa && session.HistoricoConversa.length > 0) {
        setMessages(session.HistoricoConversa);
      } else {
        // Mensagem inicial
        setMessages([
          {
            role: 'assistant',
            content: `Bem-vindo à sessão ${sessionId}! Como posso ajudar você hoje?`,
          },
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar os detalhes da sessão:', error);
    }
  };

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      setInput('');
      const response = await sendPrompt(input);
      const botMessage = { role: 'assistant', content: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Opcional: Atualizar o histórico da conversa no backend
      // await updateStudySessionHistory(sessionId, [...messages, userMessage, botMessage]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // Função para rolar até o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page-container">
      <Sidebar className="sidebar" /> {/* Adicione esta classe */}
      <div className="chat-page-content">
        <Box className="chat-container">
          <Typography variant="h5" className="chat-header">
            Chat da Sessão {sessionId} - Disciplina {disciplineId}
          </Typography>

          {/* Exibir detalhes da sessão, se disponíveis */}
          {sessionDetails && (
            <Box className="session-details">
              <Typography variant="subtitle1">
                Assunto: {sessionDetails.Assunto}
              </Typography>
              {/* Outros detalhes podem ser adicionados aqui */}
            </Box>
          )}

          <Box className="chat-messages">
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                className={`chat-message ${
                  msg.role === 'user' ? 'user' : 'assistant'
                }`}
                sx={{
                  display: 'flex',
                  justifyContent:
                    msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  padding: 0,
                }}
              >
                {msg.role === 'assistant' && (
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      src={BotImage}
                      alt="Assistente"
                    />
                  </ListItemAvatar>
                )}
                <Box
                  sx={{
                    backgroundColor: msg.role === 'user' ? '#000' : '#e0e0e0',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '90%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '16px',
                    marginLeft: msg.role === 'user' ? 'auto' : '0',
                    marginRight: msg.role === 'user' ? '0' : 'auto',
                  }}
                >
                  {msg.content}
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box className="chat-input-container">
            <TextField
              variant="outlined"
              placeholder="Digite uma mensagem..."
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              className="chat-send-button"
              onClick={handleSendMessage}
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
