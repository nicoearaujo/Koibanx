const basicAuth = require('basic-auth');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const user = basicAuth(req);

        //No hay auth token
        if (!user) {
            res.status(400).send({ error: "Please authenticate" });
        } else {
            const userDB = await User.findOne({ username: user.name });
            //No hay usuario con ese username
            if (!userDB) {
                res.status(401).send({ error: "Invalid username or password" });
            } else if (userDB.verifyPassword(user.pass)) {
                next();
            } else res.status(401).send({ error: "Invalid username or password" });     //Password no coinciden
        }
    } catch (error) {
        res.status(500).send(error);
    }

}

module.exports = auth;