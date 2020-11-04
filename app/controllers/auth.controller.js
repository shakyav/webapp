const db = require("../models");
const config = require("../appConfig/auth.config");
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
  console.log("create user")
  User.create({

      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      password: bcrypt.hashSync(req.body.password, 8),


    }).then(user => {

      res.status(201).send({
        userId: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    })
    .catch(err => {


      res.status(400).send({
        message: err.message
      });
    });
};

//1 . authenticated api update user
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
        res.status(201).send({
          first_name: user.first_name,
          last_name: user.last_name,
          email_address: user.email_address,
        });
      })
    })

    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};

// 2 . authenticated api sign in user
exports.sign_In = (req, res) => {
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

      res.status(200).send({
        userId: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
      });

    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};






// 3. authenticated api create answer for a question


/* exports.createAnswer = (req, res, ) => {
  if (!req.body.answer_Text) {
    return res.status(400).send({
      "message": "Answer Text cannot be empty"
    })
  }else{
    questions.findByPk(req.params.questId).then((quest)=>{
      if(!quest){
        return res.status(400).send({message:"question not found"})
      }
    })

  }
  
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
 */

// 2. public api get all questions with categories and answers related to each question
/* exports.getAllQuestions = (req, res) => {

  console.log("i am here")
  questions.findAll({

    include: [{
        model: categories,
        required: false,
        attributes: ["category", "catId"],
        through: {
          attributes: []
        }
      },
      {
        model: answers,


      }

    ]

  }).then((question) => {
    if (!question) {

      return res.status(404).send({
        message: "No questions in created."
      });

    }
    res.status(201).send(



      question
    )

  }).catch(err => {
    err
  })
};
 */


// 3. public api get a question by ID
/* exports.getQuestionById = (req, res) => {

  console.log("i am here")
  questions.findByPk(req.params.question_id, {

    include: [{
        model: categories,
        required: false,
        attributes: ["category", "catId"],
        through: {
          attributes: []
        }
      },
      {
        model: answers,


      }

    ]

  }).then((question) => {

    if (!question) {

      return res.status(404).send({
        message: "question Not found."
      });

    }
    res.status(200).send(



      question
    )

  }).catch(err => {
    err
  })
};
 */

// 4. public api get answer by id for a question by id

/* exports.getAnswerByIdQuestionById = (req, res) => {

  console.log("i am here")
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
}; */

// 5 . public api get user info by id

exports.getUserById = (req, res) => {

  User.findByPk(req.params.user_id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User Not found."
        });
      }
      res.status(200).send({
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        created_at: user.createdAt,
        udated_at: user.updatedAt
      });
    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};








// 5. authenticated api delete answer

/* exports.deleteAnswer = (req, res) => {
  answers.destroy({
      where: {
        ansId: req.params.answer_id
      }
    }).then(()=>{
      if (!answer) {

        return res.status(400).send({
          message: "answer Not found."
        });
  
      }else{
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
 */
// 6 . authenticated api delete question

/* exports.deleteQuestion = (req, res) => {


  answers.findOne({
      where: {
        question_id: req.params.question_id,

      }
    }).then(answer => {
      if (!answer) {
        questions.destroy({
          where: {
            questId: req.params.question_id
          }
        })
        res.status(204).send({
          message: "Question Deleted Successfully!!"
        });
      } else {
        res.status(404).send({
          msg: "Question cannot be Deleted!!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
 */

// 5. authenticated api Update Answer of a question
/* exports.updateAnswer = (req, res) => {

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
}; */

/* exports.updateQuestion = (req, res ) => {
  if (!req.body.question_text) {
    return res.status(400).send({
      "message": "Question Text cannot be empty"
    })
  }

  quest_cat.destroy({
    where: {
      question_id: req.params.question_id
    }
  })
  questions.update({
      question_text: req.body.question_text
    }, {
      where: {
        questId: req.params.question_id
      }
    }).
    
    
    then(() => {
      questions.findByPk(req.params.question_id)
        .then((question) => {
          for (let i = 0; i < req.body.categories.length; i++) {
            categories.findOne({
              where: {
                category: req.body.categories[i].category.toLowerCase()
              }
            }).then((cat) => {
              if (!cat) {
                categories.create({
                  category: req.body.categories[i].category.toLowerCase()
                }).then(category => {
                  question.addCategories(category)
                })
              } else {

                question.addCategories(cat)
              }
            })
          }
        })
    })
    .then(data => {
      questions.findByPk(req.params.question_id, {
        include: [{
            model: categories,
            required: false,
            attributes: ["catId", "category"],
            through: {
              attributes: []
            }
          },
          {
            model: answers,
            
          }
        ]
      }).then((question) => {
        return res.status(201).send(
          question
        )
      }).catch(err => {
        err
      })

    });
};
 */



