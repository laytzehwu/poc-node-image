const _ = require('lodash');

function isValidMediaType(body, properties) {
    const ownProperties = Object.getOwnPropertyNames(body);
    let ret = false;

    if (Array.isArray(properties)) {
        ret = _.isEqual(ownProperties.sort(), properties.sort());
    }

    return ret;
}

module.exports = {
    isValidMediaType
};