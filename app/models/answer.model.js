const { answers } = require(".");

module.exports = (sequelize, Sequelize) => {
    const answers = sequelize.define("answers", {
  
      ansId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,    
        primaryKey: true,
        /* validate:{
          noUpdate: true
        } */
  
      },

      answer_Text: {
        type: Sequelize.STRING,
        validate : {
          notEmpty: true
        },
        allowNull: false

      }
      

    });

/*     answers.associate = function(models){
      answer.belongsTo(models.user,{as:'user_id',foreignKey:'userId'})
    }
    answers.associate = function(models){
      answer.belongsTo(models.questions,{as:'question_id',foreignKey:'questId'})
    } */
  
    return answers;
  };