const express = require('express')

const app = express()

app.get('/', function (req, res) {
	res.send('OK')
})


app.listen(process.env.PORT)

