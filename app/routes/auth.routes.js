const { checkSignUp } = require("../middleware");
const { auth } =  require("../middleware");
const controller = require("../controllers/auth.controller");
const verifyUpdateUser = require("../middleware/checkUpdate");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/v1/user",
    [
      checkSignUp.checkDuplicateEmail,
      checkSignUp.checkPassword
    ],
    controller.sign_Up
  );

  app.put("/v1/user/self", [auth.BasicAuthToken,verifyUpdateUser.checkEmailUpdate,checkSignUp.checkPassword],controller.update_Record);
 
  app.get("/v1/user/self",[auth.BasicAuthToken], controller.sign_In);


};
