import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const swaggerDocument = YAML.load('swagger.yaml');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', express.static(path.join(process.cwd())));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/redoc', redoc({
  title: 'Express Todos API Docs',
  specUrl: '/docs/swagger.yaml',
}));
app.get('/docs/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/x-yaml');
  res.sendFile(path.join(process.cwd(), 'swagger.yaml'));
});
app.get('/', (req, res) => {
  res.redirect('/redoc');
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

export default app; 