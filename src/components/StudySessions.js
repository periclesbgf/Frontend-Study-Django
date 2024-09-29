import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Segment, Header, Card, Grid, Button, Icon, Modal, Form } from 'semantic-ui-react';
import '../styles/StudySessions.css';

const StudySessions = () => {
  const navigate = useNavigate();

  // Disciplinas e sessões fictícias para visualização
  const [disciplines, setDisciplines] = useState([
    {
      id: 1,
      nome: 'Matemática',
      sessions: [
        { id: 101, nome: 'Estudo de Álgebra', assunto: 'Álgebra avançada' },
        { id: 102, nome: 'Geometria', assunto: 'Figuras e formas' },
      ],
    },
    {
      id: 2,
      nome: 'Física',
      sessions: [
        { id: 201, nome: 'Mecânica Clássica', assunto: 'Leis de Newton' },
        { id: 202, nome: 'Termodinâmica', assunto: 'Transferência de calor' },
      ],
    },
    {
      id: 3,
      nome: 'História',
      sessions: [
        { id: 301, nome: 'História Antiga', assunto: 'Civilizações egípcias' },
        { id: 302, nome: 'História Moderna', assunto: 'Revolução Industrial' },
      ],
    },
  ]);

  const [selectedDiscipline, setSelectedDiscipline] = useState(null);  // Disciplina selecionada
  const [newSessionName, setNewSessionName] = useState('');  // Nome da nova sessão
  const [newSessionSubject, setNewSessionSubject] = useState('');  // Assunto da nova sessão
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openDisciplineModal, setOpenDisciplineModal] = useState(false);
  const [newDisciplineName, setNewDisciplineName] = useState('');  // Nome da nova disciplina

  // Função para criar uma nova disciplina
  const createNewDiscipline = () => {
    const newDiscipline = {
      id: disciplines.length + 1,
      nome: newDisciplineName,
      sessions: [],
    };
    setDisciplines([...disciplines, newDiscipline]);  // Adiciona a nova disciplina
    setNewDisciplineName('');
    setOpenDisciplineModal(false);  // Fecha o modal após a criação
  };

  // Função para criar nova sessão dentro de uma disciplina
  const createNewSession = (disciplineId) => {
    const newSession = {
      id: Math.floor(Math.random() * 1000),  // Gera um ID aleatório para a nova sessão
      nome: newSessionName,
      assunto: newSessionSubject,
    };

    // Atualiza a disciplina específica com a nova sessão
    const updatedDisciplines = disciplines.map(discipline =>
      discipline.id === disciplineId
        ? { ...discipline, sessions: [...discipline.sessions, newSession] }
        : discipline
    );

    setDisciplines(updatedDisciplines);
    setNewSessionName('');
    setNewSessionSubject('');
    setSelectedDiscipline(null);
    setOpenSessionModal(false);  // Fecha o modal após a criação
  };

  // Função para redirecionar para a página de StudySession
  const handleSessionClick = (sessionId) => {
    navigate(`/study-session/${sessionId}`);
  };

  return (
    <Segment className="study-sessions-container">
      <Header as="h1" textAlign="center">Sessões de Estudo por Disciplina</Header>

      <div className="discipline-actions">
        <Button color="green" onClick={() => setOpenDisciplineModal(true)}>
          <Icon name="plus" /> Nova Disciplina
        </Button>
      </div>

      {disciplines.map((discipline) => (
        <Segment key={discipline.id} className="discipline-section">
          <Header as="h2" className="discipline-header">{discipline.nome}</Header>

          <Grid className="sessions-grid" doubling columns={3}>
            {/* Renderizando as sessões de estudo como cards para cada disciplina */}
            {discipline.sessions.map((session, index) => (
              <Grid.Column key={index}>
                <Card className="session-card" onClick={() => handleSessionClick(session.id)}>
                  <Card.Content>
                    <Card.Header>{session.nome}</Card.Header>
                    <Card.Meta>{session.assunto}</Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}

            {/* Botão para adicionar nova sessão dentro da disciplina */}
            <Grid.Column>
              <Card className="new-session-card" onClick={() => {
                setSelectedDiscipline(discipline.id);
                setOpenSessionModal(true);
              }}>
                <Card.Content textAlign="center">
                  <Icon name="plus" size="huge" />
                  <Card.Description>Nova Sessão</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </Segment>
      ))}

      {/* Modal para criar nova sessão de estudo */}
      <Modal
        open={openSessionModal}
        onClose={() => setOpenSessionModal(false)}
        size="small"
      >
        <Header icon="book" content="Criar Nova Sessão" />
        <Modal.Content>
          <Form>
            <Form.Input
              label="Nome da Sessão"
              placeholder="Nome da Sessão"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <Form.Input
              label="Assunto"
              placeholder="Assunto"
              value={newSessionSubject}
              onChange={(e) => setNewSessionSubject(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpenSessionModal(false)}>
            <Icon name="remove" /> Cancelar
          </Button>
          <Button color="green" onClick={() => createNewSession(selectedDiscipline)}>
            <Icon name="checkmark" /> Criar Sessão
          </Button>
        </Modal.Actions>
      </Modal>

      {/* Modal para criar nova disciplina */}
      <Modal
        open={openDisciplineModal}
        onClose={() => setOpenDisciplineModal(false)}
        size="small"
      >
        <Header icon="book" content="Criar Nova Disciplina" />
        <Modal.Content>
          <Form>
            <Form.Input
              label="Nome da Disciplina"
              placeholder="Nome da Disciplina"
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpenDisciplineModal(false)}>
            <Icon name="remove" /> Cancelar
          </Button>
          <Button color="green" onClick={createNewDiscipline}>
            <Icon name="checkmark" /> Criar Disciplina
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};

export default StudySessions;
