const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const ok = repositoryService.checkDirectories(params)

    if (ok)
        res.send('OK')
    else {
        res.status(404)
        res.send(new createError(404))
    }
}
