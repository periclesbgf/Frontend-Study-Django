import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faFolder, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/HomeStudent.css';
import StudySessions from './StudySessions';

const HomeStudent = () => {
  const [page, setPage] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [events, setEvents] = useState([
    { date: new Date(2024, 8, 20), name: 'Prova de Matemática', type: 'prova' },
    { date: new Date(2024, 8, 21), name: 'Atividade de Física', type: 'atividade' },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState('atividade');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);  // Evento selecionado ao clicar na data
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (pageName) => {
    setPage(pageName);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  // Função chamada ao clicar em uma data no calendário
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const eventForDate = events.find(event => new Date(event.date).toDateString() === date.toDateString());
    setSelectedEvent(eventForDate || null);  // Exibe detalhes se houver um evento
    setShowEventForm(!eventForDate);  // Se não houver evento, exibe formulário para adicionar
  };

  // Função para adicionar novo evento
  const addNewEvent = () => {
    if (!newEventName) return;
    
    setEvents([...events, { date: selectedDate, name: newEventName, type: newEventType }]);
    setNewEventName('');
    setNewEventType('atividade');
    setShowEventForm(false);
  };

  // Função para renderizar cores de eventos no calendário
  const renderEventMarker = ({ date, view }) => {
    const eventForDate = events.find(event => new Date(event.date).toDateString() === date.toDateString());
    if (view === 'month' && eventForDate) {
      const eventColor = eventForDate.type === 'prova' ? 'red' : 'blue';  // Define cor do evento
      return (
        <div className="event-marker" style={{ backgroundColor: eventColor }}>
          📅
        </div>
      );
    }
    return null;
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <div>
            <h2>Bem-vindo ao Eden AI!</h2>
            <h3>Seu calendário</h3>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={renderEventMarker}  // Marca os dias com eventos no calendário
              className="custom-calendar"
            />

            {/* Exibe o formulário para adicionar eventos se não houver eventos no dia */}
            {showEventForm && (
              <div className="event-form">
                <h4>Adicionar evento para {selectedDate.toLocaleDateString()}</h4>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Nome do evento"
                />
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                >
                  <option value="atividade">Atividade</option>
                  <option value="prova">Prova</option>
                </select>
                <button onClick={addNewEvent}>Adicionar Evento</button>
              </div>
            )}

            {/* Exibe detalhes do evento se houver um evento na data */}
            {selectedEvent && (
              <div className="event-details">
                <h4>Evento em {selectedDate.toLocaleDateString()}</h4>
                <p><strong>Nome:</strong> {selectedEvent.name}</p>
                <p><strong>Tipo:</strong> {selectedEvent.type === 'prova' ? 'Prova' : 'Atividade'}</p>
              </div>
            )}
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      case 'study_session':
        return <StudySessions />;
      case 'workplace':
        return <Workplace />;
      default:
        return <h2>Bem-vindo ao Eden AI!</h2>;
    }
  };

  return (
    <div className="home-student">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '>' : '<'} {/* Botão para expandir/retrair */}
        </button>
        {!isCollapsed && <h3>Menu</h3>}
        <button onClick={() => handleNavigation('home')}>
          {isCollapsed ? <FontAwesomeIcon icon={faHome} className="icon" /> : <span><FontAwesomeIcon icon={faHome} className="icon" /> Home</span>}
        </button>
        <button onClick={() => handleNavigation('dashboard')}>
          {isCollapsed ? <FontAwesomeIcon icon={faChartBar} className="icon" /> : <span><FontAwesomeIcon icon={faChartBar} className="icon" /> Dashboard</span>}
        </button>
        <button onClick={() => handleNavigation('study_session')}>
          {isCollapsed ? <FontAwesomeIcon icon={faFolder} className="icon" /> : <span><FontAwesomeIcon icon={faFolder} className="icon" /> Study Session</span>}
        </button>
        <button onClick={() => handleNavigation('workplace')}>
          {isCollapsed ? <FontAwesomeIcon icon={faFolder} className="icon" /> : <span><FontAwesomeIcon icon={faFolder} className="icon" /> Workplace</span>}
        </button>
        <hr />
        <button onClick={handleLogout}>
          {isCollapsed ? <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> : <span><FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" /> Logout</span>}
        </button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Here you can view your progress and statistics.</p>
  </div>
);

const Workplace = () => (
  <div>
    <h2>Workplace</h2>
    <p>This is the workplace page.</p>
  </div>
);

export default HomeStudent;
