// src/components/CalendarComponent.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getCalendarEvents, createCalendarEvent } from '../services/api'; // Funções da API
import { CalendarToday } from '@mui/icons-material'; // Ícone do calendário
import '../styles/CalendarComponent.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); // Estado para armazenar eventos
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', start: '', end: '' });
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal

  // Função para carregar eventos do backend
  const loadCalendarEvents = async () => {
    try {
      const calendarEvents = await getCalendarEvents();
      setEvents(calendarEvents); // Atualiza o estado com os eventos carregados
    } catch (error) {
      console.error('Erro ao carregar os eventos do calendário:', error);
    }
  };

  // Carregar eventos ao montar o componente
  useEffect(() => {
    loadCalendarEvents();
  }, []);

  // Manipulador para selecionar um slot no calendário
  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
    });
    setModalOpen(true);
  };

  // Fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewEvent({ title: '', description: '', location: '', start: '', end: '' });
  };

  // Manipulador para adicionar um evento
  const handleAddEvent = async () => {
    const { title, description, location, start, end } = newEvent;
    if (!title || !description || !location || !start || !end) {
      alert('Por favor, preencha todos os campos antes de adicionar o evento.');
      return;
    }

    try {
      await createCalendarEvent({
        title,
        description,
        start_time: moment(start).toDate(),
        end_time: moment(end).toDate(),
        location,
      });
      loadCalendarEvents(); // Atualiza os eventos após criar um novo
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar novo evento:', error);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>Calendário de Estudo</h2>
      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={events} // Exibe os eventos carregados do backend
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          step={30}
          timeslots={2}
          defaultDate={new Date()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) =>
            setNewEvent({
              title: event.title,
              description: event.description,
              location: event.location,
              start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
              end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
            }) || setModalOpen(true)
          } // Exibe detalhes do evento ao clicar
          messages={{
            today: 'Hoje',
            previous: 'Anterior',
            next: 'Próximo',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
          }}
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
          <TextField
            fullWidth
            label="Descrição"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Local"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Início do Evento"
            type="datetime-local" lang="pt-BR"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fim do Evento"
            type="datetime-local" lang="pt-BR"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            margin="normal"
          />

          <Button variant="contained" color="primary" onClick={handleAddEvent} sx={{ mt: 2 }}>
            ADICIONAR
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
