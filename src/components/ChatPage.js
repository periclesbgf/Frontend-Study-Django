import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Avatar, ListItemAvatar, ListItem } from '@mui/material'; 
import SendIcon from '@mui/icons-material/Send';
import { sendPrompt } from '../services/api';
import Sidebar from './Sidebar';  // Importando o componente Sidebar
import '../styles/ChatPage.css'; // Importando o CSS

// Importando a imagem do robô
import BotImage from '../assets/output_image.png';  // Ajuste o caminho para sua pasta

const ChatPage = ({ sessionId }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Welcome to session ${sessionId}! How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await sendPrompt(input);
      const botMessage = { role: 'assistant', content: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { role: 'assistant', content: 'Error occurred. Please try again later.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

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
    <div className="home-student">
      {/* Incluindo o Sidebar */}
      <Sidebar />

      <Box className="chat-container">
        <Typography variant="h5" className="chat-header">
          Chat for Session {sessionId}
        </Typography>

        <Box className="chat-messages">
          {messages.map((msg, index) => (
            <ListItem 
              key={index} 
              className={`chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
              sx={{ alignItems: 'flex-start' }}
            >
              {msg.role === 'assistant' && (
                <ListItemAvatar>
                  <Avatar src={BotImage} alt="Assistant Bot" />
                </ListItemAvatar>
              )}
              <Box
                sx={{
                  backgroundColor: msg.role === 'user' ? '#0084ff' : '#e0e0e0',
                  color: msg.role === 'user' ? '#fff' : '#000',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  fontSize: '16px',
                  marginLeft: msg.role === 'user' ? 'auto' : '10px',
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
            placeholder="Type a message..."
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
  );
};

export default ChatPage;
