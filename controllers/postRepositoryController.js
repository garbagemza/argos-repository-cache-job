const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    repositoryService.postArchive(req, params, function(result) {
        if (result instanceof Error) {
            res.status(result.status)
            res.send(result)
        } else {
            res.json(result)
        }    
    })
}