module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {

    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
      allowNull: false
      /* validate:{
        noUpdate: true
      } */


    },


    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate : {
        notEmpty: true
      }
    },
    last_name: {
      type: Sequelize.STRING,
      validate : {
        notEmpty: true
      },
      allowNull: false

    },
    email_address: {
      type: Sequelize.STRING,
      validate: {
        isEmail : true,
       
      },
      allowNull: false
      
    },
    password: {
      type: Sequelize.STRING,
      
      validate: {
        is : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        
        
      },
      allowNull: false

    }
  });

  return User;
};