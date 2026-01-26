import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/super-admin';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== STATISTICS ====================

export const getSystemOverview = async () => {
  const response = await axios.get(`${API_URL}/stats/overview`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// ==================== ADMIN MANAGEMENT ====================

export const getAllAdmins = async (page = 0, size = 20) => {
  const response = await axios.get(`${API_URL}/admins`, {
    params: { page, size },
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAdminById = async (id) => {
  const response = await axios.get(`${API_URL}/admins/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await axios.post(`${API_URL}/admins`, adminData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateAdmin = async (id, updates) => {
  const response = await axios.put(`${API_URL}/admins/${id}`, updates, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateAdminStatus = async (id, statusUpdate) => {
  const response = await axios.put(`${API_URL}/admins/${id}/status`, statusUpdate, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await axios.delete(`${API_URL}/admins/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async (page = 0, size = 20, search = '') => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { page, size, search },
    headers: getAuthHeader()
  });
  return response.data;
};

export const changeUserRole = async (id, role) => {
  const response = await axios.put(`${API_URL}/users/${id}/role`, { role }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export default {
  getSystemOverview,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
  getAllUsers,
  changeUserRole,
  deleteUser
};
