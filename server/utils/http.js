const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409
};

const RequestMethod = {
    DELETE: 'DELETE',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT'
};

module.exports = {
    HttpStatus,
    RequestMethod
};