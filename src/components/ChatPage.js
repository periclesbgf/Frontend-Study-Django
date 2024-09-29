import React, { useState } from 'react';
import { sendPrompt } from '../services/api';

const ChatPage = ({ sessionId }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: `Welcome to session ${sessionId}! How can I help you?` }]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return; // Ignorar envio de mensagens vazias
    setMessages([...messages, { role: 'user', content: input }]);

    try {
      const response = await sendPrompt(input);
      setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: response.response }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setInput(''); // Limpar o campo de entrada após enviar a mensagem
  };

  // Adiciona o evento de teclado para detectar "Enter"
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita quebra de linha no input
      handleSendMessage(); // Envia a mensagem
    }
  };

  return (
    <div>
      <h1>Chat for Session {sessionId}</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}  // Evento de teclado para Enter
        placeholder="Type a message"
        rows={3}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px' }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
