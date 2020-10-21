const {
  checkSignUp
} = require("../middleware");
const {
  auth
} = require("../middleware");
const controller = require("../controllers/auth.controller");
const quest_controller = require("../controllers/question.controller");
const ans_controller = require("../controllers/answer.controller");
const user_controller = require("../controllers/user.controller");
const verifyUpdateUser = require("../middleware/checkUpdate");
const verifyuser = require("../middleware/authUserDelQues");
const verifyAnsUser = require("../middleware/authUserDelAns");

const upload = require('../appConfig/multer.config.js');

const fileupload = require("../controllers/fileupload.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  // authenticated
  // 1 . post question
  app.post(
    "/v1/question",
    [auth.BasicAuthToken],
    /* [
      checkSignUp.checkDuplicateEmail,
      checkSignUp.checkPassword
    ], */
    /* controller.createQuest */
    quest_controller.createQuestion
  );


  // 2 . post answer of a question
  app.post(
    "/v1/question/:questId/answer",
    [auth.BasicAuthToken],
    /* [
      checkSignUp.checkDuplicateEmail,
      checkSignUp.checkPassword
    ], */
    ans_controller.createAnswer
  );
  // 3 . update user record
  app.put("/v1/user/self", [auth.BasicAuthToken, verifyUpdateUser.checkEmailUpdate, checkSignUp.checkPassword], controller.update_Record);
  // 4. get user info 
  app.get("/v1/user/self", [auth.BasicAuthToken], controller.sign_In);
  // 5. delete answer for a question
  app.delete("/v1/question/:question_id/answer/:answer_id", [auth.BasicAuthToken, verifyAnsUser.checkAuthenticUser], ans_controller.deleteAnswer);
  // 6 . delete question
  app.delete("/v1/question/:question_id", [auth.BasicAuthToken, verifyuser.checkAuthenticUser], quest_controller.deleteQuestion);

  // 7 . update answer of a question
  app.put("/v1/question/:question_id/answer/:answer_id", [auth.BasicAuthToken, verifyAnsUser.checkAuthenticUser], ans_controller.updateAnswer);

  // 8 . update question

  app.put("/v1/question/:question_id", [auth.BasicAuthToken, verifyuser.checkAuthenticUser], quest_controller.updateQuestion_new);



  // public
  // 1 . get all questions
  app.get("/v1/questions", quest_controller.getAllQuestions)
  // 2 . get question by id
  app.get("/v1/questions/:question_id", quest_controller.getQuestionById)
  // 3. get answer by id by question
  app.get("/v1/question/:question_id/answer/:answer_id", ans_controller.getAnswerByIdQuestionById);

  // 4. post a user 
  app.post(
    "/v1/user",
    [
      checkSignUp.checkDuplicateEmail,
      checkSignUp.checkPassword
    ],
    controller.sign_Up
  );

  // 5 . get user info by Id
  app.get("/v1/user/:user_id", controller.getUserById);

  /* app.post("/v1/questions/image",upload.single("file"),fileupload.doUpload); */



  app.post("/v1/question/:question_id/file", [auth.BasicAuthToken], upload.single("file"), fileupload.attachFileWithQuestion);

  app.post("/v1/question/:question_id/answer/:answer_id/file",[auth.BasicAuthToken],upload.single("file"),fileupload.attachFileWithAnswer);
  
  app.delete("/v1/question/:question_id/file/:file_id", [auth.BasicAuthToken], fileupload.deleteFileFromQuestion);
  
  app.delete("/v1/question/:question_id/answer/:answer_id/file/:file_id", [auth.BasicAuthToken], fileupload.deleteFileFromAnswer);



};