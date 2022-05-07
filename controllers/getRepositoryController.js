const fs = require('fs')
const createError = require('http-errors')

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const baseDir = process.env.WORKDIR
    const userDir = baseDir + '/' + params.user
    const repoDir = userDir + '/' + params.repo
    const tagDir = repoDir + '/' + params.tag

    checkDirectory(userDir, res, function () {
        checkDirectory(repoDir, res, function () {
            checkDirectory(tagDir, res, function () {
                prepareResponse(res)
            })
        })
    })
}

function checkDirectory(dir, res, ok) {
    locateDirectory(dir, (err) => {
        handleDirectoryExistence(err, res, function () {
            ok()
        })
    })

}
function locateDirectory(dir, callback) {
    console.log('locating directory: ' + dir)
    fs.access(dir, function (err) {
        callback(err)
    })
}

function handleDirectoryExistence(err, res, ok) {
    if (err) {
        console.log('location not found.')
        res.status(404)
        res.send(new createError(404))
    } else {
        console.log('location found.')
        ok()
    }
}

function prepareResponse(res) {
    res.send('OK')
}
