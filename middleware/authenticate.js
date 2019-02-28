const {MongoClient} = require('mongodb')
const jwt = require('jsonwebtoken')
// var eventManagers = require('./../db/db.js')
module.exports = (req,res,next)=>{
		var token = req.header('x-auth')
		// console.log(token)
		var decoded
		try{
			decoded = jwt.verify(token,process.env.JWT_SECRET)
			// console.log(decoded)
			req.token = token
	 		next()
		} catch (e) {
			return res.status(401).send({
				error: "Unauthorized"
			})
		}
		// db.collection('eventManagers').findOne({
		// 	_id:decoded._id,
		// 	token
		// }).then((admin) => {
		//     if (!admin) {
		//       return Promise.reject();
		//     }
		//     console.log('\nyes\n')
		//     req.token = token
		//     next()
		// }).catch((e) => {
		//     res.status(401).send();
		// });
}

