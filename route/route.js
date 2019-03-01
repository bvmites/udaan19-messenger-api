const router = require('express').Router()
const authenticate = require('./../middleware/authenticate.js')
const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
module.exports = (db) => {
	const database = require('./../db/db.js')(db)
	router.post('/admin/login',(req, res) => {
		var body = req.body
		database.login(body.id,body.password).then((manager)=>{
		var token = jwt.sign({_id:manager._id},process.env.JWT_SECRET).toString()

		res.header('x-auth',token).status(200).send({
			msg: "You're logged in",
			token
			})
		}).catch((e)=>{
		  	res.status(400).send({
		  		msg: "Invalid id or password"
		  	})
		})
	})

	router.post('/round',authenticate,(req,res)=>{
		database.round(req._id).then((manager)=>{
			var event = manager.eventName
			req.body.contacts.forEach((contact)=>{
				database.findParticipantAndUpdateRound(event,contact).then((participant)=>{}).catch((err)=>console.log(err))
			})
			database.addContacts(req.body.round,event,req.body.contacts).then((result)=>{}).catch((err)=>console.log(err))

			database.sendMessage(req.body.contacts,req.body.message,new ObjectID(req.body.eventID),res)
		})
	})
	return router
}