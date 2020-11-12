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
metrics.increment("answers.POST.createAnswer");
metrics.increment("answers.PUT.updateAnswer");
metrics.increment("answers.GET.getAnswerByIdQuestionById");
metrics.increment("answers.DELETE.deleteAnswer");

     //Counter for File API 
metrics.increment("images.POST.attachFileWithQuestion");
metrics.increment("images.POST.attachFileWithAnswer");
   
metrics.increment("images.DELETE.deleteFileFromQuestion");
metrics.increment("images.DELETE.deleteFileFromAnswer");


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
metrics.timing("questions.POST.createQuestion");
metrics.timing("questions.PUT.updateQuestion_new");
metrics.timing("questions.GET.getAllQuestions");
metrics.timing("questions.GET.getQuestionById");
metrics.timing("questions.DELETE.deleteQuestion");

metrics.timing("questions.POST.dbcreateQuestion");
metrics.timing("questions.PUT.dbupdateQuestion_new");
metrics.timing("questions.GET.dbgetAllQuestions");
metrics.timing("questions.GET.dbgetQuestionById");
metrics.timing("questions.DELETE.dbdeleteQuestion");

      //Counter for Answer API 
metrics.timing("answers.POST.createAnswer");
metrics.timing("answers.PUT.updateAnswer");
metrics.timing("answers.GET.getAnswerByIdQuestionById");
metrics.timing("answers.DELETE.deleteAnswer");

metrics.timing("answers.POST.dbcreateAnswer");
metrics.timing("answers.PUT.dbupdateAnswer");
metrics.timing("answers.GET.dbgetAnswerByIdQuestionById");
metrics.timing("answers.DELETE.dbdeleteAnswer");

     //Counter for File API 
metrics.timing("images.POST.attachFileWithQuestion");
metrics.timing("images.POST.attachFileWithAnswer");
   
metrics.timing("images.DELETE.deleteFileFromQuestion");
metrics.timing("images.DELETE.deleteFileFromAnswer");

metrics.timing("images.POST.dbattachFileWithQuestion");
metrics.timing("images.POST.dbattachFileWithAnswer");
   
metrics.timing("images.DELETE.dbdeleteFileFromQuestion");
metrics.timing("images.DELETE.dbdeleteFileFromAnswer");

            