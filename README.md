# webapp

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