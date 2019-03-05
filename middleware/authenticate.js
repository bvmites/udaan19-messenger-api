const {MongoClient} = require('mongodb')
const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
		var token = req.header('Authorization')

		try{
			var decoded = jwt.verify(token,process.env.JWT_SECRET)
			// req.token = token
			req.id = decoded.id
	 		next()
		} catch (e) {
			return res.status(401).send({
				error: "Unauthorized"
			})
		}
}

