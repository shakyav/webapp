const db = require("../models");
const config = require("../dbConfig/auth.config");
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const quest_cat = db.question_categories;


/* exports.createQues = (question) => {
    return questions.create(question)
        .then((ques) => {
            console.log(">> Created Question: " + ques);
            return ques;
        })
        .catch((err) => {
            console.log(">> Error while creating Question: ", err);
        });
}; */


exports.createQuestion = async (req, res) => {


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
    const ques1 = await questions.create(quesdata)

    if (ques_categories) {
        for (i = 0; i < req.body.categories.length; i++) {
            const existCat = await categories.findOne({
                where: {
                    category: req.body.categories[i].category.toLowerCase()
                }
            })
            if (!existCat) {
                const cat = await categories.create({

                    category: req.body.categories[i].category.toLowerCase()
                })
                await ques1.addCategories(cat)
            }else{
                await ques1.addCategories(existCat)

            }



            
        }
    }

    const ques = await questions.findAll({
        where: {
            questId: ques1.questId
        },
        include: [{
            model: categories,
            as: "categories",
            through: {
                attributes: [],
            }
        }, ],
    }).catch((err) => {
        console.log(">> Error while retrieving questions: ", err);
    });
    res.send(ques[0]);


};


/* exports.updateQuestion = async (req, res) => {


    console.log("text----" + req.body.question_text)
    var question_text = req.body.question_text;
    var ques_categories = req.body.categories;

    if (!question_text) {
        res.status(400).send({
            Message: "please provide a question_text !"
        });
    }
    quest_cat.destroy({
        where: {
          question_id: req.params.question_id
        }
      })



    const quesdata = {

        user_id: req.user.userId,
        question_text: req.body.question_text,

    };

    questions.update({
        question_text: req.body.question_text
      }, {
        where: {
          questId: req.params.question_id
        }
    })

    const ques1 = await questions.findAll({
        where: {
            questId: req.params.question_id
        }
    })

    if (ques_categories) {
        
        for (i = 0; i < req.body.categories.length; i++) {
            const existCat = await categories.findOne({
                where: {
                    category: req.body.categories[i].category.toLowerCase()
                }
            })
            if (!existCat) {
                const cat = await categories.create({

                    category: req.body.categories[i].category.toLowerCase()
                })
                await ques1.addCategories(cat)
            }else{
                await ques1.addCategories(existCat)

            }



            
        }
    }

    const ques = await questions.findAll({
        where: {
            questId: ques1.questId
        },
        include: [{
            model: categories,
            as: "categories",
            through: {
                attributes: [],
            }
        }, ],
    }).catch((err) => {
        console.log(">> Error while retrieving questions: ", err);
    });
    res.send(ques[0]);


};
 */

