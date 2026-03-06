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
                // Let the components handle 403 or rely on ProtectedRoute
                console.warn("Access forbidden (403):", error.response.data?.message);
            }
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    adminLogin: (data: any) => api.post('/auth/admin/login', data),
    getMe: () => api.get('/auth/me'),
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
    getConfig: () => api.get('/admin/config'),
    updateConfig: (data: any) => api.patch('/admin/config', data),
};

export const doctorApi = {
    getPatients: () => api.get('/doctors/patients'),
    getPatientReports: (patientId: string) => api.get(`/doctors/patients/${patientId}/reports`),
    addPrescription: (data: { patientId: string; medication: string; dosage: string }) =>
        api.post('/doctors/prescriptions', data),
    uploadLab: (data: { patientId: string; reportUrl: string }) =>
        api.post('/doctors/labs', data),
};

export const labApi = {
    getPatients: () => api.get('/lab/patients'),
    uploadReport: (data: { patientId: string; reportUrl: string }) =>
        api.post('/lab/upload', data),
};

export const patientApi = {
    getProfile: (patientId: string) => api.get(`/patients/${patientId}/profile`),
    getLabs: (patientId: string) => api.get(`/patients/${patientId}/labs`),
    getPrescriptions: (patientId: string) => api.get(`/patients/${patientId}/prescriptions`),
    getAssignedDoctors: (patientId: string) => api.get(`/patients/${patientId}/doctors`),
    getDashboardData: (patientId: string) => api.get(`/patients/${patientId}/dashboard`),
};

export const triageApi = {
    getSymptoms: () => api.get('/triage/symptoms'),
    getQuestions: (symptomId: string) => api.get(`/triage/questions/${symptomId}`),
    evaluate: (data: { symptomId: string; answers: string[] }) => api.post('/triage/evaluate', data),
    getHistory: () => api.get('/triage/history'),
};

export const appointmentApi = {
    book: (data: any) => api.post('/appointments/book', data),
    getHistory: () => api.get('/appointments/history'),
    getPatientAppointments: (patientId: string) => api.get(`/appointments/patient/${patientId}`),
};
