import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './database/connection';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDatabase();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Body Trainer API running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
