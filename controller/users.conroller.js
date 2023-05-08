const userAdapter = require('../adapter/user.adapter');

// GET
// get all user
exports.getAllUser = async (request, response) => {
    const result = await userAdapter.getAllUser();
    response.json(result);
}

// POST
exports.login = async (request, response) => {
    const result = await userAdapter.login(request.body);
    response.json(result);
}
exports.signup = async (request, response) => {
    const result = await userAdapter.signup(request.body);
    response.json(result);
}

