const express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const {MongoClient} = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT||3000;

const router = require('./route/route.js');
// require('./db/managers.js');
MongoClient.connect(process.env.DB,{ useNewUrlParser:true },(err,client)=>{
	if (err) {
    	return console.log('Unable to connect to MongoDB server');
  	}
  	console.log('Connected to MongoDB server');
  	var db=client.db('Udaan-19');
  	app.use('/',router(db))
});
app.listen(port,()=>console.log(`Connected to port ${port}`))