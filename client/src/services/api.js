import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000/api/v1/analyzer';

export const fetchDashboardData = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
        console.error('Error fetching dashboard data:', error);
        throw error;
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server');
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('Error setting up request');
      throw new Error('Error setting up request');
    }
  }
};

export const fetchFilterOptions = async () => {
  try {
    const [archdeaconries, parishes, congregations] = await Promise.all([
      axios.get(`${API_BASE_URL}/archdeaconries/`),
      axios.get(`${API_BASE_URL}/parishes/`),
      axios.get(`${API_BASE_URL}/congregations/`)
    ]);
    return {
      archdeaconries: archdeaconries.data,
      parishes: parishes.data.map(p => ({
        ...p,
        archdeaconry_id: p.archdeaconry // Ensure consistent field name
      })),
      congregations: congregations.data.map(c => ({
        ...c,
        parish_id: c.parish // Ensure consistent field name
      }))
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

export const fetchArchdeaconries = async () => {
  return axios.get(`${API_BASE_URL}/archdeaconries/`);
};

export const fetchParishesByArchdeaconry = async (archdeaconryId) => {
  return axios.get(`${API_BASE_URL}/parishes/`, {
    params: { archdeaconry_id: archdeaconryId }
  });
};

export const fetchCongregationsByArchdeaconry = async (parishIds) => {
  return axios.get(`${API_BASE_URL}/congregations/by_archdeaconry/`, {
    params: { parish_ids: parishIds.join(',') }
  });
};

export const fetchCongregationsByParish = async (parishId) => {
  return axios.get(`${API_BASE_URL}/congregations/`, {
    params: { parish_id: parishId }
  });
};

export const fetchTableData = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/records/`, {
      params: filters
    });
    return {
      data: response.data.data,
      total: response.data.total
    };
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};
