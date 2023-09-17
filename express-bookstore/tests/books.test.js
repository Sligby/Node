process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app instance here
const expect = chai.expect;

chai.use(chaiHttp);

describe("Books API", () => {
    // Define a variable to store the created book's ISBN for testing
    let createdBookISBN;
  
    // Test GET /books
    describe("GET /books", () => {
      it("should return a list of books", (done) => {
        chai
          .request(app)
          .get("/books")
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("books").to.be.an("array");
            done();
          });
      });
    });
  
    // Test POST /books
    describe("POST /books", () => {
      it("should create a new book", (done) => {
        const newBook = {
          title: "Test Book",
          author: "Test Author",
          isbn: "1234567890",
        };
  
        chai
          .request(app)
          .post("/books")
          .send(newBook)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("book").to.be.an("object");
            expect(res.body.book).to.have.property("isbn");
            createdBookISBN = res.body.book.isbn; // Store the ISBN for later testing
            done();
          });
      });
    });
  
    // Test GET /books/:id
    describe("GET /books/:id", () => {
      it("should return a specific book", (done) => {
        chai
          .request(app)
          .get(`/api/books/${createdBookISBN}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("book").to.be.an("object");
            expect(res.body.book.isbn).to.equal(createdBookISBN);
            done();
          });
      });
    });
  
    // Test PUT /books/:isbn
    describe("PUT /books/:isbn", () => {
      it("should update a book", (done) => {
        const updatedBook = {
          title: "Updated Book Title",
        };
  
        chai
          .request(app)
          .put(`/books/${createdBookISBN}`)
          .send(updatedBook)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("book").to.be.an("object");
            expect(res.body.book.title).to.equal(updatedBook.title);
            done();
          });
      });
    });
  
    // Test DELETE /books/:isbn
    describe("DELETE /books/:isbn", () => {
      it("should delete a book", (done) => {
        chai
          .request(app)
          .delete(`/books/${createdBookISBN}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").to.equal("Book deleted");
            done();
          });
      });
    });
  });
  