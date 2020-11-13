# webapp
# a6 demo

# Steps to setup the development enivronment on local machine

      1. Install node js 

            - dnf install node (Redhat Linux, Fedora, CentOs)

            - brew install node (MacOs)
            
            - yum install node (Ubuntu)

      2. Install npm packages 

            - npm install 

      3. run test cases

            - npm run test

# Steps to test api's using POSTMAN

      Install Postman to test the API's

      Download Postman from here - https://www.postman.com/downloads/

      Extract Postman from the zip forlder

      Install mysql for database

      add mysql login credentials for connection with datbase in dbConfig/dbConfig.js file

# Public APIs 

      1. get all questions

           - /v1/questions

      2. get question by id

           - /v1/questions/:question_id

      3. get answer by id by question

           - /v1/question/:question_id/answer/:answer_id

      4. post a user 

           - /v1/user
    
      5. get user info by Id

           - /v1/user/:user_id
   
# Authenticted APIs 

      1. post question

         - /v1/question

      2. post answer of a question

         - /v1/question/:questId/answer

      3. update user record

         - /v1/user/self

      4. get user info 

         - /v1/user/self

      5. delete answer for a question

         - /v1/question/:question_id/answer/:answer_id

      7. update answer of a question

         - /v1/question/:question_id/answer/:answer_id

      8. update question

         - /v1/question/:question_id

      9. attach file to a question

         - /v1/question/:question_id/file

      10. attach file to an answer
      
         - /v1/question/:question_id/answer/:answer_id/file
      
      11. delete attached file from a question
      
         - /v1/question/:question_id/file/:file_id
      
      12. delete attach file to a question's answer
      
         - /v1/question/:question_id/answer/:answer_id/file/:file_id


# CI/CD

      webapp is continously deployed as you merge any changes to the main/master repo in upstream if the

      Infrastructure is already created from this repo https://github.com/shakyav-fall2020/infrastructure

      Infrastructure also has a pre-condition , it will be successfully created only if the AMI is available whivh 

      is triggered from  https://github.com/shakyav-fall2020/ami on push any changes to the AMI upstream


      
      