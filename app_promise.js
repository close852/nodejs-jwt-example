/*
==============================
    LOAD THE DEPENDENCIES     
==============================
*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));


app.get('/',(req,res)=>{
    res.send('Hello Promise');
})

const user = [
    {
        username :'jiwoo',
        password : '1111',
        id : 'close852'
    }
]



//open the server
app.listen(port,()=>{
    console.log(`Express is running on port ${port}`)
})


/*
==============================
   CONNECT TO MONGODB SERVER
==============================
*/