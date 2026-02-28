import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration and forbidden access
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            if (error.response?.status === 401) {
                // Handle unauthorized (e.g., token expired)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (error.response?.status === 403) {
                // Handle forbidden (e.g., account pending approval, role mismatch)
                // This prevents infinite loops or broken components when the API rejects ABAC/RBAC
                window.location.href = '/pending-approval';
            }
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    adminLogin: (data: any) => api.post('/auth/admin/login', data),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export const adminApi = {
    getStats: () => api.get('/admin/stats'),
    getAllUsers: () => api.get('/admin/users'),
    getPendingUsers: () => api.get('/admin/users/pending'),
    approveUser: (userId: string) => api.post(`/admin/users/${userId}/approve`),
    unauthorizeUser: (userId: string) => api.post(`/admin/users/${userId}/unauthorize`),
    rejectUser: (userId: string) => api.post(`/admin/users/${userId}/reject`),
    deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
    getAlerts: () => api.get('/admin/security/alerts'),
    resolveAlert: (alertId: string) => api.post(`/admin/security/alerts/${alertId}/resolve`),
    getAnomalyLogs: () => api.get('/admin/anomalies'),
    getAuditLogs: () => api.get('/admin/audit'),
};

export const doctorApi = {
    getPatients: () => api.get('/doctors/patients'),
    addPrescription: (data: { patientId: string; medication: string; dosage: string }) =>
        api.post('/doctors/prescriptions', data),
    uploadLab: (data: { patientId: string; reportUrl: string }) =>
        api.post('/doctors/labs', data),
};

export const patientApi = {
    getProfile: (patientId: string) => api.get(`/patients/${patientId}/profile`),
    getLabs: (patientId: string) => api.get(`/patients/${patientId}/labs`),
    getPrescriptions: (patientId: string) => api.get(`/patients/${patientId}/prescriptions`),
};
