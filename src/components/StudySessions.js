import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/StudySessions.css';  // Estilo para a exibição estilo Netflix

const StudySessions = () => {
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);  // Lista de disciplinas
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);  // Disciplina selecionada
  const [newDisciplineName, setNewDisciplineName] = useState('');  // Nome da nova disciplina
  const [newSessionName, setNewSessionName] = useState('');  // Nome da nova sessão
  const [newSessionSubject, setNewSessionSubject] = useState('');  // Assunto da nova sessão

  useEffect(() => {
    // Buscando disciplinas e sessões do backend
    const fetchDisciplines = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/disciplines`);  // Substitua pela rota real
        setDisciplines(response.data);
      } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
      }
    };

    fetchDisciplines();
  }, []);

  // Função para criar nova disciplina
  const createNewDiscipline = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/create_discipline`, {
        nome: newDisciplineName,
      });

      setDisciplines([...disciplines, response.data]);  // Atualizando a lista de disciplinas
      setNewDisciplineName('');  // Limpando o campo de criação
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
    }
  };

  // Função para criar nova sessão dentro de uma disciplina
  const createNewSession = async (disciplineId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/create_study_session`, {
        nome: newSessionName,
        assunto: newSessionSubject,
        disciplina_id: disciplineId,
      });

      // Atualizando a disciplina com a nova sessão
      const updatedDisciplines = disciplines.map(discipline =>
        discipline.id === disciplineId
          ? { ...discipline, sessions: [...discipline.sessions, response.data] }
          : discipline
      );

      setDisciplines(updatedDisciplines);
      setNewSessionName('');
      setNewSessionSubject('');
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error);
    }
  };

  return (
    <div className="study-sessions-container">
      <h1>Study Sessions por Disciplina</h1>

      <div className="discipline-list">
        {disciplines.map((discipline) => (
          <div key={discipline.id} className="discipline-section">
            <h2>{discipline.nome}</h2>

            <div className="sessions-grid">
              {/* Renderizando as sessões de estudo para cada disciplina */}
              {discipline.sessions.map((session, index) => (
                <div key={index} className="session-card" onClick={() => navigate(`/session/${session.id}`)}>
                  <h3>{session.nome}</h3>
                  <p>{session.assunto}</p>
                </div>
              ))}

              {/* Botão para adicionar nova sessão dentro da disciplina */}
              <div className="session-card new-session" onClick={() => setSelectedDiscipline(discipline.id)}>
                <FontAwesomeIcon icon={faPlus} size="3x" />
                <p>Nova Sessão</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulário para criar nova sessão de estudo */}
      {selectedDiscipline && (
        <div className="create-session-form">
          <h3>Criar Nova Sessão</h3>
          <input 
            type="text" 
            placeholder="Nome da Sessão" 
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Assunto" 
            value={newSessionSubject}
            onChange={(e) => setNewSessionSubject(e.target.value)}
          />
          <button onClick={() => createNewSession(selectedDiscipline)}>Criar Sessão</button>
          <button className="close-modal" onClick={() => setSelectedDiscipline(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Formulário para criar nova disciplina */}
      <div className="create-discipline-form">
        <h3>Criar Nova Disciplina</h3>
        <input 
          type="text" 
          placeholder="Nome da Disciplina" 
          value={newDisciplineName}
          onChange={(e) => setNewDisciplineName(e.target.value)}
        />
        <button onClick={createNewDiscipline}>Criar Disciplina</button>
      </div>
    </div>
  );
};

export default StudySessions;
