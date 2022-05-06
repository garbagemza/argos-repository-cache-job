const createError = require("http-errors")

module.exports = function() {
    if (process.env.PORT === undefined) environmentNotFound('PORT')
    if (process.env.WORKDIR === undefined) environmentNotFound('WORKDIR')
}

function environmentNotFound(envName) {
    throw new createError(500, 'Environment variable "' + envName + '" not supplied.')
}