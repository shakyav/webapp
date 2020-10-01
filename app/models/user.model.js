var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {

    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      noUpdate:true

    },


    first_name: {
      type: Sequelize.STRING,
      validate : {
        notEmpty: true
      }
    },
    last_name: {
      type: Sequelize.STRING,
      validate : {
        notEmpty: true
      }

    },
    email_address: {
      type: Sequelize.STRING,
      validate: {
        isEmail : true,
       
      }

    },
    password: {
      type: Sequelize.STRING,
      
      validate: {
        is : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        
        
      }

    }
  });

  return User;
};