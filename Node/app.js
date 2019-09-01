const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const app = express();
const survey = require('./route/survey');

app.use(logger('dev'));
//body parser
app.use(bodyparser.json());

app.use('/survey',survey);


app.use((req,res,next)=>{
    const err = new Error('not found');
    err.status = 404;
    next(err)
});
app.use((err,req,res,next)=>{
    const error = app.get('env')==='development' ? err:{};
    const status = err.status || 500;
    res.status(status).json({
        error:{
            message:error.message
        }
    });
    console.log(err);
});

//connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node');

//on connection
mongoose.connection.on('connected',()=>{
    console.log('connected to database @27017');
});
mongoose.connection.on('error',(err)=>{ 
    if(err){
        console.log('error in database connection' +err);
    }
});

const port = app.get('port') || 3000;
app.listen(port,()=>console.log('server is listening port '+port))
// //middleware cors
// app.use(cors({ Origin:'http://localhost:4200' })); 

// //CORS middleware
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// }

// app.use(allowCrossDomain);

// //static file
// app.use(express.static(path.join(__dirname,'html')));
