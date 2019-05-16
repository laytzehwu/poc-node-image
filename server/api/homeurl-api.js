const homeUrlRepository = require('../repository/homeurl-repository');
const HttpStatus = require('../utils/http').HttpStatus;

function getHomeLandingUrl(req, res) {
    const variables = homeUrlRepository.getHomeUrl();
    res.status(HttpStatus.OK).json(variables);
}

module.exports = {
    getHomeLandingUrl
};
