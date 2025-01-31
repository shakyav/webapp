
const db = require("../models");
const questions = db.questions;
const answers = db.answers;
const categories = db.categories;
const User = db.user
const question_categories = db.question_categories
const images = db.images
const { v4: uuidv4 } = require('uuid');

var stream = require('stream');
const s3 = require('../appConfig/s3.config');
const { s3Client } = require("../appConfig/s3.config");
const env = require('../appConfig/s3.env.js');
/* const metrics = require("../../metrics"); */
/* var log4js = require("../logger") */
/* const logger = log4js.getLogger('logs'); */
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../../logs")
const logger = log.getLogger('logs');

//Attach a File to Question
exports.attachFileWithQuestion = async (req, res) => {

    Metrics.increment('images.POST.attachFileWithQuestion');
    logger.info("attach image to a question");
    let timer = new Date();

    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var imageID = uuidv4();


    if(!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return res.status(400).send("Only jpg, jpeg,pg format allowed !");
    }
    let db_timer = new Date(); 

    const file_object = await images.create({
        image_id: imageID,
        image_name: req.file.originalname,
        aws_s3_object_name: imageID + req.params.question_id + req.file.originalname,
        questionQuestId: req.params.question_id,
        question_id: req.params.question_id,
        user_id: req.user.userId 

    })
   /*  file_object.aws_s3_object_name = file_object.file_id + req.params.question_id + req.file.originalname */
    params.Key = file_object.aws_s3_object_name
    let s3_timer = new Date();
    s3Client.upload(params, (err) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        images.findOne({
            where: {
                image_id: file_object.image_id,
            }
        }).then(file => {
            Metrics.timing('images.POST.s3attachFileWithQuestion',s3_timer);
            Metrics.timing('images.POST.dbattachFileWithQuestion',db_timer);
            
            res.status(201).send({
                file_id: file.image_id,
                aws_s3_object_name: file.aws_s3_object_name,
                file_name: file.image_name,
                created_date: file.createdAt
            });
            Metrics.timing('images.POST.attachFileWithQuestion',timer);
        });
    });
}


//Attach a File to Answer
exports.attachFileWithAnswer = async (req, res) => {

    Metrics.increment('images.POST.attachFileWithAnswer');
    logger.info("attach image to an answer");
    let timer = new Date();
    
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var imageID = uuidv4();

    if(!req.file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        logger.error('Only jpg, jpeg,pg format allowed !')
        return res.status(400).send("Only jpg, jpeg,pg format allowed !");
    }
    let db_timer = new Date(); 
    const file_object = await images.create({
        image_id: imageID,
        image_name: req.file.originalname,
        aws_s3_object_name: imageID + req.params.question_id+req.params.answer_id + req.file.originalname,
        questionQuestionId: req.params.question_id,
        question_id: req.params.question_id,
        user_id: req.user.userId,
        answer_id: req.params.answer_id,
        answerAnsId: req.params.answer_id

    })

    params.Key = file_object.aws_s3_object_name

    let s3_timer = new Date();
    await s3Client.upload(params, (err) => {
        if (err) {
            logger.error('S3 bucket error')
            return res.status(500).json({ error: "S3 bucket Error -> " + err });
        }
    });
    
    //res.json({ message: 'File uploaded successfully!!!' + JSON.stringify(data) + data.Key });
    const file_obj = await images.findOne({
        where: {
            image_id: imageID,
        }
    })
    Metrics.timing('images.POST.s3attachFileWithAnswer',s3_timer);
    Metrics.timing('images.POST.dbattachFileWithAnswer',db_timer);
    res.status(201).send({
        file_id: file_obj.image_id,
        s3_object_name: file_obj.aws_s3_object_name,
        file_name: file_obj.image_name,
        created_date: file_obj.createdAt
    });
    Metrics.timing('images.POST.attachFileWithAnswer',timer);


}


//Delete a file from Question
exports.deleteFileFromQuestion = async (req, res) => {

    Metrics.increment('images.DELETE.deleteFileFromQuestion');
    logger.info("delete file from a question");
    let timer = new Date();
    let db_timer = new Date(); 

    images.findByPk(req.params.file_id).then((file) => {
        console.log("aws object name "+"========="+file.aws_s3_object_name)
        const params = {
            Bucket: env.Bucket,
            Key: file.aws_s3_object_name            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
        };
        console.log("PARAMS:", params)
        let s3_timer = new Date();

        s3Client.deleteObject(params, function (err, file) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                res.json({ message: 'image deleted successfully!!!' }) // successful response
        });
        Metrics.timing('images.DELETE.s3deleteFileFromQuestion',s3_timer);

        images.destroy({
            where: {
                image_id: req.params.file_id,
            }
        })
        Metrics.timing('images.DELETE.dbdeleteFileFromQuestion',db_timer);
        Metrics.timing('images.DELETE.deleteFileFromQuestion',timer);
        
        
    })
}


//Delete a file from Answer
exports.deleteFileFromAnswer = (req, res) => {

    Metrics.increment("images.DELETE.deleteFileFromAnswer");
    logger.info("delete file from an answer");
    let timer = new Date();
let db_timer = new Date(); 

    images.findByPk(req.params.file_id).then((file) => {
        console.log("aws object name "+"========="+file.aws_s3_object_name)
        const params = {
            Bucket: env.Bucket,
            Key: file.aws_s3_object_name            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
        };
        console.log("PARAMS:", params)
        let s3_timer = new Date();
        s3Client.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                res.json({ message: 'image deleted successfully!!!' }) // successful response
        });
        Metrics.timing('images.DELETE.s3deleteFileFromAnswer',s3_timer);
        images.destroy({
            where: {
                image_id: req.params.file_id,
            }
        })
        Metrics.timing('images.DELETE.dbdeleteFileFromAnswer',db_timer);
        Metrics.timing('images.DELETE.deleteFileFromAnswer',timer);

    })
}