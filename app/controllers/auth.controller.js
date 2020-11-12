const db = require("../models");
const config = require("../appConfig/auth.config");
const Metrics = require("../../metrics");
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const quest_cat = db.question_categories;

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

/* var jwt = require("jsonwebtoken"); */
var bcrypt = require("bcryptjs");

// 1 . public api create user
exports.sign_Up = (req, res) => {

Metrics.increment("User.POST.sign_Up");
let timer = new Date();
let db_timer = new Date(); 
  console.log("create user")
  User.create({

      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      password: bcrypt.hashSync(req.body.password, 8),


    }).then(user => {

      return res.status(201).send({
        userId: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    })
    .catch(err => {


      return res.status(400).send({
        message: err.message
      });
    });
};

//1 . authenticated api update user
exports.update_Record = (req, res) => {

  Metrics.increment("User.PUT.update_Record");
  // Save User to Database
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

  Metrics.increment("User.GET.sign_In");
  console.log("sign in user")
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

Metrics.increment("User.GET.getUserById");

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












