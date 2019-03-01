const {MongoClient} = require('mongodb')
const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
		var token = req.header('x-auth')
		var decoded
		try{
			decoded = jwt.verify(token,process.env.JWT_SECRET)
			req.token = token
			req._id = decoded._id
	 		next()
		} catch (e) {
			return res.status(401).send({
				error: "Unauthorized"
			})
		}
}

