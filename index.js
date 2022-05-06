const express = require('express')
const createError = require('http-errors')

const { getRepository } = require('./controllers')

const app = express()

app.get('/repositories/:user/:repo/:tag', getRepository)

app.use((req, res, next) => {
	res.status(404)
	res.json(new createError(404, "Not found."))
})

app.listen(process.env.PORT)

