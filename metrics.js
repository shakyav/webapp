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
      