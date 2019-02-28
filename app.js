const express = require('express')
var app = express()
app.get('/',(req,res)=>{
	res.send('Messenger API')
})
app.listen(3000,()=>console.log('Connected to port 3000'))