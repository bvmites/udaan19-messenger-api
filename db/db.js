const {MongoClient,ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const {SHA256} = require('crypto-js')
// MongoClient.connect('mongodb+srv://udaan18:udaan18@udaan18-dj1tc.mongodb.net/',(err,client)=>{
// 	if (err) {
//     	return console.log('Unable to connect to MongoDB server');
//   	}
//   	console.log('Connected to MongoDB server');
//   	var db=client.db('Udaan-19')
//   	db.collection('eventManagers').find({}).toArray().then((docs)=>{
//   		console.log(docs)
//   		// docs.forEach((doc)=>{
//   		// 	console.log(doc.eventName)
//   		// 	console.log(doc.managers)
//   		// 	doc.managers.forEach((manager)=>{
//   		// 		db.collection('eventManagers').insertOne({
//   		// 			_id : manager.phone,
//   		// 			name : manager.name,
//   		// 			password : SHA256(manager.phone+'Udaan19').toString(),
//   		// 			eventName : doc.eventName,
//   		// 			token : null
//   		// 		})
//   		// 	})
//   		// })
//   	},(err)=>{
//   		console.log(err)
//   	})
// })	

module.exports = (db) =>({
	updateByCredentials:(id,pass)=>{
		return db.collection('eventManagers').findOneAndUpdate({
			_id : id,
			password : SHA256(pass+'Udaan19').toString()
		},{
			$set:{
				token: jwt.sign({_id : id},'abc123').toString()
			}
		},{
			returnOriginal : false
		})
	},
	removeToken:(token)=>{
		// var decoded;
		// try{
		// 	decoded = jwt.verify(token,'abc123')
		// 	console.log(decoded)
		// } catch (e) {
		// 	return Promise.reject()
		// }
		// db.collection('eventManagers').findOne({
		// 	_id:decoded._id,
		// 	token
		// }).then((admin) => {
		//     if (!admin) {
		//       return Promise.reject();
		//     }
		//     console.log('\nyes\n')
		    
		// }).catch((e) => {
		//     res.status(401).send();
		// });

		return db.collection('eventManagers').findOneAndUpdate({
			token
		},{
			$set:{
				token:null
			}
		},{
			returnOriginal: false
		})
	}
})
