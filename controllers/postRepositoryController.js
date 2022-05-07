const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const result = repositoryService.postArchive(req, params)
    if (result instanceof Error) {
        res.status(result.status)
        res.send(result)
    } else {
        res.json(result)
    }
}