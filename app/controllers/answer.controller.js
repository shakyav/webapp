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

const images = db.images
const { s3Client } = require("../appConfig/s3.config");
const env = require('../appConfig/s3.env.js');
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs")
const logger = log.getLogger('logs');
var AWS = require('aws-sdk');
/* const metrics = require("../../metrics"); */
/* var log4js = require("../logger") */
/* const logger = log4js.getLogger('logs'); */
// 3. authenticated api create answer for a question


exports.createAnswer = (req, res,) => {
    Metrics.increment('answers.POST.createAnswer');
    logger.info("create answer");
    let timer = new Date();
    

    /* 
    checks if answer text is empty then returns a custom message 
     */
    if (!req.body.answer_Text) {
        logger.error('answer text empty')
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
                logger.error('question not found')
                return res.status(400).send({ message: "question not found" })
            }
        })

    }
    /* inserts the  answer object in the answers table and returns the create object as the response */
    let db_timer = new Date(); 
    answers.create({
        answer_Text: req.body.answer_Text,
        question_id: req.params.questId,
        questionQuestId: req.params.questId,
        user_id: req.user.userId
    }).then((answer) => {
        Metrics.timing('answers.POST.dbcreateAnswer',db_timer);

        if (!answer) {

            logger.error('answer not found')
            return res.status(404).send({
                message: "Answer not created"
            });

        }

        logger.info(answer);
        logger.info(req.params.questId);

        questions.findOne({where:{
            questId: req.params.questId,
        }}).then((questn)=>{
            logger.info(questn);
            logger.info(questn.user_id);
            
            User.findOne({
                where:{
                    userId: questn.user_id
                }
            }).then((usr)=>{
                logger.info(usr);
                logger.info(usr.email_address);
                AWS.config.update({
                    region: "us-east-1"
                });
                // Create publish parameters
                var params = {
                    MessageStructure: 'json',
                    Message: JSON.stringify({
                        "default": JSON.stringify({
                            "question_id":req.params.questId,
                            "answer_id": answer.ansId,
                            "answer_text": answer.answer_Text,
                            "email": usr.email_address
                        }),
                    }), /* required */
                  TopicArn: 'arn:aws:sns:us-east-1:485961135038:email_request'
                };     
                var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
                    // Handle promise's fulfilled/rejected states
                    publishTextPromise.then(
                      function(data) {
                        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                        console.log("MessageID is " + data.MessageId);
                        return res.send("Success")
                      }).catch(
                        function(err) {
                        console.error(err, err.stack);
                        logger.info("inside then"+err.stack);
                        return err
                  });           
            })
        })
        
        res.status(201).send({
            answer: answer
        })
        Metrics.timing('answers.POST.createAnswer',timer);
    }).catch((err) => {
        return err
    })
};

// 4. public api get answer by id for a question by id

exports.getAnswerByIdQuestionById = async(req, res) => {

    Metrics.increment("answers.GET.getAnswerByIdQuestionById");
    logger.info("Retrieve answer by id for a question");
    let timer = new Date();
    let db_timer = new Date(); 
    

    /*
     searches for an answer based on the combination of question id and answer id 
     and returns the answer object as the response  
    */

    /* console.log("i am here") */
    await answers.findOne({
        where: {
            question_id: req.params.question_id,
            ansId: req.params.answer_id
        },
        include: [{
            model: images,

                    
        }]
    }).then((answer) => {
        Metrics.timing('answers.GET.dbgetAnswerByIdQuestionById',db_timer);
        if (!answer) {

            logger.error('answer not found')
            return res.status(400).send({
                message: "answer Not found."
            });

        } else {
            questions.findByPk(req.params.question_id, {



            }).then((quest) => {
                if (!quest) {
                    logger.error('question not found')
                    return res.status(400).send({
                        message: "question not found"
                    })
                }
            })
        }
        
        res.status(200).send(

            answer


        )
        Metrics.timing('answers.GET.getAnswerByIdQuestionById',timer);

    }).catch(err => {
        return res.status(400).send(err)
    })
};


// 5. authenticated api delete answer

exports.deleteAnswer = async (req, res) => {


    Metrics.increment("answers.DELETE.deleteAnswer");
    logger.info("delete answer");
    let timer = new Date();
    let db_timer = new Date(); 
    

    const image_file = await images.findAll({
        where: {
            answer_id: req.params.answer_id
        }
    })

    // loop iterates over all the images attached to the question and deletes them one by one

    for (i = 0; i < image_file.length; i++) {


        console.log("===========Round =======" + i)
        //console.log("===========object lenght======="+image_file[0])
        console.log("===========object lenght=======" + image_file[i].image_id)


        const file = await images.findByPk(image_file[i].image_id)
        const params = {

            Bucket: env.Bucket,
            Key: file.aws_s3_object_name

        }
        let s3_timer = new Date();

        s3Client.deleteObject(params, function (err) {
            if (err) console.log(err, err.stack); // an error occurred
               /* return res.status(400).send("S3 Bucket err" + err) */
            /* else
                res.json({ message: 'image deleted successfully!!!' }) // successful response */
        });
        Metrics.timing('answers.DELETE.s3_file_deleteAnswer',s3_timer)

    }
    /*
     searches for an answer based answer id and deletes the answer object 
     returns status as 200 and custom message

     
    */

   Metrics.timing('answers.DELETE.dbdeleteAnswer',db_timer);
    answers.destroy({
        where: {
            ansId: req.params.answer_id
        }
    }).then((answer) => {
        if (!answer) {
            logger.error('answer not found')

            Metrics.timing('answers.DELETE.getAnswerByIdQuestionById',timer);

            return res.status(400).send({
                message: "answer Not found."
            });

        } else {
            
            res.status(200).send({
                message: "Answer Deleted"
            })
            Metrics.timing('answers.DELETE.getAnswerByIdQuestionById',timer);

        }
    }


    ).catch(err => {
            return res.status(400).send({
                message: err.message
            });
        });
};

// 5. authenticated api Update Answer of a question
exports.updateAnswer = (req, res) => {
    Metrics.increment('answers.PUT.updateAnswer');
    logger.info("update answer");
    let timer = new Date();
    let db_timer = new Date(); 


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
                logger.error('answer cannot be updated')
                return res.status(404).send({
                    message: "answer cannot be updated"
                });
            } else {
                Metrics.timing('answers.PUT.dbupdateAnswer',db_timer);
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
        Metrics.timing('answers.PUT.updateAnswer',timer);

    })
        .catch(err => {
            return res.status(400).send({
                message: err.message
            });
        });
};