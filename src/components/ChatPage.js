import React, { useState } from 'react';
import { sendPrompt } from '../services/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! How can I help you?' }]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }]);

    try {
      const response = await sendPrompt(input);
      setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: response.response }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setInput('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type a message" 
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
