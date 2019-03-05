const router = require('express').Router();
const authenticate = require('./../middleware/authenticate.js');
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const ParticipantSchema = require('../schema/participant');

const Validator = require('jsonschema').Validator;
const validator = new Validator();



module.exports = (db) => {
	const database = require('./../db/db.js')(db);
	router.post('/admin/login',(req, res) => {
		var body = req.body;
		database.login(body.id,body.password).then((manager)=>{
		var token = jwt.sign({id:manager.id},process.env.JWT_SECRET).toString()

		res.header('Authorization',token).status(200).send({
			msg: "You're logged in",
			token
			})
		}).catch((e)=>{
		  	res.status(400).send({
		  		msg: "Invalid id or password"
		  	})
		})
	});

	router.post('/round',authenticate,(req,res)=>{
		database.round(req.id).then((manager)=>{
			var event = manager.eventName;
			req.body.contacts.forEach((contact)=>{
				database.findParticipantAndUpdateRound(event,contact).then((participant)=>{}).catch((err)=>console.log(err))
			});
			database.addContacts(req.body.round,event,req.body.contacts).then((result)=>{}).catch((err)=>console.log(err));

			database.sendMessage(req.body.contacts,req.body.message,new ObjectID(req.body.eventID),res)
		}).catch((e)=>{
			console.log(e.message);
			res.status(400).send({
				error:"unable to update round!"
			})
		})
	});

	router.post('/addParticipant',authenticate,(req,res)=>{
		try{
			database.addParticipant(req.body);
			res.status(200).send({
				success:"Participant inserted"
			})
		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	});

	router.put('/update',authenticate,async (request, response) => {
		    try {
		        const error = new Error();
		        if (!validator.validate(request.body, ParticipantSchema).valid) {
		            error.message = 'Invalid input';
		            error.code = 'ValidationException';
		            throw error;
		        }
		        const updatedEvent = request.body;
		        const result = await database.update(updatedEvent);
		        // const insertedEvent = result.message.documents[0];
		        if (result.result.n === 0) {
		            error.message = 'The event with the specified Phone doesn\'t exist.';
		            error.code = 'EventNotFound';
		            throw error;
		        }
		        response.status(200).json({message: 'Participant updated'});
		    } catch (e) {
		        if (e.code === 'ValidationException') {
		            response.status(405).json({message: e.message});
		        } else if (e.code === 'EventNotFound') {
		            response.status(404).json({message: e.message});
		        } else {
		            response.status(500).json({message: e.message});
		        }
		    }
		});

	router.post('/get',authenticate, async (request, response)=>{
		try{
			const phone = request.body.phone;
			const result = await database.getParticipants(phone);
			response.status(200).json(result);
		}catch (e) {
			response.status(500).json({message: e.message});
		}
	});

	return router;
};