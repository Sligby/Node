const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()


// POST route to add a new industry
router.post('/industries', async (req, res, next) => {
    try {
      const { code, industry } = req.body;
  
      const query = {
        text: 'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *',
        values: [code, industry],
      };
  
      const result = await pool.query(query);
      const newIndustry = result.rows[0];
      res.status(201).json({ industry: newIndustry });
    } catch (err) {
      next(err);
    }
  });
  
  // GET route to list all industries with associated company codes
router.get('/industries', async (req, res, next) => {
    try {
      const query = 'SELECT i.code, i.industry, array_agg(ci.company_code) AS company_codes ' +
        'FROM industries AS i ' +
        'LEFT JOIN company_industries AS ci ON i.code = ci.industry_code ' +
        'GROUP BY i.code, i.industry';
  
      const result = await pool.query(query);
      const industries = result.rows;
      res.json({ industries });
    } catch (err) {
      next(err);
    }
  });
  
  // POST route to associate an industry with a company
router.post('/companies/:code/industries/:industryCode', async (req, res, next) => {
    try {
      const companyCode = req.params.code;
      const industryCode = req.params.industryCode;
  
      // Check if both the company and industry exist
      const companyQuery = 'SELECT code FROM companies WHERE code = $1';
      const industryQuery = 'SELECT code FROM industries WHERE code = $1';
  
      const [companyResult, industryResult] = await Promise.all([
        pool.query(companyQuery, [companyCode]),
        pool.query(industryQuery, [industryCode]),
      ]);
  
      if (companyResult.rows.length === 0 || industryResult.rows.length === 0) {
        throw new ExpressError('Company or industry not found', 404);
      }
  
      // Insert the association into the company_industries junction table
      const associationQuery = {
        text: 'INSERT INTO company_industries (company_code, industry_code) VALUES ($1, $2)',
        values: [companyCode, industryCode],
      };
  
      await pool.query(associationQuery);
  
      res.status(201).json({ status: 'associated' });
    } catch (err) {
      next(err);
    }
  });

  module.exports = router;
  