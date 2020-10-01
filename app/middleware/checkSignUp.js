const db = require("../models");
const User = db.user;



checkDuplicateEmail = (req, res, next) => {
   // Email
  User.findOne({
    where: {
      email_address: req.body.email_address
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Error! Email already taken by another User"
      });
      return;
    }

    next();
  });

};


checkPassword = (req, res, next) => {
  // Password
  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.
  test(req.body.password)) {
    return res.status(400).send(
    {
      message: "Please choose a STRONG password containing atleast 1 uppercase, 1 lowercase, 1 number "+
      "and 1 special character and more that 8 characters"
    }
    );
  }


  next();


};



const checkSignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword

};

module.exports = checkSignUp;
