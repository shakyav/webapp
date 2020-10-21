
// Question model to represent the question table in the database

module.exports = (sequelize, Sequelize) => {
  const questions = sequelize.define("questions", {

    questId: {
      type: Sequelize.UUID,             // this generates the unique ID 
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,

    },
    question_text: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      allowNull: false
    },

      

  });
  return questions;
};