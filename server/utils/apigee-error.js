class ApigeeBaseError {
    constructor(errorType, message) {
        this.errors = new Array({
            errorType: errorType,
            message: message
        });
        this.success = false;
    }
}

module.exports = ApigeeBaseError;