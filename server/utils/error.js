class BaseError {
    constructor(code, path, description, documentation) {
        this.code = code;
        this.path = path;
        this.description = description,
        this.documentation = documentation || 'http://localhost:3100/docs';
    }
}

module.exports = BaseError;