const service = require("../service/userService");

userController = {

    insertUser: async (req, res) => {
        service.newUser(req, res);
    },

    updateUser: async (req, res) => {
        service.updadeUser
    },

    getUsers: async (req, res) => {
        service.getUsers(req, res);
    }

}

module.exports = userController;