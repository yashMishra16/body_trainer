import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/setup';
    }
    return Promise.reject(error);
  },
);

export interface UserProfile {
  age: number;
  gender: string;
  fitnessLevel: string;
  goals: string[];
  availableDays: number;
  equipmentAccess: string;
  injuries?: string[];
}

export interface NutritionProfile {
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goals: string[];
  dietType: string;
  allergies?: string[];
}

// Agent API calls
export const agentApi = {
  generateBlueprint: (data: { userProfile: UserProfile; nutritionProfile: NutritionProfile; userId?: string }) =>
    api.post('/api/agents/blueprint', data),

  runTrainingAgent: (userProfile: UserProfile) =>
    api.post('/api/agents/training', userProfile),

  runSkippingAgent: (data: { userProfile: UserProfile; gymSchedule?: Record<string, string> }) =>
    api.post('/api/agents/skipping', data),

  runNutritionAgent: (nutritionProfile: NutritionProfile) =>
    api.post('/api/agents/nutrition', nutritionProfile),

  runRecoveryAgent: (userProfile: UserProfile) =>
    api.post('/api/agents/recovery', userProfile),

  runMindsetAgent: (userProfile: UserProfile) =>
    api.post('/api/agents/mindset', userProfile),
};

// User API calls
export const userApi = {
  register: (data: { email: string; password: string; name: string; [key: string]: unknown }) =>
    api.post('/api/users/register', data),

  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),

  getProfile: (userId: string) =>
    api.get(`/api/users/profile/${userId}`),

  updateProfile: (userId: string, data: Partial<UserProfile>) =>
    api.put(`/api/users/profile/${userId}`, data),
};

// Progress API calls
export const progressApi = {
  logProgress: (data: {
    userId: string;
    weightKg?: number;
    bodyFatPercentage?: number;
    measurements?: Record<string, number>;
    notes?: string;
    energyLevel?: number;
    sleepHours?: number;
  }) => api.post('/api/progress', data),

  getHistory: (userId: string, params?: { limit?: number; startDate?: string; endDate?: string }) =>
    api.get(`/api/progress/${userId}`, { params }),

  getSummary: (userId: string) =>
    api.get(`/api/progress/${userId}/summary`),
};

export default api;
