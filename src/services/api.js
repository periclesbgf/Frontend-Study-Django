import axios from 'axios';

// Set your backend base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
export const registerUser = async (nome, email, senha, tipo_usuario) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create_account`, {
      nome: nome,
      email: email,
      senha: senha,
      tipo_usuario: tipo_usuario,
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

// Function to send a prompt to the chatbot (Protected route)
export const sendPrompt = async (prompt, code) => {
  const token = getAuthToken();  // Get the token from localStorage
  try {
    const response = await axios.post(
      `${API_BASE_URL}/prompt`,
      { question: prompt, code: code },
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
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);  // Handle token expiration or other auth errors
  }
};

// Function to upload a file (Protected route)
export const uploadFile = async (question, code, file) => {
  const token = getAuthToken();  // Get the token from localStorage
  try {
    const formData = new FormData();
    formData.append('question', question);
    formData.append('code', code);
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/upload_file`,
      formData,
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

