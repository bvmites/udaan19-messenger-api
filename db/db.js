const {MongoClient,ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const {SHA256} = require('crypto-js')
const httpRequest = require('request-promise-native')
require('request')

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
		return db.collection('events').updateOne({
			eventName:event
		},{
			$push:myData
		},{
			returnOriginal:false
		})
	},
	sendMessage:(contacts,message,eventID,response)=>{
		const sender = process.env.SMS_SENDER;
		const apiKey = process.env.SMS_API_KEY;
		const test = process.env.SMS_TEST === 'true';
		const numbers = contacts.join(",")
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
			// console.log(result)
			result.messages.forEach((message)=>{
				success.push(message.recipient.toString().substring(2))
				// console.log(success)
			})
			if (result.status==="success") {
				// console.log("success")
				response.status(200).send({success})
			} else {
				// console.log("failure")
				response.status(400).send({failure:[]})
			}
			
		}).catch((err)=>{
			// console.log(err)
			response.status(400).send({
				error:"Unable to connect to the TEXT LOCAL Server"
			})
		})
		
	}
})