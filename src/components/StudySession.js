// src/components/StudySession.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import Sidebar from './Sidebar';
import { getStudySessionById } from '../services/api';

const StudySession = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar a sessão de estudo
  const loadStudySession = async () => {
    setLoading(true);
    try {
      const response = await getStudySessionById(sessionId);
      if (response && response.study_session) {
        setSession(response.study_session);
      } else {
        console.error('Sessão de estudo não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar a sessão de estudo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="study-session-container">
      <Sidebar />
      <div className="study-session-content">
        {loading ? (
          <Typography variant="body1" align="center">
            Carregando sessão de estudo...
          </Typography>
        ) : session ? (
          <>
            <Typography variant="h4">{session.Assunto}</Typography>
            <Typography variant="body1">
              Início: {new Date(session.Inicio).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Fim: {new Date(session.Fim).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Produtividade: {session.Produtividade}
            </Typography>
            {/* Outros detalhes da sessão */}
          </>
        ) : (
          <Typography variant="body1" align="center">
            Sessão de estudo não encontrada.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default StudySession;
