import request from 'supertest';
import app from '../src/app';

jest.setTimeout(30000);

describe('App', () => {
  it('should redirect / to /redoc', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/redoc');
  });

  it('should serve swagger.yaml', async () => {
    const res = await request(app).get('/docs/swagger.yaml');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toMatch(/yaml/);
    expect(res.text).toContain('openapi: 3.0.0');
  });
}); 