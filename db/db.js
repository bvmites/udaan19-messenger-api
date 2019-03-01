const {MongoClient,ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
// const bcrypt = require('bcryptjs')
const {SHA256} = require('crypto-js')
const httpRequest = require('request-promise-native')
require('request')
//  MongoClient.connect('mongodb+srv://udaan18:udaan18@udaan18-dj1tc.mongodb.net/',(err,client)=>{
// 	if (err) {
//     	return console.log('Unable to connect to MongoDB server');
//   	}
//   	console.log('Connected to MongoDB server');
//   	var db=client.db('Udaan-19')
//   	db.collection('events').find({}).toArray().then((docs)=>{
//   		console.log(docs)
//   		docs.forEach((doc)=>{
//   			console.log(doc.eventName)
//   			console.log(doc.managers)
//   			doc.managers.forEach((manager)=>{
//   				db.collection('eventManagers').insertOne({
//   					_id : manager.phone,
//   					name : manager.name,
//   					password : SHA256(manager.phone+'Udaan19').toString(),
//   					eventName : doc.eventName,
//   				})
//   			})
//   		})
//   	},(err)=>{
//   		console.log(err)
//   	})
// })	

module.exports = (db) =>({
	login:(id,pass)=>{
		return db.collection('eventManagers').findOne({
			_id : id,
			password : SHA256(pass+'Udaan19').toString()
		})
	},
	round:(id)=>{
		return db.collection('eventManagers').findOne({
			_id : id
		})
	},
	findParticipantAndUpdateRound:(event,phone)=>{
		return db.collection('participants').updateMany({
			phone,
			"events.eventName":event
		},{
			$inc:{
				"events.$.round":1
			} 
		},{
			returnOriginal:false
		})
	},
	addContacts:(round,event,contacts)=>{
		var myData
		if (round === 1) {
			myData = {
				round_1:contacts
			} 
		} else if (round === 2) {
			myData = {
				round_2:contacts
			}
		} else if (round === 3) {
			myData = {
				round_3:contacts
			}
		} else if (round === 4) {
			myData = {
				Winner:contacts
			}
		}
		console.log(myData)
		return db.collection('events').updateOne({
			eventName:event
		},{
			$push:myData
		},{
			returnOriginal:false
		})
	},
	sendMessage:(contacts,message,eventID,response)=>{
		// var success=[]
		const sender = process.env.SMS_SENDER;
		const apiKey = process.env.SMS_API_KEY;
		const test = process.env.SMS_TEST === 'true';
		const numbers = "7990839920,9913551362"
		console.log(numbers)
		// TODO Default message
		// const message = `Dear Participant, Round ${round + 1} of ${eventName} is on ${date} ${time} at ${venue}. Kindly be present at the venue on time.`;
		const apiRequest = {
		    url: 'http://api.textlocal.in/send',
		    form: {
		    	apiKey,
		    	numbers,
		    	test,
		    	sender,
		    	custom: eventID,
		    	message
			// receiptUrl: 'http://udaan18-messenger.herokuapp.com/textlocal'
			}
		};
		httpRequest.post(apiRequest).then((res)=>{
			result=JSON.parse(res)
			var success=[]
			console.log(result)
			result.messages.forEach((message)=>{
				success.push(message.recipient.toString().substring(2))
				console.log(success)
			})
			if (result.status==="success") {
				console.log("success")
				response.status(200).send({success})
			} else {
				console.log("failure")
				response.status(400).send({failure:[]})
			}
			
		}).catch((err)=>{
			console.log(err)
			response.status(400).send({
				error:"Unable to connect to the TEXT LOCAL Server"
			})
		})
		
	}
	// removeToken:(token)=>{
	// 	// var decoded;
	// 	// try{
	// 	// 	decoded = jwt.verify(token,'abc123')
	// 	// 	console.log(decoded)
	// 	// } catch (e) {
	// 	// 	return Promise.reject()
	// 	// }
	// 	// db.collection('eventManagers').findOne({
	// 	// 	_id:decoded._id,
	// 	// 	token
	// 	// }).then((admin) => {
	// 	//     if (!admin) {
	// 	//       return Promise.reject();
	// 	//     }
	// 	//     console.log('\nyes\n')
		    
	// 	// }).catch((e) => {
	// 	//     res.status(401).send();
	// 	// });

	// 	return db.collection('eventManagers').findOneAndUpdate({
	// 		token
	// 	},{
	// 		$set:{
	// 			token:null
	// 		}
	// 	},{
	// 		returnOriginal: false
	// 	})
	// }
})



            