const usersRepository = require('../repository/users-repository');
const {
    HttpStatus,
    RequestMethod 
} = require('../utils/http');
const ObjectMapper = require('../utils/utils').ObjectMapper;
const HATEOAS = require('../utils/hateoas');
const state = require('../state');

function getCurrentUser(req, res) {
    const user = usersRepository.findOne(state.getCurrentUser().username);
    const hateoasUserReponse = HATEOAS.wrapResources({
        content: ObjectMapper.map(user, null, ['password', 'email', 'roles']),
        links: [
            {
                rel: 'self',
                method: 'GET',
                href: '/v0/user'
            },
        ],
        request: req
    });

    res.status(HttpStatus.OK).json(hateoasUserReponse);
}

module.exports = {
    getCurrentUser,
};