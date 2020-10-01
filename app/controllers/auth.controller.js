const db = require("../models");
const config = require("../dbConfig/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.sign_Up = (req, res) => {
  console.log("iamhere")
  User.create({

    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    password: bcrypt.hashSync(req.body.password, 8),


  }).then(user => {

    res.status(200).send({
      userId: user.userId,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  })
    .catch(err => {


      res.status(500).send({ message: err.message });
    });
};

exports.update_Record = (req, res) => {
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
      res.send({
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
      });
    })
  })

    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.sign_In = (req, res) => {
  User.findOne({
    where: {
      email_address: req.user.email_address
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      res.status(200).send({
        user_Id: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};