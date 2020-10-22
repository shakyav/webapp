
// Answers model to represent the answers table in the database
const { answers } = require(".");

module.exports = (sequelize, Sequelize) => {
    const answers = sequelize.define("answers", {
  
      ansId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,    
        primaryKey: true,
  
      },

      answer_Text: {
        type: Sequelize.STRING,
        validate : {
          notEmpty: true
        },
        allowNull: false

      }
      

    });
    return answers;
  };