require('dotenv').config();
const express = require('express')
const createError = require('http-errors')

const { envcheck } = require('./utilities')

const { 
	getRepository,
	postRepository,
	getRepositoryMetadata
} = require('./controllers')

const app = express()

envcheck()

app.get('/repositories/:user/:repo/:tag/metadata', getRepositoryMetadata)
app.get('/repositories/:user/:repo/:tag', getRepository)
app.post('/repositories/:user/:repo/:tag', postRepository)

app.get('/health', (req, res) => {
	res.status(200)
	res.send("OK")
})


app.use((req, res, next) => {
	res.status(404)
	res.json(new createError(404, "Not found."))
})

app.listen(process.env.PORT)

