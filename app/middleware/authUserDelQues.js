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
    if(!quest){
      return res.status(400).send({message:"question ID not found"})
    }
      console.log("\n ----------"+(quest.user_id == req.user.userId)+"\n ----------")
    if (quest.user_id != req.user.userId) {
      return res.status(401).send({
        message: "you are not authorized to delete/update/upload image this question"
      });
      
    }

    next();
  });

};

const verifyUser = {
    checkAuthenticUser: checkAuthenticUser,
    
  
  };
  
  module.exports = verifyUser;