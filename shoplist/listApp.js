const express = require('express');
const ExpressError = require("./expressError")
const app = express();
const itemRoutes = require('./itemRoutes')


app.use(express.json())



app.use('/items', itemRoutes);



// gen error handler
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let msg = error.msg;

    return res.status(status).json({
        error: {msg , status}
    });
});



module.exports = app;