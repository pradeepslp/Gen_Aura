import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS - support multiple origins (dev + production)
const allowedOrigins = [
    'http://localhost:3000',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : [])
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like curl, Postman, or mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: origin ${origin} not allowed`));
        }
    },
    credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Limit requests from same API
const limiter = rateLimit({
    max: 100, // 100 requests
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Basic Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Welcome to SecureCare API' });
});

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

// Routes will be added here
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Handle unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Can't find ${req.originalUrl} on this server!` });
});

// Global Error Handling Middleware
app.use(errorHandler);

export default app;
