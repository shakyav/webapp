const db = require("../models");
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const log = require("../../logs")
const logger = log.getLogger('logs');


// check user authorization for delete question
checkAuthenticUser = (req, res, next) => {
   
  answers.findOne({
    where: {
      ansId: req.params.answer_id
    }
  }).then(ans => {

    if(!ans){
      logger.error("Invalid user credentials");
      return res.status(400).send({message:"answer ID not found"})
    }
    
      console.log("\n ----------"+(ans.user_id == req.user.userId)+"\n ----------")
    if (ans.user_id != req.user.userId) {
      logger.error("not authorized");
      return res.status(401).send({
        message: "you are not authorized to delete this answer/ file"
      });
      return;
    }

    next();
  });

};

const verifyUser = {
    checkAuthenticUser: checkAuthenticUser,
    
  
  };
  
  module.exports = verifyUser;