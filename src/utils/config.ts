import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';

export const config = {
  env: ENV,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/express_todos',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  gmailUser: process.env.GMAIL_USER,
  gmailPass: process.env.GMAIL_PASS,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5000',
  isProduction: ENV === 'development',
}; 