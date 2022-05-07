const createError = require("http-errors")

// TODO make an array of environment variables and iterate

module.exports = function() {
    if (process.env.PORT === undefined) environmentNotFound('PORT')
    if (process.env.WORKDIR === undefined) environmentNotFound('WORKDIR')
}

function environmentNotFound(envName) {
    throw new createError(500, 'Environment variable "' + envName + '" not supplied.')
}