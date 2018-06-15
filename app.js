/*
==============================
    LOAD THE DEPENDENCIES     
==============================
*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

/*
==============================
    LOAD THE CONFIGURATION    
==============================
*/
const config = require(path.join(__dirname,'config'));
const port = process.env.PORT || 3000;

/*
==============================
    EXPRESS CONFIGURATION
==============================
*/
const app = express();

//parse JSON and url-encoded query
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
//print the request log on console;

// set the secret key veriable for jwt
app.set('jwt-secret',config.secret)

// index page just for testing
app.get('/',(req,res)=>{
    res.send('Hello JWT!');
})

//configure api router
app.use('/api',require('./routes/api'));

//open the server
app.listen(port,()=>{
    console.log(`Express is running on port ${port}`)
})


/*
==============================
   CONNECT TO MONGODB SERVER
==============================
*/
console.log(config.test);
mongoose.connect(config.mongodbUri)
const db = mongoose.connection;
db.on('error',console.error)
db.once('open',()=>{
    console.log('connected to mongodb server');
})