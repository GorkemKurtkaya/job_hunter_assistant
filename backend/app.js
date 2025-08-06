import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import jobApplicationRoutes from './routes/jobApplicationRoute.js';

const app = express();
dotenv.config();

app.use(cors({
    origin: function (origin, callback) {
      // LinkedIn ve localhost'a izin ver
      const allowedOrigins = [
        'http://localhost:3000',
        'https://www.linkedin.com',
        'chrome-extension://'
      ];
      
      // Origin null olabilir (extension'dan gelen istekler için)
      if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/job-applications', jobApplicationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});