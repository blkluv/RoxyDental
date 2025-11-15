import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Import database
import { prisma } from './config/database';

// Import routes
import routes from './routes';

// Import middleware
import { errorHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// PENTING: Body parser harus sebelum routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG MIDDLEWARE (Hapus setelah testing)
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    contentType: req.headers['content-type']
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoxyDental API is running' });
});

// Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});