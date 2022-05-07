const fs = require('fs');
const createError = require('http-errors');

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const baseDir = process.env.WORKDIR
    const userDir = baseDir + '/' + params.user

    checkDirectory(userDir, (err) => {
        handleDirectoryExistence(err, res, function() {
            res.send('OK')
        })
    })
}

function checkDirectory(dir, callback) {
    console.log('locating directory: ' + dir)
    fs.access(dir, function (err) {
        callback(err)
    });
}

function handleDirectoryExistence(err, res, callback) {
    if (err) {
        console.log('location not found.')
        res.status(404)
        res.send(new createError(404))
    } else {
        console.log('location found.')
        callback()
    }
}
