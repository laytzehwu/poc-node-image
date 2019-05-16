const envvarsRepository = require('../repository/envvars-repository');
const HttpStatus = require('../utils/http').HttpStatus;

function getEnvironmentVariables(req, res) {
    const variables = envvarsRepository.getConfig();

    res.status(HttpStatus.OK).json(variables);
}

module.exports = {
    getEnvironmentVariables
};
