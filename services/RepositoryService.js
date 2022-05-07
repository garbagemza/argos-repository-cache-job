const fs = require('fs')
const crypto = require('crypto');
const jsonfile = require('jsonfile')


function getMetadata(params) {
    const directoriesOk = checkDirectories(params)
    if (!directoriesOk)
        return null
    
    const metadata = getMetadataHealth(params)
    if (metadata == null)
        return null
    
    return metadata
}

function checkDirectories(params) {
    const { userDir, repoDir, tagDir} = getDirectories(params)

    const dirArray = [userDir, repoDir, tagDir]
    const results = dirArray.map(function(dir) {
        return checkFileExistence(dir)
    })

    return results.reduce(function(acc, value) {
        return acc && value
    }, true)
}

function getMetadataHealth(params) {
    const { tagDir } = getDirectories(params)
    const metadataPath = tagDir + '/metadata.json'
    const archivePath = tagDir + '/archive'

    const files = [metadataPath, archivePath]
    const results = files.map(function(path) {
        return checkFileExistence(path)
    })

    const filesOk = results.reduce(function(acc, value) { return acc && value}, true)
    if (!filesOk)
        return null

    const metadata  = getMetadataFile(metadataPath)
    if (metadata == null)
        return null

    const hexHash = getHexSha256HashFromFile(archivePath)
    if (hexHash !== metadata.sha256) {
        console.log('SHA256 digest values do not match.')
        return null
    }
    return metadata
}

function checkFileExistence(dir) {
    console.log('locating directory: ' + dir)
    const exists = fs.existsSync(dir)
    console.log(exists ? 'location found.' : 'location not found.')
    return exists
}

function getDirectories(params) {
    const baseDir = process.env.WORKDIR
    const userDir = baseDir + '/' + params.user
    const repoDir = userDir + '/' + params.repo
    const tagDir = repoDir + '/' + params.tag

    return { userDir, repoDir, tagDir}
}

function getMetadataFile(path) {
    console.log('loading json from path: ' + path)
    try {
        const metadata = jsonfile.readFileSync(path)
        const resultMetadata = checkMetadata(metadata)
        return resultMetadata
    } catch (err) {
        console.log(err)
        return null
    }
}

function checkMetadata(metadata) {
    console.log('checking metadata validity')
    if (metadata.sha256 === undefined || metadata.sha256 == null) {
        console.log('sha256 not found.')
        return null
    }
    
    console.log('metadata:')
    console.log('  sha256: ' + metadata.sha256)

    return metadata
}

function getHexSha256HashFromFile(path) {
    console.log('calculating hash sha256 from file ' + path)

    const fileBuffer = fs.readFileSync(path)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    const value = hashSum.digest('hex')

    console.log('SHA256: ' + value)
    return value
}

module.exports = {
    getDirectories,
    checkDirectories,
    getMetadata
}