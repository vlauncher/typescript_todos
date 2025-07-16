import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Todo from '../src/models/Todo';
import jwt from 'jsonwebtoken';
import { config } from '../src/utils/config';

jest.mock('../src/utils/mailer', () => ({
  sendMail: jest.fn().mockResolvedValue(undefined),
}));

jest.setTimeout(30000);

const testUser = {
  first_name: 'Todo',
  last_name: 'Tester',
  email: 'todouser@example.com',
  password: 'Password123',
};

let token = '';
let userId = '';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.mongoUri);
  }
  await User.deleteMany({ email: testUser.email });
  await Todo.deleteMany({});
  const user = await User.create({ ...testUser, is_verified: true });
  userId = user._id.toString();
  token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1d' });
});
afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await Todo.deleteMany({});
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Todos Routes', () => {
  let todoId = '';

  it('should create a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Todo' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    todoId = res.body._id;
  });

  it('should get all todos', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Todo', completed: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Todo');
    expect(res.body.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should return 404 for non-existent todo', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
}); 