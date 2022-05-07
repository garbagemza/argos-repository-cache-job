const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const metadata = repositoryService.getMetadata(params)
    if (metadata != null) {
        res.json(metadata)
    } else {
        res.status(404)
        res.send(createError(404))
    }
}
