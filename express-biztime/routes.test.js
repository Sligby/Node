const request = require('supertest');
const app = require('./your-express-app'); // Replace with the path to your Express app file

describe('Test Express routes', () => {
  it('GET /invoices should return a list of invoices', async () => {
    const res = await request(app).get('/invoices');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('invoices');
    expect(Array.isArray(res.body.invoices)).toBe(true);
  });

  it('GET /invoices/:id should return a specific invoice', async () => {
    const res = await request(app).get('/invoices/1'); // Replace with a valid invoice ID
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('invoice');
    // Add more specific assertions here based on your response format
  });

  it('POST /invoices should add a new invoice', async () => {
    const newInvoice = { comp_code: 'apple', amt: 100 };
    const res = await request(app)
      .post('/invoices')
      .send(newInvoice);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('invoice');
    // Add more specific assertions here based on your response format
  });

  it('PUT /invoices/:id should update an existing invoice', async () => {
    const updatedInvoice = { amt: 200 };
    const res = await request(app)
      .put('/invoices/1') 
      .send(updatedInvoice);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('invoice');
    // Add more specific assertions here based on your response format
  });

  it('DELETE /invoices/:id should delete an existing invoice', async () => {
    const res = await request(app).delete('/invoices/1');
    expect(res.status).toBe(200); // Assuming you return 200 on successful deletion
    expect(res.body).toEqual({ status: 'deleted' });
  });

  it('GET /companies/:code should return company information with invoices', async () => {
    const res = await request(app).get('/companies/apple');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('company');
    // Add more specific assertions here based on your response format
  });

  it('GET /companies/:code should return a 404 for a non-existent company', async () => {
    const res = await request(app).get('/companies/INVALID'); // Replace with a non-existent company code
    expect(res.status).toBe(404);
  });
});