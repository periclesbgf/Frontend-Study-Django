// src/components/CalendarComponent.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/api';
import '../styles/CalendarComponent.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); // Estado para armazenar eventos
  const [selectedEventId, setSelectedEventId] = useState(null); // Armazena o ID do evento selecionado
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
    setSelectedEventId(null); // Limpa o ID do evento selecionado
    setNewEvent({
      title: '',
      description: '',
      location: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
    });
    setModalOpen(true);
  };

  // Fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEventId(null);
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

  // Manipulador para atualizar um evento
  const handleUpdateEvent = async () => {
    const { title, description, location, start, end } = newEvent;
    if (!title || !description || !location || !start || !end) {
      alert('Por favor, preencha todos os campos antes de atualizar o evento.');
      return;
    }
  
    try {
      console.log('Atualizando evento com os seguintes dados:', {
        title,
        description,
        start,
        end,
        location,
      });
  
      // Garantir que o ID do evento está definido
      if (!selectedEventId) {
        console.error('Erro: ID do evento não definido.');
        return;
      }
  
      await updateCalendarEvent(selectedEventId, {
        title,
        description,
        start_time: moment(start).toISOString(), // Converter para ISO 8601
        end_time: moment(end).toISOString(), // Converter para ISO 8601
        location,
      });
      loadCalendarEvents(); // Atualiza os eventos após editar um evento
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };


  const handleDeleteEvent = async () => {
    if (!selectedEventId) {
      console.error('Erro: Nenhum evento selecionado para deletar.');
      return;
    }

    try {
      console.log(`Tentando deletar evento com ID: ${selectedEventId}`);
      await deleteCalendarEvent(selectedEventId);
      loadCalendarEvents(); // Atualiza os eventos após deletar um evento
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar o evento. Verifique o console para mais detalhes.');
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
          style={{ height: '70vh', maxHeight: '800px', minHeight: '400px' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            setSelectedEventId(event.id);
            setNewEvent({
              title: event.title,
              description: event.description,
              location: event.location,
              start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
              end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
            });
            setModalOpen(true);
          }}
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

      {/* Modal para adicionar/editar evento */}
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
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <h2>{selectedEventId ? 'Editar Evento' : 'Adicionar Evento'}</h2>
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
            type="datetime-local"
            lang="pt-BR"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fim do Evento"
            type="datetime-local"
            lang="pt-BR"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            margin="normal"
          />

          {selectedEventId ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateEvent} sx={{ mt: 2, mr: 2 }}>
                ATUALIZAR
              </Button>
              <Button variant="contained" color="secondary" onClick={handleDeleteEvent} sx={{ mt: 2 }}>
                DELETAR
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleAddEvent} sx={{ mt: 2 }}>
              ADICIONAR
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CalendarComponent;