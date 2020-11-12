var SDC = require('statsd-client');
      metrics = new SDC({port: 8125});

//Counter for User API 
metrics.increment("User.POST.sign_Up");
metrics.increment("User.PUT.update_Record");
metrics.increment("User.GET.sign_In");
metrics.increment("User.GET.getUserById");

      //Counter for Question API 
metrics.increment("questions.POST.createQuestion");
metrics.increment("questions.PUT.updateQuestion_new");
metrics.increment("questions.GET.getAllQuestions");
metrics.increment("questions.GET.getQuestionById");
metrics.increment("questions.DELETE.deleteQuestion");

      //Counter for Answer API 
metrics.increment("Answer.POST.createAnswer");
metrics.increment("Answer.PUT.updateAnswer");
metrics.increment("Answer.GET.getAnswerByIdQuestionById");
metrics.increment("Answer.DELETE.deleteAnswer");

     //Counter for File API 
metrics.increment("Images.POST.attachFileWithQuestion");
metrics.increment("Images.POST.attachFileWithAnswer");
   
metrics.increment("Images.DELETE.deleteFileFromQuestion");
metrics.increment("Images.DELETE.deleteFileFromAnswer");


// ================ timer =================

//Counter for User API 
metrics.timing("User.POST.sign_Up");
metrics.timing("User.PUT.update_Record");
metrics.timing("User.GET.sign_In");
metrics.timing("User.GET.getUserById");

metrics.timing("User.POST.dbsign_Up");
metrics.timing("User.PUT.dbupdate_Record");
metrics.timing("User.GET.dbsign_In");
metrics.timing("User.GET.dbgetUserById");

      //Counter for Question API 
metrics.timing("Question.POST.createQuestion");
metrics.timing("Question.PUT.updateQuestion_new");
metrics.timing("Question.GET.getAllQuestions");
metrics.timing("Question.GET.getQuestionById");
metrics.timing("Question.DELETE.deleteQuestion");

      //Counter for Answer API 
metrics.timing("Answer.POST.createAnswer");
metrics.timing("Answer.PUT.updateAnswer");
metrics.timing("Answer.GET.getAnswerByIdQuestionById");
metrics.timing("Answer.DELETE.deleteAnswer");

     //Counter for File API 
metrics.timing("Images.POST.attachFileWithQuestion");
metrics.timing("Images.POST.attachFileWithAnswer");
   
metrics.timing("Images.DELETE.deleteFileFromQuestion");
metrics.timing("Images.DELETE.deleteFileFromAnswer");

            