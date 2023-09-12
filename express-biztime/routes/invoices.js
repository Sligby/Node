const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()
const db = require('../db')
const datetime = require('node-datetime')


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
  
 // PUT route to update an existing invoice by ID and handle paying/un-paying
router.put('/invoices/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { amt, paid } = req.body;

    const querySelect = {
      text: 'SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1',
      values: [id],
    };

    const selectResult = await pool.query(querySelect);

    if (selectResult.rows.length === 0) {
      throw new ExpressError('Invoice not found', 404);
    }

    const invoice = selectResult.rows[0];
    let updatedPaidDate;

    if (paid === true && invoice.paid === false) {
      // Paying an unpaid invoice: set paid_date to today
      updatedPaidDate = new Date();
    } else if (paid === false && invoice.paid === true) {
      // Un-paying a paid invoice: set paid_date to null
      updatedPaidDate = null;
    } else {
      // Keep the current paid_date for other cases
      updatedPaidDate = invoice.paid_date;
    }

    const queryUpdate = {
      text: 'UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING *',
      values: [amt, paid, updatedPaidDate, id],
    };

    const updateResult = await pool.query(queryUpdate);

    const updatedInvoice = updateResult.rows[0];
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