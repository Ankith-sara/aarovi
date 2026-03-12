import request from 'supertest';
import app from '../server.js';

jest.mock('../config/mongodb.js', () => jest.fn());
jest.mock('../config/cloudinary.js', () => jest.fn());

describe('Order API', () => {
    describe('POST /api/order/place', () => {
        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app).post('/api/order/place').send({
                items: [{ _id: 'abc', price: 100 }],
                amount: 150,
                address: { firstName: 'Test' }
            });
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/order/status/:orderId', () => {
        it('should handle invalid orderId gracefully', async () => {
            const res = await request(app).get('/api/order/status/invalid-id');
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});
