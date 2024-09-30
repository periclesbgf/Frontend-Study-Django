import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../styles/CalendarComponent.css';  // Vamos utilizar uma folha de estilos separada

// Configurando o localizador com moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  // Eventos fictícios
  const [events, setEvents] = useState([
    { title: 'Prova de Matemática', start: new Date(2024, 8, 20, 10, 0, 0), end: new Date(2024, 8, 20, 12, 0, 0) },
    { title: 'Atividade de Física', start: new Date(2024, 8, 21, 14, 0, 0), end: new Date(2024, 8, 21, 16, 0, 0) },
    { title: 'Sessão de Estudo', start: new Date(2024, 8, 22, 9, 0, 0), end: new Date(2024, 8, 22, 11, 0, 0) },
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Função para abrir o modal e adicionar evento
  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewEvent({ title: '', start: '', end: '' });
  };

  // Adicionar evento
  const handleAddEvent = () => {
    if (!newEvent.title) return;

    const event = {
      title: newEvent.title,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    setEvents([...events, event]);  // Adiciona evento ao estado
    handleCloseModal();  // Fecha o modal
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>Calendário de Estudo</h2>
      <div className="calendar-container"> {/* Aplicando classe de estilo */}
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}  // Adicionando visualizações
          step={30}  // Configura os intervalos de tempo (30 minutos)
          timeslots={2}  // Mostra dois blocos de 30 minutos por hora
          defaultDate={new Date()}  // Data padrão de visualização
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => alert(event.title)}  // Exibe o nome do evento ao clicar
        />
      </div>

      {/* Modal para adicionar evento */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Adicionar Evento</h2>
          <TextField
            fullWidth
            label="Título do Evento"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddEvent}>
            Adicionar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
