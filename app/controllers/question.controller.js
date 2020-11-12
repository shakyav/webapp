/*
   Question Controller - all the Create( create question), update question and get(get all questions, get question by id)
   delete and category create and update caegory for a question , all these operations are  handled by this controller 
*/


const db = require("../models");
const config = require("../appConfig/auth.config");
/* const Metrics = require("../../metrics"); */
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const User = db.user;
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const quest_cat = db.question_categories;
const images = db.images
/* var log4js = require("../logger") */
/* const logger = log4js.getLogger('logs'); */

const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");


const { s3Client } = require("../appConfig/s3.config");
const env = require('../appConfig/s3.env.js');

// 2. public api get all questions with categories and answers related to each question
exports.getAllQuestions = (req, res) => {

Metrics.increment('questions.GET.getAllQuestions');
logger.info("Create Question");
let timer = new Date();
let db_timer = new Date(); 

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
            include:[
                {
                model : images
            }
        ]


        },
        {
            model: images,    
        }

        ]

    }).then((question) => {
        Metrics.timing('questions.GET.dbgetAllQuestions',db_timer)
        if (!question) {

            return res.status(404).send({
                message: "No questions in created."
            });

        }
        res.status(201).send(



            question
        )
        Metrics.timing('questions.GET.getAllQuestions',timer)

    }).catch(err => {
       err
    })
};



// 3. public api get a question by ID
exports.getQuestionById = (req, res) => {

Metrics.increment('questions.GET.getQuestionById');
logger.info("Retrieve Question by Id");
let timer = new Date();
let db_timer = new Date(); 

    /* console.log("i am here") */
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
            include:[
                {
                model : images
            }]


        },
        {
            model: images,


        }

        ]

    }).then((question) => {
        Metrics.timing('questions.GET.dbgetQuestionById',db_timer)

        if (!question) {

            return res.status(404).send({
                message: "question Not found."
            });

        }
        res.status(200).send(



            question
        )
        Metrics.timing('questions.GET.getQuestionById',timer);

    }).catch(err => {
        return err
    })
};



// 6 . authenticated api delete question

exports.deleteQuestion = async(req, res) => {
Metrics.increment('questions.DELETE.deleteQuestion');
logger.info("delete question");
let timer = new Date();
let db_timer = new Date(); 


    const ans = await answers.findOne({
        where: {
            question_id: req.params.question_id,

        }
    }).then(async(answer) => {
        if (!answer) {


            const image_file = await images.findAll({
                where: {
                    questionQuestId : req.params.question_id
                }
            })

            console.log("===========object lenght======="+image_file.length)
            //console.log("===========object lenght======="+image_file[0])



            for(i=0; i<image_file.length;i++){


                console.log("===========Round ======="+i)
                //console.log("===========object lenght======="+image_file[0])
                console.log("===========object lenght======="+image_file[i].image_id)


                const file = await images.findByPk(image_file[i].image_id)
                const params = {

                    Bucket: env.Bucket,
                        Key: file.aws_s3_object_name 

                }
                let s3_timer = new Date();

                s3Client.deleteObject(params, function (err) {
                    if (err) console.log(err, err.stack); // an error occurred
                    /* else
                        res.json({ message: 'image deleted successfully!!!' }) // successful response */
                });
                Metrics.timing('questions.DELETE.s3_file_deleteQuestion',s3_timer);


                
 
        
        
        
            }

            
            
            Metrics.timing('questions.DELETE.dbdeleteQuestion',db_timer);
            questions.destroy({
                where: {
                    questId: req.params.question_id
                }
            })

            




            res.status(204).send({
                message: "Question Deleted Successfully!!"
            });
            Metrics.timing('questions.DELETE.deleteQuestion',timer);
        } else {
            Metrics.timing('questions.DELETE.deleteQuestion',timer);
            return res.status(404).send({
                msg: "Question cannot be Deleted!!"
            });
            
        }
    })
        .catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });
};


// authenticated api create question
// fixed in a4 branch

exports.createQuestion = async (req, res) => {

Metrics.increment('questions.POST.createQuestion');
logger.info("Create question");
let timer = new Date();
let db_timer = new Date(); 

    /* This function recieves the question text and question categories in the request body
    first it checks if the question_text is not empty if is the it returns a massage with status 400
     */
    console.log("text----" + req.body.question_text)
    var question_text = req.body.question_text;
    var ques_categories = req.body.categories;



    if (!question_text) {
        return res.status(400).send({
            Message: "please provide a question_text !"
        });
    }


    const quesdata = {

        user_id: req.user.userId,
        question_text: req.body.question_text,

    };

    /* 
    Then it inserts the question info in question table 
     */
    const question_t = await questions.create(quesdata)
    /* 
    
    if categories are present in the request body
    then it checks if those categories are already existing in categories table if yes then it only
    adds categories to the question object else it inserts a new category categories table and then 
    add the question categories
    
    We have defined the many to many relation ship betweeen the question and category in the ./models/index.js file
    
    */
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
            } else {
                await question_t.addCategories(catExist)

            }




        }
    }
    /*
      it performs a join on the questions and categories table and return the result as the response 
    */

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
        },],
    }).catch((err) => {
        console.log("Error while updating or fethcing the questions: ", err);
    });
    Metrics.timing('questions.POST.dbcreateQuestion',db_timer);
    res.send(ques[0]);
    Metrics.timing('questions.POST.createQuestion',timer);


};



// authenticated api update question and it's categories if provided
// fixed in a5 branch
exports.updateQuestion_new = async (req, res) => {

Metrics.increment('questions.PUT.updateQuestion_new');
logger.info("Update question");
let timer = new Date();


    console.log("text----" + req.body.question_text)
    var question_text = req.body.question_text;
    var ques_categories = req.body.categories;

    if (!question_text) {
        return res.status(400).send({
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
    let db_timer = new Date(); 
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
            } else {
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
        },
        {
            model: answers,
            include:[
                {
                model : images
            }]


        },
        {
            model: images,


        }],
    }).catch((err) => {
        console.log(" Error while updating or fethcing the questions: ", err);
        return res.status(400).send(err)
    });
    Metrics.timing('questions.PUT.dbupdateQuestion_new',db_timer);
    res.send(ques[0]);
    Metrics.timing('questions.PUT.updateQuestion_new',timer);


};