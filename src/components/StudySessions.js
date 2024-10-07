// src/components/StudySessions.js

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import Sidebar from './Sidebar';
import '../styles/StudySessions.css';
import { getStudySessionFromDiscipline } from '../services/api';

const StudySessions = () => {
  const { disciplineName } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar as sessões de estudo da disciplina
  const loadStudySessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStudySessionFromDiscipline(disciplineName);
      console.log('Dados das sessões:', response); // Para depuração

      if (response && response.study_sessions && response.study_sessions.length > 0) {
        setSessions(response.study_sessions);
      } else {
        console.error('Nenhuma sessão de estudo encontrada para esta disciplina.');
        setSessions([]); // Certifique-se de limpar o estado se não houver sessões
      }
    } catch (error) {
      console.error('Erro ao buscar sessões de estudo:', error);
    } finally {
      setLoading(false);
    }
  }, [disciplineName]);

  useEffect(() => {
    loadStudySessions();
  }, [loadStudySessions]);

  // Função para lidar com o clique na sessão de estudo
  const handleSessionClick = (sessionId) => {
    navigate(`/study_sessions/${encodeURIComponent(disciplineName)}/${sessionId}`);
  };

  return (
    <div className="study-sessions-container">
      <Sidebar />
      <div className="study-sessions-content">
        <Typography variant="h3" align="center" gutterBottom>
          Sessões de Estudo - {decodeURIComponent(disciplineName)}
        </Typography>

        <div className="session-list">
          {loading ? (
            <Typography variant="body1" align="center">
              Carregando sessões de estudo...
            </Typography>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <Card
                key={session.IdSessao}
                className="card"
                onClick={() => handleSessionClick(session.IdSessao)}
              >
                <CardContent className="card-content">
                  <Typography className="card-title">{session.Assunto}</Typography>
                  <Typography className="card-description">
                    Início: {new Date(session.Inicio).toLocaleString()}
                  </Typography>
                  <Typography className="card-description">
                    Fim: {new Date(session.Fim).toLocaleString()}
                  </Typography>
                  <Typography className="card-description">
                    Produtividade: {session.Produtividade}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" align="center">
              Nenhuma sessão de estudo encontrada.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySessions;
