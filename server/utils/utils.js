const ObjectMapper = {
    map: (obj, propertyMapping, excludedProperties) => {
        if (obj) {
            const result = Object.create(null);
            for (let propertyName of Object.keys(obj)) {
                if (Array.isArray(excludedProperties) && excludedProperties.indexOf(propertyName) !== -1) {
                    continue;
                }
                const alias = propertyMapping && propertyMapping[propertyName];
                if (alias) {
                    result[alias] = obj[propertyName];
                } else {
                    result[propertyName] = obj[propertyName]
                }
            }
            return result;
        }
    }
}

module.exports = {
    ObjectMapper
};