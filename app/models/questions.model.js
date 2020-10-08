module.exports = (sequelize, Sequelize) => {
  const questions = sequelize.define("questions", {

    questId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
      
      /* validate:{
        noUpdate: true
      } */

    },
    question_text: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      allowNull: false
    },

      

  });

/*  questions.associate = function(models){
   questions.belongsTo(models.user,{as:'user_id',foreignKey:'userId'})
 }

 questions.associate = function(models){
  questions.belongsToMany(models.category,{as:'categories',foreignKey:'catId'})
}

questions.associate = function(models){
  questions.hasMany(models.answers,{as:'answers',foreignKey:'ansId'})
} */

  return questions;
};