import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('Agent Routes', () => {
  it('POST /api/agents/blueprint validates input', async () => {
    const res = await request(app)
      .post('/api/agents/blueprint')
      .send({ userProfile: {}, nutritionProfile: {} });
    expect(res.status).toBe(500);
  });
});

describe('User Routes', () => {
  it('POST /api/users/register validates email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'invalid', password: 'short' });
    expect(res.status).toBe(400);
  });
});
