const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')
var app = express()
app.use(bodyParser.json())
dotenv.config()
// console.log(process.env.JWT_SECRET)
const authenticate = require('./middleware/authenticate.js')

MongoClient.connect('mongodb+srv://udaan18:udaan18@udaan18-dj1tc.mongodb.net/',(err,client)=>{
	if (err) {
    	return console.log('Unable to connect to MongoDB server');
  	}
  	console.log('Connected to MongoDB server');
  	var db=client.db('Udaan-19')
  	var eventManagers = require('./db/db.js')(db)
  	app.post('/admin/login',(req, res) => {
	  	var body = req.body;
	  	eventManagers.updateByCredentials(body.id,body.password).then((manager)=>{
	  		// console.log(manager)
	  		res.header('x-auth',manager.value.token).status(200).send({
	  			msg: "You're logged in"
	  		})
	  	}).catch((e)=>{
	  		res.status(400).send({
	  			msg: "Invalid id or password"
	  		})
	  	})
	})
			
	app.delete('/admin/logout', authenticate,(req, res) => {
	  eventManagers.removeToken(req.token).then((result) => {
	  	// console.log(result)
	    res.status(200).send({
	    	msg: "You're logged out"
	    });
	  }, (err) => {
	  	console.log(err)
	    res.status(400).send({
	    	msg: "Error"
	    });
	  })
	})

	// db.collection('eventManagers').find({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI5NzE0NDEzNDM1IiwiaWF0IjoxNTUxMzU1MDk3fQ.WYs10-ohCkh-0NJ-4OJBnc15kdEuKM8UD2KI0K5AfA8"}).toArray().then((docs)=>{
	// 	console.log(docs)
	// }).catch((e)=>{
	// 	console.log(e)
	// })
})
app.listen(3000,()=>console.log('Connected to port 3000'))