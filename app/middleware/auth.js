const { user } = require("../models");
const db = require("../models");
var bcrypt = require("bcryptjs");
const log = require("../../logs")
const logger = log.getLogger('logs');

const User = db.user;

BasicAuthToken = (req, res, next) => {
    // check for basic auth header


    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Cred = req.headers.authorization.split(' ')[1];
    const userCredentials = Buffer.from(base64Cred, 'base64').toString('ascii');
    const [user_name, password] = userCredentials.split(':');



    User.findOne({
        where: {
            email_address: user_name
        }
    })
        .then(user => {
            if (!user) {
                logger.error("Invalid user credentials");
                return res.status(401).json({ message: 'Invalid Authentication Credentials' });
            }
            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                logger.error("Invalid Password");
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }
            // attach user to request object
            req.user = user
            next()

        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });



};

const auth = {
    BasicAuthToken: BasicAuthToken,
};

module.exports = auth;