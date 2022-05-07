const fs = require('fs');
const createError = require('http-errors');

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const baseDir = process.env.WORKDIR
    const userDir = baseDir + '/' + params.user
    const repoDir = userDir + '/' + params.repo

    checkDirectory(userDir, res, function () {
        checkDirectory(repoDir, res, function () {
            res.send('OK')
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
    });
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
