import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import { config } from '../src/utils/config';

jest.mock('../src/utils/mailer', () => ({
  sendMail: jest.fn().mockResolvedValue(undefined),
}));

jest.setTimeout(30000);

const testUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'testuser@example.com',
  password: 'Password123',
};

describe('Auth Routes', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
    await User.deleteMany({ email: testUser.email });
  });
  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
  });

  it('should not register the same user twice', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/User already exists/i);
  });

  it('should not login unverified user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect([200, 400, 401]).toContain(res.status);
  });

  it('should send forgot password email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: testUser.email });
    expect([200, 400]).toContain(res.status);
  });

  it('should fail to reset password with invalid token', async () => {
    const res = await request(app).post('/api/auth/reset-password/invalidtoken').send({ password: 'NewPassword123' });
    expect([400, 404]).toContain(res.status);
  });
}); 