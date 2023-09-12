const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()
const db = require('../db')
const slugify = require('slugify')

// GET route to view details for a company and list its associated industries
app.get('/companies/:code', async (req, res, next) => {
    try {
      const code = req.params.code;
  
      const query = {
        text: 'SELECT c.code, c.name, c.description, array_agg(i.industry) AS industries ' +
          'FROM companies AS c ' +
          'LEFT JOIN company_industries AS ci ON c.code = ci.company_code ' +
          'LEFT JOIN industries AS i ON ci.industry_code = i.code ' +
          'WHERE c.code = $1 ' +
          'GROUP BY c.code',
        values: [code],
      };
  
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        throw new ExpressError('Company not found', 404);
      }
  
      const company = result.rows[0];
      res.json({ company });
    } catch (err) {
      next(err);
    }
  });
  

router.get('/:code', async (req, res, next)=>{
 
     try{
        const { code } = req.query;
         const rez = await db.query(`SELECT * FROM companies WHERE code = $1 `, [code])
          if(!rez) throw new ExpressError('Item Not Found', 404)
        return res.json({company : rez.rows})
 
         }
     catch(err){
         return next(err)
     }
 });


router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Generate a slugified code from the company name
        const code = slugify(name, { lower: true });
      
        // Check if a company with the generated code already exists
        const existingCompany = companies.find((company) => company.code === code);
        if (existingCompany) {
          return res.status(400).json({ error: 'Company with this code already exists' });
        }
      
        const newCompany = { code, name, description };
        companies.push(newCompany);
      
        res.status(201).json({ company: newCompany });
      }
      
        // const { code, name, description }= req.query
        // const rez = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`
        // , [code, name, description]);
        // return res.status(201).json({company : rez.rows})
    catch (error) {
        return next(error)
    }
})

router.patch('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name , description } = req.body;
        const rez = await db.query(`UPDATE companies SET name=$1, description= $2 WHERE code = $3 RETURNING 
        id, name, description`, [name, description])
        return res.send({company : rez.rows[0]})
    } catch (error) {
        return next(error)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const rez= db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code])
        return res.send({status : deleted})
    } catch (error) {
        return next(error)
    }
})
module.exports = router;