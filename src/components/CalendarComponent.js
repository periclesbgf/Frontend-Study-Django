import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  IconButton, 
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/api';
import '../styles/CalendarComponent.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>Anterior</button>
        <button type="button" onClick={goToCurrent}>Hoje</button>
        <button type="button" onClick={goToNext}>Próximo</button>
      </span>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbar.onView('month')}>Mês</button>
        <button type="button" onClick={() => toolbar.onView('week')}>Semana</button>
        <button type="button" onClick={() => toolbar.onView('day')}>Dia</button>
        <button type="button" onClick={() => toolbar.onView('agenda')}>Agenda</button>
      </span>
    </div>
  );
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    location: '', 
    start: '', 
    end: '' 
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const loadCalendarEvents = async () => {
    setLoading(true);
    try {
      const calendarEvents = await getCalendarEvents();
      const formattedEvents = calendarEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      showNotification('Erro ao carregar eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarEvents();
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEventId(null);
    setNewEvent({
      title: '',
      description: '',
      location: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEventId(null);
    setNewEvent({ title: '', description: '', location: '', start: '', end: '' });
    setConfirmDelete(false);
  };

  const handleAddEvent = async () => {
    if (!validateEventForm()) return;

    try {
      await createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        start_time: moment(newEvent.start).toDate(),
        end_time: moment(newEvent.end).toDate(),
        location: newEvent.location,
      });
      await loadCalendarEvents();
      handleCloseModal();
      showNotification('Evento criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      showNotification('Erro ao criar evento', 'error');
    }
  };

  const handleUpdateEvent = async () => {
    if (!validateEventForm()) return;

    try {
      await updateCalendarEvent(selectedEventId, {
        title: newEvent.title,
        description: newEvent.description,
        start_time: moment(newEvent.start).toISOString(),
        end_time: moment(newEvent.end).toISOString(),
        location: newEvent.location,
      });
      await loadCalendarEvents();
      handleCloseModal();
      showNotification('Evento atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      showNotification('Erro ao atualizar evento', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;

    try {
      await deleteCalendarEvent(selectedEventId);
      await loadCalendarEvents();
      handleCloseModal();
      showNotification('Evento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      showNotification('Erro ao excluir evento', 'error');
    }
  };

  const validateEventForm = () => {
    const { title, description, location, start, end } = newEvent;
    if (!title || !description || !location || !start || !end) {
      showNotification('Preencha todos os campos', 'error');
      return false;
    }
    if (moment(end).isBefore(moment(start))) {
      showNotification('A data final deve ser posterior à data inicial', 'error');
      return false;
    }
    return true;
  };

  const eventStyleGetter = (event) => {
    return {
      className: 'calendar-event',
      style: {
        backgroundColor: '#5865F2',
      }
    };
  };

  const CustomEventComponent = ({ event }) => (
    <Tooltip
      title={
        <div>
          <Typography variant="subtitle2">{event.title}</Typography>
          <Typography variant="body2">{event.description}</Typography>
          <Typography variant="body2">{event.location}</Typography>
          <Typography variant="body2">
            {moment(event.start).format('DD/MM/YYYY HH:mm')} - 
            {moment(event.end).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </div>
      }
      placement="top"
      arrow
    >
      <div className="calendar-event-content">
        <span>{event.title}</span>
      </div>
    </Tooltip>
  );

  return (
    <div className="calendar-wrapper">
      <Typography variant="h4" className="calendar-title">
        Calendário de Estudo
      </Typography>
      
      <div className="calendar-container">
        {loading ? (
          <div className="calendar-loading">
            <CircularProgress />
            <Typography>Carregando eventos...</Typography>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            selectable
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            step={30}
            timeslots={2}
            defaultDate={new Date()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh' }}
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
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEventComponent,
              toolbar: CustomToolbar
            }}
            messages={{
              today: 'Hoje',
              previous: 'Anterior',
              next: 'Próximo',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              agenda: 'Agenda',
              noEventsInRange: 'Não há eventos neste período',
              showMore: (total) => `+${total} mais`
            }}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        className="calendar-modal"
      >
        <Box className="modal-content">
          <div className="modal-header">
            <Typography variant="h6">
              {selectedEventId ? 'Editar Evento' : 'Novo Evento'}
            </Typography>
            <IconButton onClick={handleCloseModal} className="close-button">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="modal-body">
            <TextField
              fullWidth
              label="Título do Evento"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="modal-field"
              InputProps={{
                startAdornment: <EventIcon className="field-icon" />
              }}
            />

            <TextField
              fullWidth
              label="Descrição"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="modal-field"
              multiline
              rows={3}
              InputProps={{
                startAdornment: <DescriptionIcon className="field-icon" />
              }}
            />

            <TextField
              fullWidth
              label="Local"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="modal-field"
              InputProps={{
                startAdornment: <LocationIcon className="field-icon" />
              }}
            />

            <div className="datetime-fields">
              <TextField
                label="Início"
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                className="modal-field"
                InputProps={{
                  startAdornment: <TimeIcon className="field-icon" />
                }}
              />

              <TextField
                label="Fim"
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                className="modal-field"
                InputProps={{
                  startAdornment: <TimeIcon className="field-icon" />
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            {selectedEventId ? (
              <>
                {confirmDelete ? (
                  <div className="delete-confirmation">
                    <Typography variant="body2" color="error">
                      Confirma a exclusão?
                    </Typography>
                    <Button 
                      onClick={() => setConfirmDelete(false)}
                      className="cancel-button"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleDeleteEvent}
                      className="confirm-delete-button"
                    >
                      Confirmar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleUpdateEvent}
                      className="update-button"
                    >
                      Atualizar
                    </Button>
                    <Button
                      onClick={() => setConfirmDelete(true)}
                      className="delete-button"
                    >
                      Excluir
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Button
                onClick={handleAddEvent}
                className="add-button"
              >
                Adicionar
              </Button>
            )}
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          className="snackbar-alert"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CalendarComponent;
