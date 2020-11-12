/*
   User Controller - all the Create( sign up), update and get(sign in) operations are
   handled by this controller 
 */

const db = require("../models");
const config = require("../appConfig/auth.config");
const User = db.user;
const metrics = require("../../metrics");
/* const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const quest_cat = db.question_categories; */

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

var bcrypt = require("bcryptjs");
var log4js = require("../logger")
const logger = log4js.getLogger('logs');



// public api to create a user with required details
exports.sign_Up = (req, res) => {


metrics.increment("User.POST.createUser");
let timer = new Date();
let db_timer = new Date();  
    console.log("create user")

    /* this calls the create function of sequelize and insert the user information into user table
    and returns the user details as the response , status code 201 signifies the user object is created*/

    User.create({
  
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_address: req.body.email_address,
        password: bcrypt.hashSync(req.body.password, 8),   /* user password is encrypted here using bcrypt */
  
  
      }).then(user => {
        metrics.timing('User.POST.dbcreateUser',db_timer)
  
        return res.status(201).send({
          userId: user.userId,
          first_name: user.first_name,
          last_name: user.last_name,
          email_address: user.email_address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
        
        ),metrics.timing("User.POST.createUser",timer);
        
      })
      .catch(err => {
  
  
        return res.status(400).send({
          message: err.message
        });
      });
  };


  
  // 1 . authenticated api update user

  exports.update_Record = (req, res) => {

    metrics.increment("User.PUT.updateUser");

    /* this calls the update function of sequelize and insert the user information into user table based on
       where clause and returns the user details as the response , status code 201 signifies the user object 
       is created*/

    /* the function updates the user info and then do search(findOne) on the user table based on the email provided
       in the request body and returns the user info as the response 
    */

    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: bcrypt.hashSync(req.body.password, 8)
      }, {
        where: {
          email_address: req.user.email_address
        },
      }).then(() => {
        User.findOne({
          where: {
            email_address: req.body.email_address
          }
        }).then(user => {
          return res.status(201).send({
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
          });
        })
      })
  
      .catch(err => {
        return res.status(400).send({
          message: err.message
        });
      });
  };

  
  // 2 . authenticated api sign in user

  exports.sign_In = (req, res) => {
    metrics.increment("User.GET.getUserInformation");

    /* console.log("sign in user") */

    /* 
       Sign in function first searches(findOne) for the user based on the email-id(username) and password
       and returns the user info on successful login
    */


    User.findOne({
        where: {
          email_address: req.user.email_address
        }
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User Not found."
          });
        }
  
        return res.status(200).send({
          userId: user.userId,
          first_name: user.first_name,
          last_name: user.last_name,
          email_address: user.email_address,
        });
  
      })
      .catch(err => {
        return res.status(400).send({
          message: err.message
        });
      });
  };


// 5 . public api get user info by id

exports.getUserById = (req, res) => {
  metrics.increment("User.GET.getUserInfo");

    User.findByPk(req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User Not found."
          });
        }
        return res.status(200).send({
          id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email_address: user.email_address,
          created_at: user.createdAt,
          udated_at: user.updatedAt
        });
      })
      .catch(err => {
        return res.status(400).send({
          message: err.message
        });
      });
  };
  