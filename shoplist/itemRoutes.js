const express = require('express')
const ExpressError = require('./expressError')
const router = new express.Router()
const items = require('./fakeDb')


router.get('/', (req, res) =>{
    res.json({items : items})
}
)

router.post('/', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
  
    res.status(201).json({
      added: newItem
    });
  });

router.get('/:name', (req, res)=>{
   const itemName = req.params.name;
   const item = list.find(item=> item.name === itemName);

   if(item){
        res.json({
            name: item.name,
            price: item.price
        });
    
    }
    else{
        throw new ExpressError('Item Not Found', 404) 
    };
});

router.patch('/:name', (req, res) => {
    const itemName = req.params.name;
    const item = list.find(item => item.name === itemName);

    if(item){
        item.name = req.body.name
        item.price = req.body.price
    }
    else{
        throw new ExpressError('Item Not Found', 404)
    };
    res.json({ 
        updated :{name : req.body.name, price : req.body.price}
    })
});

router.delete('/:name', (req, res) => {
   const itemName = req.params.name;
   const item = list.find(item => item.name === itemName);
   
   if(item){
    items.splice(item, 1)
    res.json({
        message: "DELETED SUCCESFULLY"
    })
   }
   else{
    throw new ExpressError('Item Not Found', 404)
   };
});

module.exports = router;