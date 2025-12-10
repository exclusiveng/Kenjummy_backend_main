import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { errorHandler, AppError } from './middleware/error.middleware';

// Route Imports
import authRouter from './routes/auth.routes';
import bookingRouter from './routes/booking.routes';
import userRouter from './routes/user.routes'
import { Logger } from './utils/logger';

const app: Express = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// Enable CORS with specific options for your frontend URL
if (!process.env.FRONTEND_URL) {
  Logger.warn('FRONTEND_URL not set. CORS may not work as expected in production.');
}

// Whitelist of allowed origins
const allowedOrigins = [
  'https://kenjummy.vercel.app',
  process.env.FRONTEND_URL, // Add your env var to the list
].filter(Boolean) as string[]; // Filter out undefined/null values

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like Postman, mobile apps, or curl)
    // and normalize the origin to remove trailing slashes for a robust check.
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : '';
    if (!origin || allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp()); // Prevent parameter pollution
app.use(xss()); // Data sanitization against XSS

// 1. Trust Proxy
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- API ROUTES ---
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/users', userRouter);

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});
// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is Running' });
});

// Test Error Route (Remove in production)
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError('Test error', 400));
});

// Handle Undefined Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  Logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
