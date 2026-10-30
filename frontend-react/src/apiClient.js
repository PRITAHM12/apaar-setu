import axios from 'axios';

export const NODE_API_BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL || 'https://apaar-node-api.onrender.com';

export const PYTHON_ENGINE_BASE_URL =
  import.meta.env.VITE_PYTHON_ENGINE_URL || 'https://apaar-python-engine.onrender.com';

export const nodeApiClient = axios.create({
  baseURL: NODE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pythonApiClient = axios.create({
  baseURL: PYTHON_ENGINE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
