const db = require("../models");
const User = db.user;

checkEmailUpdate = (req, res, next) => {
    User.findOne({
        where: {
            email_address: req.body.email_address
        }
    }).then(user => {
        if (req.body.email_address != req.user.email_address) {
            res.status(401).send({
                message: "Email cannot be updated"
            });
            return;
        }
        next();
    });
};

const verifyUpdateUser = {
    checkEmailUpdate: checkEmailUpdate
};
module.exports = verifyUpdateUser;