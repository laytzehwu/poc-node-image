const preferenceRepository = require('../repository/preferences-repository');
const HttpStatus = require('../utils/http').HttpStatus;

function getPreferences(req, res) {
    const preferences = preferenceRepository.getPreferences();
    res.status(HttpStatus.OK).json(preferences);
}

module.exports = {
    getPreferences
};