// 4. authenticated api post a question with categories
/* exports.createQuest =  async(req, res) => {

    



  if (!req.body.question_text) {
    res.status(400).send({
      "message": "Question-text cannot be blank"
    })
  }

  const quest1 =   questions.create({question_text: req.body.question_text,user_id: req.user.userId})

  questions.create({
    question_text: req.body.question_text,
    user_id: req.user.userId,
  }).then((question) => {

    for (let i = 0; i < req.body.categories.length; i++) {
      

      categories.findOne({
        
        where: {
          category: req.body.categories[i].category.toLowerCase()
        }
      }).then((cat) => {
        
        if (!cat) {
          categories.create({

            category: req.body.categories[i].category.toLowerCase()
          }).then(category => {
            question.addCategories(category)
          })

        } else {
          question.addCategories(cat)

        }
      })

    }

    const ques = await questions.findOne({
      where: {
        question_text: req.body.question_text
      }
    }, {
      include: [{
          model: categories,
          required: false,
          attributes: ["category", "catId"],
          through: {
            attributes: []
          }
        }

      ]
    }
    )
    res.status(200).send(ques)
  }).catch(err => {
    err
  })
}; */

/* exports.createQuestion = async (req, res) => {


  console.log("text----" + req.body.question_text)
  var question_text = req.body.question_text;
  var ques_categories = req.body.categories;

  if (!question_text) {
      res.status(400).send({
          Message: "please provide a question_text !"
      });
  }


  const quesdata = {

      user_id: req.user.userId,
      question_text: req.body.question_text,

  };
  const question_t = await questions.create(quesdata)

  if (ques_categories) {
      for (i = 0; i < req.body.categories.length; i++) {
          const catExist = await categories.findOne({
              where: {
                  category: req.body.categories[i].category.toLowerCase()
              }
          })
          if (!catExist) {
              const cat = await categories.create({

                  category: req.body.categories[i].category.toLowerCase()
              })
              await question_t.addCategories(cat)
          }else{
              await question_t.addCategories(catExist)

          }



          
      }
  }

  const ques = await questions.findAll({
      where: {
          questId: question_t.questId
      },
      include: [{
          model: categories,
          as: "categories",
          through: {
              attributes: [],
          }
      }, ],
  }).catch((err) => {
      console.log("Error while updating or fethcing the questions: ", err);
  });
  res.send(ques[0]);


};
 */



/* exports.updateQuestion_new = async (req, res) => {


  console.log("text----" + req.body.question_text)
  var question_text = req.body.question_text;
  var ques_categories = req.body.categories;

  if (!question_text) {
      res.status(400).send({
          Message: "please provide a question_text !"
      });
  }

  const catg = await quest_cat.destroy({
    where: {
      question_id: req.params.question_id
    }
  })


  const quesdata = {

      user_id: req.user.userId,
      question_text: req.body.question_text,

  };
  const question_ut = await questions.update({
    question_text: req.body.question_text
  }, {
    where: {
      questId: req.params.question_id
    }
  })
  const question_t = await questions.findByPk(req.params.question_id)

  if (ques_categories) {
      for (i = 0; i < req.body.categories.length; i++) {
          const catExist = await categories.findOne({
              where: {
                  category: req.body.categories[i].category.toLowerCase()
              }
          })
          if (!catExist) {
              const cat = await categories.create({

                  category: req.body.categories[i].category.toLowerCase()
              })
              await question_t.addCategories(cat)
          }else{
              await question_t.addCategories(catExist)

          }



          
      }
  }

  const ques = await questions.findAll({
      where: {
          questId: question_t.questId
      },
      include: [{
          model: categories,
          as: "categories",
          through: {
              attributes: [],
          }
      }, ],
  }).catch((err) => {
      console.log(" Error while updating or fethcing the questions: ", err);
  });
  res.send(ques[0]);


}; */