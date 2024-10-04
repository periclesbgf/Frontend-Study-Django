// src/components/CalendarComponent.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../styles/CalendarComponent.css';  
import { getCalendarEvents } from '../services/api'; // Importing API function

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);  // State for storing events
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Function to load events from the backend
  const loadCalendarEvents = async () => {
    try {
      const calendarEvents = await getCalendarEvents();
      setEvents(calendarEvents);  // Update state with fetched events
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  // Load events when the component mounts
  useEffect(() => {
    loadCalendarEvents();
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewEvent({ title: '', start: '', end: '' });
  };

  const handleAddEvent = () => {
    if (!newEvent.title) return;

    const event = {
      title: newEvent.title,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    setEvents([...events, event]);  // Add the new event locally
    handleCloseModal();  // Close the modal
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>Calendário de Estudo</h2>
      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={events}  // Display the events from the backend
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          step={30}
          timeslots={2}
          defaultDate={new Date()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => alert(`${event.title}\nLocal: ${event.location}\nDescrição: ${event.description}`)}  // Display event details on click
        />
      </div>

      {/* Modal to add event */}
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
