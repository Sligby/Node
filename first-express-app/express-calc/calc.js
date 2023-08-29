
const express = require('express');
const ExpressError = require("./expressError")
const app = express();

app.get("/mean", (req, res, next) => {
   try{
    const nums = req.query.nums.split(',').map(Number)
    if (!nums) throw new ExpressError('nums are required', 400);
    for (x in nums) {
        if(NaN) throw new ExpressError('Not a Number', 400)};
    const mean = nums.reduce((sum, num) => sum + num, 0) / nums.length;
    res.json({operation: 'mean', value: mean})
   }
   catch(e){
    next(e)
   }
});

app.get('/median', (req, res, next) => {
   try{ 
    const nums = req.query.nums.split(',').map(Number)
        if (!nums) throw new ExpressError('nums are required', 400);
        for (x in nums) {
            if(NaN) throw new ExpressError('Not a Number', 400)};
    nums.sort((a,b) => a-b);
    let median;

    if (nums.length % 2 === 0){
       let mid = nums.length /2;
       median = (nums[mid-1]+ nums[mid])/2
    }
    else{
        median = nums[Math.floor(nums.length/2)]
    }
    res.json({operation: 'median', value: median})
}
    catch(e){
        next(e)
    }
});

app.get('/mode', (req,res, next) => {
    try {
        const nums = req.query.nums.split(',').map(Number)
            if (!nums) throw new ExpressError('nums are required', 400);
        nums.sort((a,b) => a-b);
            for (x in nums) {
                if(NaN) throw new ExpressError('Not a Number', 400)};
        const frequency = nums.reduce(function (acc, curr) {
            return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        }, {});
        let maxKey = null;
        let maxValue = -Infinity;

        for (const key in frequency) {
            if (frequency[key] > maxValue) {
            maxValue = frequency[key];
            maxKey = key;
            }
        }
        const mode = maxKey
        return res.json({operation: 'mode', value: mode})
    }
    catch(e){
        next(e)
    }
});

// 404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
  });
  
// gen error handler
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let msg = error.msg;

    return res.status(status).json({
        error: {msg , status}
    });
});


app.listen(3000, function() {
    console.log('Server is listening on port 3000');
  });