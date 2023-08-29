process.env.NODE_ENV = 'test';

const req = require('supertest');

const app = require('../listApp');
let items = require('../fakeDb');
const { request } = require('../listApp');

beforeEach(() => {
items.push({name: 'milk', price : 1.00})
});

afterEach(()=>{
    items.length = 0;
});

describe("GET /items", function(){
    test('Gets a list of items', async function(){
        const resp = await req(app).get('/items');
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({'items': [{"name": 'milk', "price": 1.00}]})
    })
})

describe("POST /items", ()=>{
    test("Creates a new item", async ()=>{
            const resp = await req(app)
            .post('/items')
            .send({
                name: "cream", price: 2.00
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            "added": {
                "name": "cream",
                "price": 2.00
            }
        })
    })
})

describe("Patch /items/:name", (done) => {
    const updatedItem = {
      name: 'new-popsicle',
      price: 2.00
    };

    request(app)
      .patch('/items/milk') 
      .send(updatedItem)
      .expect(200)
      .expect((res) => {
        res.body.updated.should.deepEqual(updatedItem);
      })
      .end(done);
  });

  it('should delete an existing item using DELETE', (done) => {
    request(app)
      .delete('/items/milk') 
      .expect(200)
      .expect((res) => {
        res.body.deleted.should.be.true();
      })
      .end(done);
  });