const request = require('supertest');
const app = require('../calc'); 

describe('GET /median', () => {
  it('calculates the median of numbers correctly', async () => {
    const response = await request(app).get('/median?nums=1,2,3,4,5');
    expect(response.status).toBe(200);
    expect(response.body.operation).toBe('median');
    expect(response.body.value).toBe(3);
  });

  it('handles missing nums query parameter', async () => {
    const response = await request(app).get('/median');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('nums are required');
  });

  it('handles invalid numbers', async () => {
    const response = await request(app).get('/median?nums=1,a,3,4');
    expect(response.status).toBe(400);
  });
});