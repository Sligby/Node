const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()
const db = require('../db')


router.get('/', async (req, res, next) => {
    try{
        const rez = await db.query(`SELECT * FROM companies`)
        if(!rez) throw new  ExpressError('No Response', 404)
        return res.json({companies: rez.rows})
    }catch(err){
        next(err)
    }
})

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
        const { code, name, description }= req.query
        const rez = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`
        , [code, name, description]);
        return res.status(201).json({company : rez.rows})
    } catch (error) {
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