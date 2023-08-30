const express = require('express')
const ExpressError = require('./expressError')
const router = new express.Router()
const items = require('./fakeDb')


router.get('/', (req, res) =>{
    try{
        if(!items){
            throw new ExpressError('List Not Found', 404)
        }
        res.json({items : items})
    }
    catch(err){
        next(err)
    }
})

router.post('/', (req, res) => {
    const newItem = req.body;
    try{ 
        if(!newItem){
            throw new ExpressError('No Item Submitted!', 404)
        }
        else{
            items.push(newItem);
  
            res.status(201).json({
                added: newItem
            });
        }
    }
    catch(err){
        next(err)
    }
});

router.get('/:name', (req, res)=>{
   const itemName = req.params.name;
   const item = list.find(item=> item.name === itemName);

    try{
        if(!item){
            throw new ExpressError('Item Not Found', 404)

        }
        else{
            return res.json({
                    name: item.name,
                    price: item.price
                   });
           
        };
    }
    catch(err){
        return next(err)
    }
});

router.patch('/:name', (req, res) => {
    const itemName = req.params.name;
    const item = list.find(item => item.name === itemName);

    try{
        if(!item){
            throw new ExpressError('Item Not Found', 404)
        }
        else{
            item.name = req.body.name
            item.price = req.body.price
        };
        return res.json({ 
            updated :{name : req.body.name, price : req.body.price}
               })
    }
    catch(err){
        return next(err)
    }
});

router.delete('/:name', (req, res) => {
   const itemName = req.params.name;
   const item = list.find(item => item.name === itemName);
    try{
        if(item){
            items.splice(item, 1)
            res.json({
                message: "DELETED SUCCESFULLY"
            })
        }
        else{
            throw new ExpressError('Item Not Found', 404)
        };
    }
    catch(err){
        return next(err)
    }
});

module.exports = router;