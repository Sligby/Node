const request = require('supertest');
const app = require('../calc');

describe('GET /mode', () => {
  it('calculates the mode of numbers correctly', async () => {
    const response = await request(app).get('/mode?nums=1,2,2,3,4,4,4,5');
    expect(response.status).toBe(200);
    expect(response.body.operation).toBe('mode');
    expect(response.body.value).toBe('4');
  });

  it('handles missing nums query parameter', async () => {
    const response = await request(app).get('/mode');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('nums are required');
  });

  it('handles invalid numbers', async () => {
    const response = await request(app).get('/mode?nums=1,a,3,4');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Not a Number');
  });
});