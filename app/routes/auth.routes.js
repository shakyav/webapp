const {
  checkSignUp
} = require("../middleware");
const {
  auth
} = require("../middleware");
const controller = require("../controllers/auth.controller");

const verifyUpdateUser = require("../middleware/checkUpdate");
const verifyuser = require("../middleware/authUserDelQues");
const verifyAnsUser = require("../middleware/authUserDelAns");


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
    controller.createQuestion
  );


  // 2 . post answer of a question
  app.post(
    "/v1/question/:questId/answer",
    [auth.BasicAuthToken],
    /* [
      checkSignUp.checkDuplicateEmail,
      checkSignUp.checkPassword
    ], */
    controller.createAnswer
  );
  // 3 . update user record
  app.put("/v1/user/self", [auth.BasicAuthToken, verifyUpdateUser.checkEmailUpdate, checkSignUp.checkPassword], controller.update_Record);
  // 4. get user info 
  app.get("/v1/user/self", [auth.BasicAuthToken], controller.sign_In);
  // 5. delete answer for a question
  app.delete("/v1/question/:question_id/answer/:answer_id", [auth.BasicAuthToken,verifyAnsUser.checkAuthenticUser], controller.deleteAnswer);
  // 6 . delete question
  app.delete("/v1/question/:question_id", [auth.BasicAuthToken,verifyuser.checkAuthenticUser], controller.deleteQuestion);

  // 7 . update answer of a question
  app.put("/v1/question/:question_id/answer/:answer_id", [auth.BasicAuthToken,verifyAnsUser.checkAuthenticUser], controller.updateAnswer);

  // 8 . update question

  app.put("/v1/question/:question_id", [auth.BasicAuthToken,verifyuser.checkAuthenticUser], controller.updateQuestion_new);



  // public
  // 1 . get all questions
  app.get("/v1/questions", controller.getAllQuestions)
  // 2 . get question by id
  app.get("/v1/questions/:question_id", controller.getQuestionById)
  // 3. get answer by id by question
  app.get("/v1/question/:question_id/answer/:answer_id", controller.getAnswerByIdQuestionById);

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
  app.get("/v1/user/:user_id", controller.getUserById)




};