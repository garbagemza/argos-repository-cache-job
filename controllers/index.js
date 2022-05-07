const getRepository = require('./getRepositoryController.js')
const getRepositoryMetadata = require('./getRepositoryMetadataController.js')
const postRepository = require('./postRepositoryController.js')

module.exports = {
    getRepository,
    postRepository,
    getRepositoryMetadata
}