
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


//Attach a File to Question
exports.attachFileWithQuestion = async (req, res) => {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var imageID = uuidv4();

    const file_object = await images.create({
        image_id: imageID,
        image_name: req.file.originalname,
        aws_s3_object_name: imageID + req.params.question_id + req.file.originalname,
        questionQuestId: req.params.question_id,
        user_id: req.user.userId 

    })
   /*  file_object.aws_s3_object_name = file_object.file_id + req.params.question_id + req.file.originalname */
    params.Key = file_object.aws_s3_object_name
    s3Client.upload(params, (err) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        images.findOne({
            where: {
                image_id: file_object.image_id,
            }
        }).then(file => {
            return res.status(201).send({
                file_id: file.image_id,
                aws_s3_object_name: file.aws_s3_object_name,
                file_name: file.image_name,
                created_date: file.createdAt
            });
        });
    });
}


//Attach a File to Answer
exports.attachFileWithAnswer = async (req, res) => {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Body = req.file.buffer;
    var imageID = uuidv4();
    const file_object = await images.create({
        image_id: imageID,
        image_name: req.file.originalname,
        aws_s3_object_name: imageID + req.params.question_id+req.params.answer_id + req.file.originalname,
        questionQuestionId: req.params.question_id,
        user_id: req.user.userId,
        answer_id: req.params.answer_id
    })

    params.Key = file_object.aws_s3_object_name


    await s3Client.upload(params, (err) => {
        if (err) {
            return res.status(500).json({ error: "S3 bucket Error -> " + err });
        }
    });
    //res.json({ message: 'File uploaded successfully!!!' + JSON.stringify(data) + data.Key });
    const file_obj = await images.findOne({
        where: {
            image_id: imageID,
        }
    })
    res.status(201).send({
        file_id: file_obj.image_id,
        s3_object_name: file_obj.aws_s3_object_name,
        file_name: file_obj.image_name,
        created_date: file_obj.createdAt
    });


}


//Delete a file from Question
exports.deleteFileFromQuestion = async (req, res) => {

    images.findByPk(req.params.file_id).then((file) => {
        const params = {
            Bucket: "webappfilestorage",
            Key: file.aws_s3_object_name            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
        };
        console.log("PARAMS:", params)

        await s3Client.deleteObject(params, function (err, file) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                res.json({ message: 'image deleted successfully!!!' }) // successful response
        });

        images.destroy({
            where: {
                file_id: req.params.file_id,
            }
        })
        
    })
}


//Delete a file from Answer
exports.deleteFileFromAnswer = (req, res) => {

    images.findByPk(req.params.file_id).then((file) => {
        const params = {
            Bucket: "webappfilestorage",
            Key: file.s3_object_name            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
        };
        console.log("PARAMS:", params)
        s3Client.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else
                res.json({ message: 'image deleted successfully!!!' }) // successful response
        });
        images.destroy({
            where: {
                file_id: req.params.file_id,
            }
        })
    })
}