const fs = require('fs')
const crypto = require('crypto');
const jsonfile = require('jsonfile');
const createError = require('http-errors');

const metadataFile = '/metadata.json'
const archiveFile = '/archive'

function getArchive(params) {
    const directoriesOk = checkDirectories(params)
    if (!directoriesOk)
        return null

    return getMetadataHealth(params)

}

function getMetadata(params) {
    const directoriesOk = checkDirectories(params)
    if (!directoriesOk)
        return null
    
    const result = getMetadataHealth(params)
    if (result == null)
        return null
    
    return result.metadata
}

function postArchive(request, params) {
    const { userDir, repoDir, tagDir} = getDirectories(params)

    if (!checkFileExistence(userDir))
        makeDirectory(userDir)

    if (!checkFileExistence(repoDir))
        makeDirectory(repoDir)

    if (!checkFileExistence(tagDir))
        makeDirectory(tagDir)

    const archivePath = tagDir + archiveFile
    const metadataPath = tagDir + metadataFile

    console.log('creating file contents into file:' + archivePath)
    request.pipe(fs.createWriteStream(archivePath))
    console.log('file created.')

    const sha256 = getHexSha256HashFromFile(archivePath)
    const metadata = {
        sha256: sha256
    }
    console.log('creating file contents info file: ' + metadataPath)
    jsonfile.writeFileSync(metadataPath, metadata)
    console.log('file created.')

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
    const metadataPath = tagDir + metadataFile
    const archivePath = tagDir + archiveFile

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

    const archive = fs.readFileSync(archivePath)

    return { metadata, archive }
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

function makeDirectory(path) {
    console.log('attempting to make directory: ' + path)
    fs.mkdirSync(path)
    console.log('directory created.')
}

module.exports = {
    getArchive,
    postArchive,
    getMetadata
}