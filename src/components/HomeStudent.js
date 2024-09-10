// src/components/HomeStudent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeStudent = () => {
  const [page, setPage] = useState('home');
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // Handle navigation between pages
  const handleNavigation = (pageName) => {
    setPage(pageName);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  // Render different pages based on the current selected page
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <h2>Welcome to Eden AI!</h2>;
      case 'dashboard':
        return <Dashboard />;
      case 'study_session':
        return <StudySession />;
      default:
        return <h2>Welcome to Eden AI!</h2>;
    }
  };

  return (
    <div className="home-student">
      <div className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => handleNavigation('home')}>Home</button>
        <button onClick={() => handleNavigation('dashboard')}>Dashboard</button>
        <button onClick={() => handleNavigation('study_session')}>Study Session</button>
        <hr />
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Here you can view your progress and statistics.</p>
    </div>
  );
};

const StudySession = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! How can I help you?' }]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('accessToken');

  const handleSendMessage = async () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }]);

    try {
      const response = await fetch('http://localhost:8000/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: input,
          code: 'your_code', // Replace with actual code
        })
      });
      const data = await response.json();
      setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setInput('');
  };

  return (
    <div>
      <h2>Study Session</h2>
      <div>
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

export default HomeStudent;
