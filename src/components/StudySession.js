import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, Header, Icon } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import '../styles/StudySession.css';
import { getStudySessionFromDiscipline } from '../services/api'; // Atualizando a função importada

const StudySession = () => {
  const { disciplineId, sessionId } = useParams(); // Pega os IDs da disciplina e sessão
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSessionDetails = async () => {
      setLoading(true);
      const sessions = await getStudySessionFromDiscipline(disciplineId); // Buscando todas as sessões da disciplina
      const selectedSession = sessions.study_sessions.find(session => session.id === sessionId); // Encontrando a sessão específica
      setSessionDetails(selectedSession);
      setLoading(false);
    };
    loadSessionDetails();
  }, [disciplineId, sessionId]);

  if (loading) {
    return <Loader active inline="centered" />;
  }

  if (!sessionDetails) {
    return <p>Nenhum detalhe encontrado para esta sessão.</p>;
  }

  return (
    <div className="study-session-container">
      <Sidebar />
      <div className="study-session-content">
        <Header as="h2">
          <Icon name="book" />
          <Header.Content>{sessionDetails.nome}</Header.Content>
        </Header>
        <p>{sessionDetails.descricao}</p>
      </div>
    </div>
  );
};

export default StudySession;
