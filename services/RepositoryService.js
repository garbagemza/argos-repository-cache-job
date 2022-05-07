const fs = require('fs')


function getDirectories(params) {
    const baseDir = process.env.WORKDIR
    const userDir = baseDir + '/' + params.user
    const repoDir = userDir + '/' + params.repo
    const tagDir = repoDir + '/' + params.tag

    return { userDir, repoDir, tagDir}
}

function checkDirectory(dir) {
    console.log('locating directory: ' + dir)
    const exists = fs.existsSync(dir)
    console.log(exists ? 'location found.' : 'location not found.')
    return exists
}

module.exports = {
    getDirectories,
    checkDirectory
}