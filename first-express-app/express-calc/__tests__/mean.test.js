const request = require('supertest');
const app = require('../calc'); 

describe('GET /mean', () => {
  it('calculates the mean of numbers correctly', async () => {
    const response = await request(app).get('/mean?nums=1,2,3,4');
    expect(response.status).toBe(200);
    expect(response.body.operation).toBe('mean');
    expect(response.body.value).toBe(2.5);
  });

  it('handles missing nums query parameter', async () => {
    const response = await request(app).get('/mean');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('nums are required');
  });

  it('handles invalid numbers', async () => {
    const response = await request(app).get('/mean?nums=1,a,3,4');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Not a Number');
  });
});