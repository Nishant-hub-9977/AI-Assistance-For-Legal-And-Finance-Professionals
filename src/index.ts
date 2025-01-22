import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import complianceRoutes from './routes/compliance';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/compliance', complianceRoutes);
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});