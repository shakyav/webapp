var SDC = require('statsd-client'),
	metrics = new SDC({port: 8125});

     //Counter for User API 
      metrics.increment("User.POST.createUser");
      metrics.increment("User.PUT.updateUser");
      metrics.increment("User.GET.getUserInformation");
      metrics.increment("User.GET.getUserInfo");

      //Counter for Question API 
      metrics.increment("Question.POST.createQuestion");
      metrics.increment("Question.PUT.updateQuestion_new");
      metrics.increment("Question.GET.getAllQuestions");
      metrics.increment("Question.GET.getQuestionById");
      metrics.increment("Question.DELETE.deleteQuestion");

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
      