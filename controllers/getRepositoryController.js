const fs = require('fs');

module.exports = function (req, res) {
    const params = req.params
    console.log(params)

    const baseDir = process.env.WORKDIR
    const dir = baseDir + '/' + params.user

    // check if directory exists
    fs.access(dir, (err) => {
        console.log(`Directory ${dir} ${err ? 'does not exist' : 'exists'}`);
    });

    res.send('OK')
}


