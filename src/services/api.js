// src/services/api.js

import axios from 'axios';
import { useState } from 'react';

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

    // Get the actual response content
    const responseData = response.data.response;
    
    // If response is a string, try to parse it as JSON
    if (typeof responseData === 'string') {
      try {
        const parsedResponse = JSON.parse(responseData);
        
        // Handle multimodal response (text + image)
        if (parsedResponse.type === 'multimodal') {
          return {
            type: 'multimodal',
            content: parsedResponse.content,
            image: parsedResponse.image
          };
        }
        
        // If it's not a multimodal response, return the parsed content
        return {
          type: 'text',
          content: parsedResponse
        };
      } catch (e) {
        // If parsing fails, it's probably plain text
        return {
          type: 'text',
          content: responseData
        };
      }
    }
    
    // Handle direct object responses
    if (responseData && typeof responseData === 'object') {
      if (responseData.type === 'multimodal') {
        return {
          type: 'multimodal',
          content: responseData.content,
          image: responseData.image
        };
      } else if (responseData.type === 'image') {
        return {
          type: 'image',
          content: responseData.content,
          image: responseData.image
        };
      }
    }

    // Default case: return the entire response data
    return {
      type: 'text',
      content: response.data
    };

  } catch (error) {
    console.error('Error in sendPrompt:', error);
    throw error.response ? error.response.data : new Error("Failed to send prompt");
  }
};

export const updateTopicProgress = async (sessionId, topicId, progress) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sessions/${sessionId}/topics/${topicId}/progress`,
      { progress },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in updateTopicProgress:', error);
    throw error.response ? error.response.data : new Error("Failed to update topic progress");
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

// Upload discipline from PDF with additional data
export const uploadDisciplinePDF = async ({
  file,
  studyShift,
  classStartTime,
  classEndTime
}) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('turno_estudo', studyShift);
  formData.append('horario_inicio', classStartTime);
  formData.append('horario_fim', classEndTime);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/create_discipline_from_pdf`,
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

export const getDiscipline = async (disciplineId) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/disciplines/${disciplineId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // O backend agora retorna os dados diretamente no response.data
    const disciplineData = response.data;
    console.log('Dados recebidos da API:', disciplineData);

    // Format the response data with all available fields
    return {
      id: disciplineData.IdCurso,
      name: disciplineData.discipline_name, // Ajustado para corresponder ao retorno do backend
      syllabus: disciplineData.Ementa,
      objectives: disciplineData.Objetivos,
      classStartTime: disciplineData.HorarioInicio,
      classEndTime: disciplineData.HorarioFim,
      createdAt: disciplineData.CriadoEm,
      educatorId: disciplineData.IdEducador,
      educatorName: disciplineData.NomeEducador
    };
  } catch (error) {
    console.error('Erro na requisição da disciplina:', error);
    console.error('Detalhes do erro:', error.response?.data);
    handleAuthError(error);
    throw error;
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
    
    // Mapeia os dados da resposta para incluir os novos campos
    const disciplines = response.data.disciplines.map(discipline => ({
      ...discipline,
      // Garante que os campos existam mesmo se não estiverem na resposta
      studyShift: discipline.turno_estudo || 'manha',
      classStartTime: discipline.horario_inicio || '08:00',
      classEndTime: discipline.horario_fim || '10:00'
    }));

    return disciplines;
  } catch (error) {
    handleAuthError(error);
  }
};
// POST - Create a new discipline
export const createDiscipline = async ({ 
  nomeCurso, 
  ementa, 
  objetivos, 
  professorId, 
  studyShift,
  classStartTime,
  classEndTime 
}) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disciplines`,
      {
        nome_curso: nomeCurso,
        ementa,
        objetivos,
        professor_id: professorId,
        turno_estudo: studyShift,
        horario_inicio: classStartTime,
        horario_fim: classEndTime
      },
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
export const updateDiscipline = async (disciplineId, {
  nomeCurso,
  ementa,
  objetivos,
  professorId,
  studyShift,
  classStartTime,
  classEndTime
}) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(
      `${API_BASE_URL}/disciplines/${disciplineId}`,
      {
        nome_curso: nomeCurso,
        ementa,
        objetivos,
        professor_id: professorId,
        turno_estudo: studyShift,
        horario_inicio: classStartTime,
        horario_fim: classEndTime
      },
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

// Função para criar um plano de estudo automático
export const createAutomaticStudyPlan = async (disciplineId, { session_id, descricao, duracao, periodo }) => {
  const token = getAuthToken(); // Obtém o token do localStorage
  try {
    const response = await axios.post(
      `${API_BASE_URL}/study_plan/auto`,
      {
        disciplina: disciplineId,
        session_id: session_id,
        tema: descricao,
        duracao_desejada: duracao,
        periodo: periodo, // Inclui o período de estudo (manhã, tarde ou noite)
        objetivos: [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao gerar plano automático:', error);
    handleAuthError(error); // Lida com erros de autenticação
    throw error; // Repassa o erro para ser tratado onde for necessário
  }
};


export const getSessionsWithoutPlan = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/study_plan/sessions/without_plan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the complete response
  } catch (error) {
    console.error('Erro ao buscar sessões sem plano:', error);
    handleAuthError(error);
    throw error;
  }
};

export const uploadMaterial = async (file, accessLevel, disciplineId = null, sessionId = null) => {
  const token = getAuthToken();
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('access_level', accessLevel);
    if (disciplineId) formData.append('discipline_id', disciplineId);
    if (sessionId) formData.append('session_id', sessionId);

    const response = await axios.post(
      `${API_BASE_URL}/workspace/upload`,
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
    throw error.response?.data || new Error('Erro ao fazer upload do material');
  }
};

export const getMaterials = async (disciplineId = null, sessionId = null) => {
  const token = getAuthToken();
  try {
    const params = {};
    if (disciplineId) params.discipline_id = disciplineId;
    if (sessionId) params.session_id = sessionId;

    const response = await axios.get(
      `${API_BASE_URL}/workspace/materials`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Erro ao carregar materiais');
  }
};

export const updateMaterialAccess = async (materialId, accessLevel, disciplineId = null, sessionId = null) => {
  const token = getAuthToken();
  try {
    const data = {
      access_level: accessLevel,
      discipline_id: disciplineId,
      session_id: sessionId
    };

    const response = await axios.put(
      `${API_BASE_URL}/workspace/material/${materialId}/access`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Erro ao atualizar acesso do material');
  }
};

export const deleteMaterial = async (materialId) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/workspace/material/${materialId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Erro ao remover material');
  }
};

export const getMaterialContent = async (materialId) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/workspace/material/${materialId}/content`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Erro ao carregar conteúdo do material');
  }
};