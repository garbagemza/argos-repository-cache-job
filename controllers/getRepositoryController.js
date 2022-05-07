const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const { userDir, repoDir, tagDir} = repositoryService.getDirectories(params)

    const dirArray = [userDir, repoDir, tagDir]
    const results = dirArray.map(function(dir) {
        return repositoryService.checkDirectory(dir)
    })

    const ok = results.reduce(function(acc, value) {
        return acc && value
    }, true)

    if (ok)
        res.send('OK')
    else {
        res.status(404)
        res.send(new createError(404))
    }
}
