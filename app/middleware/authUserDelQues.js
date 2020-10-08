const db = require("../models");
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");


// check user authorization for delete question
checkAuthenticUser = (req, res, next) => {
   
  questions.findOne({
    where: {
      questId: req.params.question_id
    }
  }).then(quest => {
      console.log("\n ----------"+(quest.user_id == req.user.userId)+"\n ----------")
    if (quest.user_id != req.user.userId) {
      res.status(401).send({
        message: "you are not authorized to delete this question"
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