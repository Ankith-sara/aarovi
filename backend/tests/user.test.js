import request from 'supertest';
import app from '../server.js';

jest.mock('../config/mongodb.js', () => jest.fn());
jest.mock('../config/cloudinary.js', () => jest.fn());

describe('User API', () => {
    describe('POST /api/user/login', () => {
        it('should return 400 if email is invalid', async () => {
            const res = await request(app).post('/api/user/login').send({
                email: 'not-an-email',
                password: 'password123'
            });
            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app).post('/api/user/login').send({
                email: 'test@example.com',
                password: ''
            });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/user/register', () => {
        it('should return 400 if name is too short', async () => {
            const res = await request(app).post('/api/user/register').send({
                name: 'A',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if password is too short', async () => {
            const res = await request(app).post('/api/user/register').send({
                name: 'Alice',
                email: 'test@example.com',
                password: '123'
            });
            expect(res.statusCode).toBe(400);
        });
    });
});
