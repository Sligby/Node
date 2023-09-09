const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()
const db = require('../db')


router.get('/', async (req, res, next) => {
    try {
      const query = 'SELECT id, comp_code FROM invoices';
      const result = await pool.query(query);
  
      const invoices = result.rows;
      res.json({ invoices });
    } catch (err) {
      next(err);
    }
  });
  
  // GET route to retrieve a specific invoice by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const query = {
        text: 'SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description ' +
          'FROM invoices AS i ' +
          'JOIN companies AS c ON i.comp_code = c.code ' +
          'WHERE i.id = $1',
        values: [id],
      };
  
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        throw new ExpressError('Invoice not found', 404);
      }
  
      const invoice = result.rows[0];
      res.json({ invoice });
    } catch (err) {
      next(err);
    }
  });
  
  // POST route to add a new invoice
  router.post('/', async (req, res, next) => {
    try {
      const { comp_code, amt } = req.body;
  
      const query = {
        text: 'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *',
        values: [comp_code, amt],
      };
  
      const result = await pool.query(query);
  
      const newInvoice = result.rows[0];
      res.status(201).json({ invoice: newInvoice });
    } catch (err) {
      next(err);
    }
  });
  
  // PUT route to update an existing invoice by ID
  router.put('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const { amt } = req.body;
  
      const query = {
        text: 'UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *',
        values: [amt, id],
      };
  
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        throw new ExpressError('Invoice not found', 404);
      }
  
      const updatedInvoice = result.rows[0];
      res.json({ invoice: updatedInvoice });
    } catch (err) {
      next(err);
    }
  });
  
  // DELETE route to delete an invoice by ID
  router.delete('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const query = {
        text: 'DELETE FROM invoices WHERE id = $1',
        values: [id],
      };
  
      const result = await pool.query(query);
  
      if (result.rowCount === 0) {
        throw new ExpressError('Invoice not found', 404);
      }
  
      res.json({ status: 'deleted' });
    } catch (err) {
      next(err);
    }
  });
  
  // Update the GET route for companies to include invoice information
  router.get('/companies/:code', async (req, res, next) => {
    try {
      const code = req.params.code;
  
      const query = {
        text: 'SELECT code, name, description FROM companies WHERE code = $1',
        values: [code],
      };
  
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        throw new ExpressError('Company not found', 404);
      }
  
      const company = result.rows[0];
  
      const invoicesQuery = {
        text: 'SELECT id FROM invoices WHERE comp_code = $1',
        values: [code],
      };
  
      const invoicesResult = await pool.query(invoicesQuery);
      const invoices = invoicesResult.rows.map((row) => row.id);
  
      company.invoices = invoices;
  
      res.json({ company });
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;