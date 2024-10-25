// src/services/api.js

import axios from 'axios';

// Set your backend base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Helper function to handle token-related errors (e.g., redirect to login)
const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem('accessToken');  // Optionally clear token
    window.location.href = '/login';  // Redirect to login page
    throw new Error('Session expired. Please login again.');
  }
  throw error.response ? error.response.data : new Error("Network error");
};

// Function to register a new user (student or educator)
export const registerUser = async (nome, email, senha, tipo_usuario, special_code = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create_account`, {
      nome: nome,
      email: email,
      senha: senha,
      tipo_usuario: tipo_usuario,
      special_code: special_code,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to create account");
  }
};

export const recoverPassword = async (email) => {
  const response = await axios.post('/api/recover-password', { email });
  return response.data;
};

// Function for user login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: email,
      senha: password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to login");
  }
};


export const sendPrompt = async (sessionId, prompt, disciplineId, file = null) => {
  const token = getAuthToken();
  try {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('discipline_id', disciplineId);
    formData.append('message', prompt || '');

    if (file) {
      formData.append('file', file);
    }

    const response = await axios.post(
      `${API_BASE_URL}/chat`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in sendPrompt:', error);
    throw error.response ? error.response.data : new Error("Failed to send prompt");
  }
};

// Function to get chat history with pagination (Protected route)
export const getChatHistory = async (sessionId, limit = 10, before = null) => {
  const token = getAuthToken();
  try {
    const params = {
      limit: limit,
    };
    if (before) {
      params.before = before;
    }

    const response = await axios.get(
      `${API_BASE_URL}/chat_history/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      }
    );
    return response.data.messages;
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    throw error;
  }
};

// Function to send an SQL query (Protected route)
export const sendSQLQuery = async (question, code) => {
  const token = getAuthToken();  // Get the token from localStorage
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sql`,
      { question, code },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the JWT token
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);  // Handle token expiration or other auth errors
  }
};

// Function to send a route request (Protected route, optional file)
export const sendRouteRequest = async (question, code, file = null) => {
  const token = getAuthToken();  // Get the token from localStorage
  try {
    const formData = new FormData();
    formData.append('question', question);
    formData.append('code', code);
    if (file) formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/route`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the JWT token
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);  // Handle token expiration or other auth errors
  }
};

// Function to upload a file (Protected route)
// Agora aceita apenas o arquivo, pois o envio de mensagem está no sendPrompt
export const uploadFile = async (formData) => {
  const token = getAuthToken();  // Get the token from localStorage
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upload_file`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the JWT token
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);  // Handle token expiration or other auth errors
  }
};

// Get all study sessions
export const getStudySessions = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/study_sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.study_sessions;
  } catch (error) {
    handleAuthError(error);
  }
};

export const createStudySession = async (sessionData) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/study_sessions`,
      sessionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.new_session;
  } catch (error) {
    console.error('Erro ao criar sessão de estudo:', error);
    throw error;
  }
};

export const getStudySessionById = async (sessionId) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/study_sessions/session/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.study_session;
  } catch (error) {
    handleAuthError(error);
  }
};

// Update a study session
export const updateStudySession = async (sessionId, sessionData) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(`${API_BASE_URL}/study_sessions/${sessionId}`, sessionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.updated_session;
  } catch (error) {
    handleAuthError(error);
  }
};

// Delete a study session
export const deleteStudySession = async (sessionId) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_BASE_URL}/study_sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.message;
  } catch (error) {
    handleAuthError(error);
  }
};

export const uploadDisciplinePDF = async (file) => {
  const token = localStorage.getItem('accessToken');  // Obtém o token de autenticação
  const formData = new FormData();
  formData.append('file', file);  // Adiciona o arquivo ao FormData

  try {
    const response = await axios.post(`${API_BASE_URL}/create_discipline_from_pdf`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',  // Cabeçalho para enviar arquivos
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar PDF:', error);
    throw error;
  }
};

export const getCalendarEvents = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/calendar/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Map events to the structure required by the calendar
    const events = response.data.events.map((event) => ({
      id: event.IdEvento,
      title: event.Titulo,
      start: new Date(event.Inicio), // Convert datetime to JavaScript Date object
      end: new Date(event.Fim),
      description: event.Descricao,
      location: event.Local,
    }));

    return events;
  } catch (error) {
    handleAuthError(error);
  }
};

export const createCalendarEvent = async ({ title, description, start_time, end_time, location }) => {
  const token = getAuthToken();  // Get the token from localStorage

  try {
    const response = await axios.post(
      `${API_BASE_URL}/calendar/events`,
      {
        title,
        description,
        start_time: start_time.toISOString(), // Converter para o formato ISO 8601
        end_time: end_time.toISOString(),     // Converter para o formato ISO 8601
        location,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the JWT token
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);  // Handle token expiration or other auth errors
  }
};

export const updateCalendarEvent = async (eventId, { title, description, start_time, end_time, location }) => {
  const token = getAuthToken();
  console.log('Atualizando evento com os seguintes dados:', { title, description, start_time, end_time, location });

  try {
    const response = await axios.put(
      `${API_BASE_URL}/calendar/events/${eventId}`,
      { title, description, start_time, end_time, location },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
  }
};

// Função para deletar um evento no calendário
export const deleteCalendarEvent = async (eventId) => {
  const token = getAuthToken();

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/calendar/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Resposta do backend ao deletar evento:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    throw error; // Repassar o erro para ser tratado no handleDeleteEvent
  }
};

// GET all disciplines
export const getDisciplines = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/disciplines`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.disciplines;
  } catch (error) {
    handleAuthError(error);
  }
};

// POST - Create a new discipline
export const createDiscipline = async ({ nomeCurso, ementa, objetivos, educator }) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disciplines`,
      { nome_curso: nomeCurso, ementa, objetivos, educator },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// PUT - Update an existing discipline
export const updateDiscipline = async (disciplineId, { nomeCurso, ementa, objetivos }) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(
      `${API_BASE_URL}/disciplines/${disciplineId}`,
      { nome_curso: nomeCurso, ementa, objetivos },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// DELETE - Delete a discipline
export const deleteDiscipline = async (disciplineId) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_BASE_URL}/disciplines/${disciplineId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// GET all educators
export const getAllEducators = async () => {
  const token = getAuthToken(); // Obtém o token do armazenamento local
  try {
    const response = await axios.get(`${API_BASE_URL}/educators`, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token de autenticação
      },
    });
    return response.data; // Retorna os dados do response
  } catch (error) {
    console.error('Erro ao buscar educadores:', error);
    throw error;
  }
};

export const getStudySessionFromDiscipline = async (disciplineId) => {
  const token = getAuthToken(); // Obtém o token do localStorage
  try {
    const response = await axios.get(
      `${API_BASE_URL}/study_sessions/discipline/${disciplineId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token na requisição
        },
      }
    );
    return response.data.study_sessions; // Retorna as sessões de estudo
  } catch (error) {
    console.error('Erro ao buscar sessões de estudo:', error);
    handleAuthError(error); // Lida com erros de autenticação
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profiles`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formattedProfileData = {
      Percepcao: profileData.EstiloAprendizagem.Percepcao,
      Entrada: profileData.EstiloAprendizagem.Entrada,
      Processamento: profileData.EstiloAprendizagem.Processamento,
      Entendimento: profileData.EstiloAprendizagem.Entendimento,
    };

    const response = await axios.put(
      `${API_BASE_URL}/profiles`,
      formattedProfileData,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const getStudyPlan = async (sessionId) => {
  const token = getAuthToken(); 
  try {
    const response = await axios.get(`${API_BASE_URL}/study_plan/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};
