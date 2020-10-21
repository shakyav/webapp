/* 
    Answer Controller - all the operations related to answers such as post an answer for a question,
    update and answer for a question, get answer by id , delete answer by id are handled by this 
    controller
*/


const db = require("../models");
const config = require("../appConfig/auth.config");
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const quest_cat = db.question_categories;

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");


// 3. authenticated api create answer for a question


exports.createAnswer = (req, res,) => {

    /* 
    checks if answer text is empty then returns a custom message 
     */
    if (!req.body.answer_Text) {
        return res.status(400).send({
            "message": "Answer Text cannot be empty"
        })
    }
    /* 
    checks if question id provided in the api uri is invalid then returns a custom message 
     */ 
    else {
        questions.findByPk(req.params.questId).then((quest) => {
            if (!quest) {
                return res.status(400).send({ message: "question not found" })
            }
        })

    }
    /* inserts the  answer object in the answers table and returns the create object as the response */
    answers.create({
        answer_Text: req.body.answer_Text,
        question_id: req.params.questId,
        questionQuestId: req.params.questId,
        user_id: req.user.userId
    }).then((answer) => {

        if (!answer) {

            return res.status(404).send({
                message: "Answer not created"
            });

        }
        return res.status(201).send({
            answer: answer
        })
    }).catch((err) => {
        err
    })
};

// 4. public api get answer by id for a question by id

exports.getAnswerByIdQuestionById = (req, res) => {


    /*
     searches for an answer based on the combination of question id and answer id 
     and returns the answer object as the response  
    */

    /* console.log("i am here") */
    answers.findOne({
        where: {
            question_id: req.params.question_id,
            ansId: req.params.answer_id
        }
    }).then((answer) => {
        if (!answer) {

            return res.status(400).send({
                message: "answer Not found."
            });

        } else {
            questions.findByPk(req.params.question_id, {


            }).then((quest) => {
                if (!quest) {
                    return res.status(400).send({
                        message: "question not found"
                    })
                }
            })
        }
        res.status(200).send(

            answer


        )

    }).catch(err => {
        err
    })
};


// 5. authenticated api delete answer

exports.deleteAnswer = (req, res) => {


    /*
     searches for an answer based answer id and deletes the answer object 
     returns status as 200 and custom message
    */
    answers.destroy({
        where: {
            ansId: req.params.answer_id
        }
    }).then(() => {
        if (!answer) {

            return res.status(400).send({
                message: "answer Not found."
            });

        } else {
            res.status(200).send({
                message: "Answer Deleted"
            })

        }
    }


    )
        .catch(err => {
            res.status(400).send({
                message: err.message
            });
        });
};

// 5. authenticated api Update Answer of a question
exports.updateAnswer = (req, res) => {

    answers.update({
        answer_Text: req.body.answer_Text,
      }, {
        where: {
          ansId: req.params.answer_id,
          question_id: req.params.question_id
        },
      }).then(() => {
        answers.findOne({
          where: {
            ansId: req.params.answer_id,
            question_id: req.params.question_id
          }
        }).then(answer => {
          if (!answer) {
            return res.status(404).send({
              message: "answer cannot be updated"
            });
          } else {
            res.status(201).send({
              answer_id: req.params.answer_id,
              question_id: req.params.question_id,
              created_timestamp: answer.createdAt,
              updated_timestamp: answer.updatedAt,
              user_id: answer.user_id,
              answer_text: answer.answer_Text
            });
          }
        })
  
      })
      .catch(err => {
        res.status(400).send({
          message: err.message
        });
      });
  };