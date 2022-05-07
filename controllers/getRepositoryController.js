const createError = require('http-errors')
const { repositoryService } = require('../services')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const result = repositoryService.getArchive(params)
    if (result != null) {
        res.writeHead(200, {
            'Content-Type': "application/zip, application/octet-stream",
            'Content-disposition': 'attachment;filename=archive',
            'Content-Length': result.archive.length
        })
        res.end(Buffer.from(result.archive, 'binary'))
    } else {
        res.status(404)
        res.send(new createError(404))
    }
}
