import mongoose from 'mongoose';
import app from './app';
import { config } from './utils/config';

mongoose.connect(config.mongoUri)
  .then(() => {
    if (!config.isProduction) {
      console.log('Connected to MongoDB');
    }
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} [${config.env}]`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 