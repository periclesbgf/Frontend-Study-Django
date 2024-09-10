// src/components/StudySessions.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudySessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([
    { name: "Math Study Session", date: "2024-09-09", status: "Completed" },
    { name: "Physics Study Session", date: "2024-09-08", status: "In Progress" }
  ]);

  const createNewSession = () => {
    const newSessionName = `Session-${Date.now()}`;
    navigate(`/session/${newSessionName}`);
  };

  return (
    <div>
      <h1>Study Sessions</h1>
      {sessions.map((session, index) => (
        <div key={index}>
          <h3>{session.name}</h3>
          <p>{session.date}</p>
          <p>{session.status}</p>
        </div>
      ))}
      <button onClick={createNewSession}>Start New Session</button>
    </div>
  );
};

export default StudySessions;
