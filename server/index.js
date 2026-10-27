import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRoutes from './routes/health.js';
import materialsRoutes from './routes/materials.js';
import quizzesRoutes from './routes/quizzes.js';
import progressRoutes from './routes/progress.js';
import studyPlanRoutes from './routes/studyPlan.js';
import tutorRoutes from './routes/tutor.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware in dev
app.use((req, res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api', materialsRoutes);
app.use('/api', quizzesRoutes);
app.use('/api', progressRoutes);
app.use('/api', studyPlanRoutes);
app.use('/api', tutorRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
    timestamp: new Date().toISOString()
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`EduPilot AI Backend Server running`);
    console.log(`Port: ${config.port}`);
    console.log(`Mode: ${config.nodeEnv}`);
    console.log(`Demo Mode: ${config.demoMode ? 'ENABLED' : 'DISABLED'}`);
    console.log(`Health: http://localhost:${config.port}/api/health`);
    console.log(`=========================================`);
  });
}

export default app;
