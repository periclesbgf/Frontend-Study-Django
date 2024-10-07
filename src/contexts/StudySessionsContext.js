// contexts/StudySessionsContext.js
import React, { createContext, useContext, useState } from 'react';

const StudySessionsContext = createContext();

export const StudySessionsProvider = ({ children }) => {
  const [studySessions, setStudySessions] = useState([]);

  return (
    <StudySessionsContext.Provider value={{ studySessions, setStudySessions }}>
      {children}
    </StudySessionsContext.Provider>
  );
};

export const useStudySessions = () => useContext(StudySessionsContext);
