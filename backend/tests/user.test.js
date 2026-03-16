import request from 'supertest';
import app from '../server.js';

jest.mock('../config/mongodb.js', () => jest.fn());
jest.mock('../config/cloudinary.js', () => jest.fn());

describe('User API', () => {
  describe('POST /api/user/send-otp', () => {
    it('should return 400 if email is invalid', async () => {
      const res = await request(app).post('/api/user/send-otp').send({
        email: 'not-an-email',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/user/send-otp').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/user/verify-otp', () => {
    it('should return 400 if OTP is not 6 digits', async () => {
      const res = await request(app).post('/api/user/verify-otp').send({
        email: 'test@example.com',
        otp: '123',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/user/verify-otp').send({
        otp: '123456',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if OTP field is missing', async () => {
      const res = await request(app).post('/api/user/verify-otp').send({
        email: 'test@example.com',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/user/google-signin', () => {
    it('should return 400 if credential is missing', async () => {
      const res = await request(app).post('/api/user/google-signin').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
