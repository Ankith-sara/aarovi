import request from 'supertest';
import app from '../server.js';

// Mock DB connection so tests don't need real MongoDB
jest.mock('../config/mongodb.js', () => jest.fn());
jest.mock('../config/cloudinary.js', () => jest.fn());

describe('Product API', () => {
    describe('GET /api/product/all', () => {
        it('should return 200 and a list of products', async () => {
            const res = await request(app).get('/api/product/all');
            expect(res.statusCode).toBeGreaterThanOrEqual(200);
            expect(res.statusCode).toBeLessThan(500);
        });
    });

    describe('POST /api/product/single', () => {
        it('should return 400 if productId is missing', async () => {
            const res = await request(app).post('/api/product/single').send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/product/add', () => {
        it('should return 401 if no auth token provided', async () => {
            const res = await request(app).post('/api/product/add').send({
                name: 'Test Product',
                price: 100,
                category: 'Kurta',
                subCategory: 'Men'
            });
            expect(res.statusCode).toBe(401);
        });
    });
});
